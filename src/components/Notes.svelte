<script>
  import { notes } from '../stores.js';
  import { afterUpdate } from 'svelte';

  let listEl;

  afterUpdate(() => {
    if (listEl) listEl.scrollTop = listEl.scrollHeight;
  });
</script>

<aside class="card notes-panel">
  <div class="panel-head">
    <h2>Notas del Investigador</h2>
    <p class="panel-sub">Registro automático</p>
    <button class="help-btn">?</button>
    <div class="tooltip">Un registro automático de las pistas y eventos importantes que has descubierto.</div>
  </div>
  <div class="notes-list" bind:this={listEl} style="max-height: 300px; overflow-y: auto;">
    {#if $notes.length === 0}
      <p class="faint">Sin notas aún.</p>
    {:else}
      {#each $notes as note}
        <div class="note-item">{note}</div>
      {/each}
    {/if}
  </div>
</aside>
