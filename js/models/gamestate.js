// Central Game State Singleton with In-House and Supplier Sourcing Support
class GameState {
  constructor() {
    this.funds = 14500000;
    this.reputation = 72;
    this.day = 1;
    this.quarter = 1;
    this.year = 1;
    this.simSpeed = 1;
    this.sciencePoints = 80;
    this.dailyResearchBudget = 10000;
    this.activeResearchId = "tech_aluminum_extrusion";
    this.researchProgress = 0;
    this.unlockedTechs = new Set(["tech_aluminum_extrusion"]);

    // Active Warehouse Storage
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

    // Long Storage (Inactive Reserve Depot)
    this.longStorage = {};

    // Pending Deliveries from External Suppliers
    this.pendingDeliveries = [];

    // Active In-House Manufacturing Production Jobs
    this.inHouseQueue = [];

    // Commissioned Fleet Blueprints
    this.variants = [];

    // Active Assembly Lines
    this.productionLines = [];

    // Awarded Government Rolling Stock Contracts
    this.activeContracts = [];

    // Scarce Government Tenders
    this.marketTenders = [];
    this.nextTenderCountdown = 14;

    // Financial Tracking
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

  isInHouseAvailable(component) {
    if (!component.inHouseTech) return true;
    return this.unlockedTechs.has(component.inHouseTech);
  }

  getInHouseUnitCost(component) {
    return Math.round(component.cost * 0.58);
  }

  getInHouseFabricationDays(component, quantity) {
    const baseDays = Math.max(3, Math.round(component.leadDays * 0.65));
    return baseDays + Math.floor(quantity * 0.5);
  }

  getDateString() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = Math.floor(((this.day - 1) % 360) / 30);
    const dayInMonth = ((this.day - 1) % 30) + 1;
    return `${months[monthIndex]} ${dayInMonth}, Year ${this.year}`;
  }

  getQuarterString() {
    return `Quarter ${this.quarter} Year ${this.year}`;
  }

  findComponentById(id) {
    for (const cat in COMPONENTS_DATA) {
      const match = COMPONENTS_DATA[cat].find(c => c.id === id);
      if (match) return match;
    }
    return null;
  }

  findTechById(techId) {
    return TECH_DATA.find(t => t.id === techId) || null;
  }
}

const state = new GameState();