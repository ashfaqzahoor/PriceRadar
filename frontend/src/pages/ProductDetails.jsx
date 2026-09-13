import { ArrowLeft, ExternalLink, Heart, MapPin, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useLocation } from '../context/LocationContext.jsx';
import { productService } from '../services/product.service.js';
import { addWishlistItem, removeWishlistItem } from '../store/wishlistSlice.js';
import { addToBasket } from '../store/basketSlice.js';
import { formatPrice } from '../utils/formatPrice.js';
import { PriceTrendChart } from '../components/product/PriceTrendChart.jsx';

export function ProductDetails() {
  const { productKey } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { location, setIsModalOpen } = useLocation();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSaved = wishlistItems.some((item) => item.productKey === product?.productKey);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    productService
      .getDetails(productKey, { pincode: location?.pincode })
      .then((res) => {
        if (isMounted) {
          setProduct(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load product details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productKey, location?.pincode]);

  const toggleWishlist = () => {
    if (!user || !product?.bestOffer) return;
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

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-3">
        <h2 className="text-base font-bold text-gray-900">Product not found</h2>
        <p className="text-xs text-gray-500">{error || 'This product is currently unavailable.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Go Back
        </button>
      </div>
    );
  }

  const availableOffers = (product.offers || []).filter((o) => o.available);
  const lowestPrice = availableOffers.length > 0 ? Math.min(...availableOffers.map((o) => o.price)) : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to results
      </button>

      {/* Main Product Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="h-32 w-32 shrink-0 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase">{product.category}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(addToBasket(product))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 hover:border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Add to Basket
                </button>
                <button
                  onClick={toggleWishlist}
                  disabled={!user}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isSaved
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-400 hover:text-gray-600'
                  } disabled:opacity-40`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-600' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xs text-gray-500">
              {product.quantity} • {product.brand} {product.unitPriceFormatted && `• ${product.unitPriceFormatted}`}
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span>Delivering to {location?.area || location?.city}</span>
              <button onClick={() => setIsModalOpen(true)} className="text-green-700 font-medium hover:underline ml-1">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Three-Way Price Comparison Row */}
        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Prices across stores
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Blinkit', 'Instamart', 'BigBasket'].map((storeName) => {
              const offer = (product.offers || []).find(
                (o) => o.provider === storeName.toLowerCase() || o.providerName?.toLowerCase().includes(storeName.toLowerCase())
              );
              const isLowest = offer?.available && offer.price === lowestPrice;

              return (
                <div
                  key={storeName}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    isLowest ? 'border-green-600 bg-green-50/50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">{storeName}</span>
                      {isLowest && (
                        <span className="rounded px-1.5 py-0.2 bg-green-700 text-[10px] font-bold text-white uppercase">
                          Lowest
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      {offer?.available ? (
                        <div className="text-xl font-bold text-gray-900 tabular-nums">
                          {formatPrice(offer.price)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 font-medium">Not available</div>
                      )}
                      {offer?.deliveryEta && (
                        <div className="text-xs text-gray-400 mt-0.5">Delivery in ~{offer.deliveryEta}</div>
                      )}
                    </div>
                  </div>

                  {offer?.available && offer.productUrl && (
                    <a
                      href={offer.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full py-2 text-center rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isLowest
                          ? 'bg-green-700 hover:bg-green-800 text-white'
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <span>Buy on {storeName}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Price History Chart (sparkline) */}
      {product.priceHistory && product.priceHistory.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <PriceTrendChart timeline={product.priceHistory} stats={product.priceStats} />
        </div>
      )}
    </div>
  );
}
