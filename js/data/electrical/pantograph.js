// Pantograph Current Collector Systems: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.pantograph = [
  {
    id: "panto_toyo_dc_urban",
    name: "Toyo Denki Low-Profile Single-Arm DC Collector",
    type: "pantograph",
    voltage: "1.5kV DC",
    maxSpeed: 130,
    maxCurrentAmps: 2200,
    weight: 250,
    cost: 34000,
    leadDays: 6,
    supplier: "Toyo Denki Seizo",
    inHouseTech: "tech_panto_urban_dc",
    desc: "Low-mass single-arm collector optimized for 1.5kV DC commuter routes and low tunnel clearances. Speed limit: 130 km/h."
  },
  {
    id: "panto_secheron_spl",
    name: "Secheron SPL Low-Clearance DC Collector",
    type: "pantograph",
    voltage: "3kV DC",
    maxSpeed: 160,
    maxCurrentAmps: 2500,
    weight: 290,
    cost: 42000,
    leadDays: 7,
    supplier: "Secheron SA",
    inHouseTech: "tech_panto_dc_highclearance",
    desc: "Compact single-arm with twin heavy-current carbon strips for 3kV DC lines. Speed limit: 160 km/h."
  },
  {
    id: "panto_stemmann_dsa150",
    name: "Stemmann DSA 150 Single-Arm Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 160,
    maxCurrentAmps: 1000,
    weight: 310,
    cost: 38000,
    leadDays: 6,
    supplier: "Stemmann-Technik / Wabtec",
    inHouseTech: "tech_panto_baseline_ac",
    desc: "Standard European single-arm pantograph with pneumatic bellows actuation. Reliable 160 km/h regional duty."
  },
  {
    id: "panto_schunk_wbl85",
    name: "Schunk WBL 85 High-Capacity Locomotive Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 200,
    maxCurrentAmps: 1200,
    weight: 335,
    cost: 46000,
    leadDays: 7,
    supplier: "Schunk Bahntechnik GmbH",
    inHouseTech: "tech_panto_loco_200",
    desc: "Heavy-duty single-arm collector widely utilized on 25kV electric locomotives. Reliable contact up to 200 km/h."
  },
  {
    id: "panto_brecknell_highreach",
    name: "Brecknell Willis High-Reach Freight Pantograph",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 160,
    maxCurrentAmps: 1500,
    weight: 390,
    cost: 48000,
    leadDays: 8,
    supplier: "Brecknell Willis / Wabtec",
    inHouseTech: "tech_panto_freight_highreach",
    desc: "Extended vertical operating range design suited for variable catenary heights on freight routes. Speed limit: 160 km/h."
  },
  {
    id: "panto_faiveley_am12",
    name: "Faiveley AM 12 Double-Arm Diamond Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 140,
    maxCurrentAmps: 2400,
    weight: 540,
    cost: 55000,
    leadDays: 10,
    supplier: "Faiveley Transport",
    inHouseTech: "tech_panto_diamond_heavy",
    desc: "Diamond-frame articulated dual-arm design. High mechanical stiffness and 2400A continuous current. Speed limit: 140 km/h."
  },
  {
    id: "panto_stemmann_dsa200",
    name: "Stemmann DSA 200 Intercity Express Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 230,
    maxCurrentAmps: 1100,
    weight: 300,
    cost: 62000,
    leadDays: 9,
    supplier: "Stemmann-Technik / Wabtec",
    inHouseTech: "tech_panto_intercity_230",
    desc: "Lightweight aerodynamically balanced single arm for 230 km/h passenger intercity trainsets."
  },
  {
    id: "panto_stemmann_dsa250_dual",
    name: "Stemmann DSA 250 Multi-System Collector",
    type: "pantograph",
    voltage: "Multi-System (25kV AC / 3kV DC)",
    maxSpeed: 250,
    maxCurrentAmps: 2200,
    weight: 460,
    cost: 82000,
    leadDays: 12,
    supplier: "Stemmann-Technik / Wabtec",
    inHouseTech: "tech_panto_multisystem_250",
    desc: "Dual-voltage head with automatic width and pressure adaptation for AC and DC catenary transitions. Speed limit: 250 km/h."
  },
  {
    id: "panto_faiveley_cx250",
    name: "Faiveley CX 250 High-Speed Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 280,
    maxCurrentAmps: 1300,
    weight: 320,
    cost: 115000,
    leadDays: 14,
    supplier: "Faiveley Transport",
    inHouseTech: "tech_panto_highspeed_280",
    desc: "Derived from TGV high-speed designs. Damped collector head providing steady contact at 280 km/h."
  },
  {
    id: "panto_schunk_wbl300",
    name: "Schunk WBL 300 High-Speed Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 300,
    maxCurrentAmps: 1250,
    weight: 295,
    cost: 135000,
    leadDays: 16,
    supplier: "Schunk Bahntechnik GmbH",
    inHouseTech: "tech_panto_express_300",
    desc: "High-speed single arm with internal aerodynamic uplift compensation vanes. Certified for 300 km/h corridors."
  },
  {
    id: "panto_faiveley_cx320",
    name: "Faiveley CX 320 Aerodynamic High-Speed",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 320,
    maxCurrentAmps: 1350,
    weight: 280,
    cost: 165000,
    leadDays: 18,
    supplier: "Faiveley Transport",
    inHouseTech: "tech_panto_hs_320",
    desc: "Carbon composite pan-head suspension with reduced acoustic vortex generation for 320 km/h corridors."
  },
  {
    id: "panto_schunk_wbl350",
    name: "Schunk WBL 350 High-Speed Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 350,
    maxCurrentAmps: 1400,
    weight: 265,
    cost: 210000,
    leadDays: 22,
    supplier: "Schunk Bahntechnik GmbH",
    inHouseTech: "tech_panto_hs_350",
    desc: "Aerodynamically optimized low-profile frame used on ICE 3 and Velaro high-speed trainsets up to 350 km/h."
  },
  {
    id: "panto_shinkansen_wing",
    name: "Meidensha Wing-Strut Shinkansen Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 360,
    maxCurrentAmps: 1200,
    weight: 230,
    cost: 290000,
    leadDays: 26,
    supplier: "Meidensha Corporation",
    inHouseTech: "tech_panto_wing_360",
    desc: "Single aerofoil T-strut with acoustic vortex cancellation as used on E5/E6 Series bullet trainsets up to 360 km/h."
  },
  {
    id: "panto_stemmann_dsa380",
    name: "Stemmann DSA 380 Ultra High-Speed Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 380,
    maxCurrentAmps: 1450,
    weight: 245,
    cost: 265000,
    leadDays: 24,
    supplier: "Stemmann-Technik / Wabtec",
    inHouseTech: "tech_panto_ultra_380",
    desc: "Ultra-low mass carbon bow collector engineered for 380 km/h express passenger operations."
  },
  {
    id: "panto_active_piezo_420",
    name: "AeroVolt Active Piezo-Follower Collector",
    type: "pantograph",
    voltage: "25kV AC",
    maxSpeed: 420,
    maxCurrentAmps: 1550,
    weight: 215,
    cost: 350000,
    leadDays: 30,
    supplier: "AeroVolt High-Speed Technologies",
    inHouseTech: "tech_panto_hyper_420",
    desc: "Closed-loop piezoelectric wire tension followers maintaining constant contact at speeds exceeding 400 km/h."
  }
];

SUBCOMPONENTS_DATA.pantograph = {
  subcomponents: [
    { id: "cs_carbon_rh84", name: "RH84 Metallized Carbon Contact Strip", cost: 6000, weight: 15, speedBonus: 0, efficiencyBonus: 0.002, desc: "European standard carbon profile offering low contact wire abrasion and smooth conductivity." },
    { id: "cs_copper_graphite", name: "Sintered Copper-Graphite Heavy Strip", cost: 11000, weight: 26, speedBonus: 10, efficiencyBonus: 0.005, desc: "High ampacity copper-graphite alloy strip for sustained heavy freight traction current." },
    { id: "cs_carbon_composite", name: "Carbon-Matrix Ceramic Composite Strip", cost: 24000, weight: 12, speedBonus: 35, efficiencyBonus: 0.008, desc: "Ultra-low friction composite engineered for 300+ km/h sustained running." }
  ],
  modifications: [
    { id: "act_pneumatic_bellows", name: "Pneumatic Bellows Actuator", cost: 5000, weight: 35, reliabilityBonus: 0, desc: "Standard compressed-air catenary contact pressure regulator with air reservoir." },
    { id: "act_linear_servo", name: "High-Frequency Active Electric Servo", cost: 18000, weight: 22, reliabilityBonus: 12, desc: "Closed-loop electronic positioning maintaining steady wire contact at 300+ km/h." },
    { id: "act_add_drop", name: "Automatic Drop Device (ADD Quick Air Dump)", cost: 9500, weight: 8, reliabilityBonus: 8, desc: "Instantly exhausts air bellows to retract collector within 0.2s if a wire snag is detected." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_panto_baseline_ac", name: "Baseline 25kV AC Single-Arm Collector", branch: "power_collection", costMoney: 180000, durationDays: 30, unlocks: ["panto_stemmann_dsa150"], desc: "Foundational 160 km/h single-arm pantograph with pneumatic bellows." },
  { id: "tech_panto_urban_dc", name: "Low-Voltage 1.5kV DC Urban Collector", branch: "power_collection", costMoney: 160000, durationDays: 25, unlocks: ["panto_toyo_dc_urban"], desc: "Compact low-clearance collector for suburban DC overhead networks." },
  { id: "tech_panto_dc_highclearance", name: "3kV DC High-Capacity Collector", branch: "power_collection", costMoney: 220000, durationDays: 35, unlocks: ["panto_secheron_spl"], desc: "Dual carbon contact strips handling 2500A continuous DC current." },
  { id: "tech_panto_freight_highreach", name: "Extended High-Reach Freight Pantograph", branch: "power_collection", costMoney: 280000, durationDays: 40, unlocks: ["panto_brecknell_highreach"], desc: "Variable-height articulated frame for heavy mineral corridors." },
  { id: "tech_panto_diamond_heavy", name: "Diamond-Frame Dual-Arm Heavy Collector", branch: "power_collection", costMoney: 340000, durationDays: 45, unlocks: ["panto_faiveley_am12"], desc: "Rigid double-arm framework providing 2400A current for heavy freight." },
  { id: "tech_panto_loco_200", name: "200 km/h Locomotive Express Collector", branch: "power_collection", costMoney: 420000, durationDays: 50, unlocks: ["panto_schunk_wbl85"], desc: "High-capacity single-arm pantograph engineered for 200 km/h operation." },
  { id: "tech_panto_intercity_230", name: "230 km/h Intercity Balanced Collector", branch: "power_collection", costMoney: 580000, durationDays: 55, unlocks: ["panto_stemmann_dsa200"], desc: "Lightweight aerodynamically balanced collector for passenger trainsets." },
  { id: "tech_panto_multisystem_250", name: "Multi-System AC/DC Dual-Voltage Collector", branch: "power_collection", costMoney: 850000, durationDays: 65, unlocks: ["panto_stemmann_dsa250_dual"], desc: "Automatic width and pressure adaptation for cross-border AC/DC running." },
  { id: "tech_panto_highspeed_280", name: "280 km/h Damped High-Speed Collector", branch: "power_collection", costMoney: 1100000, durationDays: 75, unlocks: ["panto_faiveley_cx250"], desc: "TGV-derived damped pan-head suspension maintaining wire contact at 280 km/h." },
  { id: "tech_panto_express_300", name: "300 km/h Aerodynamic Uplift Collector", branch: "power_collection", costMoney: 1600000, durationDays: 90, unlocks: ["panto_schunk_wbl300"], desc: "Aerodynamic uplift vanes balancing aerodynamic forces at 300 km/h." },
  { id: "tech_panto_hs_320", name: "320 km/h Precision Airfoil Collector", branch: "power_collection", costMoney: 2200000, durationDays: 105, unlocks: ["panto_faiveley_cx320"], desc: "Carbon-profile pan-head suspension with reduced acoustic vortex generation." },
  { id: "tech_panto_hs_350", name: "350 km/h Low-Profile High-Speed Collector", branch: "power_collection", costMoney: 2800000, durationDays: 120, unlocks: ["panto_schunk_wbl350"], desc: "Low-profile aerodynamic frame as deployed on Velaro platforms up to 350 km/h." },
  { id: "tech_panto_wing_360", name: "360 km/h Wing-Strut Shinkansen Collector", branch: "power_collection", costMoney: 3600000, durationDays: 135, unlocks: ["panto_shinkansen_wing"], desc: "Low-noise T-shaped aerofoil strut eliminating wire contact loss at 360 km/h." },
  { id: "tech_panto_ultra_380", name: "380 km/h Ultra High-Speed Carbon Bow Collector", branch: "power_collection", costMoney: 4400000, durationDays: 150, unlocks: ["panto_stemmann_dsa380"], desc: "Ultra-low mass carbon bow collector engineered for 380 km/h express services." },
  { id: "tech_panto_hyper_420", name: "420 km/h Active Piezoelectric Follower", branch: "power_collection", costMoney: 5600000, durationDays: 170, unlocks: ["panto_active_piezo_420"], desc: "Closed-loop piezoelectric wire tension follower eliminating micro-arcs above 400 km/h." }
);