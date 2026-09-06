import React, { useState } from 'react';
import UnitsDropdown from './UnitsDropdown';

export default function Navbar({ units, setUnits }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between py-6 md:py-10 max-w-[1216px] mx-auto w-full px-4 md:px-0">
      <a href="/" className="inline-block transition-opacity hover:opacity-90" aria-label="Weather App Home">
        <img src="/assets/images/logo.svg" alt="Weather Now Logo" className="h-8 md:h-10 w-auto" />
      </a>

      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          className="flex items-center gap-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-0 border border-neutral-700 hover:border-neutral-600 px-4 py-2.5 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue"
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
