<script>
    import { suspects } from "../stores.js";

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

<div class="suspects-container">
    <div class="section-title">
        <h2>SOSPECHOSOS</h2>
        <span class="subtitle">PERSONAS DE INTERÉS</span>
    </div>

    <ul class="suspect-list">
        {#if $suspects.length === 0}
            <li class="empty-state">Sin sospechosos identificados.</li>
        {:else}
            {#each $suspects as suspect}
                {@const state = getSuspicionState(suspect.suspicionLevel)}
                <li class="suspect-card">
                    <div class="suspect-photo-placeholder">?</div>
                    <div class="suspect-info">
                        <div class="suspect-header">
                            <span class="suspect-name">{suspect.name}</span>
                            <span
                                class="suspicion-stamp"
                                style="color: {state.color}; border-color: {state.color}"
                            >
                                {state.text}
                            </span>
                        </div>
                        <p class="suspect-desc">{suspect.description}</p>
                        {#if suspect.associatedConcepts && suspect.associatedConcepts.length}
                            <div class="suspect-concepts">
                                {#each suspect.associatedConcepts as concept}
                                    <span class="concept-tag">{concept}</span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </li>
            {/each}
        {/if}
    </ul>
</div>

<style>
    .section-title {
        border-bottom: 2px solid var(--ink-dark);
        margin-bottom: 20px;
        padding-bottom: 5px;
    }

    .section-title h2 {
        font-family: var(--typewriter-font);
        font-size: 24px;
        margin: 0;
        color: var(--ink-dark);
        letter-spacing: -1px;
    }

    .subtitle {
        font-family: var(--font-ui);
        font-size: 10px;
        letter-spacing: 2px;
        color: var(--ink-dark);
        opacity: 0.85;
        text-transform: uppercase;
    }

    .suspect-list {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }

    .suspect-card {
        background: #fff;
        padding: 15px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 15px;
        transform: rotate(-1deg);
        transition: transform 0.2s;
        border: 1px solid #e0e0e0;
    }

    .suspect-card:nth-child(even) {
        transform: rotate(1deg);
    }

    .suspect-card:hover {
        transform: scale(1.02) rotate(0deg);
        z-index: 10;
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.15);
    }

    .suspect-photo-placeholder {
        width: 60px;
        height: 80px;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--typewriter-font);
        font-size: 24px;
        color: #ccc;
        border: 1px dashed #ccc;
        flex-shrink: 0;
    }

    .suspect-info {
        flex: 1;
    }

    .suspect-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
    }

    .suspect-name {
        font-family: var(--typewriter-font);
        font-weight: bold;
        font-size: 16px;
        color: var(--ink-dark);
    }

    .suspicion-stamp {
        font-size: 10px;
        padding: 2px 6px;
        border: 2px solid;
        border-radius: 4px;
        font-weight: bold;
        text-transform: uppercase;
        transform: rotate(-5deg);
        letter-spacing: 1px;
    }

    .suspect-desc {
        font-size: 12px;
        color: var(--ink-dark);
        line-height: 1.4;
        margin: 0 0 10px 0;
        font-family: var(--font-ui);
        font-weight: 600;
    }

    .suspect-concepts {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .concept-tag {
        background: #f0f0f0;
        padding: 2px 6px;
        font-size: 10px;
        border-radius: 2px;
        color: var(--ink-dark);
        font-family: var(--font-mono);
    }

    .empty-state {
        font-family: var(--typewriter-font);
        color: var(--ink-dark);
        opacity: 0.65;
        font-style: italic;
    }
</style>
