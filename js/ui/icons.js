// Clean vector technical blueprint schematic without decorative icon clutter
class TrainSVGBuilder {
  static renderParametricTrain(slots) {
    const isAero = slots.carbody === "body_aero_cf";
    const isFreight = slots.carbody === "body_steel";
    const hasBattery = slots.battery && slots.battery !== "bat_none";
    const isSixAxle = slots.bogie === "bog_co_co";

    const nosePath = isAero
      ? "M 40,55 C 80,55 120,40 180,40 L 460,40 L 460,78 L 40,78 Z"
      : isFreight
      ? "M 55,42 L 445,42 L 445,78 L 55,78 Z"
      : "M 48,46 C 70,44 100,42 160,42 L 452,42 L 452,78 L 48,78 Z";

    return `
      <svg viewBox="0 0 500 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <!-- Overhead Catenary System (Technical Line) -->
        <line x1="0" y1="14" x2="500" y2="14" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>
        
        <!-- Pantograph Mechanism -->
        <g stroke="#94a3b8" stroke-width="1.8" fill="none">
          <line x1="360" y1="14" x2="385" y2="14" stroke-width="2.5" stroke="#cbd5e1"/>
          <line x1="340" y1="40" x2="370" y2="20"/>
          <line x1="370" y1="20" x2="385" y2="14"/>
          <circle cx="340" cy="40" r="2" fill="#94a3b8"/>
        </g>

        <!-- Main Carbody Chassis -->
        <path d="${nosePath}" fill="#16202e" stroke="#3b82f6" stroke-width="1.4"/>

        <!-- Windows and Crew Cabins -->
        ${isFreight
          ? `<rect x="75" y="47" width="26" height="13" rx="1" fill="#29394f"/>
             <rect x="120" y="49" width="300" height="5" fill="#1b2535"/>`
          : `<path d="M 60,56 L 95,47 L 95,62 L 60,62 Z" fill="#29394f"/>
             <rect x="115" y="48" width="32" height="10" rx="1" fill="#29394f"/>
             <rect x="160" y="48" width="32" height="10" rx="1" fill="#29394f"/>
             <rect x="205" y="48" width="32" height="10" rx="1" fill="#29394f"/>
             <rect x="250" y="48" width="32" height="10" rx="1" fill="#29394f"/>
             <rect x="295" y="48" width="32" height="10" rx="1" fill="#29394f"/>
             <rect x="340" y="48" width="32" height="10" rx="1" fill="#29394f"/>`
        }

        <!-- Underfloor Power Subsystems with Full Professional Nomenclature -->
        <rect x="165" y="79" width="62" height="9" rx="1" fill="#d97706"/>
        <text x="168" y="86" fill="#0b0f17" font-size="5.5" font-weight="700">TRANSFORMER</text>

        <rect x="232" y="79" width="52" height="9" rx="1" fill="#2563eb"/>
        <text x="237" y="86" fill="#ffffff" font-size="5.5" font-weight="700">INVERTER</text>

        ${hasBattery
          ? `<rect x="288" y="79" width="48" height="9" rx="1" fill="#059669"/>
             <text x="292" y="86" fill="#ffffff" font-size="5.5" font-weight="700">BATTERY</text>`
          : ""
        }

        <!-- Running Gear Bogie Assemblies -->
        <g fill="#111827" stroke="#64748b" stroke-width="1.2">
          <circle cx="100" cy="94" r="7.5"/>
          <circle cx="132" cy="94" r="7.5"/>
          ${isSixAxle ? `<circle cx="116" cy="94" r="7.5"/>` : ""}
          <line x1="88" y1="88" x2="144" y2="88" stroke-width="2" stroke="#475569"/>
        </g>

        <g fill="#111827" stroke="#64748b" stroke-width="1.2">
          <circle cx="365" cy="94" r="7.5"/>
          <circle cx="397" cy="94" r="7.5"/>
          ${isSixAxle ? `<circle cx="381" cy="94" r="7.5"/>` : ""}
          <line x1="353" y1="88" x2="409" y2="88" stroke-width="2" stroke="#475569"/>
        </g>

        <!-- Track Line -->
        <line x1="10" y1="102" x2="490" y2="102" stroke="#334155" stroke-width="1.5"/>
      </svg>
    `;
  }
}