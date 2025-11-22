<script>
  import { locations } from "../stores.js";

  $: discoveredLocations = Object.values($locations).filter(
    (loc) => loc.discovered,
  );
</script>

<div class="locations-container">
  <div class="section-title">
    <h2>UBICACIONES</h2>
    <span class="subtitle">MAPA DE SITUACIÓN</span>
  </div>

  <div class="locations-grid">
    {#if discoveredLocations.length === 0}
      <div class="empty-state">Aún no has visitado ninguna ubicación.</div>
    {:else}
      {#each discoveredLocations as loc}
        <div class="location-card">
          <div class="location-photo-placeholder">
            <span class="location-icon">📍</span>
          </div>
          <div class="location-info">
            <p class="location-name">{loc.name}</p>
            {#if loc.description}
              <p class="location-desc">{loc.description}</p>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .section-title {
    border-bottom: 2px solid var(--ink-dark);
    margin-bottom: 20px;
    padding-bottom: 5px;
  }

  .section-title h2 {
    font-family: var(--typewriter-font);
    font-size: 24px;
    margin: 0;
    color: var(--ink-dark);
    letter-spacing: -1px;
  }

  .subtitle {
    font-family: var(--font-ui);
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--ink-dark);
    opacity: 0.6;
    text-transform: uppercase;
  }

  .locations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .location-card {
    background: #fff;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.2s;
  }

  .location-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    z-index: 2;
  }

  .location-photo-placeholder {
    height: 120px;
    background: #f5f5f5;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .location-icon {
    font-size: 32px;
    opacity: 0.5;
  }

  .location-name {
    font-family: var(--typewriter-font);
    font-weight: bold;
    font-size: 14px;
    color: var(--ink-dark);
    margin: 0 0 5px 0;
    text-transform: uppercase;
  }

  .location-desc {
    font-size: 11px;
    color: #666;
    line-height: 1.4;
    margin: 0;
    font-family: var(--font-ui);
  }

  .empty-state {
    font-family: var(--typewriter-font);
    color: var(--ink-dark);
    opacity: 0.5;
    font-style: italic;
    grid-column: 1 / -1;
  }
</style>
