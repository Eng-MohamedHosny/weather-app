import React from 'react';
import { getWeatherInfo, formatDayName } from '../utils/weatherCodes';
import { useLanguage } from '../context/LanguageContext';

export default function DailyForecast({ daily }) {
  const { t, lang } = useLanguage();
  if (!daily || !daily.time) return null;

  const days = daily.time.slice(0, 7).map((dateStr, idx) => ({
    date: dateStr,
    dayLabel: idx === 0 ? t('today') : formatDayName(dateStr, true, lang),
    code: daily.weather_code[idx],
    maxTemp: Math.round(daily.temperature_2m_max[idx]),
    minTemp: Math.round(daily.temperature_2m_min[idx]),
  }));

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold font-heading text-neutral-0 mb-4 tracking-tight text-left rtl:text-right">
        {t('dailyForecast')}
      </h3>

      {/* Fluid responsive grid: 3 columns on mobile (<768px), 7 columns on tablet (768px+) & desktop */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-3 md:gap-4">
        {days.map((d, index) => {
          const info = getWeatherInfo(d.code);
          return (
            <div
              key={d.date + index}
              className="bg-neutral-800 rounded-2xl p-3.5 sm:p-4 border border-neutral-700/60 shadow-card flex flex-col items-center justify-between text-center min-h-[160px] sm:min-h-[165px] transition-all hover:-translate-y-1 hover:border-neutral-500 duration-200"
            >
              <span className="text-sm font-medium text-neutral-200">
                {d.dayLabel}
              </span>
              <img
                src={info.icon}
                alt={info.label}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain my-2 drop-shadow"
              />
              {/* Max on LEFT (bold white), Min on RIGHT (muted gray) */}
              <div className="flex items-center justify-between w-full text-sm font-medium px-1">
                <span className="text-neutral-0 font-bold">{d.maxTemp}°</span>
                <span className="text-neutral-300">{d.minTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
