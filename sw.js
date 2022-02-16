let cacheableAssets = ['/','index.html', 'magic.html', 'manifest.webmanifest','script.js','style.css', 'images/', 'audio/'];
let cacheName = 'sw-cache';
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then((cache)=>{
           cache.addAll(cacheableAssets);
            
        })
    )
});

self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    )
});

/* self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(res=>{
            return res || fetch(event.request);
        })
    );
    
}); */


self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
      e.respondWith(networkAndCache(req));
    }
  });
  
  async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    console.log(cache)
    return cached
  }
  
  async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
      const fresh = await fetch(req);
      await cache.put(req, fresh.clone());
      return fresh;
    } catch (e) {
      const cached = await cache.match(req);
      return cached;
    }
  }