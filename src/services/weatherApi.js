export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to search locations');
  }
  const data = await res.json();
  return data.results || [];
}

export async function fetchWeatherData(lat, lon, units = { temperature: 'celsius', windSpeed: 'kmh', precipitation: 'mm' }) {
  const tempUnitParam = units.temperature === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  const windUnitParam = units.windSpeed === 'mph' ? 'mph' : 'kmh';
  const precipUnitParam = units.precipitation === 'inch' ? 'inch' : 'mm';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=${tempUnitParam}&wind_speed_unit=${windUnitParam}&precipitation_unit=${precipUnitParam}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch weather forecast');
  }
  return await res.json();
}
