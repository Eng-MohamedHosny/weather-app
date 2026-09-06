import React, { useState, useMemo } from 'react';
import { getWeatherInfo, formatDayName, formatHour } from '../utils/weatherCodes';

export default function HourlyForecast({ hourly, daily }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);

  // Available days from daily forecast
  const daysList = useMemo(() => {
    if (!daily || !daily.time) return [];
    return daily.time.slice(0, 7).map((dateStr, idx) => ({
      index: idx,
      date: dateStr,
      label: formatDayName(dateStr, false),
    }));
  }, [daily]);

  // Extract hourly data for the selected day
  const hourlyForSelectedDay = useMemo(() => {
    if (!hourly || !hourly.time) return [];
    const startIndex = selectedDayIndex * 24;
    const dayTimes = hourly.time.slice(startIndex, startIndex + 24);
    const dayTemps = hourly.temperature_2m.slice(startIndex, startIndex + 24);
    const dayCodes = hourly.weather_code.slice(startIndex, startIndex + 24);

    // 8 intervals matching Figma: 12 AM, 3 AM, 6 AM, 9 AM, 12 PM, 3 PM, 6 PM, 9 PM
    const intervals = [0, 3, 6, 9, 12, 15, 18, 21];
    return intervals.map((hourIdx) => {
      const timeStr = dayTimes[hourIdx] || dayTimes[0];
      return {
        time: formatHour(timeStr),
        temp: Math.round(dayTemps[hourIdx] ?? dayTemps[0] ?? 0),
        code: dayCodes[hourIdx] ?? dayCodes[0] ?? 0,
      };
    });
  }, [hourly, selectedDayIndex]);

  const currentSelectedDay = daysList[selectedDayIndex]?.label || 'Tuesday';

  return (
    <div className="bg-neutral-800 rounded-[20px] md:rounded-[24px] p-6 border border-neutral-700/60 shadow-card flex flex-col h-full">
      {/* Header with Day Selector Dropdown */}
      <div className="flex items-center justify-between mb-6 relative">
        <h3 className="text-xl font-bold font-heading text-neutral-0">
          Hourly forecast
        </h3>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDayDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={dayDropdownOpen}
            className="flex items-center gap-2.5 bg-neutral-700/60 hover:bg-neutral-700 text-neutral-0 text-sm font-medium px-4 py-2 rounded-xl border border-neutral-600/40 hover:border-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <span>{currentSelectedDay}</span>
            <img
              src="/assets/images/icon-dropdown.svg"
              alt=""
              className={`w-3 h-3 transition-transform duration-200 ${dayDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Days Dropdown Menu */}
          {dayDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDayDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-40 w-44 rounded-xl bg-neutral-800 border border-neutral-700 shadow-dropdown py-1 overflow-hidden">
                {daysList.map((d) => (
                  <button
                    key={d.index}
                    type="button"
                    onClick={() => {
                      setSelectedDayIndex(d.index);
                      setDayDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                      selectedDayIndex === d.index
                        ? 'text-neutral-0 font-semibold bg-neutral-700/60'
                        : 'text-neutral-200 hover:bg-neutral-700/30'
                    }`}
                  >
                    <span>{d.label}</span>
                    {selectedDayIndex === d.index && (
                      <img
                        src="/assets/images/icon-checkmark.svg"
                        alt="selected"
                        className="w-3.5 h-3.5"
                      />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hourly List (8 cards, 60px height each, 16px gap) */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1 scrollbar-thin">
        {hourlyForSelectedDay.map((h, i) => {
          const info = getWeatherInfo(h.code);
          return (
            <div
              key={h.time + i}
              className="flex items-center justify-between bg-neutral-700/40 hover:bg-neutral-700/70 hover:border-neutral-500 transition-all rounded-xl px-4 h-[60px] border border-neutral-700/40 shadow-sm"
            >
              <span className="text-sm font-medium text-neutral-200 w-20">
                {h.time}
              </span>
              <img
                src={info.icon}
                alt={info.label}
                className="w-9 h-9 object-contain drop-shadow-sm"
              />
              <span className="text-base font-bold font-heading text-neutral-0 text-right w-16">
                {h.temp}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
