// 1. Update the cache name to a new version
const CACHE_NAME = 'financial-report-v3';

// List the files to be cached. This is the "app shell".
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 2. Force the new service worker to become active immediately
        return self.skipWaiting();
      })
  );
});

// Activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            // If a cache's name is not our current one, delete it.
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        // 3. Take control of all open tabs immediately
        return self.clients.claim();
      });
    })
  );
});

// Fetch (Cache-First Strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the asset is in the cache, return it. Otherwise, fetch from network.
        return response || fetch(event.request);
      }
    )
  );
});

