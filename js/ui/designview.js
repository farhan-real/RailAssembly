// Design Blueprint Management: Save, Reload, and Factory Reference Presets
class DesignView {
  static openDesignManager(builderInstance) {
    const container = document.createElement("div");

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
        <span class="text-muted" style="font-size:11px;">Save current engineering blueprint or reload previously archived designs into CAD:</span>
        <button class="c-btn btn-primary btn-sm" id="btn-save-current-design">Save Current Design</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; max-height:420px; overflow-y:auto;" id="saved-designs-list"></div>
    `;

    const list = container.querySelector("#saved-designs-list");

    state.savedDesigns.forEach((design, idx) => {
      const card = document.createElement("div");
      card.style.background = "var(--bg-surface)";
      card.style.padding = "10px 12px";
      card.style.borderRadius = "var(--radius-xs)";
      card.style.border = "1px solid var(--border-subtle)";

      const isTrainset = design.type === "trainset";
      const carInfo = isTrainset && design.consistConfig 
        ? `${design.consistConfig.carriageCount}-Car Multiple Unit (${design.consistConfig.carriages.filter(c => c.isPowered).length}M${design.consistConfig.carriages.filter(c => !c.isPowered).length}T)`
        : "Standalone Locomotive";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
          <div>
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="font-size:12px;">${design.name}</strong>
              <span class="c-badge ${isTrainset ? "badge-blue" : "badge-green"}">${isTrainset ? "Trainset" : "Locomotive"}</span>
            </div>
            <div class="text-muted" style="font-size:10px; margin-top:2px;">${carInfo} &bull; Archived: ${design.savedDate}</div>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="c-btn btn-primary btn-sm btn-load-design" data-id="${design.id}">Load into CAD</button>
            ${!design.savedDate.includes("Factory") ? `<button class="c-btn btn-ghost btn-sm btn-delete-design" data-idx="${idx}">Delete</button>` : ""}
          </div>
        </div>
      `;

      card.querySelector(".btn-load-design").onclick = () => {
        DesignView.loadDesignIntoBuilder(builderInstance, design);
        UI.closeModal();
        UI.toast(`Blueprint "${design.name}" loaded into CAD workspace.`, "success");
        BuilderView.render(document.getElementById("viewport-root"));
      };

      const delBtn = card.querySelector(".btn-delete-design");
      if (delBtn) {
        delBtn.onclick = () => {
          state.savedDesigns.splice(idx, 1);
          DesignView.openDesignManager(builderInstance);
          UI.toast("Saved design blueprint deleted.", "normal");
        };
      }

      list.appendChild(card);
    });

    container.querySelector("#btn-save-current-design").onclick = () => {
      const designToSave = {
        id: "design_" + Date.now().toString(36),
        name: builderInstance.trainName || "Custom Electric Rolling Stock",
        type: builderInstance.rollingStockType,
        slots: JSON.parse(JSON.stringify(builderInstance.currentSlots)),
        subSelections: JSON.parse(JSON.stringify(builderInstance.subSelections)),
        consistConfig: JSON.parse(JSON.stringify(builderInstance.consistConfig)),
        marginPercent: builderInstance.marginPercent,
        savedDate: state.getDateString()
      };

      state.savedDesigns.push(designToSave);
      UI.toast(`Design "${designToSave.name}" archived to Blueprint Library.`, "success");
      DesignView.openDesignManager(builderInstance);
    };

    UI.showModal({
      title: "Blueprint Archive & Design Library",
      contentNode: container,
      actions: []
    });
  }

  static loadDesignIntoBuilder(builderInstance, design) {
    builderInstance.trainName = design.name;
    builderInstance.rollingStockType = design.type;
    builderInstance.marginPercent = design.marginPercent || 22;
    builderInstance.currentSlots = JSON.parse(JSON.stringify(design.slots));
    builderInstance.subSelections = JSON.parse(JSON.stringify(design.subSelections));
    builderInstance.consistConfig = JSON.parse(JSON.stringify(design.consistConfig));
  }
}