// Electric-only train component catalog with interdependencies and lead times
const COMPONENTS_DATA = {
  pantograph: [
    {
      id: "panto_std",
      name: "S-100 Single-Arm AC",
      type: "pantograph",
      voltage: "25kV AC",
      maxSpeed: 200,
      weight: 320,
      cost: 45000,
      leadDays: 7,
      supplier: "VanderPant GmbH",
      inHouseTech: null,
      desc: "Standard single-arm collector for standard overhead wire lines."
    },
    {
      id: "panto_dual",
      name: "D-250 Dual-System AC/DC",
      type: "pantograph",
      voltage: "Multi (25kV AC / 3kV DC)",
      maxSpeed: 280,
      weight: 480,
      cost: 85000,
      leadDays: 14,
      supplier: "CatenaryDynamics",
      inHouseTech: "tech_multisystem",
      desc: "Pneumatically actuated collector capable of dual catenary switching."
    },
    {
      id: "panto_hs",
      name: "AeroGlide-380 High Speed",
      type: "pantograph",
      voltage: "25kV AC",
      maxSpeed: 380,
      weight: 290,
      cost: 160000,
      leadDays: 20,
      supplier: "AeroVolt HighSpeed",
      inHouseTech: "tech_aero_pantograph",
      desc: "Ultra-low drag aerodynamic collector for high-speed express corridors."
    }
  ],
  transformer: [
    {
      id: "trans_heavy",
      name: "TX-4000 Heavy Core",
      type: "transformer",
      powerRatingKw: 4200,
      efficiency: 0.92,
      weight: 5800,
      cost: 180000,
      leadDays: 18,
      supplier: "TrafoTech AG",
      inHouseTech: null,
      desc: "Reliable mineral-oil cooled core suited for heavy freight traction."
    },
    {
      id: "trans_compact",
      name: "TC-5500 Underfloor Compact",
      type: "transformer",
      powerRatingKw: 5500,
      efficiency: 0.95,
      weight: 4100,
      cost: 320000,
      leadDays: 24,
      supplier: "Helvetia Electric",
      inHouseTech: "tech_compact_transformer",
      desc: "Slim profile underfloor transformer designed for passenger EMUs."
    },
    {
      id: "trans_solidstate",
      name: "SST-7000 Solid-State Matrix",
      type: "transformer",
      powerRatingKw: 7200,
      efficiency: 0.98,
      weight: 2600,
      cost: 580000,
      leadDays: 32,
      supplier: "QuantumPower Ltd",
      inHouseTech: "tech_solid_state_trans",
      desc: "Cutting-edge high-frequency electronic transformer with minimal mass."
    }
  ],
  inverter: [
    {
      id: "inv_igbt_air",
      name: "INV-300 Air-Cooled IGBT",
      type: "inverter",
      maxKw: 3600,
      efficiency: 0.91,
      weight: 1600,
      cost: 120000,
      leadDays: 10,
      supplier: "StaticPulse Corp",
      inHouseTech: null,
      desc: "Basic 2-level inverter. Inexpensive and low maintenance."
    },
    {
      id: "inv_igbt_liquid",
      name: "INV-6000 Water-Cooled VVVF",
      type: "inverter",
      maxKw: 6000,
      efficiency: 0.95,
      weight: 1950,
      cost: 260000,
      leadDays: 16,
      supplier: "StaticPulse Corp",
      inHouseTech: "tech_advanced_inverters",
      desc: "High-power liquid-cooled variable frequency inverter with smooth torque."
    },
    {
      id: "inv_sic",
      name: "SiC-NexGen 8500 Silicon Carbide",
      type: "inverter",
      maxKw: 8500,
      efficiency: 0.985,
      weight: 1200,
      cost: 510000,
      leadDays: 26,
      supplier: "SemiRail SemiConductor",
      inHouseTech: "tech_sic_power",
      desc: "Next-gen SiC MOSFET converter: extreme efficiency and minimal heat."
    }
  ],
  motor: [
    {
      id: "mot_ind_basic",
      name: "IM-800 3-Phase Induction",
      type: "motor",
      powerKw: 3200,
      maxRpmSpeed: 180,
      weight: 3400,
      cost: 95000,
      leadDays: 12,
      supplier: "Nordic Motors",
      inHouseTech: null,
      desc: "Sturdy asynchronous induction motors. Great durability and low cost."
    },
    {
      id: "mot_ind_highoutput",
      name: "IM-1500 Turbo Induction",
      type: "motor",
      powerKw: 5600,
      maxRpmSpeed: 230,
      weight: 4200,
      cost: 210000,
      leadDays: 18,
      supplier: "Nordic Motors",
      inHouseTech: "tech_high_torque_motors",
      desc: "Heavy-duty copper rotor induction motors for freight and regional."
    },
    {
      id: "mot_pmsm",
      name: "PM-2200 Synchronous Magnet",
      type: "motor",
      powerKw: 7600,
      maxRpmSpeed: 360,
      weight: 2700,
      cost: 440000,
      leadDays: 28,
      supplier: "MagnaDrive Electric",
      inHouseTech: "tech_pmsm_traction",
      desc: "Permanent magnet traction: supreme power density and top speed."
    }
  ],
  bogie: [
    {
      id: "bog_co_co",
      name: "Co-Co Heavy Haul (6 Axles)",
      type: "bogie",
      axles: 6,
      maxAxleLoadTons: 25.0,
      maxSafeSpeed: 140,
      cost: 140000,
      weight: 18000,
      leadDays: 15,
      supplier: "CastIron Works",
      inHouseTech: null,
      desc: "Six high-load axles delivering massive tractive adhesion for freight."
    },
    {
      id: "bog_bo_bo",
      name: "Bo-Bo Express Flexicoil (4 Axles)",
      type: "bogie",
      axles: 4,
      maxAxleLoadTons: 20.0,
      maxSafeSpeed: 220,
      cost: 175000,
      weight: 11000,
      leadDays: 16,
      supplier: "CastIron Works",
      inHouseTech: null,
      desc: "Four-axle standard bogie with air suspension for smooth intercity runs."
    },
    {
      id: "bog_articulated",
      name: "Bo-Bo HighSpeed Radial Steer",
      type: "bogie",
      axles: 4,
      maxAxleLoadTons: 17.5,
      maxSafeSpeed: 350,
      cost: 380000,
      weight: 8500,
      leadDays: 25,
      supplier: "Stadler Dynamics",
      inHouseTech: "tech_radial_bogies",
      desc: "Active radial steering reducing wheel wear and enabling high cant speeds."
    }
  ],
  carbody: [
    {
      id: "body_steel",
      name: "Welded Corrugated Carbon Steel",
      type: "carbody",
      dragCd: 0.52,
      passengerCap: 0,
      cargoCapacityTons: 90,
      weight: 24000,
      cost: 160000,
      leadDays: 14,
      supplier: "Standard Foundry",
      inHouseTech: null,
      desc: "Stiff steel chassis built for locomotives and heavy freight haulage."
    },
    {
      id: "body_aluminum",
      name: "Extruded Aluminum Single-Deck",
      type: "carbody",
      dragCd: 0.34,
      passengerCap: 280,
      cargoCapacityTons: 15,
      weight: 14000,
      cost: 290000,
      leadDays: 20,
      supplier: "AeroAlloy Trainworks",
      inHouseTech: "tech_aluminum_extrusion",
      desc: "Lightweight hollow profile body for passenger multiple-units."
    },
    {
      id: "body_aero_cf",
      name: "Carbon-Composite Bullet Nose",
      type: "carbody",
      dragCd: 0.22,
      passengerCap: 340,
      cargoCapacityTons: 10,
      weight: 10500,
      cost: 650000,
      leadDays: 30,
      supplier: "AeroAlloy Trainworks",
      inHouseTech: "tech_composite_chassis",
      desc: "Micro-pressure wave reducing nose cone for high speed passenger lines."
    }
  ],
  brakes: [
    {
      id: "brk_disc_regen",
      name: "Blended Regen + Pneumatic Disc",
      type: "brakes",
      regenEfficiency: 0.22,
      safetyIndex: 85,
      weight: 2200,
      cost: 60000,
      leadDays: 8,
      supplier: "Bremse Systems",
      inHouseTech: null,
      desc: "Recovers 22% braking energy back into the overhead wire."
    },
    {
      id: "brk_eddy_current",
      name: "Linear Eddy-Current + Ceramic",
      type: "brakes",
      regenEfficiency: 0.35,
      safetyIndex: 98,
      weight: 1800,
      cost: 190000,
      leadDays: 18,
      supplier: "Bremse Systems",
      inHouseTech: "tech_regenerative_grid",
      desc: "Wear-free track electromagnetic braking with high regeneration."
    }
  ],
  battery: [
    {
      id: "bat_none",
      name: "None (Direct Wire Powered Only)",
      type: "battery",
      kwh: 0,
      rangeKm: 0,
      weight: 0,
      cost: 0,
      leadDays: 0,
      supplier: "-",
      inHouseTech: null,
      desc: "Train operates strictly under electrified catenary wire."
    },
    {
      id: "bat_lfp_lastmile",
      name: "350 kWh LFP Last-Mile Shunting Pack",
      type: "battery",
      kwh: 350,
      rangeKm: 35,
      weight: 2900,
      cost: 130000,
      leadDays: 14,
      supplier: "VoltaRail Cells",
      inHouseTech: "tech_battery_traction",
      desc: "Enables shunting onto non-electrified industrial sidings & terminals."
    },
    {
      id: "bat_nmc_intercity",
      name: "1100 kWh High-Energy Density Pack",
      type: "battery",
      kwh: 1100,
      rangeKm: 110,
      weight: 6200,
      cost: 380000,
      leadDays: 24,
      supplier: "VoltaRail Cells",
      inHouseTech: "tech_intercity_battery",
      desc: "Long-range hybrid battery set to bridge non-electrified corridor gaps."
    }
  ],
  tcms: [
    {
      id: "tcms_basic",
      name: "Standard Relay & PLC Microprocessor",
      type: "tcms",
      automationLevel: "Manual / GoA 1",
      reliabilityBonus: 0,
      weight: 350,
      cost: 50000,
      leadDays: 7,
      supplier: "RailLogic Electronics",
      inHouseTech: null,
      desc: "Baseline train control management system with analog failover."
    },
    {
      id: "tcms_etcs2",
      name: "ETCS Baseline 3 Automatic Train Protection",
      type: "tcms",
      automationLevel: "Semi-Auto / GoA 2",
      reliabilityBonus: 12,
      weight: 220,
      cost: 180000,
      leadDays: 15,
      supplier: "RailLogic Electronics",
      inHouseTech: "tech_etcs_automation",
      desc: "European Train Control Level 2 with cab signaling and automatic stops."
    },
    {
      id: "tcms_cbtc_ai",
      name: "Autonomous ATO Driverless Neural TCMS",
      type: "tcms",
      automationLevel: "Fully Driverless / GoA 4",
      reliabilityBonus: 25,
      weight: 180,
      cost: 390000,
      leadDays: 24,
      supplier: "CyberTransit Systems",
      inHouseTech: "tech_driverless_ato",
      desc: "Driverless automation maximizing adhesion control and energy timing."
    }
  ]
};