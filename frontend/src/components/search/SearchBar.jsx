import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch.js';
import { Suggestions } from './Suggestions.jsx';

export function SearchBar({ initialQuery = '', placeholder = 'Search for groceries (e.g. Milk, Atta, Butter, Rice)...' }) {
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
      <div className="flex items-center rounded-xl border border-gray-300 bg-white p-1.5 shadow-sm transition-all focus-within:border-green-700 focus-within:ring-2 focus-within:ring-green-700/20">
        <div className="grid w-10 place-items-center text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 active:scale-98 transition-all"
        >
          Search
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
