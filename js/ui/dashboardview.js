// Executive Dashboard View with Professional Corporate Metrics
class DashboardView {
  static render(container) {
    const qEst = OrderEngine.calculateQuarterlyEstimate();
    const tenderCount = state.marketTenders.length;

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
              <span class="text-muted">Projected Net Quarterly Profit</span>
              <span class="font-mono text-positive ${qEst.netProfitEst < 0 ? "text-negative" : ""}">
                ${qEst.netProfitEst >= 0 ? "+" : ""}$${qEst.netProfitEst.toLocaleString()}
              </span>
            </div>
            <div class="stat-gauge-row">
              <span class="text-muted">Ministry Procurement Board</span>
              <span class="font-mono ${tenderCount > 0 ? "text-positive" : "text-warning"}">
                ${tenderCount > 0 ? `${tenderCount} Active Government Tenders` : `Procurement Hiatus: ~${Math.max(1, state.nextTenderCountdown)} Days`}
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
               No active government contracts. ${tenderCount > 0 ? `${tenderCount} official tenders are currently open for proposals in Ministry Tenders.` : `Next tender announcement in approximately ${Math.max(1, state.nextTenderCountdown)} days.`}
             </div>`
          : `<div style="overflow-x:auto;">
              <table class="inv-table">
                <thead>
                  <tr>
                    <th>Agency / Tender Name</th>
                    <th>Rolling Stock Model</th>
                    <th>Delivered Quantity</th>
                    <th>Quarter Delivery Quota</th>
                    <th>Accumulated Delay</th>
                    <th>Tolerance Limit</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.activeContracts.map(c => `
                    <tr>
                      <td style="font-weight:600;">${c.title}</td>
                      <td class="font-mono text-blue">${c.variantName}</td>
                      <td class="font-mono">${c.totalDelivered} / ${c.totalUnits} Units</td>
                      <td class="font-mono">${c.deliveredThisQuarter} / ${c.batchSizePerQuarter} Units</td>
                      <td class="font-mono ${c.delayDaysAccrued > 0 ? "text-negative" : "text-positive"}">${c.delayDaysAccrued} Days</td>
                      <td>
                        <span class="c-badge ${c.delayDaysAccrued > (c.delayToleranceDays * 0.7) ? "badge-red" : "badge-green"}">
                          Maximum ${c.delayToleranceDays} Days
                        </span>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>`
        }
      </div>
    `;
  }
}