// Single-Source Research Tree with Highly Descriptive Industrial Engineering Specifications
const TREE_STRUCTURE = {
  core: {
    id: "tech_core",
    name: "Baseline 25kV Industrial Electric Traction Infrastructure",
    branch: "core",
    x: 800,
    y: 550,
    costMoney: 0,
    durationDays: 0,
    prereq: [],
    unlocks: [
      "body_steel", "panto_std", "panto_urban_dc", "trans_heavy", "trans_none_dc",
      "inv_igbt_air", "mot_ind_basic", "mot_ind_commuter", "bog_bo_bo", "bog_tram_light",
      "transm_nose_hung", "vcb_vacuum_ac", "vcb_dc_highspeed", "dclink_electrolytic",
      "pwm_sine_triangle_analog", "comp_piston_basic", "cool_forced_air", "coup_scharf_commuter",
      "brk_disc_regen", "tcms_basic", "wsp_basic"
    ],
    desc: "Baseline 25kV 50Hz AC and 1.5kV/3kV DC electrified railway infrastructure. Forms the operational core from which all specialized propulsion and structural lines branch."
  },
  branches: [
    { key: "aerodynamics", label: "Aerodynamics & Lightweight Structural Engineering" },
    { key: "electronics", label: "Power Semiconductor Electronics & Inverter Modulation" },
    { key: "motors", label: "High-Torque & High-RPM Traction Propulsion Motors" },
    { key: "running_gear", label: "Running Gear, Radial Bogies & High-Speed Transmissions" },
    { key: "power_collection", label: "High-Speed Catenary Current Collection & Adhesion" },
    { key: "automation", label: "Energy Storage, Signal Protection & Autonomous ATO" }
  ],
  nodes: [
    // Track 1: Aerodynamics (Branching Up & Up-Right)
    {
      id: "tech_aluminum_extrusion",
      name: "Aerospace-Grade 6000-Series Hollow Extruded Aluminum Bodyshell",
      branch: "aerodynamics",
      x: 800,
      y: 420,
      costMoney: 350000,
      durationDays: 45,
      prereq: ["tech_core"],
      unlocks: ["body_aluminum"],
      desc: "Tooling for hollow extruded aluminum bodyshell sections, lowering vehicle tare mass by 40% while preserving structural rigidity."
    },
    {
      id: "tech_composite_chassis",
      name: "Carbon-Fiber Reinforced Polymer (CFRP) Monocoque Shell",
      branch: "aerodynamics",
      x: 800,
      y: 290,
      costMoney: 1200000,
      durationDays: 75,
      prereq: ["tech_aluminum_extrusion"],
      unlocks: ["body_aero_cf"],
      desc: "Autoclave-cured carbon-composite monocoque construction cutting aerodynamic drag coefficient to Cd 0.22 for 300 km/h operation."
    },
    {
      id: "tech_streamlined_nose_320",
      name: "320 km/h Shinkansen-Derived Long-Nose Tunnel Shockwave Mitigator",
      branch: "aerodynamics",
      x: 700,
      y: 160,
      costMoney: 2600000,
      durationDays: 110,
      prereq: ["tech_composite_chassis"],
      unlocks: ["body_bullet_360", "coup_aero_retractable"],
      desc: "Dual-taper long aerodynamic nose geometry eliminating micro-pressure sonic boom waves when entering tunnels at 320 to 360 km/h."
    },
    {
      id: "tech_ultra_aero_400",
      name: "420 km/h Boundary-Layer Micro-Slotted Supersonic Wave Fairing",
      branch: "aerodynamics",
      x: 700,
      y: 50,
      costMoney: 4800000,
      durationDays: 160,
      prereq: ["tech_streamlined_nose_320"],
      unlocks: ["body_hyper_400"],
      desc: "Boundary-layer suction fairing achieving an ultra-low Cd 0.14 drag coefficient certified for sustained 420 km/h commercial sprints."
    },

    // Track 2: Power Electronics (Branching Up & Up-Left)
    {
      id: "tech_advanced_inverters",
      name: "Closed-Loop Liquid-Cooled IGBT Variable Frequency Inverter",
      branch: "electronics",
      x: 600,
      y: 420,
      costMoney: 450000,
      durationDays: 50,
      prereq: ["tech_core"],
      unlocks: ["inv_igbt_liquid", "pwm_space_vector_svm"],
      desc: "Liquid-cooled insulated-gate bipolar transistor converter delivering up to 6200 kW smooth variable-frequency traction drive."
    },
    {
      id: "tech_compact_transformer",
      name: "Low-Profile Multi-Winding High-Speed Underfloor Transformer",
      branch: "electronics",
      x: 600,
      y: 290,
      costMoney: 850000,
      durationDays: 70,
      prereq: ["tech_advanced_inverters"],
      unlocks: ["trans_compact", "inv_liquid_highpower_320"],
      desc: "Low-profile multi-secondary underfloor transformer rated for 7500 kW continuous throughput on multi-unit passenger consists."
    },
    {
      id: "tech_sic_power",
      name: "High-Frequency Silicon Carbide (SiC) MOSFET Power Converter",
      branch: "electronics",
      x: 500,
      y: 160,
      costMoney: 2400000,
      durationDays: 120,
      prereq: ["tech_compact_transformer"],
      unlocks: ["inv_sic", "pwm_ultrasonic_sic_vector", "dclink_supercap_hybrid"],
      desc: "Wide-bandgap Silicon Carbide power semiconductors slashing switching thermal loss by 70% and permitting 18 kHz PWM operation."
    },
    {
      id: "tech_solid_state_trans",
      name: "Solid-State High-Frequency Electronic Matrix Power Transformer",
      branch: "electronics",
      x: 500,
      y: 50,
      costMoney: 4900000,
      durationDays: 180,
      prereq: ["tech_sic_power"],
      unlocks: ["trans_solidstate", "inv_sic_dual_380"],
      desc: "Direct semiconductor-based high-frequency matrix power converter replacing heavy oil-filled iron cores with 9.8 MW solid-state throughput."
    },

    // Track 3: Traction Propulsion Motors (Branching Far Right)
    {
      id: "tech_high_torque_motors",
      name: "Reinforced Copper-Endring Squirrel-Cage Asynchronous Motor",
      branch: "motors",
      x: 1000,
      y: 550,
      costMoney: 750000,
      durationDays: 60,
      prereq: ["tech_core"],
      unlocks: ["mot_ind_highoutput", "pwm_selective_harmonic_she"],
      desc: "Die-cast pure copper end-rings providing exceptional thermal endurance and sustained tractive effort for heavy freight haulage."
    },
    {
      id: "tech_pmsm_traction",
      name: "High-RPM Permanent Magnet Synchronous Traction Motor (320 km/h)",
      branch: "motors",
      x: 1180,
      y: 550,
      costMoney: 2200000,
      durationDays: 100,
      prereq: ["tech_high_torque_motors"],
      unlocks: ["mot_pmsm", "mot_pmsm_express_320", "pwm_direct_torque_dtc"],
      desc: "Buried Neodymium-Iron-Boron permanent magnets delivering 7600 kW output with 97% motor efficiency at 320 km/h rotational speeds."
    },
    {
      id: "tech_hyper_motors_400",
      name: "Sinusoidal Halbach Array Ultra-Velocity Traction Motor (420 km/h)",
      branch: "motors",
      x: 1360,
      y: 550,
      costMoney: 5400000,
      durationDays: 175,
      prereq: ["tech_pmsm_traction"],
      unlocks: ["mot_hs_synchro_360", "mot_hyper_velocity_400", "pwm_neural_adaptive_flux"],
      desc: "Pure sinusoidal flux Halbach array magnetic rotor engineered for 6000+ RPM without iron losses, outputting 9800 kW."
    },

    // Track 4: Running Gear & Transmissions (Branching Down & Right)
    {
      id: "tech_quill_drive",
      name: "Fully Suspended Hollow-Shaft Flexible Quill Transmission",
      branch: "running_gear",
      x: 1000,
      y: 690,
      costMoney: 600000,
      durationDays: 55,
      prereq: ["tech_core"],
      unlocks: ["transm_quill_hollow", "bog_bo_bo"],
      desc: "Frame-mounted traction motor isolating track impact forces via flexible rubber quill couplings for speeds up to 230 km/h."
    },
    {
      id: "tech_radial_bogies",
      name: "Active Radial Self-Steering Bogie with Tripod Cardan Drive",
      branch: "running_gear",
      x: 1180,
      y: 690,
      costMoney: 1900000,
      durationDays: 90,
      prereq: ["tech_quill_drive"],
      unlocks: ["bog_radial_320", "transm_cardan_tripod_320", "brk_eddy_current"],
      desc: "Self-steering wheelsets eliminating flange wear paired with tripod cardan drives balanced for 320 km/h passenger operation."
    },
    {
      id: "tech_active_tilting",
      name: "Electro-Hydraulic Active Body Tilting & Carbon Articulated Bogie",
      branch: "running_gear",
      x: 1360,
      y: 690,
      costMoney: 4400000,
      durationDays: 150,
      prereq: ["tech_radial_bogies"],
      unlocks: ["bog_articulated_360", "bog_highspeed_400", "transm_hs_direct_380", "transm_hyper_drive_420"],
      desc: "Active body cant tilting compensation and ultra-low unsprung mass carbon frames certified for 380 to 420 km/h curves."
    },

    // Track 5: Current Collection & Adhesion (Branching Down)
    {
      id: "tech_multisystem",
      name: "Multi-System 25kV AC / 3kV DC Automatic Voltage Selector",
      branch: "power_collection",
      x: 800,
      y: 690,
      costMoney: 950000,
      durationDays: 65,
      prereq: ["tech_core"],
      unlocks: ["panto_dual", "vcb_hybrid_multisystem", "panto_stemmann_dsa250_dual"],
      desc: "High-speed automated phase-break detection and catenary voltage transition between 25kV AC and 3kV DC networks."
    },
    {
      id: "tech_aero_pantograph",
      name: "Active Aerodynamic Low-Noise Single-Arm Carbon Pantograph",
      branch: "power_collection",
      x: 800,
      y: 820,
      costMoney: 2400000,
      durationDays: 105,
      prereq: ["tech_multisystem"],
      unlocks: ["panto_hs_320", "panto_bullet_380", "panto_shinkansen_wing", "sand_gravity_basic"],
      desc: "Aerodynamic wing-strut single-arm collectors with automatic uplift vanes maintaining constant 70N contact up to 380 km/h."
    },
    {
      id: "tech_hyper_collection_420",
      name: "Piezoelectric Closed-Loop Dynamic Tension Following Collector",
      branch: "power_collection",
      x: 800,
      y: 950,
      costMoney: 5200000,
      durationDays: 165,
      prereq: ["tech_aero_pantograph"],
      unlocks: ["panto_hyper_420", "sand_plasma_cleaner"],
      desc: "Microsecond piezoelectric pan-head tracking eliminating contact wire arcing at speeds exceeding 400 km/h."
    },

    // Track 6: Energy Storage & Automation (Branching Left & Down-Left)
    {
      id: "tech_battery_traction",
      name: "Lithium Iron Phosphate (LFP) Auxiliary Traction Storage Pack",
      branch: "automation",
      x: 600,
      y: 690,
      costMoney: 850000,
      durationDays: 60,
      prereq: ["tech_core"],
      unlocks: ["bat_lfp_lastmile"],
      desc: "High-safety LFP battery modules providing self-propelled shunting operations across non-electrified sidings."
    },
    {
      id: "tech_etcs_automation",
      name: "ETCS Level 2 Baseline 3 Radio-Block Cab Signaling & WSP",
      branch: "automation",
      x: 440,
      y: 690,
      costMoney: 1400000,
      durationDays: 85,
      prereq: ["tech_battery_traction"],
      unlocks: ["tcms_etcs2", "wsp_microprocessor"],
      desc: "Continuous GSM-R/FRMCS radio-block signaling supervision with multi-channel microprocessor wheel slide protection."
    },
    {
      id: "tech_driverless_ato",
      name: "Grade-of-Automation 4 (GoA4) Fully Driverless Autonomous Control",
      branch: "automation",
      x: 280,
      y: 690,
      costMoney: 4600000,
      durationDays: 150,
      prereq: ["tech_etcs_automation"],
      unlocks: ["tcms_cbtc_ai", "wsp_integrated_surge", "bat_nmc_intercity"],
      desc: "Fully autonomous neural-network train operation with predictive tractive adhesion control and regenerative coasting."
    }
  ]
};

// Compile master TECH_DATA list
const TECH_DATA = [
  TREE_STRUCTURE.core,
  ...TREE_STRUCTURE.nodes
];