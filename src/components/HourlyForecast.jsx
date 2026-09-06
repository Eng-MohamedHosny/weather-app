import React, { useState, useMemo } from 'react';
import { getWeatherInfo, formatDayName, formatHour } from '../utils/weatherCodes';
import { useLanguage } from '../context/LanguageContext';

export default function HourlyForecast({ hourly, daily }) {
  const { t, lang } = useLanguage();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);

  // Available 7 days
  const daysList = useMemo(() => {
    if (!daily || !daily.time) return [];
    return daily.time.slice(0, 7).map((dateStr, idx) => ({
      index: idx,
      date: dateStr,
      label: idx === 0 ? t('today') : formatDayName(dateStr, false, lang),
    }));
  }, [daily, lang, t]);

  // Extract hourly data for the selected day
  const hourlyForSelectedDay = useMemo(() => {
    if (!hourly || !hourly.time) return [];
    const startIndex = selectedDayIndex * 24;
    const dayTimes = hourly.time.slice(startIndex, startIndex + 24);
    const dayTemps = hourly.temperature_2m.slice(startIndex, startIndex + 24);
    const dayCodes = hourly.weather_code.slice(startIndex, startIndex + 24);

    // If it's today (index 0), find current hour or show 8 hours starting around afternoon / current
    const currentHour = new Date().getHours();
    let startHour = 0;
    if (selectedDayIndex === 0) {
      // Find nearest hour index
      startHour = Math.min(Math.max(0, currentHour), 16);
    } else {
      startHour = 6; // Default daytime starting at 6 AM or consecutive 8 hours
    }

    // Pick 8 hours
    const result = [];
    for (let i = 0; i < 8; i++) {
      const idx = (startHour + i) % 24;
      result.push({
        time: formatHour(dayTimes[idx] || dayTimes[0], lang),
        temp: Math.round(dayTemps[idx] ?? 0),
        code: dayCodes[idx] ?? 0,
      });
    }
    return result;
  }, [hourly, selectedDayIndex, lang]);

  const currentSelectedDay = daysList[selectedDayIndex]?.label || (lang === 'ar' ? 'اليوم' : 'Today');

  return (
    <div className="bg-neutral-800 rounded-[20px] md:rounded-[24px] p-5 sm:p-6 border border-neutral-700/60 shadow-card flex flex-col h-full">
      {/* Header with Day Selector Dropdown */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 relative">
        <h3 className="text-xl font-bold font-heading text-neutral-0 tracking-tight text-left rtl:text-right">
          {t('hourlyForecast')}
        </h3>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDayDropdownOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={dayDropdownOpen}
            className="flex items-center gap-2.5 bg-neutral-700/60 hover:bg-neutral-700 text-neutral-0 text-sm font-medium px-4 py-2 rounded-xl border border-neutral-600/40 hover:border-neutral-500 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
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
              <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 z-40 w-48 rounded-2xl bg-neutral-800 border border-neutral-700 shadow-dropdown p-1.5 overflow-hidden">
                {daysList.map((d) => (
                  <button
                    key={d.index}
                    type="button"
                    onClick={() => {
                      setSelectedDayIndex(d.index);
                      setDayDropdownOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-3.5 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between ${
                      selectedDayIndex === d.index
                        ? 'text-neutral-0 font-semibold bg-neutral-700/70'
                        : 'text-neutral-200 hover:bg-neutral-700/40'
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

      {/* Hourly List: [Icon + Time] on LEFT, [Temp] on RIGHT */}
      <div className="flex flex-col gap-3 sm:gap-3.5">
        {hourlyForSelectedDay.map((h, i) => {
          const info = getWeatherInfo(h.code);
          return (
            <div
              key={h.time + i}
              className="flex items-center justify-between bg-neutral-700/40 hover:bg-neutral-700/60 transition-colors rounded-xl px-4 h-[58px] sm:h-[60px] border border-neutral-700/30"
            >
              {/* Left group: Weather icon + Time */}
              <div className="flex items-center gap-3">
                <img
                  src={info.icon}
                  alt={info.label}
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm"
                />
                <span className="text-sm sm:text-base font-medium text-neutral-200">
                  {h.time}
                </span>
              </div>

              {/* Right: Temperature */}
              <span className="text-base sm:text-lg font-bold font-heading text-neutral-0">
                {h.temp}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
