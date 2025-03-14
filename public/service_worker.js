'use strict';

const CACHE_NAME = "farm-produce-cache-v1";
const OFFLINE_SUBMISSIONS_CACHE = "offline-submissions";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/static/js/bundle.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    }).catch(err => console.error("Cache failed: ", err))
  );
});

self.addEventListener("fetch", (event) => {
  // Handle form submissions
  if (event.request.url.includes('/api/submit') && event.request.method === 'POST') {
    event.respondWith(
      handleFormSubmission(event.request)
    );
    return;
  }

  // Serve other requests from cache or network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        console.warn("Network failed, resource not in cache:", event.request.url);
        return new Response("Network error", { status: 500 });
      });
    })
  );
});

const handleFormSubmission = async (request) => {
  try {
    // Try to submit the form online
    const response = await fetch(request);
    return response;
  } catch (error) {
    // If offline, cache the form data
    const formData = await request.clone().json();
    const cache = await caches.open(OFFLINE_SUBMISSIONS_CACHE);
    await cache.put('/api/submit', new Response(JSON.stringify(formData)));
    return new Response(JSON.stringify({ message: "Form submission cached for offline" }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

self.addEventListener("sync", (event) => {
  if (event.tag === 'sync-submissions') {
    event.waitUntil(syncSubmissions());
  }
});

const syncSubmissions = async () => {
  const cache = await caches.open(OFFLINE_SUBMISSIONS_CACHE);
  const keys = await cache.keys();
  for (const key of keys) {
    const request = await cache.match(key);
    const formData = await request.json();
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await cache.delete(key); // Remove synced submission from cache
    } catch (error) {
      console.error("Failed to sync submission:", error);
    }
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== OFFLINE_SUBMISSIONS_CACHE) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});