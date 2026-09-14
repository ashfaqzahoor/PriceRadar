/**
 * Open Food Facts Connector Service
 * Queries the Open Food Facts API (India & global database) for authentic product metadata
 * when a user searches for an unlisted or specialty packaged item.
 */

const OFF_SEARCH_API = 'https://world.openfoodfacts.org/cgi/search.pl';

export const openFoodFactsService = {
  /**
   * Search Open Food Facts for packaged goods matching query
   * @param {string} query 
   * @param {number} timeoutMs 
   * @returns {Promise<Array>}
   */
  async search(query, timeoutMs = 2000) {
    const rawQuery = (query || '').trim();
    if (!rawQuery) return [];

    const url = `${OFF_SEARCH_API}?search_terms=${encodeURIComponent(
      rawQuery
    )}&search_simple=1&action=process&json=1&page_size=4`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'PriceRadarGroceryComparison/1.0 (https://priceradar.local; contact@priceradar.local)'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.products) || data.products.length === 0) {
        return [];
      }

      return data.products
        .filter((p) => p.product_name || p.product_name_en)
        .map((p) => {
          const name = p.product_name || p.product_name_en;
          const brand = p.brands || p.brand_owner || 'Packaged Essentials';
          const quantity = p.quantity || p.product_quantity ? `${p.product_quantity || ''} ${p.product_quantity_unit || ''}`.trim() : 'Standard Pack';
          const imageUrl =
            p.image_front_url ||
            p.image_small_url ||
            p.image_url ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80';

          let category = 'Packaged Foods';
          if (p.categories) {
            const catLower = p.categories.toLowerCase();
            if (catLower.includes('beverage') || catLower.includes('tea') || catLower.includes('coffee') || catLower.includes('drink')) category = 'Beverages';
            else if (catLower.includes('dairy') || catLower.includes('cheese') || catLower.includes('yogurt')) category = 'Dairy';
            else if (catLower.includes('snack') || catLower.includes('biscuit') || catLower.includes('chocolate')) category = 'Snacks';
            else if (catLower.includes('sauce') || catLower.includes('spread') || catLower.includes('condiment')) category = 'Condiments';
          }

          // Estimate a realistic baseline MRP based on packaging/weight or fallback
          let estimatedMrp = 150;
          if (quantity.includes('kg') || quantity.includes('Kg')) estimatedMrp = 240;
          else if (quantity.includes('500') || quantity.includes('400')) estimatedMrp = 180;
          else if (quantity.includes('100') || quantity.includes('50')) estimatedMrp = 80;

          return {
            id: `off-${p.code || Math.random().toString(36).substring(2, 9)}`,
            name: `${brand !== 'Packaged Essentials' ? brand + ' ' : ''}${name}`,
            brand: brand.split(',')[0].trim(),
            category,
            quantity,
            imageUrl,
            estimatedPrice: estimatedMrp,
            source: 'open_food_facts'
          };
        });
    } catch (err) {
      // Graceful timeout or network disconnect - don't crash
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  }
};
