// Supply Chain: Warehouse vs Long Storage & Component Procurement
class InventoryView {
  static render(container) {
    const whCount = state.getWarehouseCount();

    container.innerHTML = `
      <div class="view-grid-two">
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Active Warehouse Ledger</span>
            <span class="c-badge ${whCount > (state.warehouseCapacity * 0.9) ? "badge-red" : "badge-green"}">
              ${whCount} / ${state.warehouseCapacity} Used
            </span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Readily accessible parts for assembly lines. Stash bulk reserve into Long Storage to prevent clutter.
          </div>
          <div style="max-height:240px; overflow-y:auto;">
            <table class="inv-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="active-wh-tbody"></tbody>
            </table>
          </div>
        </div>

        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Long-Term Inactive Storage</span>
            <span class="c-badge badge-blue">Unlimited Space</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Reserve storage depot. Transfer back to active warehouse instantly when needed.
          </div>
          <div style="max-height:240px; overflow-y:auto;">
            <table class="inv-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="long-storage-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="c-card" style="margin-top:14px;">
        <div class="card-header">
          <span class="card-title">Supplier Procurement Catalog</span>
          <span class="text-muted" style="font-size:11px;">Bulk Tiers: 5+ (8% off), 15+ (15% off), 30+ (25% off)</span>
        </div>
        <div style="max-height:340px; overflow-y:auto;">
          <table class="inv-table">
            <thead>
              <tr>
                <th>Component &amp; Supplier</th>
                <th>Unit Cost</th>
                <th>Lead Time</th>
                <th>In-House Fab</th>
                <th>Order Quantity</th>
              </tr>
            </thead>
            <tbody id="procurement-tbody"></tbody>
          </table>
        </div>
      </div>
    `;

    this.renderActiveWarehouseTable();
    this.renderLongStorageTable();
    this.renderProcurementTable();
  }

  static renderActiveWarehouseTable() {
    const tbody = document.getElementById("active-wh-tbody");
    tbody.innerHTML = "";
    const entries = Object.entries(state.warehouse);

    if (entries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-muted" style="text-align:center;">Warehouse empty.</td></tr>`;
      return;
    }

    entries.forEach(([id, qty]) => {
      const comp = state.findComponentById(id);
      if (!comp) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="font-weight:600;">${comp.name}</div>
          <div class="text-muted font-mono" style="font-size:9px;">${comp.type.toUpperCase()}</div>
        </td>
        <td class="font-mono text-blue">${qty}</td>
        <td>
          <button class="c-btn btn-ghost btn-sm btn-stash" data-id="${id}">Stash</button>
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
      tbody.innerHTML = `<tr><td colspan="3" class="text-muted" style="text-align:center;">No stashed components.</td></tr>`;
      return;
    }

    entries.forEach(([id, qty]) => {
      const comp = state.findComponentById(id);
      if (!comp) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="font-weight:600;">${comp.name}</div>
          <div class="text-muted font-mono" style="font-size:9px;">${comp.type.toUpperCase()}</div>
        </td>
        <td class="font-mono text-warning">${qty}</td>
        <td>
          <button class="c-btn btn-ghost btn-sm btn-pull" data-id="${id}">Retrieve</button>
        </td>
      `;
      tbody.appendChild(tr);

      tr.querySelector(".btn-pull").onclick = () => {
        if (!state.moveToWarehouse(id, 1)) {
          UI.toast("Cannot retrieve: Active warehouse capacity reached.", "danger");
          return;
        }
        InventoryView.render(document.getElementById("viewport-root"));
        Events.emit("inventoryChanged");
      };
    });
  }

  static renderProcurementTable() {
    const tbody = document.getElementById("procurement-tbody");
    tbody.innerHTML = "";

    for (const cat in COMPONENTS_DATA) {
      COMPONENTS_DATA[cat].forEach(comp => {
        if (comp.id === "bat_none") return;
        const tr = document.createElement("tr");
        const hasTech = !comp.inHouseTech || state.unlockedTechs.has(comp.inHouseTech);

        tr.innerHTML = `
          <td>
            <div style="font-weight:600;">${comp.name}</div>
            <div class="text-muted" style="font-size:10px;">${comp.supplier} &bull; ${comp.type}</div>
          </td>
          <td class="font-mono text-blue">$${comp.cost.toLocaleString()}</td>
          <td class="font-mono">${comp.leadDays}d</td>
          <td>
            ${comp.inHouseTech
              ? (hasTech
                  ? `<span class="c-badge badge-green">Unlocked</span>`
                  : `<span class="c-badge badge-amber">Tech Req</span>`)
              : `<span class="c-badge badge-blue">Primitive</span>`
            }
          </td>
          <td style="display:flex; align-items:center; gap:6px;">
            <div class="stepper-slot" id="stepper-${comp.id}"></div>
            <button class="c-btn btn-primary btn-sm btn-buy" data-id="${comp.id}">Order</button>
          </td>
        `;
        tbody.appendChild(tr);

        let buyCount = 1;
        const stepperSlot = tr.querySelector(`#stepper-${comp.id}`);
        const stepper = UI.createStepper({
          min: 1,
          max: 50,
          value: 1,
          step: 1,
          onChange: (v) => { buyCount = v; }
        });
        stepperSlot.appendChild(stepper);

        tr.querySelector(".btn-buy").onclick = () => {
          let discount = 1;
          if (buyCount >= 30) discount = 0.75;
          else if (buyCount >= 15) discount = 0.85;
          else if (buyCount >= 5) discount = 0.92;

          const totalCost = Math.round(comp.cost * buyCount * discount);

          if (state.funds < totalCost) {
            UI.toast(`Insufficient capital. Order total: $${totalCost.toLocaleString()}`, "danger");
            return;
          }

          if (state.getWarehouseCount() + buyCount > state.warehouseCapacity) {
            UI.toast(`Warehouse capacity exceeded.`, "danger");
            return;
          }

          state.funds -= totalCost;
          state.pendingDeliveries.push({
            id: "del_" + Date.now().toString(36),
            componentId: comp.id,
            count: buyCount,
            daysLeft: comp.leadDays,
            totalDays: comp.leadDays
          });

          UI.toast(`Procured ${buyCount}x ${comp.name}. Lead time: ${comp.leadDays} days.`, "success");
          Events.emit("fundsChanged");
        };
      });
    }
  }
}