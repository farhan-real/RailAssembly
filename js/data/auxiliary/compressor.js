// Air Compressors & Dryers: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.compressor = [
  {
    id: "comp_piston_basic",
    name: "Reciprocating Piston Main Air Compressor",
    type: "compressor",
    airflowLpm: 900,
    pressureBar: 10,
    weight: 310,
    cost: 26000,
    leadDays: 7,
    supplier: "Knorr Air Dynamics",
    inHouseTech: "tech_comp_piston_basic",
    desc: "Baseline pneumatic supply for brake pipe charging and pantograph elevation. Capacity: 900 L/min."
  },
  {
    id: "comp_screw_rotary",
    name: "Oil-Free Rotary Screw Compressor Unit",
    type: "compressor",
    airflowLpm: 1950,
    pressureBar: 12,
    weight: 440,
    cost: 52000,
    leadDays: 12,
    supplier: "Knorr Air Dynamics",
    inHouseTech: "tech_comp_screw_rotary",
    desc: "High-volume quiet rotary screw pump with integrated air-dryer. Capacity: 1950 L/min."
  },
  {
    id: "comp_dual_redundant",
    name: "Dual-Channel High-Volume Pneumatics Module",
    type: "compressor",
    airflowLpm: 3400,
    pressureBar: 12,
    weight: 690,
    cost: 92000,
    leadDays: 18,
    supplier: "Knorr Air Dynamics",
    inHouseTech: "tech_comp_dual_redundant",
    desc: "Dual independent screw compressors designed for rapid charging of long 10+ carriage trainsets."
  }
];

SUBCOMPONENTS_DATA.compressor = {
  subcomponents: [
    { id: "dryer_desiccant", name: "Dual-Chamber Regenerative Desiccant Air Dryer", cost: 8000, weight: 45, reliabilityBonus: 8, desc: "Removes moisture and condensation to prevent freezing of brake valves in winter." },
    { id: "dryer_membrane", name: "Hollow-Fiber Continuous Membrane Dryer", cost: 16000, weight: 25, reliabilityBonus: 14, desc: "Zero-maintenance continuous moisture separation with no desiccant bead wear." }
  ],
  modifications: [
    { id: "comp_softstart", name: "Electronic Soft-Start Inverter Drive", cost: 9500, weight: 15, reliabilityBonus: 6, desc: "Eliminates high starting current spikes when air compressor motors cycle on." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_comp_piston_basic", name: "Reciprocating Piston Air Compressor", branch: "automation", costMoney: 140000, durationDays: 25, unlocks: ["comp_piston_basic"], desc: "Reliable mechanical piston pump supplying pneumatic brake and pantograph pressure." },
  { id: "tech_comp_screw_rotary", name: "Oil-Free Rotary Screw Air Compressor", branch: "automation", costMoney: 280000, durationDays: 45, unlocks: ["comp_screw_rotary"], desc: "Continuous rotary compression delivering 1950 L/min with low cabin acoustic noise." },
  { id: "tech_comp_dual_redundant", name: "Dual-Channel High-Volume Pneumatics Module", branch: "automation", costMoney: 620000, durationDays: 65, unlocks: ["comp_dual_redundant"], desc: "Dual independent screw compressors for rapid brake charging on long passenger consists." }
);