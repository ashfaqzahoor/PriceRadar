import { Check, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, PROVIDERS, SORT_OPTIONS } from '../../utils/constants.js';

export function Filters({ filters, onChange, onReset }) {
  const activeFiltersCount = (filters.provider !== 'all' ? 1 : 0) + (filters.availableOnly ? 1 : 0) + (filters.category && filters.category !== 'All' ? 1 : 0);

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <span>Filter & Sort Results</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={() => onChange({ provider: 'all', availableOnly: false, category: 'All' })}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected = (filters.category || 'All') === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.id })}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-medium transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Dropdowns */}
      <div className="grid gap-3 sm:grid-cols-3 pt-1 border-t border-slate-100">
        <label className="text-xs">
          <span className="mb-1.5 block font-semibold uppercase tracking-wider text-slate-500">Store Filter</span>
          <select
            value={filters.provider}
            onChange={(event) => onChange({ provider: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-medium"
          >
            {PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs">
          <span className="mb-1.5 block font-semibold uppercase tracking-wider text-slate-500">Sort By</span>
          <select
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-medium"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2.5 cursor-pointer select-none rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 px-3.5 py-2.5 w-full transition-all">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(event) => onChange({ availableOnly: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-700">In-Stock Only</span>
          </label>
        </div>
      </div>
    </section>
  );
}

