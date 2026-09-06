import React from 'react';

export default function WeatherMetrics({ current, units }) {
  if (!current) return null;

  const feelsLike = Math.round(current.apparent_temperature ?? current.temperature_2m);
  const humidity = current.relative_humidity_2m ?? 0;
  const windSpeed = Math.round(current.wind_speed_10m ?? 0);
  const windUnit = units.windSpeed === 'mph' ? 'mph' : 'km/h';
  const precipitation = current.precipitation ?? 0;
  const precipUnit = units.precipitation === 'inch' ? 'in' : 'mm';

  const metrics = [
    {
      id: 'feels_like',
      label: 'Feels like',
      value: `${feelsLike}°`,
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${humidity}%`,
    },
    {
      id: 'wind',
      label: 'Wind',
      value: `${windSpeed} ${windUnit}`,
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      value: `${precipitation} ${precipUnit}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {metrics.map((m) => (
        <div
          key={m.id}
          className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700/60 shadow-card flex flex-col justify-between min-h-[118px] transition-transform hover:-translate-y-0.5 duration-200"
        >
          <span className="text-neutral-300 text-sm font-medium">{m.label}</span>
          <span className="text-2xl sm:text-3xl font-bold font-heading text-neutral-0 mt-3 tracking-tight">
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
}
