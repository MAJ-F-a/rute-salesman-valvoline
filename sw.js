/* Service worker sederhana: selalu coba ambil versi terbaru dari internet, cadangan dari cache bila offline. */
const CACHE = 'rute-salesman-v2';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./','icon-192.png','icon-512.png','icon-maskable-512.png']).catch(()=>{}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method!=='GET' || u.origin!==location.origin) return;
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)).catch(()=>{}); return res; }).catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
