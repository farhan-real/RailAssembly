// Research graph nodes with prerequisites and unlocked manufacturing abilities
const TECH_DATA = [
  {
    id: "tech_aluminum_extrusion",
    name: "Aluminum Extrusions",
    tier: 1,
    costScience: 150,
    costMoney: 300000,
    prereq: [],
    unlocks: ["body_aluminum"],
    inHouseUnlock: "body_aluminum",
    desc: "Enables production of lightweight aluminum bodies for passenger trainsets."
  },
  {
    id: "tech_advanced_inverters",
    name: "Liquid-Cooled VVVF",
    tier: 1,
    costScience: 200,
    costMoney: 450000,
    prereq: [],
    unlocks: ["inv_igbt_liquid"],
    inHouseUnlock: "inv_igbt_liquid",
    desc: "Unlocks 6000kW liquid-cooled inverters with regenerative frequency logic."
  },
  {
    id: "tech_compact_transformer",
    name: "Underfloor Traction Trafo",
    tier: 1,
    costScience: 220,
    costMoney: 500000,
    prereq: [],
    unlocks: ["trans_compact"],
    inHouseUnlock: "trans_compact",
    desc: "Pioneers compact underfloor transformers freeing car interior space."
  },
  {
    id: "tech_battery_traction",
    name: "BEMU Last-Mile Batteries",
    tier: 2,
    costScience: 400,
    costMoney: 900000,
    prereq: ["tech_advanced_inverters"],
    unlocks: ["bat_lfp_lastmile"],
    inHouseUnlock: "bat_lfp_lastmile",
    desc: "Integrates lithium-iron-phosphate traction packs for wire-free depot runs."
  },
  {
    id: "tech_high_torque_motors",
    name: "Heavy Turbo Induction",
    tier: 2,
    costScience: 380,
    costMoney: 800000,
    prereq: [],
    unlocks: ["mot_ind_highoutput"],
    inHouseUnlock: "mot_ind_highoutput",
    desc: "High tractive effort motors capable of hauling immense freight loads."
  },
  {
    id: "tech_etcs_automation",
    name: "ETCS Level 2 Signaling",
    tier: 2,
    costScience: 450,
    costMoney: 1100000,
    prereq: [],
    unlocks: ["tcms_etcs2"],
    inHouseUnlock: "tcms_etcs2",
    desc: "Radio block signaling and automatic train protection algorithms."
  },
  {
    id: "tech_multisystem",
    name: "Dual-Voltage Catenary",
    tier: 2,
    costScience: 500,
    costMoney: 1200000,
    prereq: ["tech_compact_transformer"],
    unlocks: ["panto_dual"],
    inHouseUnlock: "panto_dual",
    desc: "Allows trains to transition between 25kV AC and 3kV DC catenary networks."
  },
  {
    id: "tech_sic_power",
    name: "Silicon Carbide (SiC) Power",
    tier: 3,
    costScience: 800,
    costMoney: 2200000,
    prereq: ["tech_advanced_inverters"],
    unlocks: ["inv_sic"],
    inHouseUnlock: "inv_sic",
    desc: "SiC MOSFET modules boosting traction efficiency to 98.5%."
  },
  {
    id: "tech_pmsm_traction",
    name: "Permanent Magnet Motors",
    tier: 3,
    costScience: 850,
    costMoney: 2400000,
    prereq: ["tech_high_torque_motors"],
    unlocks: ["mot_pmsm"],
    inHouseUnlock: "mot_pmsm",
    desc: "Lightweight synchronous motors enabling rapid sprint acceleration."
  },
  {
    id: "tech_radial_bogies",
    name: "Radial Steering Bogies",
    tier: 3,
    costScience: 750,
    costMoney: 1800000,
    prereq: ["tech_aluminum_extrusion"],
    unlocks: ["bog_articulated"],
    inHouseUnlock: "bog_articulated",
    desc: "Steerable axles navigating curves with minimal flange friction."
  },
  {
    id: "tech_composite_chassis",
    name: "Carbon Bullet Nose Aerodynamics",
    tier: 4,
    costScience: 1300,
    costMoney: 3800000,
    prereq: ["tech_radial_bogies"],
    unlocks: ["body_aero_cf", "panto_hs"],
    inHouseUnlock: "body_aero_cf",
    desc: "Carbon-fiber composite nose cones achieving drag coefficients below 0.23."
  },
  {
    id: "tech_solid_state_trans",
    name: "Solid-State Matrix Trafo",
    tier: 4,
    costScience: 1500,
    costMoney: 4500000,
    prereq: ["tech_sic_power"],
    unlocks: ["trans_solidstate"],
    inHouseUnlock: "trans_solidstate",
    desc: "Eliminates heavy oil cores using microsecond switching transformers."
  },
  {
    id: "tech_driverless_ato",
    name: "Autonomous GoA4 ATO Systems",
    tier: 4,
    costScience: 1600,
    costMoney: 5000000,
    prereq: ["tech_etcs_automation"],
    unlocks: ["tcms_cbtc_ai"],
    inHouseUnlock: "tcms_cbtc_ai",
    desc: "Full automated train operation with adaptive traction predictive braking."
  }
];