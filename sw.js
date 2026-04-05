const cacheName = 'qal-bible-quiz-v4';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // ለእያንዳንዱ ፋይል የ Vary ሄደር ችግርን ለመፍታት 'request' በመፍጠር መጫን
      return Promise.all(
        assets.map((url) => {
          return fetch(url).then((response) => {
            if (!response.ok) throw new TypeError('Bad response status');
            return cache.put(url, response);
          }).catch(err => console.log('ሊጫን አልቻለም:', url, err));
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});