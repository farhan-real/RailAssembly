// Single-Source Research Tree branching exclusively from Core Traction Directorate
const TECH_DATA = [
  // Central Core Root
  {
    id: "tech_core",
    name: "Foundational Electric Traction Core",
    branch: "core",
    costMoney: 0,
    durationDays: 0,
    prereq: [],
    unlocks: ["body_steel", "panto_std", "trans_heavy", "inv_igbt_air", "mot_ind_basic", "bog_bo_bo"],
    desc: "Foundational multi-system electric traction baseline. The primary root from which all specialized engineering branches originate."
  },

  // Track 1: High-Speed Aerodynamics & Lightweight Structures
  {
    id: "tech_aluminum_extrusion",
    name: "Aluminum Extrusions",
    branch: "aerodynamics",
    costMoney: 350000,
    durationDays: 45,
    prereq: ["tech_core"],
    unlocks: ["body_aluminum"],
    desc: "Develop tooling and extrusion dies for hollow profile aluminum carbodies reducing passenger trainset tare mass."
  },
  {
    id: "tech_composite_chassis",
    name: "Carbon-Fiber Monocoque Construction",
    branch: "aerodynamics",
    costMoney: 1200000,
    durationDays: 75,
    prereq: ["tech_aluminum_extrusion"],
    unlocks: ["body_aero_cf"],
    desc: "Establish autoclave vacuum-infusion tooling for carbon composite shells minimizing aerodynamic drag."
  },
  {
    id: "tech_streamlined_nose_320",
    name: "320 km/h Bullet Nose Aerodynamics",
    branch: "aerodynamics",
    costMoney: 2600000,
    durationDays: 110,
    prereq: ["tech_composite_chassis"],
    unlocks: ["body_bullet_360", "coup_aero_retractable"],
    desc: "Wind-tunnel optimization of micro-pressure nose geometry preventing tunnel sonic boom shocks above 320 km/h."
  },
  {
    id: "tech_ultra_aero_400",
    name: "400+ km/h Boundary Layer Wave Reducer",
    branch: "aerodynamics",
    costMoney: 4800000,
    durationDays: 160,
    prereq: ["tech_streamlined_nose_320"],
    unlocks: ["body_hyper_400"],
    desc: "Ultra-low drag coefficient profile (Cd 0.14) engineered for 400+ km/h high-speed express corridors."
  },

  // Track 2: Power Electronics & Inverter Modulation
  {
    id: "tech_advanced_inverters",
    name: "Liquid-Cooled VVVF Converters",
    branch: "electronics",
    costMoney: 450000,
    durationDays: 50,
    prereq: ["tech_core"],
    unlocks: ["inv_igbt_liquid", "pwm_space_vector_svm"],
    desc: "Variable-frequency liquid-cooled inverter engineering delivering smooth motor acceleration."
  },
  {
    id: "tech_compact_transformer",
    name: "Underfloor Compact Transformer",
    branch: "electronics",
    costMoney: 850000,
    durationDays: 70,
    prereq: ["tech_advanced_inverters"],
    unlocks: ["trans_compact", "inv_liquid_highpower_320"],
    desc: "Slim underfloor multi-winding transformer design freeing interior passenger cabin space."
  },
  {
    id: "tech_sic_power",
    name: "Silicon Carbide (SiC) Power Semiconductors",
    branch: "electronics",
    costMoney: 2400000,
    durationDays: 120,
    prereq: ["tech_compact_transformer"],
    unlocks: ["inv_sic", "pwm_ultrasonic_sic_vector", "dclink_supercap_hybrid"],
    desc: "SiC MOSFET semiconductors slashing switching heat loss and enabling ultrasonic 18 kHz PWM."
  },
  {
    id: "tech_solid_state_trans",
    name: "Solid-State High-Frequency Matrix Transformer",
    branch: "electronics",
    costMoney: 4900000,
    durationDays: 180,
    prereq: ["tech_sic_power"],
    unlocks: ["trans_solidstate", "inv_sic_dual_380"],
    desc: "Completely replaces heavy iron cores with microsecond semiconductor high-frequency conversion."
  },

  // Track 3: High-Torque & High-RPM Traction Propulsion Motors
  {
    id: "tech_high_torque_motors",
    name: "Copper-Rotor Turbo Induction Motors",
    branch: "motors",
    costMoney: 750000,
    durationDays: 60,
    prereq: ["tech_core"],
    unlocks: ["mot_ind_highoutput", "pwm_selective_harmonic_she"],
    desc: "Cast copper rotors offering superior thermal endurance and heavy starting tractive torque."
  },
  {
    id: "tech_pmsm_traction",
    name: "Permanent Magnet Synchronous Motors (320 km/h)",
    branch: "motors",
    costMoney: 2200000,
    durationDays: 100,
    prereq: ["tech_high_torque_motors"],
    unlocks: ["mot_pmsm", "mot_pmsm_express_320", "pwm_direct_torque_dtc"],
    desc: "High-density permanent magnet synchronous traction delivering sustained 320 km/h speeds."
  },
  {
    id: "tech_hyper_motors_400",
    name: "Synchronous Halbach Ultra-Velocity Motors (360-420 km/h)",
    branch: "motors",
    costMoney: 5400000,
    durationDays: 175,
    prereq: ["tech_pmsm_traction"],
    unlocks: ["mot_hs_synchro_360", "mot_hyper_velocity_400", "pwm_neural_adaptive_flux"],
    desc: "Sinusoidal flux Halbach array motors running up to 6000 RPM with negligible iron losses."
  },

  // Track 4: Running Gear, High-Speed Bogies & Transmissions
  {
    id: "tech_quill_drive",
    name: "Hollow-Shaft Flexible Quill Drive",
    branch: "running_gear",
    costMoney: 600000,
    durationDays: 55,
    prereq: ["tech_core"],
    unlocks: ["transm_quill_hollow", "bog_express_air"],
    desc: "Fully suspends motor on bogie frame, reducing unsprung mass for speeds up to 230 km/h."
  },
  {
    id: "tech_radial_bogies",
    name: "Radial Steering Bogies & Cardan Drives (320 km/h)",
    branch: "running_gear",
    costMoney: 1900000,
    durationDays: 90,
    prereq: ["tech_quill_drive"],
    unlocks: ["bog_radial_320", "transm_cardan_tripod", "transm_cardan_tripod_320"],
    desc: "Self-steering axles reducing flange wear combined with tripod cardan drives for 320 km/h."
  },
  {
    id: "tech_active_tilting",
    name: "Active Cant Tilting & 380+ km/h Running Gear",
    branch: "running_gear",
    costMoney: 4400000,
    durationDays: 150,
    prereq: ["tech_radial_bogies"],
    unlocks: ["bog_articulated_360", "bog_highspeed_400", "transm_hs_direct_380", "transm_hyper_drive_420"],
    desc: "Computerized electro-hydraulic cant compensation and carbon-frame bogies certified above 380 km/h."
  },

  // Track 5: Current Collection, Multi-Voltage & Adhesion
  {
    id: "tech_multisystem",
    name: "Dual-Voltage Catenary Collection",
    branch: "power_collection",
    costMoney: 950000,
    durationDays: 65,
    prereq: ["tech_core"],
    unlocks: ["panto_dual", "vcb_hybrid_multisystem"],
    desc: "Seamless transition between 25kV AC and 3kV DC catenary networks."
  },
  {
    id: "tech_aero_pantograph",
    name: "320-380 km/h High-Speed Pantographs",
    branch: "power_collection",
    costMoney: 2400000,
    durationDays: 105,
    prereq: ["tech_multisystem"],
    unlocks: ["panto_hs", "panto_hs_320", "panto_bullet_380", "sand_gravity_basic"],
    desc: "Aerodynamically stabilized collectors preventing wire arcing and contact loss at 380 km/h."
  },
  {
    id: "tech_hyper_collection_420",
    name: "Active Piezoelectric 420 km/h Collectors",
    branch: "power_collection",
    costMoney: 5200000,
    durationDays: 165,
    prereq: ["tech_aero_pantograph"],
    unlocks: ["panto_hyper_420", "sand_plasma_cleaner"],
    desc: "Closed-loop piezoelectric wire tension followers and plasma rail-head cleaning."
  },

  // Track 6: Energy Storage & Autonomous Automation
  {
    id: "tech_battery_traction",
    name: "Auxiliary Last-Mile Traction Packs",
    branch: "automation",
    costMoney: 850000,
    durationDays: 60,
    prereq: ["tech_core"],
    unlocks: ["bat_lfp_lastmile"],
    desc: "LFP battery modules powering non-electrified terminal and shunting maneuvers."
  },
  {
    id: "tech_etcs_automation",
    name: "ETCS Level 2 Cab Signaling & WSP",
    branch: "automation",
    costMoney: 1400000,
    durationDays: 85,
    prereq: ["tech_battery_traction"],
    unlocks: ["tcms_etcs2", "wsp_microprocessor"],
    desc: "Radio-block continuous cab signaling and electronic anti-skid protection."
  },
  {
    id: "tech_driverless_ato",
    name: "Autonomous GoA4 ATO Systems",
    branch: "automation",
    costMoney: 4600000,
    durationDays: 150,
    prereq: ["tech_etcs_automation"],
    unlocks: ["tcms_cbtc_ai", "wsp_integrated_surge", "bat_nmc_intercity"],
    desc: "Unattended driverless automation with neural tractive adhesion and predictive braking."
  }
];