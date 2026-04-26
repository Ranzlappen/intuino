/* ══════════════════════════════════════════════════════════
   IntuiNO — Service Worker (Workbox via CDN)
   ══════════════════════════════════════════════════════════ */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  // ─── PRECACHE CRITICAL ASSETS ───
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '3' },
    { url: '/index.html', revision: '3' },
    { url: '/styles.css', revision: '3' },
    { url: '/js/core.js', revision: '3' },
    { url: '/manifest.json', revision: '1' },
    { url: '/js/chaos-engine.js', revision: '1' },
    { url: '/js/effects.js', revision: '2' },
    { url: '/js/audio.js', revision: '1' },
    { url: '/js/meta-chaos.js', revision: '1' },
    { url: '/js/easter-eggs.js', revision: '1' },
    { url: '/js/social.js', revision: '1' },
    { url: '/js/onboarding.js', revision: '2' },
    { url: '/js/levels/level1.js', revision: '2' },
    { url: '/js/levels/level2.js', revision: '2' },
    { url: '/js/levels/level3.js', revision: '1' },
    { url: '/js/levels/level4.js', revision: '1' },
    { url: '/js/levels/level5.js', revision: '1' },
    { url: '/js/levels/level6.js', revision: '1' },
    { url: '/js/levels/level7.js', revision: '2' },
    { url: '/js/levels/level8.js', revision: '1' },
    { url: '/js/levels/level9.js', revision: '1' },
    { url: '/js/levels/boss.js', revision: '1' },
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
