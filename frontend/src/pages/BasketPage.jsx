import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Check,
  ExternalLink,
  Info,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2
} from 'lucide-react';
import {
  clearBasket,
  removeFromBasket,
  setSubstituteDecision,
  updateQuantity
} from '../store/basketSlice.js';
import { useLocation } from '../context/LocationContext.jsx';
import { formatPrice } from '../utils/formatPrice.js';

const STORES = [
  { id: 'blinkit', name: 'Blinkit', deliveryFee: 15, deliveryEta: '9 min', freeDeliveryThreshold: 299 },
  { id: 'instamart', name: 'Instamart', deliveryFee: 20, deliveryEta: '10 min', freeDeliveryThreshold: 299 },
  { id: 'bigbasket', name: 'BigBasket', deliveryFee: 25, deliveryEta: '15 min', freeDeliveryThreshold: 499 }
];

export function BasketPage() {
  const dispatch = useDispatch();
  const { items, substituteDecisions } = useSelector((state) => state.basket);
  const { location } = useLocation();

  // Multi-Store Calculations
  const storeCarts = useMemo(() => {
    return STORES.map((store) => {
      let subtotal = 0;
      let availableItemsCount = 0;
      let missingItemsCount = 0;
      let itemsBreakdown = [];

      items.forEach((item) => {
        const offer = (item.offers || []).find(
          (o) => o.provider === store.id || o.providerName?.toLowerCase().includes(store.id)
        );

        const decisionKey = `${store.id}_${item.productKey}`;
        const userDecision = substituteDecisions[decisionKey]; // 'accepted' | 'excluded'

        if (offer && offer.available) {
          const itemTotal = offer.price * item.quantity;
          subtotal += itemTotal;
          availableItemsCount += 1;
          itemsBreakdown.push({
            productKey: item.productKey,
            name: item.name,
            quantity: item.quantity,
            unitPrice: offer.price,
            totalPrice: itemTotal,
            available: true,
            productUrl: offer.productUrl
          });
        } else {
          // Out of stock
          missingItemsCount += 1;
          const fallbackPrice = offer?.price || 120;
          const substituteCost = Math.round(fallbackPrice * 1.08);

          if (userDecision === 'accepted') {
            const itemTotal = substituteCost * item.quantity;
            subtotal += itemTotal;
            itemsBreakdown.push({
              productKey: item.productKey,
              name: item.name,
              quantity: item.quantity,
              unitPrice: substituteCost,
              totalPrice: itemTotal,
              available: false,
              isSubstituted: true,
              substituteName: `${item.brand || 'Alternative'} (Similar pack)`,
              productUrl: offer?.productUrl
            });
          } else {
            // Excluded
            itemsBreakdown.push({
              productKey: item.productKey,
              name: item.name,
              quantity: item.quantity,
              unitPrice: 0,
              totalPrice: 0,
              available: false,
              isExcluded: true,
              productUrl: offer?.productUrl
            });
          }
        }
      });

      const deliveryFee =
        subtotal >= store.freeDeliveryThreshold || subtotal === 0 ? 0 : store.deliveryFee;
      const landedTotal = subtotal + deliveryFee;

      return {
        ...store,
        subtotal,
        deliveryFee,
        landedTotal,
        availableItemsCount,
        missingItemsCount,
        isFullyStocked: missingItemsCount === 0,
        itemsBreakdown
      };
    });
  }, [items, substituteDecisions]);

  // Find cheapest store among eligible stores
  const validCarts = storeCarts.filter((c) => c.subtotal > 0);
  const bestCart =
    validCarts.length > 0
      ? validCarts.reduce((min, curr) => (curr.landedTotal < min.landedTotal ? curr : min), validCarts[0])
      : null;

  const worstCart =
    validCarts.length > 1
      ? validCarts.reduce((max, curr) => (curr.landedTotal > max.landedTotal ? curr : max), validCarts[0])
      : null;

  const maxSavings = bestCart && worstCart ? worstCart.landedTotal - bestCart.landedTotal : 0;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-gray-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">Your basket is empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Add everyday items to your basket to instantly compare total checkout prices across Blinkit, Instamart, and BigBasket.
          </p>
        </div>
        <div className="pt-3">
          <Link
            to="/search?q="
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 transition-colors shadow-xs"
          >
            Start shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Basket Comparison
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comparing total cost for {items.length} {items.length === 1 ? 'item' : 'items'} delivering to{' '}
            <strong className="text-gray-800 font-medium">{location?.area || location?.city || 'Connaught Place'}</strong>
          </p>
        </div>

        <button
          onClick={() => dispatch(clearBasket())}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear basket
        </button>
      </div>

      {/* Net Savings Recommendation Banner */}
      {bestCart && maxSavings > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50/70 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-white shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-green-900">
                  {bestCart.name} is the cheapest option
                </span>
                <span className="rounded-full bg-green-700 px-2 py-0.5 text-[11px] font-bold text-white">
                  Save ₹{maxSavings}
                </span>
              </div>
              <p className="text-xs text-green-800/80 mt-1 leading-relaxed">
                Buying your entire basket from <strong className="font-semibold text-green-950">{bestCart.name}</strong> costs{' '}
                <strong className="font-semibold text-green-950">{formatPrice(bestCart.landedTotal)}</strong> (including delivery). You save{' '}
                <strong className="font-semibold text-green-950">₹{maxSavings}</strong> compared to ordering from {worstCart.name}.
              </p>
            </div>
          </div>

          <a
            href={`#store-${bestCart.id}`}
            className="self-start sm:self-auto shrink-0 rounded-lg bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-800 transition-colors shadow-xs"
          >
            Review {bestCart.name} cart
          </a>
        </div>
      )}

      {/* 3 Store Checkout Summaries (Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {storeCarts.map((store) => {
          const isWinner = bestCart && store.id === bestCart.id;
          return (
            <div
              key={store.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isWinner
                  ? 'border-green-600 bg-white ring-2 ring-green-600/20 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Store className={`h-4 w-4 ${isWinner ? 'text-green-700' : 'text-gray-500'}`} />
                    <span className="font-semibold text-sm text-gray-900">{store.name}</span>
                  </div>
                  {isWinner && (
                    <span className="rounded-full bg-green-700 text-white text-[10px] font-bold px-2 py-0.5">
                      Cheapest
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Items subtotal</span>
                    <span className="font-medium text-gray-900 tabular-nums">{formatPrice(store.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery time</span>
                    <span className="text-gray-900 font-medium">~{store.deliveryEta}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery fee</span>
                    <span className="tabular-nums">
                      {store.deliveryFee === 0 ? (
                        <span className="text-green-700 font-semibold">FREE</span>
                      ) : (
                        `₹${store.deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-xs font-semibold text-gray-700">Total cost</span>
                    <span className={`text-lg font-bold tabular-nums ${isWinner ? 'text-green-800' : 'text-gray-900'}`}>
                      {formatPrice(store.landedTotal)}
                    </span>
                  </div>
                </div>

                {/* Stock notice */}
                <div className="pt-1 text-xs">
                  {store.isFullyStocked ? (
                    <span className="text-green-700 flex items-center gap-1 font-medium text-[11px]">
                      <Check className="h-3.5 w-3.5" /> All {items.length} items in stock
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1 font-medium text-[11px]">
                      <AlertCircle className="h-3.5 w-3.5" /> {store.missingItemsCount} {store.missingItemsCount === 1 ? 'item' : 'items'} out of stock
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`#store-${store.id}`}
                  className={`w-full py-2 text-center block rounded-lg text-xs font-medium transition-colors ${
                    isWinner
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  View item checklist ↓
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Basket Items Breakdown Table */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">
          Items in your basket ({items.length})
        </h2>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-[11px] font-medium">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Pack / Unit</th>
                <th className="p-3.5 text-center">Quantity</th>
                <th className="p-3.5 text-right">Lowest Price</th>
                <th className="p-3.5 text-right">Store Difference</th>
                <th className="p-3.5 text-center">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const availableOffers = (item.offers || []).filter((o) => o.available);
                const lowest = availableOffers.length > 0 ? Math.min(...availableOffers.map((o) => o.price)) : 0;
                const highest = availableOffers.length > 0 ? Math.max(...availableOffers.map((o) => o.price)) : 0;
                const spread = highest - lowest;

                return (
                  <tr key={item.productKey} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-10 w-10 object-contain rounded-md border border-gray-100 p-0.5 shrink-0 bg-white"
                        />
                        <div>
                          <Link
                            to={`/products/${encodeURIComponent(item.productKey)}`}
                            className="font-semibold text-gray-900 hover:text-green-800 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <span className="block text-[11px] text-gray-400">{item.brand}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-gray-500">
                      <span>{item.category}</span>
                      <span className="block text-gray-400 text-[11px]">{item.unit}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ productKey: item.productKey, quantity: item.quantity - 1 }))
                          }
                          className="h-6 w-6 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 grid place-items-center"
                          title="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ productKey: item.productKey, quantity: item.quantity + 1 }))
                          }
                          className="h-6 w-6 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 grid place-items-center"
                          title="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 text-right font-bold text-green-800 tabular-nums">
                      {formatPrice(lowest)}
                    </td>

                    <td className="p-3.5 text-right tabular-nums">
                      {spread > 0 ? (
                        <span className="text-gray-600 font-medium">
                          Up to ₹{spread * item.quantity} difference
                        </span>
                      ) : (
                        <span className="text-gray-400">Same across stores</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => dispatch(removeFromBasket(item.productKey))}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Individual Store Checklists with Direct Links & Substitute decisions */}
      <section className="space-y-4 pt-4 border-t border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">
          Store Checklists & Links
        </h2>
        <p className="text-xs text-gray-500 -mt-2">
          Click the link for each item to add it directly on the store website or app.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {storeCarts.map((store) => {
            const isWinner = bestCart && store.id === bestCart.id;
            return (
              <div
                id={`store-${store.id}`}
                key={store.id}
                className={`rounded-xl border bg-white overflow-hidden shadow-xs ${
                  isWinner ? 'border-green-600 ring-1 ring-green-600' : 'border-gray-200'
                }`}
              >
                {/* Store Header */}
                <div className={`p-4 border-b flex items-center justify-between ${
                  isWinner ? 'bg-green-50/60 border-green-100' : 'bg-gray-50 border-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Store className={`h-4 w-4 ${isWinner ? 'text-green-700' : 'text-gray-600'}`} />
                    <span className="font-semibold text-xs text-gray-900">{store.name}</span>
                    {isWinner && (
                      <span className="rounded-full bg-green-700 text-white text-[10px] font-bold px-2 py-0.2">
                        Cheapest
                      </span>
                    )}
                  </div>

                  <span className="font-bold text-sm text-gray-900 tabular-nums">
                    {formatPrice(store.landedTotal)}
                  </span>
                </div>

                {/* Items list */}
                <div className="divide-y divide-gray-100 text-xs">
                  {store.itemsBreakdown.map((b) => {
                    const decisionKey = `${store.id}_${b.productKey}`;
                    const currentDecision = substituteDecisions[decisionKey];

                    return (
                      <div key={b.productKey} className="p-3.5 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900 block truncate">{b.name}</span>
                            <span className="text-[11px] text-gray-400">Qty: {b.quantity}</span>
                          </div>
                          <span className="font-semibold text-gray-900 tabular-nums shrink-0">
                            {b.totalPrice > 0 ? formatPrice(b.totalPrice) : <span className="text-gray-400 font-normal">Excluded</span>}
                          </span>
                        </div>

                        {/* Out of stock & Substitute preference */}
                        {!b.available && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5 text-[11px] space-y-1.5">
                            <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                              <span>Out of stock at {store.name}</span>
                            </div>
                            <p className="text-gray-600 text-[11px]">
                              Suggested substitute: {b.substituteName} ({formatPrice(b.unitPrice)} each)
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() =>
                                  dispatch(
                                    setSubstituteDecision({
                                      storeId: store.id,
                                      productKey: b.productKey,
                                      decision: 'accepted'
                                    })
                                  )
                                }
                                className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                                  currentDecision === 'accepted'
                                    ? 'border-green-600 bg-green-700 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {currentDecision === 'accepted' ? '✓ Keep substitute' : 'Accept substitute'}
                              </button>
                              <button
                                onClick={() =>
                                  dispatch(
                                    setSubstituteDecision({
                                      storeId: store.id,
                                      productKey: b.productKey,
                                      decision: 'excluded'
                                    })
                                  )
                                }
                                className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                                  currentDecision === 'excluded' || !currentDecision
                                    ? 'border-gray-300 bg-gray-200 text-gray-800'
                                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                Skip this item
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Direct store item link */}
                        <div className="pt-0.5">
                          {b.productUrl ? (
                            <a
                              href={b.productUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-green-700 hover:text-green-800 font-medium transition-colors"
                            >
                              Add on {store.name} <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-gray-400">
                              Search in {store.name} app
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer totals */}
                <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="text-gray-500 text-[11px]">
                    Delivery: {store.deliveryFee === 0 ? 'FREE' : `₹${store.deliveryFee}`}
                  </div>
                  <div className="font-bold text-gray-900 tabular-nums">
                    Total: {formatPrice(store.landedTotal)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
