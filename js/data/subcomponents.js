// Technical subcomponents and engineering modifications with associated physical deltas
const SUBCOMPONENTS_DATA = {
  pantograph: {
    subcomponents: [
      {
        id: "cs_carbon",
        name: "Metallized Carbon Contact Strip",
        cost: 6000,
        weight: 15,
        speedBonus: 0,
        efficiencyBonus: 0.002,
        desc: "Standard European profile with low catenary wire abrasion."
      },
      {
        id: "cs_copper",
        name: "Sintered Copper-Graphite Strip",
        cost: 11000,
        weight: 26,
        speedBonus: 15,
        efficiencyBonus: 0.005,
        desc: "High ampacity alloy strip for sustained heavy traction loads."
      },
      {
        id: "cs_composite",
        name: "Carbon-Matrix Ceramic Composite Strip",
        cost: 24000,
        weight: 12,
        speedBonus: 35,
        efficiencyBonus: 0.008,
        desc: "Ultra-low friction composite engineered for high-speed corridors."
      }
    ],
    modifications: [
      {
        id: "act_pneumatic",
        name: "Pneumatic Bellows Actuator",
        cost: 5000,
        weight: 35,
        reliabilityBonus: 0,
        desc: "Standard compressed-air catenary contact pressure regulator."
      },
      {
        id: "act_servo",
        name: "High-Frequency Active Electric Servo",
        cost: 18000,
        weight: 22,
        reliabilityBonus: 12,
        desc: "Closed-loop electronic positioning maintaining steady wire contact at 300+ km/h."
      }
    ]
  },
  transformer: {
    subcomponents: [
      {
        id: "wind_copper",
        name: "Electrolytic High-Purity Copper Foil",
        cost: 18000,
        weight: 400,
        efficiencyBonus: 0.008,
        desc: "Standard high-conductivity secondary winding coils."
      },
      {
        id: "wind_alribbon",
        name: "Anodized Aluminum Ribbon Winding",
        cost: 12000,
        weight: -250,
        efficiencyBonus: -0.004,
        desc: "Weight-saving winding reducing overall locomotive tare mass."
      },
      {
        id: "wind_supercond",
        name: "High-Temperature Superconducting Ceramic Tape",
        cost: 65000,
        weight: -150,
        efficiencyBonus: 0.022,
        desc: "Negligible internal coil electrical resistance with ultra-high power density."
      }
    ],
    modifications: [
      {
        id: "cool_mineral",
        name: "Mineral Oil Cooling with Forced Pump",
        cost: 9000,
        weight: 320,
        reliabilityBonus: 0,
        desc: "Standard oil cooling system with radiator and heat exchangers."
      },
      {
        id: "cool_ester",
        name: "Biodegradable Synthetic Ester Cooling Loop",
        cost: 24000,
        weight: 180,
        reliabilityBonus: 8,
        desc: "High flash-point dielectric fluid with elevated thermal capacity."
      }
    ]
  },
  inverter: {
    subcomponents: [
      {
        id: "gd_optical",
        name: "Fiber-Optic Isolated Gate Driver",
        cost: 14000,
        weight: 25,
        reliabilityBonus: 6,
        efficiencyBonus: 0.004,
        desc: "Immune to high-voltage electromagnetic interference transients."
      },
      {
        id: "gd_dynamic",
        name: "Adaptive Microsecond Intelligent Gate Controller",
        cost: 32000,
        weight: 30,
        reliabilityBonus: 14,
        efficiencyBonus: 0.012,
        desc: "Active switching slope regulation minimizing harmonic losses."
      }
    ],
    modifications: [
      {
        id: "therm_coldplate",
        name: "Micro-Channel Aluminum Liquid Coldplate",
        cost: 16000,
        weight: 65,
        efficiencyBonus: 0.006,
        desc: "Closed-circuit glycol-water cooling directly across semiconductor baseplates."
      },
      {
        id: "therm_phasechange",
        name: "Vapor Chamber Phase-Change Thermal Heatpipe",
        cost: 38000,
        weight: 40,
        efficiencyBonus: 0.015,
        desc: "Two-phase evaporative cooling enabling continuous high peak current."
      }
    ]
  },
  motor: {
    subcomponents: [
      {
        id: "gb_single",
        name: "Single-Stage Helical Reduction Gearbox",
        cost: 16000,
        weight: 380,
        speedBonus: 0,
        desc: "Standard ratio reduction built for regional passenger trainsets."
      },
      {
        id: "mot_stator_polyimide_220",
        name: "Class 220 Polyimide Corona-Resistant Stator Insulation",
        cost: 28000,
        weight: -40,
        speedBonus: 15,
        efficiencyBonus: 0.008,
        desc: "Handles steep SiC high-frequency voltage rise without partial dielectric breakdown."
      },
      {
        id: "mot_rotor_halbach",
        name: "Sintered NdFeB Halbach-Array Magnetic Rotor",
        cost: 52000,
        weight: -80,
        speedBonus: 35,
        efficiencyBonus: 0.018,
        desc: "Pure sinusoidal flux distribution eliminating high-RPM magnetic eddy losses for 320+ km/h."
      }
    ],
    modifications: [
      {
        id: "brg_ceramic",
        name: "Silicon Nitride Hybrid Ceramic Bearings",
        cost: 19000,
        weight: 20,
        reliabilityBonus: 15,
        desc: "Zero electrical fluting erosion and lower frictional heat buildup."
      },
      {
        id: "mot_cool_rotor_oiljet",
        name: "Hollow-Shaft Pressurized Rotor Oil Jet Cooling",
        cost: 26000,
        weight: 25,
        speedBonus: 20,
        reliabilityBonus: 10,
        desc: "Direct oil jet cooling through rotor interior permitting sustained 320+ km/h runs."
      }
    ]
  },
  bogie: {
    subcomponents: [
      {
        id: "susp_coil",
        name: "Steel Coil Spring Primary Suspension",
        cost: 12000,
        weight: 240,
        speedBonus: 0,
        reliabilityBonus: 4,
        desc: "Standard robust mechanical spring assembly with rubber snubbers."
      },
      {
        id: "susp_air",
        name: "Self-Leveling Secondary Air-Spring Suspension",
        cost: 28000,
        weight: 180,
        speedBonus: 20,
        reliabilityBonus: 8,
        desc: "Pneumatic bellows isolating carbody vibrations across variable axle loads."
      },
      {
        id: "susp_active",
        name: "Active Electro-Hydraulic Tilting Dampers",
        cost: 54000,
        weight: 310,
        speedBonus: 45,
        reliabilityBonus: 12,
        desc: "Computerized cant compensation enabling elevated curving speeds."
      }
    ],
    modifications: [
      {
        id: "whl_standard",
        name: "Monobloc Forged Carbon Steel Wheelsets",
        cost: 14000,
        weight: 600,
        reliabilityBonus: 0,
        desc: "Standard wheel discs for routine passenger and freight duties."
      },
      {
        id: "whl_cryo",
        name: "Cryogenic Micro-Alloy Treated Wheelsets",
        cost: 32000,
        weight: 580,
        reliabilityBonus: 16,
        desc: "Treated martensitic steel reducing spalling and thermal cracking."
      }
    ]
  },
  carbody: {
    subcomponents: [
      {
        id: "crash_standard",
        name: "Anti-Climbing Hydraulic End Buffers",
        cost: 15000,
        weight: 320,
        safetyBonus: 5,
        desc: "Basic frontal impact absorbing mechanical buffers."
      },
      {
        id: "crash_crushzone",
        name: "Progressive Deformation Crash Energy Shell",
        cost: 42000,
        weight: 480,
        safetyBonus: 20,
        desc: "Sacrificial aluminum honeycomb cells meeting EN 15227 crashworthiness."
      }
    ],
    modifications: [
      {
        id: "aero_none",
        name: "Standard Flat Bulkhead Fairing",
        cost: 0,
        weight: 0,
        speedBonus: 0,
        desc: "Baseline frontal structure with standard profile."
      },
      {
        id: "aero_nose",
        name: "Longitudinal Micro-Pressure Streamlined Nose Fairing",
        cost: 55000,
        weight: 220,
        speedBonus: 25,
        desc: "Aerodynamic nose fairing reducing aerodynamic resistance and tunnel sonic boom."
      }
    ]
  },
  brakes: {
    subcomponents: [
      {
        id: "cal_cast",
        name: "Cast Nodular Iron Brake Calipers",
        cost: 8000,
        weight: 180,
        safetyBonus: 0,
        desc: "Standard pneumatic clamping calipers for disc brakes."
      },
      {
        id: "cal_monobloc",
        name: "Forged Aluminum Four-Piston Monobloc Calipers",
        cost: 26000,
        weight: 90,
        safetyBonus: 10,
        desc: "High-stiffness lightweight calipers with symmetrical thermal expansion."
      }
    ],
    modifications: [
      {
        id: "disc_iron",
        name: "Ventilated Grey Cast Iron Brake Discs",
        cost: 10000,
        weight: 360,
        safetyBonus: 0,
        desc: "Standard thermal dissipation disc design."
      },
      {
        id: "disc_carbonceramic",
        name: "Carbon-Silicon Carbide Ceramic Brake Discs",
        cost: 46000,
        weight: 140,
        safetyBonus: 18,
        desc: "Fade-free braking capability with extreme heat tolerance up to 1000°C."
      }
    ]
  },
  battery: {
    subcomponents: [
      {
        id: "btherm_passive",
        name: "Forced Air Cooling Channel",
        cost: 4000,
        weight: 40,
        reliabilityBonus: 0,
        desc: "Basic convection fans venting battery enclosure heat."
      },
      {
        id: "btherm_liquid",
        name: "Refrigerant Direct-Plate Thermal Management",
        cost: 22000,
        weight: 110,
        reliabilityBonus: 14,
        desc: "Active heating and liquid chilling maintaining cell temperature at 25°C."
      }
    ],
    modifications: [
      {
        id: "bprot_standard",
        name: "Standard Steel Battery Containment Enclosure",
        cost: 8000,
        weight: 280,
        safetyBonus: 4,
        desc: "Heavy steel enclosure providing baseline impact protection."
      },
      {
        id: "bprot_kevlar",
        name: "Reinforced Titanium and Aramid Ballistic Shield",
        cost: 32000,
        weight: 130,
        safetyBonus: 16,
        desc: "High-tensile shielding preventing puncture from track debris."
      }
    ]
  },
  tcms: {
    subcomponents: [
      {
        id: "bus_wtb",
        name: "Wire Train Bus and Multifunction Vehicle Bus",
        cost: 16000,
        weight: 30,
        reliabilityBonus: 4,
        desc: "Standard IEC 61375 industrial train networking interface."
      },
      {
        id: "bus_etb",
        name: "Redundant Industrial Gigabit Ethernet Train Backbone",
        cost: 36000,
        weight: 20,
        reliabilityBonus: 14,
        desc: "High-bandwidth dual ring network facilitating real-time sensor control."
      }
    ],
    modifications: [
      {
        id: "sens_standard",
        name: "Standard Axle Tachometers and Inductive Pickups",
        cost: 12000,
        weight: 25,
        safetyBonus: 4,
        desc: "Rotational pulse sensors measuring wheel speed and slip."
      },
      {
        id: "sens_radar",
        name: "Dual-Beam Doppler Radar and Inertial Measurement Unit",
        cost: 34000,
        weight: 18,
        safetyBonus: 15,
        desc: "True ground speed verification eliminating slip/slide measurement error."
      }
    ]
  }
};