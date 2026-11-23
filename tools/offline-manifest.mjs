// Writes offline.json for a built games site and stamps sw.js with its version.
//
//   node scripts/offline-manifest.mjs dist
//   node scripts/offline-manifest.mjs ../cariehl.github.io
//
// (cariehl.github.io keeps a copy at tools/offline-manifest.mjs: node tools/offline-manifest.mjs .)
//
// The front page's "Play offline" panel reads offline.json to know which files
// each game needs, so it can save a whole game for offline play. The service
// worker precaches the `shell` list (front page, icons, thumbnails). Run this
// again whenever a game's files change; build-site.mjs runs it for you.
//
// Games are the folders the front page links to with <a class="game" href="slug/">.

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const site = process.argv[2];
if (!site || !existsSync(join(site, 'index.html'))) {
  console.error('usage: node scripts/offline-manifest.mjs <site folder with index.html>');
  process.exit(1);
}

// Files the site serves that no game needs at runtime.
const SKIP = name => name.startsWith('.') || name === 'LICENSE' || name === 'README.md';

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    if (SKIP(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const url = file => relative(site, file).split(sep).join('/');

function entry(files, extra = []) {
  const hash = createHash('sha256');
  let bytes = 0;
  for (const f of files) {
    const data = readFileSync(f);
    bytes += data.length;
    hash.update(url(f)).update('\0').update(data).update('\0');
  }
  return { version: hash.digest('hex').slice(0, 12), bytes, files: [...extra, ...files.map(url)] };
}

const index = readFileSync(join(site, 'index.html'), 'utf8');
const slugs = [...index.matchAll(/<a class="game" href="([\w-]+)\/"/g)].map(m => m[1]);

const optional = name => existsSync(join(site, name)) ? [join(site, name)] : [];
const shellFiles = [
  join(site, 'index.html'),
  ...['manifest.webmanifest', 'offline.js'].flatMap(optional),
  ...['icons', 'img'].flatMap(d => existsSync(join(site, d)) ? walk(join(site, d)) : []),
];
const manifest = { shell: entry(shellFiles, ['./']), games: {} };

const commentary = join(site, 'commentary');
for (const slug of slugs) {
  const dir = join(site, slug);
  if (!existsSync(dir)) throw new Error(`index.html links to ${slug}/ but ${dir} is missing`);
  const notes = existsSync(commentary)
    ? readdirSync(commentary).filter(n => n === `${slug}.md` || n.startsWith(`${slug}-`)).sort().map(n => join(commentary, n))
    : [];
  // `slug/` is the URL people actually open, so it is cached as well as slug/index.html.
  manifest.games[slug] = entry([...walk(dir), ...notes], [`${slug}/`]);
}

writeFileSync(join(site, 'offline.json'), JSON.stringify(manifest, null, 1) + '\n');

// A new shell version changes sw.js, which is what makes browsers install the update.
const swPath = join(site, 'sw.js');
if (existsSync(swPath)) {
  const sw = readFileSync(swPath, 'utf8');
  const stamped = sw.replace(/const SHELL_VERSION = '[^']*';/, `const SHELL_VERSION = '${manifest.shell.version}';`);
  if (stamped === sw && !sw.includes(`'${manifest.shell.version}'`)) throw new Error('sw.js has no SHELL_VERSION line to stamp');
  writeFileSync(swPath, stamped);
}

const mb = n => (n / 1048576).toFixed(1) + ' MB';
const total = Object.values(manifest.games).reduce((n, g) => n + g.bytes, 0);
console.log(`offline.json: ${slugs.length} games, ${mb(total)} in all, shell ${mb(manifest.shell.bytes)}`);
