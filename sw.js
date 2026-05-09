const CACHE_NAME = 'v3_yacatzin'

const APP_SHELL = [
    './',
    './index.html',
    './assets/css/style.css',
    './assets/js/main.js',
    './script.js',
    './manifest.json',
]

const STATIC_ASSETS = [
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
            .then(cache => cache.addAll([...APP_SHELL, ...STATIC_ASSETS]))
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
    const url = new URL(e.request.url)
    const isImage = /\.(webp|png|jpg|jpeg|svg|gif)$/i.test(url.pathname)

    if (isImage) {
        // Cache-first para imágenes (no cambian)
        e.respondWith(
            caches.match(e.request).then(res => res || fetch(e.request))
        )
    } else {
        // Network-first para HTML, CSS, JS (siempre refleja cambios)
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const clone = res.clone()
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone))
                    return res
                })
                .catch(() => caches.match(e.request))
        )
    }
})
