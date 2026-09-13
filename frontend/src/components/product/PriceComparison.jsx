import { ExternalLink, Zap } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';

export function PriceComparison({ offers }) {
  const availableOffers = offers.filter((o) => o.available);
  const lowestPrice = availableOffers.length > 0 ? Math.min(...availableOffers.map((o) => o.price)) : null;

  return (
    <div className="space-y-1 font-mono">
      {offers.map((offer) => {
        const isBest = offer.available && offer.price === lowestPrice;

        return (
          <div
            key={offer.providerProductId}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 border transition-colors ${
              !offer.available
                ? 'border-term-border/40 bg-term-bg/40 opacity-50'
                : isBest
                ? 'border-term-cyan bg-term-cyan/10 ring-1 ring-term-cyan/30'
                : 'border-term-border bg-term-surface hover:border-term-dim'
            }`}
          >
            {/* Store & Delivery Info */}
            <div className="min-w-0 flex items-center gap-3">
              <span className="font-bold text-xs uppercase text-term-text min-w-[90px]">
                {offer.providerName}
              </span>

              {isBest && (
                <span className="border border-term-cyan px-1 py-0.2 text-[9px] font-bold text-term-cyan uppercase">
                  BEST PRICE
                </span>
              )}

              {offer.available ? (
                <span className="text-[10px] text-term-muted flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-term-cyan" />
                  ~{offer.deliveryEta || '12m'}
                </span>
              ) : (
                <span className="text-[10px] text-term-red font-semibold">
                  OUT_OF_STOCK
                </span>
              )}

              {offer.unitPriceFormatted && (
                <span className="hidden sm:inline text-[10px] text-term-dim">
                  [{offer.unitPriceFormatted}]
                </span>
              )}
            </div>

            {/* Price Info & Link */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className={`text-sm font-bold tabular-nums ${isBest ? 'text-term-cyan' : 'text-term-text'}`}>
                    {formatPrice(offer.price)}
                  </span>
                  {offer.mrp && offer.mrp > offer.price && (
                    <span className="text-[10px] text-term-muted line-through tabular-nums">
                      {formatPrice(offer.mrp)}
                    </span>
                  )}
                </div>
              </div>

              {offer.available ? (
                <a
                  href={offer.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border transition-colors ${
                    isBest
                      ? 'border-term-cyan bg-term-cyan text-term-bg hover:opacity-90'
                      : 'border-term-border bg-term-sub text-term-text hover:border-term-dim'
                  }`}
                >
                  Visit <ExternalLink className="h-2.5 w-2.5" />
                </a>
              ) : (
                <span className="px-2 py-1 text-[10px] border border-term-border/40 text-term-dim uppercase">
                  Unavail
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

