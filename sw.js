const CACHE_NAME = 'qal-bible-quiz-v2.1'; // ስሪቱን ቀይረነዋል (Update ለማስገደድ)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://raw.githubusercontent.com/Endu-lab/Bible_Quize/main/assets/sounds/correct.mp3',
    'https://raw.githubusercontent.com/Endu-lab/Bible_Quize/main/assets/sounds/wrong.mp3'
];

// 1. Install Event: ፋይሎችን ወደ ስልኩ Memory (Cache) መጫን
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting()) // አዲሱ Service Worker ወዲያው እንዲነቃ
    );
});

// 2. Activate Event: የድሮ ካሽ (Old Cache) ካለ ማጥፋት
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // አዲሱ ስሪት በሁሉም ገጾች ላይ እንዲሰራ
    );
});

// 3. Fetch Event: ኢንተርኔት ባይኖር እንኳ ካሽ የተደረጉ ፋይሎችን መጠቀም
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});