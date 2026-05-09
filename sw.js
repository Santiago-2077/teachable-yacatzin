const CACHE_NAME = 'v2_yacatzin'
const urlsToCache = [
    './',
    './index.html',
    './assets/css/style.css',
    './assets/js/main.js',
    './script.js',
    './manifest.json',
    './assets/img/titulo-slogan.webp',
    './assets/img/pet-yacatzin.png',
    './assets/img/apple-touch-icon.png',
    './assets/img/icon-192.png',
    './assets/img/icon-512.png',
    './assets/img/icon-512-maskable.png'
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
            .catch(err => console.log('Falló registro de cache', err))
    )
})

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => res || fetch(e.request))
    )
})
