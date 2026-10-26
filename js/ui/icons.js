// Clean vector SVG icons & dynamic electric train blueprint generator
const ICONS = {
  train: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16M9 17l-3 4M15 17l3 4M9 7h.01M15 7h.01"/></svg>`,
  pantograph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 3h16M7 7l5-4 5 4M12 3v8M8 11l4 6 4-6M5 21h14"/></svg>`,
  transformer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8.5" cy="12" r="5.5"/><circle cx="15.5" cy="12" r="5.5"/><path d="M3 12h1M20 12h1"/></svg>`,
  inverter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15l3-6 4 6 3-6"/></svg>`,
  motor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4M9 15l6-6"/></svg>`,
  bogie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/><path d="M2 13h20M6 13v-3h12v3"/></svg>`,
  battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M20 10v4M6 10v4M10 10v4M14 10v4"/></svg>`,
  money: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></svg>`,
  time: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>`,
  storage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>`,
  rep: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5 12 2"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="7,4 19,12 7,20"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  fast: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="4,4 13,12 4,20"/><polygon points="12,4 21,12 12,20"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

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
        <!-- Overhead Catenary Wire Wireframe -->
        <line x1="0" y1="12" x2="500" y2="12" stroke="#253c61" stroke-width="1.5" stroke-dasharray="4 4"/>
        
        <!-- Pantograph Arm System -->
        <g stroke="#00e5ff" stroke-width="2" fill="none">
          <line x1="360" y1="12" x2="385" y2="12" stroke-width="3"/>
          <line x1="340" y1="40" x2="370" y2="18"/>
          <line x1="370" y1="18" x2="385" y2="12"/>
          <circle cx="340" cy="40" r="2.5" fill="#00e5ff"/>
        </g>

        <!-- Electric Carbody Chassis -->
        <path d="${nosePath}" fill="#13233c" stroke="#00e5ff" stroke-width="1.6"/>

        <!-- Driver Cab & Passenger Windows -->
        ${isFreight
          ? `<rect x="75" y="47" width="28" height="14" rx="2" fill="#00e5ff" opacity="0.85"/>
             <rect x="120" y="49" width="300" height="6" fill="#1c3559"/>`
          : `<path d="M 60,56 L 95,47 L 95,62 L 60,62 Z" fill="#00e5ff" opacity="0.9"/>
             <rect x="115" y="48" width="32" height="12" rx="2" fill="#00e5ff" opacity="0.6"/>
             <rect x="160" y="48" width="32" height="12" rx="2" fill="#00e5ff" opacity="0.6"/>
             <rect x="205" y="48" width="32" height="12" rx="2" fill="#00e5ff" opacity="0.6"/>
             <rect x="250" y="48" width="32" height="12" rx="2" fill="#00e5ff" opacity="0.6"/>
             <rect x="295" y="48" width="32" height="12" rx="2" fill="#00e5ff" opacity="0.6"/>
             <rect x="340" y="48" width="32" height="12" rx="2" fill="#00e5ff" opacity="0.6"/>`
        }

        <!-- Underfloor Transformer, Inverter & Traction Motor Units -->
        <rect x="175" y="79" width="46" height="10" rx="2" fill="#ffab00" opacity="0.85"/>
        <text x="180" y="87" fill="#070b12" font-size="7" font-weight="bold">TRAFO</text>
        <rect x="228" y="79" width="44" height="10" rx="2" fill="#00e5ff" opacity="0.85"/>
        <text x="233" y="87" fill="#070b12" font-size="7" font-weight="bold">INVERT</text>

        ${hasBattery
          ? `<rect x="279" y="79" width="42" height="10" rx="2" fill="#00e676" opacity="0.85"/>
             <text x="283" y="87" fill="#070b12" font-size="7" font-weight="bold">BATTERY</text>`
          : ""
        }

        <!-- Running Gear / Bogies -->
        <!-- Front Bogie -->
        <g fill="#1a2b47" stroke="#00e5ff" stroke-width="1.2">
          <circle cx="100" cy="94" r="8"/>
          <circle cx="132" cy="94" r="8"/>
          ${isSixAxle ? `<circle cx="116" cy="94" r="8"/>` : ""}
          <line x1="88" y1="88" x2="144" y2="88" stroke-width="2"/>
        </g>

        <!-- Rear Bogie -->
        <g fill="#1a2b47" stroke="#00e5ff" stroke-width="1.2">
          <circle cx="365" cy="94" r="8"/>
          <circle cx="397" cy="94" r="8"/>
          ${isSixAxle ? `<circle cx="381" cy="94" r="8"/>` : ""}
          <line x1="353" y1="88" x2="409" y2="88" stroke-width="2"/>
        </g>

        <!-- Ground Rail Line -->
        <line x1="10" y1="102" x2="490" y2="102" stroke="#334b73" stroke-width="2"/>
      </svg>
    `;
  }
}