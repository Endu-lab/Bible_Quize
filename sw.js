const CACHE_NAME = 'qal-v6'; // ስሙን ወደ v6 ቀይረነዋል (ለውጡን እንዲያውቅ)
const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// አፑ ሲጫን ፋይሎቹን ሴቭ ያደርጋል
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        assets.map((url) => {
          return cache.add(url).catch(() => console.log("Missing: " + url));
        })
      );
    })
  );
});

// አዲሱ ሰርቪስ ወርከር ወዲያው ስራ እንዲጀምር
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// ፋይሎችን ከCache ወይም ከኢንተርኔት ያመጣል
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});