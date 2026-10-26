// Interactive Visual Research Tree Controller with High-Visibility Dependency Guides
class ResearchView {
  static canvasInstance = null;
  static selectedNode = null;
  static isInspectorCollapsed = false;

  static render(container) {
    container.innerHTML = `
      <div class="c-card" id="tree-active-banner" style="margin-bottom:10px; padding:10px 14px;"></div>

      <div class="visual-tree-container">
        <div class="tree-viewport" id="visual-tree-viewport"></div>

        <div class="tree-hud-controls">
          <button class="tree-hud-btn" id="hud-zoom-in" title="Zoom In">+</button>
          <button class="tree-hud-btn" id="hud-zoom-out" title="Zoom Out">&minus;</button>
          <button class="tree-hud-btn" id="hud-center-core">Core</button>
          <button class="tree-hud-btn" data-track="aerodynamics">Aero</button>
          <button class="tree-hud-btn" data-track="electronics">Power</button>
          <button class="tree-hud-btn" data-track="motors">Motors</button>
          <button class="tree-hud-btn" data-track="running_gear">Bogies</button>
          <button class="tree-hud-btn" data-track="power_collection">Panto</button>
          <button class="tree-hud-btn" data-track="automation">TCMS</button>
        </div>

        <div class="tree-inspector-panel ${this.isInspectorCollapsed ? "is-collapsed" : ""}" id="tree-inspector"></div>
        <button class="tree-inspector-toggle-btn ${this.isInspectorCollapsed ? "" : "hidden"}" id="btn-show-inspector">Inspect Node</button>
      </div>
    `;

    this.updateBanner();

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

    container.querySelectorAll("[data-track]").forEach(btn => {
      btn.onclick = () => {
        const trackKey = btn.getAttribute("data-track");
        const branchDef = TREE_STRUCTURE.branches.find(b => b.key === trackKey);
        if (branchDef && branchDef.target) {
          this.canvasInstance.centerOnNode(branchDef.target);
        }
      };
    });

    container.querySelector("#btn-show-inspector").onclick = () => {
      this.isInspectorCollapsed = false;
      const targetNode = this.selectedNode || TREE_STRUCTURE.core;
      this.inspectNode(targetNode, container);
    };

    this.bindPanelEvents(container);

    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);
    const initialNode = activeTech || this.selectedNode || TREE_STRUCTURE.core;
    this.inspectNode(initialNode, container);
  }

  static updateBanner() {
    const banner = document.getElementById("tree-active-banner");
    if (!banner) return;

    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);
    const progressPercent = activeTech && state.researchTotalDays > 0
      ? Math.round(((state.researchTotalDays - state.researchDaysLeft) / state.researchTotalDays) * 100) : 0;

    banner.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Research Tree Progress:</span>
          <strong class="text-blue" id="tree-active-title" style="font-size:13px; margin-left:6px;">
            ${activeTech ? `${activeTech.name} ($${activeTech.costMoney.toLocaleString()})` : "Research Tree Idle"}
          </strong>
        </div>
        <span class="font-mono ${activeTech ? "text-positive" : "text-muted"}" id="tree-active-progress" style="font-size:12px;">
          ${activeTech ? `${state.researchDaysLeft} Days Remaining (${progressPercent}%)` : "No Active Project"}
        </span>
      </div>
      ${activeTech ? `
        <div class="tech-progress-bar" id="tree-active-bar-wrap" style="height:4px; margin-top:6px;">
          <div class="tech-progress-fill" id="tree-active-bar" style="width:${progressPercent}%;"></div>
        </div>
      ` : ""}
    `;
  }

  static updateLiveProgress() {
    const banner = document.getElementById("tree-active-banner");
    if (!banner) return;

    const activeTech = TECH_DATA.find(t => t.id === state.activeResearchId);
    const progressPercent = activeTech && state.researchTotalDays > 0
      ? Math.round(((state.researchTotalDays - state.researchDaysLeft) / state.researchTotalDays) * 100) : 0;

    const titleEl = document.getElementById("tree-active-title");
    const progressEl = document.getElementById("tree-active-progress");
    const barEl = document.getElementById("tree-active-bar");

    if (activeTech) {
      if (!barEl) this.updateBanner();
      else {
        if (titleEl) titleEl.textContent = `${activeTech.name} ($${activeTech.costMoney.toLocaleString()})`;
        if (progressEl) {
          progressEl.textContent = `${state.researchDaysLeft} Days Remaining (${progressPercent}%)`;
          progressEl.className = "font-mono text-positive";
        }
        barEl.style.width = `${progressPercent}%`;
      }
    } else {
      if (barEl) this.updateBanner();
      else {
        if (titleEl) titleEl.textContent = "Research Tree Idle";
        if (progressEl) {
          progressEl.textContent = "No Active Project";
          progressEl.className = "font-mono text-muted";
        }
      }
    }

    if (this.canvasInstance) this.canvasInstance.updateNodeStates();

    if (this.selectedNode && document.getElementById("tree-inspector")) {
      const liveBtn = document.getElementById("btn-fund-inspected-node");
      if (liveBtn && state.activeResearchId === this.selectedNode.id) {
        liveBtn.innerHTML = `⚡ ${state.researchDaysLeft} Days Remaining (${progressPercent}%)`;
      }
    }
  }

  static onTechUnlocked() {
    this.updateBanner();
    if (this.canvasInstance) this.canvasInstance.updateNodeStates();
    const container = document.getElementById("viewport-root");
    if (container && this.selectedNode) this.inspectNode(this.selectedNode, container);
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

    if (this.canvasInstance) this.canvasInstance.setSelectedNode(node.id);

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

    const prereqNodes = (node.prereq || []).map(pId => TECH_DATA.find(n => n.id === pId)).filter(Boolean);
    const childNodes = TECH_DATA.filter(n => n.prereq && n.prereq.includes(node.id));

    const progressPercent = isActive && state.researchTotalDays > 0
      ? Math.round(((state.researchTotalDays - state.researchDaysLeft) / state.researchTotalDays) * 100) : 0;

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

      <p class="text-muted" style="font-size:10px; line-height:1.4; margin-bottom:8px;">${node.desc}</p>

      <div style="background:var(--bg-panel); border:1px solid var(--border-subtle); padding:6px 10px; border-radius:var(--radius-xs); margin-bottom:8px; font-size:10px; display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; justify-content:space-between;">
          <span class="text-muted">Development Capital:</span>
          <strong class="font-mono text-warning">${node.costMoney > 0 ? `$${node.costMoney.toLocaleString()}` : "Zero (Core Baseline)"}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span class="text-muted">Engineering Duration:</span>
          <strong class="font-mono text-blue">${node.durationDays > 0 ? `${node.durationDays} Days` : "Zero Days"}</strong>
        </div>
      </div>

      ${prereqNodes.length > 0 ? `
        <div style="margin-bottom:8px;">
          <span class="text-muted" style="font-size:9px; text-transform:uppercase; font-weight:700;">Direct Prerequisites (Incoming Flow):</span>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:3px;">
            ${prereqNodes.map(p => {
              const pRes = state.unlockedTechs.has(p.id);
              return `<button class="c-btn ${pRes ? "btn-ghost" : "btn-primary"} btn-sm btn-jump-node" data-jump="${p.id}" style="font-size:9.5px; padding:2px 6px;">${pRes ? "✓" : "🔒"} ${p.name.substring(0, 24)}…</button>`;
            }).join("")}
          </div>
        </div>
      ` : ""}

      ${childNodes.length > 0 ? `
        <div style="margin-bottom:8px;">
          <span class="text-muted" style="font-size:9px; text-transform:uppercase; font-weight:700;">Unlocks Next In Branch (Outgoing Flow):</span>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:3px;">
            ${childNodes.map(c => `
              <button class="c-btn btn-ghost btn-sm btn-jump-node" data-jump="${c.id}" style="font-size:9.5px; padding:2px 6px;">&rarr; ${c.name.substring(0, 24)}…</button>
            `).join("")}
          </div>
        </div>
      ` : ""}

      ${node.unlocks && node.unlocks.length > 0 ? `
        <div style="margin-bottom:8px;">
          <span class="text-muted" style="font-size:9px; text-transform:uppercase; font-weight:700;">Component Blueprints Unlocked:</span>
          <div style="display:flex; flex-wrap:wrap; gap:3px; margin-top:3px;">
            ${node.unlocks.map(uId => {
              const comp = state.findComponentById(uId) || state.findSubcomponentOrMod(uId);
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
        ` : (isResearched ? `<span class="text-positive font-mono" style="font-size:10px;">✓ Technology Developed</span>` : (isActive ? `<button class="c-btn btn-primary btn-sm" id="btn-fund-inspected-node" disabled style="opacity:0.85;">⚡ ${state.researchDaysLeft} Days Remaining (${progressPercent}%)</button>` : `<span class="text-negative" style="font-size:10px;">Locked: Complete Prerequisite</span>`))}
      </div>
    `;

    inspector.querySelector("#btn-close-inspector").onclick = () => {
      this.isInspectorCollapsed = true;
      inspector.classList.add("is-collapsed");
      if (toggleBtn) toggleBtn.classList.remove("hidden");
    };

    inspector.querySelector("#btn-center-on-node").onclick = () => this.canvasInstance.centerOnNode(node);

    inspector.querySelectorAll(".btn-jump-node").forEach(btn => {
      btn.onclick = () => {
        const targetId = btn.getAttribute("data-jump");
        const targetNode = TECH_DATA.find(n => n.id === targetId);
        if (targetNode) {
          this.canvasInstance.centerOnNode(targetNode);
          this.inspectNode(targetNode, container);
        }
      };
    });

    const fundBtn = inspector.querySelector("#btn-fund-inspected-node");
    if (fundBtn && !isActive) {
      fundBtn.onclick = () => {
        if (state.activeResearchId && state.activeResearchId !== node.id) {
          UI.toast(`Research Directorate Busy: Current project must finish first (${state.researchDaysLeft} days left).`, "danger");
          return;
        }

        const res = state.startResearch(node.id);
        if (res.success) {
          SoundSystem.playClick();
          UI.toast(`Research Tree: ${node.name} funded ($${node.costMoney.toLocaleString()}). Completion in ${node.durationDays} days.`, "success");
          this.updateBanner();
          this.inspectNode(node, container);
          if (this.canvasInstance) this.canvasInstance.updateNodeStates();
        } else {
          UI.toast(res.reason, "danger");
        }
      };
    }
  }
}