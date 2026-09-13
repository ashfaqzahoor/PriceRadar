import { ArrowLeft, Bell, CheckCircle2, ChevronRight, ExternalLink, Heart, MapPin, Sparkles, Store, TrendingDown, Truck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useLocation } from '../context/LocationContext.jsx';
import { productService } from '../services/product.service.js';
import { addWishlistItem, removeWishlistItem } from '../store/wishlistSlice.js';
import { formatPrice } from '../utils/formatPrice.js';
import { BestPriceBadge } from '../components/product/BestPriceBadge.jsx';
import { ProductImage } from '../components/product/ProductImage.jsx';
import { DealScoreBadge } from '../components/product/DealScoreBadge.jsx';
import { PriceTrendChart } from '../components/product/PriceTrendChart.jsx';
import { PriceAlertModal } from '../components/product/PriceAlertModal.jsx';
import { SimilarProducts } from '../components/product/SimilarProducts.jsx';

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
  const [alertModalOpen, setAlertModalOpen] = useState(false);

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
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <div className="h-6 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-96 rounded-3xl border border-slate-200/80 bg-white p-6 animate-pulse" />
        <div className="h-64 rounded-3xl border border-slate-200/80 bg-white p-6 animate-pulse" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <Store className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Product Not Found</h1>
        <p className="text-xs text-slate-500">{error || 'Could not locate comparison data for this item.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </Link>
      </div>
    );
  }

  const lowestPrice = product.bestOffer?.price || 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 font-medium">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link to={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-900 font-medium">
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-[240px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Hero Overview Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Image */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
            <ProductImage src={product.imageUrl} alt={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100/80 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    {product.category}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500">
                    Pack Size: {product.quantity}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAlertModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-all active:scale-95"
                  >
                    <Bell className="h-3.5 w-3.5 text-emerald-600" />
                    Set Alert
                  </button>

                  <button
                    onClick={toggleWishlist}
                    disabled={!user}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSaved
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'
                    } disabled:opacity-40`}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                    {isSaved ? 'Saved' : 'Save Deal'}
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-sm font-medium text-slate-500">Brand: <strong className="text-slate-700">{product.brand}</strong></p>

              {/* Pincode status */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>Delivering to <strong>{location?.city} ({location?.pincode})</strong></span>
                <button onClick={() => setIsModalOpen(true)} className="text-emerald-600 font-semibold underline ml-1">
                  Change
                </button>
              </div>
            </div>

            {/* Pricing Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 p-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Lowest Store Price</span>
                <div className="text-2xl font-black text-emerald-600">{formatPrice(lowestPrice)}</div>
                <span className="text-[11px] text-slate-500">at {product.bestOffer?.providerName}</span>
              </div>

              {product.unitPriceFormatted && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Unit Cost</span>
                  <div className="text-xl font-bold text-slate-800 font-mono">{product.unitPriceFormatted}</div>
                  <span className="text-[11px] text-slate-500">true economic value</span>
                </div>
              )}

              {product.priceSpread > 0 && (
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 block">Cross-Store Spread</span>
                  <div className="text-xl font-bold text-amber-600">Save ₹{product.priceSpread}</div>
                  <span className="text-[11px] text-amber-800">across {product.storesCount} stores</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deal Score Gauge */}
        {product.priceStats && <DealScoreBadge stats={product.priceStats} />}
      </div>

      {/* Interactive Price Trend Chart */}
      {product.priceHistory && (
        <PriceTrendChart timeline={product.priceHistory} stats={product.priceStats} />
      )}

      {/* Live Store Offers Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Live Store Offers & True Landed Cost</h2>
          <p className="text-xs sm:text-sm text-slate-500">Includes grocery item price + estimated dark-store delivery charge</p>
        </div>

        <div className="space-y-3">
          {product.offers.map((offer) => {
            const isBest = offer.available && offer.price === lowestPrice;
            const priceDiff = offer.price - lowestPrice;

            return (
              <div
                key={offer.providerProductId}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                  !offer.available
                    ? 'border-slate-200 bg-slate-50/50 opacity-60'
                    : isBest
                    ? 'border-emerald-400 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-400/30'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-white border border-slate-200 shadow-xs p-1 shrink-0">
                    <img
                      src={offer.providerLogoUrl}
                      alt={offer.providerName}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{offer.providerName}</span>
                      {isBest && <BestPriceBadge />}
                      {offer.available && priceDiff > 0 && (
                        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          +{formatPrice(priceDiff)} vs lowest
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      {offer.available ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          <Zap className="h-3 w-3 fill-emerald-600" />
                          Delivery in {offer.deliveryEta || '15 min'}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Out of stock
                        </span>
                      )}

                      {offer.deliveryFee !== undefined && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <Truck className="h-3 w-3 text-slate-400" />
                          Delivery fee: ₹{offer.deliveryFee}
                        </span>
                      )}

                      {offer.unitPriceFormatted && (
                        <span className="text-slate-500 font-mono text-[11px] font-medium">
                          ({offer.unitPriceFormatted})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xl font-black text-slate-900">{formatPrice(offer.price)}</div>
                    {offer.landedPrice && (
                      <div className="text-[11px] text-slate-500">
                        Total with fee: <strong className="text-slate-800">{formatPrice(offer.landedPrice)}</strong>
                      </div>
                    )}
                  </div>

                  {offer.available ? (
                    <a
                      href={offer.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-xs transition-all active:scale-95 ${
                        isBest ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      Buy Now
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="rounded-xl bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Similar Alternatives Shelf */}
      {product.similarProducts && product.similarProducts.length > 0 && (
        <SimilarProducts products={product.similarProducts} />
      )}

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        product={product}
        currentLowest={lowestPrice}
      />
    </div>
  );
}


