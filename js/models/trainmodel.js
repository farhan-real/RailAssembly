// Train Physics, Integration Rules, and Testing Certification Logic
class TrainModelCalc {
  static calculateTrainStats(slots) {
    const panto = state.findComponentById(slots.pantograph) || COMPONENTS_DATA.pantograph[0];
    const trans = state.findComponentById(slots.transformer) || COMPONENTS_DATA.transformer[0];
    const inv = state.findComponentById(slots.inverter) || COMPONENTS_DATA.inverter[0];
    const motor = state.findComponentById(slots.motor) || COMPONENTS_DATA.motor[0];
    const bogie = state.findComponentById(slots.bogie) || COMPONENTS_DATA.bogie[0];
    const body = state.findComponentById(slots.carbody) || COMPONENTS_DATA.carbody[0];
    const brakes = state.findComponentById(slots.brakes) || COMPONENTS_DATA.brakes[0];
    const battery = state.findComponentById(slots.battery) || COMPONENTS_DATA.battery[0];
    const tcms = state.findComponentById(slots.tcms) || COMPONENTS_DATA.tcms[0];

    // Total Tare Weight in Metric Tons
    const totalWeightKg = (
      panto.weight + trans.weight + inv.weight +
      motor.weight + bogie.weight + body.weight +
      brakes.weight + battery.weight + tcms.weight
    );
    const totalMassTons = Number((totalWeightKg / 1000).toFixed(1));

    // Axle Load Constraint Verification
    const axles = bogie.axles || 4;
    const axleLoad = Number((totalMassTons / axles).toFixed(2));
    const axleOverloaded = axleLoad > bogie.maxAxleLoadTons;

    // Power Delivery Bottleneck Rule
    // Traction cannot exceed inverter maxKw, nor transformer primary power
    const availablePowerKw = Math.min(motor.powerKw, inv.maxKw, trans.powerRatingKw);
    const totalEfficiency = Number((trans.efficiency * inv.efficiency * 0.96).toFixed(3));

    // Aerodynamic Drag & Speed Calculation
    // P = F * v + 0.5 * rho * Cd * A * v^3
    const aeroCd = body.dragCd;
    let theoreticalSpeed = Math.round(
      Math.pow((availablePowerKw * 1000) / (0.5 * 1.225 * aeroCd * 10.5), 1 / 3) * 3.6
    );
    theoreticalSpeed = Math.min(theoreticalSpeed, motor.maxRpmSpeed, bogie.maxSafeSpeed, panto.maxSpeed);

    if (axleOverloaded) {
      theoreticalSpeed = Math.round(theoreticalSpeed * 0.72); // Heavy penalty for track safety overload
    }

    // Tractive Effort (kN) calculation based on axle adhesion
    const adhesionCoefficient = bogie.axles === 6 ? 0.38 : 0.31;
    const maxAdhesionKn = Math.round(totalMassTons * 9.81 * adhesionCoefficient);

    // Bill of Materials (BOM) Total Cost
    const bomCost = (
      panto.cost + trans.cost + inv.cost + motor.cost +
      bogie.cost + body.cost + brakes.cost + battery.cost + tcms.cost
    );

    // Rough Estimates vs Certified
    const roughSpeedMin = Math.round(theoreticalSpeed * 0.90);
    const roughSpeedMax = Math.round(theoreticalSpeed * 1.08);
    const roughEffMin = Math.round(totalEfficiency * 88);
    const roughEffMax = Math.round(totalEfficiency * 102);

    return {
      totalMassTons,
      axles,
      axleLoad,
      maxAllowedAxleLoad: bogie.maxAxleLoadTons,
      axleOverloaded,
      availablePowerKw,
      theoreticalSpeed,
      roughSpeedMin,
      roughSpeedMax,
      totalEfficiency,
      roughEffMin,
      roughEffMax,
      maxAdhesionKn,
      bomCost,
      passengerCap: body.passengerCap,
      cargoCapacityTons: body.cargoCapacityTons,
      batteryRangeKm: battery.rangeKm,
      safetyScore: brakes.safetyIndex + (tcms.reliabilityBonus || 0),
      components: { panto, trans, inv, motor, bogie, body, brakes, battery, tcms }
    };
  }

  static createVariant(name, type, slots, marginPercent) {
    const stats = this.calculateTrainStats(slots);
    const laborAssemblyCost = 140000;
    const unitProductionCost = stats.bomCost + laborAssemblyCost;
    const markupFactor = 1 + (marginPercent / 100);
    const salePrice = Math.round(unitProductionCost * markupFactor);
    const profitPerUnit = salePrice - unitProductionCost;

    return {
      id: "var_" + Date.now().toString(36),
      name: name || "VoltRunner Express",
      type: type || "locomotive", // "locomotive" or "trainset"
      slots: { ...slots },
      stats,
      marginPercent,
      unitProductionCost,
      salePrice,
      profitPerUnit,
      certified: false, // Testing track required for true stats
      testedStats: null,
      unitsProduced: 0
    };
  }

  static certifyVariant(variant) {
    const trueSpeed = variant.stats.theoreticalSpeed;
    const trueEff = Math.round(variant.stats.totalEfficiency * 100);
    variant.testedStats = {
      exactTopSpeed: trueSpeed,
      exactEfficiency: trueEff,
      exactAdhesionKn: variant.stats.maxAdhesionKn,
      certifiedAxleLoad: variant.stats.axleLoad,
      certifiedDate: state.getDateString()
    };
    variant.certified = true;
  }
}