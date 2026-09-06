export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '';

  // 1. IP2Location (exact service provider for Geolocation.com)
  try {
    const ipUrl = clientIp
      ? `https://api.ip2location.io/?ip=${encodeURIComponent(clientIp)}`
      : 'https://api.ip2location.io/';
    const response = await fetch(ipUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.latitude && data.longitude) {
        let city = data.city_name && data.city_name !== '-' ? data.city_name : '';
        let region = data.region_name && data.region_name !== '-' ? data.region_name : '';

        if (region === 'Suhaj' || region === 'Sawhaj') region = 'Sohag';
        if (city === 'Suhaj' || city === 'Sawhaj') city = 'Sohag';

        let displayName = city;
        if (city && region && city !== region) {
          displayName = `${city}, ${region}`;
        } else if (!city && region) {
          displayName = region;
        } else if (!displayName) {
          displayName = 'Sohag';
        }

        return res.status(200).json({
          name: displayName,
          city: city,
          region: region,
          country: data.country_name || 'Egypt',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          source: 'ip2location',
          isPrecise: true,
        });
      }
    }
  } catch (err) {
    console.error('IP2Location fetch error in api/location:', err);
  }

  // 2. Fallback: FreeIPApi
  try {
    const freeIpUrl = clientIp
      ? `https://freeipapi.com/api/json/${encodeURIComponent(clientIp)}`
      : 'https://freeipapi.com/api/json';
    const freeRes = await fetch(freeIpUrl);
    if (freeRes.ok) {
      const data = await freeRes.json();
      if (data.latitude && data.longitude) {
        let city = data.cityName && data.cityName !== '-' ? data.cityName : '';
        let region = data.regionName && data.regionName !== '-' ? data.regionName : '';
        if (region === 'Suhaj' || region === 'Sawhaj') region = 'Sohag';
        if (city === 'Suhaj' || city === 'Sawhaj') city = 'Sohag';

        let displayName = city;
        if (city && region && city !== region) {
          displayName = `${city}, ${region}`;
        } else if (!city && region) {
          displayName = region;
        } else if (!displayName) {
          displayName = 'Sohag';
        }

        return res.status(200).json({
          name: displayName,
          city: city,
          region: region,
          country: data.countryName || 'Egypt',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          source: 'freeipapi',
          isPrecise: true,
        });
      }
    }
  } catch (err) {
    console.error('FreeIPApi error in api/location:', err);
  }

  // 3. Fallback default
  return res.status(200).json({
    name: 'Sohag',
    country: 'Egypt',
    latitude: 26.5569,
    longitude: 31.6948,
    isPrecise: true,
  });
}
