// Subcomponents and Modifications for Circuit Breakers, DC Links, and Transmissions
const POWERTRAIN_SUBCOMPONENTS_DATA = {
  circuitbreaker: {
    subcomponents: [
      {
        id: "vcb_bottle_cucr",
        name: "Copper-Chromium Axial Magnetic Contact Bottle",
        cost: 8500,
        weight: 18,
        reliabilityBonus: 8,
        desc: "Diffuses electrical arcs evenly across contact surfaces, extending vacuum interrupter lifespan."
      }
    ],
    modifications: [
      {
        id: "vcb_sensor_trip",
        name: "Electronic Rogowski Coil Overcurrent Trip Sensor",
        cost: 11000,
        weight: 8,
        safetyBonus: 10,
        desc: "Instantaneous microsecond short-circuit detection triggering the primary trip coil."
      }
    ]
  },
  dclink: {
    subcomponents: [
      {
        id: "dclink_precharge_contactor",
        name: "Solid-State Soft-Start Inrush Pre-Charge Resistor",
        cost: 7500,
        weight: 22,
        reliabilityBonus: 8,
        desc: "Limits peak charging inrush current to protect capacitors when the main circuit breaker closes."
      }
    ],
    modifications: [
      {
        id: "dclink_crowbar_dump",
        name: "High-Speed Dynamic Discharge Crowbar Module",
        cost: 14000,
        weight: 16,
        safetyBonus: 12,
        desc: "Discharges 1800V DC intermediate link down to safe touch voltage in under 2 seconds during emergency stops."
      }
    ]
  },
  transmission: {
    subcomponents: [
      {
        id: "transm_teeth_carburized",
        name: "Deep Case-Carburized Ground Gear Teeth Profile",
        cost: 12500,
        weight: 35,
        reliabilityBonus: 12,
        desc: "High surface hardness preventing pitting under continuous heavy freight torque."
      }
    ],
    modifications: [
      {
        id: "transm_oil_mist_pressurized",
        name: "Pressurized Oil Spray Jet Continuous Lubrication",
        cost: 16000,
        weight: 18,
        efficiencyBonus: 0.006,
        desc: "Maintains optimal lubricating oil wedge at gear meshes even at rotational speeds above 4200 RPM."
      }
    ]
  }
};

// Merge into master SUBCOMPONENTS_DATA registry
Object.assign(SUBCOMPONENTS_DATA, POWERTRAIN_SUBCOMPONENTS_DATA);