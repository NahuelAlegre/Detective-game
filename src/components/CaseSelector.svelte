<script>
  import { cases } from '../data/cases.js';
  import { startGame } from '../engine.js';
</script>

<section id="case-selector" class="case-selector card">
  <div class="case-selector-header">
    <span class="case-tag">Selector de casos</span>
    <button class="help-btn">?</button>
    <div class="tooltip">Aquí puedes elegir qué misterio quieres investigar. Comienza con el tutorial si es tu primera vez.</div>
    <p class="case-lede">Elige qué expediente abrir antes de entrar en escena.</p>
    <p class="case-help">Puedes probar el Caso Tutorial para aprender el inventario de conceptos o saltar directo al Caso principal.</p>
  </div>
  <div id="case-grid" class="case-grid">
    {#each Object.values(cases) as caseData}
      <div class="case-card">
        <span class="case-tag">{caseData.id === "tutorial" ? "Caso de práctica" : "Caso principal"}</span>
        <h3 class="case-title">{caseData.title}</h3>
        <p class="case-synopsis">{caseData.synopsis}</p>
        <button class="play-btn" on:click={() => startGame(caseData.id)}>Jugar</button>
      </div>
    {/each}
  </div>
</section>
