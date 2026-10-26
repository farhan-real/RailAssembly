// Auxiliary, Pneumatics, Cooling, Adhesion, Couplers, HVAC, and Safety Systems
const AUXILIARY_SYSTEMS_DATA = {
  compressor: [
    {
      id: "comp_piston_basic",
      name: "Reciprocating Piston Main Air Compressor",
      type: "compressor",
      airflowLpm: 900,
      pressureBar: 10,
      weight: 310,
      cost: 26000,
      leadDays: 7,
      supplier: "Knorr Air Dynamics",
      inHouseTech: null,
      desc: "Baseline pneumatic supply for brake pipe charging and pantograph elevation. Capacity: 900 L/min."
    },
    {
      id: "comp_screw_rotary",
      name: "Oil-Free Rotary Screw Compressor Unit",
      type: "compressor",
      airflowLpm: 1950,
      pressureBar: 12,
      weight: 440,
      cost: 52000,
      leadDays: 12,
      supplier: "Knorr Air Dynamics",
      inHouseTech: null,
      desc: "High-volume quiet rotary screw pump with integrated air-dryer. Capacity: 1950 L/min."
    },
    {
      id: "comp_dual_redundant",
      name: "Dual-Channel High-Volume Pneumatics Module",
      type: "compressor",
      airflowLpm: 3400,
      pressureBar: 12,
      weight: 690,
      cost: 92000,
      leadDays: 18,
      supplier: "Knorr Air Dynamics",
      inHouseTech: "tech_advanced_inverters",
      desc: "Dual independent screw compressors designed for rapid charging of long 10+ carriage trainsets."
    }
  ],
  cooling: [
    {
      id: "cool_forced_air",
      name: "Forced-Air Dual Blower Cooling System",
      type: "cooling",
      thermalDissipationKw: 3500,
      parasiticLoadKw: 25,
      weight: 380,
      cost: 24000,
      leadDays: 8,
      supplier: "ThermalDynamics GmbH",
      inHouseTech: null,
      desc: "Lightweight forced air blowers. Zero liquid coolant; throttles under sustained 4000+ kW loads."
    },
    {
      id: "cool_oil_radiator",
      name: "Pumped Mineral-Oil Heat Exchanger Loop",
      type: "cooling",
      thermalDissipationKw: 6200,
      parasiticLoadKw: 45,
      weight: 790,
      cost: 58000,
      leadDays: 14,
      supplier: "ThermalDynamics GmbH",
      inHouseTech: null,
      desc: "Closed-loop oil circulation radiator maintaining continuous full-power transformer duty."
    },
    {
      id: "cool_glycol_chiller",
      name: "Dual-Circuit Water-Glycol Chiller Loop",
      type: "cooling",
      thermalDissipationKw: 9200,
      parasiticLoadKw: 65,
      weight: 940,
      cost: 110000,
      leadDays: 22,
      supplier: "ThermalDynamics GmbH",
      inHouseTech: "tech_sic_power",
      desc: "High-efficiency liquid chiller extracting heat from both high-frequency SiC inverters and traction motors."
    }
  ],
  sander: [
    {
      id: "sand_none",
      name: "None (Direct Unassisted Rail Contact)",
      type: "sander",
      isOptional: true,
      adhesionBonus: 0.0,
      weight: 0,
      cost: 0,
      leadDays: 0,
      supplier: "Internal Standard",
      inHouseTech: null,
      desc: "No rail adhesion conditioning. Standard dry rail adhesion coefficient applied."
    },
    {
      id: "sand_gravity_basic",
      name: "Pneumatic Directional Sand Discharge System",
      type: "sander",
      isOptional: true,
      adhesionBonus: 0.05,
      weight: 220,
      cost: 21000,
      leadDays: 6,
      supplier: "GripMaster Rail Systems",
      inHouseTech: null,
      desc: "Pneumatic nozzles blasting silica sand onto railheads. Increases adhesion by +0.05."
    },
    {
      id: "sand_plasma_cleaner",
      name: "High-Velocity Laser-Plasma Rail Head Conditioners",
      type: "sander",
      isOptional: true,
      adhesionBonus: 0.11,
      weight: 280,
      cost: 78000,
      leadDays: 16,
      supplier: "GripMaster Rail Systems",
      inHouseTech: "tech_driverless_ato",
      desc: "Vaporizes organic leaf grease and ice directly before wheelsets. Increases adhesion by +0.11."
    }
  ],
  coupler: [
    {
      id: "coup_scharf_commuter",
      name: "Automatic Scharfenberg Type 10 Coupler",
      type: "coupler",
      tensileLoadLimitTons: 1200,
      weight: 420,
      cost: 38000,
      leadDays: 10,
      supplier: "Voith Coupling Technologies",
      inHouseTech: null,
      desc: "Automatic coupler integrating air pipes and electrical head. Max tensile haul limit: 1200 Tons."
    },
    {
      id: "coup_tightlock_h",
      name: "Type H Tightlock Anti-Climbing Coupler",
      type: "coupler",
      tensileLoadLimitTons: 2200,
      weight: 640,
      cost: 54000,
      leadDays: 14,
      supplier: "Voith Coupling Technologies",
      inHouseTech: null,
      desc: "Rigid interlocking passenger coupler preventing telescoping during derailments. Limit: 2200 Tons."
    },
    {
      id: "coup_heavy_aar",
      name: "Heavy-Haul Friction Draft Gear AAR Coupler",
      type: "coupler",
      tensileLoadLimitTons: 6500,
      weight: 1180,
      cost: 72000,
      leadDays: 16,
      supplier: "Standard Industrial Foundry",
      inHouseTech: null,
      desc: "Massive forged cast steel knuckle coupler for long heavy mineral freight consists up to 6500 Tons."
    },
    {
      id: "coup_aero_retractable",
      name: "Retractable Aerodynamic High-Speed Nose Coupler",
      type: "coupler",
      tensileLoadLimitTons: 1500,
      weight: 560,
      cost: 125000,
      leadDays: 24,
      supplier: "AeroAlloy Trainworks",
      inHouseTech: "tech_composite_chassis",
      desc: "Concealed behind motorized nose fairing doors for 350+ km/h aerodynamic efficiency."
    }
  ],
  hvac: [
    {
      id: "hvac_none",
      name: "None (Locomotive Cab Only / Industrial Ducting)",
      type: "hvac",
      isOptional: true,
      hotelPowerKw: 0,
      weight: 0,
      cost: 0,
      leadDays: 0,
      supplier: "Internal Standard",
      inHouseTech: null,
      desc: "No passenger climate control. Appropriate for freight locomotives and utility equipment."
    },
    {
      id: "hvac_standard_pack",
      name: "Roof-Mounted Modular Heat-Pump Climate Pack",
      type: "hvac",
      isOptional: true,
      hotelPowerKw: 45,
      weight: 560,
      cost: 46000,
      leadDays: 10,
      supplier: "AeroClima Transit",
      inHouseTech: null,
      desc: "Provides modulated heating and cooling for passenger coaches. Hotel load: 45 kW per unit."
    },
    {
      id: "hvac_pressurized_hs",
      name: "Pressure-Sealed High-Speed HVAC Module",
      type: "hvac",
      isOptional: true,
      hotelPowerKw: 65,
      weight: 840,
      cost: 96000,
      leadDays: 18,
      supplier: "AeroClima Transit",
      inHouseTech: "tech_aluminum_extrusion",
      desc: "Fast-acting pressure-wave protection valves preventing ear discomfort in high-speed tunnels."
    }
  ],
  safety: [
    {
      id: "wsp_basic",
      name: "Pneumatic Mechanical Anti-Skid Valves",
      type: "safety",
      safetyScoreBonus: 4,
      weight: 110,
      cost: 22000,
      leadDays: 7,
      supplier: "Bremse Systems International",
      inHouseTech: null,
      desc: "Standard differential wheel deceleration sensing to prevent flat spots on wheel treads."
    },
    {
      id: "wsp_microprocessor",
      name: "Multi-Channel Microprocessor Wheel Slide Protection",
      type: "safety",
      safetyScoreBonus: 10,
      weight: 80,
      cost: 48000,
      leadDays: 14,
      supplier: "Bremse Systems International",
      inHouseTech: "tech_etcs_automation",
      desc: "Independent axle wheel speed regulation shortening emergency braking distances on wet tracks."
    },
    {
      id: "wsp_integrated_surge",
      name: "Integrated High-Speed WSP with Metal-Oxide Surge Diverter",
      type: "safety",
      safetyScoreBonus: 18,
      weight: 125,
      cost: 88000,
      leadDays: 20,
      supplier: "Bremse Systems International",
      inHouseTech: "tech_driverless_ato",
      desc: "Combines Doppler radar slip compensation with 25kV roof surge arresters protecting all electronics."
    }
  ]
};

// Merge all systems into master COMPONENTS_DATA registry
Object.assign(COMPONENTS_DATA, AUXILIARY_SYSTEMS_DATA);