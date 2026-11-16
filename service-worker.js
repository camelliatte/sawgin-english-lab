const CACHE='sawgin-lab-shell-v0732-manual-cloud-20261116';
const OWN='sawgin-lab-shell-';
const ASSETS=['./index.html','./lab-v05r.js','./script-studio.html','./script-packs.js','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(OWN)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const shell=request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/lab-v05r.js')||url.pathname.endsWith('/service-worker.js')||url.pathname.endsWith('/script-studio.html')||url.pathname.endsWith('/script-packs.js');
 if(shell){event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request,{cache:'no-cache'});if(response.ok)cache.put(request,response.clone());return response;}catch(error){const cached=await cache.match(request);if(cached)return cached;if(request.mode==='navigate'){const page=await cache.match(url.pathname.endsWith('/script-studio.html')?'./script-studio.html':'./index.html');if(page)return page;}return new Response('Offline asset unavailable',{status:503,headers:{'Content-Type':'text/plain'}});}})());}
 else if(ASSETS.some(path=>url.pathname.endsWith(path.slice(1)))){event.respondWith(caches.open(CACHE).then(async cache=>await cache.match(request)||fetch(request)));}
});
