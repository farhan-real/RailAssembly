// DC Intermediate Links & Capacitor Banks: Stats, Info, Subcomponents, and Research Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};

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
    inHouseTech: null,
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
    inHouseTech: null,
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
    inHouseTech: "tech_sic_power",
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