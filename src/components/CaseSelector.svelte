<script>
  import { cases } from "../data/cases.js";
  import { startGame } from "../engine.js";
</script>

<section id="case-selector" class="case-selector-page">
  <div class="grain"></div>

  <header class="selector-header">
    <div class="header-content">
      <h1><span class="icon">❖</span> Base de Datos de Casos</h1>
      <div class="user-badge">
        <span class="status-dot"></span>
        DETECTIVE_ACCESS_GRANTED
      </div>
    </div>
    <p class="header-subtitle">
      Seleccione un expediente para iniciar la simulación.
    </p>
  </header>

  <div class="cases-container">
    {#each Object.values(cases) as caseData}
      <div
        class="case-file-card"
        role="button"
        tabindex="0"
        on:click={() => startGame(caseData.id)}
        on:keydown={(e) =>
          (e.key === "Enter" || e.key === " ") && startGame(caseData.id)}
      >
        <div class="card-header">
          <span class="case-id">CASE_ID: {caseData.id.toUpperCase()}</span>
          <span
            class="case-status {caseData.id === 'tutorial'
              ? 'status-training'
              : 'status-active'}"
          >
            {caseData.id === "tutorial" ? "ENTRENAMIENTO" : "ACTIVO"}
          </span>
        </div>

        <div class="card-body">
          <h2 class="case-title">{caseData.title}</h2>
          <div class="separator"></div>
          <p class="case-synopsis">{caseData.synopsis}</p>
        </div>

        <div class="card-footer">
          <div class="meta-info">
            <span class="meta-item">
              <span class="label">DIFICULTAD:</span>
              <span class="value"
                >{caseData.id === "tutorial" ? "BAJA" : "MEDIA"}</span
              >
            </span>
            <span class="meta-item">
              <span class="label">TIEMPO:</span>
              <span class="value">~30 MIN</span>
            </span>
          </div>
          <button class="action-btn" tabindex="-1">ABRIR EXPEDIENTE</button>
        </div>
      </div>
    {/each}

    <!-- Placeholder for future cases -->
    <div class="case-file-card locked">
      <div class="card-header">
        <span class="case-id">CASE_ID: ???</span>
        <span class="case-status status-locked">BLOQUEADO</span>
      </div>
      <div class="card-body">
        <h2 class="case-title">Expediente Clasificado</h2>
        <div class="separator"></div>
        <p class="case-synopsis">
          Datos encriptados. Nivel de autorización insuficiente.
        </p>
      </div>
      <div class="card-footer">
        <span class="lock-icon">🔒</span>
      </div>
    </div>
  </div>
</section>

<style>
  .case-selector-page {
    width: 100%;
    height: 100vh;
    background-color: var(--bg-deep);
    display: flex;
    flex-direction: column;
    padding: 40px;
    position: relative;
    overflow: hidden;
    color: var(--ink);
  }

  .grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .selector-header {
    z-index: 1;
    margin-bottom: 60px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 20px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  h1 {
    font-family: var(--font-mono);
    font-size: 24px;
    color: var(--accent-primary);
    margin: 0;
    letter-spacing: 2px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 12px;
    text-shadow: 0 0 10px rgba(47, 129, 247, 0.3);
  }

  .icon {
    font-size: 1.2em;
  }

  .user-badge {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--accent-success);
    border: 1px solid var(--accent-success);
    padding: 4px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(63, 185, 80, 0.1);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    background: var(--accent-success);
    border-radius: 50%;
    box-shadow: 0 0 5px var(--accent-success);
    animation: pulse 2s infinite;
  }

  .header-subtitle {
    font-family: var(--font-ui);
    color: var(--muted);
    margin: 0;
    font-size: 14px;
  }

  .cases-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .case-file-card {
    background: rgba(22, 27, 34, 0.6);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .case-file-card:hover {
    border-color: var(--accent-primary);
    transform: translateY(-4px);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 0 1px var(--accent-primary);
    background: rgba(22, 27, 34, 0.9);
  }

  .case-file-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--accent-primary),
      transparent
    );
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .case-file-card:hover::before {
    transform: scaleX(1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .case-id {
    color: var(--muted);
    letter-spacing: 1px;
  }

  .case-status {
    padding: 2px 8px;
    border-radius: 2px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }

  .status-training {
    color: var(--accent-warning);
    background: rgba(210, 153, 34, 0.1);
    border: 1px solid rgba(210, 153, 34, 0.3);
  }

  .status-active {
    color: var(--accent-primary);
    background: rgba(47, 129, 247, 0.1);
    border: 1px solid rgba(47, 129, 247, 0.3);
  }

  .card-body {
    flex: 1;
  }

  .case-title {
    font-family: var(--font-heading);
    font-size: 20px;
    color: var(--ink);
    margin: 0 0 12px 0;
    line-height: 1.4;
  }

  .separator {
    height: 1px;
    background: var(--border);
    margin-bottom: 12px;
    width: 40px;
  }

  .case-synopsis {
    font-family: var(--font-ui);
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
    margin: 0;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
  }

  .meta-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .meta-item {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
  }

  .meta-item .label {
    color: rgba(139, 148, 158, 0.6);
    margin-right: 4px;
  }

  .action-btn {
    background: transparent;
    border: 1px solid var(--accent-primary);
    color: var(--accent-primary);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .case-file-card:hover .action-btn {
    background: var(--accent-primary);
    color: white;
    box-shadow: 0 0 15px rgba(47, 129, 247, 0.4);
  }

  /* Locked State */
  .case-file-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
    border-style: dashed;
  }

  .case-file-card.locked:hover {
    transform: none;
    box-shadow: none;
    border-color: var(--border);
    background: rgba(22, 27, 34, 0.6);
  }

  .status-locked {
    color: var(--accent-danger);
    background: rgba(248, 81, 73, 0.1);
    border: 1px solid rgba(248, 81, 73, 0.3);
  }

  .lock-icon {
    font-size: 24px;
    opacity: 0.5;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .case-selector-page {
      padding: 20px;
    }

    .cases-container {
      grid-template-columns: 1fr;
    }
  }
</style>
