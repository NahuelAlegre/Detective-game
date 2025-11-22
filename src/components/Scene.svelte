<script>
  import {
    currentScene,
    conceptInventory,
    pendingProgressScenes,
    suspects,
    locations,
    interactionMode,
  } from "../stores.js";
  import {
    showScene,
    addConcept,
    restartGame,
    openCaseSelector,
    updateSuspicions,
    addSuspectConcept,
    applyLocationProgress,
    useItemOnChoice,
  } from "../engine.js";
  import {
    playChoiceClick,
    playEvidenceFound,
    playInspectSuccess,
    playAmbientNoise,
  } from "../sfx.js";
  import { getSceneArt } from "../data/artRegistry.js";
  import { onMount } from "svelte";

  $: scene = $currentScene;
  $: choices = getChoices(scene, $pendingProgressScenes);
  $: art = getSceneArt(scene);

  let flash = false;

  onMount(() => {
    // Start ambient noise - subtle hum
    playAmbientNoise("hum");
  });

  function getChoices(scene, pending) {
    if (!scene) return [];
    const unlockedFromProgress = Array.from(pending.entries()).map(
      ([sceneId, text]) => ({
        text,
        next: sceneId,
      }),
    );
    return [...(scene.choices || []), ...unlockedFromProgress];
  }

  function hasConcept(name) {
    return $conceptInventory.some((c) => c.name === name);
  }

  function getSuspicionLevel(name) {
    const entry = $suspects.find((s) => s.name === name);
    return entry ? entry.suspicionLevel : 0;
  }

  function ensureLocation(name) {
    return $locations[name] || { currentProgress: 0, completed: false };
  }

  function choiceAllowed(choice) {
    if (choice.requires && !choice.requires.every(hasConcept)) return false;

    if (choice.requiresSuspicion) {
      const checks = Array.isArray(choice.requiresSuspicion)
        ? choice.requiresSuspicion
        : [choice.requiresSuspicion];
      const ok = checks.every((req) => {
        const level = getSuspicionLevel(req.name);
        const min = req.min ?? req.atLeast ?? 0;
        const max = req.max ?? req.atMost ?? 5;
        return level >= min && level <= max;
      });
      if (!ok) return false;
    }

    if (choice.requiresProgress) {
      const progress = Array.isArray(choice.requiresProgress)
        ? choice.requiresProgress
        : [choice.requiresProgress];
      const ok = progress.every((req) => {
        const loc = ensureLocation(req.location);
        const min = req.min ?? req.atLeast ?? 0;
        const needsCompleted = req.completed === true;
        if (needsCompleted && !loc.completed) return false;
        return loc.currentProgress >= min;
      });
      if (!ok) return false;
    }

    return true;
  }

  function handleChoice(choice) {
    if ($interactionMode) {
      playChoiceClick();
      useItemOnChoice($interactionMode, choice.id || choice.text); // Use ID if available, else text as fallback ID
      return;
    }

    if (choice.next === "restart") {
      playChoiceClick();
      restartGame();
      return;
    }
    if (choice.next === "case-selector") {
      playChoiceClick();
      openCaseSelector();
      return;
    }

    let evidenceFound = false;

    if (choice.gain) {
      [].concat(choice.gain).forEach((r) => addConcept(r));
      evidenceFound = true;
    }
    if (choice.suspectAdjustments) {
      choice.suspectAdjustments.forEach((adj) =>
        updateSuspicions(adj.name, adj.change || 0),
      );
    }
    if (choice.suspectConcepts) {
      choice.suspectConcepts.forEach((pair) =>
        addSuspectConcept(pair.name, pair.concept),
      );
    }
    if (choice.locationProgress) {
      const unlock = applyLocationProgress(choice.locationProgress);
      if (unlock) {
        pendingProgressScenes.update((map) =>
          map.set(unlock.scene, unlock.text),
        );
      }
    }

    if (evidenceFound) {
      playEvidenceFound();
      triggerFlash();
    } else {
      // If it's just a text update (inspection), play a success chime
      // We assume if there's no gain, it's an inspection or navigation
      playInspectSuccess();
    }

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        showScene(choice.next);
      });
    } else {
      showScene(choice.next);
    }
  }

  function triggerFlash() {
    flash = true;
    setTimeout(() => (flash = false), 500);
  }
</script>

<main class="scene-container" class:anim-flash={flash}>
  <div class="scene-background">
    {#if art.background?.src}
      <img
        class="scene-bg-img"
        src={art.background.src}
        alt={art.background.alt}
        loading="lazy"
      />
    {:else}
      <div class="scene-bg-placeholder">Escena sin imagen</div>
    {/if}
    <div class="scene-vignette"></div>
  </div>

  <div class="scene-overlays">
    {#each art.overlays as overlay (overlay.id)}
      {#if overlay.src}
        <img
          class={`scene-overlay-img ${overlay.slot || "center"}`}
          src={overlay.src}
          alt={overlay.alt}
          loading="lazy"
          style={`z-index: ${overlay.zIndex || 2};`}
        />
      {:else}
        <div
          class={`scene-overlay-placeholder ${overlay.slot || "center"}`}
          style={`z-index: ${overlay.zIndex || 2};`}
        >
          {overlay.label}
        </div>
      {/if}
    {/each}
  </div>

  <div class="scene-ui-layer">
    <div class="scene-text-panel">
      <div class="scene-text">
        {@html scene ? scene.text : ""}
      </div>

      {#if scene && scene.puzzle}
        <div class="info-block">
          <p class="info-title"><span class="dot"></span>Prueba de conceptos</p>
          <p class="info-text">
            {scene.puzzle.description || "Puzzle de conceptos"}
          </p>
          <button
            class="puzzle-btn"
            on:click={() => {
              playChoiceClick();
              const requirements = scene.puzzle.requirements || [];
              const hasAll = requirements.every(hasConcept);
              const target = hasAll
                ? scene.puzzle.success
                : scene.puzzle.failure;
              if (target) showScene(target);
            }}>Intentar resolver</button
          >
        </div>
      {/if}

      <div class="choices">
        {#each choices as choice}
          {#if choiceAllowed(choice)}
            <button
              class="choice-btn"
              class:interaction-target={$interactionMode}
              on:click={() => handleChoice(choice)}
            >
              {choice.text}
            </button>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  .scene-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Push content to bottom */
  }

  .scene-background {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: #000;
  }

  .scene-bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
    transition: opacity 0.5s ease;
  }

  .scene-bg-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--muted);
    letter-spacing: 2px;
    text-transform: uppercase;
    background: repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.03),
        rgba(255, 255, 255, 0.03) 10px,
        transparent 10px,
        transparent 20px
      ),
      linear-gradient(to bottom, #0a0c10, #161b22);
    font-family: var(--font-mono);
  }

  .scene-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 60%,
      rgba(0, 0, 0, 0.9) 100%
    );
    pointer-events: none;
  }

  .scene-overlays {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  .scene-overlay-img {
    position: absolute;
    bottom: 0;
    max-width: 40%;
    max-height: 80%;
    object-fit: contain;
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.65));
  }

  .scene-overlay-img.left {
    left: 5%;
  }
  .scene-overlay-img.right {
    right: 5%;
  }
  .scene-overlay-img.center {
    left: 50%;
    transform: translateX(-50%);
  }

  .scene-overlay-placeholder {
    position: absolute;
    bottom: 20%;
    background: rgba(5, 7, 10, 0.75);
    border: 1px dashed var(--border);
    color: var(--muted);
    padding: 12px;
    border-radius: 8px;
    min-width: 140px;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    backdrop-filter: blur(4px);
  }
  .scene-overlay-placeholder.left {
    left: 10%;
  }
  .scene-overlay-placeholder.right {
    right: 10%;
  }
  .scene-overlay-placeholder.center {
    left: 50%;
    transform: translateX(-50%);
  }

  .scene-ui-layer {
    position: relative;
    z-index: 5;
    width: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align text to left */
    background: linear-gradient(
      to top,
      rgba(5, 7, 10, 1) 0%,
      rgba(5, 7, 10, 0.9) 40%,
      transparent 100%
    );
    min-height: 40%;
  }

  .scene-text-panel {
    max-width: 800px;
    width: 100%;
  }

  :global(.scene-text p) {
    font-family: var(--font-heading);
    font-size: 20px;
    line-height: 1.8;
    color: #e6edf3;
    margin-bottom: 24px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    font-weight: 300;
  }

  :global(.scene-text p::first-letter) {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--accent-primary);
    float: left;
    margin-right: 8px;
    line-height: 1;
  }

  /* Puzzle / Minigame */
  .info-block {
    background: rgba(47, 129, 247, 0.1);
    border-left: 3px solid var(--accent-primary);
    padding: 16px;
    margin: 20px 0;
    border-radius: 0 4px 4px 0;
  }

  .info-title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent-primary);
    margin: 0 0 8px;
    font-weight: 700;
  }

  .info-text {
    font-size: 14px;
    color: var(--ink);
    margin: 0 0 12px;
  }

  .puzzle-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: var(--font-ui);
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    cursor: pointer;
  }

  /* Choices */
  .choices {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }

  .choice-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 3px solid var(--muted);
    color: var(--ink);
    padding: 14px 20px;
    font-size: 16px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 0 4px 4px 0;
    font-family: var(--font-ui);
    backdrop-filter: blur(4px);
    max-width: 600px;
  }

  .choice-btn:hover {
    background: rgba(47, 129, 247, 0.15);
    border-left-color: var(--accent-primary);
    border-color: var(--accent-primary);
    padding-left: 24px;
    text-shadow: 0 0 8px rgba(47, 129, 247, 0.5);
  }

  :global(.choice-btn.interaction-target) {
    cursor: crosshair;
    border-color: #e67e22;
    border-left-color: #e67e22;
  }
  :global(.choice-btn.interaction-target:hover) {
    background: rgba(230, 126, 34, 0.15);
    text-shadow: 0 0 8px rgba(230, 126, 34, 0.5);
  }
</style>
