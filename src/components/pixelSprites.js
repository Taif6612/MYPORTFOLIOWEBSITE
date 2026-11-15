/* People as hand-drawn pixel sprites instead of boxes: chibi RPG figures with a dark outline and three tones per
   material, drawn here as rows of letters (one letter per pixel, '.' is empty) and painted into one small atlas.

   Each sprite is a quad that stands upright and turns to face the camera. Where the camera's pixel is close to the
   size a figure was drawn for, one texel covers exactly one art pixel (or 2, 3...) and the feet snap to the pixel
   grid, so the drawing comes out exactly as written; elsewhere (far away, or a phone's finer grid) it keeps its size.
   The quads are lit as if they were the ground they stand on (normal straight up), so they dim at night and warm
   under a lamp like everything round them. They write alpha 0 into the colour target, which tells the outline pass
   to leave them alone: they carry their own outline. */
import * as THREE from "three";

// stack layers into a w x h grid: each layer is [rows, dx, dy]; '.' keeps what is underneath
const stack = (w, h, layers) => {
  const g = Array.from({ length: h }, () => Array(w).fill("."));
  for (const [rows, dx = 0, dy = 0] of layers) {
    if (!rows) continue;
    rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const ch = row[x], yy = y + dy, xx = x + dx; if (ch !== "." && yy >= 0 && yy < h && xx >= 0 && xx < w) g[yy][xx] = ch; } });
  }
  return g;
};
const mirror = (rows, c2) => rows.map((r) => { const a = Array(20).fill("."); for (let x = 0; x < r.length; x++) if (c2 - x >= 0 && c2 - x < 20) a[c2 - x] = r[x]; return a.join(""); });
const swap = (rows, map) => rows.map((r) => r.replace(/./g, (c) => map[c] ?? c));

/* ---------- the street people: 20 x 40 cells, the figure (32 rows) in rows 8-39, an umbrella above ---------- */
// F = three-quarter front, facing left (walking down the screen); B = three-quarter back, facing right (walking up it).
// Frames: 0 step, 1 pass, 2 the other step, 3 pass. Steps sit a pixel lower (the bob).
// Letters: k outline · H h j hair (base, shade, light) · S s skin · e i eye (lid, iris) · m mouth · T t c top (base,
// shade, collar) · b belt · P p q bottoms · F shoes · D d dupatta · C x cap · B beard · V v umbrella · W cup
const HEAD = {
  F: {
    short: [
      ".......kkkkkk.......",
      ".....kkjjjHHHkk.....",
      "....kjjHHHHHHHHk....",
      "...kjHHHHHHHHHHhk...",
      "...kHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHhhhk..",
      "..kHHHHHHHHHHhhhhk..",
      "..kHHHSHHHHSHHhhhk..",
      "..kHSSSSSSSSSShhhk..",
      "..kSSSeSSSSeSShhk...",
      "..kSSSiSSSSiSsshk...",
      "...kSSSSSSSSssk.....",
      "....kSSSmmSssk......",
      ".....kkksssk........",
    ],
    long: [
      ".......kkkkkk.......",
      ".....kkjjjHHHkk.....",
      "....kjjHHHHHHHHk....",
      "...kjHHHHHHHHHHhk...",
      "...kHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHhhhk..",
      "..kHHHHHHHHHHhhhhk..",
      "..kHHHHSHHHSHHhhhk..",
      "..kHHSSSSSSSSShhhk..",
      "..kHSSeSSSSeSShhhk..",
      "..kHSSiSSSSiSshhhk..",
      "..kHkSSSSSSSsshhhk..",
      "..kHkkSSmmSsskhhhk..",
      "...k.kkksssk.khhk...",
    ],
    hijab: [
      ".......kkkkkk.......",
      ".....kkjjjHHHkk.....",
      "....kjjHHHHHHHHk....",
      "...kjHHHHHHHHHHhk...",
      "...kHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHhhhk..",
      "..kHHHkkkkkkkHhhhk..",
      "..kHHkSSSSSSSkhhhk..",
      "..kHkSSSSSSSSShhhk..",
      "..kHkSSeSSSSeShhk...",
      "..kHkSSiSSSSishhk...",
      "..kHHkSSSSSSskhhk...",
      "..kHHHkSSmmskHhhk...",
      "..kjHHHkkkkkHHhhk...",
    ],
  },
  B: {
    short: [
      ".......kkkkkk.......",
      ".....kkjjjHHHkk.....",
      "....kjjjHHHHHHHk....",
      "...kjjHHHHHHHHHhk...",
      "...kjHHHHHHHHHHhhk..",
      "..kjHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHhhSk..",
      "..khHHHHHHHHHhhSsk..",
      "...khHHHHHHHhhhsk...",
      "...khhHHHHHhhhssk...",
      "....khhhhhhhhssk....",
      ".....kkksssskk......",
    ],
    long: [
      ".......kkkkkk.......",
      ".....kkjjjHHHkk.....",
      "....kjjjHHHHHHHk....",
      "...kjjHHHHHHHHHhk...",
      "...kjHHHHHHHHHHhhk..",
      "..kjHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHhhSk..",
      "..kHHHHHHHHHHHhhsk..",
      "..kHHHHHHHHHHhhhk...",
      "..kHHHHHHHHHHhhhk...",
      "..kHHHHHHHHHHhhhk...",
    ],
    hijab: [
      ".......kkkkkk.......",
      ".....kkjjjHHHkk.....",
      "....kjjjHHHHHHHk....",
      "...kjjHHHHHHHHHhk...",
      "...kjHHHHHHHHHHhhk..",
      "..kjHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHHhhk..",
      "..kHHHHHHHHHHHhhhk..",
      "..kHHHHHHHHHHHhhhk..",
      "..kHHHHHHHHHHHhhhk..",
      "..kHHHHHHHHHHhhhk...",
      "..kHHHHHHHHHhhhhk...",
      "..kjHHHHHHHHhhhhk...",
    ],
  },
};
// what hangs over the shoulders, drawn after the torso (rows from the torso's top)
const DRAPE = {
  F: {
    long: null,
    hijab: ["..kHHHHHHHHHHhhhk...", "...kHHHHHHHHHhhk....", "....kkHHHHHHhkk.....", "......kkkkkkk......."],
  },
  B: {
    long: ["...kHHHHHHHHHhhk....", "...kHHHHHHHHHhhk....", "...kHHHHHHHHhhhk....", "....kHHHHHHHhhk.....", ".....kkhhhhhkk......"],
    hijab: ["..kHHHHHHHHHHhhhk...", "..kHHHHHHHHHHhhhk...", "...kHHHHHHHHHhhk....", "....kkHHHHHHhkk.....", "......kkkkkkk......."],
  },
};
const BACKHAIR_F = ["", "", "", "", "", "", "", "", "..............hhk...", "..............hhhk..", "..............hhhk..", "..............hhhk..", "..............hhhk..", "..............hhhk..", ".............khhhk..", "..............khhk..", "..............khhk..", "...............kk..."];
const CAP = [".......kkkkkk.......", ".....kkCCCCCCkk.....", "....kCCCCCCCCCCk....", "...kCCxCCxCCxCCxk...", "...kkkkkkkkkkkkkk..."];
const BEARD_F = ["", "", "", "", "", "", "", "", "", "", "", "...kBSSSSSSSBBk.....", "....kBBBmmBBBk......", ".....kBBBBBBk.......", "......kkBBkk........"];

const TORSO = {
  // arms by the sides (passing)
  P: [
    ".....kkTTcTTTkk.....",
    "....kTTTTcTTTTTk....",
    "...kTkTTTcTTTTkTk...",
    "...kTkTTTcTTTTkTtk..",
    "...kTkTTTTTTTTkTtk..",
    "...kTkTTTTTTTtkTtk..",
    "...kSkTTTTTTTtkTtk..",
    "....kkkTTTTTtkkSsk..",
  ],
  // near arm forward over the body, far arm back out of sight
  A: [
    ".....kkTTcTTTkk.....",
    "....kTTTTcTTTTTk....",
    "....kkTTTcTTTkTTk...",
    "....kTTTTcTTTTkTtk..",
    "....kTTTTTTTTkTtk...",
    "....kTTTTTTTkTtk....",
    "....kTTTTTTTkSsk....",
    ".....kkTTTTTtkk.....",
  ],
  // near arm back, far arm forward
  B: [
    ".....kkTTcTTTkk.....",
    "....kTTTTcTTTTTk....",
    "..kTkTTTTcTTTTkTk...",
    "..kTkTTTTcTTTTkTk...",
    "..kTkTTTTTTTTTkTk...",
    ".kSkkTTTTTTTTtkTtk..",
    "....kTTTTTTTTtkkTtk.",
    ".....kkTTTTTtk.kSsk.",
  ],
};
const LEGS = {
  pants: {
    P: [".....kbbbbbbbk......", ".....kPPPPPPPk......", ".....kPPPkPPPk......", ".....kPPpkPPpk......", ".....kPPpkPPpk......", ".....kPPpkPPpk......", ".....kPPpkPPpk......", ".....kPPpkPPpk......", "....kFFFFkFFFk......", "....kkkkkkkkkk......"],
    A: ["", ".....kbbbbbbbk......", "....kpppkkPPPk......", "....kpppk.kPPk......", "...kpppk..kPPPk.....", "...kppk...kPPpk.....", "..kqqqk....kPPpk....", "..kqqk.....kPPpk....", ".kFFFk.....kFFFk....", ".kkkkk.....kkkkk...."],
    B: ["", ".....kbbbbbbbk......", "....kPPPkkpppk......", "....kPPPk.kppk......", "...kPPPk..kpppk.....", "...kPPk...kpppk.....", "..kPPpk....kqqqk....", "..kPPk.....kqqqk....", ".kFFFk.....kFFFk....", ".kkkkk.....kkkkk...."],
  },
  lungi: {
    P: [".....kPpPPpPPk......", ".....kPqPPqPPk......", "....kPPqPPqPPPk.....", "....kpqqppqpppk.....", "....kPPqPPqPPPk.....", "....kPPqPPqPPPk.....", "....kpqqppqpppk.....", "....kPPqPPqPPPk.....", "....kkFFFkFFFkk.....", "....kkkkkkkkkk......"],
    A: ["", ".....kPpPPpPPk......", "....kPPqPPqPPPk.....", "...kPPPqPPqPPPPk....", "...kppqqppqppppk....", "...kPPPqPPqPPPPk....", "...kPPPqPPqPPPPk....", "...kppqqppqppppk....", "..kFFFkkkkkkFFFk....", "..kkkkk....kkkkk...."],
  },
};
LEGS.lungi.B = LEGS.lungi.A;
// a long top (panjabi, kameez) over the thighs, from the waist
const SKIRT = {
  P: [".....kTTTTTTTk......", ".....kTTTTTTTk......", ".....kTTTTTTTk......", "....kTTTTkTTTTk.....", "....kkkkk.kkkkk....."],
  A: [".....kTTTTTTTk......", "....kTTTTTTTTk......", "....kTTTTTTTTTk.....", "...kTTTTkkTTTTk.....", "...kkkkk..kkkkk....."],
};
SKIRT.B = SKIRT.A;
// a dupatta across the chest, left shoulder to right hip
const DUPATTA = ["....kDDDk...........", "....kDDDDDk.........", ".....kdDDDDDk.......", ".......kdDDDDk......", ".........kdDDk......", "..........kdDk......", "...........kk......."];
const DUPATTA_B = ["...........kDDDk....", ".........kDDDDDk....", ".......kDDDDDdk.....", ".....kDDDDdk........", "....kDDdk...........", "....kddk............"];
const UMBRELLA = [
  "......kkkkkkkk......",
  "....kkVVVVVVVVkk....",
  "...kVVVVvVVVVVVVk...",
  "..kVVVVvVVVVvVVVVk..",
  ".kVVVVvVVVVVvVVVVVk.",
  ".kvVVvVVVVVVvVVVVvk.",
  ".kkkvkkkkvkkkkvkkkk.",
  "..........k.........",
];
// sitting on a low stool, a cup of tea in the near hand
const SIT_LEGS = ["", "", "", "", ".....kPPPPPPPk......", "..kkkPPPPPPPPk......", ".kPPPPPPPpppk.......", ".kPPkkkkkkkk........", ".kFFk...............", ".kkkk..............."];
const CUP = ["", "................kWk.", "................kWk.", ".................k.."];

const PEOPLE = [
  // hair H h j · skin S s · top T t c · bottoms P p q · shoes F · extras
  { hair: "short", top: "shirt", bottom: "pants", pal: { H: "#2a2226", h: "#18131a", j: "#4a3d44", S: "#a8734f", s: "#86593c", T: "#4b7bb5", t: "#355d8e", c: "#2c4e78", P: "#3a3b4a", p: "#2a2b37", q: "#1e1f28", F: "#2b2220" } },
  { hair: "long", top: "kameez", bottom: "pants", dupatta: true, pal: { H: "#2a1d1c", h: "#170f10", j: "#4f3a33", S: "#b98863", s: "#94664a", T: "#b8457a", t: "#8e3160", c: "#8e3160", P: "#e9dfcc", p: "#c9bda6", q: "#a89c86", F: "#6b3f2a", D: "#e8b83a", d: "#b88c22" } },
  { hair: "hijab", top: "kameez", bottom: "pants", pal: { H: "#3f8a8a", h: "#2c6767", j: "#66b3ad", S: "#a8734f", s: "#86593c", T: "#2f3f6b", t: "#22305a", c: "#22305a", P: "#2f3f6b", p: "#22305a", q: "#18223f", F: "#2a2220" } },
  { hair: "short", cap: true, beard: true, top: "kameez", bottom: "pants", pal: { H: "#8d8b88", h: "#6a6866", j: "#b3b0ab", S: "#8d5f42", s: "#6e4630", T: "#ece8de", t: "#c9c2b2", c: "#c9c2b2", P: "#e2dccf", p: "#bfb7a6", q: "#a39b8b", F: "#5a3b28", C: "#f4f1ea", x: "#cfc8b8", B: "#e9e6e0" } },
  { hair: "short", top: "shirt", bottom: "lungi", pal: { H: "#1f1a1c", h: "#120e10", j: "#3b3238", S: "#7d5238", s: "#5f3c28", T: "#e7e2d6", t: "#c4bdae", c: "#c4bdae", P: "#2f6b4a", p: "#235238", q: "#3d8a5e", F: "#5a3b28" } },
  { hair: "short", top: "shirt", bottom: "pants", pal: { H: "#3a2a22", h: "#22170f", j: "#6a5040", S: "#b98863", s: "#94664a", T: "#e0a83a", t: "#b9842a", c: "#b9842a", P: "#3f5f8f", p: "#2e4a72", q: "#1f3354", F: "#e9e6e0" } },
  { hair: "long", top: "shirt", bottom: "pants", pal: { H: "#3b2620", h: "#24150f", j: "#6a463a", S: "#a8734f", s: "#86593c", T: "#c8463c", t: "#9e3229", c: "#9e3229", P: "#3a4a6a", p: "#2b3852", q: "#1d273b", F: "#2a2220" } },
  { hair: "short", top: "shirt", bottom: "pants", pal: { H: "#1d1715", h: "#100c0b", j: "#3a302c", S: "#9b6b4b", s: "#7d5238", T: "#e9edf2", t: "#c3c9d3", c: "#9aa3b0", P: "#24252e", p: "#191a21", q: "#101116", F: "#1a1a1e" } },
];
const BROLLY = [["#c8463c", "#9e3229"], ["#3f9a7a", "#2c7259"], ["#e0a83a", "#b9842a"], ["#3e6e8e", "#2c5270"], ["#e9e2d3", "#c4bdae"]];
const BASE = { k: "#221a24", e: "#1a1420", i: "#4a3226", m: "#6e3a2c", b: "#3a2a20", W: "#f4f1ea" };

const PER = 17; // cells per person: F walk x4, B walk x4, each with and without umbrella, and sitting
function personCells(p, umbrellaPal) {
  const out = [];
  for (const v of ["F", "B"]) for (let f = 0; f < 4; f++) for (const umb of [0, 1]) {
    const step = f % 2 === 0, dy = step ? 1 : 0, key = step ? (f === 0 ? "A" : "B") : "P";
    let torso = TORSO[key], legs = LEGS[p.bottom][key], skirt = p.top === "kameez" ? SKIRT[key] : null;
    if (v === "B") { torso = swap(torso, { c: "T" }); legs = mirror(legs, 18); skirt = skirt && mirror(skirt, 18); }
    const L = [];
    if (umb) L.push([UMBRELLA, v === "F" ? -1 : 1, dy]);
    if (v === "F" && p.hair === "long") L.push([BACKHAIR_F, 0, 8 + dy]);
    L.push([legs, 0, 30], [torso, 0, 22 + dy]);
    if (skirt) L.push([skirt, 0, 30 + dy]);
    if (p.dupatta) L.push([v === "F" ? DUPATTA : DUPATTA_B, 0, 22 + dy]);
    L.push([HEAD[v][p.hair], 0, 8 + dy]);
    if (p.cap) L.push([CAP, 0, 8 + dy]);
    if (p.beard && v === "F") L.push([BEARD_F, 0, 8 + dy]);
    const drape = DRAPE[v][p.hair]; if (drape) L.push([drape, 0, 22 + dy]);
    out.push({ g: stack(20, 40, L), pal: { ...BASE, ...p.pal, ...(umb ? { V: umbrellaPal[0], v: umbrellaPal[1] } : {}) } });
  }
  const L = [[SIT_LEGS, 0, 30], [TORSO.P, 0, 26], [p.top === "kameez" ? SKIRT.P.slice(0, 2) : null, 0, 34], [HEAD.F[p.hair], 0, 12], [CUP, 0, 30]];
  if (p.cap) L.push([CAP, 0, 12]);
  if (p.beard) L.push([BEARD_F, 0, 12]);
  out.push({ g: stack(20, 40, L), pal: { ...BASE, ...p.pal } });
  return out;
}
// index of a street cell: person, view ("F" | "B" | "S" sitting), walk frame 0-3, umbrella
export const personCell = (i, view, frame = 0, umb = false) => (i % PEOPLE.length) * PER + (view === "S" ? 16 : (view === "B" ? 8 : 0) + frame * 2 + (umb ? 1 : 0));
export const streetSheet = () => sheet(PEOPLE.flatMap((p, i) => personCells(p, BROLLY[i % BROLLY.length])), 20, 40);

/* ---------- tiny Taif at his desk: 36 x 44 cells, seen from behind his right shoulder, facing the monitor ---------- */
// The sprite's bottom row sits on the chair seat. Typing (two frames), turned round waving (two), asleep on the desk.
const T_HEAD = [
  "..............kkkkkkk",
  "...........kkkjjjjHHHkk",
  ".........kkjjjHHHHHHHHHkk",
  "........kjjHHHHhHHHHHHHHHk",
  ".......kjHHHHHhHHHHHHhHHHHk",
  ".......kHHHHHhHHHHHHhHHHHHhk",
  "......kHjHHHhHHHHHHhHHHHHHhk",
  "......kHHHHHHHHHHHHHHHHHHHhhk",
  "......khHHHHHHHHHHHHHHHHHHhSk",
  "......khHHHHHHHHHHHHHHHHHhhSsk",
  "......khhHHHHHHHHHHHHHHHHhSSsk",
  ".......khhHHHHHHHHHHHHHHhhBSk",
  ".......khhhHHHHHHHHHHHhhhBBk",
  "........kkhhhhhhhhhhhhhhBBk",
  "..........kkkhhhhhhhhhkkkk",
];
// turned round to the camera: the face on the right, an ear in the middle, a short beard, smiling
const T_FACE = [
  "..............kkkkkkk",
  "...........kkkjjjjHHHkk",
  ".........kkjjjHHHHHHHHHkk",
  "........kjjHHHHhHHHHHHHHHk",
  ".......kjHHHHHhHHHHHHHHHHHk",
  ".......kHHHHHhHHHHHHHHSHHHHk",
  "......khHHHHHHHHHHHSSSSHSSHk",
  "......khHHHHHHHSSSSSSSSSSSSk",
  "......khhHHHHHSSSSeSSSSSeSSk",
  "......khhHHHHsSSSSiSSSSSiSSk",
  ".......khhHHSsSSSSSSSSSSSSk",
  ".......khhhBBBSSSSkmmkSSBBk",
  "........khBBBBBBSSSSSSBBBk",
  ".........kkBBBBBBBBBBBBkk",
  "...........kkkkkkkkkkkk",
];
const T_BODY = [
  "............kssssssssk",
  ".........kkkTTTsssssTTTkkk",
  ".......kkTTTTTTTTTTTTTTTTTkk",
  "......kTTTuuTTTTTTTTTTTTTTTTk",
  ".....kTTTuuTTTTTTTTTTTTTTTTTTk",
  ".....kTTuuTTTTTTTTTTTTTTTTTTttk",
  "....kTTuuTTTTTTTTTTTTTTTTTTTTttk",
  "....kTTuTTkTTTTTTTTtTTTTTTTTkTttk",
  "....kTTTTTkTTTTTTTTtTTTTTTTTkTTtk",
  "....kTTTTTkTTTTTTTTtTTTTTTTTkTTtk",
  "....kkkkkkkTTTTTTTTtTTTTTTTTkkkkk",
  "....kSSSSskTTTTTTTTtTTTTTTTTk",
  ".....kSSskTTTTTTTTTtTTTTTTTTk",
  "......kkkTTTTTTTTTTtTTTTTTTTk",
  "........kTTTTTTTTTTtTTTTTTTTk",
  "........kTTTTTTTTTTtTTTTTTTtk",
  "........kTTTTTTTTTTtTTTTTTTtk",
  "........ktTTTTTTTTTtTTTTTTTtk",
  "........ktTTTTTTTTTtTTTTTTttk",
  "........kttTTTTTTTTtTTTTTTttk",
  "........kkPPPPPPPPPPPPPPPPPkk",
  "........kPPPPPPPPPPPPPPPPPPPk",
  "........kPPPPPPPPPPPPPPPPPPPk",
  "........kpPPPPPPPPPPPPPPPPPpk",
  "........kkkkkkkkkkkkkkkkkkkkk",
];
// the near elbow, out to the side, a pixel lower on every other tap
const T_ELBOW = ["", "", "", "", "", "", "", "", "", "", "............................kSSsk", "............................kSssk", ".............................kkk"];
// the near arm up, hand open, waving
const T_WAVE = [
  ["..............................kk", ".............................kSSk", "............................kSSSk", "............................kSSk", ".............................kSk", ".............................kSk", "............................kSsk", "............................kSsk", "...........................kTTtk", "...........................kTTtk", "..........................kTTtk"],
  ["................................kk", "...............................kSSk", "..............................kSSSk", "..............................kSSk", "..............................kSk", ".............................kSsk", ".............................kSsk", "............................kSsk", "...........................kTTtk", "...........................kTTtk", "..........................kTTtk"],
];
// asleep: head down on folded arms, shoulders up round it
const T_SLEEP = [
  "...............kkkkkk",
  "............kkkjjjHHHkk",
  "..........kkjjHHHHHHHHHkk",
  "........kkjHHHHHHHHHHHHHHkk",
  "......kkTkHHHHHHHHHHHHHHHHkTkk",
  ".....kTTTkhHHHHHHHHHHHHHHhkTTTk",
  "....kTTuTTkhhHHHHHHHHHHhhkTTTTtk",
  "...kTTuTTTTkkhhhhhhhhhhkkTTTTTtk",
  "...kTuTTTTTTTkkkkkkkkkkTTTTTTTtk",
  "...kTTTTTTTTTTTTTTTTTTTTTTTTTTtk",
  "...kTTTTTTTTTTTTTTTTTTTTTTTTTTtk",
  "...kTTTTTTTTTTTTTTtTTTTTTTTTTttk",
  "....kTTTTTTTTTTTTTtTTTTTTTTTTtk",
  ".....kTTTTTTTTTTTTtTTTTTTTTTTtk",
  "......kTTTTTTTTTTTtTTTTTTTTTtk",
  ".......kTTTTTTTTTTtTTTTTTTTTtk",
  "........kTTTTTTTTTtTTTTTTTTttk",
  "........ktTTTTTTTTtTTTTTTTTtk",
  "........kttTTTTTTTtTTTTTTTttk",
  "........kkPPPPPPPPPPPPPPPPPkk",
  "........kPPPPPPPPPPPPPPPPPPPk",
  "........kPPPPPPPPPPPPPPPPPPPk",
  "........kpPPPPPPPPPPPPPPPPPpk",
  "........kkkkkkkkkkkkkkkkkkkkk",
];
const TAIF_PAL = { k: "#1a1418", H: "#2e2328", h: "#19131a", j: "#4f3f49", S: "#9b6b4b", s: "#7d5238", e: "#1a1420", i: "#3a2a22", m: "#5a2c22", B: "#1d1715", T: "#b9a4cf", t: "#9580b0", u: "#d6c8e8", P: "#2b2c3e", p: "#1d1e2b" };
export const TAIF = { type0: 0, type1: 1, wave0: 2, wave1: 3, sleep: 4 };
export const taifSheet = () => sheet([
  stack(36, 44, [[T_BODY, 0, 19], [T_ELBOW, 0, 19], [T_HEAD, 0, 4]]),
  stack(36, 44, [[T_BODY, 0, 19], [T_ELBOW, 0, 20], [T_HEAD, 0, 4]]),
  stack(36, 44, [[T_BODY, 0, 19], [T_WAVE[0], 0, 11], [T_FACE, 0, 4]]),
  stack(36, 44, [[T_BODY, 0, 19], [T_WAVE[1], 0, 11], [T_FACE, 0, 4]]),
  stack(36, 44, [[T_SLEEP, 0, 20]]),
].map((g) => ({ g, pal: TAIF_PAL })), 36, 44);

/* ---------- the atlas ---------- */
function sheet(cells, cw, ch) {
  const cols = Math.min(cells.length, 16), rows = Math.ceil(cells.length / cols), W = cols * cw, H = rows * ch;
  const data = new Uint8Array(W * H * 4);
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); // the texture is sRGB: the bytes go in as written
  cells.forEach(({ g, pal }, n) => {
    const ox = (n % cols) * cw, oy = Math.floor(n / cols) * ch;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const c = g[y][x]; if (c === "." || !pal[c]) continue;
      const i = ((H - 1 - (oy + y)) * W + ox + x) * 4, [r, gg, b] = rgb(pal[c]);
      data[i] = r; data[i + 1] = gg; data[i + 2] = b; data[i + 3] = 255;
    }
  });
  const tex = new THREE.DataTexture(data, W, H); tex.colorSpace = THREE.SRGBColorSpace; tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.needsUpdate = true;
  return { tex, cols, rows, cw, ch, W, H, n: cells.length };
}

/* ---------- the quads ---------- */
// unit: world units per texel (as seen on screen) at the size the figure was drawn for
export function spriteLayer({ sheet: sh, count, grad, unit, layer = 1, parent }) {
  const geo = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0); // anchored at the feet
  const cell = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3); geo.setAttribute("aCell", cell);
  const mat = new THREE.MeshToonMaterial({ map: sh.tex, gradientMap: grad, alphaTest: 0.5 });
  mat.onBeforeCompile = (s) => {
    s.uniforms.cellSize = { value: new THREE.Vector2(sh.cw / sh.W, sh.ch / sh.H) };
    s.vertexShader = "attribute vec3 aCell;\nuniform vec2 cellSize;\n" + s.vertexShader
      .replace("#include <uv_vertex>", "#include <uv_vertex>\nvMapUv = vec2(aCell.z > 0.5 ? 1.0 - uv.x : uv.x, uv.y) * cellSize + aCell.xy;")
      .replace("#include <defaultnormal_vertex>", "vec3 transformedNormal = normalize(mat3(viewMatrix) * vec3(0.0, 1.0, 0.0));"); // lit like the ground under it
    s.fragmentShader = s.fragmentShader.replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a = 0.0;"); // "no outline here" for the post pass
  };
  mat.customProgramCacheKey = () => "sprite";
  const mesh = new THREE.InstancedMesh(geo, mat, count); mesh.frustumCulled = false; mesh.castShadow = mesh.receiveShadow = false;
  mesh.layers.set(layer); mesh.renderOrder = 4; parent.add(mesh);
  const items = Array.from({ length: count }, () => ({ on: false, p: new THREE.Vector3(), c: 0, flip: false, fwd: 0 }));
  const _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _v = new THREE.Vector3(), _r = new THREE.Vector3(), _u = new THREE.Vector3(), _f = new THREE.Vector3(), _m = new THREE.Matrix4(), ZERO = new THREE.Matrix4().makeScale(0, 0, 0), Y = new THREE.Vector3(0, 1, 0);
  return {
    mesh,
    // feet at x, y, z; cell c of the sheet; flip mirrors it; fwd nudges it toward the camera (onto a seat)
    set(i, x, y, z, c, flip = false, fwd = 0) { const it = items[i]; it.on = true; it.p.set(x, y, z); it.c = c; it.flip = flip; it.fwd = fwd; },
    hide(i) { items[i].on = false; },
    // after the camera is placed for the frame: face it, size the texels, snap the feet to the grid
    update(cam, lw, lh) {
      _r.set(1, 0, 0).applyQuaternion(cam.quaternion); _u.set(0, 1, 0).applyQuaternion(cam.quaternion); cam.getWorldDirection(_f);
      const upp = (cam.top - cam.bottom) / lh, uppX = (cam.right - cam.left) / lw, cosEl = Math.max(0.2, Math.hypot(_f.x, _f.z));
      // world size of one texel on screen: whole pixels when that is near the drawn size, otherwise the drawn size
      const r = unit / upp, n = Math.round(r), snap = n >= 1 && Math.abs(r - n) < 0.25, k = snap ? n * upp : unit;
      _q.setFromAxisAngle(Y, Math.atan2(-_f.x, -_f.z)); _s.set(sh.cw * k, (sh.ch * k) / cosEl, 1); // upright, so its height is foreshortened: stretched back
      for (let i = 0; i < count; i++) {
        const it = items[i];
        if (!it.on) { mesh.setMatrixAt(i, ZERO); continue; }
        _p.copy(it.p); if (it.fwd) _p.addScaledVector(_v.set(-_f.x, 0, -_f.z).normalize(), it.fwd);
        if (snap) { // feet on a pixel corner, so every texel covers whole pixels
          _v.copy(_p).project(cam); const px = ((_v.x + 1) / 2) * lw, py = ((_v.y + 1) / 2) * lh;
          _p.addScaledVector(_r, (Math.round(px) - px) * uppX).addScaledVector(_u, (Math.round(py) - py) * upp);
        }
        mesh.setMatrixAt(i, _m.compose(_p, _q, _s));
        cell.setXYZ(i, (it.c % sh.cols) / sh.cols, (sh.rows - 1 - Math.floor(it.c / sh.cols)) / sh.rows, it.flip ? 1 : 0);
      }
      mesh.instanceMatrix.needsUpdate = true; cell.needsUpdate = true;
    },
  };
}
export { sheet as spriteSheet, stack as spriteStack };
