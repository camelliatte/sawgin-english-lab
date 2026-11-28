const CACHE='sawgin-lab-shell-v160-board-20261128';
const OWN='sawgin-lab-shell-';
const ASSETS=['./index.html','./lab-v05r.js','./script-studio.html','./script-packs.js','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(OWN)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
const COVERS='sawgin-covers-v1',COVER_LIMIT=150;
async function coverFetch(event){const request=event.request,cache=await caches.open(COVERS),hit=await cache.match(request);const fresh=fetch(request,{cache:'no-cache'}).then(async res=>{if(res.ok){await cache.put(request,res.clone());const keys=await cache.keys();for(const k of keys.slice(0,Math.max(0,keys.length-COVER_LIMIT)))await cache.delete(k);}else if(res.status===404)await cache.delete(request);return res;}).catch(()=>hit||new Response('',{status:504}));if(hit){event.waitUntil(fresh);return hit;}return fresh;}
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.includes('/covers/')||url.pathname.includes('/records/')||url.pathname.includes('/fridge/')){event.respondWith(coverFetch(event));return;}
 const shell=request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/lab-v05r.js')||url.pathname.endsWith('/service-worker.js')||url.pathname.endsWith('/script-studio.html')||url.pathname.endsWith('/script-packs.js');
 if(shell){event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request,{cache:'no-cache'});if(response.ok)cache.put(request,response.clone());return response;}catch(error){const cached=await cache.match(request);if(cached)return cached;if(request.mode==='navigate'){const page=await cache.match(url.pathname.endsWith('/script-studio.html')?'./script-studio.html':'./index.html');if(page)return page;}return new Response('Offline asset unavailable',{status:503,headers:{'Content-Type':'text/plain'}});}})());}
 else if(ASSETS.some(path=>url.pathname.endsWith(path.slice(1)))){event.respondWith(caches.open(CACHE).then(async cache=>await cache.match(request)||fetch(request)));}
});
