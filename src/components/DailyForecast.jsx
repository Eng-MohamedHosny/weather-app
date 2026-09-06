import React from 'react';
import { getWeatherInfo, formatDayName } from '../utils/weatherCodes';

export default function DailyForecast({ daily }) {
  if (!daily || !daily.time) return null;

  const days = daily.time.slice(0, 7).map((dateStr, idx) => ({
    date: dateStr,
    dayLabel: idx === 0 ? 'Today' : formatDayName(dateStr, true),
    code: daily.weather_code[idx],
    maxTemp: Math.round(daily.temperature_2m_max[idx]),
    minTemp: Math.round(daily.temperature_2m_min[idx]),
  }));

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold font-heading text-neutral-0 mb-4">
        Daily forecast
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
        {days.map((d, index) => {
          const info = getWeatherInfo(d.code);
          return (
            <div
              key={d.date + index}
              className="bg-neutral-800 rounded-2xl p-4 border border-neutral-700/60 shadow-card flex flex-col items-center justify-between text-center min-h-[165px] transition-all hover:-translate-y-1 hover:border-neutral-500 duration-200"
            >
              <span className="text-sm font-medium text-neutral-200">
                {d.dayLabel}
              </span>
              <img
                src={info.icon}
                alt={info.label}
                className="w-[60px] h-[60px] object-contain my-2 drop-shadow"
              />
              <div className="flex items-center justify-between w-full text-sm font-medium px-2">
                <span className="text-neutral-300">{d.minTemp}°</span>
                <span className="text-neutral-0 font-bold">{d.maxTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
