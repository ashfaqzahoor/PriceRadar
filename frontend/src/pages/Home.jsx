import { ArrowRight, CheckCircle2, Flame, Layers, MapPin, Milk, Package, Percent, ShieldCheck, Sparkles, TrendingDown, Wheat, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar.jsx';
import { useLocation } from '../context/LocationContext.jsx';
import { CATEGORIES } from '../utils/constants.js';

const TRENDING_QUERIES = [
  'Amul Butter',
  'Toned Milk',
  'Basmati Rice 5kg',
  'Aashirvaad Atta',
  'Eggs',
  'Mustard Oil',
  'Greek Yogurt',
  'Oats'
];

export function Home() {
  const navigate = useNavigate();
  const { location, setIsModalOpen } = useLocation();

  const handleCategoryClick = (catId) => {
    navigate(`/search?category=${encodeURIComponent(catId)}&q=`);
  };

  const handleQuickSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Quick-Commerce Price Intelligence</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-tight">
            Compare prices before you tap{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Order.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Real-time price comparison across Blinkit, Instamart, and BigBasket. Save 15%–35% on every daily grocery run with unit-economics and smart match.
          </p>

          {/* Search bar container */}
          <div className="pt-2">
            <SearchBar />
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Flame className="h-3.5 w-3.5 text-amber-400" /> Popular:
            </span>
            {TRENDING_QUERIES.map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-300 hover:border-emerald-500/50 hover:bg-slate-700/80 hover:text-white transition-all active:scale-95"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Location status */}
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>Delivering to <strong className="text-white font-medium">{location?.city} ({location?.pincode})</strong></span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 underline font-medium ml-1"
            >
              Change
            </button>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Browse by Category</h2>
            <p className="text-xs sm:text-sm text-slate-500">Compare everyday essentials across grocery apps</p>
          </div>
          <button
            onClick={() => handleCategoryClick('All')}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.filter((c) => c.id !== 'All').map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group flex flex-col items-center p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} grid place-items-center text-white shadow-xs group-hover:scale-110 transition-transform mb-3`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors">
                {cat.label}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Explore deals</span>
            </button>
          ))}
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Parallel Dark-Store Scrapes</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every search simultaneously fans out to Blinkit, Instamart, BigBasket, and Grocery API with live delivery ETAs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600 mb-4">
            <Percent className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Unit Price Normalization</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Don't get tricked by pack size variations. We calculate standardized ₹/100g and ₹/L so you always get genuine value.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-slate-300 transition-all">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 mb-4">
            <TrendingDown className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Price Spread Highlights</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Immediately see the spread between highest and lowest store offers and pick the optimal merchant with one click.
          </p>
        </div>
      </section>
    </div>
  );
}

