// Define the cache name
const CACHE_NAME = 'nike-store-cache-v1';

// Define the files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  // Add other files you want to cache
];

// Install the service worker
self.addEventListener('install', function(event) {
  // Perform installation process
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        console.log('fetch event triggered successfully!');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate the service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch resources from cache or network
self.addEventListener('fetch', function(event) {
  console.log('Fetch event triggered for:', event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('Response served from cache for:', event.request.url);
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('Invalid response received for:', event.request.url);
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log('Response cached for:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});


// Push event
self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.pushManager.getSubscription().then(function(subscription) {
      if (subscription) {
        return self.registration.showNotification('New Notification', {
          body: event.data.text(),
          icon: '/path/to/icon.png',
          badge: '/path/to/badge.png'
        });
      } else {
        // No subscription, so subscribe to push notifications
        return self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BGw8XB_HFe4AygHA9vdJmUj0vzrMGjVhNXdQZQm2KKrvI7qBKQx0bNs0voCHPB8T9Bd079TtR0f7X51kQ4VLB5Y'
        }).then(function(subscription) {
          return self.registration.showNotification('New Notification', {
            body: event.data.text(),
            icon: '/path/to/icon.png',
            badge: '/path/to/badge.png'
          });
        });
      }
    })
  );
});

// Sync event
self.addEventListener('sync', function(event) {
  console.log('Sync event triggered Successfully!', event);
});

// Function to synchronize cart data
function syncCartData() {
  // Implement synchronization logic here
  console.log('Syncing cart data...');
}
