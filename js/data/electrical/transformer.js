// Traction Transformers & DC Chokes: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.transformer = [
  {
    id: "trans_none_dc",
    name: "Direct DC Choke Filter & Reactor Unit",
    type: "transformer",
    powerRatingKw: 4200,
    supportedVoltage: "1.5kV DC / 3kV DC",
    efficiency: 0.99,
    weight: 850,
    cost: 75000,
    leadDays: 8,
    supplier: "TrafoTech Global AG",
    inHouseTech: "tech_trans_dc_choke",
    desc: "Direct LC smoothing for DC catenary networks with zero heavy transformer core."
  },
  {
    id: "trans_heavy",
    name: "Heavy-Duty Core Transformer",
    type: "transformer",
    powerRatingKw: 4200,
    supportedVoltage: "25kV AC",
    efficiency: 0.92,
    weight: 5800,
    cost: 180000,
    leadDays: 18,
    supplier: "TrafoTech Global AG",
    inHouseTech: "tech_trans_heavy_ac",
    desc: "Robust oil-cooled iron core transformer suited for freight locomotives."
  },
  {
    id: "trans_compact",
    name: "Compact Underfloor Traction Transformer",
    type: "transformer",
    powerRatingKw: 5500,
    supportedVoltage: "Multi-System (25kV AC / 3kV DC)",
    efficiency: 0.95,
    weight: 4100,
    cost: 320000,
    leadDays: 24,
    supplier: "Helvetia Electric Industries",
    inHouseTech: "tech_trans_compact_underfloor",
    desc: "Low-profile underfloor transformer freeing passenger cabin volume."
  },
  {
    id: "trans_solidstate",
    name: "Solid-State Electronic Matrix Transformer",
    type: "transformer",
    powerRatingKw: 9200,
    supportedVoltage: "Multi-System (25kV AC / 3kV DC)",
    efficiency: 0.985,
    weight: 2500,
    cost: 620000,
    leadDays: 32,
    supplier: "QuantumPower Systems",
    inHouseTech: "tech_trans_solid_state",
    desc: "Next-gen electronic high-frequency conversion replacing heavy iron cores."
  }
];

SUBCOMPONENTS_DATA.transformer = {
  subcomponents: [
    { id: "wind_copper", name: "High-Purity Copper Foil Secondary Winding", cost: 18000, weight: 400, efficiencyBonus: 0.008, inHouseTech: null, desc: "Standard high-conductivity secondary winding coils." },
    { id: "wind_alribbon", name: "Anodized Aluminum Ribbon Weight-Saver Winding", cost: 12000, weight: -250, efficiencyBonus: -0.004, inHouseTech: null, desc: "Weight-saving winding reducing overall locomotive tare mass." },
    { id: "wind_supercond", name: "High-Temperature Superconducting Ceramic Tape", cost: 65000, weight: -150, efficiencyBonus: 0.022, inHouseTech: "tech_wind_supercond", desc: "Negligible internal coil electrical resistance with ultra-high power density." }
  ],
  modifications: [
    { id: "cool_mineral", name: "Mineral Oil Cooling Radiator with Forced Pump", cost: 9000, weight: 320, reliabilityBonus: 0, inHouseTech: null, desc: "Standard oil cooling system with radiator and heat exchangers." },
    { id: "cool_ester", name: "Biodegradable Synthetic Ester Cooling Loop", cost: 24000, weight: 180, reliabilityBonus: 8, inHouseTech: "tech_cool_ester", desc: "High flash-point dielectric fluid with elevated thermal capacity." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_trans_dc_choke", name: "Direct DC Smoothing Choke & LC Filter", branch: "electronics", costMoney: 190000, durationDays: 30, unlocks: ["trans_none_dc"], desc: "Iron-core inductors eliminating AC conversion mass on dedicated DC networks." },
  { id: "tech_trans_heavy_ac", name: "Heavy-Duty Multi-Secondary 25kV Transformer", branch: "electronics", costMoney: 340000, durationDays: 45, unlocks: ["trans_heavy"], desc: "High-reliability oil-immersed core for sustained freight locomotive traction." },
  { id: "tech_trans_compact_underfloor", name: "Low-Profile Underfloor Traction Transformer", branch: "electronics", costMoney: 850000, durationDays: 70, unlocks: ["trans_compact"], desc: "Flat-core multi-winding architecture fitted underneath multiple-unit passenger cars." },
  { id: "tech_trans_solid_state", name: "Solid-State High-Frequency Matrix Transformer", branch: "electronics", costMoney: 4900000, durationDays: 180, unlocks: ["trans_solidstate"], desc: "Electronic multi-stage conversion eliminating copper windings with 9.2 MW throughput." },
  { id: "tech_wind_supercond", name: "Superconducting Ceramic Matrix Windings", branch: "electronics", costMoney: 1850000, durationDays: 95, unlocks: ["wind_supercond"], desc: "Ceramic YBCO tape eliminating winding electrical resistance with +2.2% efficiency." },
  { id: "tech_cool_ester", name: "Biodegradable Synthetic Ester Cooling Loop", branch: "electronics", costMoney: 420000, durationDays: 50, unlocks: ["cool_ester"], desc: "Eco-friendly synthetic ester insulating oil with a 300°C flash point." }
);