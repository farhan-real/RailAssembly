// Research Tree Graph Structure & Single-Source Hierarchy
// Compiles node metadata directly from the individual component files
const TREE_STRUCTURE = {
  core: {
    id: "tech_core",
    name: "Foundational Electric Traction Core",
    branch: "core",
    costMoney: 0,
    durationDays: 0,
    prereq: [],
    unlocks: [
      "panto_toyo_dc_urban", "panto_secheron_spl", "panto_faiveley_am12", "panto_brecknell_highreach",
      "panto_stemmann_dsa150", "panto_schunk_wbl85", "panto_stemmann_dsa200",
      "body_steel", "trans_heavy", "trans_none_dc", "inv_igbt_air", "mot_ind_basic",
      "mot_ind_commuter", "bog_bo_bo", "bog_tram_light", "transm_nose_hung",
      "vcb_vacuum_ac", "vcb_dc_highspeed", "dclink_electrolytic", "pwm_sine_triangle_analog",
      "comp_piston_basic", "cool_forced_air", "coup_scharf_commuter", "brk_disc_regen",
      "tcms_basic", "wsp_basic"
    ],
    desc: "Foundational multi-system electric traction baseline. The primary root from which all specialized engineering branches originate."
  },
  branches: [
    { key: "aerodynamics", label: "Track 1: Aerodynamics & Lightweight Carbodies" },
    { key: "electronics", label: "Track 2: Power Electronics & Inverter Modulation" },
    { key: "motors", label: "Track 3: High-Torque & High-RPM Motors" },
    { key: "running_gear", label: "Track 4: Running Gear, Bogies & Transmissions" },
    { key: "power_collection", label: "Track 5: High-Speed Catenary & Current Collection" },
    { key: "automation", label: "Track 6: Storage, Automation & Safety" }
  ],
  prerequisites: {
    // Aerodynamics branch
    tech_aluminum_extrusion: ["tech_core"],
    tech_composite_chassis: ["tech_aluminum_extrusion"],
    tech_streamlined_nose_320: ["tech_composite_chassis"],
    tech_ultra_aero_400: ["tech_streamlined_nose_320"],

    // Power Electronics branch
    tech_advanced_inverters: ["tech_core"],
    tech_compact_transformer: ["tech_advanced_inverters"],
    tech_sic_power: ["tech_compact_transformer"],
    tech_solid_state_trans: ["tech_sic_power"],

    // Traction Motors branch
    tech_high_torque_motors: ["tech_core"],
    tech_pmsm_traction: ["tech_high_torque_motors"],
    tech_hyper_motors_400: ["tech_pmsm_traction"],

    // Running Gear & Transmissions branch
    tech_quill_drive: ["tech_core"],
    tech_radial_bogies: ["tech_quill_drive"],
    tech_active_tilting: ["tech_radial_bogies"],

    // Power Collection & Catenary branch
    tech_multisystem: ["tech_core"],
    tech_aero_pantograph: ["tech_multisystem"],
    tech_hyper_collection_420: ["tech_aero_pantograph"],

    // Energy Storage & Autonomous Automation branch
    tech_battery_traction: ["tech_core"],
    tech_etcs_automation: ["tech_battery_traction"],
    tech_driverless_ato: ["tech_etcs_automation"]
  }
};

// Build master TECH_DATA array by combining root, registered component nodes, and hierarchy
const TECH_DATA = [
  TREE_STRUCTURE.core,
  ...(window.COMPONENT_RESEARCH || []).map(node => ({
    ...node,
    prereq: TREE_STRUCTURE.prerequisites[node.id] || ["tech_core"]
  }))
];