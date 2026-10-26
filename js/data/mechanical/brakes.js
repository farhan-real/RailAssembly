// Brakes & Energy Recovery Systems: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.brakes = [
  {
    id: "brk_disc_regen",
    name: "Blended Regenerative and Pneumatic Disc Brakes",
    type: "brakes",
    regenEfficiency: 0.22,
    safetyIndex: 85,
    weight: 2200,
    cost: 60000,
    leadDays: 8,
    supplier: "Bremse Systems International",
    inHouseTech: "tech_brk_blended_regen",
    desc: "Recovers electrical kinetic energy to the catenary while maintaining fail-safe mechanical discs."
  },
  {
    id: "brk_eddy_current",
    name: "Linear Track Eddy-Current & Ceramic Brakes (350+ km/h)",
    type: "brakes",
    regenEfficiency: 0.35,
    safetyIndex: 98,
    weight: 1800,
    cost: 190000,
    leadDays: 18,
    supplier: "Bremse Systems International",
    inHouseTech: "tech_brk_eddy_track",
    desc: "Wear-free electromagnetic rail brake providing high deceleration rates above 320 km/h."
  }
];

COMPONENTS_DATA.resistor = [
  { id: "res_none", name: "None (Regenerative Line Feed Only)", type: "resistor", isOptional: true, weight: 0, cost: 0, leadDays: 0, supplier: "Direct Wire Configuration", inHouseTech: null, desc: "Braking energy is returned to catenary. If the grid is non-receptive, mechanical brakes engage." },
  { id: "res_dynamic_roof", name: "Roof-Mounted Dynamic Braking Resistor Grid", type: "resistor", isOptional: true, weight: 650, cost: 42000, leadDays: 9, supplier: "StaticPulse Power Systems", inHouseTech: "tech_res_dynamic_roof", desc: "Safely dissipates 2500 kW of braking energy into thermal heat when descending mountain grades." }
];

SUBCOMPONENTS_DATA.brakes = {
  subcomponents: [
    { id: "cal_cast", name: "Cast Nodular Iron Brake Calipers", cost: 8000, weight: 180, safetyBonus: 0, inHouseTech: null, desc: "Standard pneumatic clamping calipers for disc brakes." },
    { id: "cal_multi_pad", name: "Split Sintered Multi-Pad Calipers", cost: 18000, weight: 140, safetyBonus: 8, adhesionBonus: 0.02, inHouseTech: "tech_cal_monobloc", desc: "Independent floating pad segments maintaining full contact over distorted discs." },
    { id: "cal_monobloc", name: "Forged Aluminum Four-Piston Monobloc Calipers", cost: 26000, weight: 90, safetyBonus: 12, inHouseTech: "tech_cal_monobloc", desc: "High-stiffness lightweight calipers with symmetrical thermal expansion." },
    { id: "cal_titanium_piston", name: "Titanium Piston Insulated Calipers", cost: 42000, weight: 65, safetyBonus: 18, reliabilityBonus: 10, inHouseTech: "tech_cal_monobloc", desc: "Titanium thermal barrier pistons preventing brake fluid boiling under extreme braking." }
  ],
  modifications: [
    { id: "disc_iron", name: "Ventilated Grey Cast Iron Brake Discs", cost: 10000, weight: 360, safetyBonus: 0, inHouseTech: null, desc: "Standard thermal dissipation disc design." },
    { id: "disc_internally_vaned", name: "Directional Curved-Vane Thermal Discs", cost: 18000, weight: 320, safetyBonus: 6, reliabilityBonus: 8, inHouseTech: null, desc: "Internal aerofoil vanes pumping cooling air across friction faces to resist warping." },
    { id: "disc_sinter_copper", name: "Sintered Copper-Ceramic High-Bite Discs", cost: 28000, weight: 280, safetyBonus: 12, adhesionBonus: 0.03, inHouseTech: "tech_disc_carbonceramic", desc: "High-friction metallic matrix maintaining immediate brake bite in rain and snow." },
    { id: "disc_carbonceramic", name: "Carbon-Silicon Carbide Ceramic Brake Discs", cost: 46000, weight: 140, safetyBonus: 20, efficiencyBonus: 0.006, inHouseTech: "tech_disc_carbonceramic", desc: "Fade-free braking capability with extreme heat tolerance up to 1000°C." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_brk_blended_regen", name: "Blended Regenerative Electro-Dynamic Braking", branch: "running_gear", costMoney: 240000, durationDays: 35, unlocks: ["brk_disc_regen"], desc: "Combines pneumatic friction discs with regenerative line-feed energy recovery." },
  { id: "tech_brk_eddy_track", name: "Linear Track Eddy-Current Non-Friction Brakes", branch: "running_gear", costMoney: 1200000, durationDays: 80, unlocks: ["brk_eddy_current"], desc: "Electromagnetic railhead braking operating free of friction wear at 350+ km/h." },
  { id: "tech_res_dynamic_roof", name: "Roof-Mounted Rheostatic Dynamic Resistor Grid", branch: "running_gear", costMoney: 280000, durationDays: 40, unlocks: ["res_dynamic_roof"], desc: "Thermal dissipation grids protecting inverters when catenary is non-receptive." },
  { id: "tech_cal_monobloc", name: "Monobloc Aluminum & Titanium Calipers", branch: "running_gear", costMoney: 580000, durationDays: 45, unlocks: ["cal_monobloc", "cal_multi_pad", "cal_titanium_piston"], desc: "Lightweight forged monobloc calipers with thermal barrier pistons." },
  { id: "tech_disc_carbonceramic", name: "Carbon-Silicon Carbide & Sintered Discs", branch: "running_gear", costMoney: 1100000, durationDays: 70, unlocks: ["disc_carbonceramic", "disc_sinter_copper"], desc: "Continuous carbon-matrix ceramics operating without brake fade at 350+ km/h." }
);