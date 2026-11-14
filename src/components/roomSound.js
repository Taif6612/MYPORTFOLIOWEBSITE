/* Sounds for the pixel room, synthesized (no audio files, nothing to download): a short sound for each thing you click,
   and a little car-stereo loop while a car's close-up is open. WebAudio runs on its own audio thread, so none of this
   touches the room's frame rate. One AudioContext, made on the first click (browsers only allow sound after a gesture). */
let ctx = null, master = null, noiseBuf = null, music = null;

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.16; master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume();
}

const tone = (f, t, dur, type = "square", vol = 0.3, slide = 0, out = master) => {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02);
};
const hiss = (t, vol = 0.3, dur = 0.04, freq = 6000, out = master) => { // a short burst of noise: a click, a shutter, a hi-hat
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; f.type = "highpass"; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f).connect(g).connect(out); s.start(t); s.stop(t + dur + 0.01);
};
const seq = (t, notes, gap, dur, type, vol) => notes.forEach((f, i) => tone(f, t + i * gap, dur, type, vol));

const SOUNDS = {
  cat: (t) => { tone(620, t, 0.32, "sine", 0.45, 1.45); tone(900, t + 0.2, 0.3, "sine", 0.3, 0.7); }, // a meow: up, then down
  duck: (t) => { tone(880, t, 0.09, "square", 0.25, 1.5); tone(1320, t + 0.11, 0.09, "square", 0.22, 0.7); }, // squeak-squeak
  mug: (t) => { tone(2600, t, 0.07, "triangle", 0.35); tone(3400, t + 0.07, 0.14, "triangle", 0.2); }, // a spoon against the mug
  lamp: (t) => { hiss(t, 0.4, 0.02, 3000); hiss(t + 0.05, 0.25, 0.02, 2000); }, // the switch
  plant: (t) => tone(380, t, 0.2, "sine", 0.35, 2.2), // a pop as it grows
  pc: (t) => seq(t, [262, 330, 392, 523], 0.07, 0.25, "square", 0.12), // power on
  loq: (t) => { for (let i = 0; i < 7; i++) hiss(t + i * 0.06 + (i % 2) * 0.02, 0.3, 0.025, 4000); }, // a burst of typing
  asus: (t) => seq(t, [523, 784], 0.12, 0.28, "triangle", 0.28), // an old laptop's startup chime
  hp: (t) => seq(t, [659, 988], 0.12, 0.28, "triangle", 0.28),
  retro: (t) => { tone(110, t, 0.5, "sawtooth", 0.08); seq(t + 0.15, [392, 523, 659, 784], 0.09, 0.3, "sine", 0.22); }, // the console boots
  phone: (t) => seq(t, [1318, 1760], 0.12, 0.18, "sine", 0.3), // a notification
  watch: (t) => { tone(3000, t, 0.02, "square", 0.2); tone(2400, t + 0.5, 0.02, "square", 0.16); }, // tick... tock
  trophy: (t) => seq(t, [523, 659, 784, 1046], 0.08, 0.22, "square", 0.12), // a little fanfare
  degree: (t) => seq(t, [784, 988], 0.1, 0.3, "sine", 0.25),
  me: (t) => { tone(660, t, 0.08, "square", 0.18, 1.2); tone(880, t + 0.1, 0.1, "square", 0.16, 1.2); }, // "hi!"
  photo: (t) => tone(500, t, 0.1, "triangle", 0.25, 1.5),
  screen: (t) => tone(180, t, 0.65, "sine", 0.3, 6), // diving in
  frames: (t) => hiss(t, 0.45, 0.07, 2500), // a shutter
  album: (t) => { hiss(t, 0.45, 0.05, 2500); hiss(t + 0.08, 0.3, 0.05, 2500); },
  paper: (t) => hiss(t, 0.3, 0.18, 1200), // a page turning
  futon: (t) => tone(95, t, 0.28, "sine", 0.5, 0.6), // a soft thump
  lock: (t) => seq(t, [1900, 1900], 0.11, 0.06, "square", 0.18), // the car's lock chirp
  bus: (t) => { tone(233, t, 0.45, "sawtooth", 0.1); tone(294, t, 0.45, "sawtooth", 0.08); }, // horns
  bmw: (t) => { tone(415, t, 0.25, "sawtooth", 0.09); tone(523, t, 0.25, "sawtooth", 0.07); },
  cng: (t) => tone(587, t, 0.18, "square", 0.12),
  rickshaw: (t) => seq(t, [2100, 2100], 0.13, 0.25, "sine", 0.22), // a bicycle bell
  chime: (t) => tone(988, t, 0.35, "sine", 0.22), // a place on the map
};

export function play(name) {
  if (!ctx || ctx.state !== "running") return;
  (SOUNDS[name] || SOUNDS[name.replace(/\d+$/, "")] || SOUNDS.chime)(ctx.currentTime + 0.01);
}

// the car stereo: two bars looped (bass, lead, hi-hats), a different tune per car, a little muffled since it plays inside the car
const SONGS = {
  jeep: { bpm: 112, bass: [40, 0, 40, 0, 43, 0, 45, 0, 40, 0, 40, 0, 47, 0, 45, 43], lead: [64, 0, 67, 0, 69, 0, 67, 64, 0, 0, 62, 0, 64, 0, 0, 0] },
  crv: { bpm: 88, bass: [36, 0, 0, 36, 41, 0, 0, 41, 43, 0, 0, 43, 41, 0, 40, 0], lead: [72, 0, 76, 0, 79, 0, 76, 0, 77, 0, 76, 0, 74, 0, 0, 0] },
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

export function startMusic(kind) {
  if (!ctx || ctx.state !== "running" || music) return;
  const song = SONGS[kind] || SONGS.jeep, step = 60 / song.bpm / 2, bus = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 1700; bus.gain.value = 0.9; lp.connect(bus).connect(master);
  let i = 0, next = ctx.currentTime + 0.08;
  const tick = () => { // schedule a little ahead of time, so a slow main thread never makes it stutter
    while (next < ctx.currentTime + 0.3) {
      const b = song.bass[i % 16], l = song.lead[i % 16];
      if (b) tone(hz(b), next, step * 0.9, "triangle", 0.45, 0, lp);
      if (l) tone(hz(l), next, step * 0.8, "square", 0.08, 0, lp);
      if (i % 2) hiss(next, 0.12, 0.03, 7000, lp);
      next += step; i++;
    }
  };
  tick(); music = { timer: setInterval(tick, 100), bus };
}

export function stopMusic() {
  if (!music) return;
  const { timer, bus } = music; music = null; clearInterval(timer);
  bus.gain.setTargetAtTime(0, ctx.currentTime, 0.08); setTimeout(() => bus.disconnect(), 700);
}
