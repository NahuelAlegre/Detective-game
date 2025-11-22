<script>
  import { currentCase, conceptInventory } from '../stores.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  $: combos = ($currentCase && $currentCase.combinations) || [];
  $: deducedCombos = combos.filter(combo => hasConcept(combo.result));

  function hasConcept(name) {
    return $conceptInventory.some(c => c.name === name);
  }

  function close() {
    dispatch('close');
  }
</script>

<div class="modal-overlay" on:click={close}>
  <div class="modal-content" on:click|stopPropagation>
    <div class="modal-header">
      <h2>Deducciones realizadas</h2>
      <button class="close-btn" on:click={close}>&times;</button>
    </div>
    <div class="deductions-list">
      {#each deducedCombos as combo}
        {@const isDeduced = hasConcept(combo.result)}
        
        <div class="deduction-card">
          <div class="deduction-reqs">
            {#each (combo.requires || []) as req}
                <span class="combo-pill {hasConcept(req) ? 'owned' : 'missing'}">{req}</span>
            {/each}
          </div>
          
          {#if combo.description}
            <p class="deduction-desc">{combo.description}</p>
          {/if}

          {#if isDeduced}
             <p class="deduction-result success">Resultado: {combo.result}</p>
          {/if}

        </div>
      {/each}
      {#if deducedCombos.length === 0}
        <p style="color: #888; text-align: center;">Aún no has completado deducciones.</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: #0a0a0a;
    border: 1px solid #333;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
  }
  .modal-header h2 {
    margin: 0;
    color: #3498db;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .close-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .close-btn:hover {
    color: #fff;
  }
  .deduction-card {
    background: #111;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 15px;
  }
  .deduction-reqs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }
  .combo-pill {
    background: #2c3e50;
    color: #bdc3c7;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    border: 1px solid #34495e;
  }
  .combo-pill.owned {
    background: #1e2b38;
    color: #aab7c4;
    border-color: #3498db;
  }
  .combo-pill.missing {
    opacity: 0.5;
    border-style: dashed;
  }
  .deduction-desc {
    color: #ccc;
    font-size: 0.95rem;
    margin-bottom: 10px;
    line-height: 1.4;
  }
  .deduction-result {
    margin-top: 10px;
    font-weight: bold;
    padding-top: 10px;
    border-top: 1px solid #333;
  }
  .deduction-result.success {
    color: #2ecc71;
  }
  .deduce-btn {
    background: transparent;
    border: 1px solid #3498db;
    color: #3498db;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
    margin-top: 10px;
    width: 100%;
    text-align: center;
  }
  .deduce-btn:hover {
    background: rgba(52, 152, 219, 0.1);
  }
  .deduce-btn.disabled {
    border-color: #444;
    color: #666;
    cursor: not-allowed;
  }
  .deduce-btn.disabled:hover {
    background: transparent;
  }
</style>
