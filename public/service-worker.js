const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/global.css',
  '/build/bundle.css',
  '/build/bundle.js',
  '/static/camera_small.png',
  '/static/camera.png',
  '/favicon.png',
  'service-worker.js',
];

// Install event - handles the caching of the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // After caching, skip waiting to immediately activate the service worker
        return self.skipWaiting();
      })
      .then(() => {
        // Show a notification after caching
        self.registration.showNotification('App ready for offline use');
      })
      .catch((error) => {
        console.error('Caching failed:', error);
      })
  );
});

// Activate event - cleans up any old cache
self.addEventListener('activate', (event) => {
  var cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim any clients immediately so the new service worker takes control of the page
      return self.clients.claim();
    })
  );
});

// Fetch event - serves app shell from cache and fetches updates from network when possible
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        let fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            let responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch((error) => {
          console.error('Fetching failed:', error);
          throw error;
        });
      }).catch((error) => {
        console.error('Fetching failed:', error);
        throw error;
      })
  );
});
