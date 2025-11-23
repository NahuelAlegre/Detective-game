<script>
  import { currentCase, gameMode } from './stores.js';
  import Header from './components/Header.svelte';
  import CaseSelector from './components/CaseSelector.svelte';
  import GameUI from './components/GameUI.svelte';
  import Overworld from './overworld/Overworld.svelte';
</script>

<div class="page">
  <div class="grain"></div>
  <Header />
  
  {#if !$currentCase}
    <CaseSelector />
  {:else if $gameMode === "overworld"}
    <Overworld />
  {:else}
    <GameUI />
  {/if}
</div>
