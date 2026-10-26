// Train Physics, Engineering Integration, and Subcomponent Calculation Engine
class TrainModelCalc {
  static calculateTrainStats(slots, subSelections = {}) {
    let totalWeightKg = 0;
    let bomCost = 0;
    let speedBonusTotal = 0;
    let safetyBonusTotal = 0;
    let efficiencyBonusTotal = 0;

    const baseComponents = {};
    for (const catKey in slots) {
      const compId = slots[catKey];
      const comp = state.findComponentById(compId) || COMPONENTS_DATA[catKey][0];
      baseComponents[catKey] = comp;
      totalWeightKg += comp.weight || 0;
      bomCost += comp.cost || 0;

      const subConfig = subSelections[catKey] || {};
      const subData = SUBCOMPONENTS_DATA[catKey];
      if (subData) {
        if (subConfig.subcomponent && subData.subcomponents) {
          const sub = subData.subcomponents.find(s => s.id === subConfig.subcomponent);
          if (sub) {
            totalWeightKg += sub.weight || 0;
            bomCost += sub.cost || 0;
            speedBonusTotal += sub.speedBonus || 0;
            safetyBonusTotal += sub.safetyBonus || 0;
            efficiencyBonusTotal += sub.efficiencyBonus || 0;
          }
        }
        if (subConfig.modification && subData.modifications) {
          const mod = subData.modifications.find(m => m.id === subConfig.modification);
          if (mod) {
            totalWeightKg += mod.weight || 0;
            bomCost += mod.cost || 0;
            speedBonusTotal += mod.speedBonus || 0;
            safetyBonusTotal += mod.safetyBonus || 0;
            efficiencyBonusTotal += mod.efficiencyBonus || 0;
          }
        }
      }
    }

    const { pantograph: panto, transformer: trans, inverter: inv, motor, bogie, carbody: body, brakes, battery, tcms } = baseComponents;

    const totalMassTons = Number((totalWeightKg / 1000).toFixed(1));
    const axles = bogie.axles || 4;
    const axleLoad = Number((totalMassTons / axles).toFixed(2));
    const axleOverloaded = axleLoad > bogie.maxAxleLoadTons;

    // Power Delivery Bottleneck Rule
    const availablePowerKw = Math.min(motor.powerKw, inv.maxKw, trans.powerRatingKw);
    const horsepower = Math.round(availablePowerKw * 1.341);
    let totalEfficiency = Number((trans.efficiency * inv.efficiency * 0.96 + efficiencyBonusTotal).toFixed(3));
    totalEfficiency = Math.min(0.99, Math.max(0.70, totalEfficiency));

    // Aerodynamic Drag and Speed
    const aeroCd = body.dragCd;
    let theoreticalSpeed = Math.round(
      Math.pow((availablePowerKw * 1000) / (0.5 * 1.225 * aeroCd * 10.5), 1 / 3) * 3.6
    );
    theoreticalSpeed += speedBonusTotal;
    theoreticalSpeed = Math.min(theoreticalSpeed, motor.maxRpmSpeed + speedBonusTotal, bogie.maxSafeSpeed + speedBonusTotal, panto.maxSpeed + speedBonusTotal);

    if (axleOverloaded) {
      theoreticalSpeed = Math.round(theoreticalSpeed * 0.72);
    }

    // Tractive Adhesion Force (kN)
    const adhesionCoefficient = bogie.axles === 6 ? 0.38 : 0.31;
    const maxAdhesionKn = Math.round(totalMassTons * 9.81 * adhesionCoefficient);

    // Initial Starting Acceleration (m/s²)
    // a = F / m where F is effective tractive force and m is total mass
    const effectiveTractiveForceKn = Math.min(maxAdhesionKn, Math.round(availablePowerKw / 8.2));
    let acceleration = Number((effectiveTractiveForceKn / totalMassTons).toFixed(2));
    acceleration = Math.min(1.25, Math.max(0.20, acceleration));

    // Rough Estimates vs Certified Benchmarks
    const roughSpeedMin = Math.round(theoreticalSpeed * 0.90);
    const roughSpeedMax = Math.round(theoreticalSpeed * 1.08);

    return {
      totalMassTons,
      axles,
      axleLoad,
      maxAllowedAxleLoad: bogie.maxAxleLoadTons,
      axleOverloaded,
      availablePowerKw,
      horsepower,
      theoreticalSpeed,
      roughSpeedMin,
      roughSpeedMax,
      totalEfficiency,
      maxAdhesionKn,
      acceleration,
      bomCost,
      passengerCap: body.passengerCap,
      cargoCapacityTons: body.cargoCapacityTons,
      batteryRangeKm: battery.rangeKm,
      safetyScore: brakes.safetyIndex + (tcms.reliabilityBonus || 0) + safetyBonusTotal,
      components: baseComponents,
      subSelections: JSON.parse(JSON.stringify(subSelections))
    };
  }

  static createVariant(name, type, slots, subSelections, marginPercent) {
    const stats = this.calculateTrainStats(slots, subSelections);
    const laborAssemblyCost = 140000;
    const unitProductionCost = stats.bomCost + laborAssemblyCost;
    const markupFactor = 1 + (marginPercent / 100);
    const salePrice = Math.round(unitProductionCost * markupFactor);
    const profitPerUnit = salePrice - unitProductionCost;

    return {
      id: "var_" + Date.now().toString(36),
      name: name || "VoltRunner Electric Series",
      type: type || "locomotive",
      slots: { ...slots },
      subSelections: JSON.parse(JSON.stringify(subSelections)),
      stats,
      marginPercent,
      unitProductionCost,
      salePrice,
      profitPerUnit,
      certified: false,
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
      certifiedAcceleration: variant.stats.acceleration,
      certifiedHorsepower: variant.stats.horsepower,
      certifiedDate: state.getDateString()
    };
    variant.certified = true;
  }
}