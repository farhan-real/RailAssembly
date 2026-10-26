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
    const vcb = baseComponents.circuitbreaker || { supportedVoltage: "25kV AC" };
    const dclink = baseComponents.dclink || { maxThroughputKw: 6000 };
    const transm = baseComponents.transmission || { maxSpeed: 200 };
    const pwm = baseComponents.pwm || { maxSpeed: 200, switchingFrequencyKhz: 2.0 };

    const bottlenecks = [];
    const speedLimiters = [];
    let isFullySufficient = true;

    // 1. Voltage & Circuit Breaker Compatibility
    const pantoVolt = panto.voltage || "25kV AC";
    const transVolt = trans.supportedVoltage || "25kV AC";
    const vcbVolt = vcb.supportedVoltage || "25kV AC";

    if (!pantoVolt.includes("Multi") && !transVolt.includes("Multi") && pantoVolt !== transVolt) {
      bottlenecks.push(`Fatal Voltage Mismatch: Pantograph is rated for ${pantoVolt}, but transformer requires ${transVolt}.`);
      isFullySufficient = false;
    }

    if (!vcbVolt.includes("Multi") && !pantoVolt.includes("Multi") && !vcbVolt.includes(pantoVolt.split(" ")[0])) {
      bottlenecks.push(`Circuit Breaker Incompatibility: Circuit breaker (${vcb.name}) cannot interrupt ${pantoVolt} arcs.`);
      isFullySufficient = false;
    }

    // 2. Transformer vs Inverter vs DC Link Power Flow
    if (trans.powerRatingKw < inv.maxKw) {
      const deficit = inv.maxKw - trans.powerRatingKw;
      bottlenecks.push(`Transformer Supply Deficit: Inverter demand (${inv.maxKw} kW) exceeds transformer rating (${trans.powerRatingKw} kW). Throttled by ${deficit} kW.`);
      isFullySufficient = false;
    }

    if (dclink.maxThroughputKw < inv.maxKw) {
      const deficit = inv.maxKw - dclink.maxThroughputKw;
      bottlenecks.push(`DC Link Buffer Deficit: Inverter draw (${inv.maxKw} kW) exceeds intermediate DC link rating (${dclink.maxThroughputKw} kW). Voltage sag risk under load.`);
      isFullySufficient = false;
    }

    // 3. Inverter vs Motor Matching
    if (inv.maxKw < motor.powerKw) {
      const deficit = motor.powerKw - inv.maxKw;
      bottlenecks.push(`Inverter Bottleneck: Traction motor requires ${motor.powerKw} kW, but inverter output is ${inv.maxKw} kW. Motor throttled by ${deficit} kW.`);
      isFullySufficient = false;
    }

    // 4. PWM Modulator & Inverter Switching Compatibility
    if (pwm.switchingFrequencyKhz > 10.0 && !inv.name.includes("Silicon Carbide")) {
      bottlenecks.push(`PWM Thermal Switching Stress: High-frequency ultrasonic PWM (${pwm.switchingFrequencyKhz} kHz) generates excessive switching heat on silicon IGBT inverters without SiC modules.`);
    }

    // 5. Thermal Cooling Loop Capacity
    const peakThermalLoadKw = Math.round((inv.maxKw + motor.powerKw) * 0.65);
    if (cool.thermalDissipationKw < peakThermalLoadKw) {
      const diff = peakThermalLoadKw - cool.thermalDissipationKw;
      bottlenecks.push(`Thermal Cooling Deficit: Cooling capacity (${cool.thermalDissipationKw} kW) is below peak thermal load (${peakThermalLoadKw} kW). Continuous runs will derate by ${Math.round(diff / 50)} kW.`);
    }

    // 6. Pneumatic Air Flow vs Consist Size
    const requiredAirflowLpm = 700 + (carriageCount * 120);
    if (comp.airflowLpm < requiredAirflowLpm) {
      bottlenecks.push(`Pneumatic Capacity Warning: Main compressor output (${comp.airflowLpm} L/min) is insufficient for rapid brake charging of ${carriageCount} carriages (requires ${requiredAirflowLpm} L/min).`);
    }

    // 7. Coupler Tensile Haulage Limit
    if (totalConsistMassTons > coup.tensileLoadLimitTons) {
      bottlenecks.push(`Coupler Tensile Shear Risk: Consist mass (${totalConsistMassTons} Tons) exceeds coupler load limit (${coup.tensileLoadLimitTons} Tons).`);
      isFullySufficient = false;
    }

    // 8. Strict Speed Limits (Pantograph, Bogie, Motor RPM, Transmission, PWM Modulator)
    speedLimiters.push({ component: "Pantograph", limit: panto.maxSpeed || 200 });
    speedLimiters.push({ component: "Bogie Wheelsets", limit: bogie.maxSafeSpeed || 180 });
    speedLimiters.push({ component: "Traction Motor RPM", limit: motor.maxRpmSpeed || 200 });
    speedLimiters.push({ component: "Transmission Drive", limit: transm.maxSpeed || 200 });
    speedLimiters.push({ component: "PWM Modulator", limit: pwm.maxSpeed || 200 });

    const strictSpeedLimit = Math.min(...speedLimiters.map(s => s.limit));
    const primarySpeedLimiter = speedLimiters.find(s => s.limit === strictSpeedLimit);

    return {
      isFullySufficient,
      bottlenecks,
      speedLimiters,
      strictSpeedLimit,
      primarySpeedLimiter,
      effectiveMotorPowerKw: Math.min(motor.powerKw, inv.maxKw, trans.powerRatingKw, dclink.maxThroughputKw)
    };
  }
}