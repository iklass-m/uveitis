/* Strong Mornings - offline service worker (scope: /uveitis/strong-mornings/).
   Pages network-first so updates arrive when online; cached copy offline.
   Only ever deletes its own old caches (strongmornings-*), never the uveitis/neuro ones. */
const CACHE='strongmornings-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('strongmornings')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function save(req,res){if(res&&res.ok&&new URL(req.url).origin===location.origin){const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c))}return res}
self.addEventListener('fetch',e=>{const req=e.request;
 if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>save(req,r)).catch(()=>caches.match(req,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));return}
 e.respondWith(caches.match(req,{ignoreSearch:true}).then(h=>h||fetch(req).then(r=>save(req,r))))});
