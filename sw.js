let cacheableAssets = ['./', '/index.html', 'images/','audio/', '/script.js', '/style.css', '/manifest.webmanifest', '/magic.css'];
let cacheName = 'static-v1.1';
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


self.addEventListener('fetch',  e => {
    const req = e.request;
    /* const url = new URL(req.url);
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
      e.respondWith(networkAndCache(req));
      } */
      
      e.respondWith((async ()=>{
        const cache = await caches.open(cacheName); //check cached files first
    try {
          const fresh = await fetch(req); //fetch from network
          await cache.put(req, fresh.clone()); //cache the informations fetched
          console.log('trying to fetch: fetching...')
          return fresh; 
        } catch (e) {
          // if there's an internet error, search the request from the cached files and return it back to the user;
          const cached = await cache.match(req);
          console.log(cached.url)
          return cached;
        }
      })());

  });
  











  async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    // console.log(cache)
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