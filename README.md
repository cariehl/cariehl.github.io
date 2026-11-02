# cariehl.github.io

Browser games, hosted at https://cariehl.github.io/. The front page (`index.html`) lists them, and each game lives in its own folder.

| Game | URL | Source |
| --- | --- | --- |
| Orbs of Magic | https://cariehl.github.io/orbs/ | [orbs-of-magic-threejs](https://github.com/cariehl/orbs-of-magic-threejs) |
| GUIDle | https://cariehl.github.io/guidle/ | [guidle](https://github.com/cariehl/guidle) |

The game folders hold builds, not source. To update Orbs of Magic, run `npm run build:pages` in orbs-of-magic-threejs, replace `orbs/` here with the contents of its `dist/`, and push to `master`.

To update GUIDle, run `node scripts/build.js` in guidle and copy its `index.html` to `guidle/index.html` here.

Commentary for Orbs of Magic goes in `commentary/orbs.md` (Markdown). The game's menu shows a Commentary button only while that file exists. Keep it outside `orbs/`, which is replaced on every update. Image paths are relative to `commentary/`, and `![alt text](photo.jpg "Caption")` adds a caption under an image.

To add a game, put its static build (using relative asset paths) in a new folder, add a card for it in `index.html` with a 16:9 thumbnail in `img/`, and add a row to the table above.
