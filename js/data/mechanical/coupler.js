// Couplers & Inter-Car Gangways: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.coupler = [
  {
    id: "coup_scharf_commuter",
    name: "Automatic Scharfenberg Type 10 Coupler",
    type: "coupler",
    tensileLoadLimitTons: 1200,
    weight: 420,
    cost: 38000,
    leadDays: 10,
    supplier: "Voith Coupling Technologies",
    inHouseTech: "tech_coup_scharfenberg",
    desc: "Automatic coupler integrating air pipes and electrical head. Max tensile haul limit: 1200 Tons."
  },
  {
    id: "coup_tightlock_h",
    name: "Type H Tightlock Anti-Climbing Coupler",
    type: "coupler",
    tensileLoadLimitTons: 2200,
    weight: 640,
    cost: 54000,
    leadDays: 14,
    supplier: "Voith Coupling Technologies",
    inHouseTech: "tech_coup_tightlock",
    desc: "Rigid interlocking passenger coupler preventing telescoping during derailments. Limit: 2200 Tons."
  },
  {
    id: "coup_heavy_aar",
    name: "Heavy-Haul Friction Draft Gear AAR Coupler",
    type: "coupler",
    tensileLoadLimitTons: 6500,
    weight: 1180,
    cost: 72000,
    leadDays: 16,
    supplier: "Standard Industrial Foundry",
    inHouseTech: "tech_coup_heavy_aar",
    desc: "Massive forged cast steel knuckle coupler for long heavy mineral freight consists up to 6500 Tons."
  },
  {
    id: "coup_aero_retractable",
    name: "Retractable Aerodynamic High-Speed Nose Coupler",
    type: "coupler",
    tensileLoadLimitTons: 1500,
    weight: 560,
    cost: 125000,
    leadDays: 24,
    supplier: "AeroAlloy Trainworks",
    inHouseTech: "tech_coup_retractable_nose",
    desc: "Concealed behind motorized nose fairing doors for 350+ km/h aerodynamic efficiency."
  }
];

SUBCOMPONENTS_DATA.coupler = {
  subcomponents: [
    { id: "draft_rubber_elastomer", name: "Multi-Pack Elastomer Shock Absorber", cost: 11000, weight: 90, safetyBonus: 6, desc: "Absorbs longitudinal coupling buffing impacts between coaches." }
  ],
  modifications: [
    { id: "gangway_pressurized", name: "Acoustic Pressure-Sealed Articulated Gangway", cost: 28000, weight: 140, speedBonus: 10, desc: "Smooth exterior bellows reducing aerodynamic drag between passenger carriages." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_coup_scharfenberg", name: "Automatic Scharfenberg Type 10 Coupler", branch: "running_gear", costMoney: 180000, durationDays: 30, unlocks: ["coup_scharf_commuter"], desc: "Automatic mechanical, pneumatic, and electrical coupling for multiple units." },
  { id: "tech_coup_tightlock", name: "Type H Anti-Climbing Tightlock Passenger Coupler", branch: "running_gear", costMoney: 290000, durationDays: 45, unlocks: ["coup_tightlock_h"], desc: "Interlocking knuckle heads preventing vertical climb during train collisions." },
  { id: "tech_coup_heavy_aar", name: "Heavy-Haul Friction Draft Gear Knuckle Coupler", branch: "running_gear", costMoney: 420000, durationDays: 55, unlocks: ["coup_heavy_aar"], desc: "High-tensile forged steel coupler handling 6500-ton mineral freight trains." },
  { id: "tech_coup_retractable_nose", name: "Retractable Aerodynamic High-Speed Coupler", branch: "aerodynamics", costMoney: 850000, durationDays: 70, unlocks: ["coup_aero_retractable"], desc: "Nose doors concealing automatic coupler to eliminate aerodynamic drag at 350 km/h." }
);