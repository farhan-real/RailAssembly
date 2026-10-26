// Ministry Tender Bidding Board & Rival Competitor Analytics
class MarketView {
  static render(container) {
    const hasTender = state.marketTenders.length > 0;

    container.innerHTML = `
      <div class="view-grid-two">
        <!-- Scarce Ministry Tenders Board -->
        <div class="c-card">
          <div class="card-header">
            <span class="card-title text-cyan">${ICONS.train} National Railway Procurement Board</span>
            <span class="c-badge ${hasTender ? "badge-green" : "badge-amber"}">
              ${hasTender ? "1 EXCLUSIVE TENDER OPEN" : "IN REVIEW / CLOSED"}
            </span>
          </div>

          <div style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">
            The Ministry awards multi-year megaprojects rarely. Production deliveries proceed slowly across quarters with strictly monitored delay limits.
          </div>

          <div id="tender-slot-area">
            ${hasTender ? "" : `
              <div style="background:var(--bg-darker); border:1px dashed var(--border-subtle); border-radius:var(--radius-sm); padding:24px; text-align:center;">
                <div class="text-amber font-mono" style="font-size:14px; margin-bottom:6px;">NO OPEN TENDERS CURRENTLY GAZETTED</div>
                <p class="text-muted" style="font-size:12px; margin-bottom:14px;">
                  The Ministry of Transportation is reviewing capital budgets and corridor route electrification.
                </p>
                <div class="stat-badge font-mono text-cyan" style="display:inline-block; background:rgba(0,229,255,0.08); padding:6px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-strong);">
                  Next Tender Notice in approx: <strong>${Math.max(1, state.nextTenderCountdown)} days</strong>
                </div>
              </div>
            `}
          </div>
        </div>

        <!-- Competitor Intelligence & Market Share -->
        <div class="c-card">
          <div class="card-header">
            <span class="card-title text-cyan">${ICONS.rep} Rival Rolling Stock Manufacturers</span>
            <span class="c-badge badge-cyan">GLOBAL SYNDICATE</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">
            Rivals bid aggressively on government tenders and will absorb your contracted batches if your assembly lines fall behind.
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${COMPETITORS_DATA.map(comp => `
              <div style="background:var(--bg-darker); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font-weight:700; font-size:13px;">${comp.name}</span>
                  <span class="font-mono text-cyan">${comp.marketShare}% Market Share</span>
                </div>
                <div class="text-muted" style="font-size:11px; margin-bottom:6px;">${comp.specialty} &bull; ${comp.country}</div>
                <div style="display:flex; gap:16px; font-size:11px;">
                  <span>Reliability: <strong class="text-accent">${comp.reliabilityScore}%</strong></span>
                  <span>Avg Markup: <strong class="text-amber">+${comp.avgMarkup}%</strong></span>
                  <span>Speed Rating: <strong class="text-cyan">${comp.speedScore}</strong></span>
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
    card.style.background = "var(--bg-darker)";
    card.style.padding = "16px";
    card.style.borderRadius = "var(--radius-sm)";
    card.style.border = "1px solid var(--border-strong)";

    const daysRemaining = Math.max(0, t.expiresDay - state.day);

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <h4 style="font-size:14px; font-weight:700; color:var(--text-primary);">${t.title}</h4>
          <span class="text-cyan font-mono" style="font-size:11px;">${t.agency}</span>
        </div>
        <span class="c-badge badge-amber font-mono">${daysRemaining}d to Bid</span>
      </div>

      <p class="text-muted" style="font-size:12px; line-height:1.4; margin-bottom:12px;">${t.description}</p>

      <div class="view-grid-two" style="gap:8px; font-size:12px; margin-bottom:14px; background:rgba(0,0,0,0.25); padding:10px; border-radius:var(--radius-xs);">
        <div><span class="text-muted">Total Fleet Order:</span> <strong class="font-mono">${t.unitsRequired} Trainsets</strong></div>
        <div><span class="text-muted">Quarterly Delivery Quota:</span> <strong class="font-mono text-cyan">${t.batchSizePerQuarter} units/Q</strong></div>
        <div><span class="text-muted">Max Budget / Unit:</span> <strong class="font-mono text-accent">$${t.budgetPerUnit.toLocaleString()}</strong></div>
        <div><span class="text-muted">Delay Tolerance:</span> <strong class="font-mono text-red">Max ${t.delayToleranceDays} days late</strong></div>
        <div><span class="text-muted">Required Top Speed:</span> <strong class="font-mono">${t.minSpeed} km/h</strong></div>
        <div><span class="text-muted">Min Seating:</span> <strong class="font-mono">${t.minPassengerCap > 0 ? t.minPassengerCap + " passengers" : "Freight (N/A)"}</strong></div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="c-btn btn-primary btn-submit-bid">Submit Tender Bid Proposal</button>
      </div>
    `;

    card.querySelector(".btn-submit-bid").onclick = () => {
      if (state.variants.length === 0) {
        UI.toast("Design and certify a train in 'Train Builder' before bidding.", "danger");
        return;
      }

      const picker = document.createElement("div");
      picker.innerHTML = `
        <p class="text-muted" style="font-size:12px; margin-bottom:12px;">Select certified train model to enter into formal government competition:</p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${state.variants.map(v => `
            <button class="c-btn btn-ghost btn-select-model" data-var="${v.id}" style="justify-content:space-between;">
              <div style="display:flex; flex-direction:column; align-items:flex-start;">
                <strong>${v.name}</strong>
                <span class="text-muted" style="font-size:10px;">${v.certified ? `${v.testedStats.exactTopSpeed} km/h (Certified)` : `Rough Estimates (Uncertified)`}</span>
              </div>
              <span class="font-mono text-cyan">$${v.salePrice.toLocaleString()} / unit</span>
            </button>
          `).join("")}
        </div>
      `;

      UI.showModal({
        title: `Bid: ${t.title}`,
        contentNode: picker,
        actions: []
      });

      picker.querySelectorAll(".btn-select-model").forEach(btn => {
        btn.onclick = () => {
          const varId = btn.getAttribute("data-var");
          const res = OrderEngine.submitTenderProposal(t.id, varId);
          UI.closeModal();

          if (res.success) {
            UI.toast(`CONTRACT AWARDED! ${t.title} won. Keep production on pace to avoid competitor reallocation!`, "success");
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