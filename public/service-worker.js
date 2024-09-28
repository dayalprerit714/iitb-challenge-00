const CACHE_NAME = "chemical-supplies-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/src/main.ts",
  "/src/style.css",
  "/src/components/ChemicalSuppliesTable.ts",
  "/src/data.ts",
  "/src/logger.ts",
  "/src/types.ts",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});
