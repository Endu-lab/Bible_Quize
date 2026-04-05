const cacheName = 'qal-bible-quiz-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      // አንድ ፋይል ባይኖር እንኳን እንዳይከሽፍ በ isolate መልክ መጫን ይሻላል
      return cache.addAll(assets).catch(err => console.log("Cache error:", err));
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
