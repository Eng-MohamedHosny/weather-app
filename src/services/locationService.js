/**
 * IP & GPS Location Services for Weather Now
 */

// Fallback default (Berlin, Germany) if both IP & GPS fail
export const DEFAULT_FALLBACK_LOCATION = {
  name: 'Berlin',
  country: 'Germany',
  latitude: 52.5244,
  longitude: 13.4105,
  isPrecise: false,
};

/**
 * Fetch user location based on public IP address
 */
export async function getIpLocation() {
  // Method 1: GeoJS (Fast, HTTPS, zero CORS restrictions)
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

  // Method 2: IPWho.is backup
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

/**
 * Request high-precision GPS coordinates from browser Geolocation API
 * and reverse-geocode to human-readable city & country.
 */
export function getPreciseLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Reverse-geocode via BigDataCloud client API (free, client-side, no key)
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const cityName =
              data.city ||
              data.locality ||
              data.principalSubdivision ||
              'Your Location';
            const countryName = data.countryName || '';

            resolve({
              name: cityName,
              country: countryName,
              latitude: lat,
              longitude: lon,
              isPrecise: true,
            });
            return;
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }

        // If reverse-geocoding fails, still resolve with coordinates
        resolve({
          name: 'Current Location',
          country: '',
          latitude: lat,
          longitude: lon,
          isPrecise: true,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  });
}
