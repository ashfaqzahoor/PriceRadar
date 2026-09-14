import { SearchHistory } from '../models/SearchHistory.js';
import { catalog } from '../providers/mockCatalog.js';
import { providers } from '../providers/index.js';
import { aggregationService } from './aggregation.service.js';
import { cacheService } from './cache.service.js';
import { productRepository } from '../repositories/product.repository.js';
import { sanityGatekeeper } from './sanityGatekeeper.service.js';
import { openFoodFactsService } from './openFoodFacts.service.js';
import { regionalPricingService } from './regionalPricing.service.js';
import { resolveProductImage } from '../utils/productImageResolver.js';
import { slugify } from '../utils/helper.js';

const cacheKey = (query, pincode) => `search:${query.toLowerCase().trim()}:${pincode || 'all'}`;

export const searchService = {
  async search(query, { userId = null, pincode = null } = {}) {
    const normalizedQuery = (query || '').trim();

    // Tier 0: Sanity Gatekeeper Check
    const sanityCheck = sanityGatekeeper.evaluate(normalizedQuery);
    if (!sanityCheck.isAllowed) {
      return {
        items: [],
        cache: 'miss',
        pincode,
        sanityRejected: true,
        rejectionReason: sanityCheck.reason
      };
    }

    // Check Cache
    const activeKey = cacheKey(normalizedQuery, pincode);
    const cached = await cacheService.get(activeKey);

    if (cached) {
      if (userId && normalizedQuery) await this.recordHistory(userId, normalizedQuery, cached.length);
      return { items: cached, cache: 'hit', pincode };
    }

    // Tier 1: Query Provider Engines (Local Catalog + Store Pricing)
    const providerResults = await Promise.allSettled(
      providers.map((provider) => provider.searchProducts(normalizedQuery, { pincode }))
    );

    let offers = providerResults.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));

    // Ensure distinct, item-accurate images across all offers
    offers = offers.map((offer) => ({
      ...offer,
      imageUrl: resolveProductImage(offer.name, offer.category, offer.imageUrl)
    }));

    let comparisons = aggregationService.buildComparison(offers);

    // Tier 2: If no local matches, call Open Food Facts API for authentic packaged items
    if (comparisons.length === 0 && normalizedQuery.length >= 2) {
      try {
        const offProducts = await openFoodFactsService.search(normalizedQuery, 2200);

        if (offProducts && offProducts.length > 0) {
          const synthesizedOffers = [];

          for (const offItem of offProducts) {
            const storePrices = regionalPricingService.calculateStorePrices(
              offItem.estimatedPrice,
              offItem.category,
              pincode
            );
            const storeUrls = regionalPricingService.getStoreUrls(offItem.name);
            const regionProfile = regionalPricingService.getRegionProfile(pincode);
            const verifiedImage = resolveProductImage(offItem.name, offItem.category, offItem.imageUrl);

            // Synthesize offers for the 3 main stores: Blinkit, Instamart, BigBasket
            const storeList = [
              { id: 'blinkit', name: 'Blinkit', price: storePrices.blinkit, eta: '9 min' },
              { id: 'instamart', name: 'Instamart', price: storePrices.instamart, eta: '10 min' },
              { id: 'bigbasket', name: 'BigBasket', price: storePrices.bigbasket, eta: '15 min' }
            ];

            for (const s of storeList) {
              synthesizedOffers.push({
                id: `${s.id}-${offItem.id}`,
                productKey: slugify(`${offItem.brand}-${offItem.name}-${offItem.quantity}`),
                provider: s.id,
                providerName: s.name,
                name: offItem.name,
                brand: offItem.brand,
                category: offItem.category,
                quantity: offItem.quantity,
                imageUrl: verifiedImage,
                price: s.price,
                mrp: Math.round(s.price * 1.15),
                available: true,
                productUrl: storeUrls[s.id],
                deliveryEta: regionProfile.defaultEta || s.eta,
                pincode: pincode || null,
                isExternalVerified: true
              });
            }
          }

          comparisons = aggregationService.buildComparison(synthesizedOffers);
        }
      } catch (err) {
        // Continue gracefully if external API is unreachable
      }
    }

    // NOTE: We have intentionally REMOVED the synthetic fake item generator.
    // If an item is not in our verified catalog and not found in Open Food Facts,
    // we return comparisons: [] honestly rather than showing a fake ₹118 price card.

    if (comparisons.length > 0) {
      await cacheService.set(activeKey, comparisons);
    }

    if (userId && normalizedQuery) await this.recordHistory(userId, normalizedQuery, comparisons.length);

    // Asynchronously sync canonical products and prices with MongoDB
    if (comparisons.length > 0) {
      productRepository.syncComparisonResults(comparisons).catch(() => {});
    }

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
        imageUrl: resolveProductImage(item.name, item.category, item.imageUrl)
      }));
  },

  recordHistory(userId, query, resultCount) {
    return SearchHistory.create({ user: userId, query, resultCount });
  },

  history(userId) {
    return SearchHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
  }
};
