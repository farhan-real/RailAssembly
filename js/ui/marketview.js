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
              ${hasTender ? "1 Open Tender" : "Review Period"}
            </span>
          </div>

          <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">
            Government bodies place massive rolling stock orders slowly over multi-year quarters. Delays past tolerance trigger competitor transfers.
          </div>

          <div id="tender-slot-area">
            ${hasTender ? "" : `
              <div style="background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-xs); padding:20px; text-align:center;">
                <div class="text-warning font-mono" style="font-size:12px; margin-bottom:4px;">NO CURRENTLY OPEN TENDERS</div>
                <p class="text-muted" style="font-size:11px; margin-bottom:10px;">
                  The Ministry is conducting corridor traffic and budget studies.
                </p>
                <div class="font-mono text-blue" style="font-size:11px;">
                  Next Gazette Notice in approx: <strong>${Math.max(1, state.nextTenderCountdown)} days</strong>
                </div>
              </div>
            `}
          </div>
        </div>

        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Competitor Intelligence</span>
            <span class="c-badge badge-blue">Rolling Stock Rivals</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Rivals bid aggressively and absorb contracted batches if your assembly line falls behind.
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${COMPETITORS_DATA.map(comp => `
              <div style="background:var(--bg-surface); padding:8px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                  <span style="font-weight:600; font-size:12px;">${comp.name}</span>
                  <span class="font-mono text-blue">${comp.marketShare}% Share</span>
                </div>
                <div class="text-muted" style="font-size:10px; margin-bottom:4px;">${comp.specialty} &bull; ${comp.country}</div>
                <div style="display:flex; gap:14px; font-size:10px;">
                  <span>Reliability: <strong class="text-positive">${comp.reliabilityScore}%</strong></span>
                  <span>Avg Markup: <strong class="text-warning">+${comp.avgMarkup}%</strong></span>
                  <span>Speed: <strong class="text-blue">${comp.speedScore}</strong></span>
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
        <span class="c-badge badge-amber font-mono">${daysRemaining}d to Bid</span>
      </div>

      <p class="text-muted" style="font-size:11px; margin-bottom:10px;">${t.description}</p>

      <div class="view-grid-two" style="gap:6px; font-size:11px; margin-bottom:12px; background:rgba(0,0,0,0.2); padding:8px; border-radius:var(--radius-xs);">
        <div><span class="text-muted">Fleet Size:</span> <strong class="font-mono">${t.unitsRequired} Units</strong></div>
        <div><span class="text-muted">Quarterly Quota:</span> <strong class="font-mono text-blue">${t.batchSizePerQuarter} units/Q</strong></div>
        <div><span class="text-muted">Budget / Unit:</span> <strong class="font-mono text-positive">$${t.budgetPerUnit.toLocaleString()}</strong></div>
        <div><span class="text-muted">Delay Tolerance:</span> <strong class="font-mono text-negative">Max ${t.delayToleranceDays}d late</strong></div>
        <div><span class="text-muted">Min Speed:</span> <strong class="font-mono">${t.minSpeed} km/h</strong></div>
        <div><span class="text-muted">Min Seating:</span> <strong class="font-mono">${t.minPassengerCap > 0 ? t.minPassengerCap + " pax" : "Freight (N/A)"}</strong></div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="c-btn btn-primary btn-sm btn-submit-bid">Submit Tender Bid</button>
      </div>
    `;

    card.querySelector(".btn-submit-bid").onclick = () => {
      if (state.variants.length === 0) {
        UI.toast("Design and certify a model in Engineering CAD first.", "danger");
        return;
      }

      const picker = document.createElement("div");
      picker.innerHTML = `
        <p class="text-muted" style="font-size:11px; margin-bottom:10px;">Select certified train model to enter into formal government competition:</p>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${state.variants.map(v => `
            <button class="c-btn btn-ghost btn-select-model" data-var="${v.id}" style="justify-content:space-between;">
              <div style="display:flex; flex-direction:column; align-items:flex-start;">
                <strong>${v.name}</strong>
                <span class="text-muted" style="font-size:9px;">${v.certified ? `${v.testedStats.exactTopSpeed} km/h (Certified)` : `Uncertified CAD`}</span>
              </div>
              <span class="font-mono text-blue">$${v.salePrice.toLocaleString()} / unit</span>
            </button>
          `).join("")}
        </div>
      `;

      UI.showModal({
        title: `Submit Bid: ${t.title}`,
        contentNode: picker,
        actions: []
      });

      picker.querySelectorAll(".btn-select-model").forEach(btn => {
        btn.onclick = () => {
          const varId = btn.getAttribute("data-var");
          const res = OrderEngine.submitTenderProposal(t.id, varId);
          UI.closeModal();

          if (res.success) {
            UI.toast(`CONTRACT AWARDED: ${t.title} secured. Maintain batch schedule to avoid delay breach.`, "success");
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