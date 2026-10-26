// Interactive Pan-Zoom Mindustry-Style Visual Tech Tree Graph Canvas
class TreeCanvas {
  constructor(viewportEl, onNodeSelect) {
    this.viewport = viewportEl;
    this.onNodeSelect = onNodeSelect;
    this.surface = null;
    this.svgLayer = null;
    this.selectedNodeId = "tech_core";

    // Viewport coordinates
    this.panX = -500;
    this.panY = -450;
    this.scale = 0.85;

    this.init();
  }

  init() {
    this.viewport.innerHTML = "";

    this.surface = document.createElement("div");
    this.surface.className = "tree-canvas-surface";
    this.surface.style.width = "3400px";
    this.surface.style.height = "2600px";

    this.svgLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svgLayer.setAttribute("class", "tree-svg-layer");
    this.surface.appendChild(this.svgLayer);

    this.viewport.appendChild(this.surface);
    this.bindGestures();
    this.renderGraph();
    this.updateTransform();
  }

  bindGestures() {
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let initialPanX = 0;
    let initialPanY = 0;
    this.hasMoved = false;

    this.viewport.addEventListener("pointerdown", (e) => {
      // Ignore if clicking floating overlays
      if (e.target.closest(".tree-hud-controls") || e.target.closest(".tree-inspector-panel")) return;
      isDown = true;
      this.hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      initialPanX = this.panX;
      initialPanY = this.panY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Only engage panning drag if pointer moves past threshold
      if (Math.hypot(dx, dy) > 4) {
        this.hasMoved = true;
        this.panX = initialPanX + dx;
        this.panY = initialPanY + dy;
        this.updateTransform();
        this.viewport.style.cursor = "grabbing";
      }
    });

    const stopGesture = () => {
      if (!isDown) return;
      isDown = false;
      this.viewport.style.cursor = "grab";
    };
    window.addEventListener("pointerup", stopGesture);
    window.addEventListener("pointercancel", stopGesture);

    // Zoom anchored directly to the mouse cursor position
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

  selectNode(node) {
    if (!node) return;
    this.selectedNodeId = node.id;
    this.surface.querySelectorAll(".tree-node-glyph").forEach(el => {
      el.classList.toggle("is-selected", el.getAttribute("data-id") === node.id);
    });
    if (this.onNodeSelect) {
      this.onNodeSelect(node);
    }
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

  renderGraph() {
    this.svgLayer.innerHTML = "";
    this.surface.querySelectorAll(".tree-node-glyph").forEach(el => el.remove());

    const allNodes = TECH_DATA;
    const nodeMap = new Map();
    allNodes.forEach(n => nodeMap.set(n.id, n));

    // 1. Draw Orthogonal Circuit Paths (Connecting Parent to Child)
    allNodes.forEach(node => {
      if (!node.prereq || node.prereq.length === 0) return;

      node.prereq.forEach(parentId => {
        const parent = nodeMap.get(parentId);
        if (!parent) return;

        const isParentResearched = state.unlockedTechs.has(parent.id);
        const isChildResearched = state.unlockedTechs.has(node.id);
        const isChildActive = state.activeResearchId === node.id;

        let statusClass = "link-locked";
        if (isChildResearched) statusClass = "link-researched";
        else if (isParentResearched && isChildActive) statusClass = "link-active";
        else if (isParentResearched) statusClass = "link-active";

        const pathData = this.getOrthogonalCircuitPath(parent.x, parent.y, node.x, node.y);
        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", pathData);
        pathEl.setAttribute("class", `tree-link-path ${statusClass}`);
        this.svgLayer.appendChild(pathEl);
      });
    });

    // 2. Render Square Mindustry Nodes with Interactive Selection
    allNodes.forEach(node => {
      const isResearched = state.unlockedTechs.has(node.id);
      const isActive = state.activeResearchId === node.id;
      const prereqsMet = !node.prereq || node.prereq.every(p => state.unlockedTechs.has(p));
      const isLocked = !prereqsMet && !isResearched;
      const isCore = node.id === "tech_core";
      const isSelected = this.selectedNodeId === node.id;

      let stateClass = "state-locked";
      if (isResearched) stateClass = "state-researched";
      else if (isActive) stateClass = "state-active";
      else if (prereqsMet) stateClass = "state-available";

      const glyph = document.createElement("div");
      glyph.className = `tree-node-glyph ${stateClass} ${isCore ? "is-core" : ""} ${isSelected ? "is-selected" : ""}`;
      glyph.setAttribute("data-id", node.id);
      glyph.style.left = `${node.x}px`;
      glyph.style.top = `${node.y}px`;

      glyph.innerHTML = `
        <span style="font-size:${isCore ? "22px" : "18px"}; pointer-events:none;">
          ${isCore ? "⬢" : (isResearched ? "✓" : (isActive ? "⚡" : (isLocked ? "🔒" : "◈")))}
        </span>
        <span class="tree-node-label">${node.name.length > 20 ? node.name.substring(0, 18) + "…" : node.name}</span>
      `;

      // Reliable click & tap selection
      glyph.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.hasMoved) return;
        this.selectNode(node);
      });

      glyph.addEventListener("pointerup", (e) => {
        if (this.hasMoved) return;
        e.stopPropagation();
        this.selectNode(node);
      });

      this.surface.appendChild(glyph);
    });
  }

  getOrthogonalCircuitPath(x1, y1, x2, y2) {
    if (Math.abs(x1 - x2) < 4) return `M ${x1} ${y1} L ${x2} ${y2}`;
    if (Math.abs(y1 - y2) < 4) return `M ${x1} ${y1} L ${x2} ${y2}`;
    const midY = y1 + (y2 - y1) * 0.5;
    return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
  }
}