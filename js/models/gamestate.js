// Central Game State Singleton with In-House, Supplier, and Saved Design Persistence
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
      panto_std: 12,
      trans_heavy: 6,
      inv_igbt_air: 10,
      mot_ind_basic: 12,
      bog_co_co: 8,
      body_steel: 8,
      brk_disc_regen: 12,
      bat_none: 16,
      tcms_basic: 8
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

    // Design Blueprint Library with Reference Factory Presets
    this.savedDesigns = [
      {
        id: "design_preset_emu_8car",
        name: "Express 8-Car Intercity EMU (4M4T)",
        type: "trainset",
        slots: {
          pantograph: "panto_std",
          transformer: "trans_compact",
          inverter: "inv_igbt_liquid",
          motor: "mot_ind_commuter",
          bogie: "bog_bo_bo",
          carbody: "body_aluminum",
          brakes: "brk_disc_regen",
          battery: "bat_none",
          tcms: "tcms_etcs2"
        },
        subSelections: {
          pantograph: { subcomponent: "cs_carbon", modification: "act_servo" },
          transformer: { subcomponent: "wind_copper", modification: "cool_ester" },
          inverter: { subcomponent: "gd_optical", modification: "therm_coldplate" },
          motor: { subcomponent: "gb_single", modification: "brg_ceramic" },
          bogie: { subcomponent: "susp_air", modification: "whl_cryo" },
          carbody: { subcomponent: "crash_crushzone", modification: "aero_nose" },
          brakes: { subcomponent: "cal_monobloc", modification: "disc_iron" },
          battery: { subcomponent: "btherm_passive", modification: "bprot_standard" },
          tcms: { subcomponent: "bus_etb", modification: "sens_radar" }
        },
        consistConfig: {
          carriageCount: 8,
          carriages: [
            { index: 1, role: "driving_motor", isPowered: true, name: "Car 1: Driving Motor Coach" },
            { index: 2, role: "intermediate_motor", isPowered: true, name: "Car 2: Intermediate Motor Coach" },
            { index: 3, role: "intermediate_trailer", isPowered: false, name: "Car 3: Intermediate Trailer Coach" },
            { index: 4, role: "bistro_trailer", isPowered: false, name: "Car 4: Bistro Trailer Coach" },
            { index: 5, role: "intermediate_trailer", isPowered: false, name: "Car 5: Intermediate Trailer Coach" },
            { index: 6, role: "intermediate_motor", isPowered: true, name: "Car 6: Intermediate Motor Coach" },
            { index: 7, role: "intermediate_motor", isPowered: true, name: "Car 7: Intermediate Motor Coach" },
            { index: 8, role: "driving_trailer", isPowered: false, name: "Car 8: Driving Trailer Coach" }
          ]
        },
        marginPercent: 25,
        savedDate: "Factory Master Reference"
      },
      {
        id: "design_preset_freight_coco",
        name: "Heavy Mineral Freight Co-Co Locomotive",
        type: "locomotive",
        slots: {
          pantograph: "panto_freight",
          transformer: "trans_heavy",
          inverter: "inv_igbt_freight",
          motor: "mot_ind_highoutput",
          bogie: "bog_co_co",
          carbody: "body_steel",
          brakes: "brk_disc_regen",
          battery: "bat_lfp_lastmile",
          tcms: "tcms_basic"
        },
        subSelections: {
          pantograph: { subcomponent: "cs_copper", modification: "act_pneumatic" },
          transformer: { subcomponent: "wind_copper", modification: "cool_mineral" },
          inverter: { subcomponent: "gd_dynamic", modification: "therm_coldplate" },
          motor: { subcomponent: "gb_freight", modification: "brg_steel" },
          bogie: { subcomponent: "susp_coil", modification: "whl_cryo" },
          carbody: { subcomponent: "crash_standard", modification: "aero_none" },
          brakes: { subcomponent: "cal_cast", modification: "disc_iron" },
          battery: { subcomponent: "btherm_liquid", modification: "bprot_kevlar" },
          tcms: { subcomponent: "bus_wtb", modification: "sens_standard" }
        },
        consistConfig: { carriageCount: 1, carriages: [] },
        marginPercent: 20,
        savedDate: "Factory Master Reference"
      }
    ];

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