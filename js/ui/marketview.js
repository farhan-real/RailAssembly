// Ministry Tender Bidding Board and Competitor Intelligence
class MarketView {
  static render(container) {
    const hasTender = state.marketTenders.length > 0;

    container.innerHTML = `
      <div class="view-grid-two">
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">National Railway Procurement Board</span>
            <span class="c-badge ${hasTender ? "badge-green" : "badge-amber"}">
              ${hasTender ? "1 Tender Active" : "Budget Review In Progress"}
            </span>
          </div>

          <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">
            The Ministry awards multi-year megaprojects slowly over phased quarters. Delivery delays exceeding contract tolerance trigger reallocation to competitors.
          </div>

          <div id="tender-slot-area">
            ${hasTender ? "" : `
              <div style="background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-xs); padding:20px; text-align:center;">
                <div class="text-warning font-mono" style="font-size:12px; margin-bottom:4px;">NO TENDERS CURRENTLY OPEN FOR BIDDING</div>
                <p class="text-muted" style="font-size:11px; margin-bottom:10px;">
                  The Ministry of Transportation is finalizing specifications and line capacity allocations.
                </p>
                <div class="font-mono text-blue" style="font-size:11px;">
                  Next Gazette Notice in approximately: <strong>${Math.max(1, state.nextTenderCountdown)} Days</strong>
                </div>
              </div>
            `}
          </div>
        </div>

        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Competitor Intelligence</span>
            <span class="c-badge badge-blue">Rolling Stock Manufacturers</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Rivals bid on government tenders and absorb defaulted batch quantities if assembly lines incur unaddressed delays.
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${COMPETITORS_DATA.map(comp => `
              <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                  <span style="font-weight:600; font-size:12px;">${comp.name}</span>
                  <span class="font-mono text-blue">${comp.marketShare}% Market Share</span>
                </div>
                <div class="text-muted" style="font-size:10px; margin-bottom:4px;">${comp.specialty} &bull; ${comp.country}</div>
                <div style="display:flex; gap:14px; font-size:10px;">
                  <span>Reliability: <strong class="text-positive">${comp.reliabilityScore}%</strong></span>
                  <span>Average Markup: <strong class="text-warning">+${comp.avgMarkup}%</strong></span>
                  <span>Speed Score: <strong class="text-blue">${comp.speedScore}</strong></span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    if (hasTender) {
      this.renderActiveTender(document.getElementById("tender-slot-area"), state.marketTenders[0]);
    }
  }

  static renderActiveTender(container, t) {
    const card = document.createElement("div");
    card.style.background = "var(--bg-surface)";
    card.style.padding = "12px";
    card.style.borderRadius = "var(--radius-xs)";
    card.style.border = "1px solid var(--border-strong)";

    const daysRemaining = Math.max(0, t.expiresDay - state.day);

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
        <div>
          <h4 style="font-size:13px; font-weight:700; color:var(--text-main);">${t.title}</h4>
          <span class="text-blue font-mono" style="font-size:10px;">${t.agency}</span>
        </div>
        <span class="c-badge badge-amber font-mono">${daysRemaining} Days to Submit Proposal</span>
      </div>

      <p class="text-muted" style="font-size:11px; margin-bottom:10px;">${t.description}</p>

      <div class="view-grid-two" style="gap:6px; font-size:11px; margin-bottom:12px; background:rgba(0,0,0,0.2); padding:8px; border-radius:var(--radius-xs);">
        <div><span class="text-muted">Total Fleet Order:</span> <strong class="font-mono">${t.unitsRequired} Trainsets</strong></div>
        <div><span class="text-muted">Quarterly Delivery Quota:</span> <strong class="font-mono text-blue">${t.batchSizePerQuarter} Units per Quarter</strong></div>
        <div><span class="text-muted">Budget Allocation / Unit:</span> <strong class="font-mono text-positive">$${t.budgetPerUnit.toLocaleString()}</strong></div>
        <div><span class="text-muted">Delay Tolerance:</span> <strong class="font-mono text-negative">Maximum ${t.delayToleranceDays} Days</strong></div>
        <div><span class="text-muted">Required Top Speed:</span> <strong class="font-mono">${t.minSpeed} km/h</strong></div>
        <div><span class="text-muted">Passenger Capacity:</span> <strong class="font-mono">${t.minPassengerCap > 0 ? t.minPassengerCap + " Passengers Capacity" : "Freight Haulage (Not Applicable)"}</strong></div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="c-btn btn-primary btn-sm btn-submit-bid">Submit Tender Proposal</button>
      </div>
    `;

    card.querySelector(".btn-submit-bid").onclick = () => {
      if (state.variants.length === 0) {
        UI.toast("Design and verify a model in Engineering CAD prior to bidding.", "danger");
        return;
      }

      const picker = document.createElement("div");
      picker.innerHTML = `
        <p class="text-muted" style="font-size:11px; margin-bottom:10px;">Select certified train model to enter into formal government procurement evaluation:</p>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${state.variants.map(v => `
            <button class="c-btn btn-ghost btn-select-model" data-var="${v.id}" style="justify-content:space-between;">
              <div style="display:flex; flex-direction:column; align-items:flex-start;">
                <strong>${v.name}</strong>
                <span class="text-muted" style="font-size:9px;">${v.certified ? `${v.testedStats.exactTopSpeed} km/h (Certified Test Stats)` : `Uncertified Design Estimates`}</span>
              </div>
              <span class="font-mono text-blue">$${v.salePrice.toLocaleString()} / Unit</span>
            </button>
          `).join("")}
        </div>
      `;

      UI.showModal({
        title: `Submit Proposal: ${t.title}`,
        contentNode: picker,
        actions: []
      });

      picker.querySelectorAll(".btn-select-model").forEach(btn => {
        btn.onclick = () => {
          const varId = btn.getAttribute("data-var");
          const res = OrderEngine.submitTenderProposal(t.id, varId);
          UI.closeModal();

          if (res.success) {
            UI.toast(`CONTRACT AWARDED: ${t.title} won. Fulfill scheduled quarterly quotas to prevent competitor reallocation.`, "success");
            Events.emit("marketChanged");
            MarketView.render(document.getElementById("viewport-root"));
          } else {
            UI.toast(res.reason, "danger");
          }
        };
      });
    };

    container.appendChild(card);
  }
}