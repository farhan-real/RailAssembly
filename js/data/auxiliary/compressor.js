// Air Compressors & Dryers: Stats, Info, Subcomponents, and Research Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};

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
    inHouseTech: null,
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
    inHouseTech: null,
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
    inHouseTech: "tech_advanced_inverters",
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