import { writable, derived } from 'svelte/store';

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

export const currentScene = derived(
    [currentCase, currentSceneId],
    ([$currentCase, $currentSceneId]) => {
        if (!$currentCase || !$currentSceneId) return null;
        return $currentCase.scenes[$currentSceneId];
    }
);
