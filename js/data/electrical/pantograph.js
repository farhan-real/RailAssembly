// Pantograph Current Collector Systems: Real-World Models, Specs, Subcomponents, and Research Metadata
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
    inHouseTech: null,
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
    inHouseTech: null,
    desc: "Compact single-arm with twin heavy-current carbon strips for 3kV DC lines. Speed limit: 160 km/h."
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
    inHouseTech: null,
    desc: "Sturdy diamond-frame articulated dual-arm design. High mechanical stiffness and 2400A continuous current. Speed limit: 140 km/h."
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
    inHouseTech: null,
    desc: "Extended vertical operating range design suited for variable catenary heights on freight routes. Speed limit: 160 km/h."
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
    inHouseTech: null,
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
    inHouseTech: null,
    desc: "Heavy-duty single-arm collector widely utilized on 25kV electric locomotives. Reliable contact up to 200 km/h."
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
    inHouseTech: null,
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
    inHouseTech: "tech_multisystem",
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
    inHouseTech: "tech_aero_pantograph",
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
    inHouseTech: "tech_aero_pantograph",
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
    inHouseTech: "tech_aero_pantograph",
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
    inHouseTech: "tech_aero_pantograph",
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
    inHouseTech: "tech_aero_pantograph",
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
    inHouseTech: "tech_aero_pantograph",
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
    inHouseTech: "tech_hyper_collection_420",
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
  {
    id: "tech_multisystem",
    name: "Dual-Voltage Catenary Collection",
    branch: "power_collection",
    costMoney: 950000,
    durationDays: 65,
    unlocks: ["panto_stemmann_dsa250_dual", "vcb_hybrid_multisystem"],
    desc: "Seamless transition between 25kV AC and 3kV DC catenary networks."
  },
  {
    id: "tech_aero_pantograph",
    name: "300-380 km/h High-Speed Pantographs",
    branch: "power_collection",
    costMoney: 2400000,
    durationDays: 105,
    unlocks: ["panto_faiveley_cx250", "panto_schunk_wbl300", "panto_faiveley_cx320", "panto_schunk_wbl350", "panto_shinkansen_wing", "panto_stemmann_dsa380"],
    desc: "Aerodynamically stabilized collectors preventing wire arcing and contact loss up to 380 km/h."
  },
  {
    id: "tech_hyper_collection_420",
    name: "Active Piezoelectric 420 km/h Collectors",
    branch: "power_collection",
    costMoney: 5200000,
    durationDays: 165,
    unlocks: ["panto_active_piezo_420"],
    desc: "Closed-loop piezoelectric wire tracking eliminating micro-arcs at speeds exceeding 400 km/h."
  }
);