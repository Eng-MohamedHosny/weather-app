/**
 * IP & GPS Location Services for Weather Now
 */

export const STORAGE_KEY = 'weather_now_precise_location';

export const DEFAULT_FALLBACK_LOCATION = {
  name: 'Berlin',
  country: 'Germany',
  latitude: 52.5244,
  longitude: 13.4105,
  isPrecise: false,
};

/**
 * Get cached precise location from localStorage if available
 */
export function getSavedLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.latitude && parsed.longitude) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed reading saved location from storage:', e);
  }
  return null;
}

/**
 * Reverse geocode latitude & longitude to human-readable city and country
 * Priority: OpenStreetMap Nominatim -> Photon Komoot -> BigDataCloud
 */
export async function reverseGeocode(lat, lon) {
  // Method 1: OpenStreetMap Nominatim
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`,
      {
        headers: { 'User-Agent': 'WeatherNowApp/1.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      let cityName =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        addr.state_district ||
        addr.state ||
        'Current Location';

      // Standardize common transliterations
      if (cityName === 'Suhaj' || cityName === 'Sawhaj') {
        cityName = 'Sohag';
      }

      const countryName = addr.country || '';

      return {
        name: cityName,
        country: countryName,
        latitude: lat,
        longitude: lon,
        isPrecise: true,
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode failed, trying backup:', err);
  }

  // Method 2: Photon Komoot
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const props = data.features?.[0]?.properties || {};
      let cityName = props.city || props.town || props.locality || props.state || 'Current Location';

      if (cityName === 'Suhaj' || cityName === 'Sawhaj') {
        cityName = 'Sohag';
      }

      return {
        name: cityName,
        country: props.country || '',
        latitude: lat,
        longitude: lon,
        isPrecise: true,
      };
    }
  } catch (err) {
    console.warn('Photon reverse geocode failed:', err);
  }

  return {
    name: 'Current Location',
    country: '',
    latitude: lat,
    longitude: lon,
    isPrecise: true,
  };
}

/**
 * Request high-precision GPS coordinates from browser Geolocation API
 */
export function getPreciseLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Attempt 1: Fast WiFi/cellular triangulation (works on PC/Laptops without GPS chip)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const location = await reverseGeocode(lat, lon);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
        } catch (e) {}
        resolve(location);
      },
      (err) => {
        // Attempt 2: Fallback to high accuracy if low accuracy failed
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const location = await reverseGeocode(lat, lon);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
            } catch (e) {}
            resolve(location);
          },
          (highErr) => {
            reject(highErr || err);
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  });
}

/**
 * Fetch user location based on public IP address (approximate)
 */
export async function getIpLocation() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://get.geojs.io/v1/ip/geo.json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          name: data.city || data.region || 'Current Area',
          country: data.country || '',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          isPrecise: false,
        };
      }
    }
  } catch (err) {
    console.warn('GeoJS IP lookup failed, trying backup...', err);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipwho.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.latitude && data.longitude) {
        return {
          name: data.city || data.region || 'Current Area',
          country: data.country || '',
          latitude: data.latitude,
          longitude: data.longitude,
          isPrecise: false,
        };
      }
    }
  } catch (err) {
    console.warn('IPWho.is IP lookup failed:', err);
  }

  return DEFAULT_FALLBACK_LOCATION;
}
