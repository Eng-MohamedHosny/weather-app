import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitch() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language Selector"
      className="inline-flex items-center bg-neutral-900/90 border border-neutral-700/80 p-1 rounded-xl shadow-inner relative select-none"
    >
      {/* English Option */}
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
          lang === 'en'
            ? 'bg-brand-blue text-white shadow-md'
            : 'bg-transparent text-neutral-300 hover:text-white hover:bg-neutral-800/50'
        }`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>

      {/* Arabic Option */}
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
          lang === 'ar'
            ? 'bg-brand-blue text-white shadow-md'
            : 'bg-transparent text-neutral-300 hover:text-white hover:bg-neutral-800/50'
        }`}
        aria-pressed={lang === 'ar'}
      >
        عربي
      </button>
    </div>
  );
}
