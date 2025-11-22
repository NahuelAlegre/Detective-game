<script>
  import { conceptInventory } from '../stores.js';

  const types = ["sensorial", "deducido", "falso", "objeto"];
</script>

<aside class="card deduction-tree-panel">
  <div class="panel-head">
    <h2>Árbol de Deducción</h2>
    <p class="panel-sub">Mapa mental de conceptos</p>
    <button class="help-btn">?</button>
    <div class="tooltip">Visualiza cómo se conectan las pistas y conceptos que has encontrado.</div>
  </div>
  <div class="deduction-tree">
    {#each types as type}
      {#if $conceptInventory.some(c => c.type === type)}
        <div class="tree-level">
          <span class="tree-level-label">{type}</span>
          {#each $conceptInventory.filter(c => c.type === type) as c}
            <div 
              class="tree-node" 
              data-type={type} 
              title={c.parents && c.parents.length > 0 ? `Derivado de: ${c.parents.join(" + ")}` : ''}
            >
              {c.name}
            </div>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</aside>
