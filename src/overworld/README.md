# Overworld quick guide

- **Maps** live in `src/overworld/maps/`. Add a new entry with `id`, `label`, `tileset`, `tileSize`, `layout`, `solidTiles`, and named `spawnPoints`. Keep layouts small (16x16 tiles) and prefer simple characters like `#` for walls and `.` for floor.
- **Interactables** live in a case-specific module like `src/overworld/interactables_tutorial.js`. Each entry needs an `id`, `type` (`npc` | `object` | `exit`), `mapId`, tile coordinates (`x`, `y`), and either a `sceneId` (for dialogue) or `targetMapId`/`spawn` (for exits). Optional keys: `prompt`, `requiresConcepts`, and `once`.
- **Register per case** in `src/overworld/overworldData.js` by adding a new object to `overworldCases` with `start`, `maps`, and `interactables`. The `start.mapId` and `start.spawn` pick the entry point when calling `enterOverworld()`.
- **Hook to story**: use `openOverworldDialogue(sceneId, context)` to launch the existing dialogue UI, and return control with `closeOverworldDialogue()`. Narrative scenes can emit `overworldEffects` like `changeMap`, `unlockInteraction`, `disableInteraction`, or `moveNPC` to push changes back onto the overworld layer.
- **Enter/exit**: the header button toggles overworld mode; you can also call `enterOverworld({ mapId, spawn })` and `exitOverworld()` from code.
