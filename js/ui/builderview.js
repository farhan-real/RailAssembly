// Train Customizer, Parametric Preview, Slot Selector, and Dynamic Testing Bench
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
  static marginPercent = 25;

  static render(container) {
    const stats = TrainModelCalc.calculateTrainStats(this.currentSlots);

    container.innerHTML = `
      <div class="blueprint-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <h2 class="text-cyan font-mono" style="font-size:18px;">ELECTRIC INTEGRATION CAD</h2>
            <span class="text-muted" style="font-size:11px;">100% Zero-Emission High Voltage Rolling Stock Architecture</span>
          </div>
          <button class="c-btn btn-primary" id="btn-save-variant">Save &amp; Commission Model</button>
        </div>

        <div class="train-schematic-wrap" id="schematic-viewport">
          ${TrainSVGBuilder.renderParametricTrain(this.currentSlots)}
        </div>

        <div class="view-grid-three" style="margin-top:14px;">
          <div style="background:var(--bg-darker); padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:11px;">ESTIMATED TOP SPEED</span>
            <div class="font-mono text-cyan" style="font-size:16px; margin:4px 0;">
              ${stats.roughSpeedMin} ~ ${stats.roughSpeedMax} km/h
            </div>
            <span class="text-muted" style="font-size:10px;">Requires Test Track Run for Certification</span>
          </div>

          <div style="background:var(--bg-darker); padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:11px;">AXLE LOAD &amp; LIMIT</span>
            <div class="font-mono ${stats.axleOverloaded ? "text-red" : "text-accent"}" style="font-size:16px; margin:4px 0;">
              ${stats.axleLoad} t / axle
            </div>
            <span class="text-muted" style="font-size:10px;">Max Allowed: ${stats.maxAllowedAxleLoad} t (${stats.axles} Axles)</span>
          </div>

          <div style="background:var(--bg-darker); padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:11px;">BILL OF MATERIALS (BOM)</span>
            <div class="font-mono text-amber" style="font-size:16px; margin:4px 0;">
              $${stats.bomCost.toLocaleString()}
            </div>
            <span class="text-muted" style="font-size:10px;">Hardware component acquisition sum</span>
          </div>
        </div>
      </div>

      <div class="c-card" style="margin-top:16px;">
        <div class="card-header">
          <span class="card-title text-cyan">Subsystem Component Configuration</span>
        </div>
        <div class="slot-grid" id="slots-selector-container"></div>
      </div>
    `;

    this.renderSlotSelectors();

    document.getElementById("btn-save-variant").onclick = () => {
      if (stats.axleOverloaded) {
        UI.toast("AXLE OVERLOAD: Train weight exceeds bogie load capacity! Reduce weight or pick heavy bogie.", "danger");
        return;
      }
      const newVar = TrainModelCalc.createVariant(this.trainName, this.trainType, this.currentSlots, this.marginPercent);
      state.variants.push(newVar);
      UI.toast(`Model "${newVar.name}" created and added to Train Catalog!`, "success");
      Events.emit("navTo", "catalog");
    };
  }

  static renderSlotSelectors() {
    const container = document.getElementById("slots-selector-container");
    container.innerHTML = "";

    const categories = [
      { key: "pantograph", label: "Pantograph & Collector" },
      { key: "transformer", label: "Main Traction Transformer" },
      { key: "inverter", label: "Traction Inverter / Converter" },
      { key: "motor", label: "Traction Motor Type" },
      { key: "bogie", label: "Bogie & Wheelsets" },
      { key: "carbody", label: "Carbody & Aerodynamics" },
      { key: "brakes", label: "Braking & Energy Recovery" },
      { key: "battery", label: "Battery Buffer Pack" },
      { key: "tcms", label: "TCMS & Train Automation" }
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
          optBtn.title = "Locked: Research required in R&D Tree";
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