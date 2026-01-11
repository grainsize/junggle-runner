const CACHE_NAME = "jungle-runner-v1";

// ✅ scope 기준으로 파일 경로를 만든다 (GitHub Pages 서브경로에서도 안정)
function url(path) {
  return new URL(path, self.registration.scope).toString();
}

const ASSETS = [
  url("./"),
  url("./index.html"),
  url("./manifest.json"),
  url("./icon-192.png"),
  url("./icon-512.png")
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// 기본: 네트워크 우선, 실패 시 캐시
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // GET만 처리
  if (req.method !== "GET") return;

  event.respondWith(
    fetch(req).then((res) => {
      // HTML/manifest/icon 등은 캐시에 업데이트(옵션)
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
      return res;
    }).catch(() => caches.match(req))
  );
});
