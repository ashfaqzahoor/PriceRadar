import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Price } from '../models/Price.js';
import { slugify } from '../utils/helper.js';
import { logger } from '../config/logger.js';

export const productRepository = {
  async upsertCanonicalProduct(product) {
    const slug = product.slug || slugify(`${product.brand || 'generic'}-${product.name}-${product.quantity || ''}`);
    return Product.findOneAndUpdate(
      { slug },
      {
        canonicalName: product.name,
        slug,
        brand: product.brand,
        category: product.category,
        quantity: product.quantity,
        imageUrl: product.imageUrl,
        keywords: product.keywords || []
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },

  async upsertPrice(productId, offer) {
    return Price.findOneAndUpdate(
      { provider: offer.provider, providerProductId: offer.providerProductId },
      {
        product: productId,
        provider: offer.provider,
        providerProductId: offer.providerProductId,
        price: offer.price,
        mrp: offer.mrp,
        currency: offer.currency || 'INR',
        available: offer.available,
        productUrl: offer.productUrl,
        imageUrl: offer.imageUrl,
        lastFetchedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },

  async syncComparisonResults(comparisons) {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) return;
    try {
      for (const item of comparisons) {
        const canonical = await this.upsertCanonicalProduct({
          name: item.name,
          brand: item.brand,
          category: item.category,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          slug: item.productKey
        });

        if (canonical?._id && Array.isArray(item.offers)) {
          await Promise.allSettled(
            item.offers.map((offer) => this.upsertPrice(canonical._id, offer))
          );
        }
      }
    } catch (err) {
      logger.debug(`MongoDB sync skipped: ${err.message}`);
    }
  },

  search: (query, limit = 8) =>
    Product.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
};

