// Ministry Rolling Stock Contracts Board & Proposal Bidding View
class MarketView {
  static activeCategoryFilter = "all";

  static render(container) {
    let contracts = state.marketTenders || [];
    if (contracts.length === 0) {
      OrderEngine.evaluateGovernmentBids();
      contracts = state.marketTenders || [];
    }

    const filtered = this.getFilteredContracts(contracts);

    container.innerHTML = `
      <div class="view-grid-two">
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Ministry Contracts Directorate</span>
            <span class="c-badge ${contracts.length > 0 ? "badge-green" : "badge-amber"}" id="contracts-count-badge">
              ${contracts.length} Open Opportunities
            </span>
          </div>

          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Dynamic government procurement opportunities scaled to your enterprise standing and technical maturity. Order volumes and financial budgets increase as your capabilities expand.
          </div>

          <div class="market-filter-bar">
            <button class="market-filter-btn ${this.activeCategoryFilter === "all" ? "active" : ""}" data-cat="all">All (${contracts.length})</button>
            <button class="market-filter-btn ${this.activeCategoryFilter === "highspeed" ? "active" : ""}" data-cat="highspeed">High-Speed</button>
            <button class="market-filter-btn ${this.activeCategoryFilter === "freight" ? "active" : ""}" data-cat="freight">Heavy Freight</button>
            <button class="market-filter-btn ${this.activeCategoryFilter === "commuter" ? "active" : ""}" data-cat="commuter">Commuter</button>
            <button class="market-filter-btn ${this.activeCategoryFilter === "regional" ? "active" : ""}" data-cat="regional">Regional</button>
          </div>

          <div id="contract-slot-area" style="display:flex; flex-direction:column; gap:10px; max-height:calc(100vh - 230px); overflow-y:auto; padding-right:4px;">
            ${filtered.length === 0 ? `
              <div style="background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-xs); padding:24px; text-align:center;">
                <div class="text-warning font-mono" style="font-size:12px; margin-bottom:4px;">NO CONTRACTS IN THIS CATEGORY</div>
                <p class="text-muted" style="font-size:11px;">Select another category or wait for new opportunities to open.</p>
              </div>
            ` : ""}
          </div>
        </div>

        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Competitor Intelligence</span>
            <span class="c-badge badge-blue">Rolling Stock Manufacturers</span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            Rival manufacturers evaluate every open ministry contract and absorb defaulted quotas if your assembly lines run behind schedule.
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
                  <span>Average Margin: <strong class="text-warning">+${comp.avgMarkup}%</strong></span>
                  <span>Speed: <strong class="text-blue">${comp.speedScore}</strong></span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    this.bindFilterEvents(container);

    if (filtered.length > 0) {
      const area = document.getElementById("contract-slot-area");
      filtered.forEach(c => area.appendChild(this.buildContractCard(c)));
    }
  }

  static getFilteredContracts(contracts) {
    if (!Array.isArray(contracts)) return [];
    if (this.activeCategoryFilter === "all") return contracts;
    return contracts.filter(c => {
      if (!c) return false;
      const cat = c.category || (c.type ? c.type.split("_")[0] : "regional");
      return cat === this.activeCategoryFilter;
    });
  }

  static bindFilterEvents(container) {
    container.querySelectorAll(".market-filter-btn").forEach(btn => {
      btn.onclick = () => {
        this.activeCategoryFilter = btn.getAttribute("data-cat");
        MarketView.render(container);
      };
    });
  }

  static updateLive() {
    const contracts = state.marketTenders || [];
    const countBadge = document.getElementById("contracts-count-badge");
    if (countBadge) {
      countBadge.textContent = `${contracts.length} Open Opportunities`;
      countBadge.className = `c-badge ${contracts.length > 0 ? "badge-green" : "badge-amber"}`;
    }

    const slotArea = document.getElementById("contract-slot-area");
    if (!slotArea) return;

    const filtered = this.getFilteredContracts(contracts);
    const existingCardIds = Array.from(slotArea.querySelectorAll("[data-contract-id]")).map(el => el.getAttribute("data-contract-id"));
    const currentFilteredIds = filtered.map(t => t.id);

    if (existingCardIds.length !== currentFilteredIds.length || existingCardIds.some((id, i) => id !== currentFilteredIds[i])) {
      slotArea.innerHTML = "";
      if (filtered.length === 0) {
        slotArea.innerHTML = `
          <div style="background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-xs); padding:24px; text-align:center;">
            <div class="text-warning font-mono" style="font-size:12px; margin-bottom:4px;">NO CONTRACTS IN THIS CATEGORY</div>
            <p class="text-muted" style="font-size:11px;">Select another category or wait for new opportunities to open.</p>
          </div>
        `;
      } else {
        filtered.forEach(c => slotArea.appendChild(this.buildContractCard(c)));
      }
      return;
    }

    filtered.forEach(c => {
      const card = slotArea.querySelector(`[data-contract-id="${c.id}"]`);
      if (card) {
        const badge = card.querySelector(".contract-window-badge");
        if (badge) {
          const daysRemaining = Math.max(0, c.expiresDay - state.day);
          badge.textContent = `${daysRemaining} Days Window`;
        }
      }
    });
  }

  static buildContractCard(c) {
    const card = document.createElement("div");
    card.setAttribute("data-contract-id", c.id);
    card.style.background = "var(--bg-surface)";
    card.style.padding = "10px 12px";
    card.style.borderRadius = "var(--radius-xs)";
    card.style.border = "1px solid var(--border-strong)";

    const daysRemaining = Math.max(0, (c.expiresDay || state.day + 60) - state.day);
    const mobDays = c.mobilizationDays || 45;
    const unitsReq = c.unitsRequired || 12;
    const budgetUnit = c.budgetPerUnit || 3200000;
    const totalContractValue = unitsReq * budgetUnit;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
        <div style="min-width:0; flex:1;">
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <h4 style="font-size:12px; font-weight:700; color:var(--text-main);">${c.title || "Government Rolling Stock Contract"}</h4>
            <span class="c-badge badge-blue">${c.strictnessTier || "Standard Specification"}</span>
          </div>
          <span class="text-blue font-mono" style="font-size:9.5px;">${c.agency || "Regional Transit Authority"}</span>
        </div>
        <span class="c-badge badge-amber font-mono contract-window-badge" style="font-size:9px; flex-shrink:0;">${daysRemaining} Days Window</span>
      </div>

      <p class="text-muted" style="font-size:10px; margin-bottom:8px; line-height:1.35;">${c.description || "Official fleet procurement tender."}</p>

      <div style="margin-bottom:8px;">
        <span class="text-muted" style="font-size:9px; text-transform:uppercase; font-weight:700;">Mandatory Contract Specifications</span>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:3px;">
          ${(c.requirements || []).map(req => `
            <div style="background:var(--bg-panel); padding:4px 6px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; font-size:10px;">
              <span class="text-secondary">${req.label}:</span>
              <strong class="font-mono text-blue">${req.compare === "min" ? "Min" : (req.compare === "max" ? "Max" : "")} ${req.value.toLocaleString()} ${req.unit}</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="view-grid-two" style="gap:4px; font-size:10px; margin-bottom:8px; background:rgba(0,0,0,0.2); padding:5px 8px; border-radius:var(--radius-xs);">
        <div><span class="text-muted">Total Fleet Order:</span> <strong class="font-mono">${unitsReq} Units</strong></div>
        <div><span class="text-muted">Quarterly Delivery:</span> <strong class="font-mono text-blue">${c.batchSizePerQuarter || 2} Units / Qtr</strong></div>
        <div><span class="text-muted">Unit Budget:</span> <strong class="font-mono text-positive">$${budgetUnit.toLocaleString()}</strong></div>
        <div><span class="text-muted">Total Order Value:</span> <strong class="font-mono text-positive">$${totalContractValue.toLocaleString()}</strong></div>
        <div><span class="text-muted">Procurement Grace:</span> <strong class="font-mono text-blue">${mobDays} Days Window</strong></div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="c-btn btn-primary btn-sm btn-submit-bid">Select Model &amp; Submit Proposal</button>
      </div>
    `;

    card.querySelector(".btn-submit-bid").onclick = () => this.openBidModal(c);
    return card;
  }

  static openBidModal(contract) {
    if (state.variants.length === 0) {
      UI.toast("Design and verify a rolling stock model in Engineering CAD before submitting a bid.", "danger");
      return;
    }

    const picker = document.createElement("div");
    picker.innerHTML = `
      <p class="text-muted" style="font-size:11px; margin-bottom:10px;">Select a certified model. The Ministry will evaluate each required specification for this procurement:</p>
      <div style="display:flex; flex-direction:column; gap:8px; max-height:450px; overflow-y:auto;">
        ${state.variants.map(v => {
          const check = OrderEngine.validateVariantRequirements(v, contract);
          return `
            <div style="background:var(--bg-surface); padding:10px; border-radius:var(--radius-xs); border:1px solid ${check.valid ? "var(--border-strong)" : "var(--border-subtle)"};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <div>
                  <strong style="font-size:12px;">${v.name}</strong>
                  <span class="c-badge ${v.certified ? "badge-green" : "badge-amber"}" style="margin-left:6px;">
                    ${v.certified ? "Certified Test Verified" : "Uncertified CAD"}
                  </span>
                </div>
                <span class="font-mono text-positive" style="font-size:12px;">$${v.salePrice.toLocaleString()} / Unit</span>
              </div>

              <div style="font-size:10px; margin-bottom:8px;">
                ${check.valid 
                  ? `<span class="text-positive">All ${contract.requirements ? contract.requirements.length : 0} mandatory specifications fully satisfied.</span>` 
                  : `<span class="text-negative">${check.errors[0]}</span>`
                }
              </div>

              <div style="display:flex; justify-content:flex-end;">
                <button class="c-btn ${check.valid ? "btn-primary" : "btn-ghost"} btn-sm btn-pick-model" data-var="${v.id}" ${!check.valid ? "disabled" : ""}>
                  Submit This Model
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    UI.showModal({
      title: `Submit Proposal: ${contract.title}`,
      contentNode: picker,
      actions: []
    });

    picker.querySelectorAll(".btn-pick-model").forEach(btn => {
      btn.onclick = () => {
        const varId = btn.getAttribute("data-var");
        const res = OrderEngine.submitTenderProposal(contract.id, varId);
        UI.closeModal();

        if (res.success) {
          const mobDays = res.contract.mobilizationDaysTotal || 45;
          UI.toast(`CONTRACT AWARDED: "${contract.title}" secured! Initial ${mobDays}-day procurement window active to buy components.`, "success");
          Events.emit("marketChanged");
          MarketView.render(document.getElementById("viewport-root"));
        } else {
          UI.toast(res.reason, "danger");
        }
      };
    });
  }
}