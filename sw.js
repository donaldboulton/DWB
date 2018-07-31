---
layout: null
---

'use strict'

var APP_PREFIX = 'donboulton';
var VERSION = 'version_02';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  '/assets/js/main.min.js',
  '/assets/css/main.css',
  {% for page in site.html_pages %}
    '{{ page.url }}',
  {% endfor %}
  {% for post in site.posts %}
    '{{ post.url }}',
	{% endfor %}
  '/assets/js/vendor/letter-avatar/letter-avatar.js',
  '/assets/js/vendor/twitter/web-intents.js',
  '/assets/js/lunr/lunr.min.js',
  '/assets/js/lunr/lunr-store.js',
  '/assets/js/lunr/lunr-en.js',
  '/assets/js/github/github-widget.js',
  '/assets/images/bg10-min.png',
  '/assets/images/pages/bg10-min.png',
  '/assets/images/fav-icons/favicon-32x32.png',
  '/assets/images/pages/donald-boulton-100.jpg',
  '/assets/images/pages/reviews.jpg',
  '/assets/images/pages/digital_box_1400-compressor.jpg',
  '/assets/images/pages/stop-spam.jpg',
  '/assets/images/pages/jekyll-reversed.jpg',
  '/assets/photography/cat-gallery/einstine-1200.jpg',
  '/assets/images/pages/performance/speedtest_donboulton-1200.jpg',
  '/assets/images/pages/staticman-github-gitlab.png',
  '/assets/images/pages/staticman-github-gitlab-1200.png',
  '/assets/images/pages/staticman-github-gitlab-lq.png',
  '/assets/images/pages/staticman-github-gitlab-320.png',
  '/assets/images/pages/colorbox-html.jpg',
  '/assets/images/pages/colorbox-html-1200.jpg',
  '/assets/images/pages/colorbox-html-lq.jpg',
  '/assets/images/pages/colorbox-html-320.jpg',
  '/assets/images/pages/jekyll-admin-1200.jpg',
  '/assets/images/pages/windows-tweaks-1200.png',
  '/assets/images/pages/defrag-sql-2014-1200.png',
  '/assets/images/pages/letter-avatar-header-1200.png',
  '/assets/images/pages/social-sharing.jpg',
  '/assets/images/pages/defrag-sql-2014-1200.png',
  '/assets/images/pages/check_sql_fragmentation-1200.png',
  '/assets/images/pages/stop-spam-1200.jpg',
  '/assets/images/pages/reviews-1200.jpg',
  '/assets/images/pages/social-sharing-1200.jpg',
  '/assets/images/pages/jekyll-reversed-1200.jpg',
  '/assets/images/pages/stop-spam-320.jpg',
  '/assets/images/pages/jekyll-admin-320.jpg',
  '/assets/images/pages/windows-tweaks-320.png',
  '/assets/images/pages/defrag-sql-2014-320.png',
  '/assets/images/pages/letter-avatar-header-320.png',
  '/assets/images/pages/social-sharing-320.jpg',
  '/assets/images/pages/defrag-sql-2014-320.png',
  '/assets/images/pages/check_sql_fragmentation-320.png',
  '/assets/images/pages/reviews-320.jpg',
  '/assets/images/pages/social-sharing-320.jpg',
  '/assets/images/pages/jekyll-reversed-320.jpg',
  '/assets/images/pages/stop-spam-lq.jpg',
  '/assets/images/pages/jekyll-admin-lq.jpg',
  '/assets/images/pages/windows-tweaks-lq.png',
  '/assets/images/pages/defrag-sql-2014-lq.png',
  '/assets/images/pages/letter-avatar-header-lq.png',
  '/assets/images/pages/social-sharing-lq.jpg',
  '/assets/images/pages/defrag-sql-2014-lq.png',
  '/assets/images/pages/check_sql_fragmentation-lq.png',
  '/assets/images/pages/reviews-lq.jpg',
  '/assets/images/pages/social-sharing-lq.jpg',
  '/assets/images/pages/jekyll-reversed-lq.jpg',
  '/assets/icons/icons.svg',
  '/assets/images/pages/github-74-80.png',
  '/assets/images/pages/cf-logo-v-rgb-rev-239-80.png',
  '/assets/images/red-flask-32.png',
  '/assets/images/fav-icons/favicon.png',
  '/sw.js',
  '/manifest.webmanifest',
];

self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache : ' + e.request.url);
        return request;
      } else {
        console.log('file is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  );
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {

      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });

      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});