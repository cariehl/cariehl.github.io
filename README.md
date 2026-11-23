# cariehl.github.io

A collection of browser games and apps, hosted at https://cariehl.github.io/.

Mostly "vibe-coded", and primarily serving as tech demos/prototypes for project ideas that I want to explore and test out. Some of them are mobile-friendly.

Games are built from private source (well, as private as game source can be when it's all coded in TS/JS) and then uploaded here to serve.

## Offline play

The site installs as an app and works offline. `sw.js` is the service worker, `offline.js` adds the front page's **Play offline** panel, and `offline.json` lists each game's files. After changing any game's files, run `node tools/offline-manifest.mjs .` to regenerate `offline.json` and stamp a new `sw.js` version.
