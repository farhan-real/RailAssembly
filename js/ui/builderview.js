// Industrial Engineering Computer-Aided Design View
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

  static trainName = "VoltMaster 1000";
  static trainType = "locomotive";
  static marginPercent = 22;

  static render(container) {
    const stats = TrainModelCalc.calculateTrainStats(this.currentSlots);

    container.innerHTML = `
      <div class="cad-container">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <h2 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Engineering CAD &bull; Electric Rolling Stock Integration</h2>
            <span class="text-muted" style="font-size:11px;">Configure high-voltage traction, bogies, carbody structure and control units</span>
          </div>
          <button class="c-btn btn-primary" id="btn-save-variant">Save and Commission Blueprint</button>
        </div>

        <div class="train-schematic-wrap" id="schematic-viewport">
          ${TrainSVGBuilder.renderParametricTrain(this.currentSlots)}
        </div>

        <div class="view-grid-three">
          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Estimated Speed Rating</span>
            <div class="font-mono text-blue" style="font-size:15px; margin:2px 0;">
              ${stats.roughSpeedMin} &sim; ${stats.roughSpeedMax} Kilometers per Hour
            </div>
            <span class="text-muted" style="font-size:10px;">Requires test bench verification for certification</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Axle Load Verification</span>
            <div class="font-mono ${stats.axleOverloaded ? "text-negative" : "text-positive"}" style="font-size:15px; margin:2px 0;">
              ${stats.axleLoad} Metric Tons per Axle
            </div>
            <span class="text-muted" style="font-size:10px;">Bogie Maximum: ${stats.maxAllowedAxleLoad} Metric Tons (${stats.axles} Axles)</span>
          </div>

          <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Bill of Materials Hardware Cost</span>
            <div class="font-mono text-warning" style="font-size:15px; margin:2px 0;">
              $${stats.bomCost.toLocaleString()}
            </div>
            <span class="text-muted" style="font-size:10px;">Direct hardware component cost per unit</span>
          </div>
        </div>
      </div>

      <div class="c-card">
        <div class="card-header">
          <span class="card-title">Component Subsystem Architecture</span>
        </div>
        <div class="slot-grid" id="slots-selector-container"></div>
      </div>
    `;

    this.renderSlotSelectors();

    document.getElementById("btn-save-variant").onclick = () => {
      if (stats.axleOverloaded) {
        UI.toast("Axle Overload Error: Train total weight exceeds bogie structural load limit.", "danger");
        return;
      }
      const newVar = TrainModelCalc.createVariant(this.trainName, this.trainType, this.currentSlots, this.marginPercent);
      state.variants.push(newVar);
      UI.toast(`Blueprint "${newVar.name}" commissioned to Fleet Catalog.`, "success");
      Events.emit("navTo", "catalog");
    };
  }

  static renderSlotSelectors() {
    const container = document.getElementById("slots-selector-container");
    container.innerHTML = "";

    const categories = [
      { key: "pantograph", label: "Pantograph Collector" },
      { key: "transformer", label: "Main Traction Transformer" },
      { key: "inverter", label: "Traction Inverter / Converter" },
      { key: "motor", label: "Traction Motor Type" },
      { key: "bogie", label: "Bogie and Wheelset Assembly" },
      { key: "carbody", label: "Carbody Shell and Aerodynamics" },
      { key: "brakes", label: "Braking and Energy Recovery" },
      { key: "battery", label: "Auxiliary Energy Storage" },
      { key: "tcms", label: "Train Control and Monitoring System" }
    ];

    categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "slot-card";

      const header = document.createElement("div");
      header.className = "slot-header";
      header.innerHTML = `<span class="slot-name">${cat.label}</span>`;
      card.appendChild(header);

      const selectWrap = document.createElement("div");
      selectWrap.style.display = "flex";
      selectWrap.style.flexDirection = "column";
      selectWrap.style.gap = "4px";

      COMPONENTS_DATA[cat.key].forEach(comp => {
        const isUnlocked = !comp.inHouseTech || state.unlockedTechs.has(comp.inHouseTech);
        const isSelected = this.currentSlots[cat.key] === comp.id;

        const optBtn = document.createElement("button");
        optBtn.className = `c-btn ${isSelected ? "btn-primary" : "btn-ghost"} btn-sm`;
        optBtn.style.justifyContent = "space-between";
        optBtn.style.width = "100%";
        if (!isUnlocked) {
          optBtn.disabled = true;
          const reqTech = state.findTechById(comp.inHouseTech);
          optBtn.title = `Research Required: ${reqTech ? reqTech.name : "Advanced Technology"}`;
        }

        optBtn.innerHTML = `
          <span>${comp.name}</span>
          <span class="font-mono text-muted">$${comp.cost.toLocaleString()}</span>
        `;

        optBtn.onclick = () => {
          this.currentSlots[cat.key] = comp.id;
          BuilderView.render(document.getElementById("viewport-root"));
        };

        selectWrap.appendChild(optBtn);
      });

      card.appendChild(selectWrap);
      container.appendChild(card);
    });
  }
}