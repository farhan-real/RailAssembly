// Procedural Contract Generation Engine Scaled to Player Tech Progression
const COMPETITORS_DATA = [
  {
    id: "comp_veloce",
    name: "Veloce Electromotive",
    country: "Italy / France",
    marketShare: 32,
    speedScore: 88,
    reliabilityScore: 82,
    avgMarkup: 22,
    specialty: "High-Speed Passenger & Aerodynamic EMUs"
  },
  {
    id: "comp_nordic",
    name: "Nordic Heavy Traction",
    country: "Sweden / Germany",
    marketShare: 28,
    speedScore: 68,
    reliabilityScore: 94,
    avgMarkup: 18,
    specialty: "Co-Co Heavy Haul Electric Locomotives"
  },
  {
    id: "comp_transglobal",
    name: "TransGlobal Rail Systems",
    country: "Japan / UK",
    marketShare: 24,
    speedScore: 92,
    reliabilityScore: 90,
    avgMarkup: 26,
    specialty: "Suburban Dual-Power EMUs & Autonomous TCMS"
  }
];

class ContractGenerator {
  static REGIONS = [
    "Northern Atlantic", "Trans-Alpine", "Pacific Coastal", "Great Lakes", "Kyushu Western",
    "Danube Basin", "Rhine-Westphalia", "Appalachian", "Adriatic Express", "Bavarian Southern",
    "Midlands Industrial", "Nordic Arctic", "Iberian Central", "High-Desert", "Baltic Maritime",
    "Kanto Metro", "Fennoscandian", "Laurentian Corridor", "Cascadia Corridor", "Carpathian"
  ];

  static AGENCIES = [
    "Transit Directorate", "Department of Rail Transport", "Corridor Commission",
    "Intercity Passenger Corporation", "Heavy Industrial Logistics Authority",
    "High-Speed Rail Bureau", "Metropolitan Transit Union", "Provincial Railway Administration"
  ];

  static MISSIONS = {
    highspeed: ["Shinkansen Bullet Link", "Grand Express Line", "Velocity Corridor", "Arrow Aerodynamic Sprints", "Express Inter-Capital Route"],
    freight: ["Heavy Mineral Haulage", "Mountain Basin Ore Line", "Intermodal Container Express", "Heavy Haul Mainline Shuttle", "Arctic Tundra Freight"],
    commuter: ["Suburban Rapid Transit", "Airport Express Link", "High-Frequency Metro EMU", "Metropolitan Outer Ring", "Urban S-Bahn Connector"],
    regional: ["Cross-Provincial Link", "Eco-Corridor Branch Line", "Mountain Valley Connector", "Alpine Pass Tilting Route", "Inter-City Parcel Fleet"]
  };

  static getPlayerTechProfile(gameState) {
    const unlocked = gameState?.unlockedTechs || new Set();
    const hasTech = (id) => {
      if (!unlocked) return false;
      if (typeof unlocked.has === "function") return unlocked.has(id);
      if (Array.isArray(unlocked)) return unlocked.includes(id);
      return false;
    };

    let maxSpeed = 160;
    if (hasTech("tech_body_supersonic_420") || hasTech("tech_mot_halbach_420") || hasTech("tech_panto_hyper_420")) maxSpeed = 420;
    else if (hasTech("tech_body_shinkansen_360") || hasTech("tech_mot_synchro_360") || hasTech("tech_bog_tilting_360")) maxSpeed = 360;
    else if (hasTech("tech_panto_hs_320") || hasTech("tech_mot_pmsm_320") || hasTech("tech_bog_radial_320")) maxSpeed = 320;
    else if (hasTech("tech_mot_pmsm_280") || hasTech("tech_body_carbon_monocoque") || hasTech("tech_panto_highspeed_280")) maxSpeed = 280;
    else if (hasTech("tech_transm_quill_230") || hasTech("tech_mot_copper_rotor") || hasTech("tech_bog_flexicoil_220")) maxSpeed = 230;

    let maxHp = 5200;
    if (hasTech("tech_mot_halbach_420") || hasTech("tech_inv_sic_hyper_380")) maxHp = 13000;
    else if (hasTech("tech_mot_synchro_360") || hasTech("tech_inv_sic_mosfet")) maxHp = 11500;
    else if (hasTech("tech_mot_pmsm_320") || hasTech("tech_inv_highpower_320")) maxHp = 10000;
    else if (hasTech("tech_mot_pmsm_280") || hasTech("tech_inv_liquid_vvvf")) maxHp = 8800;
    else if (hasTech("tech_mot_copper_rotor")) maxHp = 7200;

    let maxAdhesion = 380;
    if (hasTech("tech_sand_plasma") || hasTech("tech_bog_coco_freight")) maxAdhesion = 750;
    else if (hasTech("tech_sand_pneumatic") || hasTech("tech_pwm_direct_torque")) maxAdhesion = 520;

    const hasMultiSystem = hasTech("tech_panto_multisystem_250") || hasTech("tech_vcb_hybrid_multi");
    const hasBattery = hasTech("tech_bat_lfp_lastmile") || hasTech("tech_bat_nmc_intercity");
    const maxBatteryKm = hasTech("tech_bat_nmc_intercity") ? 110 : (hasTech("tech_bat_lfp_lastmile") ? 35 : 0);

    return { maxSpeed, maxHp, maxAdhesion, hasMultiSystem, hasBattery, maxBatteryKm };
  }

  static generateContract(gameState) {
    const profile = this.getPlayerTechProfile(gameState);
    const techCount = gameState?.unlockedTechs ? (typeof gameState.unlockedTechs.size === "number" ? gameState.unlockedTechs.size : gameState.unlockedTechs.length || 1) : 1;
    const year = gameState?.year || 1;
    const reputation = gameState?.reputation || 70;

    const progressLevel = Math.min(5, Math.max(1, Math.floor(techCount / 4) + Math.floor(year / 2)));
    const budgetScale = 1 + (progressLevel - 1) * 0.28 + (reputation - 70) * 0.008;

    const categories = ["highspeed", "freight", "commuter", "regional"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const region = ContractGenerator.REGIONS[Math.floor(Math.random() * ContractGenerator.REGIONS.length)];
    const agencyName = ContractGenerator.AGENCIES[Math.floor(Math.random() * ContractGenerator.AGENCIES.length)];
    const agency = `${region} ${agencyName}`;
    const missionName = ContractGenerator.MISSIONS[category][Math.floor(Math.random() * ContractGenerator.MISSIONS[category].length)];
    const title = `${region} ${missionName}`;

    const minUnits = 8 + progressLevel * 8;
    const maxUnits = 14 + progressLevel * 16;
    const units = minUnits + Math.floor(Math.random() * (maxUnits - minUnits + 1));
    const batch = Math.max(2, Math.min(8, Math.round(units / (5 + Math.floor(Math.random() * 3)))));
    const isChallenging = Math.random() < 0.35;

    let budget = 3200000;
    let mobDays = 45;
    let delayDays = 45;
    let markupFactor = 1.25 + (progressLevel - 1) * 0.06;
    let strictness = progressLevel >= 4 ? "Extreme Precision" : (progressLevel >= 2 ? "Demanding Specification" : "Standard Specification");
    const reqs = [];

    if (category === "highspeed") {
      let targetSpeed = isChallenging ? Math.min(420, profile.maxSpeed + 30) : Math.max(200, profile.maxSpeed - 15);
      budget = (4800000 + (targetSpeed - 200) * 14000) * budgetScale;
      mobDays = 55 + progressLevel * 4;
      delayDays = 35 + progressLevel * 5;

      reqs.push({ key: "speed", label: "Operating Speed", value: targetSpeed, unit: "km/h", compare: "min" });
      reqs.push({ key: "acceleration", label: "Starting Acceleration", value: Number((0.60 + Math.random() * 0.22).toFixed(2)), unit: "m/s²", compare: "min" });
      reqs.push({ key: "passengerCap", label: "Seating Capacity", value: 260 + progressLevel * 20, unit: "Seats", compare: "min" });
      if (targetSpeed >= 320) reqs.push({ key: "aerodynamics", label: "Max Aerodynamic Drag (Cd)", value: 0.22, unit: "Cd", compare: "max" });
    } else if (category === "freight") {
      let targetAdhesion = isChallenging ? Math.min(850, profile.maxAdhesion + 80) : Math.max(340, profile.maxAdhesion - 40);
      let targetHp = isChallenging ? Math.min(13000, profile.maxHp + 1600) : Math.max(5000, profile.maxHp - 500);
      budget = (3900000 + (targetHp - 5000) * 280) * budgetScale;
      mobDays = 50 + progressLevel * 5;
      delayDays = 50 + progressLevel * 5;

      reqs.push({ key: "tractiveEffort", label: "Tractive Effort Adhesion", value: targetAdhesion, unit: "kN", compare: "min" });
      reqs.push({ key: "horsepower", label: "Continuous Traction Power", value: targetHp, unit: "hp", compare: "min" });
      reqs.push({ key: "maxAxleLoad", label: "Max Permissible Axle Load", value: 25.0, unit: "t/Axle", compare: "max" });
    } else if (category === "commuter") {
      budget = (2500000 + progressLevel * 450000) * budgetScale;
      mobDays = 45 + progressLevel * 3;
      delayDays = 40 + progressLevel * 4;

      reqs.push({ key: "acceleration", label: "Starting Acceleration", value: Number((0.85 + Math.random() * 0.20).toFixed(2)), unit: "m/s²", compare: "min" });
      reqs.push({ key: "passengerCap", label: "Passenger Seating Capacity", value: 280 + progressLevel * 25, unit: "Passengers", compare: "min" });
      reqs.push({ key: "unitCost", label: "Unit Production Cost Ceiling", value: Math.round(budget * 0.88), unit: "USD", compare: "max" });
    } else {
      budget = (3400000 + progressLevel * 500000) * budgetScale;
      mobDays = 50 + progressLevel * 4;
      delayDays = 45 + progressLevel * 5;

      reqs.push({ key: "speed", label: "Operating Speed", value: Math.max(160, profile.maxSpeed - 25), unit: "km/h", compare: "min" });
      reqs.push({ key: "passengerCap", label: "Passenger Capacity", value: 250 + progressLevel * 20, unit: "Passengers", compare: "min" });
      reqs.push({ key: "efficiency", label: "Powertrain Efficiency", value: isChallenging ? 94 : 92, unit: "%", compare: "min" });
      if (isChallenging && profile.hasBattery) {
        reqs.push({ key: "batteryRange", label: "Wire-Free Battery Range", value: profile.maxBatteryKm || 30, unit: "km", compare: "min" });
        budget += 850000;
      }
    }

    const description = `${agency} has opened procurement for ${units} units of rolling stock for the ${region} network. Full test track certification is required.`;

    return {
      type: `${category}_${Math.random().toString(36).substring(2, 6)}`,
      category,
      title,
      agency,
      unitsRequired: units,
      batchSizePerQuarter: batch,
      budgetPerUnit: Math.round(budget),
      mobilizationDays: mobDays,
      delayToleranceDays: delayDays,
      strictnessTier: strictness,
      premiumMarkupFactor: Number(markupFactor.toFixed(2)),
      description,
      requirements: reqs
    };
  }
}

const CONTRACT_TEMPLATES = [];
const TENDER_TEMPLATES = CONTRACT_TEMPLATES;