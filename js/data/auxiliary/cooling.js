// Thermal Cooling & Radiator Loops: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.cooling = [
  {
    id: "cool_forced_air",
    name: "Forced-Air Dual Blower Cooling System",
    type: "cooling",
    thermalDissipationKw: 3500,
    parasiticLoadKw: 25,
    weight: 380,
    cost: 24000,
    leadDays: 8,
    supplier: "ThermalDynamics GmbH",
    inHouseTech: "tech_cool_forced_air",
    desc: "Lightweight forced air blowers. Zero liquid coolant; throttles under sustained 4000+ kW loads."
  },
  {
    id: "cool_oil_radiator",
    name: "Pumped Mineral-Oil Heat Exchanger Loop",
    type: "cooling",
    thermalDissipationKw: 6200,
    parasiticLoadKw: 45,
    weight: 790,
    cost: 58000,
    leadDays: 14,
    supplier: "ThermalDynamics GmbH",
    inHouseTech: "tech_cool_oil_radiator",
    desc: "Closed-loop oil circulation radiator maintaining continuous full-power transformer duty."
  },
  {
    id: "cool_glycol_chiller",
    name: "Dual-Circuit Water-Glycol Chiller Loop",
    type: "cooling",
    thermalDissipationKw: 9200,
    parasiticLoadKw: 65,
    weight: 940,
    cost: 110000,
    leadDays: 22,
    supplier: "ThermalDynamics GmbH",
    inHouseTech: "tech_cool_glycol_chiller",
    desc: "High-efficiency liquid chiller extracting heat from both high-frequency SiC inverters and traction motors."
  }
];

SUBCOMPONENTS_DATA.cooling = {
  subcomponents: [
    { id: "pump_magnetic", name: "Sealless Magnetic Drive Coolant Circulation Pump", cost: 14000, weight: 35, reliabilityBonus: 10, desc: "Eliminates mechanical shaft seals, completely preventing coolant fluid leakage." }
  ],
  modifications: [
    { id: "fan_ec_brushless", name: "Variable-Speed Brushless EC Radiator Fans", cost: 18000, weight: 20, efficiencyBonus: 0.005, desc: "Modulates radiator fan speed proportionally to coolant temperature, saving auxiliary power." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_cool_forced_air", name: "Forced-Air Electric Radiator Cowling", branch: "power_collection", costMoney: 150000, durationDays: 25, unlocks: ["cool_forced_air"], desc: "Lightweight forced air blowers providing baseline cooling for inverters." },
  { id: "tech_cool_oil_radiator", name: "Pumped Mineral-Oil Cooling Radiator Loop", branch: "power_collection", costMoney: 320000, durationDays: 45, unlocks: ["cool_oil_radiator"], desc: "Closed-loop oil heat exchanger maintaining continuous full-power transformer operation." },
  { id: "tech_cool_glycol_chiller", name: "Dual-Circuit Water-Glycol Chiller Loop", branch: "power_collection", costMoney: 850000, durationDays: 70, unlocks: ["cool_glycol_chiller"], desc: "High-capacity chiller extracting 9.2 MW heat from SiC inverters and traction motors." }
);