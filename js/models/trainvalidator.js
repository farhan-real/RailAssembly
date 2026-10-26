// Engineering Diagnostic Engine: Physical Limits, Voltage Compatibility, and Power Flow Checks
class TrainValidator {
  static validateSystemIntegrity(baseComponents, totalConsistMassTons, carriageCount) {
    const panto = baseComponents.pantograph || { maxSpeed: 160 };
    const trans = baseComponents.transformer || { powerRatingKw: 4000 };
    const inv = baseComponents.inverter || { maxKw: 3600 };
    const motor = baseComponents.motor || { powerKw: 3200 };
    const bogie = baseComponents.bogie || { maxSafeSpeed: 160 };
    const comp = baseComponents.compressor || { airflowLpm: 1200 };
    const cool = baseComponents.cooling || { thermalDissipationKw: 4500 };
    const coup = baseComponents.coupler || { tensileLoadLimitTons: 2000 };

    const bottlenecks = [];
    const speedLimiters = [];
    let isFullySufficient = true;

    // 1. Voltage and Electrification Compatibility Check
    const pantoVolt = panto.voltage || "25kV AC";
    const transVolt = trans.supportedVoltage || "25kV AC";
    const isMultiPanto = pantoVolt.includes("Multi");
    const isMultiTrans = transVolt.includes("Multi");

    if (!isMultiPanto && !isMultiTrans && pantoVolt !== transVolt) {
      bottlenecks.push(`Fatal Voltage Mismatch: Pantograph is rated for ${pantoVolt}, but transformer requires ${transVolt}.`);
      isFullySufficient = false;
    }

    // 2. Transformer vs Inverter Power Flow
    if (trans.powerRatingKw < inv.maxKw) {
      const deficit = inv.maxKw - trans.powerRatingKw;
      bottlenecks.push(`Transformer Supply Deficit: Inverter demand (${inv.maxKw} kW) exceeds transformer rating (${trans.powerRatingKw} kW). Power throttled by ${deficit} kW.`);
      isFullySufficient = false;
    }

    // 3. Inverter vs Motor Matching
    if (inv.maxKw < motor.powerKw) {
      const deficit = motor.powerKw - inv.maxKw;
      bottlenecks.push(`Inverter Bottleneck: Traction motor requires ${motor.powerKw} kW, but inverter output is ${inv.maxKw} kW. Motor output throttled by ${deficit} kW.`);
      isFullySufficient = false;
    }

    // 4. Thermal Cooling Loop Capacity
    const peakThermalLoadKw = Math.round((inv.maxKw + motor.powerKw) * 0.65);
    if (cool.thermalDissipationKw < peakThermalLoadKw) {
      const diff = peakThermalLoadKw - cool.thermalDissipationKw;
      bottlenecks.push(`Thermal Cooling Deficit: Cooling system capacity (${cool.thermalDissipationKw} kW) is below peak thermal heat load (${peakThermalLoadKw} kW). Sustained runs will derate by ${Math.round(diff / 50)} kW.`);
    }

    // 5. Pneumatic Air Flow vs Consist Size
    const requiredAirflowLpm = 700 + (carriageCount * 120);
    if (comp.airflowLpm < requiredAirflowLpm) {
      bottlenecks.push(`Pneumatic Capacity Warning: Main compressor output (${comp.airflowLpm} L/min) is insufficient for rapid brake charging of a ${carriageCount}-carriage consist (requires ${requiredAirflowLpm} L/min).`);
    }

    // 6. Coupler Tensile Haulage Limit
    if (totalConsistMassTons > coup.tensileLoadLimitTons) {
      bottlenecks.push(`Coupler Tensile Shear Risk: Consist gross mass (${totalConsistMassTons} Tons) exceeds coupler rated tensile load limit (${coup.tensileLoadLimitTons} Tons).`);
      isFullySufficient = false;
    }

    // 7. Component Speed Limits Check
    speedLimiters.push({ component: "Pantograph", limit: panto.maxSpeed || 200 });
    speedLimiters.push({ component: "Bogie Wheelsets", limit: bogie.maxSafeSpeed || 180 });
    speedLimiters.push({ component: "Traction Motor RPM", limit: motor.maxRpmSpeed || 200 });

    const strictSpeedLimit = Math.min(...speedLimiters.map(s => s.limit));
    const primarySpeedLimiter = speedLimiters.find(s => s.limit === strictSpeedLimit);

    return {
      isFullySufficient,
      bottlenecks,
      speedLimiters,
      strictSpeedLimit,
      primarySpeedLimiter,
      effectiveMotorPowerKw: Math.min(motor.powerKw, inv.maxKw, trans.powerRatingKw)
    };
  }
}