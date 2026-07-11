const CACHE = 'boluo2-v1';
const PRECACHE = [
  './', './index.html', './manifest.json',
  './css/style.css',
  './js/app.js', './js/chat.js', './js/dashboard.js',
  './js/agents.js', './js/mcp.js', './js/settings.js',
  './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return fetch(e.request).then(r => {
        if (r && r.status === 200) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); }
        return r;
      }).catch(() => cached);
    })
  );
});