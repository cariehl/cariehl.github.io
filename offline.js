// Front page offline support: registers the service worker (sw.js), offers to
// install the site as an app, and adds a "Play offline" panel where people save
// games onto their device. Saved games refresh themselves when a new version is
// deployed. offline.json (from scripts/offline-manifest.mjs) lists each game's files.
//
// A card with data-online="..." is a game whose online play needs a connection;
// the text is shown in the panel and on the card while offline.

(() => {
  if (!('serviceWorker' in navigator) || !('caches' in window)) return;

  const CACHE = 'site-v1'; // must match SITE in sw.js
  const SAVED = 'offline.saved';
  const load = () => { try { return JSON.parse(localStorage.getItem(SAVED)) || {}; } catch (e) { return {}; } };
  const store = v => { try { localStorage.setItem(SAVED, JSON.stringify(v)); } catch (e) {} };
  const mb = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

  navigator.serviceWorker.register('sw.js').catch(err => console.warn('Offline support is off:', err));

  const cards = [...document.querySelectorAll('.games a.game')];
  const games = cards.map(card => ({
    slug: card.getAttribute('href').replace(/\/$/, ''),
    name: card.querySelector('h2').textContent.trim(),
    online: card.dataset.online || '',
    card,
  }));

  let manifest = null;
  let saved = load();
  const busy = new Set();

  // ---- panel ---------------------------------------------------------------

  const style = document.createElement('style');
  style.textContent = `
    .offline { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; margin-bottom: 24px; }
    .offline summary { cursor: pointer; padding: 12px 18px; font-weight: 600; list-style-position: inside; }
    .offline summary .status { font-weight: 400; color: var(--dim); margin-left: 6px; }
    .offline .inner { padding: 0 18px 16px; display: flex; flex-direction: column; gap: 12px; }
    .offline p { margin: 0; color: var(--dim); font-size: .95rem; }
    .offline .actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .offline button {
      font: inherit; font-size: .9rem; color: var(--text); background: var(--panel-hi);
      border: 1px solid var(--line); border-radius: 999px; padding: 6px 14px; cursor: pointer;
    }
    .offline button.primary { color: var(--bg); background: var(--accent); border-color: var(--accent); font-weight: 600; }
    .offline button:disabled { opacity: .6; cursor: default; }
    .offline button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .offline ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px 16px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .offline li { display: flex; align-items: baseline; gap: 8px; font-size: .95rem; padding: 4px 0; }
    .offline li label { display: flex; gap: 8px; align-items: baseline; cursor: pointer; min-width: 0; }
    .offline li input { accent-color: var(--accent); }
    .offline li .size, .offline li .note { color: var(--dim); font-size: .8rem; }
    .offline li .note { display: block; }
    .game.unavailable { opacity: .45; }
    .tags span.saved { border-color: #6bd49a; color: #6bd49a; }
    .tags span.online-note { border-style: dashed; }
  `;
  document.head.appendChild(style);

  const panel = document.createElement('details');
  panel.className = 'offline';
  panel.innerHTML = `
    <summary>📶 Play offline<span class="status"></span></summary>
    <div class="inner">
      <p class="intro">Save games on this device and they work without a connection. Saved games update themselves when you're back online.</p>
      <div class="actions">
        <button type="button" class="primary" data-install hidden>Install as an app</button>
        <button type="button" data-save-all>Save all</button>
        <button type="button" data-clear hidden>Remove all</button>
      </div>
      <p class="ios" hidden>To install on iPhone or iPad, tap Share, then <b>Add to Home Screen</b>.</p>
      <ul></ul>
    </div>`;
  document.querySelector('.filter').before(panel);
  const status = panel.querySelector('.status');
  const list = panel.querySelector('ul');
  const saveAll = panel.querySelector('[data-save-all]');
  const clear = panel.querySelector('[data-clear]');

  for (const g of games) {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox"><span><span class="name"></span> <span class="size"></span>
      <span class="note"></span></span></label>`;
    li.querySelector('.name').textContent = g.name;
    if (g.online) li.querySelector('.note').textContent = g.online;
    const box = li.querySelector('input');
    box.addEventListener('change', () => box.checked ? save(g.slug) : remove(g.slug));
    g.li = li;
    list.appendChild(li);
  }

  saveAll.addEventListener('click', async () => {
    for (const g of games) if (!saved[g.slug]) await save(g.slug);
  });
  clear.addEventListener('click', async () => {
    for (const g of games) if (saved[g.slug]) await remove(g.slug);
  });

  // ---- install -------------------------------------------------------------

  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const install = panel.querySelector('[data-install]');
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    install.hidden = false;
  });
  install.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice.catch(() => {});
    deferred = null;
    install.hidden = true;
  });
  window.addEventListener('appinstalled', () => { install.hidden = true; });
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios && !standalone) panel.querySelector('.ios').hidden = false;

  // ---- saving --------------------------------------------------------------

  async function getManifest() {
    try {
      const res = await fetch('offline.json', { cache: 'no-store' });
      if (res.ok) return manifest = await res.json();
    } catch (e) { /* offline: fall back to the copy the service worker kept */ }
    const hit = await caches.match('offline.json');
    if (hit) manifest = await hit.json();
    return manifest;
  }

  const owns = (slug, path) => path.startsWith(`/${slug}/`) || path.startsWith(`/commentary/${slug}.`) || path.startsWith(`/commentary/${slug}-`);

  async function save(slug) {
    if (busy.has(slug)) return;
    const game = manifest && manifest.games[slug];
    if (!game) { render(); return; }
    if (!navigator.onLine) { alert('Connect to the internet to save games for offline play.'); render(); return; }
    busy.add(slug);
    render();
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
      const cache = await caches.open(CACHE);
      for (const file of game.files) {
        const res = await fetch(file, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`${file}: ${res.status}`);
        await cache.put(file, res);
      }
      // Drop files an older version had that this one doesn't.
      const keep = new Set(game.files.map(f => new URL(f, location.href).href));
      for (const req of await cache.keys()) {
        const u = new URL(req.url);
        if (u.origin === location.origin && owns(slug, u.pathname) && !keep.has(u.origin + u.pathname)) await cache.delete(req);
      }
      saved = load();
      saved[slug] = game.version;
      store(saved);
    } catch (err) {
      console.warn(`Couldn't save ${slug} for offline:`, err);
      alert(`Couldn't save that game for offline play. Check your connection and try again.`);
    } finally {
      busy.delete(slug);
      render();
    }
  }

  async function remove(slug) {
    const cache = await caches.open(CACHE);
    for (const req of await cache.keys()) {
      const u = new URL(req.url);
      if (u.origin === location.origin && owns(slug, u.pathname)) await cache.delete(req);
    }
    saved = load();
    delete saved[slug];
    store(saved);
    render();
  }

  // Games played online are partly cached even when not saved; offline they may still open.
  async function played(slug) {
    return !!(await caches.match(`${slug}/`) || await caches.match(`${slug}/index.html`));
  }

  // ---- state on the page ---------------------------------------------------

  async function render() {
    const offline = !navigator.onLine;
    const count = games.filter(g => saved[g.slug]).length;
    status.textContent = offline ? '· You\'re offline' : count ? `· ${count} saved` : '';
    clear.hidden = count === 0;
    const unsaved = games.filter(g => !saved[g.slug] && manifest && manifest.games[g.slug]);
    const unsavedBytes = unsaved.reduce((n, g) => n + manifest.games[g.slug].bytes, 0);
    saveAll.textContent = unsaved.length ? `Save all (${mb(unsavedBytes)})` : 'All saved';
    saveAll.disabled = offline || !unsaved.length || busy.size > 0;

    for (const g of games) {
      const entry = manifest && manifest.games[g.slug];
      const box = g.li.querySelector('input');
      box.checked = !!saved[g.slug] || busy.has(g.slug);
      box.disabled = busy.has(g.slug) || !entry || (offline && !saved[g.slug]);
      g.li.querySelector('.size').textContent = busy.has(g.slug) ? 'saving…' : entry ? mb(entry.bytes) : '';

      const tags = g.card.querySelector('.tags');
      let tag = tags.querySelector('.saved');
      if (saved[g.slug] && !tag) {
        tag = document.createElement('span');
        tag.className = 'saved';
        tag.textContent = 'Saved offline';
        tags.prepend(tag);
      } else if (!saved[g.slug] && tag) tag.remove();

      let note = tags.querySelector('.online-note');
      if (offline && g.online && !note) {
        note = document.createElement('span');
        note.className = 'online-note';
        note.textContent = g.online;
        tags.appendChild(note);
      } else if (!offline && note) note.remove();

      const usable = !offline || saved[g.slug] || await played(g.slug);
      g.card.classList.toggle('unavailable', !usable);
      if (!usable) g.card.title = 'Not saved for offline play'; else g.card.removeAttribute('title');
    }
  }

  // Keep saved games current: re-save any whose files changed since.
  async function refresh() {
    if (!navigator.onLine || !manifest) return;
    for (const g of games) {
      const entry = manifest.games[g.slug];
      if (saved[g.slug] && entry && saved[g.slug] !== entry.version) await save(g.slug);
    }
  }

  window.addEventListener('online', async () => { await getManifest(); render(); refresh(); });
  window.addEventListener('offline', render);
  window.addEventListener('storage', e => { if (e.key === SAVED) { saved = load(); render(); } });

  if (!navigator.onLine) panel.open = true;
  getManifest().then(() => { render(); refresh(); });
  render();
})();
