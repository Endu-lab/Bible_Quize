const cacheName = 'qal-bible-quiz-v3';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// መተግበሪያውን በስልኩ ወይም በኮምፒውተሩ ላይ መጫን
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('አይኮኖች እና ፋይሎች በመጫን ላይ ናቸው...');
      return cache.addAll(assets);
    })
  );
});

// ያለ ኢንተርኔት እንዲሰራ መረጃዎችን መጥራት
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
