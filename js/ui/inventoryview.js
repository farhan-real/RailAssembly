// Supply Chain: Warehouse, Long Storage, External Procurement and In-House Manufacturing
class InventoryView {
  static selectedSource = "supplier"; // "supplier" or "inhouse"

  static render(container) {
    const whCount = state.getWarehouseCount();

    container.innerHTML = `
      <div class="view-grid-two">
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Active Warehouse Storage</span>
            <span class="c-badge ${whCount > (state.warehouseCapacity * 0.9) ? "badge-red" : "badge-green"}">
              ${whCount} / ${state.warehouseCapacity} Slots Used
            </span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Components immediately available for rolling stock assembly lines.
          </div>
          <div style="max-height:220px; overflow-y:auto;">
            <table class="inv-table">
              <thead>
                <tr>
                  <th>Component Specification</th>
                  <th>Stock</th>
                  <th>Management Action</th>
                </tr>
              </thead>
              <tbody id="active-wh-tbody"></tbody>
            </table>
          </div>
        </div>

        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Long-Term Reserve Depot</span>
            <span class="c-badge badge-blue">Unlimited Capacity</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Secondary inactive storage. Parts can be transferred to active warehouse instantaneously.
          </div>
          <div style="max-height:220px; overflow-y:auto;">
            <table class="inv-table">
              <thead>
                <tr>
                  <th>Component Specification</th>
                  <th>Quantity</th>
                  <th>Management Action</th>
                </tr>
              </thead>
              <tbody id="long-storage-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- In-House Manufacturing Queue Display -->
      ${state.inHouseQueue.length > 0 ? `
        <div class="c-card" style="margin-top:14px;">
          <div class="card-header">
            <span class="card-title">In-House Manufacturing Queue</span>
            <span class="c-badge badge-blue">${state.inHouseQueue.length} Active Fabrication Jobs</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${state.inHouseQueue.map(job => {
              const comp = state.findComponentById(job.componentId);
              return `
                <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="font-weight:600;">${comp ? comp.name : job.componentId}</span>
                    <span class="text-muted" style="font-size:11px; margin-left:8px;">Quantity: ${job.quantity} units</span>
                  </div>
                  <div class="font-mono text-blue" style="font-size:11px;">
                    Completion in: ${job.daysRemaining} Days
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Component Acquisition Section with Sourcing Selection -->
      <div class="c-card" style="margin-top:14px;">
        <div class="card-header">
          <span class="card-title">Component Fulfillment and Acquisition</span>
          <div style="display:flex; gap:4px;">
            <button class="c-btn ${this.selectedSource === "supplier" ? "btn-primary" : "btn-ghost"} btn-sm" id="btn-src-supplier">
              External Supplier
            </button>
            <button class="c-btn ${this.selectedSource === "inhouse" ? "btn-primary" : "btn-ghost"} btn-sm" id="btn-src-inhouse">
              In-House Manufacturing
            </button>
          </div>
        </div>

        <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px;" id="source-explanation-banner">
          ${this.selectedSource === "supplier"
            ? "External supplier orders include commercial markups with delivery lead times. Volume purchase discounts apply: 5+ units (8% discount), 15+ units (15% discount), 30+ units (25% discount)."
            : "In-house manufacturing utilizes internal plant facilities and direct materials at reduced unit costs. Specialized subsystems require formal research from the R&D Directorate."
          }
        </div>

        <div style="max-height:340px; overflow-y:auto;">
          <table class="inv-table">
            <thead>
              <tr>
                <th>Component Specification</th>
                <th>Sourcing Channel</th>
                <th>Unit Cost</th>
                <th>Production Lead Time</th>
                <th>Acquisition</th>
              </tr>
            </thead>
            <tbody id="acquisition-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    this.renderActiveWarehouseTable();
    this.renderLongStorageTable();
    this.renderAcquisitionTable();

    document.getElementById("btn-src-supplier").onclick = () => {
      this.selectedSource = "supplier";
      InventoryView.render(document.getElementById("viewport-root"));
    };
    document.getElementById("btn-src-inhouse").onclick = () => {
      this.selectedSource = "inhouse";
      InventoryView.render(document.getElementById("viewport-root"));
    };
  }

  static renderActiveWarehouseTable() {
    const tbody = document.getElementById("active-wh-tbody");
    tbody.innerHTML = "";
    const entries = Object.entries(state.warehouse);

    if (entries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-muted" style="text-align:center;">Active warehouse is empty.</td></tr>`;
      return;
    }

    entries.forEach(([id, qty]) => {
      const comp = state.findComponentById(id);
      if (!comp) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="font-weight:600;">${comp.name}</div>
          <div class="text-muted" style="font-size:10px;">${comp.type.toUpperCase()}</div>
        </td>
        <td class="font-mono text-blue">${qty} units</td>
        <td>
          <button class="c-btn btn-ghost btn-sm btn-stash" data-id="${id}">Move to Reserve Depot</button>
        </td>
      `;
      tbody.appendChild(tr);

      tr.querySelector(".btn-stash").onclick = () => {
        state.moveToLongStorage(id, 1);
        InventoryView.render(document.getElementById("viewport-root"));
        Events.emit("inventoryChanged");
      };
    });
  }

  static renderLongStorageTable() {
    const tbody = document.getElementById("long-storage-tbody");
    tbody.innerHTML = "";
    const entries = Object.entries(state.longStorage);

    if (entries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-muted" style="text-align:center;">No components stored in reserve depot.</td></tr>`;
      return;
    }

    entries.forEach(([id, qty]) => {
      const comp = state.findComponentById(id);
      if (!comp) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="font-weight:600;">${comp.name}</div>
          <div class="text-muted" style="font-size:10px;">${comp.type.toUpperCase()}</div>
        </td>
        <td class="font-mono text-warning">${qty} units</td>
        <td>
          <button class="c-btn btn-ghost btn-sm btn-pull" data-id="${id}">Transfer to Active Warehouse</button>
        </td>
      `;
      tbody.appendChild(tr);

      tr.querySelector(".btn-pull").onclick = () => {
        if (!state.moveToWarehouse(id, 1)) {
          UI.toast("Transfer Failed: Active warehouse capacity limit reached.", "danger");
          return;
        }
        InventoryView.render(document.getElementById("viewport-root"));
        Events.emit("inventoryChanged");
      };
    });
  }

  static renderAcquisitionTable() {
    const tbody = document.getElementById("acquisition-tbody");
    tbody.innerHTML = "";

    for (const cat in COMPONENTS_DATA) {
      COMPONENTS_DATA[cat].forEach(comp => {
        if (comp.id === "bat_none") return;
        const tr = document.createElement("tr");

        if (this.selectedSource === "supplier") {
          tr.innerHTML = `
            <td>
              <div style="font-weight:600;">${comp.name}</div>
              <div class="text-muted" style="font-size:10px;">Supplier: ${comp.supplier}</div>
            </td>
            <td>
              <span class="c-badge badge-blue">External Supplier</span>
            </td>
            <td class="font-mono text-blue">$${comp.cost.toLocaleString()}</td>
            <td class="font-mono">${comp.leadDays} Days Delivery</td>
            <td style="display:flex; align-items:center; gap:6px;">
              <div class="stepper-slot" id="stepper-${comp.id}"></div>
              <button class="c-btn btn-primary btn-sm btn-order" data-id="${comp.id}">Order</button>
            </td>
          `;
          tbody.appendChild(tr);

          let orderCount = 1;
          const stepperSlot = tr.querySelector(`#stepper-${comp.id}`);
          const stepper = UI.createStepper({
            min: 1,
            max: 50,
            value: 1,
            step: 1,
            onChange: (v) => { orderCount = v; }
          });
          stepperSlot.appendChild(stepper);

          tr.querySelector(".btn-order").onclick = () => {
            let discount = 1;
            if (orderCount >= 30) discount = 0.75;
            else if (orderCount >= 15) discount = 0.85;
            else if (orderCount >= 5) discount = 0.92;

            const totalCost = Math.round(comp.cost * orderCount * discount);

            if (state.funds < totalCost) {
              UI.toast(`Insufficient Capital: Total procurement order is $${totalCost.toLocaleString()}`, "danger");
              return;
            }

            if (state.getWarehouseCount() + orderCount > state.warehouseCapacity) {
              UI.toast("Warehouse Capacity Limit Exceeded: Clear active storage before ordering.", "danger");
              return;
            }

            state.funds -= totalCost;
            state.pendingDeliveries.push({
              id: "del_" + Date.now().toString(36),
              componentId: comp.id,
              count: orderCount,
              daysLeft: comp.leadDays,
              totalDays: comp.leadDays
            });

            UI.toast(`Procurement Placed: ${orderCount} units of ${comp.name}. Expected in ${comp.leadDays} days.`, "success");
            Events.emit("fundsChanged");
          };
        } else {
          // In-House Manufacturing Mode
          const isAvailable = state.isInHouseAvailable(comp);
          const reqTech = comp.inHouseTech ? state.findTechById(comp.inHouseTech) : null;
          const unitInHouseCost = state.getInHouseUnitCost(comp);

          tr.innerHTML = `
            <td>
              <div style="font-weight:600;">${comp.name}</div>
              <div class="text-muted" style="font-size:10px;">
                ${isAvailable
                  ? "In-House Facility Line Operational"
                  : `Research Required: ${reqTech ? reqTech.name : "Advanced Technology"}`
                }
              </div>
            </td>
            <td>
              <span class="c-badge ${isAvailable ? "badge-green" : "badge-amber"}">
                ${isAvailable ? "In-House Facility" : "Research Required"}
              </span>
            </td>
            <td class="font-mono text-positive">$${unitInHouseCost.toLocaleString()}</td>
            <td class="font-mono">In-House Batch Schedule</td>
            <td style="display:flex; align-items:center; gap:6px;">
              <div class="stepper-slot" id="stepper-${comp.id}"></div>
              <button class="c-btn btn-accent btn-sm btn-manufacture" data-id="${comp.id}" ${!isAvailable ? "disabled" : ""}>
                Fabricate
              </button>
            </td>
          `;
          tbody.appendChild(tr);

          let fabCount = 1;
          const stepperSlot = tr.querySelector(`#stepper-${comp.id}`);
          const stepper = UI.createStepper({
            min: 1,
            max: 20,
            value: 1,
            step: 1,
            onChange: (v) => { fabCount = v; }
          });
          stepperSlot.appendChild(stepper);

          if (isAvailable) {
            tr.querySelector(".btn-manufacture").onclick = () => {
              const totalFabCost = unitInHouseCost * fabCount;
              if (state.funds < totalFabCost) {
                UI.toast(`Insufficient Capital: In-house materials cost is $${totalFabCost.toLocaleString()}`, "danger");
                return;
              }

              if (state.getWarehouseCount() + fabCount > state.warehouseCapacity) {
                UI.toast("Active Warehouse Full: Stash existing stock into reserve depot.", "danger");
                return;
              }

              const requiredDays = state.getInHouseFabricationDays(comp, fabCount);
              state.funds -= totalFabCost;
              state.inHouseQueue.push({
                id: "fab_" + Date.now().toString(36),
                componentId: comp.id,
                quantity: fabCount,
                daysRemaining: requiredDays,
                totalDays: requiredDays
              });

              UI.toast(`Fabrication Commissioned: ${fabCount} units of ${comp.name}. Completion in ${requiredDays} days.`, "success");
              Events.emit("fundsChanged");
              InventoryView.render(document.getElementById("viewport-root"));
            };
          }
        }
      });
    }
  }
}