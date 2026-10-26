// Traction Transmissions & Final Drives: Stats, Info, Subcomponents, and Research Metadata
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
    inHouseTech: null,
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
    inHouseTech: "tech_quill_drive",
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
    inHouseTech: "tech_radial_bogies",
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
    inHouseTech: "tech_active_tilting",
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
    inHouseTech: "tech_active_tilting",
    desc: "Gearless hollow rotor shaft eliminating transmission gearbox losses for 400+ km/h sprints."
  }
];

SUBCOMPONENTS_DATA.transmission = {
  subcomponents: [
    { id: "transm_teeth_carburized", name: "Deep Case-Carburized Ground Gear Teeth Profile", cost: 12500, weight: 35, reliabilityBonus: 12, desc: "High surface hardness preventing pitting under continuous heavy freight torque." }
  ],
  modifications: [
    { id: "transm_oil_mist_pressurized", name: "Pressurized Oil Spray Jet Continuous Lubrication", cost: 16000, weight: 18, efficiencyBonus: 0.006, desc: "Maintains optimal lubricating oil wedge at gear meshes at rotational speeds above 4200 RPM." }
  ]
};

COMPONENT_RESEARCH.push(
  {
    id: "tech_quill_drive",
    name: "Hollow-Shaft Flexible Quill Drive",
    branch: "running_gear",
    costMoney: 600000,
    durationDays: 55,
    unlocks: ["transm_quill_hollow"],
    desc: "Fully suspends motor on bogie frame, reducing unsprung mass for speeds up to 230 km/h."
  }
);