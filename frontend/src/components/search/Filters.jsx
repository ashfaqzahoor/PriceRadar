import { RotateCcw } from 'lucide-react';
import { CATEGORIES, PROVIDERS, SORT_OPTIONS } from '../../utils/constants.js';

export function Filters({ filters, onChange }) {
  const activeFiltersCount =
    (filters.provider !== 'all' ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    (filters.category && filters.category !== 'All' ? 1 : 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 space-y-3 shadow-xs">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected = (filters.category || 'All') === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.id })}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-gray-600">
            <span>Store:</span>
            <select
              value={filters.provider}
              onChange={(e) => onChange({ provider: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 focus:border-green-700 outline-none"
            >
              {PROVIDERS.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1.5 text-gray-600">
            <span>Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 focus:border-green-700 outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => onChange({ availableOnly: e.target.checked })}
              className="rounded border-gray-300 text-green-700 focus:ring-green-700"
            />
            <span>In stock only</span>
          </label>
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={() => onChange({ provider: 'all', availableOnly: false, category: 'All' })}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}

