const CACHE_NAME = 'bajbeln-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/scripts/pagescript.js',
  '/scripts/settings.js',
  '/scripts/songIndexCache.js',
  '/scripts/searchscript.js',
  '/scripts/footer.js',
  '/scripts/lazy-load-polyfill.js',
  '/scripts/lazy-css.js',
  '/songIndex.json',
  '/site.webmanifest',
  '/favicon.ico',
  '/assets/images/logga.webp',
  '/assets/images/song-link-button.webp',
  '/assets/images/song-link-feedback.webp',
  '/assets/images/spex-fact-button.webp',
  '/assets/images/manifest/favicon-16x16.png',
  '/assets/images/manifest/favicon-32x32.png',
  '/assets/images/manifest/favicon-48x48.png',
  '/assets/images/manifest/favicon-64x64.png',
  '/assets/images/manifest/favicon-96x96.png',
  '/assets/images/manifest/favicon-128x128.png',
  '/assets/images/manifest/favicon-256x256.png',
  '/assets/images/manifest/favicon.svg',
  '/assets/images/manifest/apple-touch-icon.png',
  '/assets/images/manifest/web-app-manifest-192x192.png',
  '/assets/images/manifest/web-app-manifest-512x512.png',
  '/assets/images/og-image.webp',
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

  // For HTML navigations: Network-first with offline fallback
  // This ensures users get the latest content when online, but can still
  // navigate to cached pages when offline
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(request)
          .then((networkResponse) => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // If fetch fails, try to return cached version
            return cache.match(request).then((cachedResponse) => {
              // If no cached version exists, return the index page as a fallback
              return cachedResponse || cache.match('/') || cache.match('/index.html');
            });
          });
      })
    );
    return;
  }

  // For static assets: Stale-while-revalidate strategy
  // Serve cached content immediately, but update cache in background
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response immediately if available
      const responsePromise = cachedResponse || fetch(request);

      // Update cache in background if we have a cached version
      if (cachedResponse) {
        fetch(request).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {}); // Silently handle cache update failures
      }

      return responsePromise;
    })
  );
});

// Listen for push notifications (for future PWA features)
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  const title = data?.title || 'Bajbeln';
  const options = {
    body: data?.body || 'Ny notis',
    icon: '/assets/images/manifest/web-app-manifest-192x192.png',
    badge: '/assets/images/manifest/favicon-96x96.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
