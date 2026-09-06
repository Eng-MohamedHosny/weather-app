import React from 'react';

export default function UnitsDropdown({ units, setUnits, isOpen, onClose }) {
  if (!isOpen) return null;

  const isMetric =
    units.temperature === 'celsius' &&
    units.windSpeed === 'kmh' &&
    units.precipitation === 'mm';

  const handleToggleSystem = () => {
    if (isMetric) {
      setUnits({
        temperature: 'fahrenheit',
        windSpeed: 'mph',
        precipitation: 'inch',
      });
    } else {
      setUnits({
        temperature: 'celsius',
        windSpeed: 'kmh',
        precipitation: 'mm',
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-14 z-50 w-[214px] rounded-2xl bg-neutral-800 border border-neutral-700 shadow-dropdown p-4 text-sm select-none">
        {/* Toggle Preset */}
        <button
          type="button"
          onClick={handleToggleSystem}
          className="w-full text-left font-medium text-neutral-0 hover:bg-neutral-700/60 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
        >
          <span>{isMetric ? 'Switch to Imperial' : 'Switch to Metric'}</span>
        </button>

        <div className="my-2.5 border-t border-neutral-700/80" />

        {/* Temperature */}
        <div className="mb-2.5">
          <div className="text-[11px] font-semibold tracking-wider text-neutral-300 uppercase px-3 mb-1">
            Temperature
          </div>
          <button
            type="button"
            onClick={() => setUnits((u) => ({ ...u, temperature: 'celsius' }))}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors text-left ${
              units.temperature === 'celsius'
                ? 'text-neutral-0 font-medium bg-neutral-700/50'
                : 'text-neutral-200 hover:bg-neutral-700/40'
            }`}
          >
            <span>Celsius (°C)</span>
            {units.temperature === 'celsius' && (
              <img src="/assets/images/icon-checkmark.svg" alt="selected" className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setUnits((u) => ({ ...u, temperature: 'fahrenheit' }))}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors text-left ${
              units.temperature === 'fahrenheit'
                ? 'text-neutral-0 font-medium bg-neutral-700/50'
                : 'text-neutral-200 hover:bg-neutral-700/40'
            }`}
          >
            <span>Fahrenheit (°F)</span>
            {units.temperature === 'fahrenheit' && (
              <img src="/assets/images/icon-checkmark.svg" alt="selected" className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="my-2.5 border-t border-neutral-700/80" />

        {/* Wind Speed */}
        <div className="mb-2.5">
          <div className="text-[11px] font-semibold tracking-wider text-neutral-300 uppercase px-3 mb-1">
            Wind Speed
          </div>
          <button
            type="button"
            onClick={() => setUnits((u) => ({ ...u, windSpeed: 'kmh' }))}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors text-left ${
              units.windSpeed === 'kmh'
                ? 'text-neutral-0 font-medium bg-neutral-700/50'
                : 'text-neutral-200 hover:bg-neutral-700/40'
            }`}
          >
            <span>km/h</span>
            {units.windSpeed === 'kmh' && (
              <img src="/assets/images/icon-checkmark.svg" alt="selected" className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setUnits((u) => ({ ...u, windSpeed: 'mph' }))}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors text-left ${
              units.windSpeed === 'mph'
                ? 'text-neutral-0 font-medium bg-neutral-700/50'
                : 'text-neutral-200 hover:bg-neutral-700/40'
            }`}
          >
            <span>mph</span>
            {units.windSpeed === 'mph' && (
              <img src="/assets/images/icon-checkmark.svg" alt="selected" className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="my-2.5 border-t border-neutral-700/80" />

        {/* Precipitation */}
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-neutral-300 uppercase px-3 mb-1">
            Precipitation
          </div>
          <button
            type="button"
            onClick={() => setUnits((u) => ({ ...u, precipitation: 'mm' }))}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors text-left ${
              units.precipitation === 'mm'
                ? 'text-neutral-0 font-medium bg-neutral-700/50'
                : 'text-neutral-200 hover:bg-neutral-700/40'
            }`}
          >
            <span>Millimeters (mm)</span>
            {units.precipitation === 'mm' && (
              <img src="/assets/images/icon-checkmark.svg" alt="selected" className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setUnits((u) => ({ ...u, precipitation: 'inch' }))}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors text-left ${
              units.precipitation === 'inch'
                ? 'text-neutral-0 font-medium bg-neutral-700/50'
                : 'text-neutral-200 hover:bg-neutral-700/40'
            }`}
          >
            <span>Inches (in)</span>
            {units.precipitation === 'inch' && (
              <img src="/assets/images/icon-checkmark.svg" alt="selected" className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
