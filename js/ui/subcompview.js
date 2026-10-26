// Dedicated Subcomponent and Modification Package Selection Modal
class SubcompView {
  static open(catKey, isMod, builderInstance) {
    const subData = SUBCOMPONENTS_DATA[catKey];
    if (!subData) return;

    const list = isMod ? subData.modifications : subData.subcomponents;
    if (!list || list.length === 0) return;

    const currentSubSelections = builderInstance.subSelections[catKey] || {};
    const activeId = isMod ? currentSubSelections.modification : currentSubSelections.subcomponent;

    const items = list.map(item => {
      const isUnlocked = state.isSubcomponentUnlocked(item.id);
      const strengths = [];
      const tradeOffs = [];

      if (item.speedBonus) strengths.push(`+${item.speedBonus} km/h Speed`);
      if (item.adhesionBonus) strengths.push(`+${item.adhesionBonus} Adhesion μ`);
      if (item.safetyBonus) strengths.push(`+${item.safetyBonus} Safety`);
      if (item.efficiencyBonus && item.efficiencyBonus > 0) strengths.push(`+${(item.efficiencyBonus * 100).toFixed(1)}% Eff`);
      if (item.reliabilityBonus && item.reliabilityBonus > 0) strengths.push(`+${item.reliabilityBonus} Rel`);

      if (item.weight > 0) tradeOffs.push(`+${item.weight} kg Mass`);
      else if (item.weight < 0) strengths.push(`${item.weight} kg Mass`);

      if (item.efficiencyBonus && item.efficiencyBonus < 0) tradeOffs.push(`${(item.efficiencyBonus * 100).toFixed(1)}% Eff`);

      return {
        id: item.id,
        name: item.name,
        cost: item.cost,
        weight: item.weight,
        strengthsText: strengths.join(" • ") || "Standard Spec",
        tradeOffsText: tradeOffs.join(" • ") || "None",
        desc: item.desc,
        disabled: !isUnlocked,
        badge: !isUnlocked ? "Research Required" : (item.id.includes("standard") || item.id.includes("single") ? "Standard" : "Engineered")
      };
    });

    const typeLabel = isMod ? "Modification Package" : "Sub-Component Architecture";
    const comp = state.findComponentById(builderInstance.currentSlots[catKey]);
    const title = `${comp ? comp.name : catKey.toUpperCase()}: ${typeLabel}`;

    const container = document.createElement("div");
    container.innerHTML = `<p class="text-muted" style="font-size:11px; margin-bottom:10px;">Select modular upgrade. Advanced packages must be researched in the Research Tree:</p>`;

    const menuList = document.createElement("div");
    menuList.className = "catalog-menu-list";

    items.forEach(item => {
      const isSelected = item.id === activeId;
      const el = document.createElement("div");
      el.className = `catalog-menu-item ${isSelected ? "active" : ""}`;
      if (item.disabled) el.style.opacity = "0.55";

      el.innerHTML = `
        <div class="catalog-item-header">
          <div class="catalog-item-title-group">
            <strong class="catalog-item-name">${item.name}</strong>
            ${isSelected ? `<span class="c-badge badge-blue">Active</span>` : ""}
            ${item.badge ? `<span class="c-badge ${item.disabled ? "badge-amber" : "badge-green"}">${item.badge}</span>` : ""}
          </div>
          <div class="catalog-item-actions">
            <span class="catalog-item-price font-mono text-blue">$${item.cost.toLocaleString()}</span>
            <button class="c-btn ${isSelected ? "btn-ghost" : "btn-primary"} btn-sm" ${item.disabled ? "disabled" : ""}>
              ${isSelected ? "Active" : "Equip"}
            </button>
          </div>
        </div>
        <div class="catalog-item-specs text-muted" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:4px;">
          <span>Strengths: <strong class="text-positive font-mono">${item.strengthsText}</strong></span>
          ${item.tradeOffsText !== "None" ? `<span>Trade-offs: <strong class="text-warning font-mono">${item.tradeOffsText}</strong></span>` : ""}
        </div>
        <div class="catalog-item-desc">${item.desc}</div>
      `;

      el.onclick = () => {
        if (item.disabled) {
          UI.toast("Option Locked: Research required in Research Tree Directorate.", "danger");
          return;
        }
        if (!builderInstance.subSelections[catKey]) builderInstance.subSelections[catKey] = {};
        if (isMod) builderInstance.subSelections[catKey].modification = item.id;
        else builderInstance.subSelections[catKey].subcomponent = item.id;

        UI.closeModal();
        BuilderView.render(document.getElementById("viewport-root"));
        UI.toast(`Equipped ${item.name}.`, "success");
      };

      menuList.appendChild(el);
    });

    container.appendChild(menuList);
    UI.showModal({ title, contentNode: container, actions: [] });
  }
}