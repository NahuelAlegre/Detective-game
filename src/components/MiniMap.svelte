<script>
  import { currentCase, currentMapLocation } from '../stores.js';
  import { playChoiceClick } from '../sfx.js';
  
  $: mapData = $currentCase && $currentCase.mapData ? $currentCase.mapData : [];
  $: mapConfig = $currentCase && $currentCase.mapConfig ? $currentCase.mapConfig : { type: 'grid' };

  function handleNodeClick(node) {
    playChoiceClick();
    // Future: Implement fast travel if game design allows
    // For now, just visual feedback
  }
</script>

<aside class="mini-map-container" class:hidden={!mapData.length}>
  {#if mapConfig.type === 'svg'}
    <div class="mini-map-svg-wrapper">
      <svg viewBox={mapConfig.viewBox} class="mini-map-svg">
        <!-- Connections/Paths could go here if defined -->
        
        {#each mapData as node}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <g 
            class="map-node-group" 
            class:active={node.id === $currentMapLocation}
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
    </div>
  {:else}
    <div class="mini-map-grid">
      {#each mapData as node}
        <div 
          class="map-node" 
          class:active={node.id === $currentMapLocation}
          style="grid-row-start: {node.row || 'auto'}; grid-column-start: {node.col || 'auto'}; grid-row-end: {node.rowSpan ? `span ${node.rowSpan}` : 'auto'}; grid-column-end: {node.colSpan ? `span ${node.colSpan}` : 'auto'};"
        >
          {node.label}
        </div>
      {/each}
    </div>
  {/if}
</aside>

<style>
  .mini-map-container {
    width: 100%;
    height: 100%;
    background: rgba(13, 17, 23, 0.8);
    backdrop-filter: blur(4px);
    border-radius: 8px;
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    transition: all 0.3s ease;
  }
  
  .mini-map-container:hover {
    background: rgba(13, 17, 23, 0.95);
    border-color: var(--accent-primary);
  }

  .mini-map-svg-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .mini-map-svg {
    width: 100%;
    height: 100%;
    max-width: 100%;
  }

  .map-node-group {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .map-shape {
    fill: rgba(255, 255, 255, 0.05);
    stroke: var(--border);
    stroke-width: 1;
    transition: all 0.3s ease;
  }

  .map-label {
    fill: var(--muted);
    font-size: 12px;
    font-family: var(--font-ui);
    pointer-events: none;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Hover state */
  .map-node-group:hover .map-shape {
    fill: rgba(47, 129, 247, 0.1);
    stroke: var(--accent-primary);
  }
  
  .map-node-group:hover .map-label {
    fill: var(--accent-primary);
  }

  /* Active state */
  .map-node-group.active .map-shape {
    fill: rgba(47, 129, 247, 0.2);
    stroke: var(--accent-primary);
    stroke-width: 2;
    filter: drop-shadow(0 0 8px var(--accent-glow));
  }

  .map-node-group.active .map-label {
    fill: #fff;
    font-weight: 700;
    font-size: 13px;
  }
  
  .hidden {
    display: none;
  }
</style>
