// Central Game State Singleton with Custom Carriage Types and Presets
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

    // Standard and Custom Carriage Types Registry
    this.customCarriageTypes = [
      {
        id: "driving_motor",
        name: "Driving Cab Motor Coach",
        isPowered: true,
        layout: "standard",
        seatMultiplier: 1.0,
        weightOffset: 0,
        costOffset: 0,
        desc: "Front/rear driver cab equipped with TCMS master and high-voltage traction motor bogie."
      },
      {
        id: "intermediate_motor",
        name: "Intermediate Motor Coach",
        isPowered: true,
        layout: "standard",
        seatMultiplier: 1.0,
        weightOffset: 0,
        costOffset: 0,
        desc: "Underfloor inverter and traction motor pack driving standard passenger coach body."
      },
      {
        id: "intermediate_trailer",
        name: "Intermediate Trailer Coach",
        isPowered: false,
        layout: "standard",
        seatMultiplier: 1.15,
        weightOffset: -4000,
        costOffset: -60000,
        desc: "Unpowered passenger coach maximizing seating density and reducing consist tare mass."
      },
      {
        id: "driving_trailer",
        name: "Driving Cab Trailer Coach",
        isPowered: false,
        layout: "standard",
        seatMultiplier: 0.95,
        weightOffset: -3000,
        costOffset: -45000,
        desc: "Front/rear driver cab with lightweight unpowered guide bogies."
      },
      {
        id: "bistro_trailer",
        name: "Bistro & First-Class Lounge Car",
        isPowered: false,
        layout: "lounge",
        seatMultiplier: 0.6,
        weightOffset: 1200,
        costOffset: 35000,
        desc: "Dining galley and premium passenger lounge with reduced seat count."
      }
    ];

    this.savedDesigns = [
      {
        id: "design_preset_emu_8car",
        name: "Express 8-Car Intercity EMU (4M4T)",
        type: "trainset",
        slots: {
          pantograph: "panto_std", transformer: "trans_compact", inverter: "inv_igbt_liquid",
          motor: "mot_ind_commuter", bogie: "bog_bo_bo", carbody: "body_aluminum",
          brakes: "brk_disc_regen", battery: "bat_none", tcms: "tcms_etcs2"
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
            { index: 1, typeId: "driving_motor", name: "Car 1: Driving Motor Coach", isPowered: true },
            { index: 2, typeId: "intermediate_motor", name: "Car 2: Intermediate Motor Coach", isPowered: true },
            { index: 3, typeId: "intermediate_trailer", name: "Car 3: Intermediate Trailer Coach", isPowered: false },
            { index: 4, typeId: "bistro_trailer", name: "Car 4: Bistro Trailer Coach", isPowered: false },
            { index: 5, typeId: "intermediate_trailer", name: "Car 5: Intermediate Trailer Coach", isPowered: false },
            { index: 6, typeId: "intermediate_motor", name: "Car 6: Intermediate Motor Coach", isPowered: true },
            { index: 7, typeId: "intermediate_motor", name: "Car 7: Intermediate Motor Coach", isPowered: true },
            { index: 8, typeId: "driving_trailer", name: "Car 8: Driving Trailer Coach", isPowered: false }
          ]
        },
        marginPercent: 25,
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

  findCarriageType(typeId) {
    return this.customCarriageTypes.find(t => t.id === typeId) || this.customCarriageTypes[0];
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