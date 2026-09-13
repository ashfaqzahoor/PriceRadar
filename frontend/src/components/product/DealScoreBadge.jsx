export function DealScoreBadge({ stats }) {
  if (!stats) return null;

  const { dealScore, dealRating, priceDiffFromAvg, lowestEver, bestStoreHistorically } = stats;
  const isBelowAvg = priceDiffFromAvg < 0;
  const isAllTimeLow = dealRating === 'All-Time Low';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-term-border bg-term-surface font-mono text-xs">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center h-11 w-11 border border-term-border bg-term-bg shrink-0">
          <div className="text-center leading-none">
            <span className={`text-base font-black tabular-nums ${dealScore >= 75 ? 'text-term-cyan' : dealScore >= 50 ? 'text-term-amber' : 'text-term-red'}`}>
              {dealScore}
            </span>
            <span className="text-[8px] font-bold text-term-dim block">/100</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 font-bold uppercase">
            <span className="h-1.5 w-1.5 bg-term-cyan animate-ping" />
            <span className={dealScore >= 70 ? 'text-term-cyan' : dealScore >= 45 ? 'text-term-amber' : 'text-term-red'}>
              {isAllTimeLow ? 'ALL_TIME_LOW_RECORD' : dealScore >= 75 ? 'OPTIMAL_DEAL_SCORE' : 'FAIR_VALUATION'}
            </span>
          </div>
          <p className="text-[11px] text-term-muted mt-0.5">
            {isBelowAvg ? (
              <span className="text-term-cyan font-semibold">
                -₹{Math.abs(priceDiffFromAvg)} below 30d benchmark average
              </span>
            ) : priceDiffFromAvg > 0 ? (
              <span className="text-term-red font-semibold">
                +₹{priceDiffFromAvg} above 30d average
              </span>
            ) : (
              <span>Benchmarked at 30d median price</span>
            )}
            {' • '}Historically lowest on <strong className="text-term-text">{bestStoreHistorically}</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
        <div className="border border-term-border bg-term-bg px-2.5 py-1">
          <span className="text-term-dim block text-[9px] uppercase font-bold">ALL_TIME_MIN</span>
          <span className="font-bold text-term-cyan font-mono tabular-nums">₹{lowestEver}</span>
        </div>
        <div className="border border-term-border bg-term-bg px-2.5 py-1">
          <span className="text-term-dim block text-[9px] uppercase font-bold">30D_AVG</span>
          <span className="font-bold text-term-text font-mono tabular-nums">₹{stats.averagePrice}</span>
        </div>
      </div>
    </div>
  );
}
