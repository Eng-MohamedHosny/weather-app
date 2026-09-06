function getArabicVariations(str) {
  const list = [str];
  const clean = str.replace(/[\u064B-\u065F]/g, '');
  if (clean !== str) list.push(clean);

  // Hamza variations
  if (/^[اأإآ]/.test(clean)) {
    const rest = clean.slice(1);
    list.push('ا' + rest, 'أ' + rest, 'إ' + rest, 'آ' + rest);
  }
  // Remove 'ال' prefix if query is longer than 3 letters
  if (clean.startsWith('ال') && clean.length > 3) {
    const withoutAl = clean.slice(2);
    list.push(withoutAl);
    if (/^[اأإآ]/.test(withoutAl)) {
      const rest = withoutAl.slice(1);
      list.push('ا' + rest, 'أ' + rest, 'إ' + rest, 'آ' + rest);
    }
  }
  return [...new Set(list)];
}

export async function searchLocations(query, lang = 'en') {
  if (!query || query.trim().length < 2) return [];
  const trimmed = query.trim();
  const isArabicQuery = /[\u0600-\u06FF]/.test(trimmed);
  const preferredLang = isArabicQuery || lang === 'ar' ? 'ar' : 'en';

  // 1. Try Open-Meteo with preferred language
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=6&language=${preferredLang}&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results;
      }
    }
  } catch (e) {
    console.error('Open-Meteo primary search error:', e);
  }

  // 2. If Arabic query produced no results, try variations in Open-Meteo
  if (isArabicQuery) {
    const variations = getArabicVariations(trimmed).filter((v) => v !== trimmed);
    for (const v of variations.slice(0, 3)) {
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(v)}&count=6&language=ar&format=json`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            return data.results;
          }
        }
      } catch (e) {}
    }

    // 3. Fallback to Nominatim for Arabic queries with compound names or rare spellings
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&accept-language=ar&limit=6&addressdetails=1`;
      const nomRes = await fetch(nomUrl, {
        headers: { 'User-Agent': 'WeatherNowApp/1.0' },
      });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (nomData && nomData.length > 0) {
          return nomData.map((item) => ({
            id: item.place_id,
            name: item.name || (item.display_name ? item.display_name.split(',')[0] : trimmed),
            country: item.address?.country || '',
            admin1: item.address?.state || item.address?.region || '',
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
          }));
        }
      }
    } catch (e) {
      console.error('Nominatim fallback error:', e);
    }
  } else if (lang === 'ar') {
    // If query is English but app UI is in Arabic, fallback to language=en if language=ar had no match
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) return data.results;
      }
    } catch (e) {}
  }

  return [];
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
