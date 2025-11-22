<script>
  import { suspects } from '../stores.js';

  function getSuspicionState(level) {
    // Default to 0 if undefined
    const l = level || 0;
    if (l <= 0) return { text: "Relajado", color: "#2ecc71" }; // Green
    if (l === 1) return { text: "Atento", color: "#27ae60" }; // Darker Green
    if (l === 2) return { text: "Receloso", color: "#f1c40f" }; // Yellow
    if (l === 3) return { text: "Tenso", color: "#e67e22" }; // Orange
    if (l === 4) return { text: "A la defensiva", color: "#e74c3c" }; // Red
    return { text: "Hostil", color: "#c0392b" }; // Dark Red
  }
</script>

<aside class="card suspects">
  <div class="panel-head">
    <h2>Sospechosos</h2>
    <button class="help-btn">?</button>
    <div class="tooltip">Lista de personas de interés basado en tus hallazgos.</div>
  </div>
  <ul class="suspect-list">
    {#if $suspects.length === 0}
      <li class="faint">Sin sospechosos todavía.</li>
    {:else}
      {#each $suspects as suspect}
        {@const state = getSuspicionState(suspect.suspicionLevel)}
        <li class="suspect-card">
          <div class="suspect-top">
            <p class="suspect-name">{suspect.name}</p>
            <span class="suspicion-badge" style="background-color: {state.color};">
              {state.text}
            </span>
          </div>
          <p class="suspect-desc">{suspect.description}</p>
          {#if suspect.associatedConcepts && suspect.associatedConcepts.length}
            <div class="suspect-concepts">
              {#each suspect.associatedConcepts as concept}
                <span class="combo-pill">{concept}</span>
              {/each}
            </div>
          {/if}
        </li>
      {/each}
    {/if}
  </ul>
</aside>

<style>
  .suspect-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  
  .suspicion-badge {
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
</style>
