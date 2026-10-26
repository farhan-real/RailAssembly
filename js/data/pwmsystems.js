// Pulse-Width Modulation (PWM) and Inverter Gate Drive Systems
const PWM_SYSTEMS_DATA = {
  pwm: [
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
      inHouseTech: null,
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
      inHouseTech: null,
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
      inHouseTech: "tech_advanced_inverters",
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
      inHouseTech: "tech_high_torque_motors",
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
      inHouseTech: "tech_pmsm_traction",
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
      inHouseTech: "tech_radial_bogies",
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
      inHouseTech: "tech_sic_power",
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
      inHouseTech: "tech_driverless_ato",
      desc: "AI predictive gate switching calculating motor core magnetic saturation in real time. Maximum tractive grip and energy coasting."
    }
  ]
};

// Merge into master COMPONENTS_DATA registry
Object.assign(COMPONENTS_DATA, PWM_SYSTEMS_DATA);