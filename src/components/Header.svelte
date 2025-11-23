<script>
  import { currentCase, uiState, gameMode } from "../stores.js";
  import { restartGame, openCaseSelector, enterOverworld, exitOverworld } from "../engine.js";
  import { playModalOpen } from "../sfx.js";

  function toggleView(view) {
    playModalOpen();
    uiState.update((state) => ({
      ...state,
      activeView: state.activeView === view ? null : view,
    }));
  }

  function toggleOverworld() {
    if (!$currentCase) return;
    if ($gameMode === "overworld") {
      exitOverworld();
    } else {
      enterOverworld({});
    }
  }
</script>

<header>
  <div class="brand">
    <h1>Misterio del Inventario de Conceptos</h1>
  </div>

  <nav class="top-nav">
    <button
      class="nav-btn"
      class:active={$uiState.activeView === "caseFile"}
      on:click={() => toggleView("caseFile")}
      title="Expediente"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        ></path><polyline points="14 2 14 8 20 8"></polyline><line
          x1="16"
          y1="13"
          x2="8"
          y2="13"
        ></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline
          points="10 9 9 9 8 9"
        ></polyline></svg
      >
    </button>
    <button
      class="nav-btn"
      class:active={$uiState.activeView === "inventory"}
      on:click={() => toggleView("inventory")}
      title="Inventario"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        ></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"
        ></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg
      >
    </button>
    <button
      class="nav-btn"
      class:active={$uiState.activeView === "history"}
      on:click={() => toggleView("history")}
      title="Historial"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><circle cx="12" cy="12" r="10"></circle><polyline
          points="12 6 12 12 16 14"
        ></polyline></svg
      >
    </button>
    <button
      class="nav-btn"
      class:active={$gameMode === "overworld"}
      on:click={toggleOverworld}
      title="Overworld"
      disabled={!$currentCase}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><circle cx="12" cy="12" r="10"></circle><path
          d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"
        ></path></svg
      >
    </button>
  </nav>

  <div class="controls" id="controls">
    <div class="control-actions">
      <span class="active-case" id="active-case">
        <span class="case-dot"></span>
        {$currentCase ? $currentCase.title : "Ningún caso seleccionado"}
      </span>

      {#if $currentCase}
        <button class="restart-btn" on:click={openCaseSelector}
          >Cambiar de caso</button
        >
        <button class="restart-btn" on:click={restartGame}
          >Reiniciar investigación</button
        >
      {/if}
    </div>
  </div>
</header>

<style>
  header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 60px;
    background: rgba(5, 7, 10, 0.95);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(10px);
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .brand h1 {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--ink);
    text-shadow: 0 0 10px rgba(47, 129, 247, 0.3);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand h1::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    background: var(--accent-primary);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--accent-primary);
  }

  .top-nav {
    display: flex;
    gap: 16px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-btn {
    background: transparent;
    border: none;
    color: var(--muted);
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .nav-btn:hover {
    color: var(--ink);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 15px rgba(47, 129, 247, 0.2);
  }

  .nav-btn.active {
    color: var(--accent-primary);
    background: rgba(47, 129, 247, 0.1);
    box-shadow: 0 0 15px rgba(47, 129, 247, 0.3);
  }

  .nav-btn.active::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    box-shadow: 0 0 8px var(--accent-primary);
  }

  .controls {
    display: flex;
    align-items: center;
  }

  .control-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .active-case {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.03);
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid var(--border);
  }

  .case-dot {
    width: 6px;
    height: 6px;
    background: var(--accent-success);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--accent-success);
  }

  .restart-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 4px 12px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 2px;
  }

  .restart-btn:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    box-shadow: 0 0 10px rgba(47, 129, 247, 0.2);
  }
</style>
