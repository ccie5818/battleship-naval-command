# Discovered defects

This log records defects actually reproduced during development. Development and testing are AI assisted; no human authorship is implied.

## 1. Restart inherited an old opponent turn
- **Symptom:** Restarting during the 450 ms AI delay returned to “Your turn” with a shot on the newly empty board.
- **How found:** Chrome baseline audit: randomize → launch → fire → restart → wait 600 ms. Output: `Restart audit: Your turn 1`.
- **Root cause:** Reset replaced boards but left the previous turn's timer active; its callback used the new global state.
- **Fix:** Cancel timers before resetting and guard callbacks with a generation token.
- **Verification:** Timer unit test invokes even a stale cancelled callback. Browser regression checks clean deployment after the old delay.

## 2. Out-of-order placement corrupted fleet inventory
- **Symptom:** Placing Destroyer first disabled Carrier while leaving Destroyer selectable, allowing a nonstandard fleet.
- **How found:** Baseline Chrome audit selected Destroyer and placed A1. Disabled ship output was `Carrier 5`.
- **Root cause:** UI inferred ship identity from placement count instead of recording which fleet entry was placed.
- **Fix:** Store each ship's fleet ID, disable that entry, and select the first remaining entry.
- **Verification:** Browser regression places all five vessels out of order and checks exactly 17 occupied squares and launch readiness.

## 3. Deployment controls remained active during combat
- **Symptom:** Randomize and launch controls stayed visible during firing and could replace the friendly fleet midgame.
- **How found:** Baseline browser inspection showed `{hidden: true, display: 'flex'}` after launch.
- **Root cause:** The author stylesheet's flex display overrode the browser's default hidden styling.
- **Fix:** Add an explicit `[hidden]` display rule.
- **Verification:** Browser regression asserts the control section is hidden throughout combat.

## 4. Timer abstraction invoked browser timers with the wrong receiver
- **Symptom:** Firing stalled at “Enemy is responding…” with the enemy grid still enabled.
- **How found:** Chrome regression failed combat locking; a focused browser probe captured `Illegal invocation` on the first shot. Node timer tests had passed.
- **Root cause:** The new timer abstraction stored native `window.setTimeout` and called it as a class method, changing its receiver.
- **Fix:** Wrap the default native timer functions in arrow functions that invoke them normally.
- **Verification:** Browser regression checks combat locking, actual AI responses, two completed rounds, and zero JavaScript errors.
