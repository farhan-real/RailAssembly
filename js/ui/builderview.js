// Industrial Engineering CAD View: Multi-Component Slots, Subcomponents & Diagnostics
class BuilderView {
  static editingVariantId = null;
  static rollingStockType = "trainset";
  static isMakingVariant = false;
  static currentBaseModelId = null;
  static currentBaseModelName = null;

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
    pantograph: "panto_schunk_wbl85",
    circuitbreaker: "vcb_vacuum_ac",
    transformer: "trans_heavy",
    dclink: "dclink_polypropylene_film",
    inverter: "inv_igbt_air",
    pwm: "pwm_space_vector_svm",
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
    pantograph: { subcomponent: "cs_carbon_rh84", modification: "act_pneumatic_bellows" },
    transformer: { subcomponent: "wind_copper", modification: "cool_mineral" },
    inverter: { subcomponent: "gd_optical", modification: "therm_coldplate" },
    pwm: { subcomponent: "pwm_dsp_dualcore", modification: "pwm_spread_spectrum" },
    motor: { subcomponent: "gb_single", modification: "brg_ceramic" },
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
    this.isMakingVariant = Boolean(variant.isVariant);
    this.currentBaseModelId = variant.baseModelId || variant.id;
    this.currentBaseModelName = variant.baseModelName || variant.name;
    this.currentSlots = JSON.parse(JSON.stringify(variant.slots));
    this.subSelections = JSON.parse(JSON.stringify(variant.subSelections || {}));
    this.consistConfig = variant.consistConfig ? JSON.parse(JSON.stringify(variant.consistConfig)) : { carriageCount: 4, carriages: [] };
  }

  static startMakingVariant(baseModel) {
    this.isMakingVariant = true;
    this.currentBaseModelId = baseModel.id;
    this.currentBaseModelName = baseModel.name;
    this.editingVariantId = null;

    const existingVariantsCount = state.variants.filter(v => v.baseModelId === baseModel.id).length;
    const variantLetter = String.fromCharCode(65 + existingVariantsCount);
    this.trainName = `${baseModel.name} (Variant ${variantLetter})`;
    this.rollingStockType = baseModel.type;
    this.marginPercent = baseModel.marginPercent || 22;
    this.currentSlots = JSON.parse(JSON.stringify(baseModel.slots));
    this.subSelections = JSON.parse(JSON.stringify(baseModel.subSelections || {}));
    this.consistConfig = baseModel.consistConfig ? JSON.parse(JSON.stringify(baseModel.consistConfig)) : null;

    BuilderView.render(document.getElementById("viewport-root"));
    UI.toast(`Configuring variant of "${baseModel.name}".`, "normal");
  }

  static render(container) {
    const stats = TrainModelCalc.calculateTrainStats(this.currentSlots, this.subSelections, this.rollingStockType, this.consistConfig);
    const diag = stats.diagnostics;
    const laborCost = this.rollingStockType === "trainset" ? stats.carriageCount * 45000 : 140000;

    container.innerHTML = `
      <div class="cad-container">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle); flex-wrap:wrap; gap:10px; min-width:0;">
          <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0; flex-wrap:wrap;">
            <div class="type-segmented-control" style="flex-shrink:0;">
              <button class="type-segmented-btn ${this.rollingStockType === "locomotive" ? "active" : ""}" id="btn-type-locomotive">Locomotive</button>
              <button class="type-segmented-btn ${this.rollingStockType === "trainset" ? "active" : ""}" id="btn-type-trainset">Trainset</button>
            </div>
            <input type="text" class="c-input-custom" id="input-variant-name" value="${this.trainName}" placeholder="Enter Model Name" style="min-width:140px; flex:1; max-width:260px;">
            ${this.isMakingVariant ? `
              <div class="variant-indicator-banner">
                <span class="c-badge badge-blue">Making variant of: <strong>${this.currentBaseModelName}</strong></span>
                <button class="c-btn btn-ghost btn-sm" id="btn-cancel-variant" style="padding:2px 6px;">✕</button>
              </div>
            ` : ""}
          </div>
          <div style="display:flex; gap:6px; flex-shrink:0;">
            ${(!this.isMakingVariant && this.currentBaseModelName) ? `
              <button class="c-btn btn-ghost btn-sm" id="btn-toolbar-make-variant">+ Make Variant</button>
            ` : ""}
            <button class="c-btn btn-ghost btn-sm" id="btn-design-archive">Archive / Presets...</button>
            <button class="c-btn btn-primary" id="btn-save-variant">Save</button>
          </div>
        </div>

        ${this.rollingStockType === "trainset" ? `
          <div class="consist-summary-banner" style="min-width:0;">
            <div>
              <strong style="font-size:12px;">Trainset Architecture:</strong>
              <span class="text-blue font-mono" style="font-size:12px; margin-left:6px;">
                ${stats.carriageCount} Carriages (${stats.poweredCarCount} Powered, ${stats.trailerCarCount} Trailer)
              </span>
              <div class="text-muted" style="font-size:10px; margin-top:2px;">
                Seating: ${stats.passengerCap} Passengers &bull; Adhesion Ratio: ${((stats.poweredCarCount / stats.carriageCount) * 100).toFixed(0)}%
              </div>
            </div>
            <button class="c-btn btn-ghost btn-sm" id="btn-configure-consist">Customize Carriages &amp; Consist...</button>
          </div>
        ` : ""}

        <div class="view-grid-four" style="margin-bottom:12px;">
          <div class="stat-card-clickable" data-guide="speed" style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Top Speed &bull; Acceleration</span>
              <span class="stat-hint-tag">Inspect &rarr;</span>
            </div>
            <div class="font-mono text-blue" style="font-size:13px; margin:2px 0;">
              ${stats.theoreticalSpeed} km/h &bull; ${stats.acceleration.toFixed(2)} m/s²
            </div>
            <div class="text-muted" style="font-size:9px; display:flex; justify-content:space-between;">
              <span>Adhesion: &mu; ${(stats.totalAdhesionCoeff || 0.38).toFixed(3)}</span>
              <span>Adhesive Mass: ${(stats.adhesiveMassTons || stats.totalMassTons).toFixed(1)} t</span>
            </div>
          </div>

          <div class="stat-card-clickable" data-guide="power" style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Net Traction Power</span>
              <span class="stat-hint-tag">Inspect &rarr;</span>
            </div>
            <div class="font-mono text-blue" style="font-size:13px; margin:2px 0;">
              ${stats.availablePowerKw.toLocaleString()} kW (${stats.horsepower.toLocaleString()} hp)
            </div>
            <span class="text-muted" style="font-size:9px;">Powertrain Efficiency: ${(stats.totalEfficiency * 100).toFixed(1)}%</span>
          </div>

          <div class="stat-card-clickable" data-guide="axleload" style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Axle Load &bull; Gross Mass</span>
              <span class="stat-hint-tag">Inspect &rarr;</span>
            </div>
            <div class="font-mono ${stats.axleOverloaded ? "text-negative" : "text-positive"}" style="font-size:13px; margin:2px 0;">
              ${stats.axleLoad.toFixed(2)} t / Axle (Limit: ${stats.maxAllowedAxleLoad.toFixed(1)} t)
            </div>
            <span class="text-muted" style="font-size:9px;">Consist Mass: ${stats.totalMassTons.toFixed(1)} Metric Tons</span>
          </div>

          <div class="stat-card-clickable" data-guide="cost" style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); min-width:0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Consist BOM Cost</span>
              <span class="stat-hint-tag">Inspect &rarr;</span>
            </div>
            <div class="font-mono text-warning" style="font-size:13px; margin:2px 0;">
              $${stats.bomCost.toLocaleString()}
            </div>
            <span class="text-muted" style="font-size:9px;">Assembly Labor: +$${laborCost.toLocaleString()}</span>
          </div>
        </div>

        <div style="background:rgba(0,0,0,0.25); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); padding:8px 12px; margin-bottom:14px; min-width:0;">
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

    document.querySelectorAll(".stat-card-clickable").forEach(card => {
      card.onclick = () => {
        const guideKey = card.getAttribute("data-guide");
        StatGuideView.show(guideKey, BuilderView);
      };
    });

    const btnMakeVar = document.getElementById("btn-toolbar-make-variant");
    if (btnMakeVar) {
      btnMakeVar.onclick = () => {
        const currentModel = state.variants.find(v => v.id === this.editingVariantId) || {
          id: "var_" + Date.now().toString(36),
          name: this.trainName,
          type: this.rollingStockType,
          slots: this.currentSlots,
          subSelections: this.subSelections,
          consistConfig: this.consistConfig,
          marginPercent: this.marginPercent
        };
        BuilderView.startMakingVariant(currentModel);
      };
    }

    const btnCancelVar = document.getElementById("btn-cancel-variant");
    if (btnCancelVar) {
      btnCancelVar.onclick = () => {
        this.isMakingVariant = false;
        BuilderView.render(document.getElementById("viewport-root"));
      };
    }

    const cfgConsist = document.getElementById("btn-configure-consist");
    if (cfgConsist) cfgConsist.onclick = () => ConsistView.openConsistModal(this);

    document.getElementById("btn-save-variant").onclick = () => {
      const stats = TrainModelCalc.calculateTrainStats(this.currentSlots, this.subSelections, this.rollingStockType, this.consistConfig);
      if (stats.axleOverloaded) {
        UI.toast("Axle Load Breach: Train tare weight exceeds bogie structural load limit.", "danger");
        return;
      }

      const isVar = this.isMakingVariant;
      const baseInfo = {
        isVariant: isVar,
        baseModelId: isVar ? this.currentBaseModelId : null,
        baseModelName: isVar ? this.currentBaseModelName : null
      };

      const variantId = (!isVar && this.editingVariantId) ? this.editingVariantId : ("var_" + Date.now().toString(36));
      const variant = TrainModelCalc.createVariant(this.trainName, this.rollingStockType, this.currentSlots, this.subSelections, this.consistConfig, this.marginPercent, baseInfo);
      variant.id = variantId;

      state.saveVariant(variant);
      this.editingVariantId = variant.id;
      this.currentBaseModelId = variant.id;
      this.currentBaseModelName = variant.name;
      this.isMakingVariant = false;

      UI.showModal({
        title: `Train Model Saved: ${variant.name}`,
        contentNode: `
          <div style="font-size:12px; line-height:1.45; color:var(--text-main);">
            <p>Model <strong>"${variant.name}"</strong> has been saved to your Fleet Catalog.</p>
            <p class="text-muted" style="font-size:11px; margin-top:6px;">You can now produce units, engineer specialized variants, or inspect the catalog:</p>
          </div>
        `,
        actions: [
          {
            label: "+ Make Variant",
            className: "btn-ghost",
            onClick: () => BuilderView.startMakingVariant(variant)
          },
          {
            label: "View in Fleet Catalog",
            className: "btn-primary",
            onClick: () => Events.emit("navTo", "catalog")
          }
        ]
      });

      BuilderView.render(document.getElementById("viewport-root"));
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
      { key: "pwm", label: "Traction PWM & Modulation Controller", required: true },
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
      const subData = SUBCOMPONENTS_DATA[cat.key];

      const currentSub = this.subSelections[cat.key] || {};
      const activeSubObj = subData?.subcomponents?.find(s => s.id === currentSub.subcomponent);
      const activeModObj = subData?.modifications?.find(m => m.id === currentSub.modification);

      card.innerHTML = `
        <div class="subsystem-header">
          <span class="subsystem-title">${cat.label}</span>
          <span class="c-badge ${isNone ? "badge-amber" : "badge-blue"} font-mono">
            ${isNone ? "Unequipped" : `$${comp.cost.toLocaleString()}`}
          </span>
        </div>

        <div class="menu-trigger-box">
          <div class="menu-trigger-info">
            <div class="menu-trigger-row">
              <span class="menu-trigger-value">${comp ? comp.name : "None (Unequipped)"}</span>
              <button class="c-btn btn-ghost btn-sm btn-open-comp-menu" data-cat="${cat.key}">
                ${isNone ? "Equip Module..." : "Change Module..."}
              </button>
            </div>
            <div class="menu-trigger-sub">
              <span class="menu-trigger-label">${cat.required ? "Mandatory System" : "Configurable Option"}</span>
              <span class="text-muted" style="font-size:10px;">${comp && comp.weight ? `${comp.supplier} &bull; ${comp.weight} kg` : "Zero Weight &bull; No Cost"}</span>
            </div>
          </div>
        </div>

        ${subData ? `
          <div class="subsystem-sub-controls">
            ${subData.subcomponents && subData.subcomponents.length > 0 ? `
              <div class="sub-control-chip">
                <div class="sub-control-info">
                  <span class="sub-control-label">Sub-Component:</span>
                  <span class="sub-control-name">${activeSubObj ? activeSubObj.name : "Standard Architecture"}</span>
                </div>
                <button class="c-btn btn-ghost btn-sm btn-config-sub" data-cat="${cat.key}">Config...</button>
              </div>
            ` : ""}
            ${subData.modifications && subData.modifications.length > 0 ? `
              <div class="sub-control-chip">
                <div class="sub-control-info">
                  <span class="sub-control-label">Mod / Package:</span>
                  <span class="sub-control-name">${activeModObj ? activeModObj.name : "Standard Package"}</span>
                </div>
                <button class="c-btn btn-ghost btn-sm btn-config-mod" data-cat="${cat.key}">Config...</button>
              </div>
            ` : ""}
          </div>
        ` : ""}
      `;

      card.querySelector(".btn-open-comp-menu").onclick = () => BuilderView.openPrimaryComponentMenu(cat.key, cat.label);

      const subBtn = card.querySelector(".btn-config-sub");
      if (subBtn) subBtn.onclick = () => SubcompView.open(cat.key, false, BuilderView);

      const modBtn = card.querySelector(".btn-config-mod");
      if (modBtn) modBtn.onclick = () => SubcompView.open(cat.key, true, BuilderView);

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
        badge: !isUnlocked ? "Research Tree Locked" : (comp.isOptional ? "Optional" : null)
      };
    });

    UI.openSelectionModal({
      title: `Select ${catLabel}`,
      subtitle: `Choose standard, high-performance, or unequipped configuration:`,
      items,
      activeId: this.currentSlots[catKey],
      onSelect: (id) => {
        this.currentSlots[catKey] = id;
        BuilderView.render(document.getElementById("viewport-root"));
      }
    });
  }
}