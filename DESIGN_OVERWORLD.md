# Overworld Design – Detective HD Codex

This document defines a **simple, focused overworld add‑on** for the existing narrative game. The goal is to walk around pixel maps as the detective and trigger the **current dialogue / concept systems** when interacting with characters and objects.

The overworld should be **lightweight**: only a few core features, easy to extend per case, and never more complex than the main investigation systems.

---

## 1. Goals and Constraints

- **Add-on, not a new game**: The overworld exists to give spatial context and atmosphere, but the "real" gameplay remains concepts, deductions, and dialogue.
- **Keep controls and rules simple**:
  - Walk with arrow keys / WASD.
  - One interaction key (e.g., `E` or `Space`).
  - No combat, no platforming, no complex physics.
- **Reuse existing systems**: All conversations, choices, concept gains, and deductions are still handled by the current engine and UI.
- **Use Kaboom** for rendering and movement: top‑down 2D pixel maps, running inside the existing Svelte/Vite app.

---

## 2. High-Level Architecture

1. **Overworld Mode Component**
   - Create `src/overworld/Overworld.svelte`.
   - Contains a `<canvas>` or container where Kaboom will render.
   - Shown/hidden via a Svelte store (e.g., `mode = "story" | "overworld"`).

2. **Kaboom Initialization**
   - Add Kaboom as a dependency in `package.json`.
   - Create `src/overworld/kaboomInstance.js`:
     - Initializes Kaboom (pixel-perfect scaling, canvas target).
     - Exposes helpers to load sprites, define scenes, and clean up.

3. **State Sharing with Existing Engine**
   - Use Svelte stores (in `stores.js`) as the **single source of truth** for:
     - Current case ID and scene ID.
     - Inventory & concepts.
     - Locations and time (if already present).
   - Overworld reads these stores (for conditions) and dispatches events back when the player triggers interactions.

4. **Mode Switching**
   - Narrative UI remains mostly as is.
   - App shows either:
     - **Story view** (current experience today), or
     - **Overworld view** + a minimal header/footer with key information.
   - A store function like `enterOverworld({ caseId, mapId, spawn })` and `exitOverworld()` coordinates transitions.

---

## 3. Core Gameplay Loop in Overworld

1. Player appears on a map as a pixel detective.
2. Player moves freely within that map.
3. When the player is close to an NPC or hotspot and presses the interaction key:
   - Kaboom pauses player movement.
   - A callback is fired into the Svelte engine, e.g. `openDialogue({ caseId, sceneId, source: "overworld", context })`.
4. The **existing dialogue UI** opens and plays out as usual.
5. When the dialogue / scene finishes, it may:
   - Add concepts, change suspicion, update location state.
   - Return small "overworld effects" (e.g., unlock a door, move an NPC, change map).
6. Control goes back to the overworld.

The overworld never makes story decisions by itself; it only tells the engine **"the player interacted with X at Y"** and reacts to the engine's response.

---

## 4. Maps and Data (Kept Simple)

### 4.1 Map Representation

- Use **small, handcrafted maps** for each case (no need for a full editor at first).
- Represent maps as JavaScript data in `src/overworld/maps/`:
  - Tile size: choose one (e.g., `16x16`), consistent with tileset.
  - Each map has:
    - `id`: string (e.g., `"tutorial-lobby"`).
    - `tileset`: sprite sheet path in `public/sprites`.
    - `layout`: 2D array or array of strings defining floor/walls.
    - `solidTiles`: which tile characters/indices are solid.
    - `spawnPoints`: named start positions (e.g., `"default"`, `"afterOffice"`).

### 4.2 Interactables

- For each map, define a **small list of interactables**:
  - Example structure:
    ```js
    {
      id: "rivas",
      type: "npc",        // "npc" | "object" | "exit" | "area"
      mapId: "tutorial-lobby",
      x: 10, y: 4,         // tile coordinates
      sceneId: "rivas_intro", // existing narrative scene id
      requiresConcepts: ["metallic_echo"], // optional
      once: false          // if true, deactivate after used
    }
    ```
- Interactables are stored in simple JS modules like `src/overworld/interactables_tutorial.js`.

### 4.3 Minimal Overworld Effects

- To keep logic simple, define only a few allowed effects a scene can send back to the overworld:
  - `unlockInteraction(id)` – enable a previously disabled interactable.
  - `disableInteraction(id)` – hide/disable an interactable.
  - `moveNPC(id, { mapId, x, y })` – reposition an NPC.
  - `changeMap({ mapId, spawn })` – move player to another map.
- Scenes can specify these in a small field, e.g. `overworldEffects`, in the case data or in a small mapping table.

---

## 5. Player Character and Controls

### 5.1 Detective Sprite

- Use the detective sprite sheet from `public/sprites`.
- In Kaboom, define basic animations:
  - `idle_down`, `idle_up`, `idle_side`.
  - `walk_down`, `walk_up`, `walk_side`.
- Keep hitbox slightly smaller than the visible sprite for smoother collisions.

### 5.2 Movement Rules

- Movement is **gridless but simple**:
  - Continuous movement controlled by arrow keys / WASD.
  - Constant speed, no acceleration/jumping.
- Kaboom handles collisions against solid tiles and objects.
- A minimal camera that follows the player, clamped to map bounds.

### 5.3 Input

- Keyboard only (gamepad can be a later bonus):
  - `Arrow keys` / `WASD`: move.
  - `E` (or `Space`): interact when near something.
  - `Esc`: close dialogue (if allowed) or open pause menu.

### 5.4 Player State

- Very small state machine:
  - `"move"`: free control.
  - `"locked"`: during dialogue or transitions (no input processed).

---

## 6. Interactions and Dialogue Hook

### 6.1 Detecting Interaction

- Each interactable gets a small Kaboom area or is checked via distance to the player.
- When player is inside/near and presses the interaction key:
  - Check **conditions** (concepts, flags, etc.) through Svelte stores.
  - If allowed, call `openDialogue` with the configured `sceneId`.
- Show a small **prompt** when in range (e.g., `"[E] Talk"`).

### 6.2 Opening the Current Dialogue System

- Use an existing function/store (or create one) like `startScene(sceneId, options)` in `engine.js` or `stores.js`.
- Overworld calls this function and then:
  - Sets `playerState = "locked"`.
  - Optionally dims or pauses Kaboom rendering (or just freezes physics).
- The Svelte dialogue UI appears over the canvas just as it does over the current layout.

### 6.3 Returning to Overworld

- When the scene ends, the narrative engine sends back a **simple result object**, for example:
  ```js
  {
    overworldEffects: [
      { type: "unlockInteraction", id: "drawer" },
      { type: "moveNPC", id: "rivas", mapId: "hallway", x: 5, y: 3 }
    ]
  }
  ```
- Overworld applies these effects and sets `playerState = "move"` again.

---

## 7. Locations, Time, and Case Flow (Minimal)

- Each **map** is associated with an existing `location` in the case data, where that makes sense.
- Entering a map updates the current location store (used by existing systems).
- Time system integration (optional first pass):
  - Moving between maps consumes a fixed time cost (e.g., +15 minutes).
  - Interactions already have time costs via scenes; keep that logic where it is.
- For the first implementation, support **linear or almost-linear flow**:
  - A small number of maps.
  - A few doors/exits.
  - Clear main path, minimal backtracking.

---

## 8. UI/UX Guidelines

- Overworld UI should be **clean and unobtrusive**:
  - Show the world full-screen or in a large panel.
  - Optional small HUD with current time, case title, and hint icon.
- Dialogue overlay should dim the map slightly so it is clear that controls are locked.
- Provide a simple **controls hint** in an early screen or help panel:
  - "Move: WASD or Arrows. Interact: E. Pause: Esc."
- Keep number of interactables per map low to avoid clutter.

---

## 9. Saving and Loading

- Extend existing save data (if present) with:
  - `overworld: { mapId, playerX, playerY, npcStates, disabledInteractions }`.
- On load:
  - Recreate map and NPCs from definitions plus saved state.
  - Place player at saved position.
- For the first iteration, it is acceptable to **auto-save only at key beats** (e.g., after major scenes or map transitions).

---

## 10. Implementation Milestones (Simple Roadmap)

1. **Milestone 1 – Kaboom Prototype**
   - Install Kaboom and create `Overworld.svelte` with a basic map.
   - Player can move and collide with walls.

2. **Milestone 2 – Connect to Dialogue**
   - Add one interactable that opens an existing tutorial scene.
   - Dialogue overlay appears and closes correctly, returning control to the overworld.

3. **Milestone 3 – Tutorial Case Map**
   - Create a small tutorial map (1–2 rooms) with:
     - Spawn point.
     - 2–3 NPC/objects linked to existing scenes.
     - 1 door/exit to a second map or a different part of the same map.

4. **Milestone 4 – Basic State Changes**
   - Scenes can unlock/disable a door or move one NPC.
   - Integrate simple time cost on map transitions.

5. **Milestone 5 – Polish and Documentation**
   - Add prompts, simple camera behavior, and animation tuning.
   - Document how to add a new map, interactable, and link it to a scene.

The intention is to stop here unless more complexity is clearly needed. The overworld should remain a light, atmospheric layer on top of the core investigation systems, not a separate deep gameplay system.