// Mindustry-Style Single-Source Branching Research Tree Interface
class ResearchView {
  static branchLabels = {
    core: "Core Directorate",
    aerodynamics: "Track 1: Aerodynamics & Lightweight Carbodies",
    electronics: "Track 2: Power Electronics & Inverter Modulation",
    motors: "Track 3: High-Torque & High-RPM Motors",
    running_gear: "Track 4: Running Gear, Bogies & Transmissions",
    power_collection: "Track 5: High-Speed Catenary & Current Collection",
    automation: "Track 6: Storage, Automation & Safety"
  };

  static render(container) {
    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);
    const coreNode = TECH_DATA.find(t => t.id === "tech_core");
    const tracks = ["aerodynamics", "electronics", "motors", "running_gear", "power_collection", "automation"];

    container.innerHTML = `
      <!-- R&D Capital Investment Header -->
      <div class="c-card" style="margin-bottom:12px;">
        <div class="card-header">
          <span class="card-title">Research &amp; Development Directorate</span>
          <span class="c-badge badge-blue font-mono">Accumulated: ${state.sciencePoints} Research Points</span>
        </div>
        <div class="view-grid-two">
          <div id="res-budget-slider"></div>
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Active Research Node</span>
            <div class="font-mono text-blue" style="font-size:14px; margin:2px 0;">
              ${activeTech ? activeTech.name : "None (Directorate Idle)"}
            </div>
            ${activeTech ? `
              <div class="tech-progress-bar">
                <div class="tech-progress-fill" style="width:${Math.round((state.researchProgress / activeTech.costScience) * 100)}%;"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:10px; margin-top:3px;" class="text-muted font-mono">
                <span>${state.researchProgress} / ${activeTech.costScience} Research Points</span>
                <span>${Math.round((state.researchProgress / activeTech.costScience) * 100)}%</span>
              </div>
            ` : ""}
          </div>
        </div>
      </div>

      <!-- Single-Source Mindustry-Style Tree Workspace -->
      <div class="tree-workspace">
        <!-- Central Root Source -->
        <div class="tree-core-banner">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="font-size:13px; color:var(--text-main);">${coreNode.name}</strong>
              <span class="c-badge badge-green">Central Root Source</span>
            </div>
            <p class="text-muted" style="font-size:10px; margin-top:2px;">${coreNode.desc}</p>
          </div>
          <span class="c-badge badge-blue font-mono">6 Specialized Branches Originating</span>
        </div>

        <!-- Specialized Tree Branches -->
        <div class="tree-branches-container">
          ${tracks.map(trackKey => {
            const nodes = TECH_DATA.filter(t => t.branch === trackKey);
            return `
              <div class="tree-branch-track">
                <div class="tree-branch-header">
                  <span class="tree-branch-title">${this.branchLabels[trackKey]}</span>
                  <span class="text-muted" style="font-size:10px;">${nodes.filter(n => state.unlockedTechs.has(n.id)).length} / ${nodes.length} Researched</span>
                </div>
                <div class="tree-node-row" id="track-nodes-${trackKey}"></div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    // Mount Daily Budget Slider
    const budgetBox = container.querySelector("#res-budget-slider");
    const slider = UI.createSlider({
      min: 0,
      max: 50000,
      value: state.dailyResearchBudget,
      label: "Daily Research Investment ($)",
      unit: " / Day",
      step: 2500,
      onInput: (v) => {
        state.dailyResearchBudget = v;
        state.saveToStorage();
      }
    });
    budgetBox.appendChild(slider);

    // Populate Branch Nodes
    tracks.forEach(trackKey => {
      const row = container.querySelector(`#track-nodes-${trackKey}`);
      const nodes = TECH_DATA.filter(t => t.branch === trackKey);

      nodes.forEach(tech => {
        const isResearched = state.unlockedTechs.has(tech.id);
        const isActive = state.activeResearchId === tech.id;
        const prereqsMet = tech.prereq.every(p => state.unlockedTechs.has(p));
        const isLocked = !prereqsMet && !isResearched;

        const card = document.createElement("div");
        card.className = `t-node ${isResearched ? "researched" : ""} ${isActive ? "active-research" : ""} ${isLocked ? "locked" : ""}`;

        card.innerHTML = `
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
              <span class="t-node-title">${tech.name}</span>
              <span class="c-badge ${isResearched ? "badge-green" : (isActive ? "badge-blue" : (isLocked ? "badge-amber" : "badge-blue"))}">
                ${isResearched ? "Mastered" : (isActive ? "Researching" : (isLocked ? "Locked" : "Available"))}
              </span>
            </div>
            <p class="text-muted" style="font-size:10px; line-height:1.3;">${tech.desc}</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:4px;">
            <span class="t-node-cost">${isResearched ? "Completed" : `${tech.costScience} Points`}</span>
            ${!isResearched && !isLocked && !isActive ? `<button class="c-btn btn-ghost btn-sm btn-start-node" style="font-size:10px; padding:2px 6px;">Research</button>` : ""}
          </div>
        `;

        card.onclick = () => {
          if (isResearched) {
            UI.toast(`"${tech.name}" is already fully mastered.`, "normal");
            return;
          }
          if (isLocked) {
            const unfulfilled = tech.prereq.filter(p => !state.unlockedTechs.has(p)).map(p => state.findTechById(p)?.name || p);
            UI.toast(`Branch Locked: Complete prerequisite "${unfulfilled.join(", ")}" first.`, "danger");
            return;
          }
          state.activeResearchId = tech.id;
          state.researchProgress = 0;
          SoundSystem.playClick();
          UI.toast(`R&D Project Assigned: ${tech.name}`, "success");
          ResearchView.render(document.getElementById("viewport-root"));
        };

        row.appendChild(card);
      });
    });
  }
}