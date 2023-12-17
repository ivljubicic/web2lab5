const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/global.css',
  '/build/bundle.css',
  '/build/bundle.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache-name').then((cache) => {
        return cache.addAll([
          // ... URLs to cache ...
        ]).then(() => {
          // Check if Notifications and Service Worker Registration are available
          if (self.registration.showNotification) {
            self.registration.showNotification("Caching complete!", {
              body: "App content has been cached for offline use.",
              icon: "/path/to/icon.png" // Optional icon
            });
          }
        });
      })
    );
  });
  

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('notificationclick', event => {
    event.notification.close(); // Close the notification
  
    // Focus on the app if it's already open
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Open a new window if the app isn't already open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });
  
