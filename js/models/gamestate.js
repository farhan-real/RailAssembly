// Central Game State Singleton with Comprehensive LocalStorage Persistence
class GameState {
  constructor() {
    this.funds = 14500000;
    this.reputation = 72;
    this.day = 1;
    this.quarter = 1;
    this.year = 1;
    this.simSpeed = 1;

    // R&D Project State: Real-World Time & Capital
    this.activeResearchId = null;
    this.researchDaysLeft = 0;
    this.researchTotalDays = 0;
    this.unlockedTechs = new Set(["tech_core"]);

    this.masterVolume = 80;
    this.sfxVolume = 80;
    this.audioMuted = false;

    this.warehouse = {
      panto_schunk_wbl85: 12, trans_heavy: 6, inv_igbt_air: 10,
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

  startResearch(techId) {
    const tech = TECH_DATA.find(t => t.id === techId);
    if (!tech) return { success: false, reason: "Invalid technology." };

    if (this.unlockedTechs.has(tech.id)) {
      return { success: false, reason: "Technology is already developed." };
    }

    const unfulfilledPrereqs = (tech.prereq || []).filter(p => !this.unlockedTechs.has(p));
    if (unfulfilledPrereqs.length > 0) {
      return { success: false, reason: "Branch locked: complete prerequisite research first." };
    }

    if (this.funds < tech.costMoney) {
      return { success: false, reason: `Insufficient capital: requires $${tech.costMoney.toLocaleString()}.` };
    }

    this.funds -= tech.costMoney;
    this.activeResearchId = tech.id;
    this.researchDaysLeft = tech.durationDays;
    this.researchTotalDays = tech.durationDays;

    this.saveToStorage();
    Events.emit("fundsChanged");
    return { success: true, tech };
  }

  isSubcomponentUnlocked(subId) {
    if (!subId) return true;
    for (const cat in SUBCOMPONENTS_DATA) {
      const data = SUBCOMPONENTS_DATA[cat];
      const item = data.subcomponents?.find(s => s.id === subId) || data.modifications?.find(m => m.id === subId);
      if (item) {
        if (!item.inHouseTech) return true;
        return this.unlockedTechs.has(item.inHouseTech);
      }
    }
    return true;
  }

  findSubcomponentOrMod(id) {
    for (const cat in SUBCOMPONENTS_DATA) {
      const data = SUBCOMPONENTS_DATA[cat];
      const sub = data.subcomponents?.find(s => s.id === id);
      if (sub) return { ...sub, isMod: false, catKey: cat };
      const mod = data.modifications?.find(m => m.id === id);
      if (mod) return { ...mod, isMod: true, catKey: cat };
    }
    return null;
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
        funds: this.funds,
        reputation: this.reputation,
        day: this.day,
        quarter: this.quarter,
        year: this.year,
        simSpeed: this.simSpeed,
        activeResearchId: this.activeResearchId,
        researchDaysLeft: this.researchDaysLeft,
        researchTotalDays: this.researchTotalDays,
        unlockedTechs: Array.from(this.unlockedTechs),
        masterVolume: this.masterVolume,
        sfxVolume: this.sfxVolume,
        audioMuted: this.audioMuted,
        warehouse: this.warehouse,
        warehouseCapacity: this.warehouseCapacity,
        longStorage: this.longStorage,
        pendingDeliveries: this.pendingDeliveries,
        inHouseQueue: this.inHouseQueue,
        variants: this.variants,
        productionLines: this.productionLines,
        activeContracts: this.activeContracts,
        marketTenders: this.marketTenders,
        nextTenderCountdown: this.nextTenderCountdown,
        customCarriageTypes: this.customCarriageTypes,
        savedDesigns: this.savedDesigns
      };
      localStorage.setItem("rail_assembly_save", JSON.stringify(data));
    } catch (e) { /* Safe fallback */ }
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem("rail_assembly_save");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.funds === "number") this.funds = data.funds;
      if (typeof data.reputation === "number") this.reputation = data.reputation;
      if (typeof data.day === "number") this.day = data.day;
      if (typeof data.quarter === "number") this.quarter = data.quarter;
      if (typeof data.year === "number") this.year = data.year;
      if (typeof data.simSpeed === "number") this.simSpeed = data.simSpeed;

      if (data.activeResearchId !== undefined) this.activeResearchId = data.activeResearchId;
      if (typeof data.researchDaysLeft === "number") this.researchDaysLeft = data.researchDaysLeft;
      if (typeof data.researchTotalDays === "number") this.researchTotalDays = data.researchTotalDays;
      if (Array.isArray(data.unlockedTechs)) this.unlockedTechs = new Set(data.unlockedTechs);

      if (typeof data.masterVolume === "number") this.masterVolume = data.masterVolume;
      if (typeof data.sfxVolume === "number") this.sfxVolume = data.sfxVolume;
      if (typeof data.audioMuted === "boolean") this.audioMuted = data.audioMuted;

      if (data.warehouse && typeof data.warehouse === "object") this.warehouse = data.warehouse;
      if (typeof data.warehouseCapacity === "number") this.warehouseCapacity = data.warehouseCapacity;
      if (data.longStorage && typeof data.longStorage === "object") this.longStorage = data.longStorage;
      if (Array.isArray(data.pendingDeliveries)) this.pendingDeliveries = data.pendingDeliveries;
      if (Array.isArray(data.inHouseQueue)) this.inHouseQueue = data.inHouseQueue;
      if (Array.isArray(data.variants)) this.variants = data.variants;
      if (Array.isArray(data.productionLines)) this.productionLines = data.productionLines;
      if (Array.isArray(data.activeContracts)) {
        this.activeContracts = data.activeContracts.map(c => ({
          ...c,
          isMobilizing: Boolean(c.isMobilizing),
          mobilizationDaysLeft: typeof c.mobilizationDaysLeft === "number" ? c.mobilizationDaysLeft : 0,
          mobilizationDaysTotal: typeof c.mobilizationDaysTotal === "number" ? c.mobilizationDaysTotal : 45
        }));
      }
      if (Array.isArray(data.marketTenders)) this.marketTenders = data.marketTenders;
      if (typeof data.nextTenderCountdown === "number") this.nextTenderCountdown = data.nextTenderCountdown;
      if (Array.isArray(data.customCarriageTypes)) this.customCarriageTypes = data.customCarriageTypes;
      if (Array.isArray(data.savedDesigns)) this.savedDesigns = data.savedDesigns;
    } catch (e) { /* Safe fallback */ }
  }

  resetAllData() {
    try { localStorage.removeItem("rail_assembly_save"); } catch (e) { }

    this.funds = 14500000;
    this.reputation = 72;
    this.day = 1;
    this.quarter = 1;
    this.year = 1;
    this.simSpeed = 1;

    this.activeResearchId = null;
    this.researchDaysLeft = 0;
    this.researchTotalDays = 0;
    this.unlockedTechs = new Set(["tech_core"]);

    this.warehouse = {
      panto_schunk_wbl85: 12, trans_heavy: 6, inv_igbt_air: 10,
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
    this.saveToStorage();
  }

  takeFromWarehouse(componentId, count) {
    if ((this.warehouse[componentId] || 0) < count) return false;
    this.warehouse[componentId] -= count;
    if (this.warehouse[componentId] === 0) delete this.warehouse[componentId];
    this.saveToStorage();
    return true;
  }

  moveToLongStorage(componentId, count) {
    if (this.takeFromWarehouse(componentId, count)) {
      this.longStorage[componentId] = (this.longStorage[componentId] || 0) + count;
      this.saveToStorage();
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
    this.saveToStorage();
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

  findCarriageType(typeId) {
    return this.customCarriageTypes.find(t => t.id === typeId) || this.customCarriageTypes[0];
  }

  findComponentById(id) {
    for (const cat in COMPONENTS_DATA) {
      const match = COMPONENTS_DATA[cat]?.find(c => c.id === id);
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