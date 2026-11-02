/**
 * card4u Audio Engine
 * Provides synthesized musical soundscapes and realistic micro-sound effects
 * using the browser's native Web Audio API (Zero external dependencies).
 */

class CardAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrack = 'romantic';
    this.gainNode = null;
    this.loopTimer = null;
    this.customAudio = null;
    this.onStateChange = null;
    this.tempo = 72; // BPM
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play Sound Effect: Wax Seal Crack & Paper Unseal
  playSealBreak() {
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Crisp wax snap (filtered noise burst)
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(3, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // Warm envelope slide swoosh & bell chime
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t + 0.05); // D5
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.35); // A5
    
    oscGain.gain.setValueAtTime(0.001, t);
    oscGain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t + 0.05);
    osc.stop(t + 0.85);

    // Harmonic chime sparkle
    [1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
      const chime = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(freq, t + 0.15 + (idx * 0.08));
      cGain.gain.setValueAtTime(0.12, t + 0.15 + (idx * 0.08));
      cGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9 + (idx * 0.08));
      chime.connect(cGain);
      cGain.connect(this.ctx.destination);
      chime.start(t + 0.15 + (idx * 0.08));
      chime.stop(t + 1.1 + (idx * 0.08));
    });
  }

  // Play Sound Effect: Confetti Pop
  playConfettiPop() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Play Sound Effect: Scratching gold foil
  playScratchSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800 + Math.random() * 600, t);
    filter.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Synthesized Ambient Music Melodies
  playNote(freq, time, duration, waveType = 'sine', vol = 0.18) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, time);

      // Low pass warm filter for sweet acoustic tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start(time);
      osc.stop(time + duration + 0.1);
    } catch (e) {
      console.warn("Audio note play error", e);
    }
  }

  startAmbient(track = 'romantic', customUrl = null) {
    this.init();
    this.stopAmbient();
    this.currentTrack = track;
    this.isPlaying = true;

    if (customUrl) {
      this.playCustomUrl(customUrl);
      if (this.onStateChange) this.onStateChange(true);
      return;
    }

    if (!this.ctx) return;
    this.scheduleTrackLoop();
    if (this.onStateChange) this.onStateChange(true);
  }

  playCustomUrl(url) {
    try {
      if (this.customAudio) {
        this.customAudio.pause();
        this.customAudio = null;
      }
      this.customAudio = new Audio(url);
      this.customAudio.loop = true;
      this.customAudio.volume = 0.4;
      this.customAudio.play().catch(e => console.log("Audio autoplay prevented", e));
    } catch (err) {
      console.warn("Failed to play custom audio", err);
    }
  }

  stopAmbient() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  toggle(track = 'romantic', customUrl = null) {
    if (this.isPlaying) {
      this.stopAmbient();
    } else {
      this.startAmbient(track, customUrl);
    }
    return this.isPlaying;
  }

  setVolume(val) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = Math.max(0, Math.min(1, val));
    }
  }

  scheduleTrackLoop() {
    if (!this.isPlaying || !this.ctx) return;

    const t = this.ctx.currentTime + 0.05;
    let loopDuration = 12; // Seconds per phrase

    if (this.currentTrack === 'romantic') {
      // Gentle romantic arpeggios: Cmaj7 - Am9 - Fmaj7 - Gsus4
      const chords = [
        // Cmaj7: C4, E4, G4, B4, E5
        { time: 0, notes: [261.63, 329.63, 392.00, 493.88, 659.25], bass: 130.81 },
        // Am9: A3, C4, E4, G4, B4
        { time: 3.0, notes: [220.00, 261.63, 329.63, 392.00, 493.88], bass: 110.00 },
        // Fmaj7: F3, A3, C4, E4, A4
        { time: 6.0, notes: [174.61, 220.00, 261.63, 329.63, 440.00], bass: 87.31 },
        // Gsus4 / G: G3, C4, D4, G4, B4
        { time: 9.0, notes: [196.00, 261.63, 293.66, 392.00, 493.88], bass: 98.00 }
      ];

      chords.forEach(c => {
        // Bass note
        this.playNote(c.bass, t + c.time, 2.8, 'triangle', 0.15);
        // Arpeggiated chord notes
        c.notes.forEach((freq, idx) => {
          this.playNote(freq, t + c.time + (idx * 0.45), 2.2, 'sine', 0.12);
        });
      });
      loopDuration = 12;

    } else if (this.currentTrack === 'birthday') {
      // Joyful celebratory melody (Warm bells + bright chime)
      const melody = [
        { f: 261.63, d: 0.4, o: 0.0 }, // C4
        { f: 261.63, d: 0.4, o: 0.5 }, // C4
        { f: 293.66, d: 0.8, o: 1.0 }, // D4
        { f: 261.63, d: 0.8, o: 1.8 }, // C4
        { f: 349.23, d: 0.8, o: 2.6 }, // F4
        { f: 329.63, d: 1.4, o: 3.4 }, // E4

        { f: 261.63, d: 0.4, o: 5.0 }, // C4
        { f: 261.63, d: 0.4, o: 5.5 }, // C4
        { f: 293.66, d: 0.8, o: 6.0 }, // D4
        { f: 261.63, d: 0.8, o: 6.8 }, // C4
        { f: 392.00, d: 0.8, o: 7.6 }, // G4
        { f: 349.23, d: 1.6, o: 8.4 }, // F4
      ];

      melody.forEach(m => {
        this.playNote(m.f, t + m.o, m.d * 1.5, 'triangle', 0.18);
        this.playNote(m.f * 2, t + m.o, m.d * 1.2, 'sine', 0.07);
      });
      loopDuration = 11;

    } else if (this.currentTrack === 'royal') {
      // Royal Indian Wedding Drone & Sitar-like acoustic harmonics
      const droneBase = 146.83; // D3
      this.playNote(droneBase, t, 11.5, 'triangle', 0.18);
      this.playNote(droneBase * 1.5, t, 11.5, 'sine', 0.12); // A3

      const ragaPlucks = [
        { f: 293.66, o: 0.2 }, // D4
        { f: 329.63, o: 1.2 }, // E4
        { f: 369.99, o: 2.2 }, // F#4
        { f: 440.00, o: 3.4 }, // A4
        { f: 493.88, o: 4.6 }, // B4
        { f: 587.33, o: 5.8 }, // D5
        { f: 493.88, o: 7.0 }, // B4
        { f: 440.00, o: 8.2 }, // A4
        { f: 369.99, o: 9.4 }  // F#4
      ];

      ragaPlucks.forEach(p => {
        this.playNote(p.f, t + p.o, 1.8, 'sawtooth', 0.04);
        this.playNote(p.f, t + p.o, 2.0, 'sine', 0.14);
      });
      loopDuration = 11.5;

    } else {
      // Chill Party Lo-Fi Vibes: Dm7 -> G7 -> Cmaj7 -> Am7
      const loFiChords = [
        { o: 0, f: [146.83, 220.00, 261.63, 349.23] },
        { o: 2.8, f: [196.00, 246.94, 293.66, 349.23] },
        { o: 5.6, f: [130.81, 196.00, 246.94, 329.63] },
        { o: 8.4, f: [110.00, 164.81, 220.00, 261.63] }
      ];

      loFiChords.forEach(c => {
        c.f.forEach((freq, idx) => {
          this.playNote(freq, t + c.o + (idx * 0.06), 2.4, 'sine', 0.13);
        });
      });
      loopDuration = 11.2;
    }

    this.loopTimer = setTimeout(() => {
      this.scheduleTrackLoop();
    }, loopDuration * 1000);
  }
}

// Global instance export
window.cardAudio = new CardAudioEngine();
