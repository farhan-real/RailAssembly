// Pantograph Current Collector Systems: Stats, Procurement Info, Subcomponents, and Research Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.pantograph = [
  {
    id: "panto_urban_dc",
    name: "Low-Voltage DC Single-Arm Collector",
    type: "pantograph",
    voltage: "1.5kV DC",
    maxSpeed: 120,
    maxCurrentAmps: 2200,
    weight: 240,
    cost: 32000,
    leadDays: 6,
    supplier: "VanderPant Overhead Systems",
    inHouseTech: null,
    desc: "Low-mass collector for 1.5kV DC suburban wires. Speed ceiling: 120 km/h."
  },
  {
    id: "panto_std",
    name: "Single-Arm AC Pantograph",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 200,
    maxCurrentAmps: 1100,
    weight: 320,
    cost: 45000,
    leadDays: 7,
    supplier: "VanderPant Overhead Systems",
    inHouseTech: null,
    desc: "Standard single-arm collector for 25kV 50Hz overhead wires. Speed ceiling: 200 km/h."
  },
  {
    id: "panto_freight",
    name: "Heavy-Duty Dual-Head Freight Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 140,
    maxCurrentAmps: 2600,
    weight: 560,
    cost: 65000,
    leadDays: 11,
    supplier: "VanderPant Overhead Systems",
    inHouseTech: null,
    desc: "Heavy twin-strip head sustaining 2600A current for mineral freight. Speed ceiling: 140 km/h."
  },
  {
    id: "panto_dual",
    name: "Dual-System Multi-Voltage Collector",
    type: "pantograph",
    voltage: "Multi-System (25kV AC / 3kV DC)",
    maxSpeed: 280,
    maxCurrentAmps: 2400,
    weight: 480,
    cost: 85000,
    leadDays: 14,
    supplier: "Catenary Dynamics Corporation",
    inHouseTech: "tech_multisystem",
    desc: "Dynamic switching between AC and DC networks. Speed ceiling: 280 km/h."
  },
  {
    id: "panto_hs_320",
    name: "Precision Airfoil Express Collector (320 km/h)",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 320,
    maxCurrentAmps: 1350,
    weight: 290,
    cost: 175000,
    leadDays: 20,
    supplier: "AeroVolt High-Speed Technologies",
    inHouseTech: "tech_aero_pantograph",
    desc: "Integrated carbon-strip airfoil sustaining uninterrupted contact at 320 km/h."
  },
  {
    id: "panto_bullet_380",
    name: "Shinkansen-Profile Low-Noise Pantograph (380 km/h)",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 380,
    maxCurrentAmps: 1400,
    weight: 260,
    cost: 230000,
    leadDays: 24,
    supplier: "AeroVolt High-Speed Technologies",
    inHouseTech: "tech_aero_pantograph",
    desc: "Vortex-shedding single-strut pantograph engineered for 380 km/h express services."
  },
  {
    id: "panto_hyper_420",
    name: "Active Piezo-Follower Hyper Collector (420 km/h)",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 420,
    maxCurrentAmps: 1550,
    weight: 240,
    cost: 320000,
    leadDays: 30,
    supplier: "AeroVolt High-Speed Technologies",
    inHouseTech: "tech_hyper_collection_420",
    desc: "Closed-loop piezoelectric wire tracking eliminating micro-arcs above 400 km/h."
  }
];

SUBCOMPONENTS_DATA.pantograph = {
  subcomponents: [
    { id: "cs_carbon", name: "Metallized Carbon Contact Strip", cost: 6000, weight: 15, speedBonus: 0, efficiencyBonus: 0.002, desc: "Standard European profile with low catenary wire abrasion." },
    { id: "cs_copper", name: "Sintered Copper-Graphite Strip", cost: 11000, weight: 26, speedBonus: 15, efficiencyBonus: 0.005, desc: "High ampacity alloy strip for sustained heavy traction loads." },
    { id: "cs_composite", name: "Carbon-Matrix Ceramic Composite Strip", cost: 24000, weight: 12, speedBonus: 35, efficiencyBonus: 0.008, desc: "Ultra-low friction composite engineered for high-speed corridors." }
  ],
  modifications: [
    { id: "act_pneumatic", name: "Pneumatic Bellows Actuator", cost: 5000, weight: 35, reliabilityBonus: 0, desc: "Standard compressed-air catenary contact pressure regulator." },
    { id: "act_servo", name: "High-Frequency Active Electric Servo", cost: 18000, weight: 22, reliabilityBonus: 12, desc: "Closed-loop electronic positioning maintaining steady wire contact at 300+ km/h." }
  ]
};

COMPONENT_RESEARCH.push(
  {
    id: "tech_multisystem",
    name: "Dual-Voltage Catenary Collection",
    branch: "power_collection",
    costMoney: 950000,
    durationDays: 65,
    unlocks: ["panto_dual", "vcb_hybrid_multisystem"],
    desc: "Seamless transition between 25kV AC and 3kV DC catenary networks."
  },
  {
    id: "tech_aero_pantograph",
    name: "320-380 km/h High-Speed Pantographs",
    branch: "power_collection",
    costMoney: 2400000,
    durationDays: 105,
    unlocks: ["panto_hs_320", "panto_bullet_380"],
    desc: "Aerodynamically stabilized collectors preventing wire arcing and contact loss at 380 km/h."
  },
  {
    id: "tech_hyper_collection_420",
    name: "Active Piezoelectric 420 km/h Collectors",
    branch: "power_collection",
    costMoney: 5200000,
    durationDays: 165,
    unlocks: ["panto_hyper_420"],
    desc: "Closed-loop piezoelectric wire tension followers eliminating micro-arcs above 400 km/h."
  }
);