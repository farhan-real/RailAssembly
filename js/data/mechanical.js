// Mechanical, Structural, Braking, and Optional Subsystems
const MECHANICAL_COMPONENTS_DATA = {
  bogie: [
    {
      id: "bog_tram_light",
      name: "Two-Axle Lightweight Articulated Bogie",
      type: "bogie",
      axles: 2,
      maxAxleLoadTons: 14.0,
      maxSafeSpeed: 120,
      cost: 85000,
      weight: 5200,
      leadDays: 10,
      supplier: "CastIron Engineering Works",
      inHouseTech: null,
      desc: "Low axle-load bogie designed for regional light-rail sets. Speed limit: 120 km/h."
    },
    {
      id: "bog_bo_bo",
      name: "Four-Axle Express Flexicoil Bogie Assembly",
      type: "bogie",
      axles: 4,
      maxAxleLoadTons: 20.0,
      maxSafeSpeed: 220,
      cost: 175000,
      weight: 11000,
      leadDays: 16,
      supplier: "CastIron Engineering Works",
      inHouseTech: null,
      desc: "Secondary air-suspension bogie for smooth passenger rides. Speed limit: 220 km/h."
    },
    {
      id: "bog_co_co",
      name: "Six-Axle Heavy Haul Bogie Assembly",
      type: "bogie",
      axles: 6,
      maxAxleLoadTons: 25.0,
      maxSafeSpeed: 140,
      cost: 140000,
      weight: 18000,
      leadDays: 15,
      supplier: "CastIron Engineering Works",
      inHouseTech: null,
      desc: "Six heavy axles delivering immense tractive adhesion for freight. Speed limit: 140 km/h."
    },
    {
      id: "bog_radial_320",
      name: "Active Radial High-Speed Bogie (320 km/h)",
      type: "bogie",
      axles: 4,
      maxAxleLoadTons: 18.0,
      maxSafeSpeed: 320,
      cost: 340000,
      weight: 9200,
      leadDays: 22,
      supplier: "Stadler Dynamics AG",
      inHouseTech: "tech_radial_bogies",
      desc: "Self-steering radial axles reducing wheel-rail friction at 320 km/h."
    },
    {
      id: "bog_articulated_360",
      name: "Hydraulic Active-Cant Tilting Bogie (360 km/h)",
      type: "bogie",
      axles: 4,
      maxAxleLoadTons: 17.0,
      maxSafeSpeed: 360,
      cost: 440000,
      weight: 8600,
      leadDays: 26,
      supplier: "Stadler Dynamics AG",
      inHouseTech: "tech_active_tilting",
      desc: "Active body tilting compensation allowing high curving speeds up to 360 km/h."
    },
    {
      id: "bog_highspeed_400",
      name: "Carbon-Composite Articulated Bogie (420 km/h)",
      type: "bogie",
      axles: 4,
      maxAxleLoadTons: 15.5,
      maxSafeSpeed: 420,
      cost: 580000,
      weight: 7400,
      leadDays: 32,
      supplier: "Stadler Dynamics AG",
      inHouseTech: "tech_active_tilting",
      desc: "Ultra-low unsprung mass composite frame certified for speeds exceeding 400 km/h."
    }
  ],
  carbody: [
    {
      id: "body_steel",
      name: "Welded Structural Steel Monocoque Carbody",
      type: "carbody",
      dragCd: 0.52,
      passengerCap: 0,
      cargoCapacityTons: 90,
      weight: 24000,
      cost: 160000,
      leadDays: 14,
      supplier: "Standard Industrial Foundry",
      inHouseTech: null,
      desc: "Heavy carbon-steel chassis for locomotives and heavy haulage routes."
    },
    {
      id: "body_aluminum",
      name: "Hollow Extruded Aluminum Carbody Shell",
      type: "carbody",
      dragCd: 0.34,
      passengerCap: 280,
      cargoCapacityTons: 15,
      weight: 14000,
      cost: 290000,
      leadDays: 20,
      supplier: "AeroAlloy Trainworks",
      inHouseTech: "tech_aluminum_extrusion",
      desc: "Lightweight extruded aluminum profile built for passenger multiple units."
    },
    {
      id: "body_aero_cf",
      name: "Carbon-Fiber Composite Aerodynamic Body (300 km/h)",
      type: "carbody",
      dragCd: 0.22,
      passengerCap: 340,
      cargoCapacityTons: 10,
      weight: 10500,
      cost: 650000,
      leadDays: 30,
      supplier: "AeroAlloy Trainworks",
      inHouseTech: "tech_composite_chassis",
      desc: "Streamlined low-drag aerodynamic profile designed for express trains up to 300 km/h."
    },
    {
      id: "body_bullet_360",
      name: "Dual-Taper Shinkansen Aerodynamic Nose (360 km/h)",
      type: "carbody",
      dragCd: 0.18,
      passengerCap: 320,
      cargoCapacityTons: 8,
      weight: 9800,
      cost: 780000,
      leadDays: 34,
      supplier: "AeroAlloy Trainworks",
      inHouseTech: "tech_streamlined_nose_320",
      desc: "Extended long-nose aerodynamic fairing eliminating tunnel sonic booms at 360 km/h."
    },
    {
      id: "body_hyper_400",
      name: "Boundary-Layer Supersonic Wave Shell (420 km/h)",
      type: "carbody",
      dragCd: 0.14,
      passengerCap: 290,
      cargoCapacityTons: 5,
      weight: 8900,
      cost: 960000,
      leadDays: 38,
      supplier: "AeroAlloy Trainworks",
      inHouseTech: "tech_ultra_aero_400",
      desc: "Ultra-low drag coefficient shell (Cd 0.14) engineered for 400+ km/h express service."
    }
  ],
  brakes: [
    {
      id: "brk_disc_regen",
      name: "Blended Regenerative and Pneumatic Disc Brakes",
      type: "brakes",
      regenEfficiency: 0.22,
      safetyIndex: 85,
      weight: 2200,
      cost: 60000,
      leadDays: 8,
      supplier: "Bremse Systems International",
      inHouseTech: null,
      desc: "Recovers electrical kinetic energy to the catenary while maintaining fail-safe mechanical discs."
    },
    {
      id: "brk_eddy_current",
      name: "Linear Track Eddy-Current & Ceramic Brakes (350+ km/h)",
      type: "brakes",
      regenEfficiency: 0.35,
      safetyIndex: 98,
      weight: 1800,
      cost: 190000,
      leadDays: 18,
      supplier: "Bremse Systems International",
      inHouseTech: "tech_radial_bogies",
      desc: "Wear-free electromagnetic rail brake providing high deceleration rates above 320 km/h."
    }
  ],
  battery: [
    {
      id: "bat_none",
      name: "None (Continuous Wire Power Only)",
      type: "battery",
      isOptional: true,
      kwh: 0,
      rangeKm: 0,
      weight: 0,
      cost: 0,
      leadDays: 0,
      supplier: "Direct Wire Configuration",
      inHouseTech: null,
      desc: "No onboard traction energy storage. Unit operates strictly under catenary."
    },
    {
      id: "bat_lfp_lastmile",
      name: "Lithium Iron Phosphate Auxiliary Traction Pack",
      type: "battery",
      isOptional: true,
      kwh: 350,
      rangeKm: 35,
      weight: 2900,
      cost: 130000,
      leadDays: 14,
      supplier: "VoltaRail Storage Systems",
      inHouseTech: "tech_battery_traction",
      desc: "Provides self-propelled last-mile shunting across non-electrified sidings."
    },
    {
      id: "bat_nmc_intercity",
      name: "High-Capacity Traction Energy Storage System",
      type: "battery",
      isOptional: true,
      kwh: 1100,
      rangeKm: 110,
      weight: 6200,
      cost: 380000,
      leadDays: 24,
      supplier: "VoltaRail Storage Systems",
      inHouseTech: "tech_driverless_ato",
      desc: "High-energy density module designed to span non-electrified gaps on branch lines."
    }
  ],
  resistor: [
    {
      id: "res_none",
      name: "None (Regenerative Line Feed Only)",
      type: "resistor",
      isOptional: true,
      weight: 0,
      cost: 0,
      leadDays: 0,
      supplier: "Direct Wire Configuration",
      inHouseTech: null,
      desc: "Braking energy is returned to catenary. If the grid is non-receptive, mechanical brakes engage."
    },
    {
      id: "res_dynamic_roof",
      name: "Roof-Mounted Dynamic Braking Resistor Grid",
      type: "resistor",
      isOptional: true,
      weight: 650,
      cost: 42000,
      leadDays: 9,
      supplier: "StaticPulse Power Systems",
      inHouseTech: null,
      desc: "Safely dissipates 2500 kW of braking energy into thermal heat when descending mountain grades."
    }
  ],
  tcms: [
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
      inHouseTech: null,
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
      inHouseTech: "tech_etcs_automation",
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
      inHouseTech: "tech_driverless_ato",
      desc: "Full automated train operation with neural adhesion control and coasting optimization."
    }
  ]
};

// Merge into universal registry
Object.assign(COMPONENTS_DATA, MECHANICAL_COMPONENTS_DATA);