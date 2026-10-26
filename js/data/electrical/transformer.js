// Traction Transformers & DC Chokes: Stats, Info, Subcomponents, and Research Metadata
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
    inHouseTech: null,
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
    inHouseTech: null,
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
    inHouseTech: "tech_compact_transformer",
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
    inHouseTech: "tech_solid_state_trans",
    desc: "Next-gen electronic high-frequency conversion replacing heavy iron cores."
  }
];

SUBCOMPONENTS_DATA.transformer = {
  subcomponents: [
    { id: "wind_copper", name: "Electrolytic High-Purity Copper Foil", cost: 18000, weight: 400, efficiencyBonus: 0.008, desc: "Standard high-conductivity secondary winding coils." },
    { id: "wind_alribbon", name: "Anodized Aluminum Ribbon Winding", cost: 12000, weight: -250, efficiencyBonus: -0.004, desc: "Weight-saving winding reducing overall locomotive tare mass." },
    { id: "wind_supercond", name: "High-Temperature Superconducting Ceramic Tape", cost: 65000, weight: -150, efficiencyBonus: 0.022, desc: "Negligible internal coil electrical resistance with ultra-high power density." }
  ],
  modifications: [
    { id: "cool_mineral", name: "Mineral Oil Cooling with Forced Pump", cost: 9000, weight: 320, reliabilityBonus: 0, desc: "Standard oil cooling system with radiator and heat exchangers." },
    { id: "cool_ester", name: "Biodegradable Synthetic Ester Cooling Loop", cost: 24000, weight: 180, reliabilityBonus: 8, desc: "High flash-point dielectric fluid with elevated thermal capacity." }
  ]
};

COMPONENT_RESEARCH.push(
  {
    id: "tech_compact_transformer",
    name: "Underfloor Compact Transformer",
    branch: "electronics",
    costMoney: 850000,
    durationDays: 70,
    unlocks: ["trans_compact", "inv_liquid_highpower_320"],
    desc: "Slim underfloor multi-winding transformer design freeing interior passenger cabin space."
  },
  {
    id: "tech_solid_state_trans",
    name: "Solid-State High-Frequency Matrix Transformer",
    branch: "electronics",
    costMoney: 4900000,
    durationDays: 180,
    unlocks: ["trans_solidstate"],
    desc: "Completely replaces heavy iron cores with microsecond semiconductor high-frequency conversion."
  }
);