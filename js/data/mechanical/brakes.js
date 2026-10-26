// Brakes & Energy Recovery Systems: Stats, Info, Subcomponents, and Research Metadata
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
    inHouseTech: null,
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
    inHouseTech: "tech_radial_bogies",
    desc: "Wear-free electromagnetic rail brake providing high deceleration rates above 320 km/h."
  }
];

COMPONENTS_DATA.resistor = [
  { id: "res_none", name: "None (Regenerative Line Feed Only)", type: "resistor", isOptional: true, weight: 0, cost: 0, leadDays: 0, supplier: "Direct Wire Configuration", inHouseTech: null, desc: "Braking energy is returned to catenary. If the grid is non-receptive, mechanical brakes engage." },
  { id: "res_dynamic_roof", name: "Roof-Mounted Dynamic Braking Resistor Grid", type: "resistor", isOptional: true, weight: 650, cost: 42000, leadDays: 9, supplier: "StaticPulse Power Systems", inHouseTech: null, desc: "Safely dissipates 2500 kW of braking energy into thermal heat when descending mountain grades." }
];

SUBCOMPONENTS_DATA.brakes = {
  subcomponents: [
    { id: "cal_cast", name: "Cast Nodular Iron Brake Calipers", cost: 8000, weight: 180, safetyBonus: 0, desc: "Standard pneumatic clamping calipers for disc brakes." },
    { id: "cal_monobloc", name: "Forged Aluminum Four-Piston Monobloc Calipers", cost: 26000, weight: 90, safetyBonus: 10, desc: "High-stiffness lightweight calipers with symmetrical thermal expansion." }
  ],
  modifications: [
    { id: "disc_iron", name: "Ventilated Grey Cast Iron Brake Discs", cost: 10000, weight: 360, safetyBonus: 0, desc: "Standard thermal dissipation disc design." },
    { id: "disc_carbonceramic", name: "Carbon-Silicon Carbide Ceramic Brake Discs", cost: 46000, weight: 140, safetyBonus: 18, desc: "Fade-free braking capability with extreme heat tolerance up to 1000°C." }
  ]
};