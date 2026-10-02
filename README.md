[Play Naval Command live](https://ccie5818.github.io/battleship-naval-command/)

# Naval Command

Standalone, browser-only Battleship with two 10×10 boards and the standard 5,4,3,3,2 fleet. Select a vessel and a starting square, rotate if needed, or randomize your placement. Launch, then click enemy waters to fire.

The app uses vanilla HTML, CSS, and JavaScript modules. `engine.js` owns placement, shot resolution and the opponent; `app.js` renders state and coordinates turns, while `style.css` supplies the responsive naval interface. All game state lives in memory and resets on reload.

Run `npm start` and open http://localhost:8000. Node 20+ and Python 3 are sufficient; no build step or backend is required. Run tests with `npm test`.

For browser regressions, run `npm install`, start the local server in another terminal, then run `npm run test:browser`. The suite defaults to installed Chrome on Windows; set `CHROME_PATH` to your Chrome executable on other systems. Set `TEST_URL` to the live URL to test the deployed game. Screenshots are written to ignored `test-results/`.

The opponent hunts untried squares using checkerboard parity, then explores neighboring squares after a hit. A second aligned hit establishes orientation so it extends both ends; sinking a vessel clears those resolved hits and resumes hunting or another unresolved target. It remembers every shot and receives only shot results, never the hidden player board.

See [the defect log](BUGS.md). This project was designed, implemented, and tested with OpenAI Codex AI assistance.

## Design and testing debrief

The dark ocean palette, mint mission status, coordinate labels, and separate friendly/enemy panels make board ownership and turn state clear. Native buttons support keyboard operation, a live status announces turn outcomes, square labels include shot state, and hit/miss symbols accompany colors. Ship placement permits touching ships and fires alternate turns, including after a hit; these are the rules used consistently by the game and its tests.

Validation includes 11 Node tests, 200 random placement checks, 100 complete AI fleet simulations, and Chrome browser regressions for out-of-order manual placement, vertical boundaries, combat locking, restart during a pending turn, and complete victory/defeat rounds. Desktop (1440px) and mobile (390px) screenshots were inspected; the same browser suite passed on GitHub Pages. Four genuine defects, including a browser-only timer failure, are recorded with reproduction and verification in the defect log.

The repository was public before the first implementation commit. The first pushed commit contained the playable random-AI baseline and bug document; a second pushed commit added hunt/target strategy and state fixes, followed by the test and documentation work. Deployment uses free GitHub Pages from `main` with no backend, credentials, or paid services in the game.

Limitations: testing used desktop Chrome with mobile viewport emulation, not physical phones or Safari/Firefox. State is intentionally in memory, so reloads discard a game. Google Fonts are optional visual enhancements with system-font fallbacks; no font is required to play. The opponent is a fair heuristic, not an optimal probability solver, and neighboring touching ships can make orientation ambiguous.
