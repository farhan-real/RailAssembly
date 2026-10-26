// Traction Motors: Stats, Info, Subcomponents, and Research Metadata
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
    inHouseTech: null,
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
    inHouseTech: null,
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
    inHouseTech: "tech_high_torque_motors",
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
    inHouseTech: "tech_pmsm_traction",
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
    inHouseTech: "tech_pmsm_traction",
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
    inHouseTech: "tech_hyper_motors_400",
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
    inHouseTech: "tech_hyper_motors_400",
    desc: "Halbach array rotor delivering 9.8 MW with zero harmonic losses at 6000+ RPM."
  }
];

SUBCOMPONENTS_DATA.motor = {
  subcomponents: [
    { id: "gb_single", name: "Single-Stage Helical Reduction Gearbox", cost: 16000, weight: 380, speedBonus: 0, desc: "Standard ratio reduction built for regional passenger trainsets." },
    { id: "mot_stator_polyimide_220", name: "Class 220 Polyimide Corona-Resistant Stator Insulation", cost: 28000, weight: -40, speedBonus: 15, efficiencyBonus: 0.008, desc: "Handles steep SiC high-frequency voltage rise without partial dielectric breakdown." },
    { id: "mot_rotor_halbach", name: "Sintered NdFeB Halbach-Array Magnetic Rotor", cost: 52000, weight: -80, speedBonus: 35, efficiencyBonus: 0.018, desc: "Pure sinusoidal flux distribution eliminating high-RPM magnetic eddy losses for 320+ km/h." }
  ],
  modifications: [
    { id: "brg_ceramic", name: "Silicon Nitride Hybrid Ceramic Bearings", cost: 19000, weight: 20, reliabilityBonus: 15, desc: "Zero electrical fluting erosion and lower frictional heat buildup." },
    { id: "mot_cool_rotor_oiljet", name: "Hollow-Shaft Pressurized Rotor Oil Jet Cooling", cost: 26000, weight: 25, speedBonus: 20, reliabilityBonus: 10, desc: "Direct oil jet cooling through rotor interior permitting sustained 320+ km/h runs." }
  ]
};

COMPONENT_RESEARCH.push(
  {
    id: "tech_high_torque_motors",
    name: "Copper-Rotor Turbo Induction Motors",
    branch: "motors",
    costMoney: 750000,
    durationDays: 60,
    unlocks: ["mot_ind_highoutput"],
    desc: "Cast copper rotors offering superior thermal endurance and heavy starting tractive torque."
  },
  {
    id: "tech_pmsm_traction",
    name: "Permanent Magnet Synchronous Motors (320 km/h)",
    branch: "motors",
    costMoney: 2200000,
    durationDays: 100,
    unlocks: ["mot_pmsm", "mot_pmsm_express_320"],
    desc: "High-density permanent magnet synchronous traction delivering sustained 320 km/h speeds."
  },
  {
    id: "tech_hyper_motors_400",
    name: "Synchronous Halbach Ultra-Velocity Motors (360-420 km/h)",
    branch: "motors",
    costMoney: 5400000,
    durationDays: 175,
    unlocks: ["mot_hs_synchro_360", "mot_hyper_velocity_400"],
    desc: "Sinusoidal flux Halbach array motors running up to 6000 RPM with negligible iron losses."
  }
);