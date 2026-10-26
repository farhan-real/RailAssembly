// Technical Subcomponents and Modifications for PWM Modulation Controllers
const PWM_SUBCOMPONENTS_DATA = {
  pwm: {
    subcomponents: [
      {
        id: "pwm_dsp_dualcore",
        name: "Dual-Core 32-Bit Floating Point DSP Engine",
        cost: 9500,
        weight: 6,
        reliabilityBonus: 8,
        desc: "Executes space-vector matrix transformation calculations with hardware dead-time interlock protection."
      },
      {
        id: "pwm_fpga_optical",
        name: "Direct Optical Matrix FPGA Gate Engine",
        cost: 21000,
        weight: 4,
        reliabilityBonus: 16,
        desc: "Microsecond gate firing logic with sub-nanosecond jitter immunity against high-voltage EMI transients."
      }
    ],
    modifications: [
      {
        id: "pwm_spread_spectrum",
        name: "Spread-Spectrum Carrier Frequency Dithering",
        cost: 12000,
        weight: 2,
        reliabilityBonus: 6,
        desc: "Spreads acoustic and electromagnetic switching peaks across a broad band to eliminate passenger cabin hum."
      },
      {
        id: "pwm_overmod_sixstep",
        name: "Synchronous Six-Step Over-Modulation Transition Logic",
        cost: 24000,
        weight: 3,
        speedBonus: 20,
        desc: "Maximizes fundamental output voltage to motor windings at high RPM by transitioning cleanly into square-wave drive."
      }
    ]
  }
};

// Merge into master SUBCOMPONENTS_DATA registry
Object.assign(SUBCOMPONENTS_DATA, PWM_SUBCOMPONENTS_DATA);