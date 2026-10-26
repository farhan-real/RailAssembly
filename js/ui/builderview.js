// Industrial Engineering Computer-Aided Design View (Strictly Menu-Driven, Zero Dropdowns)
class BuilderView {
  static currentSlots = {
    pantograph: "panto_std",
    transformer: "trans_heavy",
    inverter: "inv_igbt_air",
    motor: "mot_ind_basic",
    bogie: "bog_co_co",
    carbody: "body_steel",
    brakes: "brk_disc_regen",
    battery: "bat_none",
    tcms: "tcms_basic"
  };

  static subSelections = {
    pantograph: { subcomponent: "cs_carbon", modification: "act_pneumatic" },
    transformer: { subcomponent: "wind_copper", modification: "cool_mineral" },
    inverter: { subcomponent: "gd_optical", modification: "therm_coldplate" },
    motor: { subcomponent: "gb_single", modification: "brg_steel" },
    bogie: { subcomponent: "susp_coil", modification: "whl_standard" },
    carbody: { subcomponent: "crash_standard", modification: "aero_none" },
    brakes: { subcomponent: "cal_cast", modification: "disc_iron" },
    battery: { subcomponent: "btherm_passive", modification: "bprot_standard" },
    tcms: { subcomponent: "bus_wtb", modification: "sens_standard" }
  };

  static trainName = "VoltMaster 1000";
  static trainType = "locomotive";
  static marginPercent = 22;

  static render(container) {
    const stats = TrainModelCalc.calculateTrainStats(this.currentSlots, this.subSelections);

    container.innerHTML = `
      <div class="cad-container">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-subtle);">
          <div>
            <h2 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Rolling Stock Engineering Architecture</h2>
            <span class="text-muted" style="font-size:11px;">Configure primary modules, subcomponents, and engineering modifications via catalog menus</span>
          </div>
          <button class="c-btn btn-primary" id="btn-save-variant">Save and Commission Blueprint</button>
        </div>

        <div class="view-grid-four" style="margin-bottom:14px;">
          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Top Speed &bull; Acceleration</span>
            <div class="font-mono text-blue" style="font-size:13px; margin:2px 0;">
              ${stats.roughSpeedMin} &sim; ${stats.roughSpeedMax} km/h &bull; ${stats.acceleration} m/s²
            </div>
            <span class="text-muted" style="font-size:9px;">Adhesion Tractive Force: ${stats.maxAdhesionKn} kN</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Traction Power Rating</span>
            <div class="font-mono text-blue" style="font-size:13px; margin:2px 0;">
              ${stats.availablePowerKw} kW (${stats.horsepower.toLocaleString()} hp)
            </div>
            <span class="text-muted" style="font-size:9px;">Total Electrical Efficiency: ${Math.round(stats.totalEfficiency * 100)}%</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Axle Load Verification</span>
            <div class="font-mono ${stats.axleOverloaded ? "text-negative" : "text-positive"}" style="font-size:13px; margin:2px 0;">
              ${stats.axleLoad} t / Axle (Limit: ${stats.maxAllowedAxleLoad} t)
            </div>
            <span class="text-muted" style="font-size:9px;">Gross Tare Weight: ${stats.totalMassTons} Metric Tons</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Hardware BOM Cost</span>
            <div class="font-mono text-warning" style="font-size:13px; margin:2px 0;">
              $${stats.bomCost.toLocaleString()}
            </div>
            <span class="text-muted" style="font-size:9px;">Direct component and modification total</span>
          </div>
        </div>

        <div class="view-grid-three" id="subsystem-cards-container"></div>
      </div>
    `;

    this.renderSubsystemCards();

    document.getElementById("btn-save-variant").onclick = () => {
      if (stats.axleOverloaded) {
        UI.toast("Axle Load Breach: Train tare weight exceeds bogie structural load limit.", "danger");
        return;
      }
      const newVar = TrainModelCalc.createVariant(this.trainName, this.trainType, this.currentSlots, this.subSelections, this.marginPercent);
      state.variants.push(newVar);
      UI.toast(`Blueprint "${newVar.name}" commissioned to Fleet Catalog.`, "success");
      Events.emit("navTo", "catalog");
    };
  }

  static renderSubsystemCards() {
    const container = document.getElementById("subsystem-cards-container");
    container.innerHTML = "";

    const categories = [
      { key: "pantograph", label: "Pantograph Collector System" },
      { key: "transformer", label: "Main Traction Transformer" },
      { key: "inverter", label: "Traction Inverter / Converter" },
      { key: "motor", label: "Traction Motors" },
      { key: "bogie", label: "Bogie & Wheelset Assembly" },
      { key: "carbody", label: "Carbody Shell Architecture" },
      { key: "brakes", label: "Braking & Recovery System" },
      { key: "battery", label: "Auxiliary Energy Storage" },
      { key: "tcms", label: "TCMS Control Network" }
    ];

    categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "subsystem-card";

      const currentCompId = this.currentSlots[cat.key];
      const comp = state.findComponentById(currentCompId) || COMPONENTS_DATA[cat.key][0];
      const subData = SUBCOMPONENTS_DATA[cat.key];

      const activeSubId = this.subSelections[cat.key]?.subcomponent;
      const activeSub = subData?.subcomponents?.find(s => s.id === activeSubId);

      const activeModId = this.subSelections[cat.key]?.modification;
      const activeMod = subData?.modifications?.find(m => m.id === activeModId);

      card.innerHTML = `
        <div class="subsystem-header">
          <span class="subsystem-title">${cat.label}</span>
          <span class="c-badge badge-blue font-mono">$${comp.cost.toLocaleString()}</span>
        </div>

        <!-- Primary Subsystem Component Menu Trigger -->
        <div class="menu-trigger-box">
          <div class="menu-trigger-info">
            <span class="menu-trigger-label">Primary Module</span>
            <span class="menu-trigger-value">${comp.name}</span>
            <span class="text-muted" style="font-size:10px;">${comp.supplier} &bull; ${comp.weight} kg</span>
          </div>
          <button class="c-btn btn-ghost btn-sm btn-open-comp-menu" data-cat="${cat.key}">
            Choose Module Menu...
          </button>
        </div>

        <!-- Subcomponent Module Menu Trigger (No Dropdown) -->
        ${subData && subData.subcomponents ? `
          <div class="menu-trigger-box">
            <div class="menu-trigger-info">
              <span class="menu-trigger-label">Subcomponent Module</span>
              <span class="menu-trigger-value">${activeSub ? activeSub.name : "None Configured"}</span>
              <span class="menu-trigger-deltas">${activeSub ? `+$${activeSub.cost.toLocaleString()} &bull; ${activeSub.weight >= 0 ? "+" : ""}${activeSub.weight} kg` : ""}</span>
            </div>
            <button class="c-btn btn-ghost btn-sm btn-open-sub-menu" data-cat="${cat.key}">
              Select Subcomponent Menu...
            </button>
          </div>
        ` : ""}

        <!-- Engineering Modification Menu Trigger (No Dropdown) -->
        ${subData && subData.modifications ? `
          <div class="menu-trigger-box">
            <div class="menu-trigger-info">
              <span class="menu-trigger-label">Engineering Modification</span>
              <span class="menu-trigger-value">${activeMod ? activeMod.name : "None Configured"}</span>
              <span class="menu-trigger-deltas">${activeMod ? `+$${activeMod.cost.toLocaleString()} &bull; ${activeMod.weight >= 0 ? "+" : ""}${activeMod.weight} kg` : ""}</span>
            </div>
            <button class="c-btn btn-ghost btn-sm btn-open-mod-menu" data-cat="${cat.key}">
              Select Modification Menu...
            </button>
          </div>
        ` : ""}
      `;

      card.querySelector(".btn-open-comp-menu").onclick = () => {
        BuilderView.openPrimaryComponentMenu(cat.key, cat.label);
      };

      const subBtn = card.querySelector(".btn-open-sub-menu");
      if (subBtn) {
        subBtn.onclick = () => {
          BuilderView.openSubcomponentMenu(cat.key, cat.label);
        };
      }

      const modBtn = card.querySelector(".btn-open-mod-menu");
      if (modBtn) {
        modBtn.onclick = () => {
          BuilderView.openModificationMenu(cat.key, cat.label);
        };
      }

      container.appendChild(card);
    });
  }

  static openSelectionModal({ title, subtitle, items, activeId, onSelect }) {
    const container = document.createElement("div");

    const header = document.createElement("p");
    header.className = "text-muted";
    header.style.fontSize = "11px";
    header.style.marginBottom = "10px";
    header.textContent = subtitle;
    container.appendChild(header);

    const menuList = document.createElement("div");
    menuList.className = "catalog-menu-list";

    items.forEach(item => {
      const isSelected = item.id === activeId;
      const el = document.createElement("div");
      el.className = `catalog-menu-item ${isSelected ? "active" : ""}`;
      if (item.disabled) el.style.opacity = "0.55";

      el.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:2px; max-width:75%;">
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="font-size:12px;">${item.name}</strong>
            ${isSelected ? `<span class="c-badge badge-blue">Selected</span>` : ""}
            ${item.badge ? `<span class="c-badge badge-amber">${item.badge}</span>` : ""}
          </div>
          ${item.specs ? `<div class="text-muted" style="font-size:10px;">${item.specs}</div>` : ""}
          <div style="font-size:11px; line-height:1.3; color:var(--text-secondary); margin-top:2px;">${item.desc}</div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
          <span class="font-mono text-blue">${item.priceLabel || `$${item.cost.toLocaleString()}`}</span>
          <button class="c-btn ${isSelected ? "btn-ghost" : "btn-primary"} btn-sm" ${item.disabled ? "disabled" : ""}>
            ${isSelected ? "Active" : "Select"}
          </button>
        </div>
      `;

      el.onclick = () => {
        if (item.disabled) {
          UI.toast(item.disabledReason || "This option is currently unavailable.", "danger");
          return;
        }
        onSelect(item.id);
        UI.closeModal();
        BuilderView.render(document.getElementById("viewport-root"));
      };

      menuList.appendChild(el);
    });

    container.appendChild(menuList);

    UI.showModal({
      title,
      contentNode: container,
      actions: []
    });
  }

  static openPrimaryComponentMenu(catKey, catLabel) {
    const list = COMPONENTS_DATA[catKey];
    const items = list.map(comp => {
      const isUnlocked = !comp.inHouseTech || state.unlockedTechs.has(comp.inHouseTech);
      const reqTech = comp.inHouseTech ? state.findTechById(comp.inHouseTech) : null;
      return {
        id: comp.id,
        name: comp.name,
        cost: comp.cost,
        specs: `Supplier: ${comp.supplier} &bull; Mass: ${comp.weight} kg &bull; Delivery: ${comp.leadDays} Days`,
        desc: comp.desc,
        disabled: !isUnlocked,
        badge: !isUnlocked ? "Research Required" : null,
        disabledReason: !isUnlocked ? `Research Required: ${reqTech ? reqTech.name : "Advanced Technology"} must be unlocked first.` : null
      };
    });

    this.openSelectionModal({
      title: `Select ${catLabel}`,
      subtitle: `Choose standard or specialized ${catLabel} for this electric rolling stock configuration:`,
      items,
      activeId: this.currentSlots[catKey],
      onSelect: (id) => {
        this.currentSlots[catKey] = id;
      }
    });
  }

  static openSubcomponentMenu(catKey, catLabel) {
    const subData = SUBCOMPONENTS_DATA[catKey];
    if (!subData || !subData.subcomponents) return;

    const items = subData.subcomponents.map(sub => ({
      id: sub.id,
      name: sub.name,
      cost: sub.cost,
      priceLabel: `+$${sub.cost.toLocaleString()}`,
      specs: `Tare Mass Delta: ${sub.weight >= 0 ? "+" : ""}${sub.weight} kg`,
      desc: sub.desc,
      disabled: false
    }));

    this.openSelectionModal({
      title: `Configure ${catLabel} Subcomponent`,
      subtitle: `Choose technical internal subcomponent module for ${catLabel}:`,
      items,
      activeId: this.subSelections[catKey]?.subcomponent,
      onSelect: (id) => {
        if (!this.subSelections[catKey]) this.subSelections[catKey] = {};
        this.subSelections[catKey].subcomponent = id;
      }
    });
  }

  static openModificationMenu(catKey, catLabel) {
    const subData = SUBCOMPONENTS_DATA[catKey];
    if (!subData || !subData.modifications) return;

    const items = subData.modifications.map(mod => ({
      id: mod.id,
      name: mod.name,
      cost: mod.cost,
      priceLabel: `+$${mod.cost.toLocaleString()}`,
      specs: `Tare Mass Delta: ${mod.weight >= 0 ? "+" : ""}${mod.weight} kg`,
      desc: mod.desc,
      disabled: false
    }));

    this.openSelectionModal({
      title: `Configure ${catLabel} Engineering Modification`,
      subtitle: `Select specialized engineering modification package for ${catLabel}:`,
      items,
      activeId: this.subSelections[catKey]?.modification,
      onSelect: (id) => {
        if (!this.subSelections[catKey]) this.subSelections[catKey] = {};
        this.subSelections[catKey].modification = id;
      }
    });
  }
}