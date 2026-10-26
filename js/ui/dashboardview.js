// Executive Dashboard View with Contract Variant Swapping & Requirements Validation
class DashboardView {
  static render(container) {
    const qEst = OrderEngine.calculateQuarterlyEstimate();
    const contractCount = state.marketTenders.length;
    const activeTech = state.activeResearchId ? state.findTechById(state.activeResearchId) : null;

    container.innerHTML = `
      <div class="view-grid-two">
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Corporate Financial Standing</span>
            <span class="c-badge badge-green">Operational</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div class="stat-gauge-row">
              <span class="text-muted">Liquid Capital Reserve</span>
              <span class="font-mono">$${state.funds.toLocaleString()}</span>
            </div>
            <div class="stat-gauge-row">
              <span class="text-muted">Projected Quarterly Revenue</span>
              <span class="font-mono text-blue">$${qEst.revenueEst.toLocaleString()}</span>
            </div>
            <div class="stat-gauge-row">
              <span class="text-muted">Research Tree Development</span>
              <span class="font-mono ${activeTech ? "text-blue" : "text-muted"}">
                ${activeTech ? `${activeTech.name} (${state.researchDaysLeft}d left)` : "Research Tree Idle"}
              </span>
            </div>
            <div class="stat-gauge-row">
              <span class="text-muted">Ministry Contracts</span>
              <span class="font-mono ${contractCount > 0 ? "text-positive" : "text-warning"}">
                ${contractCount > 0 ? `${contractCount} Open Opportunities` : `Next Round in ~${Math.max(1, state.nextTenderCountdown)} Days`}
              </span>
            </div>
          </div>
        </div>

        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Active Production Lines</span>
            <span class="c-badge badge-blue">${state.productionLines.length} Assembly Lines Active</span>
          </div>
          <div id="dash-lines-list" style="display:flex; flex-direction:column; gap:8px;">
            ${state.productionLines.length === 0 
              ? `<div class="text-muted" style="padding:16px 0; text-align:center;">No assembly lines active. Allocate units in Fleet Catalog.</div>`
              : state.productionLines.map(line => `
                  <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
                      <span class="font-mono text-blue">${line.variantName}</span>
                      <span class="font-mono">${line.unitsCompleted} / ${line.batchSize} Units Completed</span>
                    </div>
                    <div class="stat-bar-container" style="width:100%;">
                      <div class="stat-bar-fill" style="width:${Math.round(line.dailyProgress)}%;"></div>
                    </div>
                  </div>
                `).join("")
            }
          </div>
        </div>
      </div>

      <div class="c-card" style="margin-top:14px;">
        <div class="card-header">
          <span class="card-title">Government Rolling Stock Contracts</span>
          <span class="c-badge badge-amber">${state.activeContracts.length} Awarded Contracts</span>
        </div>
        ${state.activeContracts.length === 0 
          ? `<div class="text-muted" style="padding:20px; text-align:center;">
               No active government contracts. ${contractCount > 0 ? `${contractCount} official contracts are open for proposals in Ministry Contracts.` : `Next contract opening in approximately ${Math.max(1, state.nextTenderCountdown)} days.`}
             </div>`
          : `<div style="overflow-x:auto;">
              <table class="inv-table">
                <thead>
                  <tr>
                    <th>Agency / Contract Name</th>
                    <th>Assigned Model</th>
                    <th>Delivered / Quota</th>
                    <th>Unit Sale Price</th>
                    <th>Schedule &bull; Procurement Phase</th>
                    <th>Contract Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.activeContracts.map(c => `
                    <tr>
                      <td style="font-weight:600;">
                        <div>${c.title}</div>
                        <div class="text-muted" style="font-size:10px;">${c.agency}</div>
                      </td>
                      <td class="font-mono text-blue">${c.variantName}</td>
                      <td class="font-mono">${c.totalDelivered}/${c.totalUnits} (${c.deliveredThisQuarter}/${c.batchSizePerQuarter} Qtr)</td>
                      <td class="font-mono text-positive">$${c.unitSalePrice.toLocaleString()}</td>
                      <td>
                        ${c.isMobilizing
                          ? `<span class="c-badge badge-blue">Procurement: ${c.mobilizationDaysLeft}d left</span>
                             <div class="text-muted" style="font-size:9px; margin-top:2px;">Grace window to buy parts</div>`
                          : `<span class="font-mono ${c.delayDaysAccrued > 0 ? "text-negative" : "text-positive"}">${c.delayDaysAccrued > 0 ? `Delayed ${c.delayDaysAccrued} Days` : "Active &bull; On Schedule"}</span>`
                        }
                      </td>
                      <td>
                        <button class="c-btn btn-ghost btn-sm btn-swap-contract-variant" data-id="${c.id}">Swap Variant...</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>`
        }
      </div>
    `;

    document.querySelectorAll(".btn-swap-contract-variant").forEach(btn => {
      btn.onclick = () => {
        const contractId = btn.getAttribute("data-id");
        DashboardView.openSwapVariantModal(contractId);
      };
    });
  }

  static openSwapVariantModal(contractId) {
    const contract = state.activeContracts.find(c => c.id === contractId);
    if (!contract) return;

    const container = document.createElement("div");
    container.innerHTML = `
      <p class="text-muted" style="font-size:11px; margin-bottom:12px;">
        Swap the rolling stock variant assigned to "${contract.title}". Swapped models must satisfy all original specifications. The Ministry will pay an increased rate if the new model offers superior performance:
      </p>
      <div style="display:flex; flex-direction:column; gap:8px; max-height:420px; overflow-y:auto;" id="swap-variants-list"></div>
    `;

    const list = container.querySelector("#swap-variants-list");

    state.variants.forEach(variant => {
      const evalRes = OrderEngine.evaluateVariantSwap(contract, variant);
      const isCurrent = variant.id === contract.variantId;
      const card = document.createElement("div");
      card.style.background = "var(--bg-surface)";
      card.style.padding = "10px 12px";
      card.style.borderRadius = "var(--radius-xs)";
      card.style.border = `1px solid ${isCurrent ? "var(--color-blue)" : (evalRes.eligible ? "var(--border-strong)" : "var(--border-subtle)")}`;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="font-size:12px;">${variant.name}</strong>
              ${isCurrent ? `<span class="c-badge badge-blue">Currently Assigned</span>` : ""}
              ${variant.certified ? `<span class="c-badge badge-green">Certified</span>` : `<span class="c-badge badge-amber">Uncertified CAD</span>`}
            </div>
            <div style="font-size:11px; margin-top:4px;">
              ${evalRes.eligible
                ? `<span class="text-positive">
                     Specifications Satisfied. Approved Unit Price: <strong>$${evalRes.newPrice.toLocaleString()}</strong>
                     ${evalRes.isHigherPrice ? ` (+$${evalRes.priceDelta.toLocaleString()} Performance Bonus!)` : ""}
                   </span>`
                : `<span class="text-negative">${evalRes.reason}</span>`
              }
            </div>
          </div>
          <button class="c-btn ${evalRes.eligible && !isCurrent ? "btn-primary" : "btn-ghost"} btn-sm btn-confirm-swap" ${!evalRes.eligible || isCurrent ? "disabled" : ""}>
            ${isCurrent ? "Assigned" : "Confirm Swap"}
          </button>
        </div>
      `;

      const confirmBtn = card.querySelector(".btn-confirm-swap");
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          const res = OrderEngine.swapContractVariant(contract.id, variant.id);
          UI.closeModal();
          if (res.success) {
            UI.toast(`Contract "${contract.title}" variant swapped to ${variant.name}. Unit Price: $${res.newPrice.toLocaleString()}.`, "success");
            DashboardView.render(document.getElementById("viewport-root"));
          } else {
            UI.toast(res.reason, "danger");
          }
        };
      }

      list.appendChild(card);
    });

    UI.showModal({
      title: `Swap Variant: ${contract.title}`,
      contentNode: container,
      actions: []
    });
  }
}