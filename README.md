# Naval Command

Standalone, browser-only Battleship with two 10×10 boards and the standard 5,4,3,3,2 fleet. Select a vessel and a starting square, rotate if needed, or randomize your placement. Launch, then click enemy waters to fire.

The app uses vanilla HTML, CSS, and JavaScript modules. `engine.js` owns placement, shot resolution and the opponent; `app.js` renders state and coordinates turns, while `style.css` supplies the responsive naval interface. All game state lives in memory and resets on reload.

Run `npm start` and open http://localhost:8000. Node 20+ and Python 3 are sufficient; no build step or backend is required. Run tests with `npm test`.

The baseline opponent chooses randomly among untried cells. It remembers every shot to avoid repeats. It receives only shot results and has no access to the hidden player board.

See [the defect log](BUGS.md). This project was designed, implemented, and tested with OpenAI Codex AI assistance.
