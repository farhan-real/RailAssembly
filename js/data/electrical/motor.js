// Traction Motors: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.motor = [
  {
    id: "mot_ind_commuter",
    name: "Lightweight Regional Induction Motor",
    type: "motor",
    powerKw: 2800,
    maxRpmSpeed: 170,
    weight: 2400,
    cost: 80000,
    leadDays: 10,
    supplier: "Nordic Traction Motors",
    inHouseTech: "tech_mot_commuter_induction",
    desc: "Compact asynchronous motor suited for frequent station starts. Max speed limit: 170 km/h."
  },
  {
    id: "mot_ind_basic",
    name: "Three-Phase Asynchronous Induction Motor",
    type: "motor",
    powerKw: 3600,
    maxRpmSpeed: 190,
    weight: 3400,
    cost: 95000,
    leadDays: 12,
    supplier: "Nordic Traction Motors",
    inHouseTech: "tech_mot_basic_induction",
    desc: "Sturdy induction motor requiring at least 3600 kW inverter output. Max speed limit: 190 km/h."
  },
  {
    id: "mot_ind_highoutput",
    name: "High-Output Copper Rotor Induction Motor",
    type: "motor",
    powerKw: 5600,
    maxRpmSpeed: 230,
    weight: 4200,
    cost: 210000,
    leadDays: 18,
    supplier: "Nordic Traction Motors",
    inHouseTech: "tech_mot_copper_rotor",
    desc: "Heavy-duty copper rotor delivering high tractive force. Max speed limit: 230 km/h."
  },
  {
    id: "mot_pmsm",
    name: "Permanent Magnet Synchronous Motor (280 km/h)",
    type: "motor",
    powerKw: 6800,
    maxRpmSpeed: 280,
    weight: 2900,
    cost: 380000,
    leadDays: 22,
    supplier: "MagnaDrive Electric",
    inHouseTech: "tech_mot_pmsm_280",
    desc: "High power-density permanent magnet traction motor. Speed ceiling: 280 km/h."
  },
  {
    id: "mot_pmsm_express_320",
    name: "High-RPM Synchronous Motor (320 km/h)",
    type: "motor",
    powerKw: 7600,
    maxRpmSpeed: 320,
    weight: 2650,
    cost: 470000,
    leadDays: 25,
    supplier: "MagnaDrive Electric",
    inHouseTech: "tech_mot_pmsm_320",
    desc: "Buried NdFeB magnets engineered specifically for sustained 320 km/h passenger corridors."
  },
  {
    id: "mot_hs_synchro_360",
    name: "Ultra-Light Distributed Traction Motor (360 km/h)",
    type: "motor",
    powerKw: 8600,
    maxRpmSpeed: 360,
    weight: 2400,
    cost: 620000,
    leadDays: 28,
    supplier: "MagnaDrive Electric",
    inHouseTech: "tech_mot_synchro_360",
    desc: "Direct liquid-cooled stator with low rotor inertia certified for 360 km/h operation."
  },
  {
    id: "mot_hyper_velocity_400",
    name: "Halbach-Array Hyper-Velocity Motor (420 km/h)",
    type: "motor",
    powerKw: 9800,
    maxRpmSpeed: 420,
    weight: 2150,
    cost: 850000,
    leadDays: 32,
    supplier: "MagnaDrive Electric",
    inHouseTech: "tech_mot_halbach_420",
    desc: "Halbach array rotor delivering 9.8 MW with zero harmonic losses at 6000+ RPM."
  }
];

SUBCOMPONENTS_DATA.motor = {
  subcomponents: [
    { id: "gb_single", name: "Single-Stage Helical Reduction Gearbox", cost: 16000, weight: 380, speedBonus: 0, inHouseTech: null, desc: "Standard ratio reduction built for regional passenger trainsets." },
    { id: "mot_stator_form_wound", name: "Form-Wound Rectangular Copper Stator", cost: 24000, weight: 420, speedBonus: 0, efficiencyBonus: 0.007, adhesionBonus: 0.03, inHouseTech: "tech_mot_stator_polyimide", desc: "Dense slot fill maximizing low-end starting torque and tractive grip." },
    { id: "mot_stator_polyimide_220", name: "Class 220 Polyimide Corona Insulation", cost: 28000, weight: -40, speedBonus: 15, efficiencyBonus: 0.008, inHouseTech: "tech_mot_stator_polyimide", desc: "Handles steep SiC high-frequency voltage rise without dielectric breakdown." },
    { id: "mot_rotor_carbon_sleeve", name: "Carbon-Fiber Sleeve High-RPM Rotor", cost: 45000, weight: -90, speedBonus: 28, efficiencyBonus: 0.012, inHouseTech: "tech_mot_rotor_halbach", desc: "Carbon overwrap binding magnets to prevent rotor burst above 7000 RPM." },
    { id: "mot_rotor_halbach", name: "Sintered NdFeB Halbach-Array Magnetic Rotor", cost: 52000, weight: -80, speedBonus: 35, efficiencyBonus: 0.018, inHouseTech: "tech_mot_rotor_halbach", desc: "Pure sinusoidal flux distribution eliminating high-RPM magnetic eddy losses for 320+ km/h." }
  ],
  modifications: [
    { id: "brg_steel_sealed", name: "Sealed Double-Row Steel Bearings", cost: 6000, weight: 40, reliabilityBonus: 0, inHouseTech: null, desc: "Standard industrial steel ball bearings. Durable and economical." },
    { id: "brg_ceramic", name: "Silicon Nitride Hybrid Ceramic Bearings", cost: 19000, weight: 20, speedBonus: 10, reliabilityBonus: 15, inHouseTech: "tech_brg_ceramic", desc: "Zero electrical fluting erosion and lower frictional heat buildup at high speeds." },
    { id: "mot_shaft_insulation", name: "Alumina Ceramic Shaft Isolation Collar", cost: 12000, weight: 10, reliabilityBonus: 12, inHouseTech: "tech_brg_ceramic", desc: "Prevents stray high-frequency return currents from eroding bearings and bogies." },
    { id: "mot_cool_rotor_oiljet", name: "Hollow-Shaft Pressurized Rotor Oil Jet Cooling", cost: 26000, weight: 25, speedBonus: 20, reliabilityBonus: 10, inHouseTech: "tech_mot_cool_rotor_oiljet", desc: "Direct oil jet cooling through rotor interior permitting sustained 320+ km/h runs." },
    { id: "brg_mag_lev", name: "Active Magnetic Unloading Bearings", cost: 58000, weight: 15, speedBonus: 30, reliabilityBonus: 20, efficiencyBonus: 0.010, inHouseTech: "tech_brg_ceramic", desc: "Electromagnetic magnetic relief removing contact wear at ultra high speeds." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_mot_commuter_induction", name: "Lightweight Commuter Asynchronous Motor", branch: "motors", costMoney: 180000, durationDays: 30, unlocks: ["mot_ind_commuter"], desc: "Fast acceleration 2800 kW induction drive for high-frequency suburban routes." },
  { id: "tech_mot_basic_induction", name: "Standard 3-Phase Induction Traction Motor", branch: "motors", costMoney: 260000, durationDays: 40, unlocks: ["mot_ind_basic"], desc: "High-durability 3600 kW induction motor with proven squirrel-cage geometry." },
  { id: "tech_mot_copper_rotor", name: "Heavy-Duty Copper-Endring Turbo Motor", branch: "motors", costMoney: 750000, durationDays: 60, unlocks: ["mot_ind_highoutput"], desc: "Cast copper end-rings providing exceptional thermal endurance for heavy freight." },
  { id: "tech_mot_pmsm_280", name: "280 km/h Permanent Magnet Synchronous Motor", branch: "motors", costMoney: 1400000, durationDays: 80, unlocks: ["mot_pmsm"], desc: "Neodymium permanent magnet rotor delivering 6800 kW output with 97% efficiency." },
  { id: "tech_mot_pmsm_320", name: "320 km/h High-RPM Buried Magnet Motor", branch: "motors", costMoney: 2200000, durationDays: 100, unlocks: ["mot_pmsm_express_320"], desc: "Buried NdFeB magnets engineered specifically for sustained 320 km/h running." },
  { id: "tech_mot_synchro_360", name: "360 km/h Distributed Liquid-Cooled Motor", branch: "motors", costMoney: 3800000, durationDays: 140, unlocks: ["mot_hs_synchro_360"], desc: "Direct liquid cooling permitting sustained 8600 kW sprints without thermal derating." },
  { id: "tech_mot_halbach_420", name: "420 km/h Halbach Array Hyper-Velocity Drive", branch: "motors", costMoney: 5400000, durationDays: 175, unlocks: ["mot_hyper_velocity_400"], desc: "Halbach array sinusoidal flux rotor operating at 6000+ RPM without iron losses." },
  { id: "tech_mot_stator_polyimide", name: "Class 220 Polyimide Corona Insulation & Formed Coils", branch: "motors", costMoney: 620000, durationDays: 50, unlocks: ["mot_stator_polyimide_220", "mot_stator_form_wound"], desc: "High slot-fill stators and resin-rich corona shielding for steep voltage spikes." },
  { id: "tech_brg_ceramic", name: "Silicon Nitride Ceramic & Magnetic Bearings", branch: "motors", costMoney: 850000, durationDays: 65, unlocks: ["brg_ceramic", "mot_shaft_insulation", "brg_mag_lev"], desc: "Insulating ceramic rolling elements completely preventing electrical discharge damage." },
  { id: "tech_mot_cool_rotor_oiljet", name: "Pressurized Hollow-Shaft Rotor Cooling", branch: "motors", costMoney: 1400000, durationDays: 85, unlocks: ["mot_cool_rotor_oiljet"], desc: "Continuous internal oil circulation preventing permanent magnet demagnetization." },
  { id: "tech_mot_rotor_halbach", name: "Halbach-Array & Carbon-Sleeve High-RPM Rotors", branch: "motors", costMoney: 2600000, durationDays: 115, unlocks: ["mot_rotor_halbach", "mot_rotor_carbon_sleeve"], desc: "Carbon overwrap binding and Halbach arrays concentrating flux for 7000+ RPM." }
);