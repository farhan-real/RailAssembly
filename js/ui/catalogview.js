// Catalog View for Models, Unit Margin Controls, and Assembly Assignments
class CatalogView {
  static render(container) {
    if (state.variants.length === 0) {
      container.innerHTML = `
        <div class="c-card" style="text-align:center; padding:40px;">
          <h3 class="text-cyan font-mono" style="margin-bottom:8px;">NO TRAIN MODELS DESIGNED</h3>
          <p class="text-muted" style="margin-bottom:16px;">Visit the Train Builder to engineer and configure your first electric locomotive or EMU trainset.</p>
          <button class="c-btn btn-primary" onclick="Events.emit('navTo', 'builder')">Open Train Builder</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2 class="text-cyan font-mono" style="font-size:18px;">COMMISSIONED ELECTRIC FLEET CATALOG</h2>
          <span class="text-muted" style="font-size:11px;">Pricing, Profit Margins, Dynamic Certification &amp; Batch Production</span>
        </div>
        <button class="c-btn btn-ghost" onclick="Events.emit('navTo', 'builder')">+ Engineer New Model</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;" id="catalog-list"></div>
    `;

    const list = document.getElementById("catalog-list");

    state.variants.forEach(variant => {
      const card = document.createElement("div");
      card.className = "c-card";

      const certBadge = variant.certified
        ? `<span class="c-badge badge-green">${ICONS.check} Certified Rig Tested</span>`
        : `<span class="c-badge badge-amber">${ICONS.alert} Rough CAD Estimates</span>`;

      card.innerHTML = `
        <div class="card-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="card-title text-cyan">${variant.name}</span>
            ${certBadge}
          </div>
          <div style="display:flex; gap:8px;">
            ${!variant.certified 
              ? `<button class="c-btn btn-accent btn-sm btn-test-track" data-id="${variant.id}">Dynamic Test Rig ($45,000)</button>` 
              : ""
            }
            <button class="c-btn btn-primary btn-sm btn-start-batch" data-id="${variant.id}">Assemble Batch</button>
          </div>
        </div>

        <div class="view-grid-three" style="margin-bottom:12px;">
          <div>
            <span class="text-muted" style="font-size:11px;">CERTIFIED TOP SPEED</span>
            <div class="font-mono text-cyan" style="font-size:15px;">
              ${variant.certified ? `${variant.testedStats.exactTopSpeed} km/h` : `${variant.stats.roughSpeedMin} ~ ${variant.stats.roughSpeedMax} km/h`}
            </div>
          </div>
          <div>
            <span class="text-muted" style="font-size:11px;">UNIT PRODUCTION COST</span>
            <div class="font-mono" style="font-size:15px;">$${variant.unitProductionCost.toLocaleString()}</div>
          </div>
          <div>
            <span class="text-muted" style="font-size:11px;">PROFIT PER UNIT</span>
            <div class="font-mono text-accent" style="font-size:15px;">+$${variant.profitPerUnit.toLocaleString()} (${variant.marginPercent}%)</div>
          </div>
        </div>

        <div id="slider-box-${variant.id}"></div>
      `;

      list.appendChild(card);

      // Attach margin slider
      const sliderBox = card.querySelector(`#slider-box-${variant.id}`);
      const marginSlider = UI.createSlider({
        min: 5,
        max: 60,
        value: variant.marginPercent,
        label: "Profit Margin Markup",
        unit: "%",
        step: 1,
        onInput: (val) => {
          variant.marginPercent = val;
          const markupFactor = 1 + (val / 100);
          variant.salePrice = Math.round(variant.unitProductionCost * markupFactor);
          variant.profitPerUnit = variant.salePrice - variant.unitProductionCost;
          CatalogView.render(document.getElementById("viewport-root"));
        }
      });
      sliderBox.appendChild(marginSlider);

      // Bind Test bench
      const testBtn = card.querySelector(".btn-test-track");
      if (testBtn) {
        testBtn.onclick = () => {
          if (state.funds < 45000) {
            UI.toast("Insufficient capital for testing facility fees ($45,000).", "danger");
            return;
          }
          state.funds -= 45000;
          TrainModelCalc.certifyVariant(variant);
          UI.toast(`Testing track run completed! Certified stats verified for ${variant.name}.`, "success");
          CatalogView.render(document.getElementById("viewport-root"));
          Events.emit("fundsChanged");
        };
      }

      // Bind Batch Assembly trigger
      const batchBtn = card.querySelector(".btn-start-batch");
      batchBtn.onclick = () => {
        // Check warehouse components
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
          UI.toast(`Cannot assemble: Missing in warehouse: ${missing.slice(0, 2).join(", ")}`, "danger");
          return;
        }

        // Deduct 1 set of components
        for (const slotKey in variant.slots) {
          const compId = variant.slots[slotKey];
          if (!compId || compId === "bat_none") continue;
          state.takeFromWarehouse(compId, 1);
        }

        state.productionLines.push({
          id: "pl_" + Date.now().toString(36),
          variantId: variant.id,
          variantName: variant.name,
          batchSize: 1,
          unitsCompleted: 0,
          dailyProgress: 0,
          laborRate: 15
        });

        UI.toast(`Assembly line started for 1 unit of ${variant.name}!`, "success");
        Events.emit("inventoryChanged");
        CatalogView.render(document.getElementById("viewport-root"));
      };
    });
  }
}