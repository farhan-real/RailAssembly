// Standalone Web Audio API Sound Synthesizer (Zero External Audio Assets)
class SoundSystem {
  static ctx = null;
  static masterGain = null;
  static sfxGain = null;

  static init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.updateVolumes();
    } catch (e) { /* AudioContext optional */ }
  }

  static resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  static updateVolumes() {
    if (!this.masterGain || !this.sfxGain) return;
    const masterVal = (state.audioMuted ? 0 : state.masterVolume) / 100;
    const sfxVal = state.sfxVolume / 100;
    this.masterGain.gain.setValueAtTime(masterVal, this.ctx.currentTime);
    this.sfxGain.gain.setValueAtTime(sfxVal, this.ctx.currentTime);
  }

  static playTone(freq, duration, type = "sine", gainLevel = 0.15) {
    if (!this.ctx || state.audioMuted || state.masterVolume === 0) return;
    this.resume();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) { /* Audio fallback */ }
  }

  static playClick() {
    this.playTone(850, 0.04, "triangle", 0.08);
  }

  static playSuccess() {
    if (!this.ctx || state.audioMuted) return;
    this.resume();
    this.playTone(523.25, 0.12, "sine", 0.12); // C5
    setTimeout(() => this.playTone(659.25, 0.16, "sine", 0.12), 80); // E5
  }

  static playWarning() {
    if (!this.ctx || state.audioMuted) return;
    this.resume();
    this.playTone(220, 0.18, "sawtooth", 0.1);
    setTimeout(() => this.playTone(196, 0.22, "sawtooth", 0.1), 100);
  }

  static playTestHum() {
    if (!this.ctx || state.audioMuted) return;
    this.resume();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(60, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) { /* Audio fallback */ }
  }
}