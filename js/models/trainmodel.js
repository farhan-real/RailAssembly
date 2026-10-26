// Train Physics, Consist Distribution, and Multi-Carriage Integration Engine
class TrainModelCalc {
  static calculateTrainStats(slots, subSelections = {}, rollingStockType = "locomotive", consistConfig = null) {
    let singleCarMotorWeightKg = 0;
    let singleCarBOMCost = 0;
    let speedBonusTotal = 0;
    let safetyBonusTotal = 0;
    let efficiencyBonusTotal = 0;

    const baseComponents = {};
    for (const catKey in slots) {
      const compId = slots[catKey];
      const comp = state.findComponentById(compId) || COMPONENTS_DATA[catKey][0];
      baseComponents[catKey] = comp;
      singleCarMotorWeightKg += comp.weight || 0;
      singleCarBOMCost += comp.cost || 0;

      const subConfig = subSelections[catKey] || {};
      const subData = SUBCOMPONENTS_DATA[catKey];
      if (subData) {
        if (subConfig.subcomponent && subData.subcomponents) {
          const sub = subData.subcomponents.find(s => s.id === subConfig.subcomponent);
          if (sub) {
            singleCarMotorWeightKg += sub.weight || 0;
            singleCarBOMCost += sub.cost || 0;
            speedBonusTotal += sub.speedBonus || 0;
            safetyBonusTotal += sub.safetyBonus || 0;
            efficiencyBonusTotal += sub.efficiencyBonus || 0;
          }
        }
        if (subConfig.modification && subData.modifications) {
          const mod = subData.modifications.find(m => m.id === subConfig.modification);
          if (mod) {
            singleCarMotorWeightKg += mod.weight || 0;
            singleCarBOMCost += mod.cost || 0;
            speedBonusTotal += mod.speedBonus || 0;
            safetyBonusTotal += mod.safetyBonus || 0;
            efficiencyBonusTotal += mod.efficiencyBonus || 0;
          }
        }
      }
    }

    const { pantograph: panto, transformer: trans, inverter: inv, motor, bogie, carbody: body, brakes, battery, tcms } = baseComponents;

    const isTrainset = rollingStockType === "trainset" && consistConfig && consistConfig.carriages && consistConfig.carriages.length > 0;
    const carriageCount = isTrainset ? consistConfig.carriages.length : 1;
    const poweredCarCount = isTrainset ? consistConfig.carriages.filter(c => c.isPowered).length : 1;
    const trailerCarCount = carriageCount - poweredCarCount;

    // Weight and BOM computation for Consist vs Locomotive
    // Trailer cars omit heavy transformers, inverters, and motors, and save bogie motor mass
    const trailerCarWeightKg = Math.round(
      body.weight + (bogie.weight * 0.65) + brakes.weight + (battery.weight * 0.3) + 3500 // Passenger fitout
    );
    const trailerCarBOMCost = Math.round(
      body.cost + (bogie.cost * 0.55) + brakes.cost + 45000 // Passenger interior fitout
    );

    const totalWeightKg = isTrainset
      ? (poweredCarCount * singleCarMotorWeightKg) + (trailerCarCount * trailerCarWeightKg)
      : singleCarMotorWeightKg;

    const totalBOMCost = isTrainset
      ? (poweredCarCount * singleCarBOMCost) + (trailerCarCount * trailerCarBOMCost)
      : singleCarBOMCost;

    const totalMassTons = Number((totalWeightKg / 1000).toFixed(1));
    const totalAxles = isTrainset ? carriageCount * (bogie.axles || 4) : (bogie.axles || 4);
    const axleLoad = Number((totalMassTons / totalAxles).toFixed(2));
    const axleOverloaded = axleLoad > bogie.maxAxleLoadTons;

    // Distributed Power Delivery
    const singlePackKw = Math.min(motor.powerKw, inv.maxKw, trans.powerRatingKw);
    const availablePowerKw = isTrainset ? (poweredCarCount * singlePackKw) : singlePackKw;
    const horsepower = Math.round(availablePowerKw * 1.341);

    let totalEfficiency = Number((trans.efficiency * inv.efficiency * 0.96 + efficiencyBonusTotal).toFixed(3));
    totalEfficiency = Math.min(0.99, Math.max(0.70, totalEfficiency));

    // Consist Aerodynamics and Drag: Trainset adds skin friction drag per intermediate carriage
    const baseCd = body.dragCd;
    const consistCd = isTrainset ? Number((baseCd + (carriageCount - 1) * 0.035).toFixed(3)) : baseCd;

    let theoreticalSpeed = Math.round(
      Math.pow((availablePowerKw * 1000) / (0.5 * 1.225 * consistCd * 10.5), 1 / 3) * 3.6
    );
    theoreticalSpeed += speedBonusTotal;
    theoreticalSpeed = Math.min(theoreticalSpeed, motor.maxRpmSpeed + speedBonusTotal, bogie.maxSafeSpeed + speedBonusTotal, panto.maxSpeed + speedBonusTotal);

    if (axleOverloaded) {
      theoreticalSpeed = Math.round(theoreticalSpeed * 0.72);
    }

    // Tractive Adhesion Force (kN) - calculated based strictly on motorized adhesive mass
    const adhesiveMassTons = isTrainset
      ? Number(((poweredCarCount * singleCarMotorWeightKg) / 1000).toFixed(1))
      : totalMassTons;

    const adhesionCoeff = bogie.axles === 6 ? 0.38 : 0.32;
    const maxAdhesionKn = Math.round(adhesiveMassTons * 9.81 * adhesionCoeff);

    // Initial Starting Acceleration (m/s²): a = F_adhesion / Total Consist Mass
    const effectiveTractiveForceKn = Math.min(maxAdhesionKn, Math.round(availablePowerKw / 8.2));
    let acceleration = Number((effectiveTractiveForceKn / totalMassTons).toFixed(2));
    acceleration = Math.min(1.30, Math.max(0.18, acceleration));

    // Passenger / Cargo Capacity Rollup
    let passengerCap = 0;
    let cargoCapacityTons = 0;

    if (isTrainset) {
      consistConfig.carriages.forEach(c => {
        if (c.role === "bistro_trailer") passengerCap += Math.round(body.passengerCap * 0.6);
        else if (!c.isPowered) passengerCap += Math.round(body.passengerCap * 1.15); // Trailer cars have more cabin space
        else passengerCap += body.passengerCap;
      });
    } else {
      passengerCap = body.passengerCap;
      cargoCapacityTons = body.cargoCapacityTons;
    }

    const roughSpeedMin = Math.round(theoreticalSpeed * 0.90);
    const roughSpeedMax = Math.round(theoreticalSpeed * 1.08);

    return {
      rollingStockType,
      carriageCount,
      poweredCarCount,
      trailerCarCount,
      totalMassTons,
      axles: totalAxles,
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
      bomCost: totalBOMCost,
      passengerCap,
      cargoCapacityTons,
      batteryRangeKm: battery.rangeKm,
      safetyScore: brakes.safetyIndex + (tcms.reliabilityBonus || 0) + safetyBonusTotal,
      components: baseComponents,
      subSelections: JSON.parse(JSON.stringify(subSelections)),
      consistConfig: consistConfig ? JSON.parse(JSON.stringify(consistConfig)) : null
    };
  }

  static createVariant(name, type, slots, subSelections, consistConfig, marginPercent) {
    const stats = this.calculateTrainStats(slots, subSelections, type, consistConfig);
    const laborAssemblyCost = type === "trainset" ? (stats.carriageCount * 45000) : 140000;
    const unitProductionCost = stats.bomCost + laborAssemblyCost;
    const markupFactor = 1 + (marginPercent / 100);
    const salePrice = Math.round(unitProductionCost * markupFactor);
    const profitPerUnit = salePrice - unitProductionCost;

    return {
      id: "var_" + Date.now().toString(36),
      name: name || "VoltRunner Series",
      type: type || "locomotive",
      slots: { ...slots },
      subSelections: JSON.parse(JSON.stringify(subSelections)),
      consistConfig: consistConfig ? JSON.parse(JSON.stringify(consistConfig)) : null,
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