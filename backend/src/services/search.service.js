import { SearchHistory } from '../models/SearchHistory.js';
import { catalog } from '../providers/mockCatalog.js';
import { providers } from '../providers/index.js';
import { aggregationService } from './aggregation.service.js';
import { cacheService } from './cache.service.js';
import { productRepository } from '../repositories/product.repository.js';

const cacheKey = (query, pincode) => `search:${query.toLowerCase().trim()}:${pincode || 'all'}`;

export const searchService = {
  async search(query, { userId = null, pincode = null } = {}) {
    const normalizedQuery = (query || '').trim();
    const activeKey = cacheKey(normalizedQuery, pincode);
    const cached = await cacheService.get(activeKey);

    if (cached) {
      if (userId && normalizedQuery) await this.recordHistory(userId, normalizedQuery, cached.length);
      return { items: cached, cache: 'hit', pincode };
    }

    const providerResults = await Promise.allSettled(
      providers.map((provider) => provider.searchProducts(normalizedQuery, { pincode }))
    );

    const offers = providerResults.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
    const comparisons = aggregationService.buildComparison(offers);

    await cacheService.set(activeKey, comparisons);
    if (userId && normalizedQuery) await this.recordHistory(userId, normalizedQuery, comparisons.length);

    // Asynchronously sync canonical products and prices with MongoDB
    productRepository.syncComparisonResults(comparisons).catch(() => {});

    return { items: comparisons, cache: 'miss', pincode };
  },

  suggestions(query) {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    return catalog
      .filter((item) => [item.name, item.brand, item.category, ...item.keywords].join(' ').toLowerCase().includes(normalizedQuery))
      .slice(0, 6)
      .map((item) => ({
        label: item.name,
        brand: item.brand,
        category: item.category,
        imageUrl: item.imageUrl
      }));
  },

  recordHistory(userId, query, resultCount) {
    return SearchHistory.create({ user: userId, query, resultCount });
  },

  history(userId) {
    return SearchHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
  }
};
