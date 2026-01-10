const CACHE_NAME = "jungle-runner-v1";
const ASSETS = [
  "/jungle-runner/",
  "/jungle-runner/index.html",
  "/jungle-runner/manifest.json",
  "/jungle-runner/icon-192.png",
  "/jungle-runner/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
