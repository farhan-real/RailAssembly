// Categorized Component Acquisition: Sub-Categories, Alternatives, and Dynamic Bulk Discounts
class AcquisitionView {
  static activeCategory = "electrical";
  static activeSubCategory = "pantograph";
  static activeSource = "supplier";
  static itemQuantities = {};

  static categories = [
    {
      id: "electrical",
      label: "Electrical Traction & Powertrain",
      subcategories: [
        { id: "pantograph", label: "Pantographs & Current Collectors" },
        { id: "circuitbreaker", label: "Main Vacuum Circuit Breakers" },
        { id: "transformer", label: "Traction Transformers & DC Chokes" },
        { id: "dclink", label: "DC Intermediate Links & Capacitor Banks" },
        { id: "inverter", label: "Traction Inverters & Converters" },
        { id: "motor", label: "Traction Motors" },
        { id: "cooling", label: "Thermal Cooling Loops" },
        { id: "auxiliary", label: "Auxiliary Power Supplies (APS)" }
      ]
    },
    {
      id: "mechanical",
      label: "Mechanical, Transmission & Running Gear",
      subcategories: [
        { id: "transmission", label: "Traction Drive Transmissions" },
        { id: "bogie", label: "Bogies & Running Gear" },
        { id: "carbody", label: "Carbodies & Aerodynamics" },
        { id: "coupler", label: "Couplers & Gangways" },
        { id: "brakes", label: "Brakes & Energy Recovery" },
        { id: "sander", label: "Rail Adhesion & Sanding Gear" }
      ]
    },
    {
      id: "pneumatics_control",
      label: "Pneumatics, Energy & Safety",
      subcategories: [
        { id: "compressor", label: "Air Compressors & Dryers" },
        { id: "battery", label: "Auxiliary Battery Buffers" },
        { id: "hvac", label: "Passenger Climate & HVAC" },
        { id: "safety", label: "WSP & Surge Diverters" },
        { id: "resistor", label: "Dynamic Resistor Grids" },
        { id: "tcms", label: "Train Control & Monitoring (TCMS)" }
      ]
    }
  ];

  static render(container) {
    const curCat = this.categories.find(c => c.id === this.activeCategory) || this.categories[0];
    const curSubCat = curCat.subcategories.find(s => s.id === this.activeSubCategory) || curCat.subcategories[0];
    const components = (COMPONENTS_DATA[curSubCat.id] || []).filter(c => c.cost > 0 && !c.id.includes("_none"));

    container.innerHTML = `
      <div class="acquisition-cat-bar">
        ${this.categories.map(cat => `
          <button class="acquisition-cat-btn ${cat.id === this.activeCategory ? "active" : ""}" data-cat="${cat.id}">
            ${cat.label}
          </button>
        `).join("")}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
        <div class="acquisition-subcat-bar" style="margin-bottom:0;">
          ${curCat.subcategories.map(sub => `
            <button class="acquisition-subcat-btn ${sub.id === this.activeSubCategory ? "active" : ""}" data-sub="${sub.id}">
              ${sub.label}
            </button>
          `).join("")}
        </div>
        <div style="display:flex; gap:4px;">
          <button class="c-btn ${this.activeSource === "supplier" ? "btn-primary" : "btn-ghost"} btn-sm" id="btn-src-ext-supplier">External Supplier</button>
          <button class="c-btn ${this.activeSource === "inhouse" ? "btn-primary" : "btn-ghost"} btn-sm" id="btn-src-inhouse-fab">In-House Shop</button>
        </div>
      </div>

      <div style="background:var(--bg-panel); border:1px solid var(--border-subtle); padding:6px 12px; border-radius:var(--radius-xs); margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <span class="text-muted" style="font-size:10px;">
          ${this.activeSource === "supplier"
            ? "Supplier Bulk Discounts: 5+ Units (8% Off) &bull; 15+ Units (15% Off) &bull; 30+ Units (25% Off). Subject to delivery lead times."
            : "In-House Manufacturing: Save 42% on retail costs using internal factory tooling. Advanced parts require R&D research."}
        </span>
        <span class="font-mono text-blue" style="font-size:10px;">${components.length} Available Specifications</span>
      </div>

      <div class="view-grid-two" id="acquisition-cards-grid"></div>
    `;

    this.bindNavigationEvents(container, curCat);
    this.renderComponentCards(container.querySelector("#acquisition-cards-grid"), components);
  }

  static bindNavigationEvents(container, curCat) {
    container.querySelectorAll(".acquisition-cat-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeCategory = btn.getAttribute("data-cat");
        const nextCat = this.categories.find(c => c.id === this.activeCategory);
        this.activeSubCategory = nextCat.subcategories[0].id;
        AcquisitionView.render(container);
      };
    });

    container.querySelectorAll(".acquisition-subcat-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeSubCategory = btn.getAttribute("data-sub");
        AcquisitionView.render(container);
      };
    });

    container.querySelector("#btn-src-ext-supplier").onclick = () => {
      this.activeSource = "supplier";
      AcquisitionView.render(container);
    };

    container.querySelector("#btn-src-inhouse-fab").onclick = () => {
      this.activeSource = "inhouse";
      AcquisitionView.render(container);
    };
  }

  static renderComponentCards(grid, components) {
    grid.innerHTML = "";

    components.forEach(comp => {
      const card = document.createElement("div");
      card.className = "component-buy-card";

      const qty = this.itemQuantities[comp.id] || 1;
      const isSupplier = this.activeSource === "supplier";
      const isUnlocked = state.isInHouseAvailable(comp);

      const unitCost = isSupplier ? comp.cost : state.getInHouseUnitCost(comp);
      let discountRate = 0;
      let discountLabel = "Standard Price (0% Discount)";

      if (isSupplier) {
        if (qty >= 30) { discountRate = 0.25; discountLabel = "Tier 3 Bulk (25% Discount Applied)"; }
        else if (qty >= 15) { discountRate = 0.15; discountLabel = "Tier 2 Bulk (15% Discount Applied)"; }
        else if (qty >= 5) { discountRate = 0.08; discountLabel = "Tier 1 Bulk (8% Discount Applied)"; }
      }

      const totalBeforeDiscount = unitCost * qty;
      const totalSavings = Math.round(totalBeforeDiscount * discountRate);
      const totalCost = totalBeforeDiscount - totalSavings;
      const leadTimeText = isSupplier ? `${comp.leadDays} Days Delivery Lag` : `${state.getInHouseFabricationDays(comp, qty)} Days Production Schedule`;

      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
            <div>
              <h4 style="font-size:12px; font-weight:700; color:var(--text-main);">${comp.name}</h4>
              <span class="text-muted" style="font-size:10px;">Supplier: ${comp.supplier} &bull; Mass: ${comp.weight} kg</span>
            </div>
            <span class="c-badge ${isSupplier ? "badge-blue" : (isUnlocked ? "badge-green" : "badge-amber")}">
              ${isSupplier ? "External Supplier" : (isUnlocked ? "In-House Ready" : "Research Required")}
            </span>
          </div>

          <p class="text-muted" style="font-size:10px; line-height:1.35; margin:6px 0 8px;">${comp.desc}</p>
          <div style="background:var(--bg-panel); border:1px solid var(--border-subtle); padding:6px 8px; border-radius:var(--radius-xs); display:flex; justify-content:space-between; font-size:10px; margin-bottom:8px;">
            <div>Warehouse: <strong class="font-mono text-blue">${state.warehouse[comp.id] || 0}</strong></div>
            <div>Reserve: <strong class="font-mono text-warning">${state.longStorage[comp.id] || 0}</strong></div>
            <div>${leadTimeText}</div>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-subtle); padding-top:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Quantity:</span>
              <div id="stepper-slot-${comp.id}"></div>
            </div>
            <div style="text-align:right;">
              <div class="font-mono text-positive" style="font-size:13px; font-weight:700;">$${totalCost.toLocaleString()}</div>
              <span class="discount-tag">${discountLabel}</span>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end;">
            <button class="c-btn ${isSupplier ? "btn-primary" : "btn-accent"} btn-sm btn-submit-order" data-id="${comp.id}" ${(!isSupplier && !isUnlocked) ? "disabled" : ""}>
              ${isSupplier ? `Order from Supplier ($${totalCost.toLocaleString()})` : (isUnlocked ? `Fabricate In-House ($${totalCost.toLocaleString()})` : "Locked (Research Required)")}
            </button>
          </div>
        </div>
      `;

      const stepperSlot = card.querySelector(`#stepper-slot-${comp.id}`);
      const stepper = UI.createStepper({
        min: 1, max: 50, value: qty, step: 1,
        onChange: (newQty) => {
          this.itemQuantities[comp.id] = newQty;
          this.renderComponentCards(grid, components);
        }
      });
      stepperSlot.appendChild(stepper);

      card.querySelector(".btn-submit-order").onclick = () => {
        this.processOrder(comp, qty, totalCost, isSupplier);
      };

      grid.appendChild(card);
    });
  }

  static processOrder(comp, qty, totalCost, isSupplier) {
    if (state.funds < totalCost) {
      UI.toast(`Insufficient Capital: Required total is $${totalCost.toLocaleString()}`, "danger");
      return;
    }
    if (state.getWarehouseCount() + qty > state.warehouseCapacity) {
      UI.toast("Active Warehouse Full: Capacity exceeded. Stash parts into reserve depot.", "danger");
      return;
    }

    state.funds -= totalCost;

    if (isSupplier) {
      state.pendingDeliveries.push({
        id: "del_" + Date.now().toString(36),
        componentId: comp.id,
        count: qty,
        daysLeft: comp.leadDays,
        totalDays: comp.leadDays
      });
      UI.toast(`Supplier Order Dispatched: ${qty} units of ${comp.name}. Delivery lag: ${comp.leadDays} days.`, "success");
    } else {
      const requiredDays = state.getInHouseFabricationDays(comp, qty);
      state.inHouseQueue.push({
        id: "fab_" + Date.now().toString(36),
        componentId: comp.id,
        quantity: qty,
        daysRemaining: requiredDays,
        totalDays: requiredDays
      });
      UI.toast(`In-House Fabrication Commissioned: ${qty} units of ${comp.name}. Schedule: ${requiredDays} days.`, "success");
    }

    state.saveToStorage();
    Events.emit("fundsChanged");
    Events.emit("inventoryChanged");
    InventoryView.render(document.getElementById("viewport-root"));
  }
}