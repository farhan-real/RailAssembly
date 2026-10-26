// Interactive Research and Development Network Tree
class ResearchView {
  static render(container) {
    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);

    container.innerHTML = `
      <div class="c-card" style="margin-bottom:16px;">
        <div class="card-header">
          <span class="card-title text-cyan">R&amp;D Investment &amp; Engineering Directorate</span>
          <span class="c-badge badge-cyan">SCIENCE: ${state.sciencePoints} PTS</span>
        </div>
        <div class="view-grid-two">
          <div id="res-budget-slider"></div>
          <div>
            <span class="text-muted" style="font-size:11px;">ACTIVE RESEARCH PROJECT:</span>
            <div class="font-mono text-cyan" style="font-size:16px; margin:4px 0;">
              ${activeTech ? activeTech.name : "None (Idle)"}
            </div>
            ${activeTech 
              ? `<div class="tech-progress-bar">
                   <div class="tech-progress-fill" style="width:${Math.round((state.researchProgress / activeTech.costScience) * 100)}%;"></div>
                 </div>
                 <div style="display:flex; justify-content:space-between; font-size:10px; margin-top:4px;" class="text-muted font-mono">
                   <span>${state.researchProgress} / ${activeTech.costScience} Pts</span>
                   <span>${Math.round((state.researchProgress / activeTech.costScience) * 100)}%</span>
                 </div>`
              : ""
            }
          </div>
        </div>
      </div>

      <div class="tech-tree-grid">
        <div class="tech-tier-col">
          <h4 class="text-muted font-mono" style="font-size:11px; text-transform:uppercase;">Tier 1 - Foundations</h4>
          <div id="tier-1-nodes" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>
        <div class="tech-tier-col">
          <h4 class="text-muted font-mono" style="font-size:11px; text-transform:uppercase;">Tier 2 - Advanced Traction</h4>
          <div id="tier-2-nodes" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>
        <div class="tech-tier-col">
          <h4 class="text-muted font-mono" style="font-size:11px; text-transform:uppercase;">Tier 3 - Semiconductor High-Voltage</h4>
          <div id="tier-3-nodes" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>
        <div class="tech-tier-col">
          <h4 class="text-muted font-mono" style="font-size:11px; text-transform:uppercase;">Tier 4 - Next-Gen Autonomous High-Speed</h4>
          <div id="tier-4-nodes" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>
      </div>
    `;

    // Budget slider
    const budgetBox = document.getElementById("res-budget-slider");
    const slider = UI.createSlider({
      min: 0,
      max: 50000,
      value: state.dailyResearchBudget,
      label: "Daily R&D Allocation ($)",
      unit: " /day",
      step: 2500,
      onInput: (v) => { state.dailyResearchBudget = v; }
    });
    budgetBox.appendChild(slider);

    // Populate Tiers
    [1, 2, 3, 4].forEach(tier => {
      const col = document.getElementById(`tier-${tier}-nodes`);
      const nodes = TECH_DATA.filter(t => t.tier === tier);

      nodes.forEach(tech => {
        const isResearched = state.unlockedTechs.has(tech.id);
        const isActive = state.activeResearchId === tech.id;
        const prereqsMet = tech.prereq.every(p => state.unlockedTechs.has(p));

        const card = document.createElement("div");
        card.className = `tech-node ${isResearched ? "researched" : ""} ${isActive ? "active-research" : ""}`;
        if (!prereqsMet && !isResearched) card.style.opacity = "0.5";

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-weight:700; font-size:12px;">${tech.name}</span>
            ${isResearched
              ? `<span class="c-badge badge-green">DONE</span>`
              : (isActive ? `<span class="c-badge badge-cyan">RESEARCHING</span>` : `<span class="c-badge badge-amber">${tech.costScience} PTS</span>`)
            }
          </div>
          <p class="text-muted" style="font-size:11px; line-height:1.3;">${tech.desc}</p>
        `;

        card.onclick = () => {
          if (isResearched) {
            UI.toast(`"${tech.name}" is already fully mastered and in production.`, "normal");
            return;
          }
          if (!prereqsMet) {
            UI.toast("Prerequisites locked: Complete prior tier techs first.", "danger");
            return;
          }
          state.activeResearchId = tech.id;
          state.researchProgress = 0;
          UI.toast(`Directorate assigned to: ${tech.name}`, "success");
          ResearchView.render(document.getElementById("viewport-root"));
        };

        col.appendChild(card);
      });
    });
  }
}