<script>
  import MiniMap from "./MiniMap.svelte";
  import Locations from "./Locations.svelte";
  import Notes from "./Notes.svelte";
  import Scene from "./Scene.svelte";
  import DeductionTree from "./DeductionTree.svelte";
  import Suspects from "./Suspects.svelte";
  import Inventory from "./Inventory.svelte";
  import DeductionsPopup from "./DeductionsPopup.svelte";
  import { playModalOpen } from "../sfx.js";
  import { fly } from "svelte/transition";

  let showDeductions = false;
  let showCaseFile = false;
  let activeTab = "investigation"; // Default tab

  function openDeductions() {
    playModalOpen();
    showDeductions = true;
  }

  function toggleCaseFile() {
    playModalOpen();
    showCaseFile = !showCaseFile;
  }

  function setTab(tab) {
    activeTab = tab;
  }
</script>

<div id="game-ui">
  <div class="layout-consolidated">
    <div class="main-stage">
      <Scene />
    </div>

    <!-- Permanent Bottom Bar Inventory -->
    <div class="bottom-inventory">
      <Inventory />
    </div>

    <!-- Corner Map Overlay -->
    <div class="corner-map">
      <MiniMap />
    </div>

    <!-- Case File Toggle Button -->
    <button class="case-file-toggle" on:click={toggleCaseFile}>
      {showCaseFile ? "Cerrar Expediente" : "Abrir Expediente"}
    </button>

    <!-- Case File Panel (Modal/Overlay) -->
    {#if showCaseFile}
      <div
        class="case-file-overlay folder-texture"
        transition:fly={{ y: 50, duration: 300 }}
      >
        <div class="folder-header">
          <span class="folder-label">CONFIDENCIAL // EXPEDIENTE #001</span>
          <button class="close-folder-btn" on:click={toggleCaseFile}>✕</button>
        </div>
        <div class="case-file-content">
          <div class="notebook-tabs">
            <button
              class="tab-btn"
              class:active={activeTab === "investigation"}
              on:click={() => setTab("investigation")}
            >
              Investigación
            </button>
            <button
              class="tab-btn"
              class:active={activeTab === "notes"}
              on:click={() => setTab("notes")}
            >
              Notas
            </button>
            <button
              class="tab-btn"
              class:active={activeTab === "locations"}
              on:click={() => setTab("locations")}
            >
              Lugares
            </button>
          </div>

          <div class="notebook-body paper-texture">
            {#if activeTab === "investigation"}
              <div
                class="tab-pane"
                in:fly={{ x: -20, duration: 300, delay: 100 }}
              >
                <Suspects />
                <DeductionTree />
                <button class="deductions-toggle-btn" on:click={openDeductions}>
                  Abrir Tablero de Deducciones
                </button>
              </div>
            {:else if activeTab === "notes"}
              <div
                class="tab-pane"
                in:fly={{ x: -20, duration: 300, delay: 100 }}
              >
                <Notes />
              </div>
            {:else if activeTab === "locations"}
              <div
                class="tab-pane"
                in:fly={{ x: -20, duration: 300, delay: 100 }}
              >
                <Locations />
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if showDeductions}
    <DeductionsPopup on:close={() => (showDeductions = false)} />
  {/if}
</div>

<style>
  .deductions-toggle-btn {
    width: 100%;
    padding: 12px;
    background: rgba(47, 129, 247, 0.1);
    color: var(--accent-primary);
    border: 1px solid var(--accent-primary);
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s;
    font-family: var(--font-ui);
    box-shadow: 0 0 10px rgba(47, 129, 247, 0.1);
  }
  .deductions-toggle-btn:hover {
    background: rgba(47, 129, 247, 0.2);
    box-shadow: 0 0 15px rgba(47, 129, 247, 0.3);
    transform: translateY(-1px);
  }

  /* New Layout Styles */
  .layout-consolidated {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .main-stage {
    position: absolute;
    inset: 0;
    bottom: 140px; /* Space for inventory */
    z-index: 1;
    overflow: hidden;
  }

  .bottom-inventory {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 140px;
    z-index: 10;
    background: rgba(13, 17, 23, 0.95);
    border-top: 1px solid var(--border);
    padding: 10px;
  }

  .corner-map {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 250px;
    height: 200px;
    z-index: 5;
    opacity: 0.9;
    transition: opacity 0.2s;
  }
  .corner-map:hover {
    opacity: 1;
  }

  .case-file-toggle {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 20;
    background: var(--bg-panel);
    border: 1px solid var(--accent-primary);
    color: var(--accent-primary);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--font-ui);
    text-transform: uppercase;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }
  .case-file-toggle:hover {
    background: rgba(47, 129, 247, 0.1);
  }

  .case-file-overlay {
    position: absolute;
    inset: 40px;
    z-index: 30;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .folder-header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.05);
  }

  .folder-label {
    font-family: var(--typewriter-font);
    font-size: 14px;
    color: var(--ink-dark);
    opacity: 0.7;
    letter-spacing: 2px;
    font-weight: bold;
  }

  .close-folder-btn {
    background: none;
    border: none;
    font-size: 18px;
    color: var(--ink-dark);
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  .close-folder-btn:hover {
    opacity: 1;
  }

  .case-file-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .notebook-tabs {
    display: flex;
    padding: 10px 20px 0;
    gap: 4px;
  }

  .tab-btn {
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 8px 8px 0 0;
    color: var(--ink-dark);
    padding: 12px 24px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
    opacity: 0.7;
    font-family: var(--typewriter-font);
  }

  .tab-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .tab-btn.active {
    background: var(--paper-bg);
    opacity: 1;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
    transform: translateY(0);
    position: relative;
    z-index: 2;
  }

  .notebook-body {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
    position: relative;
    z-index: 1;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .tab-pane {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
