// Service worker for the games site: lets the front page and saved games run offline.
//
// Same-origin requests go to the network first, so a deploy shows up on the next
// load, and every good response is kept in the cache. When the network fails, the
// cached copy is served instead. A game you have played online, or saved from the
// front page's "Play offline" panel, keeps working without a connection.
//
// SHELL_VERSION is stamped by scripts/offline-manifest.mjs; a new value makes
// browsers install this worker again and refresh the precached front page.

const SHELL_VERSION = 'c31e0662775f';
const SHELL = `shell-${SHELL_VERSION}`;
const SITE = 'site-v1';   // everything else: games, saved or just played
const FONTS = 'fonts-v1'; // Google Fonts, which some games use

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const res = await fetch('offline.json', { cache: 'no-store' });
    const { shell } = await res.json();
    const cache = await caches.open(SHELL);
    await cache.addAll(shell.files.map(f => new Request(f, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('shell-') && key !== SHELL) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req, url));
  } else if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(req, FONTS));
  } else if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(networkFirst(req, url, FONTS));
  }
  // Anything else (game servers, other sites) goes straight to the network.
});

async function networkFirst(req, url, cacheName = SITE) {
  try {
    const res = await fetch(req);
    if (res.ok || res.type === 'opaque') {
      const copy = res.clone();
      caches.open(cacheName).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  } catch (err) {
    const hit = await fromCache(req, url);
    if (hit) return hit;
    if (req.mode === 'navigate') return offlinePage(url);
    throw err;
  }
}

async function cacheFirst(req, cacheName) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') {
    const copy = res.clone();
    caches.open(cacheName).then(c => c.put(req, copy)).catch(() => {});
  }
  return res;
}

async function fromCache(req, url) {
  const hit = await caches.match(req) || await caches.match(req, { ignoreSearch: true });
  if (hit) return hit;
  // /orbs and /orbs/index.html are the same page as /orbs/.
  if (req.mode === 'navigate') {
    const path = url.pathname;
    const alt = path.endsWith('/') ? path + 'index.html'
      : path.endsWith('/index.html') ? path.slice(0, -'index.html'.length)
      : path + '/';
    return caches.match(alt);
  }
  return undefined;
}

function offlinePage(url) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Offline</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0d0b16;color:#ece8f6;
font:16px/1.5 system-ui,sans-serif;text-align:center;padding:16px}a{color:#f2c96b}</style></head>
<body><main><h1>You're offline</h1><p>${escapeHtml(url.pathname)} isn't saved on this device yet.</p>
<p>Next time you're online, open the games page and save it under <b>Play offline</b>.</p>
<p><a href="/">Back to the games</a></p></main></body></html>`;
  return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
