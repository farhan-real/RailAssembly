// Executive Dashboard View with Capital, Scarce Tender Pipeline, and Contracts
class DashboardView {
  static render(container) {
    const qEst = OrderEngine.calculateQuarterlyEstimate();
    const hasTender = state.marketTenders.length > 0;

    container.innerHTML = `
      <div class="view-grid-two">
        <div class="c-card">
          <div class="card-header">
            <span class="card-title text-cyan">${ICONS.money} Corporate Capital &amp; Run-rate</span>
            <span class="c-badge badge-green">SOLVENT</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div class="stat-gauge-row">
              <span class="text-muted">Liquid Cash Reserve:</span>
              <span class="font-mono">$${state.funds.toLocaleString()}</span>
            </div>
            <div class="stat-gauge-row">
              <span class="text-muted">Estimated Quarter Revenue:</span>
              <span class="font-mono text-cyan">$${qEst.revenueEst.toLocaleString()}</span>
            </div>
            <div class="stat-gauge-row">
              <span class="text-muted">Estimated Net Q-Profit:</span>
              <span class="font-mono text-accent ${qEst.netProfitEst < 0 ? "text-red" : ""}">
                $${qEst.netProfitEst.toLocaleString()}
              </span>
            </div>
            <div class="stat-gauge-row">
              <span class="text-muted">Government Procurement Notice:</span>
              <span class="font-mono ${hasTender ? "text-accent" : "text-amber"}">
                ${hasTender ? "1 TENDER ACTIVE (BID OPEN)" : `Gazette in ~${Math.max(1, state.nextTenderCountdown)}d`}
              </span>
            </div>
          </div>
        </div>

        <div class="c-card">
          <div class="card-header">
            <span class="card-title text-cyan">${ICONS.train} Active Production Lines</span>
            <span class="c-badge badge-cyan">${state.productionLines.length} RUNNING</span>
          </div>
          <div id="dash-lines-list" style="display:flex; flex-direction:column; gap:8px;">
            ${state.productionLines.length === 0 
              ? `<div class="text-muted" style="padding:16px 0; text-align:center;">No active train assemblies. Allocate in "Train Variants".</div>`
              : state.productionLines.map(line => `
                  <div style="background:var(--bg-darker); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                      <span class="font-mono text-cyan">${line.variantName}</span>
                      <span class="font-mono">${line.unitsCompleted} / ${line.batchSize} Units</span>
                    </div>
                    <div class="stat-bar-container" style="width:100%; height:4px;">
                      <div class="stat-bar-fill" style="width:${Math.round(line.dailyProgress)}%;"></div>
                    </div>
                  </div>
                `).join("")
            }
          </div>
        </div>
      </div>

      <div class="c-card" style="margin-top:16px;">
        <div class="card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="card-title text-cyan">${ICONS.rep} Government Board Contracts &amp; Delivery Latency</span>
          </div>
          <span class="c-badge badge-amber">${state.activeContracts.length} ACTIVE CONTRACTS</span>
        </div>
        ${state.activeContracts.length === 0 
          ? `<div class="text-muted" style="padding:20px; text-align:center;">
               No government contracts awarded yet. ${hasTender ? "An exclusive tender is currently open for bids in 'Govt &amp; Market'!" : `Next tender will be published in ~${Math.max(1, state.nextTenderCountdown)} days.`}
             </div>`
          : `<div style="overflow-x:auto;">
              <table class="inv-table">
                <thead>
                  <tr>
                    <th>Agency / Tender</th>
                    <th>Model</th>
                    <th>Delivered</th>
                    <th>Quarter Target</th>
                    <th>Late Days</th>
                    <th>Tolerance Limit</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.activeContracts.map(c => `
                    <tr>
                      <td style="font-weight:600;">${c.title}</td>
                      <td class="font-mono text-cyan">${c.variantName}</td>
                      <td class="font-mono">${c.totalDelivered} / ${c.totalUnits}</td>
                      <td class="font-mono">${c.deliveredThisQuarter} / ${c.batchSizePerQuarter}</td>
                      <td class="font-mono ${c.delayDaysAccrued > 0 ? "text-red" : "text-accent"}">${c.delayDaysAccrued}d</td>
                      <td>
                        <span class="c-badge ${c.delayDaysAccrued > (c.delayToleranceDays * 0.7) ? "badge-red" : "badge-green"}">
                          Max ${c.delayToleranceDays}d
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