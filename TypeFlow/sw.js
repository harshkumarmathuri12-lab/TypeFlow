const CACHE="typeflow-v1";

const FILES=[
"/",
"/index.html",
"/css/style.css",
"/js/script.js",
"/js/words.js"
];

self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE).then(cache=>cache.addAll(FILES))

);

});

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request).then(res=>res||fetch(e.request))

);

});