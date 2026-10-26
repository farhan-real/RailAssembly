// High-Voltage Circuit Breakers, DC Links, and Final Drive Transmissions
const POWERTRAIN_COMPONENTS_DATA = {
  circuitbreaker: [
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
      desc: "Magnetic blow-out DC breaker interrupting fault currents in 18 milliseconds. For DC catenary."
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
      desc: "Primary high-voltage protective switch with vacuum bottle interrupter for 25kV AC electrification."
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
      desc: "Handles both AC vacuum interruption and rapid DC fault suppression for international cross-border runs."
    }
  ],
  dclink: [
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
      desc: "High capacitance smoothing bank. Throughput limited to 4200 kW; sensitive to high ripple currents."
    },
    {
      id: "dclink_polypropylene_film",
      name: "Low-ESR Metallized Polypropylene Film Link",
      type: "dclink",
      maxThroughputKw: 6800,
      capacitanceMfd: 8500,
      weight: 270,
      cost: 54000,
      leadDays: 12,
      supplier: "Epcos Traction Capacitors",
      inHouseTech: null,
      desc: "Self-healing film capacitors with low internal resistance capable of supporting 6800 kW inverter loads."
    },
    {
      id: "dclink_supercap_hybrid",
      name: "Active Resonant Link with Ultracapacitor Snubber",
      type: "dclink",
      maxThroughputKw: 9500,
      capacitanceMfd: 16000,
      weight: 420,
      cost: 115000,
      leadDays: 20,
      supplier: "Epcos Traction Capacitors",
      inHouseTech: "tech_sic_power",
      desc: "Advanced active DC link buffering voltage during neutral section transit and high-speed regenerative spikes."
    }
  ],
  transmission: [
    {
      id: "transm_nose_hung",
      name: "Axle-Hung Nose-Suspended Final Drive",
      type: "transmission",
      maxSpeed: 140,
      mechanicalEfficiency: 0.955,
      unsprungMassKg: 1850,
      weight: 1200,
      cost: 32000,
      leadDays: 10,
      supplier: "Voith Turbo Rail",
      inHouseTech: null,
      desc: "Rugged and simple. High unsprung mass imposes a hard 140 km/h speed limit to prevent severe track impact."
    },
    {
      id: "transm_quill_hollow",
      name: "Hollow-Shaft Flexible Quill Drive System",
      type: "transmission",
      maxSpeed: 230,
      mechanicalEfficiency: 0.972,
      unsprungMassKg: 680,
      weight: 840,
      cost: 68000,
      leadDays: 15,
      supplier: "Voith Turbo Rail",
      inHouseTech: null,
      desc: "Motor is fully suspended on bogie frame with torque transmitted via flexible rubber links. Speed limit: 230 km/h."
    },
    {
      id: "transm_cardan_tripod",
      name: "Fully Suspended Cardan Drive with Tripod Joint",
      type: "transmission",
      maxSpeed: 330,
      mechanicalEfficiency: 0.984,
      unsprungMassKg: 340,
      weight: 620,
      cost: 110000,
      leadDays: 22,
      supplier: "Voith Turbo Rail",
      inHouseTech: "tech_radial_bogies",
      desc: "Minimal unsprung mass isolated from track shocks. Built for 300+ km/h express passenger operations."
    },
    {
      id: "transm_hs_direct_bevel",
      name: "Integrated High-Speed Helical Bevel Gear Unit",
      type: "transmission",
      maxSpeed: 390,
      mechanicalEfficiency: 0.988,
      unsprungMassKg: 220,
      weight: 490,
      cost: 165000,
      leadDays: 28,
      supplier: "Voith Turbo Rail",
      inHouseTech: "tech_composite_chassis",
      desc: "Precision-ground helical gearset with direct oil mist injection for 380+ km/h bullet trainsets."
    }
  ]
};

// Merge into master COMPONENTS_DATA registry
Object.assign(COMPONENTS_DATA, POWERTRAIN_COMPONENTS_DATA);