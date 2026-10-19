const CACHE_NAME = 'bajbeln-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/scripts/pagescript.js',
  '/scripts/settings.js',
  '/scripts/songIndexCache.js',
  '/scripts/searchscript.js',
  '/scripts/footer.js',
  '/songIndex.json',
  '/manifest.json',
  '/site.webmanifest',
  '/assets/images/logga.webp',
  '/assets/images/song-link-button.webp',
  '/assets/images/song-link-feedback.webp',
  '/assets/images/spex-fact-button.webp',
  '/assets/images/manifest/favicon-96x96.png',
  '/assets/images/manifest/apple-touch-icon.png',
  '/assets/images/manifest/web-app-manifest-192x192.png',
  '/assets/images/manifest/web-app-manifest-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn('Pre-cache error (continuing anyway):', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests from our own origin
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // For HTML navigations: use the current deployment when online, with
  // the cached page as an offline fallback.
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() =>
            cache.match(request).then((cachedResponse) => {
              return cachedResponse || caches.match('/');
            })
          );
      })
    );
    return;
  }

  // For static assets: Cache-First with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
