import { BaseProvider } from './base.provider.js';
import { basePrices, catalog, providerPrices } from './mockCatalog.js';
import { delay } from '../utils/helper.js';

const getEtaForPincode = (providerId, pincode, defaultEta) => {
  if (!pincode) return defaultEta;
  const pin = String(pincode).trim();
  if (pin.startsWith('11') || pin.startsWith('12') || pin.startsWith('20')) {
    if (providerId === 'blinkit') return '9 min';
    if (providerId === 'instamart') return '12 min';
    if (providerId === 'bigbasket') return '1 hr';
    if (providerId === 'groceryapi') return '35 min';
  }
  if (pin.startsWith('40')) {
    if (providerId === 'blinkit') return '11 min';
    if (providerId === 'instamart') return '10 min';
    if (providerId === 'bigbasket') return '1.5 hrs';
    if (providerId === 'groceryapi') return '40 min';
  }
  if (pin.startsWith('56')) {
    if (providerId === 'blinkit') return '10 min';
    if (providerId === 'instamart') return '11 min';
    if (providerId === 'bigbasket') return '45 min';
    if (providerId === 'groceryapi') return '30 min';
  }
  return defaultEta;
};

export class MockGroceryProvider extends BaseProvider {
  constructor(config) {
    super(config);
  }

  async searchProducts(query, { pincode } = {}) {
    await delay(80 + Math.random() * 140);
    const normalizedQuery = query.toLowerCase();
    const priceConfig = providerPrices[this.id] || { baseUrl: 'https://www.google.com/search?q=', multipliers: [], eta: '30 min' };
    const deliveryEta = getEtaForPincode(this.id, pincode, priceConfig.eta);

    return catalog
      .map((item, index) => ({ item, index }))
      .filter(({ item }) =>
        [item.name, item.brand, item.category, ...item.keywords].join(' ').toLowerCase().includes(normalizedQuery)
      )
      .map(({ item, index }) => {
        const multiplier = priceConfig.multipliers[index] || 1;
        const price = Math.round(basePrices[index] * multiplier);
        return this.normalize({
          ...item,
          id: `${this.id}-${item.id}`,
          price,
          mrp: Math.round(price * 1.12),
          available: !(this.id === 'instamart' && item.id === 'rice-daawat-5kg'),
          productUrl: `${priceConfig.baseUrl}${encodeURIComponent(item.name)}`,
          deliveryEta,
          pincode: pincode || null
        });
      });
  }
}
