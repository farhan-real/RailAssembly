// Carbodies & Aerodynamics: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.carbody = [
  {
    id: "body_steel",
    name: "Welded Structural Steel Monocoque Carbody",
    type: "carbody",
    dragCd: 0.52,
    passengerCap: 0,
    cargoCapacityTons: 90,
    weight: 24000,
    cost: 160000,
    leadDays: 14,
    supplier: "Standard Industrial Foundry",
    inHouseTech: "tech_body_structural_steel",
    desc: "Heavy carbon-steel chassis for locomotives and heavy haulage routes."
  },
  {
    id: "body_aluminum",
    name: "Hollow Extruded Aluminum Carbody Shell",
    type: "carbody",
    dragCd: 0.34,
    passengerCap: 280,
    cargoCapacityTons: 15,
    weight: 14000,
    cost: 290000,
    leadDays: 20,
    supplier: "AeroAlloy Trainworks",
    inHouseTech: "tech_body_aluminum_extruded",
    desc: "Lightweight extruded aluminum profile built for passenger multiple units."
  },
  {
    id: "body_aero_cf",
    name: "Carbon-Fiber Composite Aerodynamic Body (300 km/h)",
    type: "carbody",
    dragCd: 0.22,
    passengerCap: 340,
    cargoCapacityTons: 10,
    weight: 10500,
    cost: 650000,
    leadDays: 30,
    supplier: "AeroAlloy Trainworks",
    inHouseTech: "tech_body_carbon_monocoque",
    desc: "Streamlined low-drag aerodynamic profile designed for express trains up to 300 km/h."
  },
  {
    id: "body_bullet_360",
    name: "Dual-Taper Shinkansen Aerodynamic Nose (360 km/h)",
    type: "carbody",
    dragCd: 0.18,
    passengerCap: 320,
    cargoCapacityTons: 8,
    weight: 9800,
    cost: 780000,
    leadDays: 34,
    supplier: "AeroAlloy Trainworks",
    inHouseTech: "tech_body_shinkansen_360",
    desc: "Extended long-nose aerodynamic fairing eliminating tunnel sonic booms at 360 km/h."
  },
  {
    id: "body_hyper_400",
    name: "Boundary-Layer Supersonic Wave Shell (420 km/h)",
    type: "carbody",
    dragCd: 0.14,
    passengerCap: 290,
    cargoCapacityTons: 5,
    weight: 8900,
    cost: 960000,
    leadDays: 38,
    supplier: "AeroAlloy Trainworks",
    inHouseTech: "tech_body_supersonic_420",
    desc: "Ultra-low drag coefficient shell (Cd 0.14) engineered for 400+ km/h express service."
  }
];

SUBCOMPONENTS_DATA.carbody = {
  subcomponents: [
    { id: "crash_standard", name: "Anti-Climbing Hydraulic End Buffers", cost: 15000, weight: 320, safetyBonus: 5, desc: "Basic frontal impact absorbing mechanical buffers." },
    { id: "crash_crushzone", name: "Progressive Deformation Crash Energy Shell", cost: 42000, weight: 480, safetyBonus: 20, desc: "Sacrificial aluminum honeycomb cells meeting EN 15227 crashworthiness." }
  ],
  modifications: [
    { id: "aero_none", name: "Standard Flat Bulkhead Fairing", cost: 0, weight: 0, speedBonus: 0, desc: "Baseline frontal structure with standard profile." },
    { id: "aero_nose", name: "Longitudinal Micro-Pressure Streamlined Nose Fairing", cost: 55000, weight: 220, speedBonus: 25, desc: "Aerodynamic nose fairing reducing aerodynamic resistance and tunnel sonic boom." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_body_structural_steel", name: "High-Tensile Carbon Steel Monocoque Shell", branch: "aerodynamics", costMoney: 180000, durationDays: 30, unlocks: ["body_steel"], desc: "Welded high-yield steel box structure for freight locomotives and utility sets." },
  { id: "tech_body_aluminum_extruded", name: "6000-Series Welded Aluminum Modular Shell", branch: "aerodynamics", costMoney: 350000, durationDays: 45, unlocks: ["body_aluminum"], desc: "Hollow extruded aluminum coach bodies cutting vehicle mass by 40%." },
  { id: "tech_body_carbon_monocoque", name: "Carbon-Fiber Reinforced Monocoque (300 km/h)", branch: "aerodynamics", costMoney: 1200000, durationDays: 75, unlocks: ["body_aero_cf"], desc: "Autoclave carbon composite shell minimizing drag to Cd 0.22." },
  { id: "tech_body_shinkansen_360", name: "Long-Nose Aerodynamic Shockwave Mitigator (360 km/h)", branch: "aerodynamics", costMoney: 2600000, durationDays: 110, unlocks: ["body_bullet_360"], desc: "Dual-taper nose fairing preventing tunnel micro-pressure waves at 360 km/h." },
  { id: "tech_body_supersonic_420", name: "Boundary-Layer Supersonic Wave Shell (420 km/h)", branch: "aerodynamics", costMoney: 4800000, durationDays: 160, unlocks: ["body_hyper_400"], desc: "Ultra-low drag aerodynamic profile (Cd 0.14) certified for commercial 420 km/h." }
);