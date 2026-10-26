// Carbodies & Aerodynamics: Stats, Info, Subcomponents, and Research Metadata
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
    inHouseTech: null,
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
    inHouseTech: "tech_aluminum_extrusion",
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
    inHouseTech: "tech_composite_chassis",
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
    inHouseTech: "tech_streamlined_nose_320",
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
    inHouseTech: "tech_ultra_aero_400",
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
  {
    id: "tech_aluminum_extrusion",
    name: "Aluminum Extrusions",
    branch: "aerodynamics",
    costMoney: 350000,
    durationDays: 45,
    unlocks: ["body_aluminum"],
    desc: "Develop tooling and extrusion dies for hollow profile aluminum carbodies reducing passenger trainset tare mass."
  },
  {
    id: "tech_composite_chassis",
    name: "Carbon-Fiber Monocoque Construction",
    branch: "aerodynamics",
    costMoney: 1200000,
    durationDays: 75,
    unlocks: ["body_aero_cf"],
    desc: "Establish autoclave vacuum-infusion tooling for carbon composite shells minimizing aerodynamic drag."
  },
  {
    id: "tech_streamlined_nose_320",
    name: "320 km/h Bullet Nose Aerodynamics",
    branch: "aerodynamics",
    costMoney: 2600000,
    durationDays: 110,
    unlocks: ["body_bullet_360"],
    desc: "Wind-tunnel optimization of micro-pressure nose geometry preventing tunnel sonic boom shocks above 320 km/h."
  },
  {
    id: "tech_ultra_aero_400",
    name: "400+ km/h Boundary Layer Wave Reducer",
    branch: "aerodynamics",
    costMoney: 4800000,
    durationDays: 160,
    unlocks: ["body_hyper_400"],
    desc: "Ultra-low drag coefficient profile (Cd 0.14) engineered for 400+ km/h high-speed express corridors."
  }
);