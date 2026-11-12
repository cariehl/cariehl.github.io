# cariehl.github.io

Browser games, hosted at https://cariehl.github.io/. The front page (`index.html`) lists them, and each game lives in its own folder.

| Game | URL | Source folder |
| --- | --- | --- |
| Orbs of Magic | https://cariehl.github.io/orbs/ | `games/orbs-of-magic` (build: `npm run build:pages`, copy `dist/`) |
| GUIDle | https://cariehl.github.io/guidle/ | `games/guidle` (build: `node scripts/build.js`, copy `index.html`) |
| Hexbound Tactics | https://cariehl.github.io/hexbound/ | `games/hexbound` (no build step: copy `index.html`, `css/`, `js/`, `vendor/`) |
| Hexmancer | https://cariehl.github.io/hexmancer/ | `games/hexmancer` (single file) |
| Overcharge | https://cariehl.github.io/overcharge/ | `games/overcharge` (single file) |
| MechScape | https://cariehl.github.io/mechscape/ | `games/mechscape` (build: `npm run build:pages`, copy `dist/`) |
| Lantern Riichi | https://cariehl.github.io/lantern-riichi/ | `games/lantern-riichi` (no build step: copy `index.html`, `css/`, `js/`) |
| Voxel Studio (app) | https://cariehl.github.io/voxel-studio/ | `apps/voxel-studio` |

The game folders hold builds, not source. The source of every game lives in a private monorepo, in the folder named above. To update a game, build it there and replace its folder here with the result, then push to `master`. For example, to update Orbs of Magic, run `npm run build:pages` in `games/orbs-of-magic` and replace `orbs/` here with the contents of its `dist/`.

Commentary for Orbs of Magic goes in `commentary/orbs.md` (Markdown), for Hexbound Tactics in `commentary/hexbound.md`, and for GUIDle in `commentary/guidle.md`. Each game's menu shows a Commentary button only while its file exists. Keep these outside the game folders, which are replaced on every update. Image paths are relative to `commentary/`, and `![alt text](photo.jpg "Caption")` adds a caption under an image.

Hexmancer has no build step: copy `games/hexmancer/index.html` to `hexmancer/index.html`.

Overcharge has no build step either: copy `games/overcharge/index.html` to `overcharge/index.html`. `overcharge/vendor/` holds three.js r160 and marked. Its commentary goes in `commentary/overcharge.md`, and the Back and Commentary buttons show on its title, pause and death screens.

To update MechScape, run `npm run build:pages` in `games/mechscape` and replace `mechscape/` here with the contents of its `dist/`. It plays offline in the browser, or on a game server: the start screen takes a server address, and a link like `https://cariehl.github.io/mechscape/?serverUrl=abc-def.trycloudflare.com` picks it (remembered in the browser, like Orbs of Magic). The name screen warns when the server runs different game files than this copy, so rebuild after changing the game. Its commentary goes in `commentary/mechscape.md`, shown from the start screen.

The front page has an "All games / Mobile-friendly" filter. It defaults to Mobile-friendly on phones and tablets, and remembers the visitor's last choice. Mark a game as mobile-friendly by adding `data-mobile` to its card and a `<span class="mobile">Mobile-friendly</span>` tag.

To add a game, put its static build (using relative asset paths) in a new folder, add a card for it in `index.html` with a 16:9 thumbnail in `img/`, and add a row to the table above.
