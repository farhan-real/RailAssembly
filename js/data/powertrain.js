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
  ],
  transmission: [
    {
      id: "transm_nose_hung",
      name: "Axle-Hung Nose-Suspended Final Drive (140 km/h)",
      type: "transmission",
      maxSpeed: 140,
      mechanicalEfficiency: 0.955,
      unsprungMassKg: 1850,
      weight: 1200,
      cost: 32000,
      leadDays: 10,
      supplier: "Voith Turbo Rail",
      inHouseTech: null,
      desc: "High unsprung mass imposes a hard 140 km/h speed limit to prevent severe track impact."
    },
    {
      id: "transm_quill_hollow",
      name: "Hollow-Shaft Flexible Quill Drive System (230 km/h)",
      type: "transmission",
      maxSpeed: 230,
      mechanicalEfficiency: 0.972,
      unsprungMassKg: 680,
      weight: 840,
      cost: 68000,
      leadDays: 15,
      supplier: "Voith Turbo Rail",
      inHouseTech: "tech_quill_drive",
      desc: "Motor is fully suspended on bogie frame with torque transmitted via rubber links. Speed limit: 230 km/h."
    },
    {
      id: "transm_cardan_tripod",
      name: "Fully Suspended Cardan Drive with Tripod Joint (280 km/h)",
      type: "transmission",
      maxSpeed: 280,
      mechanicalEfficiency: 0.982,
      unsprungMassKg: 420,
      weight: 710,
      cost: 95000,
      leadDays: 18,
      supplier: "Voith Turbo Rail",
      inHouseTech: "tech_radial_bogies",
      desc: "Low unsprung mass isolated from track shocks for intercity express runs up to 280 km/h."
    },
    {
      id: "transm_cardan_tripod_320",
      name: "High-Speed Tripod Cardan Transmission (320 km/h)",
      type: "transmission",
      maxSpeed: 320,
      mechanicalEfficiency: 0.986,
      unsprungMassKg: 310,
      weight: 590,
      cost: 135000,
      leadDays: 22,
      supplier: "Voith Turbo Rail",
      inHouseTech: "tech_radial_bogies",
      desc: "Precision balanced cardan drive built for 320 km/h high-speed passenger trainsets."
    },
    {
      id: "transm_hs_direct_380",
      name: "Integrated Helical Bevel Gear Unit (380 km/h)",
      type: "transmission",
      maxSpeed: 380,
      mechanicalEfficiency: 0.989,
      unsprungMassKg: 220,
      weight: 480,
      cost: 185000,
      leadDays: 26,
      supplier: "Voith Turbo Rail",
      inHouseTech: "tech_active_tilting",
      desc: "Precision-ground helical gearset with direct oil mist injection for 380 km/h running."
    },
    {
      id: "transm_hyper_drive_420",
      name: "Direct-Drive Lightweight Torque Tube (420 km/h)",
      type: "transmission",
      maxSpeed: 420,
      mechanicalEfficiency: 0.992,
      unsprungMassKg: 160,
      weight: 390,
      cost: 260000,
      leadDays: 32,
      supplier: "Voith Turbo Rail",
      inHouseTech: "tech_active_tilting",
      desc: "Gearless hollow rotor shaft eliminating transmission gearbox losses for 400+ km/h sprints."
    }
  ]
};

// Merge into master COMPONENTS_DATA registry
Object.assign(COMPONENTS_DATA, POWERTRAIN_COMPONENTS_DATA);