/**
 * Smart Product Image Mapper
 * Maps product name and category to authentic, high-quality, product-specific Unsplash photos.
 * Ensures that tea, coffee, soya chunks, eggs, chicken, paneer, oil, atta, etc.
 * each get distinct, realistic product photography instead of a generic basket placeholder.
 */

const CATEGORY_IMAGE_MAP = [
  // Soya / Chunks / Plant Protein
  {
    keywords: ['soya', 'nutrela', 'chunks', 'soybean', 'tofu'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'
  },
  // Eggs
  {
    keywords: ['egg', 'eggs', 'keggs', 'poultry'],
    url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=500&q=80'
  },
  // Meat / Chicken / Licious
  {
    keywords: ['chicken', 'licious', 'meat', 'curry cut', 'mutton', 'fish', 'prawn'],
    url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80'
  },
  // Milk / Dairy
  {
    keywords: ['milk', 'taaza', 'toned', 'amul gold', 'full cream', 'cow milk'],
    url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80'
  },
  // Curd / Dahi / Yogurt
  {
    keywords: ['curd', 'dahi', 'yogurt', 'masti', 'greek yogurt', 'epigamia'],
    url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80'
  },
  // Butter / Cheese / Paneer
  {
    keywords: ['butter', 'makhan', 'amul butter'],
    url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80'
  },
  {
    keywords: ['paneer', 'cottage cheese'],
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=80'
  },
  {
    keywords: ['cheese', 'cheddar', 'mozzarella', 'cheese slices'],
    url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=500&q=80'
  },
  // Bread / Bakery
  {
    keywords: ['bread', 'brown bread', 'white bread', 'pav', 'bun', 'croissant'],
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80'
  },
  // Atta / Flour
  {
    keywords: ['atta', 'flour', 'aashirvaad', 'chakki', 'maida', 'besan', 'sooji'],
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80'
  },
  // Rice / Basmati
  {
    keywords: ['rice', 'basmati', 'daawat', 'india gate', 'sona masoori', 'kolam'],
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80'
  },
  // Dal / Pulses / Lentils
  {
    keywords: ['dal', 'toor', 'moong', 'chana', 'rajma', 'lentils', 'urad'],
    url: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=500&q=80'
  },
  // Cooking Oil / Ghee
  {
    keywords: ['oil', 'mustard oil', 'sunflower', 'fortune', 'refined oil', 'groundnut oil', 'olive oil'],
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80'
  },
  {
    keywords: ['ghee', 'amul ghee', 'cow ghee', 'desi ghee'],
    url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80'
  },
  // Tea / Chai
  {
    keywords: ['tea', 'chai', 'taj mahal', 'tata tea', 'red label', 'green tea'],
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80'
  },
  // Coffee
  {
    keywords: ['coffee', 'nescafe', 'bru', 'roast', 'espresso'],
    url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=80'
  },
  // Noodles / Pasta / Maggi
  {
    keywords: ['maggi', 'noodles', 'pasta', 'yippee', 'ramen', 'spaghetti'],
    url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80'
  },
  // Biscuits / Cookies
  {
    keywords: ['biscuit', 'biscuits', 'cookie', 'cookies', 'parle', 'oreo', 'bourbon', 'good day'],
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80'
  },
  // Chips / Snacks
  {
    keywords: ['chips', 'lays', 'kurkure', 'snack', 'snacks', 'namkeen', 'bhujia', 'haldiram'],
    url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80'
  },
  // Chocolates / Sweets
  {
    keywords: ['chocolate', 'chocolates', 'cadbury', 'dairy milk', 'kitkat', 'snickers'],
    url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=80'
  },
  // Spices / Masalas
  {
    keywords: ['turmeric', 'haldi', 'mirch', 'chilli', 'masala', 'jeera', 'spices', 'salt', 'sugar'],
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80'
  },
  // Fresh Fruits
  {
    keywords: ['apple', 'banana', 'orange', 'mango', 'fruits', 'fruit', 'grapes', 'papaya'],
    url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=500&q=80'
  },
  // Fresh Vegetables
  {
    keywords: ['potato', 'onion', 'tomato', 'vegetables', 'veggie', 'spinach', 'ginger', 'garlic'],
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80'
  },
  // Cleaning / Household
  {
    keywords: ['detergent', 'surf excel', 'ariel', 'vim', 'dishwash', 'harpic', 'cleaning', 'lizol'],
    url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=500&q=80'
  },
  // Personal Care / Soap / Shampoo
  {
    keywords: ['soap', 'shampoo', 'toothpaste', 'dettol', 'dove', 'colgate', 'face wash'],
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80'
  }
];

const DEFAULT_GROCERY_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80';

export function resolveProductImage(productName = '', category = '', existingImageUrl = null) {
  // If there's an existing verified image from Open Food Facts or a custom product image, keep it
  if (existingImageUrl && !existingImageUrl.includes('photo-1542838132-92c53300491e')) {
    return existingImageUrl;
  }

  const combined = `${productName} ${category}`.toLowerCase();

  for (const entry of CATEGORY_IMAGE_MAP) {
    if (entry.keywords.some((kw) => combined.includes(kw))) {
      return entry.url;
    }
  }

  return DEFAULT_GROCERY_IMAGE;
}
