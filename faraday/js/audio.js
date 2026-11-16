// Small synthesized sound effects. Nothing is loaded; every sound is built from oscillators
// and noise when it plays. Starts muted until the first user gesture (browser rule).
let ac = null, master = null, noiseBuf = null, ambient = null;
export const audio = { volume: 0.5, muted: false };

export function initAudio() {
  if (ac) return;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.value = audio.muted ? 0 : audio.volume;
    master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 1.5, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
    startAmbient();
  } catch { ac = null; }
}
export function setMuted(m) { audio.muted = m; if (master) master.gain.value = m ? 0 : audio.volume; }

function env(g, t, a, peak, dec) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
}
function tone(type, f0, f1, dur, vol, delay = 0) {
  if (!ac) return;
  const t = ac.currentTime + delay;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, 0.005, vol, dur);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, vol, freq, q = 1, type = 'bandpass', delay = 0) {
  if (!ac) return;
  const t = ac.currentTime + delay;
  const s = ac.createBufferSource(); s.buffer = noiseBuf;
  const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ac.createGain(); env(g, t, 0.003, vol, dur);
  s.connect(f).connect(g).connect(master);
  s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
}

function startAmbient() {
  // wind: filtered noise, slowly swelling
  const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420;
  const g = ac.createGain(); g.gain.value = 0.035;
  const lfo = ac.createOscillator(), lg = ac.createGain();
  lfo.frequency.value = 0.07; lg.gain.value = 0.02;
  lfo.connect(lg).connect(g.gain);
  s.connect(f).connect(g).connect(master);
  s.start(); lfo.start();
  ambient = { g, f };
}
export function setAmbient(rain, night) {
  if (!ambient) return;
  ambient.f.frequency.value = rain ? 2200 : 420;
  ambient.g.gain.value = rain ? 0.06 : night ? 0.028 : 0.035;
}

export const sfx = {
  swing() { noise(0.12, 0.12, 900, 0.7); },
  hit() { tone('square', 220, 90, 0.12, 0.12); noise(0.08, 0.25, 2600, 2); tone('triangle', 1400, 900, 0.18, 0.05); },
  kill() { tone('sawtooth', 600, 60, 0.5, 0.12); noise(0.4, 0.2, 1500, 0.8); tone('square', 1800, 200, 0.25, 0.04, 0.05); },
  hurt() { tone('sine', 140, 60, 0.22, 0.4); noise(0.12, 0.25, 500, 1); },
  spotted() { tone('square', 880, 880, 0.08, 0.06); tone('square', 1320, 1320, 0.12, 0.06, 0.1); },
  broadcast() { tone('sawtooth', 300, 1200, 0.5, 0.06); tone('sawtooth', 1200, 300, 0.5, 0.05, 0.5); },
  door() { tone('triangle', 180, 120, 0.25, 0.08); noise(0.08, 0.1, 300, 1); },
  bash() { noise(0.18, 0.35, 220, 0.8); tone('sine', 90, 50, 0.2, 0.25); },
  glass() { for (let k = 0; k < 6; k++) tone('triangle', 3000 + Math.random() * 3000, 1500, 0.15, 0.04, k * 0.03); noise(0.3, 0.2, 5000, 1); },
  gunshot() { noise(0.5, 0.9, 1200, 0.4, 'lowpass'); tone('sine', 120, 40, 0.3, 0.5); },
  pulse() { tone('sawtooth', 2000, 80, 0.6, 0.15); noise(0.5, 0.2, 3000, 4); },
  clatter() { for (let k = 0; k < 3; k++) tone('triangle', 1800 + k * 300, 1100, 0.08, 0.06, k * 0.07); },
  eat() { noise(0.08, 0.1, 1800, 2); noise(0.08, 0.1, 1600, 2, 'bandpass', 0.15); },
  drink() { for (let k = 0; k < 3; k++) tone('sine', 400 + k * 60, 300, 0.1, 0.06, k * 0.14); },
  pickup() { tone('triangle', 660, 990, 0.08, 0.05); },
  craft() { tone('triangle', 520, 520, 0.08, 0.06); tone('triangle', 780, 780, 0.12, 0.06, 0.09); },
  death() { tone('sine', 220, 40, 1.8, 0.3); tone('sine', 110, 30, 2.5, 0.25); },
  hammer() { noise(0.05, 0.3, 1800, 3); tone('square', 300, 200, 0.05, 0.05); },
};
