const CACHE_NAME = "static-budget-cache-v1";
const DATA_CACHE_NAME = "data-budget-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "db.js",
    "index.js",
    "manifest.json",
    "service-worker.js",
    "styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", function(evt) {      
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    console.log("Installing now...");
    self.skipWaiting();
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    )
});