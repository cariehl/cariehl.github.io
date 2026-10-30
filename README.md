# cariehl.github.io

Browser games, hosted at https://cariehl.github.io/. The front page (`index.html`) lists them, and each game lives in its own folder.

| Game | URL | Source |
| --- | --- | --- |
| Orbs of Magic | https://cariehl.github.io/orbs/ | [orbs-of-magic-threejs](https://github.com/cariehl/orbs-of-magic-threejs) |

The game folders hold builds, not source. To update Orbs of Magic, run `npm run build:pages` in orbs-of-magic-threejs, replace `orbs/` here with the contents of its `dist/`, and push to `master`.

Commentary for Orbs of Magic goes in `commentary/orbs.md` (Markdown). The game's menu shows a Commentary button only while that file exists. Keep it outside `orbs/`, which is replaced on every update.

To add a game, put its static build (using relative asset paths) in a new folder, add a card for it in `index.html` with a 16:9 thumbnail in `img/`, and add a row to the table above.
