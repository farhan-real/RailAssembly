// Rail Adhesion & Sanding Equipment: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

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
    desc: "No rail adhesion conditioning. Standard baseline dry steel adhesion coefficient applied."
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
    inHouseTech: "tech_sand_pneumatic",
    desc: "Pneumatic nozzles blasting silica sand onto railheads. Increases adhesion coefficient by +0.05."
  },
  {
    id: "sand_high_pressure",
    name: "Multi-Port High-Velocity Quartz Grit Blaster",
    type: "sander",
    isOptional: true,
    adhesionBonus: 0.09,
    weight: 340,
    cost: 38000,
    leadDays: 8,
    supplier: "GripMaster Rail Systems",
    inHouseTech: "tech_sand_pneumatic",
    desc: "Pulsed high-pressure air injectors blasting calibrated quartz grains directly into wheel nip points (+0.09 adhesion)."
  },
  {
    id: "sand_magnetic_track",
    name: "Electromagnetic Track Adhesion Booster Array",
    type: "sander",
    isOptional: true,
    adhesionBonus: 0.16,
    weight: 850,
    cost: 115000,
    leadDays: 14,
    supplier: "GripMaster Rail Systems",
    inHouseTech: "tech_sand_plasma",
    desc: "Active electromagnetic rail shoes generating magnetic downforce to drastically amplify tractive grip by +0.16."
  },
  {
    id: "sand_plasma_cleaner",
    name: "High-Velocity Laser-Plasma & Ceramic Friction Jet",
    type: "sander",
    isOptional: true,
    adhesionBonus: 0.22,
    weight: 450,
    cost: 165000,
    leadDays: 16,
    supplier: "GripMaster Rail Systems",
    inHouseTech: "tech_sand_plasma",
    desc: "Vaporizes organic rail grease and moisture while depositing microscopic ceramic friction particles (+0.22 adhesion)."
  }
];

SUBCOMPONENTS_DATA.sander = {
  subcomponents: [
    { id: "sand_heater", name: "Thermo-Electric Sand Nozzle Heaters", cost: 6000, weight: 15, reliabilityBonus: 8, desc: "Prevents freezing and clumping of silica sand at temperatures down to -40°C." },
    { id: "sand_alumina", name: "Calcined Alumina Friction Particle Additive", cost: 16000, weight: 35, adhesionBonus: 0.03, desc: "Blends micro-fine aluminum oxide into the sand stream for an extra +0.03 adhesion." }
  ],
  modifications: [
    { id: "sand_metering_flow", name: "Speed-Proportional Pulse Air Metering", cost: 12000, weight: 10, adhesionBonus: 0.02, desc: "Dispenses precise sand grain volumes matched to ground speed, preventing track fouling." },
    { id: "sand_anti_slip_ai", name: "Closed-Loop Acoustic Micro-Slip Detection", cost: 24000, weight: 8, adhesionBonus: 0.04, desc: "Ultrasonic vibration sensors triggering pulse discharge within 5 milliseconds of micro-slip." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_sand_pneumatic", name: "Electro-Pneumatic Directional Sanding System", branch: "power_collection", costMoney: 160000, durationDays: 30, unlocks: ["sand_gravity_basic", "sand_high_pressure"], desc: "High-velocity air nozzles dispensing silica sand to prevent wheel slip on grades." },
  { id: "tech_sand_plasma", name: "Laser-Plasma & Electromagnetic Track Adhesion Array", branch: "power_collection", costMoney: 950000, durationDays: 75, unlocks: ["sand_magnetic_track", "sand_plasma_cleaner"], desc: "Combines magnetic track downforce and plasma descaling, boosting tractive adhesion by up to +0.22." }
);