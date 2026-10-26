// Commissioned Fleet Catalog: Editing, Deriving Variants, and Production Allocation
class CatalogView {
  static render(container) {
    if (state.variants.length === 0) {
      container.innerHTML = `
        <div class="c-card" style="text-align:center; padding:36px;">
          <h3 style="margin-bottom:6px; font-size:14px; font-weight:700;">NO COMMISSIONED FLEET BLUEPRINTS</h3>
          <p class="text-muted" style="margin-bottom:14px;">Utilize the Engineering CAD workspace to configure, name, and commission electric rolling stock models.</p>
          <button class="c-btn btn-primary" onclick="Events.emit('navTo', 'builder')">Open Engineering CAD</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <h2 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Commissioned Fleet Catalog</h2>
          <span class="text-muted" style="font-size:11px;">Edit variant specifications in CAD, duplicate models, manage margins, and run dynamic test certification</span>
        </div>
        <button class="c-btn btn-primary btn-sm" onclick="BuilderView.editingVariantId = null; Events.emit('navTo', 'builder');">+ Engineer New Model</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;" id="catalog-list"></div>
    `;

    const list = document.getElementById("catalog-list");

    state.variants.forEach(variant => {
      const card = document.createElement("div");
      card.className = "c-card";

      const certBadge = variant.certified
        ? `<span class="c-badge badge-green">Dynamic Certified</span>`
        : `<span class="c-badge badge-amber">Uncertified Design</span>`;

      const isTrainset = variant.type === "trainset";
      const archInfo = isTrainset && variant.consistConfig
        ? `${variant.consistConfig.carriageCount}-Car Trainset (${variant.stats.poweredCarCount}M${variant.stats.trailerCarCount}T)`
        : "Standalone Locomotive";

      card.innerHTML = `
        <div class="card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="card-title">${variant.name}</span>
            <span class="c-badge ${isTrainset ? "badge-blue" : "badge-green"}">${archInfo}</span>
            ${certBadge}
          </div>
          <div style="display:flex; gap:6px;">
            <button class="c-btn btn-ghost btn-sm btn-edit-variant" data-id="${variant.id}">Edit in CAD</button>
            <button class="c-btn btn-ghost btn-sm btn-duplicate-variant" data-id="${variant.id}">Duplicate as Variant</button>
            ${!variant.certified 
              ? `<button class="c-btn btn-accent btn-sm btn-test-track" data-id="${variant.id}">Dynamic Test Run ($45,000)</button>` 
              : ""
            }
            <button class="c-btn btn-primary btn-sm btn-start-batch" data-id="${variant.id}">Assemble Unit</button>
          </div>
        </div>

        <div class="view-grid-four" style="margin-bottom:10px;">
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Top Speed &bull; Acceleration</span>
            <div class="font-mono text-blue" style="font-size:13px;">
              ${variant.certified ? `${variant.testedStats.exactTopSpeed} km/h &bull; ${variant.testedStats.certifiedAcceleration} m/s²` : `${variant.stats.roughSpeedMin}~${variant.stats.roughSpeedMax} km/h (Est)`}
            </div>
          </div>
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Power &bull; Seating</span>
            <div class="font-mono text-blue" style="font-size:13px;">
              ${variant.stats.horsepower.toLocaleString()} hp &bull; ${variant.stats.passengerCap} Seats
            </div>
          </div>
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Unit Production Cost</span>
            <div class="font-mono" style="font-size:13px;">$${variant.unitProductionCost.toLocaleString()}</div>
          </div>
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Target Commercial Price</span>
            <div class="font-mono text-positive" style="font-size:13px;">$${variant.salePrice.toLocaleString()} (+${variant.marginPercent}%)</div>
          </div>
        </div>

        <div id="slider-box-${variant.id}"></div>
      `;

      list.appendChild(card);

      card.querySelector(".btn-edit-variant").onclick = () => {
        BuilderView.loadVariantForEditing(variant);
        Events.emit("navTo", "builder");
      };

      card.querySelector(".btn-duplicate-variant").onclick = () => {
        const cloned = JSON.parse(JSON.stringify(variant));
        cloned.id = "var_" + Date.now().toString(36);
        cloned.name = `${variant.name} (Variant ${Date.now().toString(36).substring(3, 6).toUpperCase()})`;
        cloned.certified = false;
        cloned.testedStats = null;
        state.saveVariant(cloned);
        UI.toast(`Duplicated new variant "${cloned.name}".`, "success");
        CatalogView.render(document.getElementById("viewport-root"));
      };

      const sliderBox = card.querySelector(`#slider-box-${variant.id}`);
      const marginSlider = UI.createSlider({
        min: 5, max: 60, value: variant.marginPercent,
        label: "Commercial Markup Margin", unit: "%", step: 1,
        onInput: (val) => {
          variant.marginPercent = val;
          variant.salePrice = Math.round(variant.unitProductionCost * (1 + val / 100));
          variant.profitPerUnit = variant.salePrice - variant.unitProductionCost;
          state.saveToStorage();
          CatalogView.render(document.getElementById("viewport-root"));
        }
      });
      sliderBox.appendChild(marginSlider);

      const testBtn = card.querySelector(".btn-test-track");
      if (testBtn) {
        testBtn.onclick = () => {
          if (state.funds < 45000) { UI.toast("Insufficient Capital: Test facility fee is $45,000.", "danger"); return; }
          state.funds -= 45000;
          TrainModelCalc.certifyVariant(variant);
          state.saveToStorage();
          UI.toast(`Test Verification Complete: Certified statistics verified for ${variant.name}.`, "success");
          CatalogView.render(document.getElementById("viewport-root"));
          Events.emit("fundsChanged");
        };
      }

      card.querySelector(".btn-start-batch").onclick = () => {
        const missing = [];
        for (const slotKey in variant.slots) {
          const compId = variant.slots[slotKey];
          if (!compId || compId === "bat_none") continue;
          if ((state.warehouse[compId] || 0) < 1) {
            const comp = state.findComponentById(compId);
            missing.push(comp ? comp.name : compId);
          }
        }

        if (missing.length > 0) {
          UI.toast(`Assembly Halted: Missing active components in warehouse: ${missing.slice(0, 2).join(", ")}`, "danger");
          return;
        }

        for (const slotKey in variant.slots) {
          const compId = variant.slots[slotKey];
          if (!compId || compId === "bat_none") continue;
          state.takeFromWarehouse(compId, 1);
        }

        state.productionLines.push({
          id: "pl_" + Date.now().toString(36),
          variantId: variant.id,
          variantName: variant.name,
          batchSize: 1, unitsCompleted: 0, dailyProgress: 0, laborRate: 15
        });

        UI.toast(`Assembly Line Initiated: 1 unit of ${variant.name} entered into production.`, "success");
        Events.emit("inventoryChanged");
        CatalogView.render(document.getElementById("viewport-root"));
      };
    });
  }
}