// Traction Inverters & Auxiliary APS: Stats, Info, Subcomponents, and Research Metadata
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
    inHouseTech: null,
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
    inHouseTech: "tech_advanced_inverters",
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
    inHouseTech: "tech_compact_transformer",
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
    inHouseTech: "tech_sic_power",
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
    inHouseTech: "tech_solid_state_trans",
    desc: "Dual-core silicon carbide modules supplying 9.8 MW for 380+ km/h sustained sprints."
  }
];

COMPONENTS_DATA.auxiliary = [
  { id: "aux_none", name: "None (Direct Low-Voltage Line Taps)", type: "auxiliary", isOptional: true, powerKw: 0, weight: 0, cost: 0, leadDays: 0, supplier: "Internal Standard", inHouseTech: null, desc: "No auxiliary converter." },
  { id: "aux_std_static", name: "Static Auxiliary Inverter (180 kVA)", type: "auxiliary", isOptional: true, powerKw: 180, weight: 480, cost: 35000, leadDays: 8, supplier: "StaticPulse Power Systems", inHouseTech: null, desc: "Supplies stable low-voltage AC/DC power." },
  { id: "aux_hvac_commercial", name: "High-Capacity Dual-Channel APS (450 kVA)", type: "auxiliary", isOptional: true, powerKw: 450, weight: 920, cost: 85000, leadDays: 14, supplier: "Helvetia Electric Industries", inHouseTech: "tech_advanced_inverters", desc: "Powers multi-coach passenger air conditioning." }
];

SUBCOMPONENTS_DATA.inverter = {
  subcomponents: [
    { id: "gd_optical", name: "Fiber-Optic Isolated Gate Driver", cost: 14000, weight: 25, reliabilityBonus: 6, efficiencyBonus: 0.004, desc: "Immune to high-voltage electromagnetic interference transients." },
    { id: "gd_dynamic", name: "Adaptive Microsecond Intelligent Gate Controller", cost: 32000, weight: 30, reliabilityBonus: 14, efficiencyBonus: 0.012, desc: "Active switching slope regulation minimizing harmonic losses." }
  ],
  modifications: [
    { id: "therm_coldplate", name: "Micro-Channel Aluminum Liquid Coldplate", cost: 16000, weight: 65, efficiencyBonus: 0.006, desc: "Closed-circuit glycol-water cooling directly across semiconductor baseplates." },
    { id: "therm_phasechange", name: "Vapor Chamber Phase-Change Thermal Heatpipe", cost: 38000, weight: 40, efficiencyBonus: 0.015, desc: "Two-phase evaporative cooling enabling continuous high peak current." }
  ]
};

COMPONENT_RESEARCH.push(
  {
    id: "tech_advanced_inverters",
    name: "Liquid-Cooled VVVF Converters",
    branch: "electronics",
    costMoney: 450000,
    durationDays: 50,
    unlocks: ["inv_igbt_liquid", "aux_hvac_commercial"],
    desc: "Variable-frequency liquid-cooled inverter engineering delivering smooth motor acceleration."
  },
  {
    id: "tech_sic_power",
    name: "Silicon Carbide (SiC) Power Semiconductors",
    branch: "electronics",
    costMoney: 2400000,
    durationDays: 120,
    unlocks: ["inv_sic", "dclink_supercap_hybrid"],
    desc: "SiC MOSFET semiconductors slashing switching heat loss and enabling ultrasonic 18 kHz PWM."
  }
);