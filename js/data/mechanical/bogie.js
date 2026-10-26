// Bogies & Running Gear: Stats, Info, Subcomponents, and Research Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.bogie = [
  {
    id: "bog_tram_light",
    name: "Two-Axle Lightweight Articulated Bogie",
    type: "bogie",
    axles: 2,
    maxAxleLoadTons: 14.0,
    maxSafeSpeed: 120,
    cost: 85000,
    weight: 5200,
    leadDays: 10,
    supplier: "CastIron Engineering Works",
    inHouseTech: null,
    desc: "Low axle-load bogie designed for regional light-rail sets. Speed limit: 120 km/h."
  },
  {
    id: "bog_bo_bo",
    name: "Four-Axle Express Flexicoil Bogie Assembly",
    type: "bogie",
    axles: 4,
    maxAxleLoadTons: 20.0,
    maxSafeSpeed: 220,
    cost: 175000,
    weight: 11000,
    leadDays: 16,
    supplier: "CastIron Engineering Works",
    inHouseTech: null,
    desc: "Secondary air-suspension bogie for smooth passenger rides. Speed limit: 220 km/h."
  },
  {
    id: "bog_co_co",
    name: "Six-Axle Heavy Haul Bogie Assembly",
    type: "bogie",
    axles: 6,
    maxAxleLoadTons: 25.0,
    maxSafeSpeed: 140,
    cost: 140000,
    weight: 18000,
    leadDays: 15,
    supplier: "CastIron Engineering Works",
    inHouseTech: null,
    desc: "Six heavy axles delivering immense tractive adhesion for freight. Speed limit: 140 km/h."
  },
  {
    id: "bog_radial_320",
    name: "Active Radial High-Speed Bogie (320 km/h)",
    type: "bogie",
    axles: 4,
    maxAxleLoadTons: 18.0,
    maxSafeSpeed: 320,
    cost: 340000,
    weight: 9200,
    leadDays: 22,
    supplier: "Stadler Dynamics AG",
    inHouseTech: "tech_radial_bogies",
    desc: "Self-steering radial axles reducing wheel-rail friction at 320 km/h."
  },
  {
    id: "bog_articulated_360",
    name: "Hydraulic Active-Cant Tilting Bogie (360 km/h)",
    type: "bogie",
    axles: 4,
    maxAxleLoadTons: 17.0,
    maxSafeSpeed: 360,
    cost: 440000,
    weight: 8600,
    leadDays: 26,
    supplier: "Stadler Dynamics AG",
    inHouseTech: "tech_active_tilting",
    desc: "Active body tilting compensation allowing high curving speeds up to 360 km/h."
  },
  {
    id: "bog_highspeed_400",
    name: "Carbon-Composite Articulated Bogie (420 km/h)",
    type: "bogie",
    axles: 4,
    maxAxleLoadTons: 15.5,
    maxSafeSpeed: 420,
    cost: 580000,
    weight: 7400,
    leadDays: 32,
    supplier: "Stadler Dynamics AG",
    inHouseTech: "tech_active_tilting",
    desc: "Ultra-low unsprung mass composite frame certified for speeds exceeding 400 km/h."
  }
];

SUBCOMPONENTS_DATA.bogie = {
  subcomponents: [
    { id: "susp_coil", name: "Steel Coil Spring Primary Suspension", cost: 12000, weight: 240, speedBonus: 0, reliabilityBonus: 4, desc: "Standard robust mechanical spring assembly with rubber snubbers." },
    { id: "susp_air", name: "Self-Leveling Secondary Air-Spring Suspension", cost: 28000, weight: 180, speedBonus: 20, reliabilityBonus: 8, desc: "Pneumatic bellows isolating carbody vibrations across variable axle loads." },
    { id: "susp_active", name: "Active Electro-Hydraulic Tilting Dampers", cost: 54000, weight: 310, speedBonus: 45, reliabilityBonus: 12, desc: "Computerized cant compensation enabling elevated curving speeds." }
  ],
  modifications: [
    { id: "whl_standard", name: "Monobloc Forged Carbon Steel Wheelsets", cost: 14000, weight: 600, reliabilityBonus: 0, desc: "Standard wheel discs for routine passenger and freight duties." },
    { id: "whl_cryo", name: "Cryogenic Micro-Alloy Treated Wheelsets", cost: 32000, weight: 580, reliabilityBonus: 16, desc: "Treated martensitic steel reducing spalling and thermal cracking." }
  ]
};

COMPONENT_RESEARCH.push(
  {
    id: "tech_radial_bogies",
    name: "Radial Steering Bogies & Cardan Drives (320 km/h)",
    branch: "running_gear",
    costMoney: 1900000,
    durationDays: 90,
    unlocks: ["bog_radial_320"],
    desc: "Self-steering axles reducing flange wear combined with tripod cardan drives for 320 km/h."
  },
  {
    id: "tech_active_tilting",
    name: "Active Cant Tilting & 380+ km/h Running Gear",
    branch: "running_gear",
    costMoney: 4400000,
    durationDays: 150,
    unlocks: ["bog_articulated_360", "bog_highspeed_400"],
    desc: "Computerized electro-hydraulic cant compensation and carbon-frame bogies certified above 380 km/h."
  }
);