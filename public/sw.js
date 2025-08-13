// Queue moved to modular files for maintainability
importScripts('/sw/queue.js', '/sw/dropbox.js');

// original minimal PWA shell caching and fetch strategies

const CACHE_VERSION = 'v7-minimal';
const APP_SHELL_CACHE = `nutriscan-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `nutriscan-runtime-${CACHE_VERSION}`;

// Minimal essential resources for PWA recognition
const APP_SHELL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/tray.png',
  '/splash.png'
];

// Install event - cache only essential app shell
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing version', CACHE_VERSION);
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(APP_SHELL_RESOURCES);
      })
      .catch((error) => {
        console.log('Service Worker: App shell cache failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating version', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('nutriscan-') && !cacheName.includes(CACHE_VERSION)) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
  
  // Notify clients that SW has been updated
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATED',
        version: CACHE_VERSION
      });
    });
  });
});

// Network-first fetch strategy with minimal caching
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isAppShellResource = APP_SHELL_RESOURCES.some(resource => 
    url.pathname === resource || 
    (resource === '/' && url.pathname === '/index.html')
  );

  // Handle app shell resources (network-first with cache fallback)
  if (isAppShellResource) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            console.log('Service Worker: Network success for app shell:', url.pathname);
            // Update cache with fresh content
            const responseClone = response.clone();
            caches.open(APP_SHELL_CACHE)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          console.log('Service Worker: Network failed, serving from cache:', url.pathname);
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle JavaScript/CSS assets (network-first with runtime cache)
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            console.log('Service Worker: Network success for asset:', url.pathname);
            // Cache successful responses in runtime cache
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          console.log('Service Worker: Network failed for asset, checking cache:', url.pathname);
          return caches.match(event.request);
        })
    );
    return;
  }

  // For all other requests, try network first, no caching
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // If it's a navigation request and network fails, serve index.html from cache
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        // For other requests, just let them fail
        throw error;
      })
  );
});

// Message handling for debugging and version info
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_RESPONSE',
      version: CACHE_VERSION
    });
  }

  if (event.data && event.data.type === 'HEALTH_CHECK') {
    Promise.all([
      caches.keys(),
      caches.open(APP_SHELL_CACHE).then(cache => cache.keys()),
      caches.open(RUNTIME_CACHE).then(cache => cache.keys())
    ]).then(([cacheNames, shellCacheKeys, runtimeCacheKeys]) => {
      event.ports[0].postMessage({
        type: 'HEALTH_RESPONSE',
        data: {
          version: CACHE_VERSION,
          isActive: true,
          cacheNames: cacheNames.filter(name => name.startsWith('nutriscan-')),
          shellCacheSize: shellCacheKeys.length,
          runtimeCacheSize: runtimeCacheKeys.length
        }
      });
    });
  }

  if (event.data && event.data.type === 'FORCE_UPDATE') {
    // Force update by clearing caches and reloading
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('nutriscan-')) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    });
  }
});

// Queue message handling (separate listener for clarity)
self.addEventListener('message', (event) => {
  const data = event.data || {};
  const port = event.ports && event.ports[0];
  if (!data || !data.type) return;

  switch (data.type) {
    case 'QUEUE_ENQUEUE': {
      const { queueName, resourceKey, payload } = data;
      console.log('SW: QUEUE_ENQUEUE', { queueName, resourceKey, hasPayload: !!payload });
      self.NSQueue.enqueue(queueName, resourceKey, payload).then(() => {
        if (port) port.postMessage({ ok: true });
      });
      break;
    }
    case 'QUEUE_STATUS': {
      const { resourceKey } = data;
      console.log('SW: QUEUE_STATUS', { resourceKey });
      self.NSQueue.status(resourceKey).then((status) => {
        if (port) port.postMessage({ ok: true, status });
      });
      break;
    }
    case 'QUEUE_START': {
      const { access_token } = data;
      console.log('SW: QUEUE_START received, token?', !!access_token);
      self.NSQueue.setToken(access_token || null);
      self.NSQueue.start();
      if (port) port.postMessage({ ok: true });
      break;
    }
    case 'QUEUE_STOP': {
      console.log('SW: QUEUE_STOP');
      self.NSQueue.stop();
      if (port) port.postMessage({ ok: true });
      break;
    }
    case 'QUEUE_PURGE_RESOURCE': {
      const { queueName, resourceKey } = data;
      console.log('SW: QUEUE_PURGE_RESOURCE', { queueName, resourceKey });
      self.NSQueue.purgeResource(queueName, resourceKey).then(() => {
        if (port) port.postMessage({ ok: true });
      });
      break;
    }
    case 'QUEUE_CLEAR_ALL': {
      console.log('SW: QUEUE_CLEAR_ALL');
      self.NSQueue.clearAll().then(() => {
        if (port) port.postMessage({ ok: true });
      });
      break;
    }
  }
});

// Background sync for offline actions (minimal implementation)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    // Minimal sync implementation - just log for now
  }
});
