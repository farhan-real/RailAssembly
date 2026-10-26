// Train Control & Monitoring Networks (TCMS) & WSP: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.tcms = [
  {
    id: "tcms_basic",
    name: "Relay Microprocessor Control Unit",
    type: "tcms",
    automationLevel: "Manual Operation (Grade 1)",
    reliabilityBonus: 0,
    weight: 350,
    cost: 50000,
    leadDays: 7,
    supplier: "RailLogic Electronics Group",
    inHouseTech: "tech_tcms_baseline",
    desc: "Standard train control and monitoring architecture with hardware relay logic."
  },
  {
    id: "tcms_etcs2",
    name: "Automatic Train Protection System (ETCS Level 2)",
    type: "tcms",
    automationLevel: "Semi-Automated Operation (Grade 2)",
    reliabilityBonus: 12,
    weight: 220,
    cost: 180000,
    leadDays: 15,
    supplier: "RailLogic Electronics Group",
    inHouseTech: "tech_tcms_etcs_l2",
    desc: "Continuous radio-block signaling supervision and automatic cab speed enforcement."
  },
  {
    id: "tcms_cbtc_ai",
    name: "Autonomous Automated Train Operation System",
    type: "tcms",
    automationLevel: "Unattended Driverless Operation (Grade 4)",
    reliabilityBonus: 25,
    weight: 180,
    cost: 390000,
    leadDays: 24,
    supplier: "CyberTransit Systems",
    inHouseTech: "tech_tcms_cbtc_goa4",
    desc: "Full automated train operation with neural adhesion control and coasting optimization."
  }
];

COMPONENTS_DATA.safety = [
  { id: "wsp_basic", name: "Pneumatic Mechanical Anti-Skid Valves", type: "safety", safetyScoreBonus: 4, weight: 110, cost: 22000, leadDays: 7, supplier: "Bremse Systems International", inHouseTech: "tech_safe_wsp_pneumatic", desc: "Standard differential wheel deceleration sensing." },
  { id: "wsp_microprocessor", name: "Multi-Channel Microprocessor Wheel Slide Protection", type: "safety", safetyScoreBonus: 10, weight: 80, cost: 48000, leadDays: 14, supplier: "Bremse Systems International", inHouseTech: "tech_safe_wsp_electronic", desc: "Independent axle wheel speed regulation shortening emergency braking distances." },
  { id: "wsp_integrated_surge", name: "Integrated High-Speed WSP with Metal-Oxide Surge Diverter", type: "safety", safetyScoreBonus: 18, weight: 125, cost: 88000, leadDays: 20, supplier: "Bremse Systems International", inHouseTech: "tech_safe_surge_integrated", desc: "Combines Doppler radar slip compensation with 25kV roof surge arresters." }
];

SUBCOMPONENTS_DATA.tcms = {
  subcomponents: [
    { id: "bus_wtb", name: "Wire Train Bus and Multifunction Vehicle Bus", cost: 16000, weight: 30, reliabilityBonus: 4, desc: "Standard IEC 61375 industrial train networking interface." },
    { id: "bus_etb", name: "Redundant Industrial Gigabit Ethernet Train Backbone", cost: 36000, weight: 20, reliabilityBonus: 14, desc: "High-bandwidth dual ring network facilitating real-time sensor control." }
  ],
  modifications: [
    { id: "sens_standard", name: "Standard Axle Tachometers and Inductive Pickups", cost: 12000, weight: 25, safetyBonus: 4, desc: "Rotational pulse sensors measuring wheel speed and slip." },
    { id: "sens_radar", name: "Dual-Beam Doppler Radar and Inertial Measurement Unit", cost: 34000, weight: 18, safetyBonus: 15, desc: "True ground speed verification eliminating slip/slide measurement error." }
  ]
};

SUBCOMPONENTS_DATA.safety = {
  subcomponents: [
    { id: "surge_metal_oxide", name: "Heavy Gapless Zinc-Oxide Surge Arrester", cost: 9000, weight: 28, safetyBonus: 8, desc: "Clamps lightning and catenary switching surges before reaching the main transformer." }
  ],
  modifications: [
    { id: "wsp_radar_speed", name: "True Ground Doppler Velocity Radar Feed", cost: 22000, weight: 12, safetyBonus: 12, desc: "Provides true ground speed reference to eliminate wheel-lock error during braking." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_tcms_baseline", name: "Microprocessor Vehicle Bus Control Unit", branch: "automation", costMoney: 190000, durationDays: 30, unlocks: ["tcms_basic"], desc: "Distributed train diagnostic bus and cab instrumentation display controller." },
  { id: "tech_tcms_etcs_l2", name: "ETCS Level 2 Baseline 3 Radio-Block Automation", branch: "automation", costMoney: 850000, durationDays: 65, unlocks: ["tcms_etcs2"], desc: "Continuous cab speed supervision under GSM-R and Eurobalise track links." },
  { id: "tech_tcms_cbtc_goa4", name: "Grade-of-Automation 4 Driverless Autonomous Network", branch: "automation", costMoney: 3200000, durationDays: 130, unlocks: ["tcms_cbtc_ai"], desc: "Unattended driverless automation maximizing energy coasting and adhesion control." },
  { id: "tech_safe_wsp_pneumatic", name: "Pneumatic Mechanical Wheel Anti-Skid Valves", branch: "automation", costMoney: 120000, durationDays: 20, unlocks: ["wsp_basic"], desc: "Differential pressure exhaust valves preventing wheel flats during hard braking." },
  { id: "tech_safe_wsp_electronic", name: "Electronic Multi-Channel Wheel Slide Protection", branch: "automation", costMoney: 320000, durationDays: 45, unlocks: ["wsp_microprocessor"], desc: "Axle sensor microprocessors maximizing adhesion grip in wet rail conditions." },
  { id: "tech_safe_surge_integrated", name: "High-Speed WSP with Metal-Oxide Surge Arresters", branch: "automation", costMoney: 950000, durationDays: 75, unlocks: ["wsp_integrated_surge"], desc: "Combines Doppler radar velocity monitoring with 25kV roof surge protection." }
);