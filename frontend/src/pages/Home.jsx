import { useNavigate } from 'react-router-dom';
import {
  Milk,
  Wheat,
  Package,
  Droplet,
  Flame,
  Heart,
  Sparkles
} from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar.jsx';
import { CATEGORIES } from '../utils/constants.js';

const QUICK_SUGGESTIONS = [
  'Milk',
  'Bread',
  'Atta',
  'Butter',
  'Eggs',
  'Rice',
  'Cooking Oil',
  'Curd'
];

const CATEGORY_ICONS = {
  All: Sparkles,
  Dairy: Milk,
  Bakery: Wheat,
  Staples: Package,
  'Cooking Oil': Droplet,
  Protein: Flame,
  'Personal Care': Heart
};

export function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (catId) => {
    navigate(`/search?category=${encodeURIComponent(catId)}&q=`);
  };

  const handleQuickSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-12">
      {/* Hero + Search: Focused and quiet */}
      <section className="text-center space-y-6 pt-4 sm:pt-8">
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Find the cheapest price for what you&apos;re buying
          </h1>
          <p className="text-sm text-gray-500">
            Compare live prices across Blinkit, Instamart, and BigBasket before you order.
          </p>
        </div>

        {/* Search bar is the hero */}
        <div className="max-w-2xl mx-auto pt-2">
          <SearchBar />
        </div>

        {/* Quick-tap suggestion chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 pt-1">
          <span className="text-gray-400">Popular:</span>
          {QUICK_SUGGESTIONS.map((term) => (
            <button
              key={term}
              onClick={() => handleQuickSearch(term)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors shadow-xs"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Category browse: A simple grid of categories (icon + label, nothing more) */}
      <section className="space-y-4 pt-6 border-t border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 text-center">
          Browse by category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.filter((c) => c.id !== 'All').map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.id] || Sparkles;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 hover:shadow-xs transition-all text-center group"
              >
                <div className="p-2 text-gray-600 group-hover:text-green-800 transition-colors mb-2">
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-gray-800 group-hover:text-gray-900">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}


