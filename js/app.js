// Main App Orchestration, Routing, and Header Updates
class App {
  static currentTab = "dashboard";

  static init() {
    this.mountBrandIcons();
    this.bindNavigation();
    this.bindTimeControls();
    this.bindEvents();

    // Spawn 1 initial tender
    OrderEngine.evaluateGovernmentBids();

    // Render initial view
    this.switchTab("dashboard");

    // Launch simulation
    SimulationRunner.start();
    this.updateHeaderMetrics();
  }

  static mountBrandIcons() {
    document.getElementById("brand-logo-slot").innerHTML = ICONS.train;
    document.getElementById("icon-capital").innerHTML = ICONS.money;
    document.getElementById("icon-profit").innerHTML = ICONS.rep;
    document.getElementById("icon-rep").innerHTML = ICONS.rep;
    document.getElementById("icon-storage").innerHTML = ICONS.storage;
    document.getElementById("icon-time").innerHTML = ICONS.time;

    document.getElementById("btn-pause").innerHTML = ICONS.pause;
    document.getElementById("btn-play-1").innerHTML = ICONS.play;
    document.getElementById("btn-play-2").innerHTML = ICONS.fast;

    document.getElementById("nav-icon-dash").innerHTML = ICONS.motor;
    document.getElementById("nav-icon-build").innerHTML = ICONS.pantograph;
    document.getElementById("nav-icon-cat").innerHTML = ICONS.train;
    document.getElementById("nav-icon-inv").innerHTML = ICONS.storage;
    document.getElementById("nav-icon-res").innerHTML = ICONS.inverter;
    document.getElementById("nav-icon-mkt").innerHTML = ICONS.money;
  }

  static bindNavigation() {
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.onclick = () => {
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
    }
  }

  static bindTimeControls() {
    const p = document.getElementById("btn-pause");
    const p1 = document.getElementById("btn-play-1");
    const p2 = document.getElementById("btn-play-2");

    p.onclick = () => {
      state.simSpeed = 0;
      this.refreshSpeedButtons(p, p1, p2, 0);
    };
    p1.onclick = () => {
      state.simSpeed = 1;
      this.refreshSpeedButtons(p, p1, p2, 1);
    };
    p2.onclick = () => {
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

    Events.on("toast", (data) => UI.toast(data.text, data.type));
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
    profitEl.className = `metric-value ${qEst.netProfitEst < 0 ? "text-red" : "text-accent"}`;

    document.getElementById("val-rep").textContent = `${state.reputation}%`;
    document.getElementById("val-wh").textContent = `${state.getWarehouseCount()} / ${state.warehouseCapacity}`;
    document.getElementById("val-date").textContent = state.getDateString();
    document.getElementById("val-quarter").textContent = state.getQuarterString();
  }
}

window.addEventListener("DOMContentLoaded", () => App.init());