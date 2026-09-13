import { ChevronLeft, ChevronRight, MapPin, Sparkles, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { Filters } from '../components/search/Filters.jsx';
import { SearchBar } from '../components/search/SearchBar.jsx';
import { useLocation } from '../context/LocationContext.jsx';
import { searchProducts } from '../store/productSlice.js';

export function SearchResults() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const initialCategory = params.get('category') || 'All';
  const dispatch = useDispatch();
  const { location, setIsModalOpen } = useLocation();
  const { items, meta, loading, error } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    sort: 'best',
    provider: 'all',
    category: initialCategory,
    availableOnly: false,
    page: 1,
    limit: 10
  });

  // Sync category param from URL
  useEffect(() => {
    const cat = params.get('category');
    if (cat && cat !== filters.category) {
      setFilters((current) => ({ ...current, category: cat, page: 1 }));
    }
  }, [params]);

  const searchParams = useMemo(
    () => ({
      q: query,
      category: filters.category !== 'All' ? filters.category : undefined,
      pincode: location?.pincode,
      sort: filters.sort,
      provider: filters.provider,
      availableOnly: filters.availableOnly,
      page: filters.page,
      limit: filters.limit
    }),
    [query, filters, location?.pincode]
  );

  useEffect(() => {
    dispatch(searchProducts(searchParams));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (meta?.totalPages && newPage > meta.totalPages)) return;
    setFilters((current) => ({ ...current, page: newPage }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Search Header Bar */}
      <div className="max-w-3xl mx-auto">
        <SearchBar initialQuery={query} />
      </div>

      {/* Location Notice Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <MapPin className="h-3 w-3" />
          </span>
          <span>
            Comparing live store stock and dark-store prices for{' '}
            <strong className="font-semibold text-slate-800">
              {location?.city} ({location?.pincode})
            </strong>
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-emerald-700 font-semibold hover:underline"
        >
          Change Pincode
        </button>
      </div>

      {/* Filters Section */}
      <Filters
        filters={filters}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch, page: 1 }))}
      />

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-500 pt-1">
        <div>
          {meta ? (
            <span>
              Showing <strong className="font-semibold text-slate-800">{items.length}</strong> of{' '}
              <strong className="font-semibold text-slate-800">{meta.total}</strong> products
              {query && <span> for &ldquo;<span className="text-slate-900 font-medium">{query}</span>&rdquo;</span>}
              {filters.category && filters.category !== 'All' && (
                <span> in <strong className="text-emerald-700">{filters.category}</strong></span>
              )}
            </span>
          ) : (
            <span>Searching stores...</span>
          )}
        </div>

        {meta?.cache && (
          <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-mono text-slate-600">
            ⚡ {meta.cache === 'hit' ? 'Instant Cache' : 'Live Crawled'}
          </span>
        )}
      </div>

      {/* Product List or Skeletons */}
      <div className="flex flex-col gap-4">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 rounded-2xl border border-slate-200/60 bg-white p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <div className="h-28 w-28 rounded-xl bg-slate-100 shrink-0" />
                  <div className="space-y-2.5 flex-1 pt-2">
                    <div className="h-4 w-1/4 rounded bg-slate-100" />
                    <div className="h-6 w-2/3 rounded bg-slate-100" />
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-10 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {error && <EmptyState title="Unable to fetch prices" description={error} />}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="No matching products found"
            description="Try searching with a broader term like 'milk', 'rice', 'oil', or select a different category."
          />
        )}

        {!loading && !error && items.map((product) => (
          <ProductCard key={product.productKey} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && !error && meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/80 pt-5 pb-8">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, filters.page - 3), Math.min(meta.totalPages, filters.page + 2))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`h-8 w-8 rounded-xl font-semibold transition-all ${
                    filters.page === p
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
          </div>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= meta.totalPages}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

