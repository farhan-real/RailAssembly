// Government tenders and competitor dynamics
const COMPETITORS_DATA = [
  {
    id: "comp_veloce",
    name: "Veloce Electromotive",
    country: "Italy / France",
    marketShare: 32,
    speedScore: 88,
    reliabilityScore: 82,
    avgMarkup: 22,
    specialty: "High-Speed Passenger & Aerodynamic EMUs"
  },
  {
    id: "comp_nordic",
    name: "Nordic Heavy Traction",
    country: "Sweden / Germany",
    marketShare: 28,
    speedScore: 68,
    reliabilityScore: 94,
    avgMarkup: 18,
    specialty: "Co-Co Heavy Haul Electric Locomotives"
  },
  {
    id: "comp_transglobal",
    name: "TransGlobal Rail Systems",
    country: "Japan / UK",
    marketShare: 24,
    speedScore: 92,
    reliabilityScore: 90,
    avgMarkup: 26,
    specialty: "Suburban Dual-Power EMUs & Autonomous TCMS"
  }
];

const TENDER_TEMPLATES = [
  {
    type: "regional_commuter",
    title: "Regional Electric Multiple-Unit Fleet",
    agency: "State Transit Authority",
    unitsRequired: 30,
    batchSizePerQuarter: 5,
    budgetPerUnit: 2400000,
    delayToleranceDays: 45,
    minSpeed: 160,
    minPassengerCap: 200,
    preferredPowerKw: 4000,
    description: "Electrification of secondary inter-county line requiring reliable EMUs."
  },
  {
    type: "heavy_freight",
    title: "National Mineral Rail Haulage Locomotives",
    agency: "Ministry of Transportation & Heavy Logistics",
    unitsRequired: 24,
    batchSizePerQuarter: 4,
    budgetPerUnit: 2800000,
    delayToleranceDays: 60,
    minSpeed: 120,
    minPassengerCap: 0,
    preferredPowerKw: 6000,
    description: "High tractive effort electric freight locomotives for heavy coal and grain routes."
  },
  {
    type: "high_speed_express",
    title: "Trans-Continental 300km/h Express Corridor",
    agency: "Federal High-Speed Rail Directorate",
    unitsRequired: 16,
    batchSizePerQuarter: 2,
    budgetPerUnit: 4800000,
    delayToleranceDays: 30,
    minSpeed: 290,
    minPassengerCap: 280,
    preferredPowerKw: 7000,
    description: "Prestige passenger line connecting capital cities under 25kV AC catenary."
  }
];