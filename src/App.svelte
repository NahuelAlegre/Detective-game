<script>
  import { currentCase } from './stores.js';
  import Header from './components/Header.svelte';
  import CaseSelector from './components/CaseSelector.svelte';
  import GameUI from './components/GameUI.svelte';
</script>

<div class="page">
  <div class="grain"></div>
  <Header />
  
  {#if !$currentCase}
    <CaseSelector />
  {:else}
    <GameUI />
  {/if}
</div>
