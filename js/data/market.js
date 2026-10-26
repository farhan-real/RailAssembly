// Government tenders with targeted requirements and strictness reward scaling
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
    type: "high_speed_express",
    title: "National Trans-Corridor Express Fleet",
    agency: "Federal High-Speed Rail Directorate",
    unitsRequired: 18,
    batchSizePerQuarter: 2,
    budgetPerUnit: 5200000,
    delayToleranceDays: 30,
    strictnessTier: "Extreme Precision",
    premiumMarkupFactor: 1.65,
    description: "High-priority flagship passenger corridor requiring sustained speeds above 320 km/h and rapid sprint acceleration.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 320, unit: "km/h", compare: "min" },
      { key: "acceleration", label: "Starting Acceleration", value: 0.70, unit: "m/s²", compare: "min" },
      { key: "passengerCap", label: "Passenger Capacity", value: 300, unit: "Passengers", compare: "min" }
    ]
  },
  {
    type: "regional_commuter",
    title: "Metropolitan Suburban Commuter Rolling Stock",
    agency: "Urban Transit Authority",
    unitsRequired: 32,
    batchSizePerQuarter: 4,
    budgetPerUnit: 2400000,
    delayToleranceDays: 45,
    strictnessTier: "Demanding Specification",
    premiumMarkupFactor: 1.35,
    description: "High-frequency urban network requiring rapid station dwell acceleration and strict capital expenditure ceilings.",
    requirements: [
      { key: "unitCost", label: "Unit Production Cost Ceiling", value: 2200000, unit: "Dollars", compare: "max" },
      { key: "acceleration", label: "Starting Acceleration", value: 0.85, unit: "m/s²", compare: "min" },
      { key: "passengerCap", label: "Passenger Capacity", value: 250, unit: "Passengers", compare: "min" }
    ]
  },
  {
    type: "heavy_freight",
    title: "Mineral Basin Heavy Haul Locomotives",
    agency: "Ministry of Heavy Transport & Logistics",
    unitsRequired: 24,
    batchSizePerQuarter: 3,
    budgetPerUnit: 4100000,
    delayToleranceDays: 60,
    strictnessTier: "Extreme Precision",
    premiumMarkupFactor: 1.70,
    description: "Demanding mountainous freight routes demanding high tractive adhesion, massive horsepower, and strict axle-load compliance.",
    requirements: [
      { key: "tractiveEffort", label: "Tractive Effort Adhesion", value: 460, unit: "Kilonewtons", compare: "min" },
      { key: "horsepower", label: "Continuous Traction Power", value: 7200, unit: "Horsepower", compare: "min" },
      { key: "maxAxleLoad", label: "Maximum Permissible Axle Load", value: 25.0, unit: "Metric Tons / Axle", compare: "max" }
    ]
  },
  {
    type: "mixed_intercity",
    title: "Cross-Provincial Intercity Mixed Fleet",
    agency: "State Passenger & Parcel Service",
    unitsRequired: 20,
    batchSizePerQuarter: 3,
    budgetPerUnit: 3400000,
    delayToleranceDays: 45,
    strictnessTier: "Standard Specification",
    premiumMarkupFactor: 1.15,
    description: "Balanced interurban corridor requiring moderate express speeds, cost control, and dependable continuous power.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 210, unit: "km/h", compare: "min" },
      { key: "horsepower", label: "Continuous Traction Power", value: 5500, unit: "Horsepower", compare: "min" },
      { key: "unitCost", label: "Unit Production Cost Ceiling", value: 2950000, unit: "Dollars", compare: "max" }
    ]
  }
];