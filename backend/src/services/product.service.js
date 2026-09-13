import { searchService } from './search.service.js';
import { catalog } from '../providers/mockCatalog.js';
import { priceHistoryService } from './priceHistory.service.js';

const STORE_DELIVERY_FEES = {
  blinkit: 15,
  instamart: 16,
  bigbasket: 25,
  groceryapi: 30
};

export const productService = {
  async compareProducts(query = '', { sort = 'best', provider = 'all', availableOnly = false, category = '', pincode = null, userId = null } = {}) {
    // If query is blank, use category or default to common popular groceries
    const effectiveQuery = query.trim() || category.trim() || 'milk';
    const result = await searchService.search(effectiveQuery, { userId, pincode });

    let items = result.items.map((item) => ({
      ...item,
      offers: item.offers.map((offer) => ({
        ...offer,
        deliveryFee: STORE_DELIVERY_FEES[offer.provider] || 20,
        landedPrice: offer.price + (STORE_DELIVERY_FEES[offer.provider] || 20)
      })).filter((offer) => {
        const providerMatch = provider === 'all' || offer.provider === provider;
        const availabilityMatch = !availableOnly || offer.available;
        return providerMatch && availabilityMatch;
      })
    }));

    if (category && category !== 'All') {
      items = items.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
    }

    items = items.filter((item) => item.offers.length > 0);

    if (sort === 'price_desc') {
      items.sort((a, b) => (b.bestOffer?.price || 0) - (a.bestOffer?.price || 0));
    } else if (sort === 'unit_price') {
      items.sort((a, b) => (a.unitPrice || Infinity) - (b.unitPrice || Infinity));
    } else if (sort === 'savings') {
      items.sort((a, b) => (b.priceSpread || 0) - (a.priceSpread || 0));
    } else if (sort === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: best price first
      items.sort((a, b) => (a.bestOffer?.price || Infinity) - (b.bestOffer?.price || Infinity));
    }

    return { ...result, items };
  },

  async getProductDetails(productKey, { pincode = null } = {}) {
    // Look up productKey by querying its keywords/name
    const slugParts = productKey.replace(/^[a-z0-9]+-/, '').replace(/-/g, ' ');
    const searchResult = await searchService.search(slugParts, { pincode });
    
    let product = searchResult.items.find((item) => item.productKey === productKey);
    if (!product && searchResult.items.length > 0) {
      product = searchResult.items[0];
    }

    if (!product) {
      // Fallback lookup in mockCatalog
      const fallbackItem = catalog.find((c) => c.id === productKey || productKey.includes(c.id));
      if (fallbackItem) {
        const directSearch = await searchService.search(fallbackItem.name, { pincode });
        product = directSearch.items[0];
      }
    }

    if (!product) return null;

    // Attach landed costs & delivery fees
    const offersWithLanded = product.offers.map((offer) => {
      const deliveryFee = STORE_DELIVERY_FEES[offer.provider] || 20;
      return {
        ...offer,
        deliveryFee,
        landedPrice: offer.price + deliveryFee
      };
    });

    // Retrieve historical price analytics & timeline
    const { timeline, stats } = await priceHistoryService.getHistory(product.productKey, offersWithLanded, 30);

    // Save snapshot in background
    priceHistoryService.recordSnapshots(product.productKey, offersWithLanded).catch(() => {});

    // Fetch up to 4 similar products in same category
    let similarProducts = [];
    try {
      const categoryQuery = product.category || product.name.split(' ')[0];
      const categoryResult = await searchService.search(categoryQuery, { pincode });
      similarProducts = categoryResult.items
        .filter((item) => item.productKey !== product.productKey)
        .slice(0, 4);
    } catch {
      // ignore
    }

    return {
      ...product,
      offers: offersWithLanded,
      priceHistory: timeline,
      priceStats: stats,
      similarProducts
    };
  }
};

