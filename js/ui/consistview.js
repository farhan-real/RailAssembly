// Dedicated Menu-Driven Consist Editor: Adding to End, Reordering, and Coach Customization
class ConsistView {
  static openConsistModal(builderInstance) {
    const container = document.createElement("div");
    const consist = builderInstance.consistConfig;
    const stats = TrainModelCalc.calculateTrainStats(builderInstance.currentSlots, builderInstance.subSelections, "trainset", consist);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid var(--border-subtle);">
        <div>
          <span style="font-size:12px; font-weight:700;">Consist Total: ${consist.carriages.length} Carriages</span>
          <span class="text-blue font-mono" style="font-size:11px; margin-left:6px;">
            (${stats.poweredCarCount} Powered &bull; ${stats.trailerCarCount} Trailer &bull; ${Math.round((stats.poweredCarCount / stats.carriageCount) * 100)}% Traction Ratio)
          </span>
        </div>
        <div style="font-size:11px;" class="font-mono text-positive">${stats.passengerCap} Total Seats</div>
      </div>

      <!-- Quick Traction and Length Presets -->
      <div style="display:flex; gap:4px; margin-bottom:10px; flex-wrap:wrap; align-items:center;">
        <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700; margin-right:4px;">Quick Presets:</span>
        <button class="c-btn btn-ghost btn-sm" id="preset-len-4">4 Cars</button>
        <button class="c-btn btn-ghost btn-sm" id="preset-len-6">6 Cars</button>
        <button class="c-btn btn-ghost btn-sm" id="preset-len-8">8 Cars</button>
        <button class="c-btn btn-ghost btn-sm" id="preset-len-10">10 Cars</button>
        <span style="width:1px; height:16px; background:var(--border-subtle); margin:0 4px;"></span>
        <button class="c-btn btn-ghost btn-sm" id="preset-pow-50">50% Powered</button>
        <button class="c-btn btn-ghost btn-sm" id="preset-pow-75">75% Sprint</button>
        <button class="c-btn btn-ghost btn-sm" id="preset-pow-100">100% Motorized</button>
      </div>

      <!-- Action Toolbar -->
      <div class="consist-toolbar">
        <span class="text-muted" style="font-size:11px;">Carriage Sequence Order (Front to Rear):</span>
        <div style="display:flex; gap:6px;">
          <button class="c-btn btn-primary btn-sm" id="btn-add-carriage-end">+ Add Carriage to End</button>
          <button class="c-btn btn-ghost btn-sm" id="btn-manage-types">Carriage Types Library...</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:6px; max-height:360px; overflow-y:auto;" id="carriage-rows-container"></div>
    `;

    const list = container.querySelector("#carriage-rows-container");

    consist.carriages.forEach((car, idx) => {
      const typeDef = state.findCarriageType(car.typeId);
      const row = document.createElement("div");
      row.className = `carriage-item-row ${car.isPowered ? "powered" : "trailer"}`;

      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:6px;">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <button class="carriage-reorder-btn btn-move-up" data-idx="${idx}" ${idx === 0 ? "disabled" : ""} title="Move Up in Consist">▲</button>
            <button class="carriage-reorder-btn btn-move-down" data-idx="${idx}" ${idx === consist.carriages.length - 1 ? "disabled" : ""} title="Move Down in Consist">▼</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:2px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="font-size:11px;">Car ${idx + 1}: ${car.name || typeDef.name}</strong>
              <span class="c-badge ${car.isPowered ? "badge-blue" : "badge-amber"}">
                ${car.isPowered ? "Powered Motor Car" : "Unpowered Trailer Car"}
              </span>
            </div>
            <span class="text-muted" style="font-size:10px;">${typeDef.desc}</span>
          </div>
        </div>

        <div style="display:flex; gap:4px; align-items:center;">
          <button class="c-btn btn-ghost btn-sm btn-edit-coach" data-idx="${idx}">Customize Coach...</button>
          <button class="c-btn btn-ghost btn-sm btn-duplicate-coach" data-idx="${idx}">Duplicate</button>
          ${consist.carriages.length > 2 
            ? `<button class="c-btn btn-ghost btn-sm btn-remove-car" data-idx="${idx}" style="color:var(--color-negative);">Remove</button>` 
            : ""
          }
        </div>
      `;

      row.querySelector(".btn-move-up")?.addEventListener("click", () => {
        if (idx > 0) {
          const temp = consist.carriages[idx];
          consist.carriages[idx] = consist.carriages[idx - 1];
          consist.carriages[idx - 1] = temp;
          ConsistView.renumberCarriages(consist);
          ConsistView.openConsistModal(builderInstance);
        }
      });

      row.querySelector(".btn-move-down")?.addEventListener("click", () => {
        if (idx < consist.carriages.length - 1) {
          const temp = consist.carriages[idx];
          consist.carriages[idx] = consist.carriages[idx + 1];
          consist.carriages[idx + 1] = temp;
          ConsistView.renumberCarriages(consist);
          ConsistView.openConsistModal(builderInstance);
        }
      });

      row.querySelector(".btn-edit-coach").onclick = () => {
        ConsistView.openEditCoachModal(builderInstance, idx);
      };

      row.querySelector(".btn-duplicate-coach").onclick = () => {
        const cloned = JSON.parse(JSON.stringify(car));
        consist.carriages.splice(idx + 1, 0, cloned);
        consist.carriageCount = consist.carriages.length;
        ConsistView.renumberCarriages(consist);
        ConsistView.openConsistModal(builderInstance);
      };

      const remBtn = row.querySelector(".btn-remove-car");
      if (remBtn) {
        remBtn.onclick = () => {
          consist.carriages.splice(idx, 1);
          consist.carriageCount = consist.carriages.length;
          ConsistView.renumberCarriages(consist);
          ConsistView.openConsistModal(builderInstance);
        };
      }

      list.appendChild(row);
    });

    // Preset Bindings
    container.querySelector("#preset-len-4").onclick = () => ConsistView.setConsistLength(builderInstance, 4);
    container.querySelector("#preset-len-6").onclick = () => ConsistView.setConsistLength(builderInstance, 6);
    container.querySelector("#preset-len-8").onclick = () => ConsistView.setConsistLength(builderInstance, 8);
    container.querySelector("#preset-len-10").onclick = () => ConsistView.setConsistLength(builderInstance, 10);

    container.querySelector("#preset-pow-50").onclick = () => ConsistView.setPowerRatio(builderInstance, 0.50);
    container.querySelector("#preset-pow-75").onclick = () => ConsistView.setPowerRatio(builderInstance, 0.75);
    container.querySelector("#preset-pow-100").onclick = () => ConsistView.setPowerRatio(builderInstance, 1.00);

    container.querySelector("#btn-add-carriage-end").onclick = () => ConsistView.openAppendCarriageMenu(builderInstance);
    container.querySelector("#btn-manage-types").onclick = () => CarTypeManager.openTypeLibraryModal(builderInstance);

    UI.showModal({
      title: "Consist Architecture: Carriage Editor & Sequence Manager",
      contentNode: container,
      actions: [
        { label: "Apply Consist to CAD", className: "btn-primary", onClick: () => BuilderView.render(document.getElementById("viewport-root")) }
      ]
    });
  }

  static openEditCoachModal(builderInstance, carIdx) {
    const car = builderInstance.consistConfig.carriages[carIdx];
    const typeDef = state.findCarriageType(car.typeId);
    const container = document.createElement("div");

    container.innerHTML = `
      <p class="text-muted" style="font-size:11px; margin-bottom:12px;">Customize individual designation and specifications for Position ${carIdx + 1}:</p>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Carriage Label / Custom Name</label>
          <input type="text" class="c-input-custom" id="input-coach-name" value="${car.name || typeDef.name}" style="margin-top:4px;">
        </div>
        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Assigned Carriage Specification</label>
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-panel); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); margin-top:4px;">
            <span>${typeDef.name} (${typeDef.isPowered ? "Motor Car" : "Trailer"})</span>
            <button class="c-btn btn-ghost btn-sm" id="btn-reassign-type">Change Type Menu...</button>
          </div>
        </div>
        <div>
          <label style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">Traction State</label>
          <div style="display:flex; gap:6px; margin-top:4px;">
            <button class="c-btn ${!car.isPowered ? "btn-primary" : "btn-ghost"} btn-sm" id="btn-coach-trailer" style="flex:1;">Unpowered Trailer</button>
            <button class="c-btn ${car.isPowered ? "btn-primary" : "btn-ghost"} btn-sm" id="btn-coach-powered" style="flex:1;">Powered Motor Car</button>
          </div>
        </div>
      </div>
    `;

    container.querySelector("#btn-reassign-type").onclick = () => {
      const items = state.customCarriageTypes.map(t => ({
        id: t.id, name: t.name, specs: `${t.isPowered ? "Powered Motor" : "Trailer"} &bull; Layout: ${t.layout}`, desc: t.desc, disabled: false
      }));
      BuilderView.openSelectionModal({
        title: `Select Type for Position ${carIdx + 1}`,
        subtitle: "Choose carriage type from catalog library:",
        items, activeId: car.typeId,
        onSelect: (typeId) => {
          const chosen = state.findCarriageType(typeId);
          car.typeId = chosen.id;
          car.isPowered = chosen.isPowered;
          car.name = `Car ${carIdx + 1}: ${chosen.name}`;
          ConsistView.openEditCoachModal(builderInstance, carIdx);
        }
      });
    };

    container.querySelector("#btn-coach-trailer").onclick = () => {
      car.isPowered = false;
      ConsistView.openEditCoachModal(builderInstance, carIdx);
    };

    container.querySelector("#btn-coach-powered").onclick = () => {
      car.isPowered = true;
      ConsistView.openEditCoachModal(builderInstance, carIdx);
    };

    UI.showModal({
      title: `Customize Carriage ${carIdx + 1}`,
      contentNode: container,
      actions: [
        {
          label: "Save Coach", className: "btn-primary",
          onClick: () => {
            car.name = container.querySelector("#input-coach-name").value.trim() || `Car ${carIdx + 1}: Coach`;
            ConsistView.openConsistModal(builderInstance);
          }
        }
      ]
    });
  }

  static openAppendCarriageMenu(builderInstance) {
    const items = state.customCarriageTypes.map(type => ({
      id: type.id, name: type.name, specs: `${type.isPowered ? "Powered Motor Car" : "Unpowered Trailer Car"} &bull; Layout: ${type.layout.toUpperCase()}`,
      desc: type.desc, disabled: false
    }));

    BuilderView.openSelectionModal({
      title: "Add Carriage to End of Consist",
      subtitle: "Select carriage specification to append to the end of this trainset:",
      items, activeId: null,
      onSelect: (typeId) => {
        const typeDef = state.findCarriageType(typeId);
        const newIdx = builderInstance.consistConfig.carriages.length + 1;
        builderInstance.consistConfig.carriages.push({
          index: newIdx, typeId: typeDef.id, name: `Car ${newIdx}: ${typeDef.name}`, isPowered: typeDef.isPowered
        });
        builderInstance.consistConfig.carriageCount = builderInstance.consistConfig.carriages.length;
        ConsistView.openConsistModal(builderInstance);
      }
    });
  }

  static setConsistLength(builderInstance, targetLen) {
    const list = builderInstance.consistConfig.carriages;
    while (list.length < targetLen) {
      const idx = list.length + 1;
      const isPow = list.length % 2 === 0;
      const tId = isPow ? "intermediate_motor" : "intermediate_trailer";
      const typeDef = state.findCarriageType(tId);
      list.push({ index: idx, typeId: tId, name: `Car ${idx}: ${typeDef.name}`, isPowered: isPow });
    }
    if (list.length > targetLen) list.length = targetLen;
    builderInstance.consistConfig.carriageCount = targetLen;
    ConsistView.renumberCarriages(builderInstance.consistConfig);
    ConsistView.openConsistModal(builderInstance);
  }

  static setPowerRatio(builderInstance, ratio) {
    const list = builderInstance.consistConfig.carriages;
    const numPowered = Math.max(1, Math.round(list.length * ratio));
    list.forEach((car, i) => {
      car.isPowered = i < numPowered;
    });
    ConsistView.openConsistModal(builderInstance);
  }

  static renumberCarriages(consist) {
    consist.carriages.forEach((c, i) => {
      c.index = i + 1;
      const typeDef = state.findCarriageType(c.typeId);
      if (c.name.startsWith("Car ")) c.name = `Car ${i + 1}: ${typeDef.name}`;
    });
  }
}