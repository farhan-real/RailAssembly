// Interactive Mindustry-Style Visual Research Tree Controller with Inspector Panel
class ResearchView {
  static canvasInstance = null;
  static selectedNode = null;
  static isInspectorCollapsed = false;

  static render(container) {
    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);
    const progressPercent = activeTech && state.researchTotalDays > 0
      ? Math.round(((state.researchTotalDays - state.researchDaysLeft) / state.researchTotalDays) * 100)
      : 0;

    container.innerHTML = `
      <div class="c-card" style="margin-bottom:10px; padding:10px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Research Tree Progress:</span>
            <strong class="text-blue" style="font-size:13px; margin-left:6px;">
              ${activeTech ? `${activeTech.name} ($${activeTech.costMoney.toLocaleString()})` : "Research Tree Idle"}
            </strong>
          </div>
          <span class="font-mono ${activeTech ? "text-positive" : "text-muted"}" id="tree-active-progress" style="font-size:12px;">
            ${activeTech ? `${state.researchDaysLeft} Days Remaining (${progressPercent}%)` : "No Active Project"}
          </span>
        </div>
        ${activeTech ? `
          <div class="tech-progress-bar" style="height:4px; margin-top:6px;">
            <div class="tech-progress-fill" id="tree-active-bar" style="width:${progressPercent}%;"></div>
          </div>
        ` : ""}
      </div>

      <div class="visual-tree-container">
        <div class="tree-viewport" id="visual-tree-viewport"></div>

        <div class="tree-hud-controls">
          <button class="tree-hud-btn" id="hud-zoom-in" title="Zoom In">+</button>
          <button class="tree-hud-btn" id="hud-zoom-out" title="Zoom Out">&minus;</button>
          <button class="tree-hud-btn" id="hud-center-core" title="Center Core">Center Core</button>
        </div>

        <div class="tree-inspector-panel ${this.isInspectorCollapsed ? "is-collapsed" : ""}" id="tree-inspector"></div>
        <button class="tree-inspector-toggle-btn ${this.isInspectorCollapsed ? "" : "hidden"}" id="btn-show-inspector">Inspect Node</button>
      </div>
    `;

    const viewportEl = container.querySelector("#visual-tree-viewport");
    this.canvasInstance = new TreeCanvas(viewportEl, (node) => {
      this.isInspectorCollapsed = false;
      this.inspectNode(node, container);
    });

    container.querySelector("#hud-zoom-in").onclick = () => this.canvasInstance.zoomBy(1.2);
    container.querySelector("#hud-zoom-out").onclick = () => this.canvasInstance.zoomBy(0.8);
    container.querySelector("#hud-center-core").onclick = () => {
      this.canvasInstance.centerOnNode(TREE_STRUCTURE.core);
      this.inspectNode(TREE_STRUCTURE.core, container);
    };

    container.querySelector("#btn-show-inspector").onclick = () => {
      this.isInspectorCollapsed = false;
      const targetNode = this.selectedNode || TREE_STRUCTURE.core;
      this.inspectNode(targetNode, container);
    };

    this.bindPanelEvents(container);

    const initialNode = activeTech || this.selectedNode || TREE_STRUCTURE.core;
    this.inspectNode(initialNode, container);
  }

  static bindPanelEvents(container) {
    const inspector = container.querySelector("#tree-inspector");
    if (!inspector) return;
    const stopProp = (e) => e.stopPropagation();
    inspector.addEventListener("pointerdown", stopProp);
    inspector.addEventListener("wheel", stopProp, { passive: true });
  }

  static inspectNode(node, container) {
    this.selectedNode = node;
    const inspector = container.querySelector("#tree-inspector");
    const toggleBtn = container.querySelector("#btn-show-inspector");
    if (!inspector) return;

    if (this.canvasInstance) {
      this.canvasInstance.setSelectedNode(node.id);
    }

    if (this.isInspectorCollapsed) {
      inspector.classList.add("is-collapsed");
      if (toggleBtn) toggleBtn.classList.remove("hidden");
      return;
    } else {
      inspector.classList.remove("is-collapsed");
      if (toggleBtn) toggleBtn.classList.add("hidden");
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
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="c-badge ${isResearched ? "badge-green" : (isActive ? "badge-blue" : (isLocked ? "badge-amber" : "badge-blue"))}">
            ${isResearched ? "Mastered" : (isActive ? "Developing" : (isLocked ? "Locked" : "Available"))}
          </span>
          <button class="c-btn btn-ghost btn-sm" id="btn-close-inspector" style="padding:2px 6px;">✕</button>
        </div>
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
            <span class="text-muted">Prerequisites:</span>
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

    inspector.querySelector("#btn-close-inspector").onclick = () => {
      this.isInspectorCollapsed = true;
      inspector.classList.add("is-collapsed");
      if (toggleBtn) toggleBtn.classList.remove("hidden");
    };

    inspector.querySelector("#btn-center-on-node").onclick = () => {
      this.canvasInstance.centerOnNode(node);
    };

    const fundBtn = inspector.querySelector("#btn-fund-inspected-node");
    if (fundBtn) {
      fundBtn.onclick = () => {
        if (state.activeResearchId && state.activeResearchId !== node.id) {
          UI.toast(`Research Tree Occupied: Current project must finish first (${state.researchDaysLeft} days left).`, "danger");
          return;
        }

        const res = state.startResearch(node.id);
        if (res.success) {
          SoundSystem.playClick();
          UI.toast(`Research Tree: ${node.name} funded ($${node.costMoney.toLocaleString()}). Completion in ${node.durationDays} days.`, "success");
          ResearchView.render(document.getElementById("viewport-root"));
        } else {
          UI.toast(res.reason, "danger");
        }
      };
    }
  }
}