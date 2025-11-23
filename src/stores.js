import { writable, derived } from 'svelte/store';

export const gameMode = writable("story"); // "story" | "overworld"
export const currentCase = writable(null);
export const currentSceneId = writable("");
export const conceptInventory = writable([]);
export const suspects = writable([]);
export const locations = writable({});
export const notes = writable([]);
export const time = writable(540); // Start at 9:00 AM (in minutes)
export const pendingProgressScenes = writable(new Map());
export const lastCombinationMessage = writable("");
export const currentMapLocation = writable(null);
export const interactionMode = writable(null); // null or itemName

export const overworldState = writable({
    caseId: null,
    mapId: null,
    spawn: "default",
    playerPosition: null,
    npcPositions: {},
    disabledInteractions: [],
    mode: "move", // "move" | "locked"
    dialogue: null, // { sceneId, context }
});

export const uiState = writable({
    activeView: null, // 'caseFile', 'inventory', 'history', or null
    activeTab: 'investigation' // 'investigation', 'notes', 'locations'
});

export const currentScene = derived(
    [currentCase, currentSceneId],
    ([$currentCase, $currentSceneId]) => {
        if (!$currentCase || !$currentSceneId) return null;
        return $currentCase.scenes[$currentSceneId];
    }
);
