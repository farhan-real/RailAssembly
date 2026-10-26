// Interactive CAD Stat Optimization Guide & Upgrade Inspector
class StatGuideView {
  static GUIDES = {
    speed: {
      title: "Top Operating Speed Optimization",
      formula: "Top Speed = (Net Power × Powertrain Efficiency ÷ Aerodynamic Drag Cd)^(1/3) — Capped by Motor RPM, Bogie, Pantograph, Transmission, and PWM limits.",
      getRecommendations: (stats) => [
        { name: "Meidensha Wing / Active Piezo Pantograph", cat: "Pantograph", impact: "Raises speed limit to 360–420 km/h", tech: "tech_panto_hyper_420", slotKey: "pantograph", id: "panto_active_piezo_420" },
        { name: "Halbach-Array / Synchronous Traction Motor", cat: "Motor", impact: "Raises motor RPM ceiling to 360–420 km/h", tech: "tech_mot_halbach_420", slotKey: "motor", id: "mot_hyper_velocity_400" },
        { name: "Carbon-Composite Articulated Bogie", cat: "Bogie", impact: "Certified safe running speed up to 420 km/h", tech: "tech_bog_composite_420", slotKey: "bogie", id: "bog_highspeed_400" },
        { name: "Direct-Drive Torque Tube Transmission", cat: "Transmission", impact: "Gearless drive rated for 420 km/h", tech: "tech_transm_direct_420", slotKey: "transmission", id: "transm_hyper_drive_420" },
        { name: "Supersonic Boundary-Layer Carbody Shell", cat: "Carbody", impact: "Slashing aerodynamic drag to Cd 0.14", tech: "tech_body_supersonic_420", slotKey: "carbody", id: "body_hyper_400" },
        { name: "Active Cant Tilting Dampers (Sub-Component)", cat: "Bogie Mod", impact: "+45 km/h Curving Speed", tech: "tech_susp_active", subCat: "bogie", isMod: false, id: "susp_active" },
        { name: "Halbach Sinusoidal Rotor (Sub-Component)", cat: "Motor Sub", impact: "+35 km/h RPM boost, +0.018 Eff", tech: "tech_mot_rotor_halbach", subCat: "motor", isMod: false, id: "mot_rotor_halbach" },
        { name: "Synchronous Six-Step Over-Modulation (Mod)", cat: "PWM Mod", impact: "+20 km/h fundamental voltage boost", tech: "tech_pwm_overmod", subCat: "pwm", isMod: true, id: "pwm_overmod_sixstep" }
      ]
    },
    adhesion: {
      title: "Tractive Adhesion & Rail Grip (kN / μ)",
      formula: "Tractive Adhesion (kN) = Adhesive Mass (t) × 9.81 × Adhesion Coefficient (μ). Adhesion limits maximum tractive effort without wheel spin.",
      getRecommendations: (stats) => [
        { name: "High-Velocity Laser-Plasma & Ceramic Jet", cat: "Rail Adhesion", impact: "+0.22 μ Adhesion (+160~220 kN)", tech: "tech_sand_plasma", slotKey: "sander", id: "sand_plasma_cleaner" },
        { name: "Electromagnetic Track Adhesion Array", cat: "Rail Adhesion", impact: "+0.16 μ Magnetic Downforce (+120~160 kN)", tech: "tech_sand_plasma", slotKey: "sander", id: "sand_magnetic_track" },
        { name: "High-Adhesion Ballasted Freight Chassis", cat: "Carbody", impact: "58 t chassis tare mass (Massive adhesive grip)", tech: "tech_body_structural_steel", slotKey: "carbody", id: "body_heavy_ballast" },
        { name: "Heavy-Haul Ballasted 6-Axle Bogies", cat: "Bogie", impact: "32 t 6-axle running gear (600+ kN capacity)", tech: "tech_bog_coco_freight", slotKey: "bogie", id: "bog_heavy_haul_ballast" },
        { name: "Neural-Adaptive Predictive Modulator", cat: "PWM Controller", impact: "+0.08 μ AI slip prevention", tech: "tech_pwm_neural_adaptive", slotKey: "pwm", id: "pwm_neural_adaptive_flux" },
        { name: "Direct Torque Control (DTC) Modulator", cat: "PWM Controller", impact: "+0.06 μ Sub-ms torque response", tech: "tech_pwm_direct_torque", slotKey: "pwm", id: "pwm_direct_torque_dtc" },
        { name: "Model Predictive Current Control (MPCC)", cat: "PWM Mod", impact: "+0.05 μ Adhesion", tech: "tech_pwm_overmod", subCat: "pwm", isMod: true, id: "pwm_predictive_flux" },
        { name: "Calcined Micro-Alumina Stream (Sub-Component)", cat: "Sander Sub", impact: "+0.05 μ Friction grit", tech: "tech_sand_alumina", subCat: "sander", isMod: false, id: "sand_alumina" },
        { name: "Consist Architecture: 100% Motorized Cars", cat: "Consist Editor", impact: "Every carriage adds full adhesive weight to tractive grip", tech: null, isConsist: true }
      ]
    },
    acceleration: {
      title: "Starting Sprint Acceleration (m/s²)",
      formula: "Acceleration = Effective Tractive Force (kN) ÷ Gross Consist Mass (t). Maximize acceleration by combining high adhesion force with lightweight construction.",
      getRecommendations: (stats) => [
        { name: "Install High-Adhesion Sanding Gear", cat: "Rail Adhesion", impact: "Unlocks up to 700+ kN of starting tractive force", tech: "tech_sand_plasma", slotKey: "sander", id: "sand_plasma_cleaner" },
        { name: "Extruded Aluminum or Carbon Monocoque Carbody", cat: "Carbody", impact: "Cuts tare weight by 10 to 14 tons", tech: "tech_body_carbon_monocoque", slotKey: "carbody", id: "body_aero_cf" },
        { name: "Permanent Magnet Synchronous Motor (PMSM)", cat: "Motor", impact: "High power-to-weight ratio for rapid station dwell sprints", tech: "tech_mot_pmsm_280", slotKey: "motor", id: "mot_pmsm" },
        { name: "Direct Torque Control (DTC) Inverter Modulator", cat: "PWM Controller", impact: "Instantaneous sub-millisecond full torque delivery", tech: "tech_pwm_direct_torque", slotKey: "pwm", id: "pwm_direct_torque_dtc" },
        { name: "Form-Wound Rectangular Stator (Sub-Component)", cat: "Motor Sub", impact: "+0.03 μ Starting grip, dense copper slot fill", tech: "tech_mot_stator_polyimide", subCat: "motor", isMod: false, id: "mot_stator_form_wound" },
        { name: "Increase Motorized Coaches in Consist View", cat: "Consist Editor", impact: "Distributes traction power across multiple powered axles", tech: null, isConsist: true }
      ]
    },
    power: {
      title: "Net Traction Power & Continuous Horsepower",
      formula: "Net Power (kW) = Minimum(Motor, Inverter, Transformer, DC Link) × Motor Car Count — Hotel Auxiliary HVAC Draws.",
      getRecommendations: (stats) => [
        { name: "Halbach-Array Hyper-Velocity Motor (9.8 MW)", cat: "Motor", impact: "Supplies 9,800 kW (13,140 hp) per motor pack", tech: "tech_mot_halbach_420", slotKey: "motor", id: "mot_hyper_velocity_400" },
        { name: "Dual-Core Silicon Carbide (SiC) Converter", cat: "Inverter", impact: "Throughput up to 9,800 kW with 99.0% efficiency", tech: "tech_inv_sic_hyper_380", slotKey: "inverter", id: "inv_sic_dual_380" },
        { name: "Solid-State High-Frequency Matrix Transformer", cat: "Transformer", impact: "9,200 kW rating with zero heavy iron core", tech: "tech_trans_solid_state", slotKey: "transformer", id: "trans_solidstate" },
        { name: "Active Resonant Link with Ultracapacitors", cat: "DC Link", impact: "10,000 kW intermediate bus throughput", tech: "tech_dclink_supercap", slotKey: "dclink", id: "dclink_supercap_hybrid" },
        { name: "Superconducting Ceramic Matrix Windings", cat: "Transformer Sub", impact: "+0.024 Powertrain Efficiency boost", tech: "tech_wind_supercond", subCat: "transformer", isMod: false, id: "wind_supercond" },
        { name: "Add Motorized Carriages in Consist View", cat: "Consist Editor", impact: "Each motorized carriage multiplies total traction power", tech: null, isConsist: true }
      ]
    },
    axleload: {
      title: "Axle Load Management & Weight Compliance",
      formula: "Axle Load = Total Consist Tare Mass ÷ Total Axles. Must stay below Bogie structural load limits.",
      getRecommendations: (stats) => [
        { name: "Six-Axle High-Adhesion Co-Co Freight Bogie", cat: "Bogie", impact: "Distributes weight over 6 axles (25.0 t limit)", tech: "tech_bog_coco_freight", slotKey: "bogie", id: "bog_co_co" },
        { name: "Carbon-Fiber Composite Aerodynamic Body", cat: "Carbody", impact: "Slashing chassis weight to just 10.5 tons", tech: "tech_body_carbon_monocoque", slotKey: "carbody", id: "body_aero_cf" },
        { name: "Aluminum Ribbon Weight-Saver Windings", cat: "Transformer Sub", impact: "-250 kg Tare weight reduction", tech: null, subCat: "transformer", isMod: false, id: "wind_alribbon" },
        { name: "Carbon-Fiber Torsion Drive Shaft", cat: "Transmission Sub", impact: "-140 kg Unsprung weight reduction", tech: "tech_transm_oil_mist", subCat: "transmission", isMod: false, id: "transm_carbon_shaft" },
        { name: "Titanium Piston Insulated Calipers", cat: "Brakes Sub", impact: "-115 kg Weight saving on running gear", tech: "tech_cal_monobloc", subCat: "brakes", isMod: false, id: "cal_titanium_piston" },
        { name: "Add Intermediate Trailer Cars in Consist Editor", cat: "Consist Editor", impact: "Adds unpowered guide axles to lower average axle load", tech: null, isConsist: true }
      ]
    },
    cost: {
      title: "BOM & Unit Production Cost Reduction",
      formula: "Unit Cost = Hardware BOM Cost + Factory Assembly Labor. In-house fabrication reduces component costs by 42%.",
      getRecommendations: (stats) => [
        { name: "Fabricate Components In-House", cat: "Supply & Inventory", impact: "42% discount compared to external retail suppliers", tech: null, isInv: true },
        { name: "Three-Phase Asynchronous Induction Motor", cat: "Motor", impact: "Economical $95,000 baseline (vs $850,000 Halbach)", tech: "tech_mot_basic_induction", slotKey: "motor", id: "mot_ind_basic" },
        { name: "Analog Sinusoidal Pulse-Width Modulator", cat: "PWM Controller", impact: "Low-cost $18,000 discrete analog control", tech: "tech_pwm_analog_spwm", slotKey: "pwm", id: "pwm_sine_triangle_analog" },
        { name: "Bulk Component Procurement (5+ to 30+ units)", cat: "Supply & Inventory", impact: "Bulk supplier discounts up to 25% off", tech: null, isInv: true }
      ]
    }
  };

  static show(statKey, builderInstance) {
    const guide = this.GUIDES[statKey] || this.GUIDES.speed;
    const stats = TrainModelCalc.calculateTrainStats(builderInstance.currentSlots, builderInstance.subSelections, builderInstance.rollingStockType, builderInstance.consistConfig);
    const recs = guide.getRecommendations(stats);

    const container = document.createElement("div");
    container.innerHTML = `
      <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); margin-bottom:12px;">
        <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Physics Engine Telemetry Formula:</span>
        <div style="font-size:11px; color:var(--text-main); margin-top:3px; line-height:1.4;">${guide.formula}</div>
      </div>

      <div style="margin-bottom:8px;">
        <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Components &amp; Upgrades That Increase This Stat:</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:6px; max-height:420px; overflow-y:auto; padding-right:4px;" id="guide-recs-list"></div>
    `;

    const list = container.querySelector("#guide-recs-list");

    recs.forEach(rec => {
      const card = document.createElement("div");
      card.style.background = "var(--bg-surface)";
      card.style.padding = "8px 10px";
      card.style.borderRadius = "var(--radius-xs)";
      card.style.border = "1px solid var(--border-subtle)";
      card.style.display = "flex";
      card.style.justifyContent = "space-between";
      card.style.alignItems = "center";
      card.style.gap = "8px";

      const isInstalled = (rec.slotKey && builderInstance.currentSlots[rec.slotKey] === rec.id) ||
        (rec.subCat && !rec.isMod && builderInstance.subSelections[rec.subCat]?.subcomponent === rec.id) ||
        (rec.subCat && rec.isMod && builderInstance.subSelections[rec.subCat]?.modification === rec.id);

      const isUnlocked = !rec.tech || state.unlockedTechs.has(rec.tech);

      card.innerHTML = `
        <div style="min-width:0; flex:1;">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <strong style="font-size:11.5px; color:var(--text-main);">${rec.name}</strong>
            <span class="c-badge badge-blue" style="font-size:8.5px;">${rec.cat}</span>
            ${isInstalled ? `<span class="c-badge badge-green" style="font-size:8.5px;">Equipped</span>` : ""}
            ${!isUnlocked ? `<span class="c-badge badge-amber" style="font-size:8.5px;">Research Required</span>` : ""}
          </div>
          <div style="font-size:10px; color:var(--color-positive); margin-top:2px;" class="font-mono">${rec.impact}</div>
        </div>
        <div style="flex-shrink:0;">
          ${isInstalled ? `<span class="text-muted font-mono" style="font-size:10px;">Active in CAD</span>` :
            (!isUnlocked ? `<button class="c-btn btn-ghost btn-sm btn-guide-research" style="font-size:10px;">Research...</button>` :
              (rec.isConsist ? `<button class="c-btn btn-primary btn-sm btn-guide-consist" style="font-size:10px;">Consist Editor...</button>` :
                (rec.isInv ? `<button class="c-btn btn-primary btn-sm btn-guide-inv" style="font-size:10px;">Open Inventory...</button>` :
                  `<button class="c-btn btn-primary btn-sm btn-guide-equip" style="font-size:10px;">Equip Option</button>`)))}
        </div>
      `;

      const equipBtn = card.querySelector(".btn-guide-equip");
      if (equipBtn) {
        equipBtn.onclick = () => {
          if (rec.slotKey) builderInstance.currentSlots[rec.slotKey] = rec.id;
          else if (rec.subCat && !rec.isMod) {
            if (!builderInstance.subSelections[rec.subCat]) builderInstance.subSelections[rec.subCat] = {};
            builderInstance.subSelections[rec.subCat].subcomponent = rec.id;
          } else if (rec.subCat && rec.isMod) {
            if (!builderInstance.subSelections[rec.subCat]) builderInstance.subSelections[rec.subCat] = {};
            builderInstance.subSelections[rec.subCat].modification = rec.id;
          }
          UI.closeModal();
          BuilderView.render(document.getElementById("viewport-root"));
          UI.toast(`Equipped ${rec.name} in CAD.`, "success");
        };
      }

      const resBtn = card.querySelector(".btn-guide-research");
      if (resBtn) {
        resBtn.onclick = () => {
          UI.closeModal();
          Events.emit("navTo", "research");
        };
      }

      const consistBtn = card.querySelector(".btn-guide-consist");
      if (consistBtn) {
        consistBtn.onclick = () => {
          UI.closeModal();
          ConsistView.openConsistModal(builderInstance);
        };
      }

      const invBtn = card.querySelector(".btn-guide-inv");
      if (invBtn) {
        invBtn.onclick = () => {
          UI.closeModal();
          Events.emit("navTo", "inventory");
        };
      }

      list.appendChild(card);
    });

    UI.showModal({
      title: `${guide.title}`,
      contentNode: container,
      actions: [
        { label: "Close Guide", className: "btn-ghost", onClick: () => {} }
      ]
    });
  }
}