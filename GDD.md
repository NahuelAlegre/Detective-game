# Game Design Document (GDD) - Mystery of the Concept Inventory

## 1. Game Overview

**Title:** Mystery of the Concept Inventory  
**Genre:** Interactive Fiction / Mystery / Puzzle  
**Platform:** Web Browser (HTML5/JS)  
**Visual Style:** Noir, Atmospheric, Minimalist, Dark UI  
**Target Audience:** Fans of mystery novels, detective games, and text adventures.

### Core Concept
"Mystery of the Concept Inventory" is a textual investigation game where the player's inventory does not contain physical objects, but **ideas, observations, and deductions**. The player must collect these "concepts" by exploring scenes and interacting with characters. The central mechanic revolves around **combining these concepts** to form new deductions, unlock dialogue options, and solve logical puzzles to advance the narrative.

---

## 2. Gameplay Mechanics

### 2.1. The Concept Inventory
Unlike traditional adventure games, the inventory stores abstract information.
*   **Concept Types:**
    *   `Sensorial`: Direct observations (e.g., "Metallic Echo", "Pine Smell").
    *   `Deducido`: Logical conclusions derived from combining other concepts (e.g., "Distraction Rehearsal").
    *   `Falso`: False leads or incorrect assumptions that can lead to mistakes (e.g., "Imaginary Alarm").
*   **Use:** Concepts act as "keys" to unlock options in the decision tree and solve puzzles.

### 2.2. Combination System (Deductions)
The player can select two concepts from their inventory to attempt to combine them.
*   **Success:** If the logic is valid (defined in the case), a new `Deducido` type concept is created.
*   **Feedback:** The system informs if the combination is valid or not for the current scene.
*   **Purpose:** Simulate the mental process of a detective connecting dots.

### 2.3. Suspect System
Each case presents a list of suspicious characters.
*   **Suspicion Level:** A numerical value (0-5) that fluctuates based on player actions.
*   **Concept Association:** Concepts can be linked to a specific suspect (e.g., linking "Crowned Key" with "Rivas").
*   **Consequences:** Certain dialogue options or endings are only available if a suspect has a specific suspicion level (minimum or maximum).

### 2.4. Locations and Investigation State
Locations are visible to the player (place names and descriptions), but the investigation progress per area is tracked internally rather than displayed as a visible numerical bar.
*   **Exploration (Hidden Progress):** Visiting scenes or performing specific, meaningful actions in a location advances an internal state for that area. Each action consumes time (see 2.10 Time System) and should return a tangible result—flavor text, a clue, a red herring, or an unlock event.
*   **Completion Events:** When an internal location state reaches a threshold, the engine can unlock special scenes, clues or narrative branches. These unlocks happen without exposing partial progress to the player, encouraging exploration without giving an explicit checklist to finish.
*   **Design Principle:** Avoid clicker-style progress mechanics. Each interaction should be a meaningful decision with a cost (e.g., time or risk), not a generic "search" that just fills a bar.

### 2.5. Verification Puzzles
Key moments where the player must demonstrate their understanding of the case.
*   **Mechanic:** A challenge is presented (e.g., opening a locked drawer) that requires having a specific set of concepts in the inventory.
*   **States:** Success (advances the story) or Failure (allows retry or seeking more clues).

### 2.6. Deduction Tree
A visual representation of the player's mental map.
*   **Visualization:** Concepts are displayed as nodes connected by lines.
*   **Structure:** Nodes are grouped by type (Sensorial, Deduced, False).
*   **Updates:** The tree updates in real-time as new concepts are discovered or deduced.

### 2.7. Investigator Notes
An automated journal system.
*   **Automation:** The engine automatically adds notes based on scene events.
*   **Content:** Short sentences, follow-up questions, and key deductions.
*   **Purpose:** Guides the player and summarizes key plot points.

### 2.8. Dynamic Ending Conditions
Cases can have multiple outcomes determined by various game states.
*   **Triggers:** Endings can be triggered by reputation, collected concepts, internal location state (hidden progression), or suspicion levels.
*   **Automatic vs. Choice:** Some endings are automatic (e.g., suspicion too high), while others are choice-based.

### 2.9. Time System
A resource that limits the number of actions per day.
*   **Clock:** The game tracks the time of day (starting at 09:00 AM usually).
*   **Cost:** Actions like moving between locations, searching, or interrogating consume time (e.g., 15 minutes).
*   **Strategic Choice:** The player must decide which leads to pursue before the day ends or events trigger.

---

## 3. Narrative Structure and Cases

The game uses a modular case system. It currently has two files:

### 3.1. Tutorial Case: "The Drawer Test"
*   **Synopsis:** A training exercise designed by a mentor. The player must open a practice drawer without forcing it.
*   **Objective:** Learn to observe, combine clues, and manage suspicion.
*   **Characters:**
    *   **Rivas (Night Porter):** Suspected of performing unregistered night rehearsals.
    *   **Lía (Apprentice):** Witness and guide.
*   **Key Clue:** Combine "Metallic Echo" + "Crowned Key" -> "Distraction Rehearsal".

### 3.2. Principal Case: "The Disappearance of Mara Lys"
*   **Synopsis:** Archivist Mara Lys has disappeared after closing the library. A hidden map and rumors about ancient tunnels are the only clues.
*   **Setting:** The town of Ashwick (Square, Library, Old House).
*   **Characters:**
    *   **Inez (Librarian):** Her alibi has contradictions.
    *   **Mara Lys (Missing):** She left hidden clues before vanishing.
    *   **Mayor:** The authority to whom the final report must be presented.
*   **Specific Mechanics:**
    *   Track footprints in the mud.
    *   Find contradictions in the logbook (Timeline).
    *   Discover a hidden map divided into fragments.
*   **Multiple Endings:** Depending on the evidence collected (Map, Contradiction) and decisions made, the case can be resolved with the full truth, a half-truth, or remain an unsolved mystery ("Cold Case").

---

## 4. User Interface (UI) and Visual Style

### 4.1. Visual Design
*   **Color Palette:** Dark and cool tones (deep blues, grays, blacks) with accents in light blue and gold for interactive elements.
*   **Typography:**
    *   Titles: *Merriweather* (Serif) for a classic and literary touch.
    *   Body: *Inter* (Sans-serif) for on-screen readability.
*   **Atmosphere:** Overlaid "fog" and "grain" (film grain) effects to evoke a noir/mystery aesthetic.

### 4.2. UI Elements
*   **Central Panel (Story):** Where the current scene is narrated and decision options appear.
    *   **Side Panel (Tools):**
    *   **Inventory:** List of concepts with colored icons based on their type.
    *   **Deduction Tree:** Visual graph of connected concepts.
    *   **Investigator Notes:** Chronological list of automated journal entries.
    *   **Suspects:** Cards with suspicion progress bars (use qualitative UI to hide exact numbers where appropriate).
    *   **Locations:** List of known areas with descriptions. No numerical progress bars are shown to the player; location progression is managed internally and used to trigger events or unlocks (see 2.4).
*   **Header:**
    *   **Case Selector:** A grid of cards to choose which mystery to play.

---

## 5. Technical Architecture

*   **Languages:** HTML5, CSS3, JavaScript (Svelte/Vite).
*   **File Structure:**
    *   `index.html`: Entry point.
    *   `src/`: Source code folder.
        *   `App.svelte`: Main application component.
        *   `engine.js`: Game engine logic.
        *   `stores.js`: Svelte stores for state management.
        *   `data/cases/`: Modular case data files.
            *   `tutorial.js`
            *   `principal.js`
*   **Extensibility:** The system is designed to add new cases by simply creating a new JS file in `src/data/cases/` and importing it in `src/data/cases.js`.

---

## 6. Creating Stories for Detective HD Codex

Writing for this game requires a shift from linear storytelling to **systemic narrative design**. The player is not just reading a story; they are building a mental model of it using the inventory.

### 6.1. The "Concept" as the Atom of Narrative
In traditional games, you pick up a "Key". In this game, you pick up the *concept* of "The Key is Missing".
*   **Sensorial Concepts:** What the player *sees, hears, or smells*. (e.g., "Smell of burnt paper").
*   **Deduced Concepts:** The *meaning* of those observations. (e.g., "Evidence Destruction").
*   **False Concepts:** Red herrings that the player might believe are true.

### 6.2. Non-Linear Structure (The "Hub" Model)
Avoid long chains of `A -> B -> C`. Instead, use a **Hub and Spoke** model.
*   **The Hub:** A central location (e.g., The Lobby) where the player can choose where to go next.
*   **The Spokes:** Locations or investigation lines that can be explored in any order.
*   **Gating:** Use *Concepts* to gate progress, not just linear flags.
    *   *Bad:* You can't enter the basement until you visit the kitchen.
    *   *Good:* You can visit the basement, but it's dark. You need the "Flashlight" concept found in the kitchen to see anything useful.

### 6.3. Designing for Deductions
The core loop is **Observation -> Combination -> Realization**.
1.  **Plant Clues:** Place 2-3 sensorial concepts in different locations.
2.  **Create the Logic:** Define a valid combination in the JSON.
3.  **Reward the Player:** The new "Deduced" concept should unlock a new dialogue option or solve a puzzle.

### 6.4. Using Game Systems
*   **Suspicion:** Make player actions have consequences. Pressuring a witness raises suspicion. High suspicion might lock them down, while low suspicion might make them lie.
*   **Locations:** Use hidden internal progress or state (not shown as bars) combined with time-costing, meaningful actions to simulate depth of a search. For example, "Examine the desk (15m)" then "Check the drawer (10m)" may cause an internal state to reach a threshold and reveal the rare book. Avoid showing numerical progress to the player—expose narrative results instead.

### 6.5. Writing the JSON
The story is defined in a JSON object.
*   `scenes`: The nodes of the story.
*   `choices`: The edges connecting nodes. Use `requires` (concepts) to add friction.
*   `combinations`: The logic puzzles.
*   `endings`: Define multiple outcomes based on the final state of the inventory and suspect list.
