// Rail Adhesion & Sanding Equipment: Stats, Info, Subcomponents, and Research Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};

COMPONENTS_DATA.sander = [
  {
    id: "sand_none",
    name: "None (Direct Unassisted Rail Contact)",
    type: "sander",
    isOptional: true,
    adhesionBonus: 0.0,
    weight: 0,
    cost: 0,
    leadDays: 0,
    supplier: "Internal Standard",
    inHouseTech: null,
    desc: "No rail adhesion conditioning. Standard dry rail adhesion coefficient applied."
  },
  {
    id: "sand_gravity_basic",
    name: "Pneumatic Directional Sand Discharge System",
    type: "sander",
    isOptional: true,
    adhesionBonus: 0.05,
    weight: 220,
    cost: 21000,
    leadDays: 6,
    supplier: "GripMaster Rail Systems",
    inHouseTech: null,
    desc: "Pneumatic nozzles blasting silica sand onto railheads. Increases adhesion by +0.05."
  },
  {
    id: "sand_plasma_cleaner",
    name: "High-Velocity Laser-Plasma Rail Head Conditioners",
    type: "sander",
    isOptional: true,
    adhesionBonus: 0.11,
    weight: 280,
    cost: 78000,
    leadDays: 16,
    supplier: "GripMaster Rail Systems",
    inHouseTech: "tech_hyper_collection_420",
    desc: "Vaporizes organic leaf grease and ice directly before wheelsets. Increases adhesion by +0.11."
  }
];

SUBCOMPONENTS_DATA.sander = {
  subcomponents: [
    { id: "sand_heater", name: "Thermo-Electric Sand Nozzle Heaters", cost: 6000, weight: 15, reliabilityBonus: 8, desc: "Prevents freezing and clumping of silica sand at temperatures down to -40°C." }
  ],
  modifications: [
    { id: "sand_metering_flow", name: "Speed-Proportional Pulse Air Metering", cost: 12000, weight: 10, adhesionBonus: 0.02, desc: "Dispenses precise sand grain volumes matched to ground speed, preventing track fouling." }
  ]
};