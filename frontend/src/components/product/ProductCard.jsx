import { Check, ChevronRight, Heart, Sparkles, Store, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { addWishlistItem, removeWishlistItem } from '../../store/wishlistSlice.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { ProductImage } from './ProductImage.jsx';
import { PriceComparison } from './PriceComparison.jsx';

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [toast, setToast] = useState(false);

  const isSaved = wishlistItems.some((item) => item.productKey === product.productKey);

  const toggleWishlist = () => {
    if (!user || !product.bestOffer) return;
    if (isSaved) {
      dispatch(removeWishlistItem(product.productKey));
    } else {
      dispatch(
        addWishlistItem({
          productKey: product.productKey,
          name: product.name,
          imageUrl: product.imageUrl,
          bestPrice: product.bestOffer.price,
          provider: product.bestOffer.providerName,
          productUrl: product.bestOffer.productUrl
        })
      );
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  return (
    <article className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all">
      <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
        {/* Product Image */}
        <div className="relative flex items-center justify-center rounded-xl bg-slate-50/80 p-2 overflow-hidden">
          <ProductImage src={product.imageUrl} alt={product.name} />
          {product.savingsPercent > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
              <TrendingDown className="h-3 w-3" />
              Save {product.savingsPercent}%
            </div>
          )}
        </div>

        {/* Product Info & Offers */}
        <div className="min-w-0 flex flex-col justify-between">
          <div>
            {/* Top row: Category, Unit, Wishlist, Lowest Price */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <span>•</span>
                  <span className="text-slate-600 font-mono">{product.quantity}</span>
                  {product.storesCount > 1 && (
                    <>
                      <span>•</span>
                      <span className="text-slate-500 flex items-center gap-1 font-normal">
                        <Store className="h-3 w-3 text-slate-400" /> {product.storesCount} stores compared
                      </span>
                    </>
                  )}
                </div>

                <Link
                  to={`/products/${encodeURIComponent(product.productKey)}`}
                  className="mt-1.5 inline-block text-lg sm:text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  {product.name}
                </Link>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{product.brand}</p>
              </div>

              {/* Price Block */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Lowest Price
                  </span>
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className="text-2xl font-black text-emerald-600">
                      {formatPrice(product.bestOffer?.price)}
                    </span>
                  </div>
                  {product.unitPriceFormatted && (
                    <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 font-mono mt-0.5">
                      {product.unitPriceFormatted}
                    </span>
                  )}
                </div>

                <button
                  onClick={toggleWishlist}
                  disabled={!user}
                  className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${
                    isSaved
                      ? 'border-rose-200 bg-rose-50 text-rose-600 shadow-xs'
                      : 'border-slate-200 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'
                  } disabled:opacity-40`}
                  title={user ? (isSaved ? 'Remove from saved' : 'Save deal') : 'Login to save'}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Savings Callout Banner */}
            {product.priceSpread > 0 && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/60 px-3 py-1.5 text-xs text-amber-900">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>
                  Save up to <strong className="font-bold text-amber-950">₹{product.priceSpread}</strong> by choosing the right store for this item!
                </span>
              </div>
            )}
          </div>

          {/* Store Comparison Rows */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <PriceComparison offers={product.offers} />
          </div>
        </div>
      </div>
    </article>
  );
}

