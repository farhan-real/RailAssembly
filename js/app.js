// Main Application Routing, Simulation Runner & Executive Dashboard Binder
class App {
  static currentTab = "dashboard";

  static init() {
    this.bindNavigation();
    this.bindTimeControls();
    this.bindEvents();

    // User gesture handler to resume AudioContext
    window.addEventListener("pointerdown", () => SoundSystem.init(), { once: true });

    // Populate initial procurement cycle wave
    OrderEngine.evaluateGovernmentBids();
    this.switchTab("dashboard");
    SimulationRunner.start();
    this.updateHeaderMetrics();
  }

  static bindNavigation() {
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.onclick = () => {
        SoundSystem.playClick();
        const target = tab.getAttribute("data-tab");
        this.switchTab(target);
      };
    });
  }

  static switchTab(tabKey) {
    this.currentTab = tabKey;
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.classList.toggle("active", tab.getAttribute("data-tab") === tabKey);
    });

    const root = document.getElementById("viewport-root");
    root.innerHTML = "";

    switch (tabKey) {
      case "dashboard": DashboardView.render(root); break;
      case "builder": BuilderView.render(root); break;
      case "catalog": CatalogView.render(root); break;
      case "inventory": InventoryView.render(root); break;
      case "research": ResearchView.render(root); break;
      case "market": MarketView.render(root); break;
      case "settings": SettingsView.render(root); break;
    }
  }

  static bindTimeControls() {
    const p = document.getElementById("btn-pause");
    const p1 = document.getElementById("btn-play-1");
    const p2 = document.getElementById("btn-play-2");

    p.onclick = () => {
      SoundSystem.playClick();
      state.simSpeed = 0;
      this.refreshSpeedButtons(p, p1, p2, 0);
    };
    p1.onclick = () => {
      SoundSystem.playClick();
      state.simSpeed = 1;
      this.refreshSpeedButtons(p, p1, p2, 1);
    };
    p2.onclick = () => {
      SoundSystem.playClick();
      state.simSpeed = 3;
      this.refreshSpeedButtons(p, p1, p2, 3);
    };
  }

  static refreshSpeedButtons(p, p1, p2, spd) {
    p.className = `c-btn ${spd === 0 ? "btn-primary" : "btn-ghost"} btn-sm`;
    p1.className = `c-btn ${spd === 1 ? "btn-primary" : "btn-ghost"} btn-sm`;
    p2.className = `c-btn ${spd === 3 ? "btn-primary" : "btn-ghost"} btn-sm`;
  }

  static bindEvents() {
    Events.on("dayTick", () => {
      this.updateHeaderMetrics();
      if (this.currentTab === "dashboard") {
        DashboardView.render(document.getElementById("viewport-root"));
      }
    });

    Events.on("toast", (data) => {
      if (data.type === "danger") SoundSystem.playWarning();
      else if (data.type === "success") SoundSystem.playSuccess();
      UI.toast(data.text, data.type);
    });

    Events.on("navTo", (tab) => this.switchTab(tab));
    Events.on("fundsChanged", () => this.updateHeaderMetrics());
    Events.on("inventoryChanged", () => this.updateHeaderMetrics());

    document.getElementById("modal-backdrop").onclick = UI.closeModal;
  }

  static updateHeaderMetrics() {
    document.getElementById("val-funds").textContent = `$${state.funds.toLocaleString()}`;
    const qEst = OrderEngine.calculateQuarterlyEstimate();
    const profitEl = document.getElementById("val-profit");
    profitEl.textContent = `${qEst.netProfitEst >= 0 ? "+" : ""}$${qEst.netProfitEst.toLocaleString()}`;
    profitEl.className = `metric-value ${qEst.netProfitEst < 0 ? "text-negative" : "text-positive"}`;

    document.getElementById("val-rep").textContent = `${state.reputation}%`;
    document.getElementById("val-wh").textContent = `${state.getWarehouseCount()} / ${state.warehouseCapacity}`;
    document.getElementById("val-date").textContent = state.getDateString();
    document.getElementById("val-quarter").textContent = state.getQuarterString();
  }
}

window.addEventListener("DOMContentLoaded", () => App.init());