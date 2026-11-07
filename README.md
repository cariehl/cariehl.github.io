# cariehl.github.io

Browser games, hosted at https://cariehl.github.io/. The front page (`index.html`) lists them, and each game lives in its own folder.

| Game | URL | Source |
| --- | --- | --- |
| Orbs of Magic | https://cariehl.github.io/orbs/ | [orbs-of-magic-threejs](https://github.com/cariehl/orbs-of-magic-threejs) |
| GUIDle | https://cariehl.github.io/guidle/ | [guidle](https://github.com/cariehl/guidle) |
| Hexbound Tactics | https://cariehl.github.io/hexbound/ | [hexbound-threejs](https://github.com/cariehl/hexbound-threejs) |
| Hexmancer | https://cariehl.github.io/hexmancer/ | This repo (single file, `hexmancer/index.html`) |
| Overcharge | https://cariehl.github.io/overcharge/ | This repo (single file, `overcharge/index.html`) |
| MechScape | https://cariehl.github.io/mechscape/ | [mechscape-threejs](https://github.com/cariehl/mechscape-threejs) (private) |
| Voxel Studio (app) | https://cariehl.github.io/voxel-studio/ | [browser-games](https://github.com/cariehl/browser-games) `apps/voxel-studio` |

The game folders hold builds, not source. To update Orbs of Magic, run `npm run build:pages` in orbs-of-magic-threejs, replace `orbs/` here with the contents of its `dist/`, and push to `master`.

To update GUIDle, run `node scripts/build.js` in guidle and copy its `index.html` to `guidle/index.html` here.

Hexbound Tactics has no build step. To update it, replace `hexbound/` here with `index.html`, `css/`, `js/` and `vendor/` from hexbound-threejs `main`.

Commentary for Orbs of Magic goes in `commentary/orbs.md` (Markdown), for Hexbound Tactics in `commentary/hexbound.md`, and for GUIDle in `commentary/guidle.md`. Each game's menu shows a Commentary button only while its file exists. Keep these outside the game folders, which are replaced on every update. Image paths are relative to `commentary/`, and `![alt text](photo.jpg "Caption")` adds a caption under an image.

Hexmancer has no separate source repo or build step. Edit `hexmancer/index.html` directly.

Overcharge has no build step either. Edit `overcharge/index.html` directly; `overcharge/vendor/` holds three.js r160 and marked. Its commentary goes in `commentary/overcharge.md`, and the Back and Commentary buttons show on its title, pause and death screens.

To update MechScape, run `npm run build:pages` in mechscape-threejs and replace `mechscape/` here with the contents of its `dist/`. It plays offline in the browser, or on a game server: the start screen takes a server address, and a link like `https://cariehl.github.io/mechscape/?serverUrl=abc-def.trycloudflare.com` picks it (remembered in the browser, like Orbs of Magic). The name screen warns when the server runs different game files than this copy, so rebuild after changing the game. Its commentary goes in `commentary/mechscape.md`, shown from the start screen.

The front page has an "All games / Mobile-friendly" filter. It defaults to Mobile-friendly on phones and tablets, and remembers the visitor's last choice. Mark a game as mobile-friendly by adding `data-mobile` to its card and a `<span class="mobile">Mobile-friendly</span>` tag.

To add a game, put its static build (using relative asset paths) in a new folder, add a card for it in `index.html` with a 16:9 thumbnail in `img/`, and add a row to the table above.
