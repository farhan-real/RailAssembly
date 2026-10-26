// Industrial Engineering Computer-Aided Design View (No Visuals, Menu Selection & Subcomponents)
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
            <span class="text-muted" style="font-size:11px;">Configure primary traction modules, subcomponents, and engineering modifications</span>
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

      card.innerHTML = `
        <div class="subsystem-header">
          <span class="subsystem-title">${cat.label}</span>
          <span class="c-badge badge-blue font-mono">$${comp.cost.toLocaleString()}</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-weight:600; font-size:12px;">${comp.name}</div>
            <div class="text-muted" style="font-size:10px; margin-top:2px;">Supplier: ${comp.supplier} &bull; Mass: ${comp.weight} kg</div>
          </div>
          <button class="c-btn btn-ghost btn-sm btn-open-menu" data-cat="${cat.key}">
            Select from Menu...
          </button>
        </div>

        ${subData ? `
          <div style="display:flex; flex-direction:column; gap:6px; margin-top:4px;">
            ${subData.subcomponents ? `
              <div class="subcomponent-box">
                <span class="subcomponent-label">Subcomponent Module</span>
                <select class="c-select-custom subcomp-select" data-cat="${cat.key}" data-type="subcomponent">
                  ${subData.subcomponents.map(s => `
                    <option value="${s.id}" ${this.subSelections[cat.key]?.subcomponent === s.id ? "selected" : ""}>
                      ${s.name} (+$${s.cost.toLocaleString()})
                    </option>
                  `).join("")}
                </select>
              </div>
            ` : ""}

            ${subData.modifications ? `
              <div class="subcomponent-box">
                <span class="subcomponent-label">Engineering Modification</span>
                <select class="c-select-custom mod-select" data-cat="${cat.key}" data-type="modification">
                  ${subData.modifications.map(m => `
                    <option value="${m.id}" ${this.subSelections[cat.key]?.modification === m.id ? "selected" : ""}>
                      ${m.name} (+$${m.cost.toLocaleString()})
                    </option>
                  `).join("")}
                </select>
              </div>
            ` : ""}
          </div>
        ` : ""}
      `;

      card.querySelector(".btn-open-menu").onclick = () => {
        BuilderView.openCatalogMenu(cat.key, cat.label);
      };

      card.querySelectorAll(".c-select-custom").forEach(select => {
        select.onchange = (e) => {
          const catKey = e.target.getAttribute("data-cat");
          const type = e.target.getAttribute("data-type");
          if (!this.subSelections[catKey]) this.subSelections[catKey] = {};
          this.subSelections[catKey][type] = e.target.value;
          BuilderView.render(document.getElementById("viewport-root"));
        };
      });

      container.appendChild(card);
    });
  }

  static openCatalogMenu(catKey, catLabel) {
    const list = COMPONENTS_DATA[catKey];
    const container = document.createElement("div");

    const header = document.createElement("p");
    header.className = "text-muted";
    header.style.fontSize = "11px";
    header.style.marginBottom = "10px";
    header.textContent = `Choose standard or specialized ${catLabel} for this electric rolling stock configuration:`;
    container.appendChild(header);

    const menuList = document.createElement("div");
    menuList.className = "catalog-menu-list";

    list.forEach(comp => {
      const isUnlocked = !comp.inHouseTech || state.unlockedTechs.has(comp.inHouseTech);
      const isSelected = this.currentSlots[catKey] === comp.id;

      const item = document.createElement("div");
      item.className = `catalog-menu-item ${isSelected ? "active" : ""}`;
      if (!isUnlocked) item.style.opacity = "0.55";

      item.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:2px; max-width:75%;">
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="font-size:12px;">${comp.name}</strong>
            ${isSelected ? `<span class="c-badge badge-blue">Selected</span>` : ""}
            ${!isUnlocked ? `<span class="c-badge badge-amber">Research Required</span>` : ""}
          </div>
          <div class="text-muted" style="font-size:10px;">Supplier: ${comp.supplier} &bull; Mass: ${comp.weight} kg &bull; Delivery: ${comp.leadDays} Days</div>
          <div style="font-size:11px; line-height:1.3; color:var(--text-secondary); margin-top:2px;">${comp.desc}</div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
          <span class="font-mono text-blue">$${comp.cost.toLocaleString()}</span>
          <button class="c-btn ${isSelected ? "btn-ghost" : "btn-primary"} btn-sm" ${!isUnlocked ? "disabled" : ""}>
            ${isSelected ? "Active" : "Select"}
          </button>
        </div>
      `;

      item.onclick = () => {
        if (!isUnlocked) {
          const reqTech = state.findTechById(comp.inHouseTech);
          UI.toast(`Research Required: ${reqTech ? reqTech.name : "Advanced Technology"} must be unlocked first.`, "danger");
          return;
        }
        this.currentSlots[catKey] = comp.id;
        UI.closeModal();
        BuilderView.render(document.getElementById("viewport-root"));
      };

      menuList.appendChild(item);
    });

    container.appendChild(menuList);

    UI.showModal({
      title: `Select ${catLabel}`,
      contentNode: container,
      actions: []
    });
  }
}