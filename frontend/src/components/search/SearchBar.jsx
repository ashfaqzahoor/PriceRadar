import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch.js';
import { Suggestions } from './Suggestions.jsx';

export function SearchBar({ initialQuery = '', placeholder = 'Search milk, bread, basmati rice, amul butter, oil...' }) {
  const navigate = useNavigate();
  const { query, setQuery, suggestions, setSuggestions } = useSearch(initialQuery);

  const submit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={submit} className="relative w-full">
      <div className="flex items-center rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">
        <div className="grid w-11 place-items-center text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none sm:text-base font-normal"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition-all"
        >
          Compare
        </button>
      </div>
      <Suggestions
        suggestions={suggestions}
        onSelect={(value) => {
          setQuery(value);
          setSuggestions([]);
          navigate(`/search?q=${encodeURIComponent(value)}`);
        }}
      />
    </form>
  );
}
