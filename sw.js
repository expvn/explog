// Service Worker - Caching for faster page loads
const CACHE_NAME = 'cms-cache-v1';
const STATIC_CACHE_NAME = 'cms-static-v1';
const DYNAMIC_CACHE_NAME = 'cms-dynamic-v1';

// Static assets to pre-cache (shell)
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/style.css',
    '/assets/logo.png',
    '/config/site.json',
    '/config/hero.json',
    '/config/home.json',
    '/config/menu.json',
    '/config/pagination.json',
    '/config/posts-index.json',
    '/config/categories.json',
    '/config/tags.json'
];

// CDN resources to cache (external libraries)
const CDN_ASSETS = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js'
];

// Cache duration settings (in milliseconds)
const CACHE_DURATION = {
    config: 5 * 60 * 1000,      // 5 minutes for config files
    posts: 10 * 60 * 1000,      // 10 minutes for post data
    images: 24 * 60 * 60 * 1000, // 24 hours for images
    static: 7 * 24 * 60 * 60 * 1000 // 7 days for static assets
};

// Install event - Pre-cache essential assets
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        Promise.all([
            // Cache local static assets
            caches.open(STATIC_CACHE_NAME).then(cache => {
                console.log('[SW] Pre-caching local assets');
                return cache.addAll(PRECACHE_ASSETS);
            }),
            // Cache CDN assets
            caches.open(STATIC_CACHE_NAME).then(cache => {
                console.log('[SW] Pre-caching CDN assets');
                return Promise.all(
                    CDN_ASSETS.map(url =>
                        fetch(url, { mode: 'cors' })
                            .then(response => {
                                if (response.ok) {
                                    return cache.put(url, response);
                                }
                            })
                            .catch(err => console.log('[SW] Failed to cache:', url))
                    )
                );
            })
        ]).then(() => {
            console.log('[SW] Pre-caching complete');
            return self.skipWaiting(); // Activate immediately
        })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE_NAME &&
                        cacheName !== DYNAMIC_CACHE_NAME &&
                        cacheName.startsWith('cms-')) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Service Worker activated');
            return self.clients.claim(); // Take control immediately
        })
    );
});

// Fetch event - Serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(url)) {
        // Static assets: Cache-first strategy
        event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    } else if (isConfigRequest(url)) {
        // Config/API: Stale-while-revalidate strategy
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
    } else if (isImageRequest(url)) {
        // Images: Cache-first with long expiry
        event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
    } else if (isContentRequest(url)) {
        // Content (markdown, posts): Network-first with cache fallback
        event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    } else {
        // Default: Network-first
        event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    }
});

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed for:', request.url);
        // Return offline fallback if available
        return caches.match('/offline.html');
    }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache for:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale-while-revalidate strategy (for config/API)
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await caches.match(request);

    // Fetch in background to update cache
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(err => {
        console.log('[SW] Background fetch failed:', request.url);
    });

    // Return cached response immediately, or wait for network
    return cachedResponse || fetchPromise;
}

// Helper functions to identify request types
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot'];
    const pathname = url.pathname;

    // Local static files
    if (url.origin === self.location.origin) {
        if (pathname === '/' || pathname === '/index.html' ||
            pathname === '/app.js' || pathname === '/style.css') {
            return true;
        }
    }

    // CDN resources
    if (url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')) {
        return true;
    }

    return staticExtensions.some(ext => pathname.endsWith(ext));
}

function isConfigRequest(url) {
    return url.pathname.startsWith('/config/') && url.pathname.endsWith('.json');
}

function isImageRequest(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
    return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

function isContentRequest(url) {
    return url.pathname.startsWith('/content/') || url.pathname.endsWith('.md');
}

// Message handler for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.startsWith('cms-')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
