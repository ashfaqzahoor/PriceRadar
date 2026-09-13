import { CheckCircle2, ExternalLink, Zap } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';
import { BestPriceBadge } from './BestPriceBadge.jsx';

export function PriceComparison({ offers }) {
  const availableOffers = offers.filter((o) => o.available);
  const lowestPrice = availableOffers.length > 0 ? Math.min(...availableOffers.map((o) => o.price)) : null;

  return (
    <div className="space-y-2">
      {offers.map((offer) => {
        const isBest = offer.available && offer.price === lowestPrice;

        return (
          <div
            key={offer.providerProductId}
            className={`grid grid-cols-[1fr_auto] gap-3 rounded-xl border p-3 sm:grid-cols-[1.2fr_auto_auto] sm:items-center transition-all ${
              !offer.available
                ? 'border-slate-100 bg-slate-50/50 opacity-60'
                : isBest
                ? 'border-emerald-300 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-400/30'
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300'
            }`}
          >
            {/* Store & Delivery Info */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <img
                  src={offer.providerLogoUrl}
                  alt={offer.providerName}
                  className="h-5 w-5 rounded object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">{offer.providerName}</span>
                {isBest && <BestPriceBadge />}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                {offer.available ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                    <Zap className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                    {offer.deliveryEta || '15 min'}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Out of stock
                  </span>
                )}

                {offer.unitPriceFormatted && (
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    ({offer.unitPriceFormatted})
                  </span>
                )}
              </div>
            </div>

            {/* Price Info */}
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1.5">
                <span className={`text-base sm:text-lg font-bold ${isBest ? 'text-emerald-700' : 'text-slate-800'}`}>
                  {formatPrice(offer.price)}
                </span>
                {offer.mrp && offer.mrp > offer.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(offer.mrp)}
                  </span>
                )}
              </div>
              {offer.discountPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  {offer.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="col-span-2 sm:col-span-1">
              {offer.available ? (
                <a
                  href={offer.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all active:scale-95 ${
                    isBest
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Buy Now
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed"
                >
                  Unavailable
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

