// Government Rolling Stock Contracts with Rich Multi-Parameter Requirements
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

const CONTRACT_TEMPLATES = [
  {
    type: "grand_highspeed_350",
    title: "Trans-Continental High-Speed Bullet Corridor",
    agency: "Federal High-Speed Rail Directorate",
    unitsRequired: 24,
    batchSizePerQuarter: 3,
    budgetPerUnit: 5800000,
    mobilizationDays: 60,
    delayToleranceDays: 30,
    strictnessTier: "Extreme Precision",
    premiumMarkupFactor: 1.65,
    description: "Flagship 350 km/h aerodynamic passenger bullet trainset with high continuous power and strict drag limits.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 350, unit: "km/h", compare: "min" },
      { key: "acceleration", label: "Starting Acceleration", value: 0.65, unit: "m/s²", compare: "min" },
      { key: "passengerCap", label: "Seating Capacity", value: 320, unit: "Seats", compare: "min" },
      { key: "aerodynamics", label: "Max Aerodynamic Drag (Cd)", value: 0.22, unit: "Cd", compare: "max" }
    ]
  },
  {
    type: "mineral_basin_heavy",
    title: "Mountain Basin Mineral Haul Locomotives",
    agency: "Ministry of Heavy Transport & Logistics",
    unitsRequired: 28,
    batchSizePerQuarter: 4,
    budgetPerUnit: 4400000,
    mobilizationDays: 60,
    delayToleranceDays: 60,
    strictnessTier: "Extreme Precision",
    premiumMarkupFactor: 1.70,
    description: "Severe gradient mineral routes demanding massive starting tractive adhesion and strict axle load compliance.",
    requirements: [
      { key: "tractiveEffort", label: "Tractive Effort Adhesion", value: 500, unit: "kN", compare: "min" },
      { key: "horsepower", label: "Continuous Traction Power", value: 7500, unit: "hp", compare: "min" },
      { key: "maxAxleLoad", label: "Max Permissible Axle Load", value: 25.0, unit: "t/Axle", compare: "max" }
    ]
  },
  {
    type: "metropolitan_commuter_emu",
    title: "Metropolitan Suburban Commuter Rolling Stock",
    agency: "Urban Transit Authority",
    unitsRequired: 36,
    batchSizePerQuarter: 4,
    budgetPerUnit: 2500000,
    mobilizationDays: 45,
    delayToleranceDays: 45,
    strictnessTier: "Demanding Specification",
    premiumMarkupFactor: 1.35,
    description: "High-frequency urban network requiring rapid station dwell sprint acceleration and tight cost control.",
    requirements: [
      { key: "acceleration", label: "Starting Acceleration", value: 0.88, unit: "m/s²", compare: "min" },
      { key: "passengerCap", label: "Passenger Seating Capacity", value: 260, unit: "Passengers", compare: "min" },
      { key: "unitCost", label: "Unit Production Cost Ceiling", value: 2250000, unit: "USD", compare: "max" }
    ]
  },
  {
    type: "cross_border_multisystem",
    title: "Trans-European Dual-Voltage Cross-Border Express",
    agency: "International Railway Union",
    unitsRequired: 16,
    batchSizePerQuarter: 2,
    budgetPerUnit: 4900000,
    mobilizationDays: 60,
    delayToleranceDays: 40,
    strictnessTier: "Demanding Specification",
    premiumMarkupFactor: 1.50,
    description: "Inter-capital corridor requiring multi-system AC/DC catenary flexibility and high powertrain efficiency.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 240, unit: "km/h", compare: "min" },
      { key: "multiSystem", label: "Multi-Voltage Grid Compatibility", value: "Multi-System", unit: "System", compare: "bool" },
      { key: "efficiency", label: "Total Powertrain Efficiency", value: 93, unit: "%", compare: "min" },
      { key: "safetyScore", label: "Integrated Safety Index", value: 92, unit: "Pts", compare: "min" }
    ]
  },
  {
    type: "zero_emission_lastmile",
    title: "Deep-Sea Port Battery Last-Mile Freight Shunters",
    agency: "National Maritime & Port Authority",
    unitsRequired: 18,
    batchSizePerQuarter: 3,
    budgetPerUnit: 3600000,
    mobilizationDays: 50,
    delayToleranceDays: 45,
    strictnessTier: "Standard Specification",
    premiumMarkupFactor: 1.40,
    description: "Zero-emission shunting locomotives with onboard auxiliary battery energy storage for non-electrified docks.",
    requirements: [
      { key: "batteryRange", label: "Zero-Emission Battery Range", value: 30, unit: "km", compare: "min" },
      { key: "tractiveEffort", label: "Tractive Effort Adhesion", value: 420, unit: "kN", compare: "min" },
      { key: "horsepower", label: "Continuous Traction Power", value: 4600, unit: "hp", compare: "min" }
    ]
  },
  {
    type: "airport_direct_link",
    title: "Capital International Airport High-Frequency Express",
    agency: "Aviation Corridor Transit Directorate",
    unitsRequired: 20,
    batchSizePerQuarter: 4,
    budgetPerUnit: 2900000,
    mobilizationDays: 45,
    delayToleranceDays: 35,
    strictnessTier: "Demanding Specification",
    premiumMarkupFactor: 1.45,
    description: "Dedicated non-stop airport connector prioritizing punctuality, passenger capacity, and rapid sprint speed.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 180, unit: "km/h", compare: "min" },
      { key: "acceleration", label: "Starting Acceleration", value: 0.85, unit: "m/s²", compare: "min" },
      { key: "passengerCap", label: "Passenger Seating Capacity", value: 280, unit: "Passengers", compare: "min" }
    ]
  },
  {
    type: "ultra_speed_sprint",
    title: "Next-Gen 400 km/h National High-Speed Prototype Fleet",
    agency: "Ministry of Science & Rail Innovation",
    unitsRequired: 12,
    batchSizePerQuarter: 2,
    budgetPerUnit: 6900000,
    mobilizationDays: 75,
    delayToleranceDays: 45,
    strictnessTier: "Extreme Precision",
    premiumMarkupFactor: 1.85,
    description: "Boundary-pushing ultra high-speed express trainsets requiring supreme aerodynamics and flawless safety systems.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 380, unit: "km/h", compare: "min" },
      { key: "aerodynamics", label: "Aerodynamic Drag Coefficient", value: 0.18, unit: "Cd", compare: "max" },
      { key: "safetyScore", label: "Composite Safety Score", value: 98, unit: "Pts", compare: "min" },
      { key: "efficiency", label: "Powertrain Efficiency", value: 95, unit: "%", compare: "min" }
    ]
  },
  {
    type: "alpine_gradient_express",
    title: "Alpine Pass High-Gradient Passenger Trainsets",
    agency: "Mountain Transit Confederation",
    unitsRequired: 15,
    batchSizePerQuarter: 3,
    budgetPerUnit: 3900000,
    mobilizationDays: 50,
    delayToleranceDays: 45,
    strictnessTier: "Demanding Specification",
    premiumMarkupFactor: 1.45,
    description: "Steep mountain grade operations demanding elevated adhesion force and strict axle-load compliance.",
    requirements: [
      { key: "tractiveEffort", label: "Starting Adhesion Force", value: 450, unit: "kN", compare: "min" },
      { key: "maxAxleLoad", label: "Max Axle Load Ceiling", value: 18.5, unit: "t/Axle", compare: "max" },
      { key: "safetyScore", label: "Braking & Safety Index", value: 94, unit: "Pts", compare: "min" }
    ]
  },
  {
    type: "intermodal_time_freight",
    title: "Express Intermodal Container Electric Locomotives",
    agency: "National Freight Logistics Corporation",
    unitsRequired: 30,
    batchSizePerQuarter: 5,
    budgetPerUnit: 3750000,
    mobilizationDays: 50,
    delayToleranceDays: 50,
    strictnessTier: "Standard Specification",
    premiumMarkupFactor: 1.25,
    description: "High-speed container freight moving goods across intercity corridors at express freight timetables.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 160, unit: "km/h", compare: "min" },
      { key: "horsepower", label: "Continuous Traction Power", value: 6800, unit: "hp", compare: "min" },
      { key: "unitCost", label: "Production Cost Ceiling", value: 3100000, unit: "USD", compare: "max" }
    ]
  },
  {
    type: "green_branch_bemu",
    title: "Regional Branch Line Battery-Electric Trainsets",
    agency: "Provincial Rural Transport Bureau",
    unitsRequired: 22,
    batchSizePerQuarter: 3,
    budgetPerUnit: 3300000,
    mobilizationDays: 55,
    delayToleranceDays: 50,
    strictnessTier: "Demanding Specification",
    premiumMarkupFactor: 1.40,
    description: "Dual-mode battery electric trainsets bridging rural branch line gaps without catenary wiring.",
    requirements: [
      { key: "batteryRange", label: "Wire-Free Battery Range", value: 80, unit: "km", compare: "min" },
      { key: "passengerCap", label: "Passenger Seating Capacity", value: 240, unit: "Passengers", compare: "min" },
      { key: "efficiency", label: "Powertrain Efficiency", value: 92, unit: "%", compare: "min" }
    ]
  },
  {
    type: "autonomous_goa4_metro",
    title: "Grade-of-Automation 4 Autonomous Metro Consists",
    agency: "Capital City Automated Metro Directorate",
    unitsRequired: 25,
    batchSizePerQuarter: 4,
    budgetPerUnit: 3100000,
    mobilizationDays: 60,
    delayToleranceDays: 40,
    strictnessTier: "Extreme Precision",
    premiumMarkupFactor: 1.60,
    description: "Driverless automated urban trains featuring high redundancy, advanced WSP, and responsive acceleration.",
    requirements: [
      { key: "acceleration", label: "Starting Acceleration", value: 0.92, unit: "m/s²", compare: "min" },
      { key: "safetyScore", label: "Automation Safety Rating", value: 100, unit: "Pts", compare: "min" },
      { key: "passengerCap", label: "Passenger Capacity", value: 280, unit: "Passengers", compare: "min" }
    ]
  },
  {
    type: "trans_provincial_intercity",
    title: "Cross-Provincial High-Density Intercity Fleet",
    agency: "State Passenger & Parcel Service",
    unitsRequired: 24,
    batchSizePerQuarter: 3,
    budgetPerUnit: 3500000,
    mobilizationDays: 45,
    delayToleranceDays: 45,
    strictnessTier: "Standard Specification",
    premiumMarkupFactor: 1.20,
    description: "Balanced interurban corridor requiring steady 200+ km/h cruising, low unit costs, and high passenger seating.",
    requirements: [
      { key: "speed", label: "Operating Speed", value: 210, unit: "km/h", compare: "min" },
      { key: "passengerCap", label: "Passenger Seating Capacity", value: 300, unit: "Passengers", compare: "min" },
      { key: "unitCost", label: "Production Cost Ceiling", value: 2950000, unit: "USD", compare: "max" }
    ]
  },
  {
    type: "luxury_night_sleeper",
    title: "Trans-National Grand Sleeper Hotel Express",
    agency: "Continental Tourist Rail Alliance",
    unitsRequired: 14,
    batchSizePerQuarter: 2,
    budgetPerUnit: 4800000,
    mobilizationDays: 60,
    delayToleranceDays: 50,
    strictnessTier: "Demanding Specification",
    premiumMarkupFactor: 1.55,
    description: "Long passenger consist offering quiet ride comfort, high total power, and premium passenger amenities.",
    requirements: [
      { key: "carriageCount", label: "Consist Train Length", value: 6, unit: "Carriages", compare: "min" },
      { key: "speed", label: "Operating Speed", value: 220, unit: "km/h", compare: "min" },
      { key: "safetyScore", label: "Ride Quality & Safety Index", value: 92, unit: "Pts", compare: "min" }
    ]
  },
  {
    type: "arctic_corridor_freight",
    title: "Sub-Zero Arctic Tundra Industrial Freight Locomotives",
    agency: "Northern Polar Development Authority",
    unitsRequired: 20,
    batchSizePerQuarter: 3,
    budgetPerUnit: 4600000,
    mobilizationDays: 65,
    delayToleranceDays: 60,
    strictnessTier: "Extreme Precision",
    premiumMarkupFactor: 1.65,
    description: "High-power freight haulage engineered for ice-covered railheads and extreme thermal mechanical endurance.",
    requirements: [
      { key: "tractiveEffort", label: "Tractive Effort Adhesion", value: 480, unit: "kN", compare: "min" },
      { key: "horsepower", label: "Continuous Traction Power", value: 7200, unit: "hp", compare: "min" },
      { key: "safetyScore", label: "Pneumatics & Safety System", value: 90, unit: "Pts", compare: "min" }
    ]
  }
];

const TENDER_TEMPLATES = CONTRACT_TEMPLATES;