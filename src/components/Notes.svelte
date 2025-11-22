<script>
  import { notes } from "../stores.js";
  import { afterUpdate } from "svelte";

  let listEl;

  afterUpdate(() => {
    if (listEl) listEl.scrollTop = listEl.scrollHeight;
  });
</script>

<div class="notes-page">
  <div class="notebook-header">
    <h2>NOTAS DEL INVESTIGADOR</h2>
    <span class="date-stamp">REGISTRO #001</span>
  </div>

  <div class="notes-lines" bind:this={listEl}>
    {#if $notes.length === 0}
      <p class="empty-note">Sin notas registradas.</p>
    {:else}
      {#each $notes as note}
        <div class="note-item">
          <span class="bullet">•</span>
          <span class="text">{note}</span>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .notes-page {
    position: relative;
    padding: 10px;
  }

  .notebook-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #d64545; /* Red margin line */
    margin-bottom: 20px;
    padding-bottom: 5px;
  }

  .notebook-header h2 {
    font-family: var(--typewriter-font);
    font-size: 20px;
    color: var(--ink-dark);
    margin: 0;
    letter-spacing: 1px;
  }

  .date-stamp {
    font-family: var(--typewriter-font);
    font-size: 12px;
    color: #d64545;
    font-weight: bold;
  }

  .notes-lines {
    font-family: "Courier New", Courier, monospace; /* Fallback if typewriter font fails */
    font-family: var(--typewriter-font);
    color: #2c3e50;
    line-height: 1.5; /* Match the background lines if possible */
    max-height: 400px;
    overflow-y: auto;
  }

  .note-item {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    position: relative;
  }

  .bullet {
    color: #d64545;
    font-weight: bold;
  }

  .text {
    font-size: 16px;
  }

  .empty-note {
    font-style: italic;
    opacity: 0.5;
    font-family: var(--typewriter-font);
  }
</style>
