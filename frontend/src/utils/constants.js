export const PROVIDERS = [
  { id: 'all', label: 'All Stores' },
  { id: 'blinkit', label: 'Blinkit' },
  { id: 'instamart', label: 'Instamart' },
  { id: 'bigbasket', label: 'BigBasket' },
  { id: 'groceryapi', label: 'Grocery API' }
];

export const SORT_OPTIONS = [
  { id: 'best', label: 'Lowest Price' },
  { id: 'unit_price', label: 'Lowest Unit Price (₹/100g)' },
  { id: 'savings', label: 'Biggest Price Spread' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'name', label: 'Name (A to Z)' }
];

export const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: 'Sparkles', color: 'from-emerald-500 to-teal-600' },
  { id: 'Dairy', label: 'Dairy & Eggs', icon: 'Milk', color: 'from-blue-500 to-indigo-600' },
  { id: 'Bakery', label: 'Bakery & Bread', icon: 'Wheat', color: 'from-amber-500 to-orange-600' },
  { id: 'Staples', label: 'Atta, Rice & Dal', icon: 'Package', color: 'from-yellow-500 to-amber-600' },
  { id: 'Cooking Oil', label: 'Cooking Oils & Ghee', icon: 'Droplet', color: 'from-emerald-500 to-green-600' },
  { id: 'Protein', label: 'Meat & Protein', icon: 'Flame', color: 'from-rose-500 to-red-600' },
  { id: 'Personal Care', label: 'Personal Care', icon: 'Heart', color: 'from-purple-500 to-pink-600' }
];

export const POPULAR_LOCATIONS = [
  { pincode: '110001', city: 'Delhi NCR', area: 'Connaught Place / Central', eta: '9 min', lat: 28.6315, lon: 77.2167, hubCode: 'DEL_CENTRAL_01' },
  { pincode: '400001', city: 'Mumbai', area: 'Fort / South Mumbai', eta: '10 min', lat: 18.9388, lon: 72.8354, hubCode: 'BOM_SOUTH_02' },
  { pincode: '560001', city: 'Bengaluru', area: 'MG Road / Indiranagar', eta: '10 min', lat: 12.9756, lon: 77.6066, hubCode: 'BLR_EAST_04' },
  { pincode: '411001', city: 'Pune', area: 'Camp / Deccan Gymkhana', eta: '14 min', lat: 18.5196, lon: 73.8732, hubCode: 'PNQ_CENTRAL_01' },
  { pincode: '500001', city: 'Hyderabad', area: 'Banjara Hills / Abids', eta: '15 min', lat: 17.3984, lon: 78.4735, hubCode: 'HYD_CORE_03' }
];

