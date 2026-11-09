// Every sound is synthesised with WebAudio: brick clicks, chuffs, whistles, the station bell, coins,
// and a little music-box tune. Nothing to download.
export class Sound {
  constructor() { this.ctx = null; this.on = true; this.music = true; this.nextNote = 0; this.step = 0; }
  start() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.out = this.ctx.createGain(); this.out.gain.value = 0.5; this.out.connect(this.ctx.destination);
    this.musicOut = this.ctx.createGain(); this.musicOut.gain.value = 0.16; this.musicOut.connect(this.out);
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  get ready() { return this.ctx && this.on; }
  tone(freq, dur, { type = 'sine', vol = 0.3, at = 0, slide = 0, out } = {}) {
    if (!this.ready) return;
    const t = this.ctx.currentTime + at;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out || this.out);
    o.start(t); o.stop(t + dur + 0.05);
  }
  hiss(dur, { vol = 0.2, freq = 1200, q = 0.8, at = 0 } = {}) {
    if (!this.ready) return;
    const t = this.ctx.currentTime + at;
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  click() { this.tone(900 + Math.random() * 200, 0.05, { type: 'square', vol: 0.12 }); this.tone(1800, 0.03, { vol: 0.08, at: 0.02 }); }
  snap() { this.tone(520 + Math.random() * 80, 0.08, { type: 'triangle', vol: 0.25, slide: 1.6 }); this.hiss(0.05, { vol: 0.15, freq: 3000 }); }
  crunch() { this.hiss(0.25, { vol: 0.35, freq: 500, q: 0.6 }); this.tone(120, 0.2, { type: 'square', vol: 0.08, slide: 0.5 }); }
  chuff(vol = 0.12) { this.hiss(0.12, { vol, freq: 900, q: 0.7 }); }
  whistle() {
    for (const [f, a] of [[740, 0], [932, 0], [740, 0.32], [932, 0.32]]) this.tone(f, 0.28, { type: 'triangle', vol: 0.12, at: a });
    this.hiss(0.6, { vol: 0.05, freq: 2400, q: 2 });
  }
  bell() { this.tone(1320, 0.8, { vol: 0.15 }); this.tone(2640, 0.5, { vol: 0.06 }); this.tone(1320, 0.8, { vol: 0.12, at: 0.35 }); }
  coin() { this.tone(988, 0.08, { type: 'square', vol: 0.08 }); this.tone(1319, 0.25, { type: 'square', vol: 0.08, at: 0.07 }); }
  pop() { this.tone(300, 0.12, { type: 'sine', vol: 0.25, slide: 3 }); }
  chirp() { this.tone(2200, 0.06, { vol: 0.1, slide: 1.4 }); this.tone(2600, 0.06, { vol: 0.1, slide: 1.3, at: 0.09 }); }
  boing() { this.tone(220, 0.25, { type: 'triangle', vol: 0.2, slide: 2.5 }); }
  nope() { this.tone(220, 0.12, { type: 'square', vol: 0.08 }); this.tone(180, 0.15, { type: 'square', vol: 0.08, at: 0.1 }); }
  fanfare() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i === 3 ? 0.5 : 0.15, { type: 'triangle', vol: 0.18, at: i * 0.12 })); }
  splash() { this.hiss(0.5, { vol: 0.2, freq: 1800, q: 0.5 }); }
  creak() { this.tone(160, 0.4, { type: 'sawtooth', vol: 0.05, slide: 1.3 }); }

  // A slow music-box tune over I-vi-IV-V, quieter at night. Call every frame.
  tick(night) {
    if (!this.ready || !this.music) return;
    const now = this.ctx.currentTime;
    if (this.nextNote < now) this.nextNote = now + 0.05;
    while (this.nextNote < now + 0.2) {
      const chords = [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]];
      const chord = chords[Math.floor(this.step / 8) % 4];
      const pattern = [0, 1, 2, 1, 0, 2, 1, 2];
      const k = this.step % 8;
      let semis = chord[pattern[k]] + (k === 5 ? 12 : 0);
      if (this.step % 32 >= 24 && k === 7) semis += 2;
      const freq = 392 * Math.pow(2, semis / 12) / (night > 0.5 ? 2 : 1);
      this.tone(freq, 0.9, { type: 'sine', vol: k === 0 ? 0.5 : 0.32, at: this.nextNote - now, out: this.musicOut });
      if (k === 0) this.tone(freq / 2, 1.6, { type: 'triangle', vol: 0.25, at: this.nextNote - now, out: this.musicOut });
      this.nextNote += night > 0.5 ? 0.5 : 0.36;
      this.step++;
    }
  }
}
