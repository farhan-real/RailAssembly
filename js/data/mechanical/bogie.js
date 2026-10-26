// Bogies & Running Gear: All Models Researchable with Detailed Metadata
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
    inHouseTech: "tech_bog_light_tram",
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
    inHouseTech: "tech_bog_flexicoil_220",
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
    inHouseTech: "tech_bog_coco_freight",
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
    inHouseTech: "tech_bog_radial_320",
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
    inHouseTech: "tech_bog_tilting_360",
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
    inHouseTech: "tech_bog_composite_420",
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
  { id: "tech_bog_light_tram", name: "Two-Axle Lightweight Articulated Bogie", branch: "running_gear", costMoney: 160000, durationDays: 30, unlocks: ["bog_tram_light"], desc: "Low-floor running gear for suburban commuter trainsets." },
  { id: "tech_bog_flexicoil_220", name: "Secondary Air-Spring Flexicoil Bogie (220 km/h)", branch: "running_gear", costMoney: 280000, durationDays: 45, unlocks: ["bog_bo_bo"], desc: "Air-suspension bogie delivering quiet passenger comfort up to 220 km/h." },
  { id: "tech_bog_coco_freight", name: "Six-Axle High-Adhesion Co-Co Freight Bogie", branch: "running_gear", costMoney: 450000, durationDays: 55, unlocks: ["bog_co_co"], desc: "Six heavy axles maximizing rail tractive grip for heavy haul locomotives." },
  { id: "tech_bog_radial_320", name: "Active Radial Self-Steering Bogie (320 km/h)", branch: "running_gear", costMoney: 1900000, durationDays: 90, unlocks: ["bog_radial_320"], desc: "Self-steering axles reducing curve flange wear and permitting 320 km/h." },
  { id: "tech_bog_tilting_360", name: "Active-Cant Hydraulic Tilting Running Gear (360 km/h)", branch: "running_gear", costMoney: 3200000, durationDays: 120, unlocks: ["bog_articulated_360"], desc: "Hydraulic actuators tilting carbody in curves to sustain 360 km/h passenger speeds." },
  { id: "tech_bog_composite_420", name: "Ultra-Light Carbon-Composite Bogie (420 km/h)", branch: "running_gear", costMoney: 4800000, durationDays: 160, unlocks: ["bog_highspeed_400"], desc: "Composite structural frame cutting unsprung mass for speeds exceeding 400 km/h." }
);