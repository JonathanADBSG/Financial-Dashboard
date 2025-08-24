// Define a name for the cache
const CACHE_NAME = 'financial-report-v1';

// List the files to be cached. This is the "app shell".
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Installation
// This event listener is triggered when the service worker is first installed.
self.addEventListener('install', event => {
  // We wait until the installation phase is complete.
  event.waitUntil(
    // Open the cache with the defined name.
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified URLs to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activation
// This event listener cleans up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            // If a cache's name is not our current one, delete it.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch
// This event listener intercepts network requests.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Check if the requested asset is in the cache.
    caches.match(event.request)
      .then(response => {
        // If the asset is in the cache, return it from the cache.
        if (response) {
          return response;
        }
        // If the asset is not in the cache, fetch it from the network.
        return fetch(event.request);
      }
    )
  );
});