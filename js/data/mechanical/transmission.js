// Traction Transmissions & Final Drives: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.transmission = [
  {
    id: "transm_nose_hung",
    name: "Axle-Hung Nose-Suspended Final Drive (140 km/h)",
    type: "transmission",
    maxSpeed: 140,
    mechanicalEfficiency: 0.955,
    unsprungMassKg: 1850,
    weight: 1200,
    cost: 32000,
    leadDays: 10,
    supplier: "Voith Turbo Rail",
    inHouseTech: "tech_transm_nose_hung",
    desc: "High unsprung mass imposes a hard 140 km/h speed limit to prevent severe track impact."
  },
  {
    id: "transm_quill_hollow",
    name: "Hollow-Shaft Flexible Quill Drive System (230 km/h)",
    type: "transmission",
    maxSpeed: 230,
    mechanicalEfficiency: 0.972,
    unsprungMassKg: 680,
    weight: 840,
    cost: 68000,
    leadDays: 15,
    supplier: "Voith Turbo Rail",
    inHouseTech: "tech_transm_quill_230",
    desc: "Motor is fully suspended on bogie frame with torque transmitted via rubber links. Speed limit: 230 km/h."
  },
  {
    id: "transm_cardan_tripod_320",
    name: "High-Speed Tripod Cardan Transmission (320 km/h)",
    type: "transmission",
    maxSpeed: 320,
    mechanicalEfficiency: 0.986,
    unsprungMassKg: 310,
    weight: 590,
    cost: 135000,
    leadDays: 22,
    supplier: "Voith Turbo Rail",
    inHouseTech: "tech_transm_cardan_320",
    desc: "Precision balanced cardan drive built for 320 km/h high-speed passenger trainsets."
  },
  {
    id: "transm_hs_direct_380",
    name: "Integrated Helical Bevel Gear Unit (380 km/h)",
    type: "transmission",
    maxSpeed: 380,
    mechanicalEfficiency: 0.989,
    unsprungMassKg: 220,
    weight: 480,
    cost: 185000,
    leadDays: 26,
    supplier: "Voith Turbo Rail",
    inHouseTech: "tech_transm_bevel_380",
    desc: "Precision-ground helical gearset with direct oil mist injection for 380 km/h running."
  },
  {
    id: "transm_hyper_drive_420",
    name: "Direct-Drive Lightweight Torque Tube (420 km/h)",
    type: "transmission",
    maxSpeed: 420,
    mechanicalEfficiency: 0.992,
    unsprungMassKg: 160,
    weight: 390,
    cost: 260000,
    leadDays: 32,
    supplier: "Voith Turbo Rail",
    inHouseTech: "tech_transm_direct_420",
    desc: "Gearless hollow rotor shaft eliminating transmission gearbox losses for 400+ km/h sprints."
  }
];

SUBCOMPONENTS_DATA.transmission = {
  subcomponents: [
    { id: "transm_teeth_carburized", name: "Deep Case-Carburized Ground Gear Teeth Profile", cost: 12500, weight: 35, reliabilityBonus: 12, inHouseTech: null, desc: "High surface hardness preventing pitting under continuous heavy freight torque." },
    { id: "transm_teeth_nitrided", name: "Plasma-Nitrided Low-Friction Helical Mesh", cost: 22000, weight: 30, efficiencyBonus: 0.007, reliabilityBonus: 16, inHouseTech: "tech_transm_oil_mist", desc: "Super-finished micro-tooth profiles cutting frictional mesh resistance." },
    { id: "transm_carbon_shaft", name: "Carbon-Fiber Torsion Drive Shaft", cost: 38000, weight: -140, speedBonus: 15, efficiencyBonus: 0.004, inHouseTech: "tech_transm_oil_mist", desc: "Lightweight composite hollow shaft slashing rotational inertia." }
  ],
  modifications: [
    { id: "transm_oil_mist_pressurized", name: "Pressurized Oil Spray Jet Continuous Lubrication", cost: 16000, weight: 18, efficiencyBonus: 0.006, inHouseTech: "tech_transm_oil_mist", desc: "Maintains optimal lubricating oil wedge at gear meshes at rotational speeds above 4200 RPM." },
    { id: "transm_magnetic_filter", name: "High-Flux Neodymium Sump Particle Trap", cost: 9500, weight: 8, reliabilityBonus: 12, inHouseTech: null, desc: "Continuous magnetic extraction of metallic wear particles from gearbox sump." },
    { id: "transm_ceramic_lube", name: "Hexagonal Boron Nitride Nano-Ceramic Lube", cost: 18000, weight: 6, efficiencyBonus: 0.009, reliabilityBonus: 14, inHouseTech: "tech_transm_oil_mist", desc: "Solid boundary lubricant film protecting gears during steep acceleration spikes." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_transm_nose_hung", name: "Axle-Hung Nose-Suspended Drive Assembly", branch: "running_gear", costMoney: 180000, durationDays: 30, unlocks: ["transm_nose_hung"], desc: "Robust and economical gear reduction for freight locomotives up to 140 km/h." },
  { id: "tech_transm_quill_230", name: "Hollow-Shaft Flexible Quill Transmission", branch: "running_gear", costMoney: 600000, durationDays: 55, unlocks: ["transm_quill_hollow"], desc: "Fully suspends motor on bogie frame, cutting unsprung mass for speeds up to 230 km/h." },
  { id: "tech_transm_cardan_320", name: "High-Speed Tripod Cardan Transmission (320 km/h)", branch: "running_gear", costMoney: 1600000, durationDays: 85, unlocks: ["transm_cardan_tripod_320"], desc: "Precision balanced cardan drive isolated from track impact forces for 320 km/h." },
  { id: "tech_transm_bevel_380", name: "Precision Helical Bevel Gear Unit (380 km/h)", branch: "running_gear", costMoney: 2900000, durationDays: 120, unlocks: ["transm_hs_direct_380"], desc: "Integrated gearset with pressurized oil spray lubrication rated for 380 km/h." },
  { id: "tech_transm_direct_420", name: "Gearless Hollow-Shaft Direct Drive (420 km/h)", branch: "running_gear", costMoney: 4400000, durationDays: 150, unlocks: ["transm_hyper_drive_420"], desc: "Direct torque transmission eliminating gear mesh friction for 400+ km/h." },
  { id: "tech_transm_oil_mist", name: "Oil-Mist Lubrication & Carbon Torsion Shafts", branch: "running_gear", costMoney: 750000, durationDays: 60, unlocks: ["transm_oil_mist_pressurized", "transm_teeth_nitrided", "transm_carbon_shaft", "transm_ceramic_lube"], desc: "High-pressure oil mist spray and composite torsion drive tubes for high RPM gearboxes." }
);