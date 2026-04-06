/* ══════════════════════════════════════════════════════════
   IntuiNO — Service Worker (Workbox via CDN)
   ══════════════════════════════════════════════════════════ */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/latest/workbox-sw.js');

if (workbox) {
  // ─── PRECACHE CRITICAL ASSETS ───
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/styles.css', revision: '1' },
    { url: '/app.js', revision: '1' },
    { url: '/manifest.json', revision: '1' },
  ]);

  // ─── HTML: NETWORK-FIRST WITH CACHE FALLBACK ───
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'intuino-html',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 10 }),
      ],
    })
  );

  // ─── CSS & JS: CACHE-FIRST ───
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.CacheFirst({
      cacheName: 'intuino-static',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // ─── IMAGES: CACHE-FIRST ───
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'intuino-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // ─── FONTS (Google Fonts): CACHE-FIRST ───
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'intuino-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        }),
      ],
    })
  );

  // ─── CDN ASSETS (Tailwind, GSAP): STALE-WHILE-REVALIDATE ───
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://cdn.tailwindcss.com' ||
      url.origin === 'https://cdnjs.cloudflare.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'intuino-cdn',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    })
  );

  // ─── CLEANUP OLD CACHES ON ACTIVATE ───
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !name.startsWith('workbox-') && !name.startsWith('intuino-'))
            .map((name) => caches.delete(name))
        )
      )
    );
  });
} else {
  console.warn('[IntuiNO SW] Workbox failed to load.');
}
