// Web Audio API sound generator for kiosk alerts and barber notifications
class SoundService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Melodic notification sound (for the barber when a new order arrives)
  playOrderNotification() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      this.playTone(659.25, now, 0.15, 'sine');
      // Note 2: G#5 (830.61 Hz)
      this.playTone(830.61, now + 0.12, 0.15, 'sine');
      // Note 3: B5 (987.77 Hz)
      this.playTone(987.77, now + 0.24, 0.18, 'sine');
      // Note 4: E6 (1318.51 Hz) - High bell
      this.playTone(1318.51, now + 0.38, 0.45, 'triangle');
    } catch {
      // Audio context might be restricted before first user interaction
    }
  }

  // Cash register / success sound for the customer in the kiosk
  playSuccessSound() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.playTone(523.25, now, 0.12, 'triangle'); // C5
      this.playTone(659.25, now + 0.1, 0.12, 'triangle'); // E5
      this.playTone(783.99, now + 0.2, 0.15, 'triangle'); // G5
      this.playTone(1046.50, now + 0.3, 0.35, 'sine'); // C6
    } catch {
      // ignore
    }
  }

  // Gentle click / tap sound for kiosk buttons
  playTapSound() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  private playTone(freq: number, startTime: number, duration: number, type: OscillatorType) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const soundService = new SoundService();
