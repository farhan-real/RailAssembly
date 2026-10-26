// Dedicated Menu-Driven Carriage Type Library Manager (Zero Dropdowns)
class CarTypeManager {
  static openTypeLibraryModal(builderInstance) {
    const container = document.createElement("div");

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
        <span class="text-muted" style="font-size:11px;">Standard factory and custom player-designed carriage specifications:</span>
        <button class="c-btn btn-primary btn-sm" id="btn-create-new-type">+ Create New Carriage Type</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; max-height:420px; overflow-y:auto;" id="types-list-container"></div>
    `;

    const list = container.querySelector("#types-list-container");

    state.customCarriageTypes.forEach((type, idx) => {
      const card = document.createElement("div");
      card.style.background = "var(--bg-surface)";
      card.style.padding = "10px 12px";
      card.style.borderRadius = "var(--radius-xs)";
      card.style.border = "1px solid var(--border-subtle)";

      const isFactory = idx < 5;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="max-width:70%;">
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="font-size:12px;">${type.name}</strong>
              <span class="c-badge ${type.isPowered ? "badge-blue" : "badge-amber"}">
                ${type.isPowered ? "Powered Motor Car" : "Unpowered Trailer Car"}
              </span>
              ${isFactory ? `<span class="c-badge badge-green">Standard Specification</span>` : `<span class="c-badge badge-blue">Custom Design</span>`}
            </div>
            <div class="text-muted" style="font-size:10px; margin-top:2px;">
              Layout: ${type.layout.toUpperCase()} &bull; Seating Multiplier: ${type.seatMultiplier}x &bull; Mass Delta: ${type.weightOffset >= 0 ? "+" : ""}${type.weightOffset} kg
            </div>
            <div style="font-size:11px; margin-top:3px; color:var(--text-secondary);">${type.desc}</div>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="c-btn btn-ghost btn-sm btn-edit-type" data-id="${type.id}">Edit Type...</button>
            ${!isFactory ? `<button class="c-btn btn-ghost btn-sm btn-delete-type" data-id="${type.id}" style="color:var(--color-negative);">Delete</button>` : ""}
          </div>
        </div>
      `;

      card.querySelector(".btn-edit-type").onclick = () => {
        CarTypeManager.openCreateOrEditTypeModal(builderInstance, type);
      };

      const delBtn = card.querySelector(".btn-delete-type");
      if (delBtn) {
        delBtn.onclick = () => {
          state.deleteCarriageType(type.id);
          UI.toast(`Carriage type "${type.name}" deleted.`, "normal");
          CarTypeManager.openTypeLibraryModal(builderInstance);
        };
      }

      list.appendChild(card);
    });

    container.querySelector("#btn-create-new-type").onclick = () => {
      CarTypeManager.openCreateOrEditTypeModal(builderInstance, null);
    };

    UI.showModal({
      title: "Carriage Type Catalog & Specification Library",
      contentNode: container,
      actions: [
        { label: "Close Library", className: "btn-ghost", onClick: () => ConsistView.openConsistModal(builderInstance) }
      ]
    });
  }

  static openCreateOrEditTypeModal(builderInstance, existingType) {
    const isEdit = !!existingType;
    const container = document.createElement("div");
    let isPowered = isEdit ? existingType.isPowered : false;
    let selectedLayout = isEdit ? existingType.layout : "standard";

    container.innerHTML = `
      <p class="text-muted" style="font-size:11px; margin-bottom:12px;">
        ${isEdit ? "Update and refine specifications for this carriage type:" : "Engineer and name a new specialized carriage specification for your rolling stock catalog:"}
      </p>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Carriage Type Name</label>
          <input type="text" class="c-input-custom" id="custom-type-name" value="${isEdit ? existingType.name : ""}" placeholder="e.g. High-Speed Sleeper Berths Coach" style="margin-top:4px;">
        </div>

        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Traction Assignment</label>
          <div style="display:flex; gap:6px; margin-top:4px;">
            <button class="c-btn btn-ghost btn-sm" id="btn-set-trailer" style="flex:1;">Unpowered Trailer Car</button>
            <button class="c-btn btn-ghost btn-sm" id="btn-set-powered" style="flex:1;">Powered Motor Car</button>
          </div>
        </div>

        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Interior Accommodation &amp; Layout</label>
          <div style="display:flex; gap:4px; margin-top:4px; flex-wrap:wrap;">
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="standard">Standard Passenger</button>
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="high_density">High-Density Commuter</button>
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="lounge">First-Class Lounge</button>
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="sleeper">Sleeper Berths</button>
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="cargo">Luggage &amp; Cargo Freight</button>
          </div>
        </div>

        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Operational Description</label>
          <input type="text" class="c-input-custom" id="custom-type-desc" value="${isEdit ? existingType.desc : ""}" placeholder="e.g. High comfort sleeper compartments for long-distance services." style="margin-top:4px;">
        </div>
      </div>
    `;

    const btnTrailer = container.querySelector("#btn-set-trailer");
    const btnPowered = container.querySelector("#btn-set-powered");

    const refreshTraction = () => {
      btnTrailer.className = `c-btn ${!isPowered ? "btn-primary" : "btn-ghost"} btn-sm`;
      btnPowered.className = `c-btn ${isPowered ? "btn-primary" : "btn-ghost"} btn-sm`;
    };
    refreshTraction();

    btnTrailer.onclick = () => { isPowered = false; refreshTraction(); };
    btnPowered.onclick = () => { isPowered = true; refreshTraction(); };

    const refreshLayout = () => {
      container.querySelectorAll(".btn-layout-choice").forEach(b => {
        b.className = `c-btn ${b.getAttribute("data-layout") === selectedLayout ? "btn-primary" : "btn-ghost"} btn-sm btn-layout-choice`;
      });
    };
    refreshLayout();

    container.querySelectorAll(".btn-layout-choice").forEach(btn => {
      btn.onclick = () => { selectedLayout = btn.getAttribute("data-layout"); refreshLayout(); };
    });

    UI.showModal({
      title: isEdit ? `Edit Carriage Type: ${existingType.name}` : "Create and Name New Carriage Type",
      contentNode: container,
      actions: [
        {
          label: isEdit ? "Save Changes" : "Save Carriage Type to Catalog",
          className: "btn-primary",
          onClick: () => {
            const name = container.querySelector("#custom-type-name").value.trim() || "Specialized Rolling Stock Coach";
            const desc = container.querySelector("#custom-type-desc").value.trim() || "Custom engineered carriage specification.";

            let seatMult = 1.0;
            let wOffset = 0;
            let cOffset = 0;

            if (selectedLayout === "high_density") { seatMult = 1.35; wOffset = 600; cOffset = -25000; }
            else if (selectedLayout === "lounge") { seatMult = 0.55; wOffset = 1500; cOffset = 45000; }
            else if (selectedLayout === "sleeper") { seatMult = 0.45; wOffset = 2200; cOffset = 55000; }
            else if (selectedLayout === "cargo") { seatMult = 0.0; wOffset = -1800; cOffset = -50000; }

            if (isEdit) {
              state.updateCarriageType(existingType.id, { name, isPowered, layout: selectedLayout, seatMultiplier: seatMult, weightOffset: wOffset, costOffset: cOffset, desc });
              UI.toast(`Carriage Type "${name}" updated.`, "success");
            } else {
              const newType = { id: "cartype_" + Date.now().toString(36), name, isPowered, layout: selectedLayout, seatMultiplier: seatMult, weightOffset: wOffset, costOffset: cOffset, desc };
              state.addCarriageType(newType);
              UI.toast(`Carriage Type "${name}" created and added to library.`, "success");
            }
            CarTypeManager.openTypeLibraryModal(builderInstance);
          }
        }
      ]
    });
  }
}