import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function WeatherMetrics({ current, units }) {
  const { t, lang } = useLanguage();
  if (!current) return null;

  const feelsLike = Math.round(current.apparent_temperature ?? current.temperature_2m);
  const humidity = current.relative_humidity_2m ?? 0;
  const windSpeed = Math.round(current.wind_speed_10m ?? 0);
  const windUnit = units.windSpeed === 'mph' ? (lang === 'ar' ? 'ميل/س' : 'mph') : (lang === 'ar' ? 'كم/س' : 'km/h');
  const precipitation = current.precipitation ?? 0;
  const precipUnit = units.precipitation === 'inch' ? (lang === 'ar' ? 'إنش' : 'in') : (lang === 'ar' ? 'مم' : 'mm');

  const metrics = [
    {
      id: 'feels_like',
      label: t('feelsLike'),
      value: `${feelsLike}°`,
    },
    {
      id: 'humidity',
      label: t('humidity'),
      value: `${humidity}%`,
    },
    {
      id: 'wind',
      label: t('wind'),
      value: `${windSpeed} ${windUnit}`,
    },
    {
      id: 'precipitation',
      label: t('precipitationLabel'),
      value: `${precipitation} ${precipUnit}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-6">
      {metrics.map((m) => (
        <div
          key={m.id}
          className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700/60 shadow-card flex flex-col justify-between min-h-[118px] transition-transform hover:-translate-y-0.5 duration-200"
        >
          <span className="text-neutral-300 text-sm font-medium">{m.label}</span>
          <span className="text-2xl sm:text-3xl md:text-[32px] font-bold font-heading text-neutral-0 mt-3 tracking-tight leading-none">
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
}
