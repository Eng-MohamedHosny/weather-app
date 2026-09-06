import React, { useState } from 'react';
import UnitsDropdown from './UnitsDropdown';

export default function Navbar({ units, setUnits }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between pt-6 pb-2 w-full">
      <a href="/" className="inline-block transition-opacity hover:opacity-90" aria-label="Weather App Home">
        <img src="/assets/images/logo.svg" alt="Weather Now" className="h-7 sm:h-8 md:h-[38px] w-auto" />
      </a>

      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-0 border border-neutral-700 hover:border-neutral-600 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium text-sm transition-all focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
        >
          <img src="/assets/images/icon-units.svg" alt="" className="w-4 h-4 opacity-90" />
          <span>Units</span>
          <img
            src="/assets/images/icon-dropdown.svg"
            alt=""
            className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <UnitsDropdown
          units={units}
          setUnits={setUnits}
          isOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
        />
      </div>
    </header>
  );
}
