import { Heart, Plus, ExternalLink } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { addWishlistItem, removeWishlistItem } from '../../store/wishlistSlice.js';
import { addToBasket } from '../../store/basketSlice.js';
import { formatPrice } from '../../utils/formatPrice.js';

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

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
    }
  };

  // Find prices for the 3 main stores: Blinkit, Instamart, BigBasket
  const getOffer = (storeKey) =>
    (product.offers || []).find((o) => o.provider === storeKey || o.providerName?.toLowerCase().includes(storeKey));

  const blinkitOffer = getOffer('blinkit');
  const instamartOffer = getOffer('instamart');
  const bigbasketOffer = getOffer('bigbasket');

  const offers = [
    { store: 'Blinkit', offer: blinkitOffer },
    { store: 'Instamart', offer: instamartOffer },
    { store: 'BigBasket', offer: bigbasketOffer }
  ];

  // Identify lowest available price
  const availableOffers = offers.filter((item) => item.offer?.available);
  const lowestPrice = availableOffers.length > 0 ? Math.min(...availableOffers.map((item) => item.offer.price)) : null;

  // Best offer overall for deep-link
  const bestOfferItem = offers.find((item) => item.offer?.available && item.offer.price === lowestPrice);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs hover:border-gray-300 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Product Name + Image + Spec */}
        <div className="flex items-center gap-3.5 min-w-0 md:max-w-xs lg:max-w-sm">
          <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';
              }}
            />
          </div>

          <div className="min-w-0">
            <Link
              to={`/products/${encodeURIComponent(product.productKey)}`}
              className="font-bold text-gray-900 text-sm sm:text-base hover:text-green-800 transition-colors line-clamp-1 block"
            >
              {product.name}
            </Link>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              <span>{product.quantity}</span>
              <span>•</span>
              <span>{product.brand}</span>
              {product.unitPriceFormatted && (
                <>
                  <span>•</span>
                  <span className="font-mono text-gray-400">{product.unitPriceFormatted}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Middle: 3 Store Prices Side-by-Side */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2 sm:py-0 border-y sm:border-y-0 border-gray-100 text-center">
          {offers.map(({ store, offer }) => {
            const isLowest = offer?.available && offer.price === lowestPrice;

            return (
              <div
                key={store}
                className={`p-2 rounded-lg border transition-colors ${
                  isLowest ? 'border-green-600 bg-green-50/60' : 'border-gray-100 bg-gray-50/50'
                }`}
              >
                <span className="block text-[11px] font-semibold text-gray-500 uppercase">{store}</span>
                <div className="mt-0.5">
                  {offer?.available ? (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-base font-bold tabular-nums ${isLowest ? 'text-green-800 font-extrabold' : 'text-gray-900'}`}>
                        {formatPrice(offer.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">—</span>
                  )}
                </div>
                {isLowest && (
                  <span className="inline-block mt-0.5 rounded px-1.5 py-0.2 bg-green-700 text-[10px] font-bold text-white uppercase tracking-wider">
                    Lowest
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Buy Button & Actions */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={() => dispatch(addToBasket(product))}
            className="p-2 text-gray-500 hover:text-green-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            title="Add to Basket"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            onClick={toggleWishlist}
            disabled={!user}
            className={`p-2 rounded-lg border transition-colors ${
              isSaved
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            } disabled:opacity-40`}
            title={user ? (isSaved ? 'Remove from saved' : 'Save') : 'Sign in to save'}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-600' : ''}`} />
          </button>

          {bestOfferItem?.offer?.productUrl ? (
            <a
              href={bestOfferItem.offer.productUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Buy on {bestOfferItem.store}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <Link
              to={`/products/${encodeURIComponent(product.productKey)}`}
              className="rounded-lg bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
            >
              Compare
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

