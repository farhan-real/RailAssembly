// Central Game State Singleton with Audio Settings, Persistence, and Reset
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

    // Sound & Audio Settings
    this.masterVolume = 80;
    this.sfxVolume = 80;
    this.audioMuted = false;

    this.warehouse = {
      panto_std: 12, trans_heavy: 6, inv_igbt_air: 10,
      mot_ind_basic: 12, bog_co_co: 8, body_steel: 8,
      brk_disc_regen: 12, bat_none: 16, tcms_basic: 8
    };
    this.warehouseCapacity = 250;
    this.longStorage = {};
    this.pendingDeliveries = [];
    this.inHouseQueue = [];
    this.variants = [];
    this.productionLines = [];
    this.activeContracts = [];
    this.marketTenders = [];
    this.nextTenderCountdown = 0;

    this.customCarriageTypes = [
      { id: "driving_motor", name: "Driving Cab Motor Coach", isPowered: true, layout: "standard", seatMultiplier: 1.0, weightOffset: 0, costOffset: 0, desc: "Front/rear driver cab with TCMS master and high-voltage motor bogie." },
      { id: "intermediate_motor", name: "Intermediate Motor Coach", isPowered: true, layout: "standard", seatMultiplier: 1.0, weightOffset: 0, costOffset: 0, desc: "Underfloor inverter and traction motor pack driving standard passenger coach body." },
      { id: "intermediate_trailer", name: "Intermediate Trailer Coach", isPowered: false, layout: "standard", seatMultiplier: 1.15, weightOffset: -4000, costOffset: -60000, desc: "Unpowered passenger coach maximizing seating density and reducing consist tare mass." },
      { id: "driving_trailer", name: "Driving Cab Trailer Coach", isPowered: false, layout: "standard", seatMultiplier: 0.95, weightOffset: -3000, costOffset: -45000, desc: "Front/rear driver cab with lightweight unpowered guide bogies." },
      { id: "bistro_trailer", name: "Bistro & First-Class Lounge Car", isPowered: false, layout: "lounge", seatMultiplier: 0.6, weightOffset: 1200, costOffset: 35000, desc: "Dining galley and premium passenger lounge with reduced seat count." }
    ];

    this.savedDesigns = [];
    this.loadFromStorage();
  }

  saveVariant(variantData) {
    const existingIndex = this.variants.findIndex(v => v.id === variantData.id);
    if (existingIndex >= 0) this.variants[existingIndex] = { ...variantData };
    else this.variants.push(variantData);
    this.saveToStorage();
    Events.emit("variantsChanged");
  }

  addCarriageType(typeData) {
    this.customCarriageTypes.push(typeData);
    this.saveToStorage();
  }

  updateCarriageType(id, updatedData) {
    const idx = this.customCarriageTypes.findIndex(t => t.id === id);
    if (idx >= 0) {
      this.customCarriageTypes[idx] = { ...this.customCarriageTypes[idx], ...updatedData };
      this.saveToStorage();
    }
  }

  deleteCarriageType(id) {
    this.customCarriageTypes = this.customCarriageTypes.filter(t => t.id !== id);
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      const data = {
        variants: this.variants,
        customCarriageTypes: this.customCarriageTypes,
        savedDesigns: this.savedDesigns,
        funds: this.funds,
        reputation: this.reputation,
        day: this.day,
        masterVolume: this.masterVolume,
        sfxVolume: this.sfxVolume,
        audioMuted: this.audioMuted
      };
      localStorage.setItem("rail_assembly_save", JSON.stringify(data));
    } catch (e) { /* Safe fallback */ }
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem("rail_assembly_save");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.variants)) this.variants = data.variants;
      if (Array.isArray(data.customCarriageTypes)) this.customCarriageTypes = data.customCarriageTypes;
      if (Array.isArray(data.savedDesigns)) this.savedDesigns = data.savedDesigns;
      if (data.masterVolume !== undefined) this.masterVolume = data.masterVolume;
      if (data.sfxVolume !== undefined) this.sfxVolume = data.sfxVolume;
      if (data.audioMuted !== undefined) this.audioMuted = data.audioMuted;
    } catch (e) { /* Safe fallback */ }
  }

  resetAllData() {
    try {
      localStorage.removeItem("rail_assembly_save");
    } catch (e) { /* Safe fallback */ }

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

    this.warehouse = {
      panto_std: 12, trans_heavy: 6, inv_igbt_air: 10,
      mot_ind_basic: 12, bog_co_co: 8, body_steel: 8,
      brk_disc_regen: 12, bat_none: 16, tcms_basic: 8
    };
    this.longStorage = {};
    this.pendingDeliveries = [];
    this.inHouseQueue = [];
    this.variants = [];
    this.productionLines = [];
    this.activeContracts = [];
    this.marketTenders = [];
    this.nextTenderCountdown = 0;
    this.savedDesigns = [];

    this.saveToStorage();
    Events.emit("fundsChanged");
    Events.emit("inventoryChanged");
    Events.emit("variantsChanged");
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

  findCarriageType(typeId) {
    return this.customCarriageTypes.find(t => t.id === typeId) || this.customCarriageTypes[0];
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

  getDateString() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = Math.floor(((this.day - 1) % 360) / 30);
    const dayInMonth = ((this.day - 1) % 30) + 1;
    return `${months[monthIndex]} ${dayInMonth}, Year ${this.year}`;
  }

  getQuarterString() {
    return `Quarter ${this.quarter} Year ${this.year}`;
  }
}

const state = new GameState();