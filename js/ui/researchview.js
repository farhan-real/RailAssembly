// Interactive Research and Development Directorate
class ResearchView {
  static render(container) {
    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);

    container.innerHTML = `
      <div class="c-card" style="margin-bottom:14px;">
        <div class="card-header">
          <span class="card-title">R&amp;D Directorate &bull; Capital Allocation</span>
          <span class="c-badge badge-blue">Accumulated Research: ${state.sciencePoints} Research Points</span>
        </div>
        <div class="view-grid-two">
          <div id="res-budget-slider"></div>
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Active Research Node</span>
            <div class="font-mono text-blue" style="font-size:14px; margin:2px 0;">
              ${activeTech ? activeTech.name : "No Project Active (Directorate Idle)"}
            </div>
            ${activeTech 
              ? `<div class="tech-progress-bar">
                   <div class="tech-progress-fill" style="width:${Math.round((state.researchProgress / activeTech.costScience) * 100)}%;"></div>
                 </div>
                 <div style="display:flex; justify-content:space-between; font-size:10px; margin-top:3px;" class="text-muted font-mono">
                   <span>${state.researchProgress} / ${activeTech.costScience} Research Points</span>
                   <span>${Math.round((state.researchProgress / activeTech.costScience) * 100)}%</span>
                 </div>`
              : ""
            }
          </div>
        </div>
      </div>

      <div class="tech-tree-grid">
        <div class="tech-tier-col">
          <span class="text-muted" style="font-size:10px; font-weight:700; text-transform:uppercase;">Tier 1 Foundations</span>
          <div id="tier-1-nodes" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>
        <div class="tech-tier-col">
          <span class="text-muted" style="font-size:10px; font-weight:700; text-transform:uppercase;">Tier 2 Advanced Traction</span>
          <div id="tier-2-nodes" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>
        <div class="tech-tier-col">
          <span class="text-muted" style="font-size:10px; font-weight:700; text-transform:uppercase;">Tier 3 Semiconductors</span>
          <div id="tier-3-nodes" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>
        <div class="tech-tier-col">
          <span class="text-muted" style="font-size:10px; font-weight:700; text-transform:uppercase;">Tier 4 Autonomous Systems</span>
          <div id="tier-4-nodes" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>
      </div>
    `;

    const budgetBox = document.getElementById("res-budget-slider");
    const slider = UI.createSlider({
      min: 0,
      max: 50000,
      value: state.dailyResearchBudget,
      label: "Daily Research Investment ($)",
      unit: " per Day",
      step: 2500,
      onInput: (v) => { state.dailyResearchBudget = v; }
    });
    budgetBox.appendChild(slider);

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
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
            <span style="font-weight:600; font-size:11px;">${tech.name}</span>
            ${isResearched
              ? `<span class="c-badge badge-green">Operational</span>`
              : (isActive ? `<span class="c-badge badge-blue">Active Project</span>` : `<span class="c-badge badge-amber">${tech.costScience} Research Points</span>`)
            }
          </div>
          <p class="text-muted" style="font-size:10px; line-height:1.3;">${tech.desc}</p>
        `;

        card.onclick = () => {
          if (isResearched) {
            UI.toast(`"${tech.name}" is already fully mastered for production.`, "normal");
            return;
          }
          if (!prereqsMet) {
            UI.toast("Prerequisites Incomplete: Prior tier research must be completed first.", "danger");
            return;
          }
          state.activeResearchId = tech.id;
          state.researchProgress = 0;
          UI.toast(`Directorate Commissioned: Active project set to ${tech.name}`, "success");
          ResearchView.render(document.getElementById("viewport-root"));
        };

        col.appendChild(card);
      });
    });
  }
}