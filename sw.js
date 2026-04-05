const cacheName = 'qal-bible-quiz-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// መረጃዎችን በስልኩ ሜሞሪ ውስጥ መጫን (Install)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// ኢንተርኔት በሌለበት ጊዜ አፑ እንዲሰራ ማድረግ (Fetch)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
