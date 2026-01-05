// Service Worker for Push Notifications
// Handles push notification reception and display

const CACHE_NAME = 'fesi-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Push event - receive and display notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let data = {
    title: 'Fesi Order Update',
    body: 'Your order status has changed',
    icon: '/logo192.png',
    badge: '/badge-72x72.png',
    tag: 'order-update',
    requireInteraction: false,
    data: {}
  };

  // Parse notification data
  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        tag: payload.tag || data.tag,
        requireInteraction: payload.requireInteraction || data.requireInteraction,
        data: payload.data || data.data,
        actions: payload.actions || []
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
      data.body = event.data.text();
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      data: data.data,
      actions: data.actions,
      vibrate: [200, 100, 200]
    })
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Handle action buttons
  if (event.action) {
    console.log('Action clicked:', event.action);
    
    // Handle different actions
    switch (event.action) {
      case 'view-order':
        event.waitUntil(
          clients.openWindow(`/orders/${event.notification.data.orderId}`)
        );
        break;
      case 'track-order':
        event.waitUntil(
          clients.openWindow(`/orders/${event.notification.data.orderId}/track`)
        );
        break;
      default:
        console.log('Unknown action:', event.action);
    }
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          const url = event.notification.data?.orderId 
            ? `/orders/${event.notification.data.orderId}`
            : '/orders';
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Notification close event - track dismissals
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
  
  // Optional: Send analytics about notification dismissal
  // fetch('/api/analytics/notification-dismissed', {
  //   method: 'POST',
  //   body: JSON.stringify({ tag: event.notification.tag })
  // });
});

// Message event - handle messages from main app
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Send response back to client
  event.ports[0].postMessage({ received: true });
});

// Fetch event - network requests (optional caching strategy)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for same origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Network-first strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
