<script>
  import {
    conceptInventory,
    lastCombinationMessage,
    interactionMode,
  } from "../stores.js";
  import { combineConcepts, ponderConcept } from "../engine.js";
  import { playChoiceClick } from "../sfx.js";

  let selected = [];
  let showArchived = false;
  let draggingItem = null;
  let shake = false;

  function toggleSelection(name) {
    playChoiceClick();
    if (selected.includes(name)) {
      selected = selected.filter((s) => s !== name);
    } else {
      // Only allow 1 selection for inspection now, since combination is DnD
      selected = [name];
    }
  }

  function handlePonder() {
    if (selected.length === 1) {
      playChoiceClick();
      ponderConcept(selected[0]);
      selected = [];
    }
  }

  function toggleInteractionMode() {
    playChoiceClick();
    if ($interactionMode) {
      interactionMode.set(null);
    } else if (selected.length === 1) {
      interactionMode.set(selected[0]);
    }
  }

  function toggleArchivedView() {
    playChoiceClick();
    showArchived = !showArchived;
  }

  function handleDragStart(event, concept) {
    if (concept.archived) return;
    draggingItem = concept;
    event.dataTransfer.effectAllowed = "link";
    event.dataTransfer.setData("text/plain", concept.name);
    // Optional: set drag image
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "link";
  }

  let flash = false;

  function handleDrop(event, targetConcept) {
    event.preventDefault();
    if (
      draggingItem &&
      draggingItem.name !== targetConcept.name &&
      !targetConcept.archived
    ) {
      playChoiceClick();
      const success = combineConcepts(draggingItem.name, targetConcept.name);
      if (!success) {
        triggerShake();
      } else {
        triggerFlash();
      }
      draggingItem = null;
      selected = [];
    }
  }

  function triggerShake() {
    shake = true;
    setTimeout(() => (shake = false), 500);
  }

  function triggerFlash() {
    flash = true;
    setTimeout(() => (flash = false), 500);
  }

  $: activeInventory = $conceptInventory.filter((c) => !c.archived);
  $: archivedInventory = $conceptInventory.filter((c) => c.archived);
  $: displayInventory = showArchived
    ? [...activeInventory, ...archivedInventory]
    : activeInventory;
</script>

<aside class="inventory-bar">
  <div class="inventory-controls">
    <div class="header-row">
      <h2>Inventario</h2>
      <button class="toggle-archived" on:click={toggleArchivedView}>
        {showArchived ? "Ocultar Archivados" : "Ver Archivados"}
      </button>
    </div>

    <div class="actions-row">
      <button
        class="action-btn"
        disabled={selected.length !== 1}
        on:click={handlePonder}
      >
        INSPECCIONAR
      </button>
      <button
        class="action-btn"
        class:active={$interactionMode}
        disabled={selected.length !== 1 && !$interactionMode}
        on:click={toggleInteractionMode}
      >
        {$interactionMode ? "CANCELAR USO" : "USAR"}
      </button>
    </div>

  </div>

  <div class="inventory-panel">
    {#if $lastCombinationMessage}
      <div class="feedback-message" class:anim-shake={shake}>
        {$lastCombinationMessage}
      </div>
    {/if}

    <ul id="inventory-list" class:anim-shake={shake} class:anim-flash={flash}>
      {#if displayInventory.length === 0}
        <li class="faint">Sin conceptos activos.</li>
      {:else}
        {#each displayInventory as concept}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <li
            draggable={!concept.archived}
            class:selected={selected.includes(concept.name)}
            class:archived={concept.archived}
            class:dragging={draggingItem === concept}
            on:click={() => !concept.archived && toggleSelection(concept.name)}
            on:dragstart={(e) => handleDragStart(e, concept)}
            on:dragover={handleDragOver}
            on:drop={(e) => handleDrop(e, concept)}
          >
            <div class="concept-head">
              <div class="concept-name">
                <span class="concept-dot"></span>
                {concept.name}
              </div>
            </div>
            <div class="concept-type" data-kind={concept.type || "sensorial"}>
              {concept.type || "sensorial"}
            </div>
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</aside>

<style>
  .inventory-bar {
    display: flex;
    height: 100%;
    gap: 20px;
  }

  .inventory-controls {
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-right: 1px solid var(--border);
    padding-right: 20px;
    overflow-y: auto;
  }

  .inventory-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-row h2 {
    margin: 0;
    font-size: 1rem;
    color: var(--accent-primary);
  }

  .toggle-archived {
    background: none;
    border: 1px solid #444;
    color: #888;
    font-size: 0.7rem;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 4px;
  }
  .toggle-archived:hover {
    color: #ccc;
    border-color: #666;
  }

  .feedback-message {
    background: rgba(44, 62, 80, 0.85);
    color: #ecf0f1;
    padding: 12px 14px;
    border-radius: 6px;
    font-size: 1rem;
    line-height: 1.35;
    border-left: 4px solid #3498db;
    max-height: 160px;
    overflow-y: auto;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  }

  .action-btn {
    width: 100%;
    background: #111;
    border: 1px solid #444;
    color: #ccc;
    padding: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    text-transform: uppercase;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .action-btn:not(:disabled):hover {
    background: #222;
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
  .action-btn.active {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
  }

  #inventory-list {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow-y: auto;
    align-content: flex-start;
  }

  li {
    cursor: grab;
    transition: all 0.2s;
    border: 1px solid var(--border);
    padding: 8px;
    border-radius: 6px;
    background: rgba(13, 17, 23, 0.6);
    width: 140px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }
  li:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
  li:active {
    cursor: grabbing;
  }
  li.selected {
    background: rgba(52, 152, 219, 0.1);
    border: 1px solid #3498db;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.2);
  }
  li.dragging {
    opacity: 0.4;
    border-style: dashed;
  }
  li.archived {
    opacity: 0.5;
    pointer-events: none;
    background: #000;
    filter: grayscale(1);
  }

  .concept-head {
    display: flex;
    align-items: flex-start;
  }
  .concept-name {
    font-weight: 600;
    color: #eee;
    font-size: 0.85rem;
    line-height: 1.2;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .concept-dot {
    display: none; /* Hide dot for cleaner look in grid */
  }

  .concept-type {
    font-size: 0.65rem;
    text-transform: uppercase;
    padding: 2px 4px;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.3);
    color: #aaa;
    align-self: flex-start;
  }
  .concept-type[data-kind="sensorial"] {
    color: #e67e22;
  }
  .concept-type[data-kind="deducido"] {
    color: #2ecc71;
  }
  .concept-type[data-kind="falso"] {
    color: #e74c3c;
  }

  .faint {
    color: #555;
    font-style: italic;
    padding: 20px;
    width: 100%;
    text-align: center;
  }
</style>
