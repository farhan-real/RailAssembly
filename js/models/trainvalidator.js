// Engineering Diagnostic Engine: Physical Limits, Voltage Compatibility, and Power Flow Checks
class TrainValidator {
  static validateSystemIntegrity(baseComponents) {
    const panto = baseComponents.pantograph;
    const trans = baseComponents.transformer;
    const inv = baseComponents.inverter;
    const motor = baseComponents.motor;
    const bogie = baseComponents.bogie;

    const bottlenecks = [];
    const speedLimiters = [];
    let isFullySufficient = true;

    // 1. Voltage and Electrification Compatibility Check
    const pantoVolt = panto.voltage || "25kV AC";
    const transVolt = trans.supportedVoltage || "25kV AC";
    const isMultiPanto = pantoVolt.includes("Multi");
    const isMultiTrans = transVolt.includes("Multi");

    if (!isMultiPanto && !isMultiTrans && pantoVolt !== transVolt) {
      bottlenecks.push(`Fatal Voltage Mismatch: Pantograph is rated for ${pantoVolt}, but transformer/choke requires ${transVolt}.`);
      isFullySufficient = false;
    }

    // 2. Transformer vs Inverter Power Throughput
    if (trans.powerRatingKw < inv.maxKw) {
      const deficit = inv.maxKw - trans.powerRatingKw;
      bottlenecks.push(`Transformer Supply Deficit: Inverter demand (${inv.maxKw} kW) exceeds transformer rating (${trans.powerRatingKw} kW). Power throttled by ${deficit} kW.`);
      isFullySufficient = false;
    }

    // 3. Inverter vs Traction Motor Requirement Check
    if (inv.maxKw < motor.powerKw) {
      const deficit = motor.powerKw - inv.maxKw;
      bottlenecks.push(`Inverter Bottleneck: Traction motor requires ${motor.powerKw} kW, but inverter max output is ${inv.maxKw} kW. Motor output throttled by ${deficit} kW.`);
      isFullySufficient = false;
    }

    // 4. Pantograph Current/Power Throughput Check
    // Approximate power threshold: 25kV AC allows high power with low amps; DC systems require immense ampacity
    const maxPantoPowerKw = pantoVolt.includes("1.5kV") ? Math.round(1500 * (panto.maxCurrentAmps || 2000) / 1000) : 10000;
    if (inv.maxKw > maxPantoPowerKw) {
      bottlenecks.push(`Pantograph Ampacity Limit: Collector ampacity limit (${panto.maxCurrentAmps}A) restricts maximum continuous power to ${maxPantoPowerKw} kW.`);
      isFullySufficient = false;
    }

    // 5. Component Speed Limits Check
    speedLimiters.push({ component: "Pantograph", limit: panto.maxSpeed });
    speedLimiters.push({ component: "Bogie Wheelsets", limit: bogie.maxSafeSpeed });
    speedLimiters.push({ component: "Traction Motor RPM", limit: motor.maxRpmSpeed });

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