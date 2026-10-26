// Interactive Mindustry-Style Visual Research Tree Controller with Detailed Inspector
class ResearchView {
  static canvasInstance = null;
  static selectedNode = null;

  static render(container) {
    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);
    const progressPercent = activeTech && state.researchTotalDays > 0
      ? Math.round(((state.researchTotalDays - state.researchDaysLeft) / state.researchTotalDays) * 100)
      : 0;

    container.innerHTML = `
      <!-- Active R&D Project Banner -->
      <div class="c-card" style="margin-bottom:10px; padding:10px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Active Engineering Development:</span>
            <strong class="text-blue" style="font-size:13px; margin-left:6px;">
              ${activeTech ? `${activeTech.name} ($${activeTech.costMoney.toLocaleString()})` : "Directorate Idle"}
            </strong>
          </div>
          <span class="font-mono ${activeTech ? "text-positive" : "text-muted"}" style="font-size:12px;">
            ${activeTech ? `${state.researchDaysLeft} Days Remaining (${progressPercent}%)` : "No Project Active"}
          </span>
        </div>
        ${activeTech ? `
          <div class="tech-progress-bar" style="height:4px; margin-top:6px;">
            <div class="tech-progress-fill" style="width:${progressPercent}%;"></div>
          </div>
        ` : ""}
      </div>

      <!-- Mindustry Visual Tree Viewport Container -->
      <div class="visual-tree-container">
        <!-- Dedicated canvas viewport element -->
        <div class="tree-viewport" id="visual-tree-viewport"></div>

        <!-- Floating HUD Zoom & Center Controls -->
        <div class="tree-hud-controls">
          <button class="tree-hud-btn" id="hud-zoom-in" title="Zoom In">+</button>
          <button class="tree-hud-btn" id="hud-zoom-out" title="Zoom Out">&minus;</button>
          <button class="tree-hud-btn" id="hud-center-core" title="Center Core">Center Core</button>
        </div>

        <!-- Floating Node Inspector Side-Sheet -->
        <div class="tree-inspector-panel" id="tree-inspector"></div>
      </div>
    `;

    const viewportEl = container.querySelector("#visual-tree-viewport");
    this.canvasInstance = new TreeCanvas(viewportEl, (node) => this.inspectNode(node, container));

    // Bind HUD Controls
    container.querySelector("#hud-zoom-in").onclick = () => this.canvasInstance.zoomBy(1.2);
    container.querySelector("#hud-zoom-out").onclick = () => this.canvasInstance.zoomBy(0.8);
    container.querySelector("#hud-center-core").onclick = () => {
      this.canvasInstance.centerOnNode(TREE_STRUCTURE.core);
      this.inspectNode(TREE_STRUCTURE.core, container);
    };

    // Default inspection to active research node, previously selected node, or the central core
    const initialNode = activeTech || this.selectedNode || TREE_STRUCTURE.core;
    this.inspectNode(initialNode, container);
  }

  static inspectNode(node, container) {
    this.selectedNode = node;
    const inspector = container.querySelector("#tree-inspector");
    if (!inspector) return;

    if (this.canvasInstance) {
      this.canvasInstance.setSelectedNode(node.id);
    }

    const isResearched = state.unlockedTechs.has(node.id);
    const isActive = state.activeResearchId === node.id;
    const prereqsMet = !node.prereq || node.prereq.every(p => state.unlockedTechs.has(p));
    const isLocked = !prereqsMet && !isResearched;

    const prereqNames = (node.prereq || []).map(pId => {
      const pNode = TECH_DATA.find(n => n.id === pId);
      return pNode ? pNode.name : pId;
    });

    inspector.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div style="max-width:75%;">
          <h4 style="font-size:12px; font-weight:700; color:var(--text-main); line-height:1.35;">${node.name}</h4>
          <span class="text-blue" style="font-size:9px; text-transform:uppercase; font-weight:700;">Track: ${node.branch.toUpperCase()}</span>
        </div>
        <span class="c-badge ${isResearched ? "badge-green" : (isActive ? "badge-blue" : (isLocked ? "badge-amber" : "badge-blue"))}">
          ${isResearched ? "Mastered" : (isActive ? "Developing" : (isLocked ? "Locked" : "Available"))}
        </span>
      </div>

      <p class="text-muted" style="font-size:10px; line-height:1.4; margin-bottom:10px;">${node.desc}</p>

      <div style="background:var(--bg-panel); border:1px solid var(--border-subtle); padding:6px 10px; border-radius:var(--radius-xs); margin-bottom:10px; font-size:10px; display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; justify-content:space-between;">
          <span class="text-muted">Development Cost:</span>
          <strong class="font-mono text-warning">${node.costMoney > 0 ? `$${node.costMoney.toLocaleString()}` : "Zero (Core Baseline)"}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span class="text-muted">Engineering Duration:</span>
          <strong class="font-mono text-blue">${node.durationDays > 0 ? `${node.durationDays} Days` : "Zero Days"}</strong>
        </div>
        ${prereqNames.length > 0 ? `
          <div style="margin-top:2px; font-size:9px;">
            <span class="text-muted">Direct Prerequisite:</span>
            <span style="color:var(--text-main);">${prereqNames.join(", ")}</span>
          </div>
        ` : ""}
      </div>

      ${node.unlocks && node.unlocks.length > 0 ? `
        <div style="margin-bottom:10px;">
          <span class="text-muted" style="font-size:9px; text-transform:uppercase; font-weight:700;">Unlocked Component Blueprints:</span>
          <div style="display:flex; flex-wrap:wrap; gap:3px; margin-top:4px;">
            ${node.unlocks.map(uId => {
              const comp = state.findComponentById(uId);
              return `<span class="c-badge badge-blue" style="font-size:8px;">${comp ? comp.name : uId}</span>`;
            }).join("")}
          </div>
        </div>
      ` : ""}

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:8px;">
        <button class="c-btn btn-ghost btn-sm" id="btn-center-on-node" style="font-size:10px;">Focus on Map</button>
        ${!isResearched && !isLocked && !isActive ? `
          <button class="c-btn btn-primary btn-sm" id="btn-fund-inspected-node">
            Initiate R&amp;D ($${node.costMoney.toLocaleString()})
          </button>
        ` : (isResearched ? `<span class="text-positive font-mono" style="font-size:10px;">✓ Technology Developed</span>` : (isActive ? `<span class="text-blue font-mono" style="font-size:10px;">⚡ ${state.researchDaysLeft} Days Remaining</span>` : `<span class="text-negative" style="font-size:10px;">Locked: Complete Prerequisite</span>`))}
      </div>
    `;

    inspector.querySelector("#btn-center-on-node").onclick = () => {
      this.canvasInstance.centerOnNode(node);
    };

    const fundBtn = inspector.querySelector("#btn-fund-inspected-node");
    if (fundBtn) {
      fundBtn.onclick = () => {
        if (state.activeResearchId && state.activeResearchId !== node.id) {
          UI.toast(`Engineering Directorate Occupied: Current project must finish first (${state.researchDaysLeft} days left).`, "danger");
          return;
        }

        const res = state.startResearch(node.id);
        if (res.success) {
          SoundSystem.playClick();
          UI.toast(`R&D Project Started: ${node.name} funded ($${node.costMoney.toLocaleString()}). Completion in ${node.durationDays} days.`, "success");
          ResearchView.render(document.getElementById("viewport-root"));
        } else {
          UI.toast(res.reason, "danger");
        }
      };
    }
  }
}