<script>
  import { currentCase } from '../stores.js';
  import { restartGame, openCaseSelector } from '../engine.js';
</script>

<header>
  <h1>Misterio del Inventario de Conceptos</h1>
  <div class="ornament"></div>
  
  <div class="controls" id="controls">
    <div class="control-actions">
      <span class="active-case" id="active-case">
        <span class="case-dot"></span> 
        {$currentCase ? $currentCase.title : 'Ningún caso seleccionado'}
      </span>
      
      {#if $currentCase}
        <button class="restart-btn" on:click={openCaseSelector}>Cambiar de caso</button>
        <button class="restart-btn" on:click={restartGame}>Reiniciar investigación</button>
      {/if}
    </div>
  </div>
</header>
