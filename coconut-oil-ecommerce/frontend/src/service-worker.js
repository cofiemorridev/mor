/// <reference lib="webworker" />

// Service worker for Coconut Oil Ghana PWA

const CACHE_NAME = 'coconut-oil-ghana-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/images/logo.png',
  '/images/logo-white.png',
  '/images/spinner-logo.png',
  '/images/oil-bottle.png',
  '/images/hero-coconut.jpg',
  '/images/coconut-plantation.jpg'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('✅ App shell cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Skip API requests in development
  if (url.pathname.startsWith('/api/') && process.env.NODE_ENV === 'development') {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response to cache it
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request);
        })
    );
    return;
  }

  // For navigation requests, try network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For all other requests, try cache first
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache if not a success response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to cache it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // For images, return a placeholder
            if (request.destination === 'image') {
              return caches.match('/images/oil-bottle.png');
            }
          });
      })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    console.log('🔄 Background sync: Processing failed orders');
    event.waitUntil(syncFailedOrders());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'New update from Coconut Oil Ghana',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/images/logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Coconut Oil Ghana',
      options
    )
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked');
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Periodic sync (for background updates)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-products') {
    console.log('🔄 Periodic sync: Updating product data');
    event.waitUntil(updateProductCache());
  }
});

// Helper function to sync failed orders
async function syncFailedOrders() {
  // This would sync failed order submissions
  console.log('Syncing failed orders...');
  // Implementation would store orders in IndexedDB and retry
}

// Helper function to update product cache
async function updateProductCache() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      new Request('/api/products'),
      new Response(JSON.stringify(products))
    );
    
    console.log('✅ Product cache updated');
  } catch (error) {
    console.error('❌ Failed to update product cache:', error);
  }
}

// Message event for communication with client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.ports[0].postMessage({
      cacheName: CACHE_NAME,
      cachedUrls: PRECACHE_ASSETS
    });
  }
});
