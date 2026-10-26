// High-Voltage Vacuum Circuit Breakers: Stats, Info, Subcomponents, and Research Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.circuitbreaker = [
  {
    id: "vcb_dc_highspeed",
    name: "Ultra-Fast DC High-Speed Circuit Breaker",
    type: "circuitbreaker",
    breakingCurrentKa: 45,
    openTimeMs: 18,
    supportedVoltage: "1.5kV DC / 3kV DC",
    weight: 180,
    cost: 28000,
    leadDays: 8,
    supplier: "Secheron Switchgear SA",
    inHouseTech: null,
    desc: "Magnetic blow-out DC breaker interrupting fault currents in 18 ms. For DC catenary."
  },
  {
    id: "vcb_vacuum_ac",
    name: "Roof-Mounted AC Vacuum Circuit Breaker",
    type: "circuitbreaker",
    breakingCurrentKa: 25,
    openTimeMs: 38,
    supportedVoltage: "25kV AC",
    weight: 240,
    cost: 44000,
    leadDays: 10,
    supplier: "Secheron Switchgear SA",
    inHouseTech: null,
    desc: "Primary protective switch with vacuum bottle interrupter for 25kV AC electrification."
  },
  {
    id: "vcb_hybrid_multisystem",
    name: "Multi-System Solid-State Assisted Hybrid Breaker",
    type: "circuitbreaker",
    breakingCurrentKa: 35,
    openTimeMs: 12,
    supportedVoltage: "Multi-System (25kV AC / 3kV DC)",
    weight: 290,
    cost: 88000,
    leadDays: 16,
    supplier: "Secheron Switchgear SA",
    inHouseTech: "tech_multisystem",
    desc: "Handles both AC vacuum interruption and rapid DC fault suppression for cross-border runs."
  }
];

SUBCOMPONENTS_DATA.circuitbreaker = {
  subcomponents: [
    { id: "vcb_bottle_cucr", name: "Copper-Chromium Axial Magnetic Contact Bottle", cost: 8500, weight: 18, reliabilityBonus: 8, desc: "Diffuses electrical arcs evenly across contact surfaces, extending vacuum interrupter lifespan." }
  ],
  modifications: [
    { id: "vcb_sensor_trip", name: "Electronic Rogowski Coil Overcurrent Trip Sensor", cost: 11000, weight: 8, safetyBonus: 10, desc: "Instantaneous microsecond short-circuit detection triggering the primary trip coil." }
  ]
};