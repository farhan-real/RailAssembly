// Passenger Climate Control & HVAC Systems: Stats, Info, Subcomponents, and Research Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};

COMPONENTS_DATA.hvac = [
  {
    id: "hvac_none",
    name: "None (Locomotive Cab Only / Industrial Ducting)",
    type: "hvac",
    isOptional: true,
    hotelPowerKw: 0,
    weight: 0,
    cost: 0,
    leadDays: 0,
    supplier: "Internal Standard",
    inHouseTech: null,
    desc: "No passenger climate control. Appropriate for freight locomotives and utility equipment."
  },
  {
    id: "hvac_standard_pack",
    name: "Roof-Mounted Modular Heat-Pump Climate Pack",
    type: "hvac",
    isOptional: true,
    hotelPowerKw: 45,
    weight: 560,
    cost: 46000,
    leadDays: 10,
    supplier: "AeroClima Transit",
    inHouseTech: null,
    desc: "Provides modulated heating and cooling for passenger coaches. Hotel load: 45 kW per unit."
  },
  {
    id: "hvac_pressurized_hs",
    name: "Pressure-Sealed High-Speed HVAC Module",
    type: "hvac",
    isOptional: true,
    hotelPowerKw: 65,
    weight: 840,
    cost: 96000,
    leadDays: 18,
    supplier: "AeroClima Transit",
    inHouseTech: "tech_aluminum_extrusion",
    desc: "Fast-acting pressure-wave protection valves preventing ear discomfort in high-speed tunnels."
  }
];

SUBCOMPONENTS_DATA.hvac = {
  subcomponents: [
    { id: "hvac_co2_sensor", name: "Demand-Controlled CO2 Air Freshness Sensors", cost: 7000, weight: 8, efficiencyBonus: 0.004, desc: "Modulates outside fresh air intake based on real-time coach passenger occupancy." }
  ],
  modifications: [
    { id: "hvac_micro_hepa", name: "Electrostatic Micro-Particle Air Filtration Array", cost: 15000, weight: 22, reliabilityBonus: 6, desc: "Filters pollen, brake dust, and allergens from passenger cabin air supply." }
  ]
};