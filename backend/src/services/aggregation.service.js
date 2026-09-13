import { isSimilarProduct } from '../utils/fuzzyMatch.js';
import { normalizationService } from './normalization.service.js';

const groupOffers = (offers) => {
  const groups = [];

  for (const offer of offers.map(normalizationService.normalizeOffer)) {
    const group = groups.find((candidate) => isSimilarProduct(candidate.reference, offer));
    if (group) {
      group.offers.push(offer);
      continue;
    }

    groups.push({
      productKey: offer.productKey,
      reference: offer,
      offers: [offer]
    });
  }

  return groups;
};

export const aggregationService = {
  buildComparison(offers) {
    return groupOffers(offers).map((group) => {
      const sortedOffers = group.offers.sort((a, b) => a.price - b.price);
      const availableOffers = sortedOffers.filter((offer) => offer.available);
      const bestOffer = availableOffers[0] || null;

      const highestOffer = availableOffers.length > 1 ? availableOffers[availableOffers.length - 1] : null;
      const priceSpread = bestOffer && highestOffer ? Math.max(0, highestOffer.price - bestOffer.price) : 0;
      const savingsPercent = highestOffer && priceSpread > 0 ? Math.round((priceSpread / highestOffer.price) * 100) : 0;

      return {
        productKey: group.productKey,
        name: group.reference.name,
        brand: group.reference.brand,
        category: group.reference.category,
        quantity: group.reference.quantity,
        imageUrl: group.reference.imageUrl,
        unitPrice: bestOffer?.unitPrice || group.reference.unitPrice,
        unitMetric: bestOffer?.unitMetric || group.reference.unitMetric,
        unitPriceFormatted: bestOffer?.unitPriceFormatted || group.reference.unitPriceFormatted,
        priceSpread,
        savingsPercent,
        storesCount: group.offers.length,
        availableStoresCount: availableOffers.length,
        bestOffer,
        offers: sortedOffers
      };
    });
  }
};
