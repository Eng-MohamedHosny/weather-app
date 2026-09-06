import React, { useState } from 'react';
import UnitsDropdown from './UnitsDropdown';
import LanguageSwitch from './LanguageSwitch';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ units, setUnits }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="relative flex items-center justify-between pt-6 pb-2 w-full gap-3 sm:gap-4">
      <a href="/" className="inline-block transition-opacity hover:opacity-90 flex-shrink-0" aria-label="Weather App Home">
        <img src="/assets/images/logo.svg" alt="Weather Now" className="h-7 sm:h-8 md:h-[38px] w-auto" />
      </a>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitch />

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            className="flex items-center gap-1.5 sm:gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-0 border border-neutral-700 hover:border-neutral-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-all focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          >
            <img src="/assets/images/icon-units.svg" alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-90" />
            <span>{t('units')}</span>
            <img
              src="/assets/images/icon-dropdown.svg"
              alt=""
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <UnitsDropdown
            units={units}
            setUnits={setUnits}
            isOpen={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
