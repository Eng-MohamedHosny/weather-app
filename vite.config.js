import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function locationDevPlugin() {
  return {
    name: 'location-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/location', async (req, res) => {
        try {
          const response = await fetch('https://api.ip2location.io/');
          const data = await response.json();
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

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(
            JSON.stringify({
              name: displayName,
              city: city,
              region: region,
              country: data.country_name || 'Egypt',
              latitude: parseFloat(data.latitude),
              longitude: parseFloat(data.longitude),
              source: 'ip2location',
              isPrecise: true,
            })
          );
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), locationDevPlugin()],
});
