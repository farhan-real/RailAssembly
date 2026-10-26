// Commissioned Fleet Catalog, Pricing Margins, and Production Allocation
class CatalogView {
  static render(container) {
    if (state.variants.length === 0) {
      container.innerHTML = `
        <div class="c-card" style="text-align:center; padding:36px;">
          <h3 style="margin-bottom:6px; font-size:14px; font-weight:700;">NO COMMISSIONED FLEET BLUEPRINTS</h3>
          <p class="text-muted" style="margin-bottom:14px;">Utilize the Engineering CAD workspace to configure and commission electric rolling stock models.</p>
          <button class="c-btn btn-primary" onclick="Events.emit('navTo', 'builder')">Open Engineering CAD</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <h2 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Commissioned Fleet Catalog</h2>
          <span class="text-muted" style="font-size:11px;">Manage margins, execute dynamic certification runs, and allocate batch assembly lines</span>
        </div>
        <button class="c-btn btn-ghost btn-sm" onclick="Events.emit('navTo', 'builder')">+ New Blueprint</button>
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

      card.innerHTML = `
        <div class="card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="card-title">${variant.name}</span>
            ${certBadge}
          </div>
          <div style="display:flex; gap:6px;">
            ${!variant.certified 
              ? `<button class="c-btn btn-accent btn-sm btn-test-track" data-id="${variant.id}">Dynamic Test Run ($45,000)</button>` 
              : ""
            }
            <button class="c-btn btn-primary btn-sm btn-start-batch" data-id="${variant.id}">Assemble Unit</button>
          </div>
        </div>

        <div class="view-grid-three" style="margin-bottom:10px;">
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Top Speed Verification</span>
            <div class="font-mono text-blue" style="font-size:14px;">
              ${variant.certified ? `${variant.testedStats.exactTopSpeed} km/h (Certified)` : `${variant.stats.roughSpeedMin} ~ ${variant.stats.roughSpeedMax} km/h (Estimated)`}
            </div>
          </div>
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Unit Production Cost</span>
            <div class="font-mono" style="font-size:14px;">$${variant.unitProductionCost.toLocaleString()}</div>
          </div>
          <div>
            <span class="text-muted" style="font-size:10px; text-transform:uppercase;">Target Unit Profit</span>
            <div class="font-mono text-positive" style="font-size:14px;">+$${variant.profitPerUnit.toLocaleString()} (${variant.marginPercent}% Markup)</div>
          </div>
        </div>

        <div id="slider-box-${variant.id}"></div>
      `;

      list.appendChild(card);

      const sliderBox = card.querySelector(`#slider-box-${variant.id}`);
      const marginSlider = UI.createSlider({
        min: 5,
        max: 60,
        value: variant.marginPercent,
        label: "Commercial Markup Margin",
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

      const testBtn = card.querySelector(".btn-test-track");
      if (testBtn) {
        testBtn.onclick = () => {
          if (state.funds < 45000) {
            UI.toast("Insufficient Capital: Test facility fee is $45,000.", "danger");
            return;
          }
          state.funds -= 45000;
          TrainModelCalc.certifyVariant(variant);
          UI.toast(`Test Verification Complete: Certified statistics verified for ${variant.name}.`, "success");
          CatalogView.render(document.getElementById("viewport-root"));
          Events.emit("fundsChanged");
        };
      }

      const batchBtn = card.querySelector(".btn-start-batch");
      batchBtn.onclick = () => {
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
          UI.toast(`Assembly Halted: Missing active components: ${missing.slice(0, 2).join(", ")}`, "danger");
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
          batchSize: 1,
          unitsCompleted: 0,
          dailyProgress: 0,
          laborRate: 15
        });

        UI.toast(`Assembly Line Initiated: 1 unit of ${variant.name} entered into production.`, "success");
        Events.emit("inventoryChanged");
        CatalogView.render(document.getElementById("viewport-root"));
      };
    });
  }
}