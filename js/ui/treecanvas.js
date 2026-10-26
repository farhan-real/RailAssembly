// Interactive Pan-Zoom Visual Research Tree with Smooth Bezier Connectors & Directional Arrows
class TreeCanvas {
  constructor(viewportEl, onNodeSelect) {
    this.viewport = viewportEl;
    this.onNodeSelect = onNodeSelect;
    this.surface = null;
    this.svgLayer = null;
    this.selectedNodeId = "tech_core";

    this.panX = -500;
    this.panY = -450;
    this.scale = 0.85;

    this.init();
  }

  init() {
    this.viewport.innerHTML = "";

    this.surface = document.createElement("div");
    this.surface.className = "tree-canvas-surface";

    this.svgLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svgLayer.setAttribute("class", "tree-svg-layer");
    this.svgLayer.appendChild(this.createArrowDefs());
    this.surface.appendChild(this.svgLayer);

    this.viewport.appendChild(this.surface);
    this.renderTrackBanners();
    this.bindGestures();
    this.renderGraph();
    this.updateTransform();
  }

  createArrowDefs() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const colors = [
      { id: "arrow-locked", fill: "#1e293d" },
      { id: "arrow-active", fill: "#3b82f6" },
      { id: "arrow-researched", fill: "#10b981" },
      { id: "arrow-prereq", fill: "#60a5fa" },
      { id: "arrow-unlock", fill: "#f59e0b" }
    ];

    colors.forEach(c => {
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", c.id);
      marker.setAttribute("viewBox", "0 0 10 10");
      marker.setAttribute("refX", "26");
      marker.setAttribute("refY", "5");
      marker.setAttribute("markerWidth", "5");
      marker.setAttribute("markerHeight", "5");
      marker.setAttribute("orient", "auto");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M 0 1 L 9 5 L 0 9 z");
      path.setAttribute("fill", c.fill);
      marker.appendChild(path);
      defs.appendChild(marker);
    });

    return defs;
  }

  renderTrackBanners() {
    const banners = [
      { text: "Track 1: Aerodynamics & Nose Cones", x: 1400, y: 160 },
      { text: "Track 2: Power Electronics & Converters", x: 740, y: 20 },
      { text: "Track 3: High-RPM Traction Motors & Rotors", x: 2160, y: 780 },
      { text: "Track 4: Bogies, Transmissions & Brakes", x: 2160, y: 1720 },
      { text: "Track 5: Pantographs & Power Collection", x: 1400, y: 2240 },
      { text: "Track 6: Automation, Safety & TCMS", x: 740, y: 1720 }
    ];

    banners.forEach(b => {
      const el = document.createElement("div");
      el.className = "tree-track-banner";
      el.style.left = `${b.x}px`;
      el.style.top = `${b.y}px`;
      el.textContent = b.text;
      this.surface.appendChild(el);
    });
  }

  bindGestures() {
    let isDown = false;
    let didDrag = false;
    let startX = 0;
    let startY = 0;
    let initialPanX = 0;
    let initialPanY = 0;
    let pendingNode = null;

    this.viewport.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".tree-hud-controls") || e.target.closest(".tree-inspector-panel") || e.target.closest(".tree-inspector-toggle-btn")) return;
      isDown = true;
      didDrag = false;
      startX = e.clientX;
      startY = e.clientY;
      initialPanX = this.panX;
      initialPanY = this.panY;

      const glyph = e.target.closest(".tree-node-glyph");
      pendingNode = glyph ? (TECH_DATA.find(n => n.id === glyph.getAttribute("data-id")) || null) : null;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!didDrag && Math.hypot(dx, dy) > 5) {
        didDrag = true;
        this.viewport.style.cursor = "grabbing";
      }

      if (didDrag) {
        this.panX = initialPanX + dx;
        this.panY = initialPanY + dy;
        this.updateTransform();
      }
    });

    const endPointer = () => {
      if (!isDown) return;
      isDown = false;
      this.viewport.style.cursor = "grab";

      if (!didDrag && pendingNode) {
        this.selectNode(pendingNode);
      }
      pendingNode = null;
      didDrag = false;
    };

    window.addEventListener("pointerup", endPointer, true);
    window.addEventListener("pointercancel", endPointer, true);

    this.viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = this.viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - this.panX) / this.scale;
      const worldY = (mouseY - this.panY) / this.scale;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newScale = Math.min(2.0, Math.max(0.35, this.scale * zoomFactor));

      this.panX = mouseX - worldX * newScale;
      this.panY = mouseY - worldY * newScale;
      this.scale = newScale;

      this.updateTransform();
    }, { passive: false });
  }

  updateTransform() {
    if (this.surface) {
      this.surface.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }
  }

  centerOnNode(node) {
    if (!node) return;
    const viewW = this.viewport.clientWidth || 800;
    const viewH = this.viewport.clientHeight || 600;
    this.scale = 0.9;
    this.panX = (viewW / 2) - (node.x * this.scale);
    this.panY = (viewH / 2) - (node.y * this.scale);
    this.updateTransform();
  }

  setSelectedNode(nodeId) {
    this.selectedNodeId = nodeId;
    if (!this.surface) return;
    this.surface.querySelectorAll(".tree-node-glyph").forEach(el => {
      el.classList.toggle("is-selected", el.getAttribute("data-id") === nodeId);
    });
    this.highlightDependencies(nodeId);
  }

  selectNode(node) {
    if (!node) return;
    this.setSelectedNode(node.id);
    if (this.onNodeSelect) {
      this.onNodeSelect(node);
    }
  }

  highlightDependencies(nodeId) {
    if (!this.svgLayer) return;
    this.svgLayer.querySelectorAll(".tree-link-path").forEach(path => {
      path.classList.remove("link-dependency-in", "link-dependency-out");
      const parentId = path.getAttribute("data-parent");
      const childId = path.getAttribute("data-child");

      if (childId === nodeId) {
        path.classList.add("link-dependency-in");
        path.setAttribute("marker-end", "url(#arrow-prereq)");
      } else if (parentId === nodeId) {
        path.classList.add("link-dependency-out");
        path.setAttribute("marker-end", "url(#arrow-unlock)");
      } else {
        const markerType = path.getAttribute("data-base-marker") || "arrow-locked";
        path.setAttribute("marker-end", `url(#${markerType})`);
      }
    });
  }

  zoomBy(factor) {
    const rect = this.viewport.getBoundingClientRect();
    const centerX = (rect.width || 800) / 2;
    const centerY = (rect.height || 600) / 2;
    const worldX = (centerX - this.panX) / this.scale;
    const worldY = (centerY - this.panY) / this.scale;

    const newScale = Math.min(2.0, Math.max(0.35, this.scale * factor));
    this.panX = centerX - worldX * newScale;
    this.panY = centerY - worldY * newScale;
    this.scale = newScale;
    this.updateTransform();
  }

  updateNodeStates() {
    if (!this.surface || !this.svgLayer) return;
    const progressPercent = state.activeResearchId && state.researchTotalDays > 0
      ? Math.round(((state.researchTotalDays - state.researchDaysLeft) / state.researchTotalDays) * 100) : 0;

    TECH_DATA.forEach(node => {
      const glyph = this.surface.querySelector(`.tree-node-glyph[data-id="${node.id}"]`);
      if (!glyph) return;

      const isResearched = state.unlockedTechs.has(node.id);
      const isActive = state.activeResearchId === node.id;
      const prereqsMet = !node.prereq || node.prereq.every(p => state.unlockedTechs.has(p));
      const isLocked = !prereqsMet && !isResearched;
      const isCore = node.id === "tech_core";
      const isSelected = this.selectedNodeId === node.id;

      glyph.className = `tree-node-glyph ${isCore ? "is-core" : ""} ${isSelected ? "is-selected" : ""} ${
        isResearched ? "state-researched" : (isActive ? "state-active" : (prereqsMet ? "state-available" : "state-locked"))
      }`;

      const iconSpan = glyph.querySelector(".tree-glyph-icon");
      if (iconSpan) iconSpan.textContent = isCore ? "⬢" : (isResearched ? "✓" : (isActive ? "⚡" : (isLocked ? "🔒" : "◈")));

      let miniBar = glyph.querySelector(".tree-node-mini-bar");
      if (isActive) {
        if (!miniBar) {
          miniBar = document.createElement("div");
          miniBar.className = "tree-node-mini-bar";
          miniBar.innerHTML = `<div class="tree-node-mini-bar-fill"></div>`;
          glyph.appendChild(miniBar);
        }
        const fill = miniBar.querySelector(".tree-node-mini-bar-fill");
        if (fill) fill.style.width = `${progressPercent}%`;
      } else if (miniBar) {
        miniBar.remove();
      }
    });

    this.highlightDependencies(this.selectedNodeId);
  }

  renderGraph() {
    this.surface.querySelectorAll(".tree-node-glyph").forEach(el => el.remove());
    this.svgLayer.querySelectorAll(".tree-link-path").forEach(el => el.remove());

    const nodeMap = new Map();
    TECH_DATA.forEach(n => nodeMap.set(n.id, n));

    TECH_DATA.forEach(node => {
      if (!node.prereq || node.prereq.length === 0) return;

      node.prereq.forEach(parentId => {
        const parent = nodeMap.get(parentId);
        if (!parent) return;

        const isParentResearched = state.unlockedTechs.has(parent.id);
        const isChildResearched = state.unlockedTechs.has(node.id);
        const isChildActive = state.activeResearchId === node.id;

        let statusClass = "link-locked";
        let markerId = "arrow-locked";
        if (isChildResearched) { statusClass = "link-researched"; markerId = "arrow-researched"; }
        else if (isParentResearched) { statusClass = "link-active"; markerId = "arrow-active"; }

        const pathData = this.getSmoothCurvePath(parent.x, parent.y, node.x, node.y);
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", pathData);
        pathEl.setAttribute("class", `tree-link-path ${statusClass}`);
        pathEl.setAttribute("data-parent", parent.id);
        pathEl.setAttribute("data-child", node.id);
        pathEl.setAttribute("data-base-marker", markerId);
        pathEl.setAttribute("marker-end", `url(#${markerId})`);
        this.svgLayer.appendChild(pathEl);
      });
    });

    TECH_DATA.forEach(node => {
      const isResearched = state.unlockedTechs.has(node.id);
      const isActive = state.activeResearchId === node.id;
      const prereqsMet = !node.prereq || node.prereq.every(p => state.unlockedTechs.has(p));
      const isLocked = !prereqsMet && !isResearched;
      const isCore = node.id === "tech_core";
      const isSelected = this.selectedNodeId === node.id;

      const glyph = document.createElement("div");
      glyph.className = `tree-node-glyph ${isResearched ? "state-researched" : (isActive ? "state-active" : (prereqsMet ? "state-available" : "state-locked"))} ${isCore ? "is-core" : ""} ${isSelected ? "is-selected" : ""}`;
      glyph.setAttribute("data-id", node.id);
      glyph.style.left = `${node.x}px`;
      glyph.style.top = `${node.y}px`;

      glyph.innerHTML = `
        <span class="tree-glyph-icon" style="font-size:${isCore ? "22px" : "18px"}; pointer-events:none;">
          ${isCore ? "⬢" : (isResearched ? "✓" : (isActive ? "⚡" : (isLocked ? "🔒" : "◈")))}
        </span>
        <span class="tree-node-label">${node.name.length > 22 ? node.name.substring(0, 20) + "…" : node.name}</span>
      `;

      this.surface.appendChild(glyph);
    });

    this.highlightDependencies(this.selectedNodeId);
  }

  getSmoothCurvePath(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const cx = x1 + dx * 0.5;
      return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    } else {
      const cy = y1 + dy * 0.5;
      return `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
    }
  }
}