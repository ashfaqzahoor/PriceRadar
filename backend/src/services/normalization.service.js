import { slugify } from '../utils/helper.js';
import { parseQuantity } from '../utils/fuzzyMatch.js';

export const normalizationService = {
  normalizeOffer(offer) {
    const parsedQty = parseQuantity(offer.quantity);
    let unitPrice = null;
    let unitMetric = null;
    let unitPriceFormatted = null;

    if (parsedQty && parsedQty.baseValue > 0 && offer.price > 0) {
      if (parsedQty.type === 'weight') {
        if (parsedQty.baseValue >= 1000) {
          unitPrice = Math.round((offer.price / (parsedQty.baseValue / 1000)) * 10) / 10;
          unitMetric = 'kg';
          unitPriceFormatted = `₹${unitPrice}/kg`;
        } else {
          unitPrice = Math.round((offer.price / (parsedQty.baseValue / 100)) * 10) / 10;
          unitMetric = '100g';
          unitPriceFormatted = `₹${unitPrice}/100g`;
        }
      } else if (parsedQty.type === 'volume') {
        if (parsedQty.baseValue >= 1000) {
          unitPrice = Math.round((offer.price / (parsedQty.baseValue / 1000)) * 10) / 10;
          unitMetric = 'L';
          unitPriceFormatted = `₹${unitPrice}/L`;
        } else {
          unitPrice = Math.round((offer.price / (parsedQty.baseValue / 100)) * 10) / 10;
          unitMetric = '100ml';
          unitPriceFormatted = `₹${unitPrice}/100ml`;
        }
      } else if (parsedQty.type === 'count') {
        unitPrice = Math.round((offer.price / parsedQty.baseValue) * 10) / 10;
        unitMetric = 'pc';
        unitPriceFormatted = `₹${unitPrice}/pc`;
      }
    }

    return {
      ...offer,
      productKey: slugify(`${offer.brand || 'generic'}-${offer.name}-${offer.quantity || ''}`),
      discountPercent: offer.mrp ? Math.max(0, Math.round(((offer.mrp - offer.price) / offer.mrp) * 100)) : 0,
      unitPrice,
      unitMetric,
      unitPriceFormatted
    };
  }
};
