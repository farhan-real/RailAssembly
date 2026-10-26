// Dedicated Menu-Driven Carriage Consist Customization and Custom Type Creator
class ConsistView {
  static openConsistModal(builderInstance) {
    const container = document.createElement("div");

    container.innerHTML = `
      <p class="text-muted" style="font-size:11px; margin-bottom:10px;">
        Build long, short, or express trainset consists. Create and name custom carriage types and append carriages directly to the end of the train:
      </p>

      <div class="consist-toolbar">
        <div>
          <span style="font-size:12px; font-weight:700;">Consist Total: ${builderInstance.consistConfig.carriages.length} Carriages</span>
          <span class="text-muted" style="font-size:11px; margin-left:8px;">
            (${builderInstance.consistConfig.carriages.filter(c => c.isPowered).length} Powered &bull; ${builderInstance.consistConfig.carriages.filter(c => !c.isPowered).length} Trailer)
          </span>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="c-btn btn-primary btn-sm" id="btn-add-carriage-end">+ Add Carriage to End</button>
          <button class="c-btn btn-ghost btn-sm" id="btn-create-custom-type">Create Carriage Type...</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:6px; max-height:360px; overflow-y:auto;" id="carriage-rows-container"></div>
    `;

    const list = container.querySelector("#carriage-rows-container");

    builderInstance.consistConfig.carriages.forEach((car, idx) => {
      const typeDef = state.findCarriageType(car.typeId);
      const row = document.createElement("div");
      row.className = `carriage-item-row ${car.isPowered ? "powered" : "trailer"}`;

      row.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:2px; max-width:65%;">
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="font-size:11px;">Carriage ${idx + 1}: ${car.name || typeDef.name}</strong>
            <span class="c-badge ${car.isPowered ? "badge-blue" : "badge-amber"}">
              ${car.isPowered ? "Powered Motor Car" : "Unpowered Trailer Car"}
            </span>
          </div>
          <span class="text-muted" style="font-size:10px;">${typeDef.desc}</span>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="c-btn btn-ghost btn-sm btn-change-type" data-idx="${idx}">Change Type Menu...</button>
          ${builderInstance.consistConfig.carriages.length > 2 
            ? `<button class="c-btn btn-ghost btn-sm btn-remove-car" data-idx="${idx}" style="color:var(--color-negative);">Remove</button>` 
            : ""
          }
        </div>
      `;

      row.querySelector(".btn-change-type").onclick = () => {
        ConsistView.openChangeCarriageTypeMenu(builderInstance, idx);
      };

      const remBtn = row.querySelector(".btn-remove-car");
      if (remBtn) {
        remBtn.onclick = () => {
          builderInstance.consistConfig.carriages.splice(idx, 1);
          builderInstance.consistConfig.carriageCount = builderInstance.consistConfig.carriages.length;
          ConsistView.openConsistModal(builderInstance);
        };
      }

      list.appendChild(row);
    });

    container.querySelector("#btn-add-carriage-end").onclick = () => ConsistView.openAppendCarriageMenu(builderInstance);
    container.querySelector("#btn-create-custom-type").onclick = () => ConsistView.openCreateTypeModal(builderInstance);

    UI.showModal({
      title: "Consist Carriages & Custom Rolling Stock Composition",
      contentNode: container,
      actions: [
        {
          label: "Apply to CAD Blueprint",
          className: "btn-primary",
          onClick: () => BuilderView.render(document.getElementById("viewport-root"))
        }
      ]
    });
  }

  static openAppendCarriageMenu(builderInstance) {
    const items = state.customCarriageTypes.map(type => ({
      id: type.id,
      name: type.name,
      specs: `${type.isPowered ? "Powered Motor Car" : "Unpowered Trailer Car"} &bull; Layout: ${type.layout.toUpperCase()}`,
      desc: type.desc,
      disabled: false
    }));

    BuilderView.openSelectionModal({
      title: "Add Carriage to End of Consist",
      subtitle: "Select carriage specification to append to the end of this trainset:",
      items, activeId: null,
      onSelect: (typeId) => {
        const typeDef = state.findCarriageType(typeId);
        const newIdx = builderInstance.consistConfig.carriages.length + 1;
        builderInstance.consistConfig.carriages.push({
          index: newIdx,
          typeId: typeDef.id,
          name: `Car ${newIdx}: ${typeDef.name}`,
          isPowered: typeDef.isPowered
        });
        builderInstance.consistConfig.carriageCount = builderInstance.consistConfig.carriages.length;
        ConsistView.openConsistModal(builderInstance);
      }
    });
  }

  static openChangeCarriageTypeMenu(builderInstance, carIdx) {
    const car = builderInstance.consistConfig.carriages[carIdx];
    const items = state.customCarriageTypes.map(type => ({
      id: type.id,
      name: type.name,
      specs: `${type.isPowered ? "Powered Motor Car" : "Unpowered Trailer Car"} &bull; Layout: ${type.layout.toUpperCase()}`,
      desc: type.desc,
      disabled: false
    }));

    BuilderView.openSelectionModal({
      title: `Assign Carriage Type for Position ${carIdx + 1}`,
      subtitle: "Choose standard or custom carriage type for this position:",
      items, activeId: car.typeId,
      onSelect: (typeId) => {
        const typeDef = state.findCarriageType(typeId);
        car.typeId = typeDef.id;
        car.isPowered = typeDef.isPowered;
        car.name = `Car ${carIdx + 1}: ${typeDef.name}`;
        ConsistView.openConsistModal(builderInstance);
      }
    });
  }

  static openCreateTypeModal(builderInstance) {
    const container = document.createElement("div");
    let isPowered = false;
    let selectedLayout = "standard";

    container.innerHTML = `
      <p class="text-muted" style="font-size:11px; margin-bottom:12px;">
        Define and name a new specialized carriage specification for your rolling stock catalog:
      </p>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Carriage Type Name</label>
          <input type="text" class="c-input-custom" id="custom-type-name" placeholder="e.g. High-Speed Sleeper Berths Coach" style="margin-top:4px;">
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
            <button class="c-btn btn-primary btn-sm btn-layout-choice" data-layout="standard">Standard Passenger</button>
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="high_density">High-Density Commuter</button>
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="lounge">First-Class Lounge</button>
            <button class="c-btn btn-ghost btn-sm btn-layout-choice" data-layout="cargo">Luggage &amp; Cargo Freight</button>
          </div>
        </div>

        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Operational Purpose Description</label>
          <input type="text" class="c-input-custom" id="custom-type-desc" placeholder="e.g. Long-distance sleeping compartment with acoustic insulation." style="margin-top:4px;">
        </div>
      </div>
    `;

    const btnTrailer = container.querySelector("#btn-set-trailer");
    const btnPowered = container.querySelector("#btn-set-powered");

    const refreshTractionButtons = () => {
      btnTrailer.className = `c-btn ${!isPowered ? "btn-primary" : "btn-ghost"} btn-sm`;
      btnPowered.className = `c-btn ${isPowered ? "btn-primary" : "btn-ghost"} btn-sm`;
    };
    refreshTractionButtons();

    btnTrailer.onclick = () => { isPowered = false; refreshTractionButtons(); };
    btnPowered.onclick = () => { isPowered = true; refreshTractionButtons(); };

    container.querySelectorAll(".btn-layout-choice").forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll(".btn-layout-choice").forEach(b => b.className = "c-btn btn-ghost btn-sm btn-layout-choice");
        btn.className = "c-btn btn-primary btn-sm btn-layout-choice";
        selectedLayout = btn.getAttribute("data-layout");
      };
    });

    UI.showModal({
      title: "Create and Name New Carriage Type",
      contentNode: container,
      actions: [
        {
          label: "Save Carriage Type to Catalog",
          className: "btn-primary",
          onClick: () => {
            const name = container.querySelector("#custom-type-name").value.trim() || "Custom Specialized Coach";
            const desc = container.querySelector("#custom-type-desc").value.trim() || "Custom engineered carriage specification.";

            let seatMult = 1.0;
            let wOffset = 0;
            let cOffset = 0;

            if (selectedLayout === "high_density") { seatMult = 1.35; wOffset = 800; cOffset = -20000; }
            else if (selectedLayout === "lounge") { seatMult = 0.55; wOffset = 1500; cOffset = 45000; }
            else if (selectedLayout === "cargo") { seatMult = 0.0; wOffset = -1500; cOffset = -40000; }

            const newType = {
              id: "cartype_" + Date.now().toString(36),
              name, isPowered, layout: selectedLayout,
              seatMultiplier: seatMult, weightOffset: wOffset, costOffset: cOffset, desc
            };

            state.customCarriageTypes.push(newType);
            state.saveToStorage();
            UI.toast(`Carriage Type "${name}" created and added to catalog.`, "success");
            ConsistView.openConsistModal(builderInstance);
          }
        }
      ]
    });
  }
}