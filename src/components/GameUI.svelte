<script>
  import MiniMap from './MiniMap.svelte';
  import Locations from './Locations.svelte';
  import Notes from './Notes.svelte';
  import Scene from './Scene.svelte';
  import DeductionTree from './DeductionTree.svelte';
  import Suspects from './Suspects.svelte';
  import Inventory from './Inventory.svelte';
  import DeductionsPopup from './DeductionsPopup.svelte';
  import { playModalOpen } from '../sfx.js';

  let showDeductions = false;
  let showCaseFile = false;
  let activeTab = 'investigation'; // Default tab

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
      {showCaseFile ? 'Cerrar Expediente' : 'Abrir Expediente'}
    </button>

    <!-- Case File Panel (Modal/Overlay) -->
    {#if showCaseFile}
      <div class="case-file-overlay">
        <div class="case-file-content">
          <div class="notebook-tabs">
            <button class="tab-btn" class:active={activeTab === 'investigation'} on:click={() => setTab('investigation')}>
              Investigación
            </button>
            <button class="tab-btn" class:active={activeTab === 'notes'} on:click={() => setTab('notes')}>
              Notas
            </button>
            <button class="tab-btn" class:active={activeTab === 'locations'} on:click={() => setTab('locations')}>
              Lugares
            </button>
          </div>

          <div class="notebook-body">
            {#if activeTab === 'investigation'}
              <div class="tab-pane">
                <Suspects />
                <DeductionTree />
                <button class="deductions-toggle-btn" on:click={openDeductions}>
                  Abrir Tablero de Deducciones
                </button>
              </div>
            {:else if activeTab === 'notes'}
              <div class="tab-pane">
                <Notes />
              </div>
            {:else if activeTab === 'locations'}
              <div class="tab-pane">
                <Locations />
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if showDeductions}
    <DeductionsPopup on:close={() => showDeductions = false} />
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
    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }
  .case-file-toggle:hover {
    background: rgba(47, 129, 247, 0.1);
  }

  .case-file-overlay {
    position: absolute;
    inset: 40px;
    z-index: 30;
    background: rgba(13, 17, 23, 0.98);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 50px rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
  }

  .case-file-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .notebook-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    background: rgba(1, 4, 9, 0.4);
    border-radius: 8px 8px 0 0;
    padding: 0 20px;
  }

  .tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    padding: 16px 20px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
  }

  .tab-btn:hover {
    color: var(--ink);
    background: rgba(255,255,255,0.02);
  }

  .tab-btn.active {
    color: var(--accent-primary);
    border-bottom-color: var(--accent-primary);
  }

  .notebook-body {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
  }

  .tab-pane {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
