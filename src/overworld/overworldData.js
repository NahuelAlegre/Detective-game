import { tutorialMaps } from "./maps/tutorial.js";
import { tutorialInteractables } from "./interactables_tutorial.js";

export const overworldCases = {
  tutorial: {
    start: { mapId: "tutorial-lobby", spawn: "default" },
    maps: tutorialMaps,
    interactables: tutorialInteractables,
  },
};

export function getCaseOverworld(caseId) {
  return overworldCases[caseId] || null;
}

export function getMapById(caseId, mapId) {
  const config = getCaseOverworld(caseId);
  if (!config) return null;
  return config.maps.find((m) => m.id === mapId) || null;
}

export function getInteractablesForMap(caseId, mapId, state = {}) {
  const config = getCaseOverworld(caseId);
  if (!config) return [];
  const disabled = new Set(state.disabledInteractions || []);
  const overrides = state.npcPositions || {};

  return config.interactables
    .filter((i) => i.mapId === mapId && !disabled.has(i.id))
    .map((i) => {
      const override = overrides[i.id];
      return override ? { ...i, ...override } : i;
    });
}

export function resolveSpawn(map, spawnName) {
  if (!map) return { x: 0, y: 0 };
  const spawn = map.spawnPoints?.[spawnName] || map.spawnPoints?.default;
  return spawn || { x: 1, y: 1 };
}
