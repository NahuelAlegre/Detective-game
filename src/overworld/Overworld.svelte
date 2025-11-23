<script>
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";
  import Scene from "../components/Scene.svelte";
  import {
    currentCase,
    gameMode,
    overworldState,
    time,
    conceptInventory,
  } from "../stores.js";
  import {
    exitOverworld,
    openOverworldDialogue,
    closeOverworldDialogue,
    changeOverworldMap,
    applyOverworldEffects,
  } from "../engine.js";
  import {
    getMapById,
    getInteractablesForMap,
    resolveSpawn,
  } from "./overworldData.js";
  import { initKaboom, destroyKaboom } from "./kaboomInstance.js";

  let canvasEl;
  let k = null;
  let player = null;
  let activePrompt = "";
  let activeInteractable = null;
  let lastFacing = "down";
  let lastSavedPos = null;
  let conceptList = [];
  let unsubscribers = [];
  let mapBounds = { width: 0, height: 0 };
  let activeMapId = null;
  let activeSpawn = null;

  const MOVE_SPEED = 90;

  $: caseData = $currentCase;
  $: state = $overworldState;

  onMount(() => {
    unsubscribers.push(
      conceptInventory.subscribe((list) => (conceptList = list || [])),
    );
    buildIfReady();
  });

  onDestroy(() => {
    unsubscribers.forEach((fn) => fn && fn());
    destroyKaboom();
  });

  $: if ($gameMode === "overworld" && caseData && state.mapId) {
    buildIfReady();
  } else if (k) {
    destroyKaboom();
    k = null;
  }

  function buildIfReady() {
    if ($gameMode !== "overworld") return;
    if (!caseData || !state.mapId || !canvasEl) return;
    if (activeMapId === state.mapId && activeSpawn === state.spawn && k) return;
    buildWorld();
  }

  function buildWorld() {
    destroyKaboom();
    k = initKaboom(canvasEl);
    const map = getMapById(caseData?.id, state.mapId);
    if (!map || !k) {
      activeMapId = null;
      return;
    }

    activeMapId = map.id;
    activeSpawn = state.spawn;
    lastSavedPos = null;
    buildLevel(map);
    spawnPlayer(map);
    wireInput(map);
  }

  function buildLevel(map) {
    const tileSize = map.tileSize || 16;
    const width = (map.layout?.[0]?.length || 0) * tileSize;
    const height = (map.layout?.length || 0) * tileSize;
    mapBounds = { width, height };

    const levelOpts = {
      tileWidth: tileSize,
      tileHeight: tileSize,
      pos: k.vec2(0, 0),
      tiles: {
        // Walls / solid borders
        "#": () => [k.sprite("tiles-room", { frame: 14 }), k.area(), k.body({ isStatic: true })],
        // Marble / floor variants
        "=": () => [k.sprite("tiles-room", { frame: 228 })],
        "~": () => [k.sprite("tiles-room", { frame: 229 })],
        ".": () => [k.sprite("tiles-room", { frame: 132 })],
        // Furniture / props (solid)
        t: () => [k.sprite("tiles-room", { frame: 123 }), k.area(), k.body({ isStatic: true })], // tables / counters
        p: () => [k.sprite("tiles-room", { frame: 134 })], // carpet accents
        r: () => [k.sprite("tiles-room", { frame: 160 }), k.area(), k.body({ isStatic: true })], // bookcase cluster
        c: () => [k.sprite("tiles-room", { frame: 125 }), k.area(), k.body({ isStatic: true })], // cabinet / pillar
        a: () => [k.sprite("tiles-room", { frame: 186 }), k.area(), k.body({ isStatic: true })], // art stand
        d: () => [k.sprite("tiles-room", { frame: 230 }), k.area(), k.body({ isStatic: true })], // crates / storage
        // Doors / exits highlight
        D: () => [k.sprite("tiles-room", { frame: 15 })],
        E: () => [k.sprite("tiles-room", { frame: 188 })],
      },
    };
    k.addLevel(map.layout, levelOpts);
  }

  function spawnPlayer(map) {
    const tileSize = map.tileSize || 16;
    const spawn = resolveSpawn(map, state.spawn);
    const savedPos = state.playerPosition;
    const start = savedPos || {
      x: (spawn.x + 0.5) * tileSize,
      y: (spawn.y + 0.5) * tileSize,
    };

    player = k.add([
      k.sprite("detective_run", { anim: "idle_down" }),
      k.pos(start.x, start.y),
      k.area(),
      k.body({ isStatic: false }),
      k.anchor("center"),
      k.scale(1),
      "player",
    ]);
    player.play("idle_down");
    lastFacing = "down";
  }

  function hasConcept(name) {
    return conceptList.some((c) => c.name === name);
  }

  function wireInput(map) {
    if (!k || !player) return;

    k.onKeyPress("e", () => tryInteract(map));
    k.onKeyPress("space", () => tryInteract(map));
    k.onKeyPress("escape", () => {
      const currentDialogue = get(overworldState).dialogue;
      if (currentDialogue) {
        closeOverworldDialogue();
      } else {
        exitOverworld();
      }
    });

    k.onUpdate(() => {
      if (!player) return;
      const currentState = get(overworldState);
      if (currentState.mode === "locked") {
        playIdle();
      } else {
        handleMovement(map);
      }
      updateCamera();
      persistPosition();
      updatePrompt(map);
    });
  }

  function handleMovement(map) {
    const dir = k.vec2(0, 0);
    if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;

    if (dir.len() > 0) {
      const moveVec = dir.unit().scale(MOVE_SPEED);
      player.move(moveVec);
      const facing =
        Math.abs(dir.x) > Math.abs(dir.y) ? "side" : dir.y < 0 ? "up" : "down";
      lastFacing = facing;
      if (facing === "side") {
        player.flipX = dir.x < 0;
        player.play("walk_side");
      } else if (facing === "up") {
        player.play("walk_up");
      } else {
        player.play("walk_down");
      }
    } else {
      playIdle();
    }
  }

  function playIdle() {
    if (!player) return;
    if (lastFacing === "side") {
      player.play("idle_side");
    } else if (lastFacing === "up") {
      player.play("idle_up");
    } else {
      player.play("idle_down");
    }
  }

  function updateCamera() {
    if (!player || !k) return;
    const halfW = k.width() / 2;
    const halfH = k.height() / 2;
    const cx = clamp(
      player.pos.x,
      halfW,
      Math.max(halfW, mapBounds.width - halfW),
    );
    const cy = clamp(
      player.pos.y,
      halfH,
      Math.max(halfH, mapBounds.height - halfH),
    );
    k.camPos(k.vec2(cx, cy));
  }

  function persistPosition() {
    if (!player) return;
    const pos = { x: player.pos.x, y: player.pos.y };
    if (
      !lastSavedPos ||
      Math.abs(pos.x - lastSavedPos.x) > 1 ||
      Math.abs(pos.y - lastSavedPos.y) > 1
    ) {
      lastSavedPos = pos;
      overworldState.update((s) => ({ ...s, playerPosition: pos }));
    }
  }

  function updatePrompt(map) {
    if (!player || !caseData) {
      activePrompt = "";
      activeInteractable = null;
      return;
    }
    const interactables = getInteractablesForMap(
      caseData.id,
      state.mapId,
      state,
    );
    let candidate = null;
    let candidateDist = Infinity;
    interactables.forEach((i) => {
      if (i.requiresConcepts && !i.requiresConcepts.every(hasConcept)) return;
      const world = tileToWorld(i.x, i.y, map);
      const dist = player.pos.dist(world);
      if (dist < map.tileSize * 1.25 && dist < candidateDist) {
        candidate = { ...i, world };
        candidateDist = dist;
      }
    });

    activeInteractable = candidate;
    activePrompt = candidate
      ? `[E] ${candidate.prompt || defaultPrompt(candidate)}`
      : "";
  }

  function tryInteract(map) {
    const currentState = get(overworldState);
    if (currentState.mode === "locked") return;
    if (!activeInteractable) return;
    if (
      activeInteractable.requiresConcepts &&
      !activeInteractable.requiresConcepts.every(hasConcept)
    ) {
      return;
    }

    if (activeInteractable.type === "exit" && activeInteractable.targetMapId) {
      changeOverworldMap({
        mapId: activeInteractable.targetMapId,
        spawn: activeInteractable.spawn,
        timeCost: activeInteractable.timeCost ?? 15,
      });
      return;
    }

    if (activeInteractable.once) {
      applyOverworldEffects({
        type: "disableInteraction",
        id: activeInteractable.id,
      });
    }

    openOverworldDialogue(activeInteractable.sceneId, {
      interactableId: activeInteractable.id,
      mapId: map.id,
    });
  }

  function defaultPrompt(interactable) {
    switch (interactable.type) {
      case "npc":
        return "Hablar";
      case "object":
        return "Inspeccionar";
      case "exit":
        return "Cambiar sala";
      default:
        return "Interactuar";
    }
  }

  function tileToWorld(x, y, map) {
    const tileSize = map.tileSize || 16;
    return k.vec2((x + 0.5) * tileSize, (y + 0.5) * tileSize);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatTime(minutes) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
</script>

{#if !caseData}
  <div class="overworld-shell">
    <div class="empty-state">Selecciona un caso para entrar al overworld.</div>
  </div>
{:else if !state.mapId}
  <div class="overworld-shell">
    <div class="empty-state">
      El caso no tiene un mapa configurado. Agrega un `start.mapId` en
      overworldData.
    </div>
  </div>
{:else}
  <div class="overworld-shell">
    <div class="overworld-header">
      <div>
        <p class="label">Caso</p>
        <strong>{caseData.title}</strong>
      </div>
      <div>
        <p class="label">Mapa</p>
        <strong
          >{getMapById(caseData.id, state.mapId)?.label || state.mapId}</strong
        >
      </div>
      <div>
        <p class="label">Hora</p>
        <strong>{formatTime($time)}</strong>
      </div>
      <div class="header-actions">
        <span class="hint">Mover: WASD o Flechas / Interactuar: E</span>
        <button class="ghost-btn" on:click={exitOverworld}
          >Volver a historia</button
        >
      </div>
    </div>

    <div class="kaboom-stage">
      <canvas class="kaboom-canvas" bind:this={canvasEl}></canvas>
    </div>

    {#if activePrompt}
      <div class="prompt">{activePrompt}</div>
    {/if}

    {#if state.dialogue}
      <div class="dialogue-overlay">
        <div class="dialogue-header">
          <span
            >Interaccion: {state.dialogue.context?.interactableId ||
              state.dialogue.sceneId}</span
          >
          <button class="ghost-btn" on:click={closeOverworldDialogue}
            >Volver al mapa</button
          >
        </div>
        <div class="dialogue-body">
          <Scene />
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .overworld-shell {
    position: relative;
    flex: 1 1 auto;
    min-height: 600px;
    background: radial-gradient(
        circle at 20% 20%,
        rgba(60, 120, 200, 0.1),
        transparent 30%
      ),
      radial-gradient(
        circle at 80% 0%,
        rgba(200, 160, 80, 0.08),
        transparent 25%
      ),
      linear-gradient(135deg, #0b0f14 0%, #0d1117 100%);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  }

  .overworld-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 12px 16px;
    background: rgba(6, 8, 12, 0.92);
    border-bottom: 1px solid var(--border);
    align-items: center;
  }

  .overworld-header .label {
    margin: 0;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .overworld-header strong {
    display: block;
    color: var(--ink);
    font-weight: 700;
  }

  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }

  .hint {
    font-size: 12px;
    color: var(--muted);
  }

  .ghost-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border);
    color: var(--ink);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ghost-btn:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .kaboom-stage {
    position: relative;
    height: 640px;
    background: #0a0d12;
  }

  .kaboom-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .prompt {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid var(--border);
    color: var(--ink);
    padding: 10px 16px;
    border-radius: 999px;
    font-size: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .dialogue-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 40%,
      rgba(0, 0, 0, 0.45),
      rgba(0, 0, 0, 0.8)
    );
    display: flex;
    flex-direction: column;
    z-index: 20;
  }

  .dialogue-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(5, 7, 10, 0.95);
    border-bottom: 1px solid var(--border);
  }

  .dialogue-body {
    flex: 1;
    position: relative;
  }

  .empty-state {
    padding: 40px;
    text-align: center;
    color: var(--muted);
  }
</style>
