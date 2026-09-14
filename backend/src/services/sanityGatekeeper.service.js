/**
 * Sanity and Domain Gatekeeper Service
 * Ensures queries fall strictly within consumer grocery, supermarket, household, personal care, and pet care domains.
 * Rejects weapons, adult terms, narcotics/vaping, industrial machinery, hazardous items.
 */

// Stems and blocked patterns
const NON_GROCERY_TERMS = [
  'missile',
  'missiles',
  'torpedo',
  'nuclear',
  'bomb',
  'bombs',
  'warhead',
  'tank',
  'tanks',
  'fighter jet',
  'submarine',
  'submarines',
  'weapon',
  'weapons',
  'gun',
  'guns',
  'handgun',
  'rifle',
  'rifles',
  'ammunition',
  'bullet',
  'bullets',
  'grenade',
  'grenades',
  'explosive',
  'explosives',
  // Vaping, narcotics, tobacco restrictions
  'vape',
  'vapes',
  'vaping',
  'e-cigarette',
  'ecigarette',
  'pod',
  'nicotine',
  'weed',
  'marijuana',
  // Adult / non-retail queries
  'lust',
  'porn',
  'sex',
  'escort',
  'gambling',
  'casino',
  // Industrial / automotive machinery
  'car engine',
  'exhaust pipe',
  'cement mixer',
  'bulldozer',
  'crane',
  'cryptocurrency',
  'bitcoin'
];

// Exceptions that are genuine household/party products
const ALLOWED_EXCEPTIONS = [
  'toy gun',
  'water gun',
  'hot glue gun',
  'glue gun',
  'bath bomb',
  'bath bombs',
  'fish tank',
  'tank top',
  'tide pods',
  'detergent pods',
  'coffee pods'
];

export const sanityGatekeeper = {
  evaluate(query = '') {
    const raw = query.trim().toLowerCase();
    if (!raw) {
      return { isAllowed: true, sanitizedQuery: '' };
    }

    // Check if query matches allowed household exceptions first
    const isException = ALLOWED_EXCEPTIONS.some((exc) => raw.includes(exc));
    if (isException) {
      return { isAllowed: true, sanitizedQuery: raw };
    }

    // Check for prohibited non-grocery terms with word boundaries
    for (const term of NON_GROCERY_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(raw)) {
        return {
          isAllowed: false,
          reason: `No grocery or supermarket items found for "${query}". PriceRadar only indexes food, beverages, household, and personal care products.`
        };
      }
    }

    return { isAllowed: true, sanitizedQuery: raw };
  }
};
