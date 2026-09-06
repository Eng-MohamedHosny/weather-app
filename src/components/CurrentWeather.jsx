import React from 'react';
import { getWeatherInfo, formatFullDate } from '../utils/weatherCodes';

export default function CurrentWeather({ location, weather, units }) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const info = getWeatherInfo(current.weather_code);
  const tempRounded = Math.round(current.temperature_2m);
  const dateFormatted = formatFullDate(current.time);

  return (
    <div
      className="relative overflow-hidden rounded-[20px] md:rounded-[24px] shadow-card min-h-[286px] flex flex-col justify-center p-6 sm:p-8 md:p-8 lg:p-10 bg-cover bg-center bg-no-repeat transition-all bg-[url('/assets/images/bg-today-small.svg')] md:bg-[url('/assets/images/bg-today-large.svg')]"
      style={{
        backgroundColor: '#2b1b9c',
      }}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 my-auto text-center md:text-left w-full">
        {/* Location & Date */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold font-heading text-neutral-0 tracking-tight leading-snug drop-shadow-sm">
            {location.name}
            {location.country ? `, ${location.country}` : ''}
          </h2>
          <p className="text-neutral-200 text-sm sm:text-base mt-2 font-medium tracking-wide">
            {dateFormatted}
          </p>
        </div>

        {/* Temperature & Icon */}
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={info.icon}
            alt={info.label}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-[110px] md:h-[110px] lg:w-[120px] lg:h-[120px] object-contain drop-shadow-lg"
          />
          <div className="flex items-start">
            <span className="text-6xl sm:text-7xl md:text-[96px] font-bold font-heading text-neutral-0 leading-none tracking-tighter">
              {tempRounded}
            </span>
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-200 ml-1">
              °
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
