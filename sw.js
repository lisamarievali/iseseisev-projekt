/* jshint esversion:6 */

let CACHE_NAME = 'site-cache';
let urlsToCache = [
  '.',
  'offline.manifest',
  'icon.png',
  'index.html',
  'script.js',
  'style.css',
  'questions-java.json',
  'questions-javascript.json',
  'questions-jquery.json',
  'saveScore.php',
  'scors.json',
  'https://code.jquery.com/jquery-3.4.1.min.js'
];

self.addEventListener('install', function (event) {
  // Installima
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      console.log('Using content from SW cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});