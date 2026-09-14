import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { Filters } from '../components/search/Filters.jsx';
import { SearchBar } from '../components/search/SearchBar.jsx';
import { useLocation } from '../context/LocationContext.jsx';
import { searchProducts } from '../store/productSlice.js';

export function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const initialCategory = params.get('category') || 'All';
  const dispatch = useDispatch();
  const { location } = useLocation();
  const { items, meta, loading, error } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    sort: 'best',
    provider: 'all',
    category: initialCategory,
    availableOnly: false,
    page: 1,
    limit: 15
  });

  useEffect(() => {
    const cat = params.get('category');
    if (cat && cat !== filters.category) {
      setFilters((current) => ({ ...current, category: cat, page: 1 }));
    }
  }, [params, filters.category]);

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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">
      {/* Search Header Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar initialQuery={query} />
      </div>

      {/* Filters Section */}
      <Filters
        filters={filters}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch, page: 1 }))}
      />

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
        <div>
          {meta ? (
            <span>
              Showing <strong className="text-gray-900 font-semibold">{items.length}</strong> of{' '}
              <strong className="text-gray-900 font-semibold">{meta.total}</strong> products
              {query && <span> for &ldquo;<span className="text-gray-900">{query}</span>&rdquo;</span>}
            </span>
          ) : (
            <span>Loading prices...</span>
          )}
        </div>
      </div>

      {/* Product List or Skeletons */}
      <div className="space-y-3">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-24 rounded-xl border border-gray-200 bg-white p-4 animate-pulse flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-lg bg-gray-100 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 rounded bg-gray-100" />
                    <div className="h-3 w-20 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-12 w-20 rounded-lg bg-gray-100" />
                  <div className="h-12 w-20 rounded-lg bg-gray-100" />
                  <div className="h-12 w-20 rounded-lg bg-gray-100" />
                </div>
                <div className="h-9 w-24 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Unable to load prices</h3>
            <p className="text-xs text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && meta?.sanityRejected && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-8 text-center space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">Non-Grocery Query</h3>
            <p className="text-xs text-amber-800/90 max-w-md mx-auto">
              {meta.rejectionReason || `No grocery items found for "${query}". PriceRadar only compares supermarket & quick-commerce essentials.`}
            </p>
          </div>
        )}

        {!loading && !error && !meta?.sanityRejected && items.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">No products found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try searching for something common like &quot;Milk&quot;, &quot;Atta&quot;, &quot;Rice&quot;, or &quot;Bread&quot;.
            </p>
          </div>
        )}

        {!loading && !error && items.map((product) => (
          <ProductCard key={product.productKey} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && !error && meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 pb-8 text-xs">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <span className="text-gray-500">
            Page {filters.page} of {meta.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= meta.totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

