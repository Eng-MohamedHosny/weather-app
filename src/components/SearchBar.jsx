import React, { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../services/weatherApi';

export default function SearchBar({ onSelectLocation, isSearching, onNoResults }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const wrapperRef = useRef(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setHasNoResults(false);
      if (onNoResults) onNoResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      setShowDropdown(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        const empty = results.length === 0;
        setHasNoResults(empty);
        if (onNoResults) onNoResults(empty);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
        setHasNoResults(true);
        if (onNoResults) onNoResults(true);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onNoResults]);

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
    setQuery(`${item.name}${item.country ? ', ' + item.country : ''}`);
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
    } else if (query.trim().length >= 2) {
      // Trigger search
      searchLocations(query).then((res) => {
        if (res.length > 0) {
          handleSelect(res[0]);
        } else {
          setHasNoResults(true);
          if (onNoResults) onNoResults(true);
        }
      });
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[656px] mx-auto z-30">
      {/* Search Input and Button */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
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
            className="w-full bg-neutral-800 text-neutral-0 placeholder-neutral-300 pl-12 sm:pl-14 pr-4 h-[56px] rounded-xl border border-neutral-700 hover:border-neutral-600 focus:border-neutral-500 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white text-base shadow-card transition-all"
          />
        </div>

        <button
          type="submit"
          className="bg-brand-blue hover:bg-brand-blueHover text-white font-medium h-[52px] sm:h-[56px] px-8 rounded-xl transition-all shadow-card flex items-center justify-center text-base focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Autocomplete / Search in progress Dropdown */}
      {showDropdown && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 sm:right-[134px] top-full mt-2 bg-neutral-800 border border-neutral-700 rounded-xl shadow-dropdown overflow-hidden z-50">
          {loadingSuggestions ? (
            <div className="px-5 py-4 text-neutral-200 text-sm flex items-center gap-3">
              <img
                src="/assets/images/icon-loading.svg"
                alt=""
                className="w-4 h-4 animate-spin"
              />
              <span>Search in progress</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y divide-neutral-700/50 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <li key={`${item.id}-${item.latitude}-${item.longitude}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-5 py-3 hover:bg-neutral-700/60 transition-colors flex items-center justify-between group"
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
          ) : null}
        </div>
      )}
    </div>
  );
}
