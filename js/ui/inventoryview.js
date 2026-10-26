// Supply Chain Management: Warehouse Ledgers, Long Storage, and Categorized Acquisition
class InventoryView {
  static render(container) {
    const whCount = state.getWarehouseCount();

    container.innerHTML = `
      <div class="view-grid-two" style="margin-bottom:14px;">
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

      <!-- In-House Manufacturing Production Queue -->
      ${state.inHouseQueue.length > 0 ? `
        <div class="c-card" style="margin-bottom:14px;">
          <div class="card-header">
            <span class="card-title">In-House Manufacturing Queue</span>
            <span class="c-badge badge-blue">${state.inHouseQueue.length} Active Fabrication Jobs</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${state.inHouseQueue.map(job => {
              const comp = state.findComponentById(job.componentId);
              return `
                <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span style="font-weight:600;">${comp ? comp.name : job.componentId}</span>
                    <span class="text-muted" style="font-size:11px; margin-left:8px;">Batch: ${job.quantity} units</span>
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

      <!-- Categorized Component Acquisition Catalog -->
      <div class="c-card" id="acquisition-view-container"></div>
    `;

    this.renderActiveWarehouseTable();
    this.renderLongStorageTable();
    AcquisitionView.render(document.getElementById("acquisition-view-container"));
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
        state.saveToStorage();
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
          <button class="c-btn btn-ghost btn-sm btn-pull" data-id="${id}">Transfer to Active</button>
        </td>
      `;
      tbody.appendChild(tr);

      tr.querySelector(".btn-pull").onclick = () => {
        if (!state.moveToWarehouse(id, 1)) {
          UI.toast("Transfer Failed: Active warehouse capacity reached.", "danger");
          return;
        }
        state.saveToStorage();
        InventoryView.render(document.getElementById("viewport-root"));
        Events.emit("inventoryChanged");
      };
    });
  }
}