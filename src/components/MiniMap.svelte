<script>
  import { currentCase, currentMapLocation, locations as locationsStore } from '../stores.js';
  import { playChoiceClick } from '../sfx.js';

  const normalizeId = (value) =>
    (value || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  $: mapData = $currentCase && $currentCase.mapData ? $currentCase.mapData : [];
  $: mapConfig = $currentCase && $currentCase.mapConfig ? $currentCase.mapConfig : { type: 'grid' };
  $: activeNode = mapData.find((node) => node.id === $currentMapLocation);
  $: hubNode = mapData.find((node) => node.id === (mapConfig.hubId || "hall")) || mapData[0];
  $: hubX = hubNode?.textX ?? 200;
  $: hubY = hubNode?.textY ?? 200;
  $: visitedSet = new Set(
    Object.values($locationsStore || {})
      .filter((loc) => loc.visited)
      .map((loc) => normalizeId(loc.mapId || loc.name))
  );

  const isVisited = (node) => visitedSet.has(normalizeId(node.id || node.label));

  function handleNodeClick(node) {
    playChoiceClick();
    // Future: Implement fast travel if game design allows
    // For now, just visual feedback
  }
</script>

<aside class="mini-map-container" class:hidden={!mapData.length}>
  <div class="mini-map-header">
    <div class="mini-map-title-block">
      <span class="mini-map-kicker">Plano del museo</span>
      <div class="mini-map-current">
        <span class="current-dot" aria-hidden="true"></span>
        {activeNode ? activeNode.label : 'Sin ubicacion'}
      </div>
    </div>
    <div class="mini-map-chip">Nivel principal</div>
  </div>

  {#if mapConfig.type === 'svg'}
    <div class="mini-map-svg-wrapper">
      <svg viewBox={mapConfig.viewBox} class="mini-map-svg">
        <defs>
          <radialGradient id="roomFill" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stop-color="rgba(47,129,247,0.35)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.05)" />
          </radialGradient>
          <linearGradient id="roomStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.3)" />
            <stop offset="100%" stop-color="rgba(47,129,247,0.45)" />
          </linearGradient>
        </defs>

        <g class="map-radials">
          <circle cx={hubX} cy={hubY} r="55" />
          <circle cx={hubX} cy={hubY} r="95" />
          <circle cx={hubX} cy={hubY} r="135" />
        </g>

        {#if hubNode}
          {#each mapData as node (node.id)}
            {#if node.id !== hubNode.id}
              <line
                class="map-connector"
                x1={hubX}
                y1={hubY}
                x2={node.textX}
                y2={node.textY}
              />
            {/if}
          {/each}
        {/if}

        {#each mapData as node}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <g
            class="map-node-group"
            class:active={node.id === $currentMapLocation}
            class:visited={isVisited(node)}
            on:click={() => handleNodeClick(node)}
            role="button"
            tabindex="0"
          >
            <path d={node.path} class="map-shape" />
            <text x={node.textX} y={node.textY} class="map-label" text-anchor="middle" dominant-baseline="middle">
              {node.label}
            </text>
          </g>
        {/each}
      </svg>
      <div class="map-compass">N</div>
    </div>
  {:else}
    <div class="mini-map-grid">
      {#each mapData as node}
        <div
          class="map-node"
          class:active={node.id === $currentMapLocation}
          class:visited={isVisited(node)}
          style="grid-row-start: {node.row || 'auto'}; grid-column-start: {node.col || 'auto'}; grid-row-end: {node.rowSpan ? `span ${node.rowSpan}` : 'auto'}; grid-column-end: {node.colSpan ? `span ${node.colSpan}` : 'auto'};"
        >
          {node.label}
        </div>
      {/each}
    </div>
  {/if}

  <div class="mini-map-legend">
    <span><span class="legend-dot active"></span>Tu posicion</span>
    <span><span class="legend-dot visited"></span>Visitado</span>
    <span><span class="legend-dot idle"></span>Sin visitar</span>
  </div>
</aside>

<style>
  .mini-map-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    position: relative;
    background: radial-gradient(circle at 20% 20%, rgba(47, 129, 247, 0.08), transparent 40%),
      radial-gradient(circle at 80% 10%, rgba(210, 168, 255, 0.05), transparent 38%),
      rgba(7, 10, 15, 0.92);
    backdrop-filter: blur(8px) saturate(135%);
    border-radius: 12px;
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
    transition: all 0.3s ease;
    isolation: isolate;
  }

  .mini-map-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(0deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.65;
    pointer-events: none;
    mix-blend-mode: screen;
  }
  
  .mini-map-container:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.65);
  }

  .mini-map-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    z-index: 1;
  }

  .mini-map-title-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mini-map-kicker {
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--muted);
    text-transform: uppercase;
    opacity: 0.9;
  }

  .mini-map-current {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 12px;
  }

  .current-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-primary);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  .mini-map-chip {
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.04);
  }

  .mini-map-svg-wrapper {
    position: relative;
    width: 100%;
    flex: 1;
    min-height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.45);
  }
  
  .mini-map-svg {
    width: 100%;
    height: 100%;
    max-width: 100%;
    overflow: visible;
    filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.35));
  }

  .map-compass {
    position: absolute;
    top: 6px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--muted);
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(6px);
    letter-spacing: 1px;
  }

  .map-radials circle {
    fill: none;
    stroke: rgba(255, 255, 255, 0.08);
    stroke-dasharray: 6 10;
    pointer-events: none;
  }

  .map-connector {
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1.2;
    stroke-dasharray: 6 8;
    stroke-linecap: round;
    transition: stroke 0.3s ease, opacity 0.3s ease;
    pointer-events: none;
  }

  .mini-map-container:hover .map-connector {
    stroke: rgba(47, 129, 247, 0.32);
  }

  .map-node-group {
    cursor: pointer;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .map-shape {
    fill: url(#roomFill);
    stroke: url(#roomStroke);
    stroke-width: 1.4;
    opacity: 0.9;
    stroke-linejoin: round;
    transition: all 0.3s ease;
  }

  .map-label {
    fill: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    font-family: var(--font-ui);
    pointer-events: none;
    transition: all 0.3s ease;
    text-shadow: 0 1px 4px rgba(0,0,0,0.9);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Hover state */
  .map-node-group:hover .map-shape {
    fill: rgba(47, 129, 247, 0.18);
    stroke: var(--accent-primary);
    transform: translateY(-2px);
  }
  
  .map-node-group:hover .map-label {
    fill: #fff;
  }

  .map-node-group.visited .map-shape {
    fill: rgba(47, 129, 247, 0.12);
    stroke: rgba(47, 129, 247, 0.45);
  }

  .map-node-group.visited .map-label {
    fill: rgba(255, 255, 255, 0.9);
  }

  /* Active state */
  .map-node-group.active .map-shape {
    fill: rgba(47, 129, 247, 0.2);
    stroke: var(--accent-primary);
    stroke-width: 2;
    filter: drop-shadow(0 0 8px var(--accent-glow));
    opacity: 1;
  }

  .map-node-group.active .map-label {
    fill: #fff;
    font-weight: 700;
    font-size: 13px;
  }

  .mini-map-legend {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--muted);
    z-index: 1;
  }

  .legend-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;
    border: 1px solid var(--border);
    vertical-align: middle;
  }

  .legend-dot.active {
    background: var(--accent-primary);
    box-shadow: 0 0 8px var(--accent-glow);
  }

  .legend-dot.visited {
    background: rgba(47, 129, 247, 0.25);
    border-color: rgba(47, 129, 247, 0.6);
  }

  .legend-dot.idle {
    background: rgba(255, 255, 255, 0.08);
  }
  
  .hidden {
    display: none;
  }
</style>
