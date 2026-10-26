// Auxiliary Battery Buffers: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.battery = [
  {
    id: "bat_none",
    name: "None (Continuous Wire Power Only)",
    type: "battery",
    isOptional: true,
    kwh: 0,
    rangeKm: 0,
    weight: 0,
    cost: 0,
    leadDays: 0,
    supplier: "Direct Wire Configuration",
    inHouseTech: null,
    desc: "No onboard traction energy storage. Unit operates strictly under catenary."
  },
  {
    id: "bat_lfp_lastmile",
    name: "Lithium Iron Phosphate Auxiliary Traction Pack",
    type: "battery",
    isOptional: true,
    kwh: 350,
    rangeKm: 35,
    weight: 2900,
    cost: 130000,
    leadDays: 14,
    supplier: "VoltaRail Storage Systems",
    inHouseTech: "tech_bat_lfp_lastmile",
    desc: "Provides self-propelled last-mile shunting across non-electrified sidings."
  },
  {
    id: "bat_nmc_intercity",
    name: "High-Capacity Traction Energy Storage System",
    type: "battery",
    isOptional: true,
    kwh: 1100,
    rangeKm: 110,
    weight: 6200,
    cost: 380000,
    leadDays: 24,
    supplier: "VoltaRail Storage Systems",
    inHouseTech: "tech_bat_nmc_intercity",
    desc: "High-energy density module designed to span non-electrified gaps on branch lines."
  }
];

SUBCOMPONENTS_DATA.battery = {
  subcomponents: [
    { id: "btherm_passive", name: "Forced Air Cooling Channel", cost: 4000, weight: 40, reliabilityBonus: 0, desc: "Basic convection fans venting battery enclosure heat." },
    { id: "btherm_liquid", name: "Refrigerant Direct-Plate Thermal Management", cost: 22000, weight: 110, reliabilityBonus: 14, desc: "Active heating and liquid chilling maintaining cell temperature at 25°C." }
  ],
  modifications: [
    { id: "bprot_standard", name: "Standard Steel Battery Containment Enclosure", cost: 8000, weight: 280, safetyBonus: 4, desc: "Heavy steel enclosure providing baseline impact protection." },
    { id: "bprot_kevlar", name: "Reinforced Titanium and Aramid Ballistic Shield", cost: 32000, weight: 130, safetyBonus: 16, desc: "High-tensile shielding preventing puncture from track debris." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_bat_lfp_lastmile", name: "Lithium Iron Phosphate (LFP) Last-Mile Pack", branch: "automation", costMoney: 450000, durationDays: 50, unlocks: ["bat_lfp_lastmile"], desc: "Thermal-runaway proof LFP chemistry powering depot and terminal shunting." },
  { id: "tech_bat_nmc_intercity", name: "High-Density NMC Intercity Traction Battery", branch: "automation", costMoney: 1450000, durationDays: 85, unlocks: ["bat_nmc_intercity"], desc: "High-energy NMC cells providing 1100 kWh to span non-electrified corridor gaps." }
);