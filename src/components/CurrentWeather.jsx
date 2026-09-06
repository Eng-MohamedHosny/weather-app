import React from 'react';
import { getWeatherInfo, formatFullDate } from '../utils/weatherCodes';

export default function CurrentWeather({ location, weather, units }) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const info = getWeatherInfo(current.weather_code);
  const tempRounded = Math.round(current.temperature_2m);
  const dateFormatted = formatFullDate(current.time);

  return (
    <div className="relative overflow-hidden rounded-[20px] md:rounded-[24px] bg-gradient-to-r from-[#2a1b9c] to-[#4558d8] p-6 sm:p-8 md:p-10 shadow-card min-h-[286px] flex flex-col justify-between">
      {/* Background decoration SVG */}
      <img
        src="/assets/images/bg-today-large.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30 mix-blend-overlay hidden md:block"
      />
      <img
        src="/assets/images/bg-today-small.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30 mix-blend-overlay md:hidden"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 my-auto text-center md:text-left">
        {/* Location & Date */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-neutral-0 tracking-tight">
            {location.name}
            {location.country ? `, ${location.country}` : ''}
          </h2>
          <p className="text-neutral-200 text-sm sm:text-base mt-2 font-medium">
            {dateFormatted}
          </p>
        </div>

        {/* Temperature & Icon */}
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={info.icon}
            alt={info.label}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] object-contain drop-shadow-md"
          />
          <div className="flex items-start">
            <span className="text-7xl sm:text-8xl md:text-[96px] font-bold font-heading text-neutral-0 leading-none tracking-tight">
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
