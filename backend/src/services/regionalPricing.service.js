/**
 * Regional Pricing and Location Multiplier Service
 * Applies realistic geographic mandi rates and store delivery spreads based on Indian PIN codes.
 */

export const regionalPricingService = {
  /**
   * Determine region profile from Indian 6-digit PIN code
   * @param {string|number} pincode 
   * @returns {{ region: string, produceMultiplier: number, brandSpread: number, defaultEta: string }}
   */
  getRegionProfile(pincode) {
    if (!pincode) {
      return { region: 'General Metro', produceMultiplier: 1.0, brandSpread: 1.0, defaultEta: '12 min' };
    }

    const pin = String(pincode).trim();

    // South / Hyderabad / Bengaluru / Chennai (50, 56, 60)
    if (pin.startsWith('50') || pin.startsWith('56') || pin.startsWith('60')) {
      return {
        region: pin.startsWith('50') ? 'Hyderabad (Telangana)' : 'Bengaluru / Chennai',
        produceMultiplier: 1.0,
        brandSpread: 1.0,
        defaultEta: '10 min'
      };
    }

    // North (Delhi NCR / Haryana / Kashmir / Punjab: 11, 12, 14, 19, 20)
    if (pin.startsWith('11') || pin.startsWith('12') || pin.startsWith('14') || pin.startsWith('19') || pin.startsWith('20')) {
      return {
        region: 'North (Delhi / NCR / J&K)',
        produceMultiplier: pin.startsWith('19') ? 0.65 : 0.95,
        brandSpread: 1.0,
        defaultEta: '9 min'
      };
    }

    // West (Mumbai / Pune / Gujarat: 40, 41, 38)
    if (pin.startsWith('40') || pin.startsWith('41') || pin.startsWith('38')) {
      return {
        region: 'West (Mumbai / Pune)',
        produceMultiplier: 1.05,
        brandSpread: 1.0,
        defaultEta: '11 min'
      };
    }

    // Default pan-India metro
    return { region: 'National Metro', produceMultiplier: 1.0, brandSpread: 1.0, defaultEta: '15 min' };
  },

  /**
   * Compute multi-store pricing for a synthesized or external item
   * @param {number} basePrice 
   * @param {string} category 
   * @param {string|number} pincode 
   * @returns {{ blinkit: number, instamart: number, bigbasket: number }}
   */
  calculateStorePrices(basePrice, category = '', pincode = null) {
    const profile = this.getRegionProfile(pincode);
    const isPerishable = ['Fruits & Vegetables', 'Produce', 'Dairy'].includes(category);
    const regionalBase = isPerishable ? Math.round(basePrice * profile.produceMultiplier) : basePrice;

    return {
      blinkit: Math.max(10, Math.round(regionalBase * 0.98)),
      instamart: Math.max(10, Math.round(regionalBase * 1.01)),
      bigbasket: Math.max(10, Math.round(regionalBase * 0.95))
    };
  },

  /**
   * Builds permanent, reliable store URLs that don't trigger Cloudflare bot challenge blocks.
   * Uses clean query paths and fallback search routing.
   */
  getStoreUrls(productName) {
    const encoded = encodeURIComponent(productName);
    return {
      blinkit: `https://blinkit.com/s/?q=${encoded}`,
      // Use clean Swiggy Instamart root / search query without referral token triggers
      instamart: `https://www.swiggy.com/instamart?search=${encoded}`,
      bigbasket: `https://www.bigbasket.com/ps/?q=${encoded}`
    };
  }
};
