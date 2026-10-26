// Train Physics, Consist Distribution, and Dynamic Custom Carriage Integration
class TrainModelCalc {
  static calculateTrainStats(slots, subSelections = {}, rollingStockType = "locomotive", consistConfig = null) {
    let motorCarWeightKg = 0;
    let motorCarBOMCost = 0;
    let speedBonusTotal = 0;
    let safetyBonusTotal = 0;
    let efficiencyBonusTotal = 0;

    const baseComponents = {};
    for (const catKey in slots) {
      const comp = state.findComponentById(slots[catKey]) || COMPONENTS_DATA[catKey][0];
      baseComponents[catKey] = comp;
      motorCarWeightKg += comp.weight || 0;
      motorCarBOMCost += comp.cost || 0;

      const subConfig = subSelections[catKey] || {};
      const subData = SUBCOMPONENTS_DATA[catKey];
      if (subData) {
        const sub = subData.subcomponents?.find(s => s.id === subConfig.subcomponent);
        if (sub) {
          motorCarWeightKg += sub.weight || 0;
          motorCarBOMCost += sub.cost || 0;
          speedBonusTotal += sub.speedBonus || 0;
          safetyBonusTotal += sub.safetyBonus || 0;
          efficiencyBonusTotal += sub.efficiencyBonus || 0;
        }
        const mod = subData.modifications?.find(m => m.id === subConfig.modification);
        if (mod) {
          motorCarWeightKg += mod.weight || 0;
          motorCarBOMCost += mod.cost || 0;
          speedBonusTotal += mod.speedBonus || 0;
          safetyBonusTotal += mod.safetyBonus || 0;
          efficiencyBonusTotal += mod.efficiencyBonus || 0;
        }
      }
    }

    const { pantograph: panto, transformer: trans, inverter: inv, motor, bogie, carbody: body, brakes, battery, tcms } = baseComponents;
    const isTrainset = rollingStockType === "trainset" && consistConfig?.carriages?.length > 0;
    const carriageCount = isTrainset ? consistConfig.carriages.length : 1;

    let totalWeightKg = 0;
    let totalBOMCost = 0;
    let poweredCarCount = 0;
    let passengerCap = 0;

    if (isTrainset) {
      consistConfig.carriages.forEach(c => {
        const typeDef = state.findCarriageType(c.typeId);
        const isPow = c.isPowered ?? typeDef.isPowered;
        if (isPow) poweredCarCount += 1;

        const wOffset = typeDef.weightOffset || 0;
        const cOffset = typeDef.costOffset || 0;

        if (isPow) {
          totalWeightKg += (motorCarWeightKg + wOffset);
          totalBOMCost += (motorCarBOMCost + cOffset);
          passengerCap += Math.round(body.passengerCap * (typeDef.seatMultiplier || 1.0));
        } else {
          // Trailer cars save motor, inverter, and heavy transformer equipment
          const trailerWeight = Math.round(body.weight + (bogie.weight * 0.6) + brakes.weight + 3200 + wOffset);
          const trailerCost = Math.round(body.cost + (bogie.cost * 0.5) + brakes.cost + 40000 + cOffset);
          totalWeightKg += trailerWeight;
          totalBOMCost += trailerCost;
          passengerCap += Math.round(body.passengerCap * (typeDef.seatMultiplier || 1.15));
        }
      });
    } else {
      poweredCarCount = 1;
      totalWeightKg = motorCarWeightKg;
      totalBOMCost = motorCarBOMCost;
      passengerCap = body.passengerCap;
    }

    const trailerCarCount = carriageCount - poweredCarCount;
    const totalMassTons = Number((totalWeightKg / 1000).toFixed(1));
    const totalAxles = isTrainset ? carriageCount * (bogie.axles || 4) : (bogie.axles || 4);
    const axleLoad = Number((totalMassTons / totalAxles).toFixed(2));
    const axleOverloaded = axleLoad > bogie.maxAxleLoadTons;

    const singlePackKw = Math.min(motor.powerKw, inv.maxKw, trans.powerRatingKw);
    const availablePowerKw = isTrainset ? (poweredCarCount * singlePackKw) : singlePackKw;
    const horsepower = Math.round(availablePowerKw * 1.341);

    let totalEfficiency = Number((trans.efficiency * inv.efficiency * 0.96 + efficiencyBonusTotal).toFixed(3));
    totalEfficiency = Math.min(0.99, Math.max(0.70, totalEfficiency));

    const baseCd = body.dragCd;
    const consistCd = isTrainset ? Number((baseCd + (carriageCount - 1) * 0.035).toFixed(3)) : baseCd;
    let theoreticalSpeed = Math.round(
      Math.pow((availablePowerKw * 1000) / (0.5 * 1.225 * consistCd * 10.5), 1 / 3) * 3.6
    ) + speedBonusTotal;
    theoreticalSpeed = Math.min(theoreticalSpeed, motor.maxRpmSpeed + speedBonusTotal, bogie.maxSafeSpeed + speedBonusTotal, panto.maxSpeed + speedBonusTotal);
    if (axleOverloaded) theoreticalSpeed = Math.round(theoreticalSpeed * 0.72);

    const adhesiveMassTons = isTrainset ? Number(((poweredCarCount * motorCarWeightKg) / 1000).toFixed(1)) : totalMassTons;
    const adhesionCoeff = bogie.axles === 6 ? 0.38 : 0.32;
    const maxAdhesionKn = Math.round(adhesiveMassTons * 9.81 * adhesionCoeff);

    const effectiveTractiveForceKn = Math.min(maxAdhesionKn, Math.round(availablePowerKw / 8.2));
    let acceleration = Number((effectiveTractiveForceKn / totalMassTons).toFixed(2));
    acceleration = Math.min(1.30, Math.max(0.18, acceleration));

    return {
      rollingStockType, carriageCount, poweredCarCount, trailerCarCount,
      totalMassTons, axles: totalAxles, axleLoad,
      maxAllowedAxleLoad: bogie.maxAxleLoadTons, axleOverloaded,
      availablePowerKw, horsepower, theoreticalSpeed,
      roughSpeedMin: Math.round(theoreticalSpeed * 0.90),
      roughSpeedMax: Math.round(theoreticalSpeed * 1.08),
      totalEfficiency, maxAdhesionKn, acceleration,
      bomCost: totalBOMCost, passengerCap,
      cargoCapacityTons: isTrainset ? 0 : body.cargoCapacityTons,
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
    const salePrice = Math.round(unitProductionCost * (1 + marginPercent / 100));

    return {
      id: "var_" + Date.now().toString(36),
      name: name || "VoltRunner Series",
      type: type || "locomotive",
      slots: { ...slots },
      subSelections: JSON.parse(JSON.stringify(subSelections)),
      consistConfig: consistConfig ? JSON.parse(JSON.stringify(consistConfig)) : null,
      stats, marginPercent, unitProductionCost, salePrice,
      profitPerUnit: salePrice - unitProductionCost,
      certified: false, testedStats: null, unitsProduced: 0
    };
  }

  static certifyVariant(variant) {
    variant.testedStats = {
      exactTopSpeed: variant.stats.theoreticalSpeed,
      exactEfficiency: Math.round(variant.stats.totalEfficiency * 100),
      exactAdhesionKn: variant.stats.maxAdhesionKn,
      certifiedAxleLoad: variant.stats.axleLoad,
      certifiedAcceleration: variant.stats.acceleration,
      certifiedHorsepower: variant.stats.horsepower,
      certifiedDate: state.getDateString()
    };
    variant.certified = true;
  }
}