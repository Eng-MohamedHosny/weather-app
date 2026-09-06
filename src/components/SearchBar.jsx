import React, { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../services/weatherApi';

export default function SearchBar({ onSelectLocation, isSearching, onNoResults, onUseCurrentLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const wrapperRef = useRef(null);

  const handleGpsClick = async () => {
    if (onUseCurrentLocation) {
      setLocatingGps(true);
      try {
        await onUseCurrentLocation();
      } finally {
        setLocatingGps(false);
      }
    }
  };

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
    <div ref={wrapperRef} className="relative w-full max-w-[720px] lg:max-w-[656px] mx-auto z-30">
      {/* Search Input and Button */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4"
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
            className="w-full bg-neutral-800 text-neutral-0 placeholder-neutral-300 pl-12 sm:pl-14 pr-12 h-[56px] rounded-xl border border-neutral-700 hover:border-neutral-600 focus:border-neutral-500 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white text-base shadow-card transition-all"
          />

          {/* Precise Location GPS Button */}
          <button
            type="button"
            onClick={handleGpsClick}
            title="Use my current precise location"
            aria-label="Use current location"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-700/60 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {locatingGps ? (
              <img
                src="/assets/images/icon-loading.svg"
                alt="Locating"
                className="w-5 h-5 animate-spin"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 opacity-80 hover:opacity-100"
              >
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <circle cx="12" cy="12" r="7"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            )}
          </button>

          {/* Autocomplete / Search in progress Dropdown matching input width exactly */}
          {showDropdown && query.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-neutral-800 border border-neutral-700 rounded-xl shadow-dropdown overflow-hidden z-50">
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

        <button
          type="submit"
          className="bg-brand-blue hover:bg-brand-blueHover text-white font-medium h-[56px] px-8 rounded-xl transition-all shadow-card flex items-center justify-center text-base focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer w-full md:w-auto"
        >
          Search
        </button>
      </form>
    </div>
  );
}
