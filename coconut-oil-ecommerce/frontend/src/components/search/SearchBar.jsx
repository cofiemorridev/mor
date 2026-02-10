import React, { useState, useEffect, useRef } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const { trackEvent } = useAnalytics();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Track search focus
  useEffect(() => {
    if (isFocused) {
      trackEvent('search_focus', 'engagement', 'search_bar');
    }
  }, [isFocused]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      trackEvent('search_submit', 'engagement', query);
      trackEvent('search', 'engagement', query);
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    trackEvent('search_clear', 'engagement', 'search_bar');
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Track real-time typing for popular searches
            if (e.target.value.length > 2) {
              trackEvent('search_typing', 'engagement', e.target.value.slice(0, 20));
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-label="Search products"
        />
        
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 font-semibold"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {/* Search suggestions (optional) */}
      {query && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2 text-sm text-gray-500">
            Press Enter to search for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
