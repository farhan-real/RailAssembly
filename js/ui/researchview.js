// Mindustry-Style Single-Source Branching Research Tree Interface (Time & Money Driven)
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

    const progressPercent = activeTech && state.researchTotalDays > 0
      ? Math.round(((state.researchTotalDays - state.researchDaysLeft) / state.researchTotalDays) * 100)
      : 0;

    container.innerHTML = `
      <!-- Active R&D Project Status Banner -->
      <div class="c-card" style="margin-bottom:12px;">
        <div class="card-header">
          <span class="card-title">Research &amp; Development Directorate</span>
          <span class="c-badge ${activeTech ? "badge-blue" : "badge-amber"}">
            ${activeTech ? "Engineering Development Active" : "Directorate Idle"}
          </span>
        </div>

        <div style="background:var(--bg-surface); padding:10px 14px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
          ${activeTech ? `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <div>
                <strong class="text-blue" style="font-size:13px;">${activeTech.name}</strong>
                <span class="text-muted" style="font-size:10px; margin-left:8px;">Initial Capital Investment: $${activeTech.costMoney.toLocaleString()}</span>
              </div>
              <span class="font-mono text-positive" style="font-size:12px;">${state.researchDaysLeft} Days Remaining</span>
            </div>

            <div class="tech-progress-bar" style="height:6px; margin-bottom:4px;">
              <div class="tech-progress-fill" style="width:${progressPercent}%;"></div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:10px;" class="text-muted font-mono">
              <span>Timeline: ${state.researchTotalDays - state.researchDaysLeft} / ${state.researchTotalDays} Days Elapsed</span>
              <span>${progressPercent}% Complete</span>
            </div>
          ` : `
            <div style="text-align:center; padding:10px 0;">
              <div class="text-muted" style="font-size:12px; margin-bottom:4px;">No engineering development project is currently active.</div>
              <span class="text-muted" style="font-size:10px;">Select an available branch node below to allocate capital funding and begin development.</span>
            </div>
          `}
        </div>
      </div>

      <!-- Single-Source Mindustry-Style Tree Workspace -->
      <div class="tree-workspace">
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
                ${isResearched ? "Mastered" : (isActive ? "In Progress" : (isLocked ? "Locked" : "Ready"))}
              </span>
            </div>
            <p class="text-muted" style="font-size:10px; line-height:1.3;">${tech.desc}</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:4px;">
            <span class="t-node-cost">${isResearched ? "Developed" : (isActive ? `${state.researchDaysLeft} Days Left` : `$${tech.costMoney.toLocaleString()} &bull; ${tech.durationDays} Days`)}</span>
            ${!isResearched && !isLocked && !isActive ? `<button class="c-btn btn-ghost btn-sm btn-start-node" style="font-size:10px; padding:2px 6px;">Fund</button>` : ""}
          </div>
        `;

        card.onclick = () => {
          if (isResearched) {
            UI.toast(`"${tech.name}" is already fully developed.`, "normal");
            return;
          }
          if (isLocked) {
            const unfulfilled = tech.prereq.filter(p => !state.unlockedTechs.has(p)).map(p => state.findTechById(p)?.name || p);
            UI.toast(`Branch Locked: Complete prerequisite "${unfulfilled.join(", ")}" first.`, "danger");
            return;
          }
          if (state.activeResearchId && state.activeResearchId !== tech.id) {
            UI.toast(`Engineering Directorate Occupied: Wait for current project to finish (${state.researchDaysLeft} days remaining).`, "danger");
            return;
          }

          // Confirmation Modal
          const modalBody = document.createElement("div");
          modalBody.innerHTML = `
            <p style="font-size:12px; margin-bottom:10px; color:var(--text-main);">
              Commission engineering development for <strong>${tech.name}</strong>?
            </p>
            <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); margin-bottom:12px; font-size:11px;">
              <div>Capital Investment Required: <strong class="text-warning">$${tech.costMoney.toLocaleString()}</strong></div>
              <div>Development Timeline: <strong class="text-blue">${tech.durationDays} Days</strong></div>
              <div class="text-muted" style="margin-top:4px;">${tech.desc}</div>
            </div>
          `;

          UI.showModal({
            title: `Fund R&D: ${tech.name}`,
            contentNode: modalBody,
            actions: [
              { label: "Cancel", className: "btn-ghost", onClick: () => {} },
              {
                label: "Confirm & Fund Project",
                className: "btn-primary",
                onClick: () => {
                  const res = state.startResearch(tech.id);
                  if (res.success) {
                    SoundSystem.playClick();
                    UI.toast(`R&D Project Started: ${tech.name} funded ($${tech.costMoney.toLocaleString()}). Expected in ${tech.durationDays} days.`, "success");
                    ResearchView.render(document.getElementById("viewport-root"));
                  } else {
                    UI.toast(res.reason, "danger");
                  }
                }
              }
            ]
          });
        };

        row.appendChild(card);
      });
    });
  }
}