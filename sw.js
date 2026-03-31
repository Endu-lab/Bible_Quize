const CACHE_NAME = 'bible-quiz-v1';
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// አፑ ሲጫን ፋይሎቹን "Cache" ለማድረግ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// አፑ እንዲከፈትና እንዲሰራ (በጣም አስፈላጊው ክፍል)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
