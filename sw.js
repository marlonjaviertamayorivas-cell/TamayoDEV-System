self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('tamayodev-store').then((cache) => {
      return cache.addAll(['index.html', 'styles.css', 'script.js']);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});