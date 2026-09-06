const CACHE_NAME = 'weather-now-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/pwa-icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/assets/images/logo.svg',
  '/assets/images/icon-units.svg',
  '/assets/images/icon-dropdown.svg',
  '/assets/images/icon-search.svg',
  '/assets/images/icon-loading.svg',
  '/assets/images/icon-error.svg',
  '/assets/images/icon-retry.svg',
  '/assets/images/icon-checkmark.svg',
  '/assets/images/bg-today-large.svg',
  '/assets/images/bg-today-small.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Open-Meteo & Geocoding API: Network first, fallback to cache
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('geojs.io') || url.hostname.includes('ipwho.is')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // HTML Navigation: Network first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html') || caches.match('/'))
    );
    return;
  }

  // Static assets: Cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
