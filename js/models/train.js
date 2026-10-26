// Train Physics, Consist Distribution, and Dynamic Multi-System Integration Engine
class TrainModelCalc {
  static calculateTrainStats(slots, subSelections = {}, rollingStockType = "locomotive", consistConfig = null) {
    let motorCarWeightKg = 0;
    let motorCarBOMCost = 0;
    let speedBonusTotal = 0;
    let safetyBonusTotal = 0;
    let efficiencyBonusTotal = 0;
    let extraAdhesionBonus = 0;

    const baseComponents = {};
    for (const catKey in slots) {
      const compId = slots[catKey];
      if (!compId || compId.endsWith("_none")) {
        baseComponents[catKey] = COMPONENTS_DATA[catKey]?.find(c => c.id === compId) || { weight: 0, cost: 0, powerRatingKw: 9999, maxKw: 9999, efficiency: 1.0 };
        continue;
      }
      const comp = state.findComponentById(compId) || COMPONENTS_DATA[catKey]?.[0] || { weight: 0, cost: 0 };
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
          extraAdhesionBonus += mod.adhesionBonus || 0;
        }
      }
    }

    const { pantograph: panto, bogie, carbody: body, brakes, battery, tcms, sander, hvac, transmission, pwm } = baseComponents;
    const isTrainset = rollingStockType === "trainset" && consistConfig?.carriages?.length > 0;
    const carriageCount = isTrainset ? consistConfig.carriages.length : 1;

    let totalWeightKg = 0;
    let totalBOMCost = 0;
    let poweredCarCount = 0;
    let passengerCap = 0;

    if (isTrainset) {
      consistConfig.carriages.forEach(c => {
        const typeDef = state.findCarriageType(c.typeId);
        const isPow = c.isPowered !== undefined ? c.isPowered : typeDef.isPowered;
        if (isPow) poweredCarCount += 1;

        const wOffset = (c.customWeightOffset !== undefined ? c.customWeightOffset : typeDef.weightOffset) || 0;
        const cOffset = (c.customCostOffset !== undefined ? c.customCostOffset : typeDef.costOffset) || 0;
        const seatMult = (c.customSeatMult !== undefined ? c.customSeatMult : typeDef.seatMultiplier) || 1.0;

        if (isPow) {
          totalWeightKg += (motorCarWeightKg + wOffset);
          totalBOMCost += (motorCarBOMCost + cOffset);
          passengerCap += Math.round(body.passengerCap * seatMult);
        } else {
          const trailerWeight = Math.round(body.weight + (bogie.weight * 0.6) + brakes.weight + 3200 + wOffset);
          const trailerCost = Math.round(body.cost + (bogie.cost * 0.5) + brakes.cost + 40000 + cOffset);
          totalWeightKg += trailerWeight;
          totalBOMCost += trailerCost;
          passengerCap += Math.round(body.passengerCap * seatMult * 1.15);
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
    const axleOverloaded = axleLoad > (bogie.maxAxleLoadTons || 25);

    // Diagnostics & Physical Limit Check (including PWM switching limits)
    const diagnostics = TrainValidator.validateSystemIntegrity(baseComponents, totalMassTons, carriageCount);

    const singlePackKw = diagnostics.effectiveMotorPowerKw;
    const availablePowerKw = isTrainset ? (poweredCarCount * singlePackKw) : singlePackKw;
    const hotelPowerDrawKw = isTrainset ? (carriageCount * (hvac?.hotelPowerKw || 0)) : (hvac?.hotelPowerKw || 0);
    const netTractionPowerKw = Math.max(500, availablePowerKw - hotelPowerDrawKw);
    const horsepower = Math.round(netTractionPowerKw * 1.341);

    // Mechanical transmission & PWM inverter modulation efficiencies
    const mechEff = transmission?.mechanicalEfficiency || 0.97;
    const pwmDelta = pwm?.efficiencyDelta || 0.0;
    let totalEfficiency = Number((mechEff * (0.94 + pwmDelta) + efficiencyBonusTotal).toFixed(3));
    totalEfficiency = Math.min(0.99, Math.max(0.70, totalEfficiency));

    const baseCd = body.dragCd;
    const consistCd = isTrainset ? Number((baseCd + (carriageCount - 1) * 0.035).toFixed(3)) : baseCd;
    let theoreticalSpeed = Math.round(
      Math.pow((netTractionPowerKw * totalEfficiency * 1000) / (0.5 * 1.225 * consistCd * 10.5), 1 / 3) * 3.6
    ) + speedBonusTotal;

    // Apply strict speed limits (Pantograph, Bogie, Motor RPM, Transmission, PWM Modulator)
    theoreticalSpeed = Math.min(theoreticalSpeed, diagnostics.strictSpeedLimit + speedBonusTotal);
    if (axleOverloaded) theoreticalSpeed = Math.round(theoreticalSpeed * 0.72);

    // Dynamic Adhesion: Base Bogie Adhesion + Rail Sanding + PWM Direct Torque Adhesion Response
    const adhesiveMassTons = isTrainset ? Number(((poweredCarCount * motorCarWeightKg) / 1000).toFixed(1)) : totalMassTons;
    const baseAdhesion = bogie.axles === 6 ? 0.38 : 0.32;
    const totalAdhesionCoeff = baseAdhesion + (sander?.adhesionBonus || 0) + (pwm?.adhesionBonus || 0) + extraAdhesionBonus;
    const maxAdhesionKn = Math.round(adhesiveMassTons * 9.81 * totalAdhesionCoeff);

    const effectiveTractiveForceKn = Math.min(maxAdhesionKn, Math.round((netTractionPowerKw * mechEff) / 8.2));
    let acceleration = Number((effectiveTractiveForceKn / totalMassTons).toFixed(2));
    acceleration = Math.min(1.35, Math.max(0.18, acceleration));

    return {
      rollingStockType, carriageCount, poweredCarCount, trailerCarCount,
      totalMassTons, axles: totalAxles, axleLoad,
      maxAllowedAxleLoad: bogie.maxAxleLoadTons || 25, axleOverloaded,
      availablePowerKw: netTractionPowerKw, horsepower, theoreticalSpeed,
      roughSpeedMin: Math.round(theoreticalSpeed * 0.90),
      roughSpeedMax: Math.round(theoreticalSpeed * 1.08),
      totalEfficiency, maxAdhesionKn, acceleration,
      bomCost: totalBOMCost, passengerCap,
      cargoCapacityTons: isTrainset ? 0 : body.cargoCapacityTons,
      batteryRangeKm: battery?.rangeKm || 0,
      safetyScore: (brakes?.safetyIndex || 80) + (tcms?.reliabilityBonus || 0) + (baseComponents.safety?.safetyScoreBonus || 0) + safetyBonusTotal,
      components: baseComponents,
      subSelections: JSON.parse(JSON.stringify(subSelections)),
      consistConfig: consistConfig ? JSON.parse(JSON.stringify(consistConfig)) : null,
      diagnostics
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