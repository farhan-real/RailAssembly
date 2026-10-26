// DC Intermediate Links & Capacitor Banks: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.dclink = [
  {
    id: "dclink_electrolytic",
    name: "Aluminum Electrolytic DC Bus Capacitor Bank",
    type: "dclink",
    maxThroughputKw: 4200,
    capacitanceMfd: 12000,
    weight: 380,
    cost: 26000,
    leadDays: 7,
    supplier: "Epcos Traction Capacitors",
    inHouseTech: "tech_dclink_electrolytic",
    desc: "High capacitance smoothing bank. Throughput limited to 4200 kW."
  },
  {
    id: "dclink_polypropylene_film",
    name: "Low-ESR Metallized Polypropylene Film Link",
    type: "dclink",
    maxThroughputKw: 7200,
    capacitanceMfd: 8500,
    weight: 270,
    cost: 54000,
    leadDays: 12,
    supplier: "Epcos Traction Capacitors",
    inHouseTech: "tech_dclink_film",
    desc: "Self-healing film capacitors with low resistance supporting 7200 kW inverter throughput."
  },
  {
    id: "dclink_supercap_hybrid",
    name: "Active Resonant Link with Ultracapacitor Snubber (320+ km/h)",
    type: "dclink",
    maxThroughputKw: 10000,
    capacitanceMfd: 16000,
    weight: 420,
    cost: 115000,
    leadDays: 20,
    supplier: "Epcos Traction Capacitors",
    inHouseTech: "tech_dclink_supercap",
    desc: "Buffers voltage during neutral section transit and high-speed regenerative spikes."
  }
];

SUBCOMPONENTS_DATA.dclink = {
  subcomponents: [
    { id: "dclink_precharge_contactor", name: "Solid-State Soft-Start Inrush Pre-Charge Resistor", cost: 7500, weight: 22, reliabilityBonus: 8, desc: "Limits peak charging inrush current to protect capacitors when the main circuit breaker closes." }
  ],
  modifications: [
    { id: "dclink_crowbar_dump", name: "High-Speed Dynamic Discharge Crowbar Module", cost: 14000, weight: 16, safetyBonus: 12, desc: "Discharges 1800V DC intermediate link down to safe touch voltage in under 2 seconds." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_dclink_electrolytic", name: "High-Capacitance Aluminum Electrolytic Bus Bank", branch: "electronics", costMoney: 180000, durationDays: 30, unlocks: ["dclink_electrolytic"], desc: "Economical high-capacitance DC link smoothing voltage for baseline inverters." },
  { id: "tech_dclink_film", name: "Low-ESR Metallized Polypropylene Film Link", branch: "electronics", costMoney: 380000, durationDays: 50, unlocks: ["dclink_polypropylene_film"], desc: "Self-healing film dielectric handling steep high-frequency ripple currents." },
  { id: "tech_dclink_supercap", name: "Hybrid Ultracapacitor Resonant Intermediate Link", branch: "electronics", costMoney: 1200000, durationDays: 90, unlocks: ["dclink_supercap_hybrid"], desc: "Energy buffering eliminating traction loss during catenary neutral section crossings." }
);