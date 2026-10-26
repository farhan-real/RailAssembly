// Ministry Tender Bidding Board and Competitor Intelligence Tracker
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
            The Ministry awards multi-year megaprojects slowly over phased quarters. Tighter technical specifications offer substantially higher budgets and profit rewards.
          </div>

          <div id="tender-slot-area">
            ${hasTender ? "" : `
              <div style="background:var(--bg-surface); border:1px dashed var(--border-subtle); border-radius:var(--radius-xs); padding:24px; text-align:center;">
                <div class="text-warning font-mono" style="font-size:12px; margin-bottom:4px;">NO TENDERS CURRENTLY OPEN FOR BIDDING</div>
                <p class="text-muted" style="font-size:11px; margin-bottom:10px;">
                  The Ministry of Transportation is drafting line capacity and engineering specifications.
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
            Rivals bid aggressively on tenders and will absorb defaulted batch allocations if your assembly line incurs unaddressed delivery delays.
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
    card.style.padding = "14px";
    card.style.borderRadius = "var(--radius-xs)";
    card.style.border = "1px solid var(--border-strong)";

    const daysRemaining = Math.max(0, t.expiresDay - state.day);

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <h4 style="font-size:13px; font-weight:700; color:var(--text-main);">${t.title}</h4>
            <span class="c-badge badge-blue">${t.strictnessTier}</span>
          </div>
          <span class="text-blue font-mono" style="font-size:10px;">${t.agency}</span>
        </div>
        <span class="c-badge badge-amber font-mono">${daysRemaining} Days to Submit Proposal</span>
      </div>

      <p class="text-muted" style="font-size:11px; margin-bottom:12px; line-height:1.4;">${t.description}</p>

      <div style="margin-bottom:12px;">
        <span class="text-muted" style="font-size:10px; text-transform:uppercase; font-weight:700;">Mandatory Targeted Requirements</span>
        <div style="display:flex; flex-direction:column; gap:4px; margin-top:6px;">
          ${t.requirements.map(req => `
            <div style="background:var(--bg-panel); padding:6px 10px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; font-size:11px;">
              <span>${req.label}</span>
              <strong class="font-mono text-blue">${req.compare === "min" ? "At least" : "No more than"} ${req.value.toLocaleString()} ${req.unit}</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="view-grid-two" style="gap:6px; font-size:11px; margin-bottom:14px; background:rgba(0,0,0,0.25); padding:8px 10px; border-radius:var(--radius-xs);">
        <div><span class="text-muted">Total Order:</span> <strong class="font-mono">${t.unitsRequired} Trainsets</strong></div>
        <div><span class="text-muted">Quarterly Quota:</span> <strong class="font-mono text-blue">${t.batchSizePerQuarter} Units / Quarter</strong></div>
        <div><span class="text-muted">Budget Allocation / Unit:</span> <strong class="font-mono text-positive">$${t.budgetPerUnit.toLocaleString()}</strong></div>
        <div><span class="text-muted">Delay Tolerance:</span> <strong class="font-mono text-negative">Maximum ${t.delayToleranceDays} Days</strong></div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="c-btn btn-primary btn-sm btn-submit-bid">Select Model and Submit Tender Proposal</button>
      </div>
    `;

    card.querySelector(".btn-submit-bid").onclick = () => {
      if (state.variants.length === 0) {
        UI.toast("Design and verify a model in Engineering CAD before submitting a proposal.", "danger");
        return;
      }

      const picker = document.createElement("div");
      picker.innerHTML = `
        <p class="text-muted" style="font-size:11px; margin-bottom:10px;">Select certified train model. The Ministry will evaluate only the required parameters for this tender:</p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${state.variants.map(v => {
            const check = OrderEngine.validateVariantRequirements(v, t);
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
                    ? `<span class="text-positive">All ${t.requirements.length} mandatory tender requirements satisfied.</span>` 
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
        title: `Submit Proposal: ${t.title}`,
        contentNode: picker,
        actions: []
      });

      picker.querySelectorAll(".btn-pick-model").forEach(btn => {
        btn.onclick = () => {
          const varId = btn.getAttribute("data-var");
          const res = OrderEngine.submitTenderProposal(t.id, varId);
          UI.closeModal();

          if (res.success) {
            UI.toast(`CONTRACT AWARDED: ${t.title} secured. Maintain production quotas to prevent competitor transfer.`, "success");
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