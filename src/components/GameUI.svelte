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
  import { fly, fade } from "svelte/transition";
  import { uiState } from "../stores.js";

  let showDeductions = false;

  function openDeductions() {
    playModalOpen();
    showDeductions = true;
  }

  function closeCaseFile() {
    playModalOpen();
    uiState.update((s) => ({ ...s, activeView: null }));
  }

  function setTab(tab) {
    uiState.update((s) => ({ ...s, activeTab: tab }));
  }
</script>

<div id="game-ui">
  <div class="layout-consolidated">
    <div class="main-stage">
      <Scene />
    </div>

    <!-- Permanent Bottom Bar Inventory (Visible unless inventory view is active, or maybe always visible? 
         Plan said toggle, but let's keep it visible for now and maybe the inventory button expands it or does nothing yet if not full view) 
         Actually, let's make the inventory button toggle this bar if we want, or just leave it. 
         For now, I'll respect the plan: "Inventario" button toggles bottom inventory.
    -->
    {#if $uiState.activeView === "inventory" || $uiState.activeView === null}
      <!-- Showing it by default (null) or when explicitly active. 
           Wait, if activeView is 'caseFile', should we hide inventory? 
           The image shows the case file overlaying everything. 
           Let's hide bottom inventory when case file is open.
      -->
      {#if $uiState.activeView !== "caseFile"}
        <div class="bottom-inventory" transition:fly={{ y: 20, duration: 200 }}>
          <Inventory />
        </div>
      {/if}
    {/if}

    <!-- Corner Map Overlay -->
    <div class="corner-map">
      <MiniMap />
    </div>

    <!-- Case File Panel (Modal/Overlay) -->
    {#if $uiState.activeView === "caseFile"}
      <div
        class="case-file-overlay tech-panel"
        transition:fly={{ y: 20, duration: 300 }}
      >
        <div class="folder-header">
          <span class="folder-label">CONFIDENCIAL // EXPEDIENTE #001</span>
          <button class="close-folder-btn" on:click={closeCaseFile}>✕</button>
        </div>
        <div class="case-file-content">
          <div class="notebook-tabs">
            <button
              class="tab-btn"
              class:active={$uiState.activeTab === "investigation"}
              on:click={() => setTab("investigation")}
            >
              Investigación
            </button>
            <button
              class="tab-btn"
              class:active={$uiState.activeTab === "notes"}
              on:click={() => setTab("notes")}
            >
              Notas
            </button>
            <button
              class="tab-btn"
              class:active={$uiState.activeTab === "locations"}
              on:click={() => setTab("locations")}
            >
              Lugares
            </button>
          </div>

          <div class="notebook-body">
            {#if $uiState.activeTab === "investigation"}
              <div
                class="tab-pane"
                in:fly={{ x: -10, duration: 200, delay: 50 }}
              >
                <Suspects />
                <DeductionTree />
                <button class="deductions-toggle-btn" on:click={openDeductions}>
                  Abrir Tablero de Deducciones
                </button>
              </div>
            {:else if $uiState.activeTab === "notes"}
              <div
                class="tab-pane"
                in:fly={{ x: -10, duration: 200, delay: 50 }}
              >
                <Notes />
              </div>
            {:else if $uiState.activeTab === "locations"}
              <div
                class="tab-pane"
                in:fly={{ x: -10, duration: 200, delay: 50 }}
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
    bottom: 0; /* Full height now, inventory overlays */
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
    background: rgba(5, 7, 10, 0.9);
    border-top: 1px solid var(--border);
    padding: 10px;
    backdrop-filter: blur(10px);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  }

  .corner-map {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 5;
    opacity: 0.9;
    transition: opacity 0.2s;
  }
  .corner-map:hover {
    opacity: 1;
  }

  .case-file-overlay {
    position: absolute;
    inset: 20px;
    z-index: 30;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
    border: 1px solid var(--accent-primary);
    overflow: hidden;
    background: rgba(13, 17, 23, 0.95);
    backdrop-filter: blur(20px);
  }

  .folder-header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid var(--border);
    background: rgba(47, 129, 247, 0.05);
  }

  .folder-label {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--accent-primary);
    opacity: 1;
    letter-spacing: 2px;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0 0 5px rgba(47, 129, 247, 0.3);
  }

  .close-folder-btn {
    background: none;
    border: none;
    font-size: 18px;
    color: var(--muted);
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s;
  }
  .close-folder-btn:hover {
    opacity: 1;
    color: var(--accent-danger);
  }

  .case-file-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .notebook-tabs {
    display: flex;
    padding: 0;
    gap: 0;
    border-bottom: 1px solid var(--border);
    background: rgba(0, 0, 0, 0.2);
  }

  .tab-btn {
    background: transparent;
    border: none;
    border-right: 1px solid var(--border);
    color: var(--muted);
    padding: 12px 24px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
    font-family: var(--font-ui);
    position: relative;
  }

  .tab-btn:hover {
    color: var(--ink);
    background: rgba(255, 255, 255, 0.02);
  }

  .tab-btn.active {
    color: var(--accent-primary);
    background: rgba(47, 129, 247, 0.05);
  }

  .tab-btn.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    box-shadow: 0 0 8px var(--accent-primary);
  }

  .notebook-body {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
    position: relative;
    z-index: 1;
    background: linear-gradient(rgba(13, 17, 23, 0.9), rgba(13, 17, 23, 0.9)),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 19px,
        rgba(47, 129, 247, 0.03) 20px
      );
  }

  .tab-pane {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
