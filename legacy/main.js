(function () {
      const caseLibrary = window.caseLibrary || {};
      const sceneTextEl = document.getElementById("scene-text");
      const choicesEl = document.getElementById("choices");
      const inventoryListEl = document.getElementById("inventory-list");
      const suspectListEl = document.getElementById("suspect-list");
      const locationListEl = document.getElementById("location-list");
      const puzzleContainerEl = document.getElementById("puzzle-container");
      const puzzleDescriptionEl = document.getElementById("puzzle-description");
      const puzzleButtonEl = document.getElementById("puzzle-button");
      const combinationContainerEl = document.getElementById("combination-container");
      const combinationListEl = document.getElementById("combination-list");
      const combinationFeedbackEl = document.getElementById("combination-feedback");
      const deductionTreeEl = document.getElementById("deduction-tree");
      const notesListEl = document.getElementById("notes-list");
      const moneyPanelEl = document.getElementById("money-panel");
      const moneyAmountEl = document.getElementById("money-amount");
      const miniMapGridEl = document.getElementById("mini-map-grid");
      const miniMapPanelEl = document.getElementById("mini-map-panel");
      const caseSelectorEl = document.getElementById("case-selector");
      const caseGridEl = document.getElementById("case-grid");
      const gameUIEl = document.getElementById("game-ui");
      const controlsEl = document.getElementById("controls");
      const activeCaseEl = document.getElementById("active-case");
      const restartBtn = document.getElementById("restart-btn");
      const caseMenuBtn = document.getElementById("case-menu-btn");

      const conceptInventory = [];
      const conceptSet = new Set();
      const pendingProgressScenes = new Map();
      let scenes = {};
      let currentScene = "";
      let currentCase = null;
      let suspects = [];
      let locations = {};
      let notes = [];
      let money = 0;
      let lastCombinationMessage = "";
      let currentMapLocation = null;
      const moneyAwardedScenes = new Set();

      function hasConcept(name) {
        return conceptSet.has(name);
      }

      function normalizeConceptData(name) {
        const definition = (currentCase && currentCase.concepts && currentCase.concepts[name]) || {};
        const type = definition.type || "sensorial";
        const description = definition.description || "Concepto registrado.";
        return { name, type, description };
      }

      function addConcept(name, parents = []) {
        if (!name || hasConcept(name)) {
          return;
        }
        const concept = normalizeConceptData(name);
        concept.parents = parents; // Store parents for the tree
        conceptInventory.push(concept);
        conceptSet.add(name);
        updateInventoryUI();
        renderDeductionTree();
      }

      function updateMoney(amount) {
        money += amount;
        moneyAmountEl.textContent = `$${money}`;
        if (money !== 0) {
            moneyPanelEl.classList.remove("hidden");
        }
      }

      function addNote(text) {
        if (notes.includes(text)) return;
        notes.push(text);
        renderNotes();
      }

      function renderNotes() {
        notesListEl.innerHTML = "";
        if (!notes.length) {
            const p = document.createElement("p");
            p.className = "faint";
            p.textContent = "Sin notas aún.";
            notesListEl.appendChild(p);
            return;
        }
        notes.forEach(note => {
            const div = document.createElement("div");
            div.className = "note-item";
            div.textContent = note;
            notesListEl.appendChild(div);
        });
        // Scroll to bottom
        notesListEl.scrollTop = notesListEl.scrollHeight;
      }

      function renderDeductionTree() {
        deductionTreeEl.innerHTML = "";
        
        const types = ["sensorial", "deducido", "falso", "objeto"];
        
        types.forEach(type => {
            const conceptsOfType = conceptInventory.filter(c => c.type === type);
            if (conceptsOfType.length === 0) return;

            const levelDiv = document.createElement("div");
            levelDiv.className = "tree-level";
            
            const label = document.createElement("span");
            label.className = "tree-level-label";
            label.textContent = type;
            levelDiv.appendChild(label);

            conceptsOfType.forEach(c => {
                const node = document.createElement("div");
                node.className = "tree-node";
                node.dataset.type = type;
                node.textContent = c.name;
                if (c.parents && c.parents.length > 0) {
                    node.classList.add("has-parents");
                    node.title = `Derivado de: ${c.parents.join(" + ")}`;
                }
                levelDiv.appendChild(node);
            });

            deductionTreeEl.appendChild(levelDiv);
        });
      }

      function renderMiniMap() {
        miniMapGridEl.innerHTML = "";
        if (!currentCase || !currentCase.mapData) {
            miniMapPanelEl.classList.add("hidden");
            return;
        }
        miniMapPanelEl.classList.remove("hidden");

        // Sort or just iterate. We assume mapData contains grid info.
        // mapData: [{ id, label, row, col, ... }]
        currentCase.mapData.forEach(node => {
            // Check if node is unlocked? For now show all or check 'unlocked' property if we add it.
            // User said: "If a location is “unlocked” only after progress, it should appear on the map only then."
            // We can check a condition if provided.
            
            const div = document.createElement("div");
            div.className = "map-node";
            div.id = `map-node-${node.id}`;
            div.textContent = node.label;
            
            // Grid positioning
            if (node.row) div.style.gridRowStart = node.row;
            if (node.col) div.style.gridColumnStart = node.col;
            if (node.rowSpan) div.style.gridRowEnd = `span ${node.rowSpan}`;
            if (node.colSpan) div.style.gridColumnEnd = `span ${node.colSpan}`;

            // Initial state
            if (node.id === currentMapLocation) {
                div.classList.add("active");
            } else {
                div.classList.add("inactive");
            }

            miniMapGridEl.appendChild(div);
        });
      }

      function updateMiniMap(locationId) {
        if (!locationId) return;
        currentMapLocation = locationId;
        
        const nodes = miniMapGridEl.querySelectorAll(".map-node");
        nodes.forEach(node => {
            if (node.id === `map-node-${locationId}`) {
                node.classList.add("active");
                node.classList.remove("inactive");
            } else {
                node.classList.remove("active");
                node.classList.add("inactive");
            }
        });
      }

      function updateInventoryUI() {
        inventoryListEl.innerHTML = "";
        if (!conceptInventory.length) {
          const li = document.createElement("li");
          li.textContent = "Sin conceptos todavía.";
          li.className = "faint";
          inventoryListEl.appendChild(li);
          return;
        }

        conceptInventory.forEach((concept) => {
          const li = document.createElement("li");
          const head = document.createElement("div");
          head.className = "concept-head";

          const name = document.createElement("div");
          name.className = "concept-name";
          const dot = document.createElement("span");
          dot.className = "concept-dot";
          name.appendChild(dot);
          name.appendChild(document.createTextNode(concept.name));

          const type = document.createElement("div");
          type.className = "concept-type";
          type.dataset.kind = concept.type || "sensorial";
          type.textContent = concept.type || "sensorial";

          head.appendChild(name);
          head.appendChild(type);
          li.appendChild(head);

          if (concept.description) {
            const desc = document.createElement("p");
            desc.className = "concept-desc";
            desc.textContent = concept.description;
            li.appendChild(desc);
          }

          inventoryListEl.appendChild(li);
        });
      }

      function refreshTransitions() {
        sceneTextEl.classList.remove("visible");
        choicesEl.classList.remove("visible");
        void sceneTextEl.offsetWidth;
        sceneTextEl.classList.add("visible");
        choicesEl.classList.add("visible");
      }

      function openCaseSelector() {
        caseSelectorEl.classList.remove("hidden");
        gameUIEl.classList.add("hidden");
        controlsEl.classList.add("hidden");
        activeCaseEl.innerHTML = '<span class="case-dot"></span> Ningún caso seleccionado';
        sceneTextEl.innerHTML = "";
        choicesEl.innerHTML = "";
      }

      function initSuspects(data = []) {
        suspects = data.map((suspect) => ({
          name: suspect.name,
          description: suspect.description || "",
          suspicionLevel: Math.max(0, Math.min(5, suspect.suspicionLevel || 0)),
          associatedConcepts: suspect.associatedConcepts ? [...suspect.associatedConcepts] : [],
        }));
        renderSuspectPanel();
      }

      function getSuspicionLevel(name) {
        const entry = suspects.find((s) => s.name === name);
        return entry ? entry.suspicionLevel : 0;
      }

      function updateSuspicions(name, amount) {
        const entry = suspects.find((s) => s.name === name);
        if (!entry || !Number.isFinite(amount)) return;
        entry.suspicionLevel = Math.max(0, Math.min(5, entry.suspicionLevel + amount));
        renderSuspectPanel();
      }

      function addSuspectConcept(name, conceptName) {
        const entry = suspects.find((s) => s.name === name);
        if (!entry || !conceptName) return;
        if (!entry.associatedConcepts.includes(conceptName)) {
          entry.associatedConcepts.push(conceptName);
        }
        renderSuspectPanel();
      }

      function renderSuspectPanel() {
        suspectListEl.innerHTML = "";
        if (!suspects.length) {
          const li = document.createElement("li");
          li.className = "faint";
          li.textContent = "Sin sospechosos todavía.";
          suspectListEl.appendChild(li);
          return;
        }

        suspects.forEach((suspect) => {
          const li = document.createElement("li");
          li.className = "suspect-card";

          const top = document.createElement("div");
          top.className = "suspect-top";

          const nameEl = document.createElement("p");
          nameEl.className = "suspect-name";
          nameEl.textContent = suspect.name;

          const pill = document.createElement("span");
          pill.className = "suspicion-pill";
          pill.textContent = `Sospecha ${suspect.suspicionLevel}/5`;

          top.appendChild(nameEl);
          top.appendChild(pill);
          li.appendChild(top);

          const bar = document.createElement("div");
          bar.className = "suspicion-bar";
          const fill = document.createElement("div");
          fill.className = "suspicion-fill";
          fill.style.width = `${(suspect.suspicionLevel / 5) * 100}%`;
          bar.appendChild(fill);
          li.appendChild(bar);

          const desc = document.createElement("p");
          desc.className = "suspect-desc";
          desc.textContent = suspect.description;
          li.appendChild(desc);

          if (suspect.associatedConcepts && suspect.associatedConcepts.length) {
            const concepts = document.createElement("div");
            concepts.className = "suspect-concepts";
            suspect.associatedConcepts.forEach((concept) => {
              const tag = document.createElement("span");
              tag.className = "combo-pill";
              tag.textContent = concept;
              concepts.appendChild(tag);
            });
            li.appendChild(concepts);
          }

          suspectListEl.appendChild(li);
        });
      }

      function initLocations(data = []) {
        locations = {};
        const list = Array.isArray(data) ? data : Object.values(data || {});
        list.forEach((location) => {
          const total = location.totalProgress || location.total || 1;
          const current = location.currentProgress || 0;
          locations[location.name] = {
            name: location.name,
            description: location.description || "",
            totalProgress: total < 1 ? 1 : total,
            currentProgress: Math.min(current, total),
            completed: current >= total,
          };
        });
        renderLocationPanel();
      }

      function ensureLocation(name) {
        if (!locations[name]) {
          locations[name] = {
            name,
            description: "",
            totalProgress: 1,
            currentProgress: 0,
            completed: false,
          };
        }
        return locations[name];
      }

      function applyLocationProgress(progressData) {
        if (!progressData || !progressData.location) return null;
        const location = ensureLocation(progressData.location);
        const gain = progressData.progressGain || 0;
        const wasCompleted = location.completed;
        location.currentProgress = Math.min(location.totalProgress, location.currentProgress + gain);
        if (location.currentProgress >= location.totalProgress) {
          location.completed = true;
        }
        renderLocationPanel();

        const justCompleted = !wasCompleted && location.completed;
        if (justCompleted && progressData.onComplete) {
          return {
            scene: progressData.onComplete,
            text: progressData.onCompleteText || `Nuevo evento en ${location.name}`,
          };
        }
        return null;
      }

      function renderLocationPanel() {
        locationListEl.innerHTML = "";
        const entries = Object.values(locations);
        if (!entries.length) {
          const li = document.createElement("li");
          li.className = "faint";
          li.textContent = "Sin ubicaciones en este caso.";
          locationListEl.appendChild(li);
          return;
        }

        entries.forEach((loc) => {
          const li = document.createElement("li");
          li.className = "location-card";

          const meta = document.createElement("div");
          meta.className = "location-meta";
          const name = document.createElement("p");
          name.className = "location-name";
          name.textContent = loc.name;
          const counter = document.createElement("span");
          counter.className = "progress-counter";
          counter.textContent = `${loc.currentProgress}/${loc.totalProgress}`;
          meta.appendChild(name);
          meta.appendChild(counter);
          li.appendChild(meta);

          const bar = document.createElement("div");
          bar.className = "progress-bar";
          const fill = document.createElement("div");
          fill.className = "progress-fill";
          fill.style.width = `${(loc.currentProgress / loc.totalProgress) * 100}%`;
          bar.appendChild(fill);
          li.appendChild(bar);

          if (loc.description) {
            const desc = document.createElement("p");
            desc.className = "location-desc";
            desc.textContent = loc.description;
            li.appendChild(desc);
          }

          if (loc.completed) {
            const pill = document.createElement("span");
            pill.className = "unlock-pill";
            const dot = document.createElement("span");
            dot.className = "case-dot";
            pill.appendChild(dot);
            pill.appendChild(document.createTextNode("Listo para evento"));
            li.appendChild(pill);
          }

          locationListEl.appendChild(li);
        });
      }

      function renderPuzzle(scene) {
        const puzzle = scene.puzzle;
        if (!puzzle) {
          puzzleContainerEl.classList.add("hidden");
          puzzleButtonEl.onclick = null;
          return;
        }
        puzzleContainerEl.classList.remove("hidden");
        puzzleDescriptionEl.textContent = puzzle.description || "Puzzle de conceptos";
        puzzleButtonEl.onclick = () => {
          const requirements = puzzle.requirements || [];
          const hasAll = requirements.every(hasConcept);
          const target = hasAll ? puzzle.success : puzzle.failure;
          if (target) {
            showScene(target);
          }
        };
      }

      function combineConcepts(conceptA, conceptB) {
        const scene = scenes[currentScene];
        const combos = (scene && scene.combinations) || [];
        const match = combos.find((combo) => {
          const reqs = combo.requires || combo.inputs || [];
          return reqs.length === 2 && reqs.every((req) => req === conceptA || req === conceptB);
        });
        if (match && match.result) {
          addConcept(match.result, match.requires); // Pass parents
          if (match.associateSuspect) {
            addSuspectConcept(match.associateSuspect, match.result);
          }
          lastCombinationMessage = `Deducción creada: ${match.result}`;
        } else {
          lastCombinationMessage = "La combinación no encaja en esta escena.";
        }
        renderCombinations(scene);
      }

      function renderCombinations(scene) {
        const combos = (scene && scene.combinations) || [];
        combinationListEl.innerHTML = "";
        if (!combos.length) {
          combinationContainerEl.classList.add("hidden");
          combinationFeedbackEl.classList.add("hidden");
          return;
        }
        combinationContainerEl.classList.remove("hidden");
        combos.forEach((combo) => {
          const comboEl = document.createElement("div");
          comboEl.className = "combination";

          const reqs = document.createElement("div");
          reqs.className = "combo-reqs";
          (combo.requires || []).forEach((req) => {
            const pill = document.createElement("span");
            pill.className = "combo-pill";
            pill.textContent = req;
            reqs.appendChild(pill);
          });
          comboEl.appendChild(reqs);

          if (combo.description) {
            const desc = document.createElement("p");
            desc.className = "info-text";
            desc.textContent = combo.description;
            comboEl.appendChild(desc);
          }

          const result = document.createElement("p");
          result.className = "combo-result";
          result.textContent = `Resultado: ${combo.result}`;
          comboEl.appendChild(result);

          const button = document.createElement("button");
          button.className = "combine-btn";
          const requirements = combo.requires || [];
          const hasAll = requirements.every(hasConcept);
          const alreadyHas = hasConcept(combo.result);
          button.disabled = !hasAll || alreadyHas;
          button.textContent = alreadyHas ? "Ya deducido" : hasAll ? "Deducir" : "Faltan conceptos";
          button.addEventListener("click", () => combineConcepts(requirements[0], requirements[1]));
          comboEl.appendChild(button);

          combinationListEl.appendChild(comboEl);
        });

        if (lastCombinationMessage) {
          combinationFeedbackEl.textContent = lastCombinationMessage;
          combinationFeedbackEl.classList.remove("hidden");
        } else {
          combinationFeedbackEl.classList.add("hidden");
        }
      }

      function applySceneEffects(scene) {
        if (scene.reward) {
          [].concat(scene.reward).forEach(r => addConcept(r));
        }

        if (scene.moneyGain && !moneyAwardedScenes.has(currentScene)) {
            updateMoney(scene.moneyGain);
            moneyAwardedScenes.add(currentScene);
        }

        if (scene.notes) {
            [].concat(scene.notes).forEach(addNote);
        }

        if (scene.locationProgress) {
          const unlock = applyLocationProgress(scene.locationProgress);
          if (unlock) {
            pendingProgressScenes.set(unlock.scene, unlock.text);
          }
        }

        if (scene.suspectAdjustments) {
          scene.suspectAdjustments.forEach((adj) => updateSuspicions(adj.name, adj.change || 0));
        }

        if (scene.suspectConcepts) {
          scene.suspectConcepts.forEach((pair) => addSuspectConcept(pair.name, pair.concept));
        }
        
        if (scene.location) {
            updateMiniMap(scene.location);
        }
      }

      function checkEndings(scene) {
        if (!currentCase.endings) return null;
        
        for (const ending of currentCase.endings) {
            const conditions = ending.conditions || {};
            let met = true;

            if (conditions.moneyMin !== undefined && money < conditions.moneyMin) met = false;
            if (conditions.moneyMax !== undefined && money > conditions.moneyMax) met = false;
            
            if (conditions.concepts) {
                if (!conditions.concepts.every(hasConcept)) met = false;
            }

            if (conditions.suspicion) {
                const s = suspects.find(sus => sus.name === conditions.suspicion.name);
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

      function showScene(id) {
        const scene = scenes[id];
        if (!scene) {
          return;
        }
        currentScene = id;
        if (pendingProgressScenes.has(id)) {
          pendingProgressScenes.delete(id);
        }
        
        applySceneEffects(scene);

        // Check for dynamic endings after effects
        const endingSceneId = checkEndings(scene);
        if (endingSceneId && endingSceneId !== id) {
            // If an ending is triggered, show it immediately
            // But we must be careful not to loop if the ending scene itself triggers it.
            // Usually ending scenes won't have further conditions or will be terminal.
            // We'll just call showScene recursively.
            // To prevent infinite loops, ensure ending scenes don't trigger themselves.
            setTimeout(() => showScene(endingSceneId), 100); // Small delay for effect
            return;
        }

        sceneTextEl.innerHTML = scene.text || "";
        renderPuzzle(scene);
        renderCombinations(scene);
        renderChoices(scene);
        refreshTransitions();
      }

      function choiceAllowed(choice) {
        if (choice.next && scenes[choice.next]) {
            const target = scenes[choice.next];
            if (target.moneyGain && moneyAwardedScenes.has(choice.next)) {
                return false;
            }
        }

        if (choice.moneyCost && money < choice.moneyCost) return false;

        if (choice.requires && !choice.requires.every(hasConcept)) return false;

        if (choice.requiresSuspicion) {
          const checks = Array.isArray(choice.requiresSuspicion) ? choice.requiresSuspicion : [choice.requiresSuspicion];
          const ok = checks.every((req) => {
            const level = getSuspicionLevel(req.name);
            const min = req.min ?? req.atLeast ?? 0;
            const max = req.max ?? req.atMost ?? 5;
            return level >= min && level <= max;
          });
          if (!ok) return false;
        }

        if (choice.requiresProgress) {
          const progress = Array.isArray(choice.requiresProgress) ? choice.requiresProgress : [choice.requiresProgress];
          const ok = progress.every((req) => {
            const loc = ensureLocation(req.location);
            const min = req.min ?? req.atLeast ?? 0;
            const needsCompleted = req.completed === true;
            if (needsCompleted && !loc.completed) return false;
            return loc.currentProgress >= min;
          });
          if (!ok) return false;
        }

        return true;
      }

      function renderChoices(scene) {
        choicesEl.innerHTML = "";
        const unlockedFromProgress = Array.from(pendingProgressScenes.entries()).map(([sceneId, text]) => ({
          text,
          next: sceneId,
        }));

        const combinedList = [...(scene.choices || []), ...unlockedFromProgress];
        combinedList.forEach((choice) => {
          if (!choiceAllowed(choice)) {
            return;
          }

          const btn = document.createElement("button");
          let text = choice.text;
          if (choice.moneyCost) {
            text += ` ($${choice.moneyCost})`;
          }
          btn.textContent = text;
          btn.className = "choice-btn";
          btn.addEventListener("click", () => {
            if (choice.moneyCost) {
                updateMoney(-choice.moneyCost);
            }

            if (choice.next === "restart") {
              restartGame();
              return;
            }
            if (choice.next === "case-selector") {
              openCaseSelector();
              return;
            }
            if (choice.gain) {
              [].concat(choice.gain).forEach(r => addConcept(r));
            }
            if (choice.suspectAdjustments) {
              choice.suspectAdjustments.forEach((adj) => updateSuspicions(adj.name, adj.change || 0));
            }
            if (choice.suspectConcepts) {
              choice.suspectConcepts.forEach((pair) => addSuspectConcept(pair.name, pair.concept));
            }
            if (choice.locationProgress) {
              const unlock = applyLocationProgress(choice.locationProgress);
              if (unlock) {
                pendingProgressScenes.set(unlock.scene, unlock.text);
              }
            }
            showScene(choice.next);
          });
          choicesEl.appendChild(btn);
        });
      }

      function restartGame() {
        if (!currentCase) {
          return;
        }
        startGame(currentCase.id);
      }

      function startGame(caseId) {
        const selectedCase = caseLibrary[caseId];
        if (!selectedCase) {
          return;
        }
        currentCase = selectedCase;
        scenes = selectedCase.scenes || {};
        currentScene = selectedCase.startScene || Object.keys(scenes)[0] || "";
        conceptInventory.length = 0;
        conceptSet.clear();
        pendingProgressScenes.clear();
        moneyAwardedScenes.clear();
        notes = [];
        money = 0;
        updateMoney(0);
        renderNotes();
        renderDeductionTree();
        initSuspects(selectedCase.suspects || []);
        initLocations(selectedCase.locations || []);
        lastCombinationMessage = "";
        currentMapLocation = null;
        
        // Initialize map
        renderMiniMap();

        updateInventoryUI();
        activeCaseEl.innerHTML = '<span class="case-dot"></span> ' + selectedCase.title;
        caseSelectorEl.classList.add("hidden");
        gameUIEl.classList.remove("hidden");
        controlsEl.classList.remove("hidden");
        if (currentScene) {
          showScene(currentScene);
        }
      }

      function renderCaseCards() {
        caseGridEl.innerHTML = "";
        const cases = Object.values(caseLibrary);
        if (!cases.length) {
          const empty = document.createElement("p");
          empty.className = "case-help";
          empty.textContent = "No hay casos disponibles.";
          caseGridEl.appendChild(empty);
          return;
        }

        cases.forEach((entry) => {
          const card = document.createElement("div");
          card.className = "case-card";
          const subtitle = entry.id === "tutorial" ? "Caso de práctica" : "Caso principal";
          card.innerHTML = `
            <span class="case-tag">${subtitle}</span>
            <h3 class="case-title">${entry.title}</h3>
            <p class="case-synopsis">${entry.synopsis}</p>
          `;
          const playBtn = document.createElement("button");
          playBtn.className = "play-btn";
          playBtn.textContent = "Jugar";
          playBtn.addEventListener("click", () => startGame(entry.id));
          card.appendChild(playBtn);
          caseGridEl.appendChild(card);
        });
      }

      restartBtn.addEventListener("click", restartGame);
      caseMenuBtn.addEventListener("click", () => {
        currentCase = null;
        scenes = {};
        conceptInventory.length = 0;
        conceptSet.clear();
        pendingProgressScenes.clear();
        updateInventoryUI();
        initSuspects([]);
        initLocations([]);
        openCaseSelector();
      });

      renderCaseCards();
      updateInventoryUI();
      openCaseSelector();

      // Help Buttons Logic
      document.querySelectorAll('.help-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tooltip = btn.nextElementSibling;
          if (tooltip && tooltip.classList.contains('tooltip')) {
            // Close all other tooltips
            document.querySelectorAll('.tooltip').forEach(t => {
              if (t !== tooltip) t.classList.remove('visible');
            });
            tooltip.classList.toggle('visible');
          }
        });
      });

      // Close tooltips when clicking outside
      document.addEventListener('click', () => {
        document.querySelectorAll('.tooltip').forEach(t => t.classList.remove('visible'));
      });
    })();