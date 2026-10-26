// Ministry Rolling Stock Contracts Board & Proposal Bidding View
class MarketView {
  static render(container) {
    const contractCount = state.marketTenders.length;

    container.innerHTML = `
      <div class="view-grid-two">
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Ministry Contracts Directorate</span>
            <span class="c-badge ${contractCount > 0 ? "badge-green" : "badge-amber"}" id="contracts-count-badge">
              ${contractCount} Open Opportunities
            </span>
          </div>

          <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">
            The Ministry of Transportation and federal rail authorities release multi-year procurement contracts. Each contract provides an initial mobilization grace period to order components from suppliers before delivery quotas begin.
          </div>

          <div id="contract-slot-area" style="display:flex; flex-direction:column; gap:12px;">
            ${contractCount === 0 ? `
              <div style="background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-xs); padding:24px; text-align:center;">
                <div class="text-warning font-mono" style="font-size:12px; margin-bottom:4px;">NO CONTRACTS CURRENTLY OPEN FOR BIDDING</div>
                <p class="text-muted" style="font-size:11px; margin-bottom:10px;">
                  Federal transit authorities are evaluating upcoming route schedules.
                </p>
                <div class="font-mono text-blue" style="font-size:11px;">
                  Next contract round opening in: <strong id="contract-next-countdown">${Math.max(1, state.nextTenderCountdown)} Days</strong>
                </div>
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

    if (contractCount > 0) {
      const area = document.getElementById("contract-slot-area");
      state.marketTenders.forEach(c => {
        area.appendChild(this.buildContractCard(c));
      });
    }
  }

  static updateLive() {
    const countBadge = document.getElementById("contracts-count-badge");
    if (countBadge) {
      countBadge.textContent = `${state.marketTenders.length} Open Opportunities`;
      countBadge.className = `c-badge ${state.marketTenders.length > 0 ? "badge-green" : "badge-amber"}`;
    }

    const countdownEl = document.getElementById("contract-next-countdown");
    if (countdownEl) {
      countdownEl.textContent = `${Math.max(1, state.nextTenderCountdown)} Days`;
    }

    const slotArea = document.getElementById("contract-slot-area");
    if (!slotArea) return;

    const existingCardIds = Array.from(slotArea.querySelectorAll("[data-contract-id]")).map(el => el.getAttribute("data-contract-id"));
    const currentTenderIds = state.marketTenders.map(t => t.id);

    // If contracts list changed, rebuild slot area
    if (existingCardIds.length !== currentTenderIds.length || existingCardIds.some((id, i) => id !== currentTenderIds[i])) {
      slotArea.innerHTML = "";
      if (state.marketTenders.length === 0) {
        slotArea.innerHTML = `
          <div style="background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-xs); padding:24px; text-align:center;">
            <div class="text-warning font-mono" style="font-size:12px; margin-bottom:4px;">NO CONTRACTS CURRENTLY OPEN FOR BIDDING</div>
            <p class="text-muted" style="font-size:11px; margin-bottom:10px;">
              Federal transit authorities are evaluating upcoming route schedules.
            </p>
            <div class="font-mono text-blue" style="font-size:11px;">
              Next contract round opening in: <strong id="contract-next-countdown">${Math.max(1, state.nextTenderCountdown)} Days</strong>
            </div>
          </div>
        `;
      } else {
        state.marketTenders.forEach(c => {
          slotArea.appendChild(this.buildContractCard(c));
        });
      }
      return;
    }

    // In-place update of remaining countdown window badges
    state.marketTenders.forEach(c => {
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
    card.style.padding = "12px 14px";
    card.style.borderRadius = "var(--radius-xs)";
    card.style.border = "1px solid var(--border-strong)";

    const daysRemaining = Math.max(0, c.expiresDay - state.day);
    const mobDays = c.mobilizationDays || 45;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <h4 style="font-size:13px; font-weight:700; color:var(--text-main);">${c.title}</h4>
            <span class="c-badge badge-blue">${c.strictnessTier}</span>
          </div>
          <span class="text-blue font-mono" style="font-size:10px;">${c.agency}</span>
        </div>
        <span class="c-badge badge-amber font-mono contract-window-badge">${daysRemaining} Days Window</span>
      </div>

      <p class="text-muted" style="font-size:11px; margin-bottom:10px; line-height:1.35;">${c.description}</p>

      <div style="margin-bottom:10px;">
        <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Mandatory Contract Specifications</span>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:4px;">
          ${(c.requirements || []).map(req => `
            <div style="background:var(--bg-panel); padding:5px 8px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; font-size:10.5px;">
              <span class="text-secondary">${req.label}:</span>
              <strong class="font-mono text-blue">${req.compare === "min" ? "Min" : (req.compare === "max" ? "Max" : "")} ${req.value.toLocaleString()} ${req.unit}</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="view-grid-two" style="gap:6px; font-size:11px; margin-bottom:10px; background:rgba(0,0,0,0.2); padding:6px 8px; border-radius:var(--radius-xs);">
        <div><span class="text-muted">Total Fleet Order:</span> <strong class="font-mono">${c.unitsRequired} Units</strong></div>
        <div><span class="text-muted">Quarterly Delivery:</span> <strong class="font-mono text-blue">${c.batchSizePerQuarter} Units / Qtr</strong></div>
        <div><span class="text-muted">Unit Budget Ceiling:</span> <strong class="font-mono text-positive">$${c.budgetPerUnit.toLocaleString()}</strong></div>
        <div><span class="text-muted">Procurement Grace:</span> <strong class="font-mono text-blue">${mobDays} Days Initial Window</strong></div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="c-btn btn-primary btn-sm btn-submit-bid">Select Model &amp; Submit Contract Proposal</button>
      </div>
    `;

    card.querySelector(".btn-submit-bid").onclick = () => {
      this.openBidModal(c);
    };

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
                  ? `<span class="text-positive">All ${contract.requirements.length} mandatory specifications fully satisfied.</span>` 
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