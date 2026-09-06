import React, { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../services/weatherApi';

export default function SearchBar({ onSelectLocation, isSearching }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const wrapperRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setNoResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setNoResults(results.length === 0);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
        setNoResults(true);
        setShowDropdown(true);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setShowDropdown(false);
    setQuery(`${item.name}, ${item.country || ''}`);
    onSelectLocation({
      name: item.name,
      country: item.country,
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[656px] mx-auto z-30">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loadingSuggestions || isSearching ? (
              <img
                src="/assets/images/icon-loading.svg"
                alt="Loading"
                className="w-5 h-5 animate-spin opacity-80"
              />
            ) : (
              <img
                src="/assets/images/icon-search.svg"
                alt=""
                className="w-5 h-5 opacity-70"
              />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2) setShowDropdown(true);
            }}
            placeholder="Search for a place..."
            className="w-full bg-neutral-800 text-neutral-0 placeholder-neutral-300 pl-12 pr-4 py-4 rounded-xl border border-neutral-700 hover:border-neutral-600 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all text-base shadow-card"
          />
        </div>

        <button
          type="submit"
          className="bg-brand-blue hover:bg-brand-blueHover text-white font-semibold px-7 py-4 rounded-xl transition-colors shadow-card flex items-center justify-center text-base focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 sm:right-[130px] top-full mt-2 bg-neutral-800 border border-neutral-700 rounded-xl shadow-dropdown overflow-hidden z-50">
          {loadingSuggestions ? (
            <div className="px-5 py-4 text-neutral-300 text-sm flex items-center gap-3">
              <img src="/assets/images/icon-loading.svg" alt="" className="w-4 h-4 animate-spin" />
              <span>Searching locations...</span>
            </div>
          ) : noResults ? (
            <div className="px-5 py-4 text-neutral-300 text-sm flex items-center gap-2">
              <span>No search results found</span>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-700/50 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <li key={`${item.id}-${item.latitude}-${item.longitude}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-5 py-3.5 hover:bg-neutral-700/60 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-neutral-0 group-hover:text-white">
                        {item.name}
                      </span>
                      {(item.admin1 || item.country) && (
                        <span className="text-neutral-300 text-xs ml-2">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
