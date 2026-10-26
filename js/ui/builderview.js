// Industrial Engineering CAD View: Multi-Component Slots, Limits & Electrical Diagnostics
class BuilderView {
  static editingVariantId = null;
  static rollingStockType = "trainset";

  static consistConfig = {
    carriageCount: 4,
    carriages: [
      { index: 1, typeId: "driving_motor", name: "Car 1: Driving Motor Coach", isPowered: true },
      { index: 2, typeId: "intermediate_motor", name: "Car 2: Intermediate Motor Coach", isPowered: true },
      { index: 3, typeId: "intermediate_trailer", name: "Car 3: Intermediate Trailer Coach", isPowered: false },
      { index: 4, typeId: "driving_trailer", name: "Car 4: Driving Trailer Coach", isPowered: false }
    ]
  };

  static currentSlots = {
    pantograph: "panto_std",
    circuitbreaker: "vcb_vacuum_ac",
    transformer: "trans_heavy",
    dclink: "dclink_polypropylene_film",
    inverter: "inv_igbt_air",
    motor: "mot_ind_basic",
    transmission: "transm_quill_hollow",
    auxiliary: "aux_std_static",
    cooling: "cool_oil_radiator",
    compressor: "comp_screw_rotary",
    sander: "sand_gravity_basic",
    coupler: "coup_tightlock_h",
    bogie: "bog_bo_bo",
    carbody: "body_aluminum",
    brakes: "brk_disc_regen",
    hvac: "hvac_standard_pack",
    resistor: "res_none",
    battery: "bat_none",
    tcms: "tcms_basic",
    safety: "wsp_microprocessor"
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

  static trainName = "VoltMaster Series 1";
  static marginPercent = 22;

  static loadVariantForEditing(variant) {
    this.editingVariantId = variant.id;
    this.trainName = variant.name;
    this.rollingStockType = variant.type;
    this.marginPercent = variant.marginPercent || 22;
    this.currentSlots = JSON.parse(JSON.stringify(variant.slots));
    this.subSelections = JSON.parse(JSON.stringify(variant.subSelections));
    this.consistConfig = variant.consistConfig ? JSON.parse(JSON.stringify(variant.consistConfig)) : { carriageCount: 4, carriages: [] };
  }

  static render(container) {
    const stats = TrainModelCalc.calculateTrainStats(this.currentSlots, this.subSelections, this.rollingStockType, this.consistConfig);
    const diag = stats.diagnostics;

    container.innerHTML = `
      <div class="cad-container">
        <!-- Top Toolbar -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle); flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:300px;">
            <div class="type-segmented-control">
              <button class="type-segmented-btn ${this.rollingStockType === "locomotive" ? "active" : ""}" id="btn-type-locomotive">Locomotive</button>
              <button class="type-segmented-btn ${this.rollingStockType === "trainset" ? "active" : ""}" id="btn-type-trainset">Trainset</button>
            </div>
            <input type="text" class="c-input-custom" id="input-variant-name" value="${this.trainName}" placeholder="Enter Custom Variant Name" style="max-width:280px;">
          </div>
          <div style="display:flex; gap:6px;">
            <button class="c-btn btn-ghost btn-sm" id="btn-design-archive">Archive / Presets...</button>
            <button class="c-btn btn-primary" id="btn-save-variant">
              ${this.editingVariantId ? "Update Variant in Catalog" : "Save as New Variant"}
            </button>
          </div>
        </div>

        ${this.rollingStockType === "trainset" ? `
          <div class="consist-summary-banner">
            <div>
              <strong style="font-size:12px;">Trainset Architecture:</strong>
              <span class="text-blue font-mono" style="font-size:12px; margin-left:6px;">
                ${stats.carriageCount} Carriages (${stats.poweredCarCount} Powered, ${stats.trailerCarCount} Trailer)
              </span>
              <div class="text-muted" style="font-size:10px; margin-top:2px;">
                Seating: ${stats.passengerCap} Passengers &bull; Adhesion Ratio: ${Math.round((stats.poweredCarCount / stats.carriageCount) * 100)}%
              </div>
            </div>
            <button class="c-btn btn-ghost btn-sm" id="btn-configure-consist">Customize Carriages &amp; Consist...</button>
          </div>
        ` : ""}

        <!-- Physical Telemetry Grid -->
        <div class="view-grid-four" style="margin-bottom:12px;">
          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Top Speed &bull; Acceleration</span>
            <div class="font-mono text-blue" style="font-size:13px; margin:2px 0;">
              ${stats.roughSpeedMin} &sim; ${stats.roughSpeedMax} km/h &bull; ${stats.acceleration} m/s²
            </div>
            <span class="text-muted" style="font-size:9px;">Adhesion Force: ${stats.maxAdhesionKn} kN</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Net Traction Power</span>
            <div class="font-mono text-blue" style="font-size:13px; margin:2px 0;">
              ${stats.availablePowerKw} kW (${stats.horsepower.toLocaleString()} hp)
            </div>
            <span class="text-muted" style="font-size:9px;">Efficiency: ${Math.round(stats.totalEfficiency * 100)}%</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Axle Load &bull; Gross Mass</span>
            <div class="font-mono ${stats.axleOverloaded ? "text-negative" : "text-positive"}" style="font-size:13px; margin:2px 0;">
              ${stats.axleLoad} t / Axle (Limit: ${stats.maxAllowedAxleLoad} t)
            </div>
            <span class="text-muted" style="font-size:9px;">Consist Mass: ${stats.totalMassTons} Metric Tons</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Consist BOM Cost</span>
            <div class="font-mono text-warning" style="font-size:13px; margin:2px 0;">
              $${stats.bomCost.toLocaleString()}
            </div>
            <span class="text-muted" style="font-size:9px;">Direct hardware component sum</span>
          </div>
        </div>

        <!-- Electrical Chain & Physical Limit Diagnostics Panel -->
        <div style="background:rgba(0,0,0,0.25); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); padding:8px 12px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-secondary);">Electrical Chain &amp; System Limits Diagnostic</span>
            <span class="c-badge ${diag.isFullySufficient ? "badge-green" : "badge-amber"}">
              ${diag.isFullySufficient ? "Supply Chain Sufficient" : "Limits / Bottlenecks Detected"}
            </span>
          </div>
          <div style="font-size:11px; display:flex; flex-direction:column; gap:3px;">
            <div>
              <span class="text-muted">Primary Speed Ceiling:</span>
              <strong class="font-mono text-blue">${diag.strictSpeedLimit} km/h</strong>
              <span class="text-muted"> (Limited by ${diag.primarySpeedLimiter.component})</span>
            </div>
            ${diag.bottlenecks.map(b => `<div class="text-warning" style="font-size:10px;">&bull; ${b}</div>`).join("")}
          </div>
        </div>

        <div class="view-grid-three" id="subsystem-cards-container"></div>
      </div>
    `;

    this.bindToolbarEvents();
    this.renderSubsystemCards();
  }

  static bindToolbarEvents() {
    const inputName = document.getElementById("input-variant-name");
    inputName.oninput = (e) => { this.trainName = e.target.value.trim() || "VoltRunner Custom"; };

    document.getElementById("btn-type-locomotive").onclick = () => {
      this.rollingStockType = "locomotive";
      BuilderView.render(document.getElementById("viewport-root"));
    };
    document.getElementById("btn-type-trainset").onclick = () => {
      this.rollingStockType = "trainset";
      BuilderView.render(document.getElementById("viewport-root"));
    };
    document.getElementById("btn-design-archive").onclick = () => DesignView.openDesignManager(this);

    const cfgConsist = document.getElementById("btn-configure-consist");
    if (cfgConsist) cfgConsist.onclick = () => ConsistView.openConsistModal(this);

    document.getElementById("btn-save-variant").onclick = () => {
      const stats = TrainModelCalc.calculateTrainStats(this.currentSlots, this.subSelections, this.rollingStockType, this.consistConfig);
      if (stats.axleOverloaded) {
        UI.toast("Axle Load Breach: Train tare weight exceeds bogie structural load limit.", "danger");
        return;
      }

      const variantId = this.editingVariantId || ("var_" + Date.now().toString(36));
      const variant = TrainModelCalc.createVariant(this.trainName, this.rollingStockType, this.currentSlots, this.subSelections, this.consistConfig, this.marginPercent);
      variant.id = variantId;

      state.saveVariant(variant);
      UI.toast(`Variant "${variant.name}" saved and updated in Fleet Catalog.`, "success");
      this.editingVariantId = null;
      Events.emit("navTo", "catalog");
    };
  }

  static renderSubsystemCards() {
    const container = document.getElementById("subsystem-cards-container");
    container.innerHTML = "";

    const categories = [
      { key: "pantograph", label: "Pantograph Collector System", required: true },
      { key: "circuitbreaker", label: "Main Vacuum Circuit Breaker (VCB)", required: true },
      { key: "transformer", label: "Main Traction Transformer / Filter", required: true },
      { key: "dclink", label: "DC Intermediate Link & Capacitor Bank", required: true },
      { key: "inverter", label: "Traction Inverter / Converter", required: true },
      { key: "motor", label: "Traction Motors", required: true },
      { key: "transmission", label: "Final Drive Transmission & Gearbox", required: true },
      { key: "cooling", label: "Thermal Cooling & Radiator Loop", required: true },
      { key: "compressor", label: "Pneumatic Air Supply & Drying", required: true },
      { key: "bogie", label: "Bogie & Running Gear Assembly", required: true },
      { key: "carbody", label: "Carbody Shell Architecture", required: true },
      { key: "coupler", label: "Coupler & Inter-Car Gangway", required: true },
      { key: "brakes", label: "Braking & Recovery System", required: true },
      { key: "sander", label: "Rail Adhesion & Sanding Gear", required: false },
      { key: "auxiliary", label: "Auxiliary Power Converter (APS)", required: false },
      { key: "hvac", label: "Passenger Climate & HVAC System", required: false },
      { key: "resistor", label: "Dynamic Resistor Grid (Optional)", required: false },
      { key: "battery", label: "Auxiliary Battery Pack (Optional)", required: false },
      { key: "safety", label: "Wheel Slide Protection & Surge Diverter", required: true },
      { key: "tcms", label: "TCMS Control Network", required: true }
    ];

    categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "subsystem-card";

      const comp = state.findComponentById(this.currentSlots[cat.key]) || COMPONENTS_DATA[cat.key]?.[0];
      const isNone = !comp || comp.cost === 0;

      card.innerHTML = `
        <div class="subsystem-header">
          <span class="subsystem-title">${cat.label}</span>
          <span class="c-badge ${isNone ? "badge-amber" : "badge-blue"} font-mono">
            ${isNone ? "Unequipped" : `$${comp.cost.toLocaleString()}`}
          </span>
        </div>

        <div class="menu-trigger-box">
          <div class="menu-trigger-info">
            <span class="menu-trigger-label">${cat.required ? "Mandatory System" : "Configurable Option"}</span>
            <span class="menu-trigger-value">${comp ? comp.name : "None (Unequipped)"}</span>
            <span class="text-muted" style="font-size:10px;">${comp && comp.weight ? `${comp.supplier} &bull; ${comp.weight} kg` : "Zero Weight &bull; No Cost"}</span>
          </div>
          <button class="c-btn btn-ghost btn-sm btn-open-comp-menu" data-cat="${cat.key}">
            ${isNone ? "Equip Module..." : "Change Module..."}
          </button>
        </div>
      `;

      card.querySelector(".btn-open-comp-menu").onclick = () => BuilderView.openPrimaryComponentMenu(cat.key, cat.label);
      container.appendChild(card);
    });
  }

  static openPrimaryComponentMenu(catKey, catLabel) {
    const list = COMPONENTS_DATA[catKey] || [];
    const items = list.map(comp => {
      const isUnlocked = !comp.inHouseTech || state.unlockedTechs.has(comp.inHouseTech);
      return {
        id: comp.id,
        name: comp.name,
        cost: comp.cost,
        specs: comp.weight ? `Supplier: ${comp.supplier} &bull; Mass: ${comp.weight} kg &bull; Delivery: ${comp.leadDays} Days` : "Zero Tare Weight",
        desc: comp.desc,
        disabled: !isUnlocked,
        badge: !isUnlocked ? "Research Required" : (comp.isOptional ? "Optional" : null)
      };
    });

    this.openSelectionModal({
      title: `Select ${catLabel}`,
      subtitle: `Choose standard, high-performance, or unequipped configuration:`,
      items,
      activeId: this.currentSlots[catKey],
      onSelect: (id) => { this.currentSlots[catKey] = id; }
    });
  }

  static openSelectionModal({ title, subtitle, items, activeId, onSelect }) {
    const container = document.createElement("div");
    container.innerHTML = `<p class="text-muted" style="font-size:11px; margin-bottom:10px;">${subtitle}</p>`;
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
        if (item.disabled) { UI.toast("Option unavailable: Research required in R&D Directorate.", "danger"); return; }
        onSelect(item.id);
        UI.closeModal();
        BuilderView.render(document.getElementById("viewport-root"));
      };
      menuList.appendChild(el);
    });

    container.appendChild(menuList);
    UI.showModal({ title, contentNode: container, actions: [] });
  }
}