// Central Game State Singleton with Rare Procurement Lifecycle Tracking
class GameState {
  constructor() {
    this.funds = 14500000;
    this.reputation = 72; // 0 - 100
    this.day = 1;
    this.quarter = 1;
    this.year = 1;
    this.simSpeed = 1; // 0 = pause, 1 = normal, 3 = fast
    this.sciencePoints = 80;
    this.dailyResearchBudget = 10000; // $ per day invested into science
    this.activeResearchId = "tech_aluminum_extrusion";
    this.researchProgress = 0; // science points accrued on active tech
    this.unlockedTechs = new Set(["tech_aluminum_extrusion"]);

    // Inventory: Component ID -> quantity in active warehouse
    this.warehouse = {
      panto_std: 8,
      trans_heavy: 4,
      inv_igbt_air: 6,
      mot_ind_basic: 8,
      bog_co_co: 6,
      body_steel: 6,
      brk_disc_regen: 8,
      bat_none: 10,
      tcms_basic: 6
    };
    this.warehouseCapacity = 200;

    // Long Storage: Component ID -> quantity (unlimited capacity)
    this.longStorage = {};

    // Pending supplier procurement orders
    this.pendingDeliveries = [];

    // In-house manufacturing queue
    this.inHouseQueue = [];

    // User-created train variants (blueprints)
    this.variants = [];

    // Active production lines: { variantId, batchSize, unitsCompleted, dailyProgress }
    this.productionLines = [];

    // Awarded government contracts
    this.activeContracts = [];

    // Scarce Government Market Tenders (max 1 active tender at a time)
    this.marketTenders = [];
    this.nextTenderCountdown = 14; // Days until Ministry publishes the next mega-tender

    // Financial logs
    this.quarterlyRevenue = 0;
    this.quarterlyExpenses = 0;
    this.lastQuarterProfit = 0;
  }

  getWarehouseCount() {
    return Object.values(this.warehouse).reduce((sum, q) => sum + q, 0);
  }

  addToWarehouse(componentId, count) {
    this.warehouse[componentId] = (this.warehouse[componentId] || 0) + count;
  }

  takeFromWarehouse(componentId, count) {
    if ((this.warehouse[componentId] || 0) < count) return false;
    this.warehouse[componentId] -= count;
    if (this.warehouse[componentId] === 0) delete this.warehouse[componentId];
    return true;
  }

  moveToLongStorage(componentId, count) {
    if (this.takeFromWarehouse(componentId, count)) {
      this.longStorage[componentId] = (this.longStorage[componentId] || 0) + count;
      return true;
    }
    return false;
  }

  moveToWarehouse(componentId, count) {
    if ((this.longStorage[componentId] || 0) < count) return false;
    if (this.getWarehouseCount() + count > this.warehouseCapacity) return false;
    this.longStorage[componentId] -= count;
    if (this.longStorage[componentId] === 0) delete this.longStorage[componentId];
    this.addToWarehouse(componentId, count);
    return true;
  }

  getDateString() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = Math.floor(((this.day - 1) % 360) / 30);
    const dayInMonth = ((this.day - 1) % 30) + 1;
    return `${months[monthIndex]} ${dayInMonth}, Y${this.year}`;
  }

  getQuarterString() {
    return `Q${this.quarter} Year ${this.year}`;
  }

  findComponentById(id) {
    for (const cat in COMPONENTS_DATA) {
      const match = COMPONENTS_DATA[cat].find(c => c.id === id);
      if (match) return match;
    }
    return null;
  }
}

const state = new GameState();