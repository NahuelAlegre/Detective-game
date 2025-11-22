<script>
  import { locations } from '../stores.js';

  $: discoveredLocations = Object.values($locations).filter(loc => loc.discovered);
</script>

<aside class="card locations">
  <div class="panel-head">
    <h2>Ubicaciones</h2>
    <p class="panel-sub">Lugares conocidos</p>
    <button class="help-btn">?</button>
    <div class="tooltip">Lista de lugares disponibles para visitar.</div>
  </div>
  <ul class="location-list">
    {#if discoveredLocations.length === 0}
      <li class="faint">Aún no has visitado ninguna ubicación.</li>
    {:else}
      {#each discoveredLocations as loc}
        <li class="location-card">
          <div class="location-meta">
            <p class="location-name">{loc.name}</p>
          </div>
          {#if loc.description}
            <p class="location-desc">{loc.description}</p>
          {/if}
        </li>
      {/each}
    {/if}
  </ul>
</aside>
