import { get } from 'svelte/store';
import { 
    currentCase, currentSceneId, conceptInventory, suspects, locations, 
    notes, time, pendingProgressScenes, 
    lastCombinationMessage, currentMapLocation 
} from './stores.js';
import { cases } from './data/cases.js';
import { playCombineSuccess, playCombineFail } from './sfx.js';

function normalizeText(text = "") {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function startGame(caseId) {
    const selectedCase = cases[caseId];
    if (!selectedCase) return;

    currentCase.set(selectedCase);
    currentSceneId.set(selectedCase.startScene);
    conceptInventory.set([]);
    pendingProgressScenes.set(new Map());
    notes.set([]);
    time.set(selectedCase.startingTime || 540); // Default 9:00 AM
    lastCombinationMessage.set("");
    currentMapLocation.set(null);

    initSuspects(selectedCase.suspects || []);
    initLocations(selectedCase.locations || [], selectedCase);

    showScene(selectedCase.startScene);
}

export function restartGame() {
    const $currentCase = get(currentCase);
    if ($currentCase) {
        startGame($currentCase.id);
    }
}

export function openCaseSelector() {
    currentCase.set(null);
    currentSceneId.set("");
}

function initSuspects(data) {
    suspects.set([]);
}

function initLocations(data, caseData) {
    const newLocations = {};
    const list = Array.isArray(data) ? data : Object.values(data || {});
    const mapData = Array.isArray(caseData?.mapData) ? caseData.mapData : [];

    list.forEach((location) => {
        const total = location.totalProgress || location.total || 1;
        const current = location.currentProgress || 0;
        const match = mapData.find((node) => {
            const nodeLabel = normalizeText(node.label || "");
            const locName = normalizeText(location.name || "");
            return nodeLabel && (locName === nodeLabel || locName.includes(nodeLabel) || nodeLabel.includes(locName));
        });

        newLocations[location.name] = {
            name: location.name,
            description: location.description || "",
            totalProgress: total < 1 ? 1 : total,
            currentProgress: Math.min(current, total),
            completed: current >= total,
            discovered: false,
            mapId: location.mapId || match?.id || null,
        };
    });
    locations.set(newLocations);
}

export function addConcept(name, parents = []) {
    if (!name) return;
    conceptInventory.update(inv => {
        if (inv.some(c => c.name === name)) return inv;
        
        const $currentCase = get(currentCase);
        const definition = ($currentCase && $currentCase.concepts && $currentCase.concepts[name]) || {};
        const type = definition.type || "sensorial";
        const description = definition.description || "Concepto registrado.";
        const tags = definition.tags || [];
        const ponderText = definition.ponderText || "";
        
        return [...inv, { name, type, description, parents, tags, ponderText, archived: false }];
    });
}

export function ponderConcept(name) {
    const $conceptInventory = get(conceptInventory);
    const concept = $conceptInventory.find(c => c.name === name);
    if (concept && concept.ponderText) {
        lastCombinationMessage.set(`Pensamiento: "${concept.ponderText}"`);
    } else {
        lastCombinationMessage.set(`No se me ocurre nada nuevo sobre ${name}.`);
    }
}

export function updateTime(minutes) {
    time.update(t => t + minutes);
}

export function addNote(text) {
    notes.update(n => {
        if (n.includes(text)) return n;
        return [...n, text];
    });
}

export function updateSuspicions(name, amount) {
    suspects.update(list => {
        return list.map(s => {
            if (s.name === name) {
                // Solution 2: Irreversible Consequences. Suspicion can only increase.
                // We ignore negative amounts to prevent "fixing" suspicion.
                const change = Math.max(0, amount); 
                return { ...s, suspicionLevel: Math.max(0, Math.min(5, s.suspicionLevel + change)) };
            }
            return s;
        });
    });
}

export function revealSuspect(name) {
    const $suspects = get(suspects);
    if ($suspects.some(s => s.name === name)) return;

    const $currentCase = get(currentCase);
    if (!$currentCase || !$currentCase.suspects) return;

    const suspectDef = $currentCase.suspects.find(s => s.name === name);
    
    if (suspectDef) {
        suspects.update(list => [...list, {
            name: suspectDef.name,
            description: suspectDef.description || "",
            suspicionLevel: Math.max(0, Math.min(5, suspectDef.suspicionLevel || 0)),
            associatedConcepts: suspectDef.associatedConcepts ? [...suspectDef.associatedConcepts] : [],
        }]);
    }
}

export function addSuspectConcept(name, conceptName) {
    suspects.update(list => {
        return list.map(s => {
            if (s.name === name && !s.associatedConcepts.includes(conceptName)) {
                return { ...s, associatedConcepts: [...s.associatedConcepts, conceptName] };
            }
            return s;
        });
    });
}

function ensureLocation(name) {
    let locs = get(locations);
    if (!locs[name]) {
        locations.update(l => {
            const updated = { ...l };
            updated[name] = {
                name,
                description: "",
                totalProgress: 1,
                currentProgress: 0,
                completed: false,
                discovered: false,
                mapId: null,
            };
            return updated;
        });
        locs = get(locations);
    }
    return locs[name];
}

function discoverLocationByMapId(mapId) {
    if (!mapId) return;

    locations.update(locs => {
        const normalizedId = normalizeText(mapId);
        const matched = Object.entries(locs).find(([key, loc]) => {
            const candidate = loc.mapId ? normalizeText(loc.mapId) : normalizeText(key);
            return candidate === normalizedId;
        });
        if (matched) {
            const [key, loc] = matched;
            return { ...locs, [key]: { ...loc, discovered: true } };
        }

        const $currentCase = get(currentCase);
        const mapNode = $currentCase?.mapData?.find((node) => node.id === mapId);
        if (mapNode) {
            const key = mapNode.label || mapId;
            const existing = locs[key] || {
                name: key,
                description: mapNode.description || "",
                totalProgress: 1,
                currentProgress: 0,
                completed: false,
                mapId,
                discovered: false,
            };
            return { ...locs, [key]: { ...existing, mapId, discovered: true } };
        }

        return locs;
    });
}

export function applyLocationProgress(progressData) {
    if (!progressData || !progressData.location) return null;
    
    let result = null;
    locations.update(locs => {
        const base = locs[progressData.location] || {};
        const loc = { 
            name: progressData.location,
            description: "",
            totalProgress: 1,
            currentProgress: 0,
            completed: false,
            discovered: base.discovered || false,
            mapId: base.mapId || null,
            ...base,
        };
        if (!loc) {
             // Should have been ensured, but just in case
             return locs; 
        }
        
        const gain = progressData.progressGain || 0;
        const wasCompleted = loc.completed;
        loc.currentProgress = Math.min(loc.totalProgress, loc.currentProgress + gain);
        if (loc.currentProgress >= loc.totalProgress) {
            loc.completed = true;
        }
        loc.discovered = true;
        
        const justCompleted = !wasCompleted && loc.completed;
        if (justCompleted && progressData.onComplete) {
            result = {
                scene: progressData.onComplete,
                text: progressData.onCompleteText || `Nuevo evento en ${loc.name}`,
            };
        }
        
        return { ...locs, [progressData.location]: loc };
    });
    
    return result;
}

function applySceneEffects(scene) {
    if (scene.reward) {
        [].concat(scene.reward).forEach(r => addConcept(r));
    }

    if (scene.meetSuspects) {
        [].concat(scene.meetSuspects).forEach(name => revealSuspect(name));
    }

    if (scene.notes) {
        [].concat(scene.notes).forEach(addNote);
    }

    if (scene.locationProgress) {
        const unlock = applyLocationProgress(scene.locationProgress);
        if (unlock) {
            pendingProgressScenes.update(map => map.set(unlock.scene, unlock.text));
        }
    }

    if (scene.suspectAdjustments) {
        scene.suspectAdjustments.forEach((adj) => updateSuspicions(adj.name, adj.change || 0));
    }

    if (scene.suspectConcepts) {
        scene.suspectConcepts.forEach((pair) => addSuspectConcept(pair.name, pair.concept));
    }
    
    if (scene.location) {
        currentMapLocation.set(scene.location);
        discoverLocationByMapId(scene.location);
    }
}

function checkEndings(scene) {
    const $currentCase = get(currentCase);
    if (!$currentCase.endings) return null;
    
    const $conceptInventory = get(conceptInventory);
    const $suspects = get(suspects);

    const hasConcept = (name) => $conceptInventory.some(c => c.name === name);

    for (const ending of $currentCase.endings) {
        const conditions = ending.conditions || {};
        let met = true;
        
        if (conditions.concepts) {
            if (!conditions.concepts.every(hasConcept)) met = false;
        }

        if (conditions.suspicion) {
            const s = $suspects.find(sus => sus.name === conditions.suspicion.name);
            if (!s) met = false;
            else {
                if (conditions.suspicion.min !== undefined && s.suspicionLevel < conditions.suspicion.min) met = false;
                if (conditions.suspicion.max !== undefined && s.suspicionLevel > conditions.suspicion.max) met = false;
            }
        }

        if (met) {
            return ending.scene;
        }
    }
    return null;
}

export function showScene(sceneId) {
    const $currentCase = get(currentCase);
    if (!$currentCase) return;
    const scene = $currentCase.scenes[sceneId];
    if (!scene) return;

    currentSceneId.set(sceneId);
    
    pendingProgressScenes.update(map => {
        if (map.has(sceneId)) {
            const newMap = new Map(map);
            newMap.delete(sceneId);
            return newMap;
        }
        return map;
    });

    applySceneEffects(scene);
    
    const endingSceneId = checkEndings(scene);
    if (endingSceneId && endingSceneId !== sceneId) {
        setTimeout(() => showScene(endingSceneId), 100);
    }
}

export function combineConcepts(conceptA, conceptB) {
    const $currentCase = get(currentCase);
    const $conceptInventory = get(conceptInventory);
    
    const combos = ($currentCase && $currentCase.combinations) || [];
    const match = combos.find((combo) => {
        const reqs = combo.requires || combo.inputs || [];
        return reqs.length === 2 && reqs.every((req) => req === conceptA || req === conceptB);
    });

    if (match && match.result) {
        addConcept(match.result, match.requires);
        if (match.associateSuspect) {
            addSuspectConcept(match.associateSuspect, match.result);
        }
        
        // Archive used concepts
        conceptInventory.update(inv => inv.map(c => {
            if (match.requires.includes(c.name)) {
                return { ...c, archived: true };
            }
            return c;
        }));

        lastCombinationMessage.set(`Deducción creada: ${match.result}`);
        playCombineSuccess();
        return true;
    } else {
        // Contextual Feedback
        const cA = $conceptInventory.find(c => c.name === conceptA);
        const cB = $conceptInventory.find(c => c.name === conceptB);
        
        if (cA && cB) {
            const sharedTags = cA.tags.filter(tag => cB.tags.includes(tag));
            if (sharedTags.length > 0) {
                lastCombinationMessage.set(`Ambos están relacionados con "${sharedTags[0]}", pero falta una conexión directa.`);
            } else {
                lastCombinationMessage.set("No veo ninguna relación entre estos dos conceptos.");
            }
        } else {
            lastCombinationMessage.set("La combinación no encaja.");
        }
        playCombineFail();
        return false;
    }
}
