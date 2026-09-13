const tokenize = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

export const parseQuantity = (quantityStr) => {
  if (!quantityStr) return null;
  const raw = String(quantityStr).trim().toLowerCase();

  // Weight patterns: kg, g, gm, grams
  const kgMatch = raw.match(/^([\d.]+)\s*(kg|kilo|kilogram)s?$/);
  if (kgMatch) return { type: 'weight', baseValue: parseFloat(kgMatch[1]) * 1000, baseUnit: 'g' };

  const gMatch = raw.match(/^([\d.]+)\s*(g|gm|gram)s?$/);
  if (gMatch) return { type: 'weight', baseValue: parseFloat(gMatch[1]), baseUnit: 'g' };

  // Volume patterns: l, ltr, liter, litre, ml
  const lMatch = raw.match(/^([\d.]+)\s*(l|ltr|liter|litre)s?$/);
  if (lMatch) return { type: 'volume', baseValue: parseFloat(lMatch[1]) * 1000, baseUnit: 'ml' };

  const mlMatch = raw.match(/^([\d.]+)\s*(ml|milliliter)s?$/);
  if (mlMatch) return { type: 'volume', baseValue: parseFloat(mlMatch[1]), baseUnit: 'ml' };

  // Count / pieces
  const pcMatch = raw.match(/^([\d.]+)\s*(pc|pcs|piece|pieces|pack|packs)$/);
  if (pcMatch) return { type: 'count', baseValue: parseFloat(pcMatch[1]), baseUnit: 'pc' };

  return null;
};

export const areQuantitiesCompatible = (qtyA, qtyB) => {
  const parsedA = parseQuantity(qtyA);
  const parsedB = parseQuantity(qtyB);

  if (parsedA && parsedB) {
    if (parsedA.type !== parsedB.type) return false;
    // Allow maximum 5% tolerance for slight packaging differences
    const ratio = parsedA.baseValue / parsedB.baseValue;
    return ratio >= 0.95 && ratio <= 1.05;
  }

  // Fallback to normalized string equality if not parseable
  if (qtyA && qtyB) {
    return qtyA.trim().toLowerCase() === qtyB.trim().toLowerCase();
  }

  return true;
};

export const similarityScore = (left, right) => {
  const leftTokens = new Set(tokenize(left));
  const rightTokens = new Set(tokenize(right));
  if (!leftTokens.size || !rightTokens.size) return 0;

  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return intersection / union;
};

export const isSimilarProduct = (left, right, threshold = 0.70) => {
  // Strict Category Check
  if (left.category && right.category) {
    if (left.category.toLowerCase() !== right.category.toLowerCase()) {
      return false;
    }
  }

  // Strict Brand Check
  if (left.brand && right.brand) {
    const brandA = left.brand.trim().toLowerCase();
    const brandB = right.brand.trim().toLowerCase();
    if (brandA !== 'generic' && brandB !== 'generic' && brandA !== brandB) {
      return false;
    }
  }

  // Quantity / Pack Size Compatibility
  if (!areQuantitiesCompatible(left.quantity, right.quantity)) {
    return false;
  }

  // Core Name Similarity (strip brand and quantity tokens to avoid artificial inflation)
  const stripNoise = (name, brand, qty) => {
    let result = (name || '').toLowerCase();
    if (brand) result = result.replace(new RegExp(`\\b${brand.toLowerCase()}\\b`, 'g'), '');
    if (qty) result = result.replace(new RegExp(`\\b${qty.toLowerCase()}\\b`, 'g'), '');
    return result.trim();
  };

  const coreLeft = stripNoise(left.name, left.brand, left.quantity);
  const coreRight = stripNoise(right.name, right.brand, right.quantity);

  if (coreLeft === coreRight && coreLeft.length > 0) return true;

  return similarityScore(coreLeft, coreRight) >= threshold;
};
