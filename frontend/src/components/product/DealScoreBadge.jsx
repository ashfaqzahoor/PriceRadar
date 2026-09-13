import { ArrowDownRight, ArrowUpRight, Flame, ShieldAlert, Sparkles, TrendingDown, Trophy } from 'lucide-react';

export function DealScoreBadge({ stats }) {
  if (!stats) return null;

  const { dealScore, dealRating, priceDiffFromAvg, lowestEver, currentBest, bestStoreHistorically } = stats;

  const isBelowAvg = priceDiffFromAvg < 0;
  const isAllTimeLow = dealRating === 'All-Time Low';

  // Badge theme based on score
  let theme = {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Great Deal'
  };

  if (dealScore >= 90 || isAllTimeLow) {
    theme = {
      bg: 'bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15',
      border: 'border-emerald-500/40',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      label: isAllTimeLow ? '🔥 All-Time Lowest Price!' : 'Exceptional Deal'
    };
  } else if (dealScore >= 65) {
    theme = {
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
      text: 'text-teal-800',
      dot: 'bg-teal-500',
      label: 'Fair Market Price'
    };
  } else if (dealScore >= 45) {
    theme = {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      label: 'Average Price'
    };
  } else {
    theme = {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-800',
      dot: 'bg-rose-500',
      label: 'Above Average'
    };
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border ${theme.border} ${theme.bg} transition-all`}>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-white shadow-xs border border-slate-200/60 shrink-0">
          <div className="text-center leading-none">
            <span className="text-base font-black text-slate-900">{dealScore}</span>
            <span className="text-[9px] font-bold text-slate-400 block">/100</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
            <span className={`h-2 w-2 rounded-full ${theme.dot} animate-pulse`} />
            <span className={theme.text}>{theme.label}</span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {isBelowAvg ? (
              <span className="font-semibold text-emerald-700">
                ₹{Math.abs(priceDiffFromAvg)} below 30-day average price
              </span>
            ) : priceDiffFromAvg > 0 ? (
              <span className="font-semibold text-rose-600">
                ₹{priceDiffFromAvg} above 30-day average
              </span>
            ) : (
              <span>Right at average 30-day market price</span>
            )}
            {' • '}Best merchant historically is <strong className="text-slate-800">{bestStoreHistorically}</strong>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
        <div className="rounded-xl bg-white/90 border border-slate-200/80 px-3 py-1.5 shadow-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lowest Recorded</span>
          <span className="font-bold text-emerald-700 font-mono">₹{lowestEver}</span>
        </div>
        <div className="rounded-xl bg-white/90 border border-slate-200/80 px-3 py-1.5 shadow-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">30d Average</span>
          <span className="font-bold text-slate-700 font-mono">₹{stats.averagePrice}</span>
        </div>
      </div>
    </div>
  );
}
