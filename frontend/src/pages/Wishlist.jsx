import { ExternalLink, Trash2, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { loadWishlist, removeWishlistItem } from '../store/wishlistSlice.js';
import { formatPrice } from '../utils/formatPrice.js';

export function Wishlist() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user) dispatch(loadWishlist());
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center space-y-4">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gray-100 text-gray-400">
          <Heart className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">Sign in to view saved items</h2>
          <p className="text-sm text-gray-500">
            Save items to track price drops across stores.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-block rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 transition-colors shadow-xs"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track prices and quickly re-order</p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="space-y-3">
        {loading && <div className="text-sm text-gray-500 py-10 text-center">Loading saved items...</div>}
        {!loading && items.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500 space-y-3">
            <Heart className="mx-auto h-8 w-8 text-gray-300" />
            <p>No saved items yet. Tap the heart icon on any product to save it here.</p>
            <Link to="/search?q=" className="inline-block text-xs font-medium text-green-700 hover:text-green-800">
              Browse products →
            </Link>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.productKey}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-14 w-14 object-contain rounded-lg border border-gray-100 p-1 bg-white"
              />
              <div>
                <h2 className="font-semibold text-sm text-gray-900">{item.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Best price on {item.provider}:{' '}
                  <strong className="text-green-800 font-bold tabular-nums">
                    {formatPrice(item.bestPrice)}
                  </strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <a
                href={item.productUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-800 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                Buy now <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={() => dispatch(removeWishlistItem(item.productKey))}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50 transition-colors"
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
