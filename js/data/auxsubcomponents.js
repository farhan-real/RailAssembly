// Technical Subcomponents and Modifications for Auxiliary & Safety Systems
const AUX_SUBCOMPONENTS_DATA = {
  compressor: {
    subcomponents: [
      {
        id: "dryer_desiccant",
        name: "Dual-Chamber Regenerative Desiccant Air Dryer",
        cost: 8000,
        weight: 45,
        reliabilityBonus: 8,
        desc: "Removes moisture and condensation to prevent freezing of brake valves in winter."
      },
      {
        id: "dryer_membrane",
        name: "Hollow-Fiber Continuous Membrane Dryer",
        cost: 16000,
        weight: 25,
        reliabilityBonus: 14,
        desc: "Zero-maintenance continuous moisture separation with no desiccant bead wear."
      }
    ],
    modifications: [
      {
        id: "comp_softstart",
        name: "Electronic Soft-Start Inverter Drive",
        cost: 9500,
        weight: 15,
        reliabilityBonus: 6,
        desc: "Eliminates high starting current spikes when air compressor motors cycle on."
      }
    ]
  },
  cooling: {
    subcomponents: [
      {
        id: "pump_magnetic",
        name: "Sealless Magnetic Drive Coolant Circulation Pump",
        cost: 14000,
        weight: 35,
        reliabilityBonus: 10,
        desc: "Eliminates mechanical shaft seals, completely preventing coolant fluid leakage."
      }
    ],
    modifications: [
      {
        id: "fan_ec_brushless",
        name: "Variable-Speed Brushless EC Radiator Fans",
        cost: 18000,
        weight: 20,
        efficiencyBonus: 0.005,
        desc: "Modulates radiator fan speed proportionally to coolant temperature, saving auxiliary power."
      }
    ]
  },
  sander: {
    subcomponents: [
      {
        id: "sand_heater",
        name: "Thermo-Electric Sand Nozzle Heaters",
        cost: 6000,
        weight: 15,
        reliabilityBonus: 8,
        desc: "Prevents freezing and clumping of silica sand at temperatures down to -40°C."
      }
    ],
    modifications: [
      {
        id: "sand_metering_flow",
        name: "Speed-Proportional Pulse Air Metering",
        cost: 12000,
        weight: 10,
        adhesionBonus: 0.02,
        desc: "Dispenses precise sand grain volumes matched to ground speed, preventing track fouling."
      }
    ]
  },
  coupler: {
    subcomponents: [
      {
        id: "draft_rubber_elastomer",
        name: "Multi-Pack Elastomer Shock Absorber",
        cost: 11000,
        weight: 90,
        safetyBonus: 6,
        desc: "Absorbs longitudinal coupling buffing impacts between coaches."
      }
    ],
    modifications: [
      {
        id: "gangway_pressurized",
        name: "Acoustic Pressure-Sealed Articulated Gangway",
        cost: 28000,
        weight: 140,
        speedBonus: 10,
        desc: "Smooth exterior bellows reducing aerodynamic drag between passenger carriages."
      }
    ]
  },
  hvac: {
    subcomponents: [
      {
        id: "hvac_co2_sensor",
        name: "Demand-Controlled CO2 Air Freshness Sensors",
        cost: 7000,
        weight: 8,
        efficiencyBonus: 0.004,
        desc: "Modulates outside fresh air intake based on real-time coach passenger occupancy."
      }
    ],
    modifications: [
      {
        id: "hvac_micro_hepa",
        name: "Electrostatic Micro-Particle Air Filtration Array",
        cost: 15000,
        weight: 22,
        reliabilityBonus: 6,
        desc: "Filters pollen, brake dust, and allergens from passenger cabin air supply."
      }
    ]
  },
  safety: {
    subcomponents: [
      {
        id: "surge_metal_oxide",
        name: "Heavy Gapless Zinc-Oxide Surge Arrester",
        cost: 9000,
        weight: 28,
        safetyBonus: 8,
        desc: "Clamps lightning and catenary switching surges before reaching the main transformer."
      }
    ],
    modifications: [
      {
        id: "wsp_radar_speed",
        name: "True Ground Doppler Velocity Radar Feed",
        cost: 22000,
        weight: 12,
        safetyBonus: 12,
        desc: "Provides true ground speed reference to eliminate wheel-lock error during braking."
      }
    ]
  }
};

// Merge into master SUBCOMPONENTS_DATA registry
Object.assign(SUBCOMPONENTS_DATA, AUX_SUBCOMPONENTS_DATA);