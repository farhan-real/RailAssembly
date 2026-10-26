// Traction Inverters & Auxiliary APS: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.inverter = [
  {
    id: "inv_igbt_air",
    name: "Air-Cooled IGBT Inverter",
    type: "inverter",
    maxKw: 3600,
    efficiency: 0.91,
    weight: 1600,
    cost: 120000,
    leadDays: 10,
    supplier: "StaticPulse Power Systems",
    inHouseTech: "tech_inv_air_cooled",
    desc: "Baseline air-cooled inverter. Power limited to 3600 kW; bottlenecks larger motors."
  },
  {
    id: "inv_igbt_liquid",
    name: "Liquid-Cooled Variable Frequency Inverter",
    type: "inverter",
    maxKw: 6200,
    efficiency: 0.95,
    weight: 1950,
    cost: 260000,
    leadDays: 16,
    supplier: "StaticPulse Power Systems",
    inHouseTech: "tech_inv_liquid_vvvf",
    desc: "Smooth VVVF liquid-cooled converter delivering up to 6200 kW motor drive power."
  },
  {
    id: "inv_liquid_highpower_320",
    name: "High-Throughput Dual-Drive Inverter (320 km/h)",
    type: "inverter",
    maxKw: 7500,
    efficiency: 0.965,
    weight: 1750,
    cost: 360000,
    leadDays: 20,
    supplier: "Helvetia Electric Industries",
    inHouseTech: "tech_inv_highpower_320",
    desc: "Engineered to deliver 7500 kW continuous power for 320 km/h passenger consists."
  },
  {
    id: "inv_sic",
    name: "Silicon Carbide Power Module Inverter",
    type: "inverter",
    maxKw: 8800,
    efficiency: 0.985,
    weight: 1200,
    cost: 510000,
    leadDays: 26,
    supplier: "Semiconductor Rail Dynamics",
    inHouseTech: "tech_inv_sic_mosfet",
    desc: "Next-gen SiC MOSFET converter with minimal thermal loss and full 8800 kW throughput."
  },
  {
    id: "inv_sic_dual_380",
    name: "Hyper-Velocity Dual-Core SiC Converter (380+ km/h)",
    type: "inverter",
    maxKw: 9800,
    efficiency: 0.99,
    weight: 1100,
    cost: 680000,
    leadDays: 30,
    supplier: "Semiconductor Rail Dynamics",
    inHouseTech: "tech_inv_sic_hyper_380",
    desc: "Dual-core silicon carbide modules supplying 9.8 MW for 380+ km/h sustained sprints."
  }
];

COMPONENTS_DATA.auxiliary = [
  { id: "aux_none", name: "None (Direct Low-Voltage Line Taps)", type: "auxiliary", isOptional: true, powerKw: 0, weight: 0, cost: 0, leadDays: 0, supplier: "Internal Standard", inHouseTech: null, desc: "No auxiliary converter." },
  { id: "aux_std_static", name: "Static Auxiliary Inverter (180 kVA)", type: "auxiliary", isOptional: true, powerKw: 180, weight: 480, cost: 35000, leadDays: 8, supplier: "StaticPulse Power Systems", inHouseTech: "tech_aux_aps_static", desc: "Supplies stable low-voltage AC/DC power." },
  { id: "aux_hvac_commercial", name: "High-Capacity Dual-Channel APS (450 kVA)", type: "auxiliary", isOptional: true, powerKw: 450, weight: 920, cost: 85000, leadDays: 14, supplier: "Helvetia Electric Industries", inHouseTech: "tech_aux_aps_hvac", desc: "Powers multi-coach passenger air conditioning." }
];

SUBCOMPONENTS_DATA.inverter = {
  subcomponents: [
    { id: "gd_optical", name: "Fiber-Optic Isolated Gate Driver", cost: 14000, weight: 25, reliabilityBonus: 6, efficiencyBonus: 0.004, inHouseTech: null, desc: "Immune to high-voltage electromagnetic interference transients." },
    { id: "gd_dynamic", name: "Adaptive Microsecond Intelligent Gate Controller", cost: 32000, weight: 30, reliabilityBonus: 14, efficiencyBonus: 0.012, inHouseTech: "tech_gd_dynamic", desc: "Active switching slope regulation minimizing harmonic losses." }
  ],
  modifications: [
    { id: "therm_coldplate", name: "Micro-Channel Aluminum Liquid Coldplate", cost: 16000, weight: 65, efficiencyBonus: 0.006, inHouseTech: null, desc: "Closed-circuit glycol-water cooling directly across semiconductor baseplates." },
    { id: "therm_phasechange", name: "Vapor Chamber Phase-Change Thermal Heatpipe", cost: 38000, weight: 40, efficiencyBonus: 0.015, inHouseTech: "tech_therm_phasechange", desc: "Two-phase evaporative cooling enabling continuous high peak current." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_inv_air_cooled", name: "Forced-Air Two-Level IGBT Inverter", branch: "electronics", costMoney: 220000, durationDays: 35, unlocks: ["inv_igbt_air"], desc: "Baseline 3600 kW insulated-gate bipolar transistor module with forced convection." },
  { id: "tech_inv_liquid_vvvf", name: "Closed-Loop Liquid-Cooled VVVF Inverter", branch: "electronics", costMoney: 450000, durationDays: 50, unlocks: ["inv_igbt_liquid"], desc: "Deionized water-glycol cooling maintaining 6200 kW continuous motor output." },
  { id: "tech_inv_highpower_320", name: "High-Throughput 7500 kW Inverter (320 km/h)", branch: "electronics", costMoney: 1100000, durationDays: 75, unlocks: ["inv_liquid_highpower_320"], desc: "High-density multi-channel converter engineered for 320 km/h passenger operations." },
  { id: "tech_inv_sic_mosfet", name: "Silicon Carbide (SiC) MOSFET Power Converter", branch: "electronics", costMoney: 2400000, durationDays: 120, unlocks: ["inv_sic"], desc: "Wide-bandgap semiconductors cutting switching losses by 70% with 8.8 MW power." },
  { id: "tech_inv_sic_hyper_380", name: "Hyper-Velocity 9.8 MW Dual-Core SiC Converter", branch: "electronics", costMoney: 4600000, durationDays: 160, unlocks: ["inv_sic_dual_380"], desc: "Dual parallel SiC arrays delivering 9800 kW for 380+ km/h sustained sprints." },
  { id: "tech_gd_dynamic", name: "Adaptive Microsecond Intelligent Gate Controller", branch: "electronics", costMoney: 680000, durationDays: 55, unlocks: ["gd_dynamic"], desc: "Dynamic slew-rate gate controller eliminating switching harmonics and ringing." },
  { id: "tech_therm_phasechange", name: "Vapor Chamber Phase-Change Thermal Heatpipe", branch: "electronics", costMoney: 1200000, durationDays: 75, unlocks: ["therm_phasechange"], desc: "Two-phase evaporative baseplates providing ultra-fast thermal heat spreading." },
  { id: "tech_aux_aps_static", name: "Solid-State Static Auxiliary Inverter (180 kVA)", branch: "electronics", costMoney: 140000, durationDays: 25, unlocks: ["aux_std_static"], desc: "Provides regulated 400V 50Hz and 110V DC power for cabin lighting and controls." },
  { id: "tech_aux_aps_hvac", name: "High-Capacity Dual-Channel APS (450 kVA)", branch: "electronics", costMoney: 320000, durationDays: 45, unlocks: ["aux_hvac_commercial"], desc: "Heavy auxiliary power supply powering multiple-coach HVAC and galley equipment." }
);