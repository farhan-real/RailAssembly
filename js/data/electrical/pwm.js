// Pulse-Width Modulation (PWM) & Gate Drive Systems: All Models Researchable with Detailed Metadata
window.COMPONENTS_DATA = window.COMPONENTS_DATA || {};
window.SUBCOMPONENTS_DATA = window.SUBCOMPONENTS_DATA || {};
window.COMPONENT_RESEARCH = window.COMPONENT_RESEARCH || [];

COMPONENTS_DATA.pwm = [
  {
    id: "pwm_sine_triangle_analog",
    name: "Analog Sinusoidal Pulse-Width Modulator (SPWM)",
    type: "pwm",
    switchingFrequencyKhz: 0.75,
    maxSpeed: 160,
    efficiencyDelta: -0.008,
    adhesionBonus: 0.0,
    weight: 45,
    cost: 18000,
    leadDays: 6,
    supplier: "StaticPulse Power Systems",
    inHouseTech: "tech_pwm_analog_spwm",
    desc: "Fixed 750 Hz analog carrier. Produces classic acoustic motor tones and moderate torque ripple. Speed limit: 160 km/h."
  },
  {
    id: "pwm_musical_multistage",
    name: "Multi-Stage Musical Harmonic Shift Controller",
    type: "pwm",
    switchingFrequencyKhz: 1.6,
    maxSpeed: 230,
    efficiencyDelta: 0.002,
    adhesionBonus: 0.02,
    weight: 38,
    cost: 34000,
    leadDays: 9,
    supplier: "Helvetia Electric Industries",
    inHouseTech: "tech_pwm_musical_shift",
    desc: "Changes carrier frequency in stepped musical intervals during acceleration to avoid mechanical resonance. Speed limit: 230 km/h."
  },
  {
    id: "pwm_space_vector_svm",
    name: "Digital Space Vector Modulator (SVPWM)",
    type: "pwm",
    switchingFrequencyKhz: 2.4,
    maxSpeed: 280,
    efficiencyDelta: 0.006,
    adhesionBonus: 0.03,
    weight: 26,
    cost: 52000,
    leadDays: 12,
    supplier: "Helvetia Electric Industries",
    inHouseTech: "tech_pwm_space_vector",
    desc: "Delivers 15% higher DC bus voltage utilization with reduced total harmonic distortion. Speed limit: 280 km/h."
  },
  {
    id: "pwm_selective_harmonic_she",
    name: "Selective Harmonic Elimination Modulator (SHE)",
    type: "pwm",
    switchingFrequencyKhz: 0.9,
    maxSpeed: 180,
    efficiencyDelta: 0.012,
    adhesionBonus: 0.04,
    weight: 32,
    cost: 65000,
    leadDays: 14,
    supplier: "StaticPulse Power Systems",
    inHouseTech: "tech_pwm_she_freight",
    desc: "Pre-calculated switching angles completely cancel 5th and 7th current harmonics with minimal heat. Ideal for heavy freight."
  },
  {
    id: "pwm_direct_torque_dtc",
    name: "Direct Torque Control (DTC) Dead-Beat Modulator",
    type: "pwm",
    switchingFrequencyKhz: 3.5,
    maxSpeed: 330,
    efficiencyDelta: 0.01,
    adhesionBonus: 0.06,
    weight: 22,
    cost: 98000,
    leadDays: 18,
    supplier: "ABB Rail Automation",
    inHouseTech: "tech_pwm_direct_torque",
    desc: "Sub-millisecond direct flux hysteresis response providing instant wheel-slip torque reduction in wet rail conditions."
  },
  {
    id: "pwm_synchronized_optimal_sop",
    name: "Synchronized Optimal Pulse Pattern Drive (SOPP)",
    type: "pwm",
    switchingFrequencyKhz: 2.8,
    maxSpeed: 360,
    efficiencyDelta: 0.015,
    adhesionBonus: 0.04,
    weight: 20,
    cost: 135000,
    leadDays: 22,
    supplier: "ABB Rail Automation",
    inHouseTech: "tech_pwm_sopp_express",
    desc: "Seamless hand-off into six-step square-wave over-modulation at express speeds up to 360 km/h."
  },
  {
    id: "pwm_ultrasonic_sic_vector",
    name: "Ultrasonic Silicon Carbide High-Frequency Modulator",
    type: "pwm",
    switchingFrequencyKhz: 18.0,
    maxSpeed: 400,
    efficiencyDelta: 0.022,
    adhesionBonus: 0.05,
    weight: 16,
    cost: 185000,
    leadDays: 26,
    supplier: "Semiconductor Rail Dynamics",
    inHouseTech: "tech_pwm_ultrasonic_sic",
    desc: "Operates at 18 kHz above human hearing threshold for silent operation, zero motor torque ripple, and 400 km/h capability."
  },
  {
    id: "pwm_neural_adaptive_flux",
    name: "Neural-Network Adaptive Predictive Modulator",
    type: "pwm",
    switchingFrequencyKhz: 12.0,
    maxSpeed: 420,
    efficiencyDelta: 0.025,
    adhesionBonus: 0.08,
    weight: 14,
    cost: 240000,
    leadDays: 30,
    supplier: "CyberTransit Systems",
    inHouseTech: "tech_pwm_neural_adaptive",
    desc: "AI predictive gate switching calculating motor core magnetic saturation in real time. Maximum tractive grip and energy coasting."
  }
];

SUBCOMPONENTS_DATA.pwm = {
  subcomponents: [
    { id: "pwm_dsp_dualcore", name: "Dual-Core 32-Bit Floating Point DSP Engine", cost: 9500, weight: 6, reliabilityBonus: 8, inHouseTech: null, desc: "Executes space-vector matrix transformation calculations with hardware dead-time protection." },
    { id: "pwm_analog_comparator", name: "Precision Analog Triangle Comparator Board", cost: 4500, weight: 10, efficiencyBonus: -0.004, inHouseTech: null, desc: "Inexpensive analog carrier board. Simple design with slight harmonic losses." },
    { id: "pwm_fpga_optical", name: "Direct Optical Matrix FPGA Gate Engine", cost: 21000, weight: 4, reliabilityBonus: 16, efficiencyBonus: 0.006, inHouseTech: "tech_pwm_fpga", desc: "Microsecond gate firing logic with sub-nanosecond jitter immunity against EMI surges." },
    { id: "pwm_fpga_quad", name: "Quad-Core Vector Real-Time Co-Processor", cost: 38000, weight: 5, reliabilityBonus: 20, efficiencyBonus: 0.012, adhesionBonus: 0.04, inHouseTech: "tech_pwm_fpga", desc: "Sub-millisecond matrix calculations delivering instant torque compensation on slippery rails." }
  ],
  modifications: [
    { id: "pwm_spread_spectrum", name: "Spread-Spectrum Carrier Frequency Dithering", cost: 12000, weight: 2, reliabilityBonus: 6, inHouseTech: null, desc: "Spreads acoustic and electromagnetic switching peaks across a broad band to eliminate cabin hum." },
    { id: "pwm_overmod_sixstep", name: "Synchronous Six-Step Over-Modulation Transition", cost: 24000, weight: 3, speedBonus: 20, efficiencyBonus: 0.008, inHouseTech: "tech_pwm_overmod", desc: "Maximizes fundamental output voltage to motor windings by transitioning cleanly into square-wave drive." },
    { id: "pwm_predictive_flux", name: "Model Predictive Current Control (MPCC)", cost: 34000, weight: 2, adhesionBonus: 0.05, reliabilityBonus: 10, inHouseTech: "tech_pwm_overmod", desc: "Forecasts stator flux vector states every 20 microseconds, boosting adhesion by +0.05." },
    { id: "pwm_selective_5th7th", name: "5th & 7th Harmonic Active Nullifier", cost: 18000, weight: 3, efficiencyBonus: 0.008, reliabilityBonus: 12, inHouseTech: "tech_pwm_overmod", desc: "Cancels primary motor heating harmonics for continuous heavy freight endurance." }
  ]
};

COMPONENT_RESEARCH.push(
  { id: "tech_pwm_analog_spwm", name: "Sinusoidal Analog PWM Carrier Generator", branch: "electronics", costMoney: 95000, durationDays: 20, unlocks: ["pwm_sine_triangle_analog"], desc: "Hardware analog comparator generating 750 Hz triangular carrier modulation." },
  { id: "tech_pwm_musical_shift", name: "Musical Frequency Shifting Gate Controller", branch: "electronics", costMoney: 180000, durationDays: 30, unlocks: ["pwm_musical_multistage"], desc: "Stepped carrier shifting mitigating acoustic vibration resonances during acceleration." },
  { id: "tech_pwm_space_vector", name: "Digital Space Vector PWM (SVPWM) Modulator", branch: "electronics", costMoney: 340000, durationDays: 45, unlocks: ["pwm_space_vector_svm"], desc: "Microcontroller vector math maximizing DC link voltage utilization with low harmonic loss." },
  { id: "tech_pwm_she_freight", name: "Selective Harmonic Elimination (SHE-PWM)", branch: "electronics", costMoney: 520000, durationDays: 55, unlocks: ["pwm_selective_harmonic_she"], desc: "Pre-calculated switching angles canceling 5th and 7th harmonics for heavy freight torque." },
  { id: "tech_pwm_direct_torque", name: "Direct Torque Control (DTC) Hysteresis Modulator", branch: "electronics", costMoney: 890000, durationDays: 70, unlocks: ["pwm_direct_torque_dtc"], desc: "Instantaneous torque and magnetic flux hysteresis regulation for sub-millisecond anti-slip." },
  { id: "tech_pwm_sopp_express", name: "Synchronized Optimal Pulse Pattern Drive", branch: "electronics", costMoney: 1450000, durationDays: 95, unlocks: ["pwm_synchronized_optimal_sop"], desc: "Optimized switching transitions blending into square-wave over-modulation at 360 km/h." },
  { id: "tech_pwm_ultrasonic_sic", name: "Ultrasonic 18 kHz Silicon Carbide Vector Modulator", branch: "electronics", costMoney: 2600000, durationDays: 125, unlocks: ["pwm_ultrasonic_sic_vector"], desc: "Inaudible 18 kHz carrier modulation eliminating torque ripple for 400 km/h operations." },
  { id: "tech_pwm_neural_adaptive", name: "Neural-Adaptive Real-Time Saturation Modulator", branch: "electronics", costMoney: 4200000, durationDays: 155, unlocks: ["pwm_neural_adaptive_flux"], desc: "Artificial intelligence optimizing individual gate pulse widths against rail adhesion." },
  { id: "tech_pwm_fpga", name: "Optical Matrix FPGA Real-Time Gate Engines", branch: "electronics", costMoney: 780000, durationDays: 60, unlocks: ["pwm_fpga_optical", "pwm_fpga_quad"], desc: "Sub-nanosecond switching accuracy immune to extreme high-voltage EMI surges." },
  { id: "tech_pwm_overmod", name: "MPCC Predictive Anti-Slip & Overmodulation", branch: "electronics", costMoney: 1100000, durationDays: 75, unlocks: ["pwm_overmod_sixstep", "pwm_predictive_flux", "pwm_selective_5th7th"], desc: "Square-wave over-modulation transition and microsecond flux prediction algorithms." }
);