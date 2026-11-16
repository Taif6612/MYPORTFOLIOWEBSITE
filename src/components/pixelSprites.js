/* People as pixel sprites, drawn by code in a cozy lo-fi pixel-art style: natural proportions (the head about a sixth of
   the height), three tones per material lit from the upper left, darker lines where parts overlap, and a dark outline.

   Each figure is a skeleton in "figure space" (100 tall, feet on y = 100, centred on x = 50): head, shoulders, elbows,
   hands, hips, knees and ankles, filled in with capsules, ellipses and polygons, then painted into one small atlas.
   Two views cover every way a figure can face on screen: "f", three-quarter front facing left (coming down the
   screen), and "b", three-quarter back facing right (going up it). A sprite's flip mirrors either one, so
   "f" flipped faces down-right and "b" flipped faces up-left. "F" is full front, for a wave. Near limbs are the ones
   on the side the figure turns away from: the image's right in "f", its left in "b".

   Each sprite is a quad that stands upright and turns to face the camera. Where the camera's pixel is close to the
   size a figure was drawn for, one texel covers exactly one art pixel (or 2, 3...) and the feet snap to the pixel
   grid, so the drawing comes out exactly as made; elsewhere (far away, or a phone's finer grid) it keeps its size.
   The quads are lit as if they were the ground they stand on (normal straight up), so they dim at night and warm
   under a lamp like everything round them. They write alpha 0 into the colour target, which tells the outline pass
   to leave them alone: they carry their own outline. */
import * as THREE from "three";

/* ---------- colour: every material gets light, base, shade, line (inside edges) and outline tones ---------- */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const WARM = [255, 236, 206], COOL = [46, 32, 70], INK = [28, 18, 34];
const TONES = new Map(), LOFI = new Set(); // LOFI: colours lit with more contrast, the lamp-warm and violet-shadow way of the cozy references
const tones = (h) => {
  if (!TONES.has(h)) { const b = rgb(h); const L0 = mix(b, WARM, LOFI.has(h) ? 0.42 : 0.3), S0 = mix(b, COOL, LOFI.has(h) ? 0.46 : 0.34); TONES.set(h, [L0, b, S0, mix(b, INK, 0.38), mix(b, INK, 0.62), mix(L0, b, 0.5), mix(b, S0, 0.5)]); }
  return TONES.get(h);
};
const LX = -0.55, LY = -0.83; // the light comes from the upper left (y grows down the sprite)

/* ---------- a tiny rasteriser: shapes fill pixel centres, shade by their normal, and line where they overlap ---------- */
const canvas = (w, h) => ({ w, h, c: new Array(w * h).fill(null), o: new Array(w * h).fill(null), id: new Int32Array(w * h).fill(-1), n: 0 });
function fill(cv, x0, y0, x1, y1, inside, T, edge = true) {
  const id = cv.n++, mine = new Map();
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(cv.w - 1, Math.ceil(x1)); y1 = Math.min(cv.h - 1, Math.ceil(y1));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const n = inside(x + 0.5, y + 0.5); if (n) mine.set(y * cv.w + x, n); }
  const big = mine.size > 60; // in-between tones only where a shape is big enough to carry them
  for (const [k, n] of mine) {
    const d = n[0] * LX + n[1] * LY;
    let t = d > 0.62 ? 0 : d > 0.36 ? (big && T[5] ? 5 : 1) : d > -0.14 ? 1 : d > -0.38 ? (big && T[6] ? 6 : 1) : 2;
    if (edge) { // over a part drawn earlier, the border is drawn in a darker line so the two read apart
      const x = k % cv.w;
      for (const kk of [k - 1, k + 1, k - cv.w, k + cv.w]) if (kk >= 0 && kk < cv.c.length && Math.abs((kk % cv.w) - x) <= 1 && !mine.has(kk) && cv.c[kk] && cv.id[kk] !== id) { t = 3; break; }
    }
    cv.c[k] = T[t]; cv.o[k] = T[4]; cv.id[k] = id;
  }
}
const cap = (cv, a, b, r, T, edge, r2 = r) => { // r at a, r2 at b (a limb that tapers)
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1e-6, M = Math.max(r, r2);
  fill(cv, Math.min(a[0], b[0]) - M, Math.min(a[1], b[1]) - M, Math.max(a[0], b[0]) + M, Math.max(a[1], b[1]) + M, (x, y) => {
    const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l2)), ox = x - a[0] - t * dx, oy = y - a[1] - t * dy, rt = r + (r2 - r) * t, rn = Math.max(rt, 0.8);
    return ox * ox + oy * oy <= rt * rt ? [ox / rn, oy / rn] : null;
  }, T, edge);
};
const ell = (cv, cx, cy, rx, ry, T, edge) => fill(cv, cx - rx, cy - ry, cx + rx, cy + ry, (x, y) => { const u = (x - cx) / rx, v = (y - cy) / ry; return u * u + v * v <= 1 ? [u, v] : null; }, T, edge);
const inPoly = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const poly = (cv, P, T, edge) => {
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  fill(cv, x0, y0, x1, y1, (x, y) => (inPoly(P, x, y) ? [((x - cx) / Math.max(1, (x1 - x0) / 2)) * 0.95, ((y - cy) / Math.max(1, (y1 - y0) / 2)) * 0.3] : null), T, edge);
};
const dot = (cv, x, y, c) => { x = Math.floor(x); y = Math.floor(y); if (x >= 0 && y >= 0 && x < cv.w && y < cv.h && cv.c[y * cv.w + x]) cv.c[y * cv.w + x] = c; };
function outline(cv) { // a one-pixel outline round the silhouette: a deep tone of what it borders, lighter on the lit side (up and left)
  const add = [];
  for (let k = 0; k < cv.c.length; k++) {
    if (cv.c[k]) continue;
    const x = k % cv.w; let o = null;
    for (const [kk, lit] of [[k - 1, false], [k - cv.w, false], [k + cv.w, true], [k + 1, true]]) if (kk >= 0 && kk < cv.c.length && Math.abs((kk % cv.w) - x) <= 1 && cv.c[kk]) { o = lit ? mix(cv.o[kk], cv.c[kk], 0.4) : cv.o[kk]; break; }
    if (o) add.push([k, o]);
  }
  for (const [k, o] of add) cv.c[k] = o;
}

/* ---------- a figure ---------- */
// J: the pose, joints in figure space. L: the look (hex colours and styles). s: texels per figure unit.
// (ax, ay): where the figure's (50, 100) lands in the cell.
function figure(cv, J, L, s, ax, ay) {
  const P = (p, dy = 0) => [ax + (p[0] - 50) * s, ay + (p[1] + dy - 100) * s], R = (r) => Math.max(0.6, r * s);
  const SK = tones(L.skin), HA = tones(L.hair), TO = tones(L.top), BO = tones(L.bottom), SH = tones(L.shoes);
  const bob = J.bob || 0, U = (p) => P(p, bob); // the upper body rises and falls with the step
  const sleeve = L.sleeve ?? 0.55; // how far down the upper arm the top's sleeve reaches (1: long sleeves)
  const arm = (a, sh, over, part) => {
    if (!a) return;
    const S0 = U(sh), E = U(a.el), Hd = U(a.ha);
    if (part !== "fore" && (a.upper ?? over) === over) {
      if (sleeve >= 1) cap(cv, S0, E, R(3.6), TO);
      else {
        const m = [S0[0] + (E[0] - S0[0]) * sleeve, S0[1] + (E[1] - S0[1]) * sleeve], sr = R(L.sleeveR || 3.8);
        const St = [S0[0], S0[1] + sr * 0.5]; // the sleeve hangs from just under the shoulder line
        cap(cv, m, E, R(L.armR || 3.1), SK, true, R((L.armR || 3.1) * (L.taper ? 0.88 : 1))); cap(cv, St, m, sr, TO, !L.boxy); // a loose sleeve melts into the body: no hard line where it overlaps
        if (L.sleeveR) { const dx = E[0] - S0[0], dy = E[1] - S0[1], l = Math.hypot(dx, dy) || 1, px = (-dy / l) * sr * 0.9, py = (dx / l) * sr * 0.9; cap(cv, [m[0] + px, m[1] + py], [m[0] - px, m[1] - py], 0.5, [TO[3], TO[3], TO[3], TO[3], TO[4]], false); } // the hem
      }
    }
    if (part !== "upper" && (a.fore ?? over) === over) { cap(cv, E, Hd, R((L.armR || 3.0) * (L.taper ? 0.88 : 1)), sleeve > 1.5 ? TO : SK, true, R((L.armR || 3.0) * (L.taper ? 0.66 : 1))); ell(cv, Hd[0], Hd[1], R(L.handR || 2.7), R(L.handR || 2.7), SK); }
  };
  const mxh = (J.hip[0][0] + J.hip[1][0]) / 2;
  const leg = (g, hip) => {
    if (!g) return;
    const dx = L.hipSpread ? (hip[0] - mxh) * (L.hipSpread - 1) : 0, [tr, sr] = L.legR || [4.8, 3.6];
    const Hp = P([hip[0] + dx, hip[1]]), K = P([g.kn[0] + dx * 0.7, g.kn[1]]), A = P([g.an[0] + dx * 0.5, g.an[1]]);
    cap(cv, Hp, K, R(tr), BO, true, R(tr * (L.taper ? 0.86 : 1))); cap(cv, K, A, R(sr), BO, false, R(sr * (L.taper ? 0.84 : 1))); // no line at the knee: one leg
    if (L.taper) { const T2 = [BO[2], BO[2], BO[2], BO[2], BO[4]]; // denim creases behind the knee and stacked at the ankle
      cap(cv, [K[0] - R(2.4), K[1] - R(1)], [K[0] + R(1.8), K[1] + R(1.2)], 0.45, T2, false); cap(cv, [A[0] - R(2.6), A[1] - R(5)], [A[0] + R(2.2), A[1] - R(4.2)], 0.45, T2, false); }
    if (L.cuffs) cap(cv, [A[0] - R(3.6), A[1] - R(1.4)], [A[0] + R(3.6), A[1] - R(1.4)], R(1.1), [BO[0], BO[0], BO[0], BO[3], BO[4]], false); // the rolled cuff
    const f = g.foot ?? 0, tip = g.tip ? 0.6 : 1;
    ell(cv, A[0] + f * R(2.2), A[1] + R(1.6), R(f ? 4.4 : 3.4) * tip, R(2.3), SH);
  };
  const [nearArm, farArm] = J.arms || [], [nearLeg, farLeg] = J.legs || [];
  const [shN, shF] = J.sh, [hiN, hiF] = J.hip;
  // behind everything: the neck from the back, long hair that falls behind the shoulders, the far arm's hidden parts
  if (J.v === "b") cap(cv, U([J.head[0] + 1, J.head[1] + 6]), U([(shN[0] + shF[0]) / 2, Math.min(shN[1], shF[1]) + 1]), R(L.neckR || 2.8), SK);
  if (L.hairStyle === "long" && J.v === "f") cap(cv, U([J.head[0] + 5, J.head[1] + 2]), U([J.head[0] + 6, J.head[1] + 20]), R(5.2), HA);
  arm(farArm, shF, false); arm(nearArm, shN, false);
  // legs, far then near; a lungi or the lower half of a long top over them
  if (J.legs) {
    leg(farLeg, hiF); leg(nearLeg, hiN);
    if (L.bottomStyle === "lungi") {
      const lo = Math.max(farLeg.an[1], nearLeg.an[1]) - 6, l = Math.min(farLeg.an[0], nearLeg.an[0], hiF[0], hiN[0]) - 4.5, r = Math.max(farLeg.an[0], nearLeg.an[0], hiF[0], hiN[0]) + 4.5;
      poly(cv, [P([Math.min(hiF[0], hiN[0]) - 4, Math.min(hiF[1], hiN[1]) - 1]), P([Math.max(hiF[0], hiN[0]) + 4, Math.min(hiF[1], hiN[1]) - 1]), P([r, lo]), P([l, lo])], BO);
      for (let y = Math.min(hiF[1], hiN[1]) + 5; y < lo - 2; y += 7) cap(cv, P([l + 1.5, y]), P([r - 1.5, y + 0.5]), R(0.7), [BO[2], BO[2], BO[2], BO[3], BO[4]], false); // the check
    }
  }
  // the torso: a long top (kameez, panjabi) runs down to the knee
  const kneeY = J.legs ? (nearLeg.kn[1] + farLeg.kn[1]) / 2 + 2 : null;
  if (L.topStyle === "long" && kneeY) {
    const xl = Math.min(hiN[0], hiF[0]) - 6, xr = Math.max(hiN[0], hiF[0]) + 6;
    poly(cv, [U([Math.min(shN[0], shF[0]) + 1, Math.min(shN[1], shF[1]) - 1]), U([Math.max(shN[0], shF[0]) - 1, Math.min(shN[1], shF[1]) - 1]), U([xr - 2, hiN[1]]), P([xr, kneeY]), P([xl, kneeY]), U([xl + 2, hiF[1]])], TO);
    cap(cv, U([(xl + xr) / 2, hiN[1] + 3]), P([(xl + xr) / 2, kneeY - 1]), R(0.6), [TO[3], TO[3], TO[3], TO[3], TO[4]], false); // the side slit
  } else {
    const wy = (Math.min(shN[1], shF[1]) + Math.max(hiN[1], hiF[1])) / 2 + 4, side = (a, b, k) => a + (b - a) * k;
    // work from the image's left and right edges: the near shoulder is on the right in front views but on the left from behind
    const [sl, sr] = shN[0] < shF[0] ? [shN, shF] : [shF, shN], [hl, hr] = hiN[0] < hiF[0] ? [hiN, hiF] : [hiF, hiN];
    const hem = L.boxy ? 3 : 0, hx = L.boxy ? 4.5 : 2.5; // an oversized tee hangs straight down and past the hips
    const wl = L.boxy ? sl[0] - 2.2 : side(sl[0], hl[0], 0.6) - 0.5, wr = L.boxy ? sr[0] + 2.2 : side(sr[0], hr[0], 0.6) + 0.5;
    // the shoulder line slopes up from each shoulder to the base of the neck (higher from behind, where the collar rides up the nape)
    const top = Math.min(sl[1], sr[1]), nx = (sl[0] + sr[0]) / 2 + (J.v === "b" ? 1 : 0), ny = top - (J.v === "b" ? 6.5 : 3.5);
    for (const sh of [sl, sr]) ell(cv, ...U([sh[0], sh[1] + 1.5]), R(L.shoulderR || 3.9), R(3.2), TO, false); // the deltoid, under the shoulder line
    poly(cv, [U([sl[0] - 1, sl[1] - 2.2]), U([nx - 3.8, ny]), U([nx + 3.8, ny]), U([sr[0] + 1, sr[1] - 2.2]), U([sr[0] + 2.5, sr[1] + 4]), U([wr, wy]), U([hr[0] + hx, hr[1] + hem]), U([hl[0] - hx, hl[1] + hem]), U([wl, wy]), U([sl[0] - 2.5, sl[1] + 4])], TO);
    cap(cv, U([hl[0] - hx + 0.5, hl[1] + hem - 0.8]), U([hr[0] + hx - 0.5, hr[1] + hem - 0.8]), R(0.7), [TO[3], TO[3], TO[3], TO[3], TO[4]], false); // the hem
  }
  if (L.folds) { // a few short, soft creases where cotton gathers: under the arms and at the waist, in the mid-shade
    const T2 = [TO[6], TO[6], TO[6], TO[6], TO[4]], top = Math.min(shN[1], shF[1]), bot = Math.max(hiN[1], hiF[1]), mx = (shN[0] + shF[0]) / 2, xl = Math.min(shN[0], shF[0]), xr = Math.max(shN[0], shF[0]);
    for (const [x0, y0, x1, y1] of [[xl + 1.5, top + 9, xl + 5, top + 13], [xr - 1.5, top + 9, xr - 5, top + 13], [mx - 6, bot - 2, mx - 2.5, bot + 1.5], [mx + 4, bot - 3, mx + 6.5, bot + 1]]) cap(cv, U([x0, y0]), U([x1, y1]), 0.45, T2, false);
  }
  if (L.belt && L.topStyle !== "long") cap(cv, U([Math.min(hiF[0], hiN[0]) - 2, hiF[1] - 1]), U([Math.max(hiF[0], hiN[0]) + 2, hiN[1] - 1]), R(1.1), BO, false);
  if (L.dupatta) { // across the chest from the near shoulder; the end hangs behind the far one
    const D = tones(L.dupatta);
    if (J.v === "b") cap(cv, U([shF[0] + 1, shF[1]]), U([shF[0] + 3, shF[1] + 20]), R(3.2), D);
    else { cap(cv, U([shN[0] - 1, shN[1]]), U([(hiN[0] + hiF[0]) / 2 - 4, hiF[1] - 6]), R(3.0), D); cap(cv, U([shF[0] + 1, shF[1]]), U([shF[0] - 1, shF[1] + 22]), R(2.6), D); }
  }
  if (L.hairStyle === "long" && J.v === "b") cap(cv, U([J.head[0] - 1, J.head[1] + 4]), U([J.head[0] - 1, J.head[1] + 21]), R(5.6), HA);
  if (L.hairStyle === "hijab") { // the scarf falls over the shoulders and down the back
    const Hj = tones(L.hair), c = J.head;
    poly(cv, [U([c[0] - 9, c[1] + 4]), U([c[0] + 9, c[1] + 4]), U([c[0] + 11, c[1] + 22]), U([c[0] - 11, c[1] + 22])], Hj);
  }
  arm(farArm, shF, true); arm(nearArm, shN, true);
  // the neck (behind the collar from the back), then the head
  // the neck stops at its base, where a crew collar rings it (it used to run on down the chest as a deep V)
  const neckBase = Math.min(shN[1], shF[1]) - (L.boxy ? 3 : 0.5);
  const neck = () => cap(cv, U([J.head[0] + (J.v === "b" ? 1 : -0.5), J.head[1] + 6]), U([(shN[0] + shF[0]) / 2, neckBase]), R(L.neckR || 2.8), SK);
  if (J.v !== "b") { if (L.folds) ell(cv, ...U([(shN[0] + shF[0]) / 2, neckBase + 0.5]), R(4.6), R(2.3), [TO[3], TO[3], TO[3], TO[3], TO[4]], false); neck(); }
  head(cv, J.hv || J.v, U(J.head), s, L, J.eyes);
  for (const x of J.extra || []) x(cv, U, P, R, s);
}

/* Taif's head, drawn by hand from his photo at a natural size (about a sixth of his height, not a cartoon's quarter):
   black hair short at the sides with lift on top, brows, a short beard (stubble on the cheeks, darker on the jaw and in the
   moustache) and his smile with the teeth muted. One letter per pixel; the outline comes after.
   j H h hair (shine, base, shade) · f g the fade at the back · l S s E skin (light, base, shade, ear) · o brows and lashes · B b d beard (base, stubble, dark) · e eyes · w teeth · m mouth */
const TAIF_HEADS = {
  F: [
    "......jjjHHHH.....", "....jjjHHHHHHHh...", "...jjHHHHHjjHHHh..", "..jHHHHHHHHHjHHhh.", "..jHHHHHHHHHHHHhh.", ".hHHHHHHHHHHHHHhhh",
    ".hhHHhhhhHHHhhHhhh", ".hhhllllllSSSShhh.", ".hhlllSSSSSSSSshh.", ".hlohhlSSSShhoSsh.", "EsllSSSSSSSSSSSssE", "EslSehSSSSShesSssE",
    "EsllllSSlsSlllSssE", ".sllSSSSlsSSSSSss.", ".bSlSSSSssSSSSSsb.", ".BbSSSSbssbSSSsbB.", ".BBbddddddddddbBB.", ".BBdbmwwwwwwmbdBB.",
    ".BBBdbmmmmmmbdBBB.", ".BBBBbbsbbsbbBBBB.", "..BBdBBbbbbBBdBB..", "...BBBBBddBBBBB...", "....BBBBBBBBBB....", "......BBBBBB......",
  ], // full front, smiling: lit on the left, shaded on the right
  Fs: [
    "......jjjHHHH.....", "....jjjHHHHHHHh...", "...jjHHHHHjjHHHh..", "..jHHHHHHHHHjHHhh.", "..jHHHHHHHHHHHHhh.", ".hHHHHHHHHHHHHHhhh",
    ".hhHHhhhhHHHhhHhhh", ".hhhllllllSSSShhh.", ".hhlllSSSSSSSSshh.", ".hlohhlSSSShhoSsh.", "EsllSSSSSSSSSSSssE", "EslSooSSSSSoosSssE",
    "EsllllSSlsSlllSssE", ".sllSSSSlsSSSSSss.", ".bSlSSSSssSSSSSsb.", ".BbSSSSbssbSSSsbB.", ".BBbddddddddddbBB.", ".BBBbmmmmmmmmbBBB.",
    ".BBBBbbbbbbbbBBBB.", ".BBBBbbsbbsbbBBBB.", "..BBdBBbbbbBBdBB..", "...BBBBBddBBBBB...", "....BBBBBBBBBB....", "......BBBBBB......",
  ], // asleep: eyes shut, mouth closed
  b: [
    "......jjjHHH......", "....jjjHHHjHHHh...", "...jjHHHHHHHjHHh..", "..jHHHHHHHHHHHHhh.", ".jHHHHHHHHHHHHHhhh", ".HHHHHHHHHHHHHHhhh",
    ".HHHHHHHHHHHHHhhhh", ".hHHHHHHHHHHHHhhSs", ".hhHHHHHHHHHHhhhSs", ".hhhHHHHHHHHhhhEsS", "..hhhhhhhhhhhhhEsS", "..fhhhhhhhhhhhfEsB",
    "..ffgfgfgfgfgffsBB", "...gfgfgfgfgfgsBB.", "....gfgfgfgfgsBB..", ".....sSSSSSSSsB...", "......sSSSSSs.....",
  ], // from behind his right shoulder: the faded back and sides, his right ear, the edge of the beard
};
const HEAD_PAL = {"j":  "#4a4250", "H":  "#251d22", "h":  "#17121a", "f":  "#5e4034", "g":  "#7c5644", "l":  "#c48c6a", "S":  "#a46d50", "s":  "#835439", "E":  "#93603f", "B":  "#3a2a27", "b":  "#7a523f", "d":  "#2a1f1f", "e":  "#1e1418", "w":  "#e2d2c2", "m":  "#6e3a31", "o":  "#5c3a30"};
// stamp a hand-drawn head with its eye row on (x, y)
function stamp(cv, rows, x, y, eyeRow = 8) {
  const id = cv.n++, ox = Math.round(x - rows[0].length / 2), oy = Math.round(y - eyeRow);
  rows.forEach((row, r) => { for (let c = 0; c < row.length; c++) {
    const ch = row[c]; if (ch === ".") continue;
    const X = ox + c, Y = oy + r; if (X < 0 || Y < 0 || X >= cv.w || Y >= cv.h) continue;
    const k = Y * cv.w + X, col = rgb(HEAD_PAL[ch]); cv.c[k] = col; cv.o[k] = mix(col, INK, 0.6); cv.id[k] = id;
  } });
}

function head(cv, view, [cx, cy], s, L, eyes = "open") {
  if (L.heads) { const v = view === "b" ? "b" : eyes === "closed" ? "Fs" : "F"; stamp(cv, TAIF_HEADS[v], cx, cy + (v === "b" ? 3 : 1), v === "b" ? 9 : 11); return; } // from behind his head sits down into the collar
  const SK = tones(L.skin), HA = tones(L.hair), rx = 7.2 * s, ry = 8.3 * s, eye = [26, 20, 32], big = s > 0.6;
  const E = (x, y) => { dot(cv, x, y, eye); if (big && eyes !== "closed") dot(cv, x, y - 1, eye); };
  const closed = (x, y) => { dot(cv, x, y, SK[4]); if (big) dot(cv, x + 1, y, SK[4]); };
  const beard = () => { // along the jaw and round the chin, the mouth left clear
    if (!L.beard) return; const B = tones(L.beard), bx = cx + (view === "f" ? -1.3 * s : 0);
    ell(cv, bx, cy + 6.6 * s, 3.6 * s, 1.6 * s, B, false);
    for (const k of view === "f" ? [-1, 1] : [-1, 1]) cap(cv, [bx + k * 5 * s, cy + 2.6 * s], [bx + k * 2.8 * s, cy + 6.6 * s], 0.9 * s, B, false);
    dot(cv, bx - 0.6 * s, cy + 4.4 * s, B[1]); dot(cv, bx + 0.8 * s, cy + 4.4 * s, B[1]); // the moustache
  };
  if (L.hairStyle === "hijab") {
    ell(cv, cx + (view === "b" ? -0.5 : 0.8) * s, cy + 0.4 * s, rx + 1.6 * s, ry + 1.4 * s, HA);
    if (view === "b") return;
    ell(cv, cx - (view === "f" ? 1.6 : 0) * s, cy + 1.6 * s, 4.8 * s, 5.6 * s, SK);
    if (view === "f") { E(cx - 3.6 * s, cy + 1.2 * s); E(cx + 0.8 * s, cy + 1.2 * s); } else { E(cx - 2.4 * s, cy + 1 * s); E(cx + 2.4 * s, cy + 1 * s); }
    return;
  }
  if (view === "b") { // the back of the head: hair, an ear and a sliver of cheek on the right, the nape
    ell(cv, cx, cy, rx, ry, SK);
    ell(cv, cx - 0.5 * s, cy - 0.7 * s, rx + 0.5 * s, ry + 0.2 * s, HA);
    ell(cv, cx - 1.5 * s, cy - 7.6 * s, 3.2 * s, 2 * s, HA, false); // a tuft
    if (s > 0.6) for (const [a, b] of [[[-4.5, -4], [-1.5, -5.6]], [[-5.6, -0.5], [-3.6, -2.6]], [[0.5, -5.8], [3, -4.6]]]) cap(cv, [cx + a[0] * s, cy + a[1] * s], [cx + b[0] * s, cy + b[1] * s], 0.55, [HA[0], HA[0], HA[0], HA[0], HA[4]], false); // the shine
    ell(cv, cx + 6.1 * s, cy + 1.6 * s, 1.5 * s, 2.4 * s, SK);
    if (L.beard) ell(cv, cx + 5.4 * s, cy + 5.4 * s, 1.6 * s, 1.7 * s, tones(L.beard), false);
    if (L.cap) ell(cv, cx - 0.3 * s, cy - 4.8 * s, 6.4 * s, 3.6 * s, tones(L.cap));
    return;
  }
  const fx = view === "f" ? -1.3 * s : 0; // a three-quarter face sits toward the side it turns to
  ell(cv, cx + (view === "f" ? 0.9 * s : 0), cy - 0.6 * s, rx + 0.3 * s, ry + 0.1 * s, HA); // the hair behind
  ell(cv, cx + fx, cy + 1.5 * s, (view === "f" ? 5.9 : 6.4) * s, 6.7 * s, SK); // the face
  if (view === "f") ell(cv, cx + 4.8 * s, cy + 1.8 * s, 1.4 * s, 2.2 * s, SK); else { ell(cv, cx - 6.4 * s, cy + 1.8 * s, 1.3 * s, 2 * s, SK); ell(cv, cx + 6.4 * s, cy + 1.8 * s, 1.3 * s, 2 * s, SK); }
  if (L.hairStyle !== "bald") { ell(cv, cx + fx + 0.5 * s, cy - 4.2 * s, (view === "f" ? 6.4 : 6.8) * s, 2.8 * s, HA, false); ell(cv, cx + 0.5 * s, cy - 7.8 * s, 3.4 * s, 1.9 * s, HA, false); } // the fringe, a tuft
  if (s > 0.6) cap(cv, [cx - 3.6 * s, cy - 6.2 * s], [cx + 0.6 * s, cy - 7.4 * s], 0.55, [HA[0], HA[0], HA[0], HA[0], HA[4]], false); // the shine
  if (L.cap) ell(cv, cx + fx + 0.4 * s, cy - 5 * s, 6.6 * s, 3.4 * s, tones(L.cap));
  beard();
  const ey = cy + 1.3 * s, [e1, e2] = view === "f" ? [cx - 4.3 * s, cx + 0.7 * s] : [cx - 2.6 * s, cx + 2.6 * s];
  if (eyes === "closed") { closed(e1, ey + 0.5 * s); closed(e2, ey + 0.5 * s); } else { E(e1, ey); E(e2, ey); }
  if (big) { dot(cv, cx + fx - (view === "f" ? 1.1 : 0) * s, cy + 3.6 * s, SK[2]); dot(cv, cx + fx - 0.3 * s, cy + 5.6 * s, L.beard ? [64, 36, 32] : [122, 58, 48]); dot(cv, cx + fx + 0.7 * s, cy + 5.6 * s, L.beard ? [64, 36, 32] : [122, 58, 48]); }
}

/* ---------- poses (figure space, three-quarter front facing left unless noted; "b" poses face up and right) ---------- */
const mirrorX = (p) => [100 - p[0], p[1]];
const mirrorPose = (J, v) => ({
  ...J, v, head: mirrorX(J.head), sh: J.sh.map(mirrorX), hip: J.hip.map(mirrorX),
  arms: J.arms.map((a) => a && { ...a, el: mirrorX(a.el), ha: mirrorX(a.ha) }),
  legs: J.legs && J.legs.map((g) => g && { ...g, kn: mirrorX(g.kn), an: mirrorX(g.an), foot: -(g.foot ?? 0) }),
});
// a walk: four frames (near foot forward, passing, far foot forward, passing); forward is to the left in "f"
const WALK = [
  { bob: 0, legs: [{ kn: [51.5, 76], an: [48.5, 96.5], foot: -1 }, { kn: [49, 75.5], an: [52, 94], foot: -1, tip: true }], arms: [{ el: [63, 38.5], ha: [64, 50] }, { el: [37.5, 37.5], ha: [35.5, 48.5] }] },
  { bob: -1.2, legs: [{ kn: [54.5, 75.5], an: [53.5, 95.5], foot: -1 }, { kn: [45.5, 74], an: [47.5, 92], foot: -1, tip: true }], arms: [{ el: [61.5, 39], ha: [61, 51] }, { el: [39, 38], ha: [39.5, 50] }] },
  { bob: 0, legs: [{ kn: [57, 75.5], an: [58, 94], foot: -1, tip: true }, { kn: [44.5, 76], an: [42, 96.5], foot: -1 }], arms: [{ el: [60.5, 38.5], ha: [57.5, 50.5] }, { el: [40.5, 37.5], ha: [43, 49.5] }] },
  { bob: -1.2, legs: [{ kn: [54, 74], an: [55, 92], foot: -1, tip: true }, { kn: [46, 75.5], an: [45.5, 95.5], foot: -1 }], arms: [{ el: [61.5, 39], ha: [61, 51] }, { el: [39, 38], ha: [39.5, 50] }] },
];
const STAND_F = { v: "f", head: [48.5, 10.5], sh: [[60, 25.5], [40.5, 24.5]], hip: [[57, 53], [45, 52.5]] };
const walkF = (f) => ({ ...STAND_F, ...WALK[f] });
const walkB = (f) => mirrorPose(walkF(f), "b");
// on a low stool at the tea stall, a cup in the near hand
const SIT_F = {
  v: "f", head: [47.5, 34], sh: [[59, 49], [40, 48]], hip: [[56, 75.5], [45, 75]],
  arms: [{ el: [61, 62], ha: [50, 60] }, { el: [39, 61], ha: [44, 69] }],
  legs: [{ kn: [42, 76.5], an: [44, 96.5], foot: -1 }, { kn: [36, 75.5], an: [37.5, 95.5], foot: -1 }],
  extra: [(cv, U, P, R) => { const c = U([48.5, 57]); ell(cv, c[0], c[1], R(2.2), R(2.4), tones("#f4f1ea")); }],
};
const umbrella = (pal) => (cv, U, P, R) => {
  const h = U([60, 27]), top = U([57, -1]), V = tones(pal[0]), c = U([54, -2]);
  cap(cv, h, top, R(0.8), tones("#3a2f2a"), false);
  fill(cv, c[0] - R(23), c[1] - R(12), c[0] + R(23), c[1] + R(4), (x, y) => { const u = (x - c[0]) / R(23), v = (y - c[1]) / R(12); return u * u + v * v <= 1 && y <= c[1] + R(2.5) ? [u, v] : null; }, V);
  for (const k of [-0.55, 0, 0.55]) cap(cv, [c[0], c[1] - R(9.5)], [c[0] + k * R(22), c[1] + R(2)], R(0.5), [V[2], V[2], V[2], V[3], V[4]], false);
};
const umbrellaWalk = (J, pal) => ({ ...J, arms: [J.v === "b" ? { el: [39, 34], ha: [42.5, 27] } : { el: [61, 34], ha: [57.5, 27] }, J.arms[1]], extra: [umbrella(pal)] });

/* ---------- the street people: 24 x 46 cells (the figure 38 tall, room above it for an umbrella) ---------- */
const PEOPLE = [
  { skin: "#a8734f", hair: "#2a2226", top: "#4b7bb5", bottom: "#3a3b4a", shoes: "#2b2220", sleeve: 0.55, belt: true },
  { skin: "#b98863", hair: "#2a1d1c", hairStyle: "long", top: "#b8457a", topStyle: "long", bottom: "#e9dfcc", shoes: "#6b3f2a", dupatta: "#e8b83a", sleeve: 0.8 },
  { skin: "#a8734f", hair: "#3f8a8a", hairStyle: "hijab", top: "#2f3f6b", topStyle: "long", bottom: "#2f3f6b", shoes: "#2a2220", sleeve: 1 },
  { skin: "#8d5f42", hair: "#8d8b88", cap: "#f4f1ea", beard: "#e9e6e0", top: "#ece8de", topStyle: "long", bottom: "#e2dccf", shoes: "#5a3b28", sleeve: 1 },
  { skin: "#7d5238", hair: "#1f1a1c", top: "#e7e2d6", bottom: "#2f6b4a", bottomStyle: "lungi", shoes: "#5a3b28", sleeve: 0.55 },
  { skin: "#b98863", hair: "#3a2a22", top: "#e0a83a", bottom: "#3f5f8f", shoes: "#e9e6e0", sleeve: 0.55, belt: true },
  { skin: "#a8734f", hair: "#3b2620", hairStyle: "long", top: "#c8463c", bottom: "#3a4a6a", shoes: "#2a2220", sleeve: 0.55 },
  { skin: "#9b6b4b", hair: "#1d1715", top: "#e9edf2", bottom: "#24252e", shoes: "#1a1a1e", sleeve: 1, belt: true },
];
const BROLLY = [["#c8463c"], ["#3f9a7a"], ["#e0a83a"], ["#3e6e8e"], ["#e9e2d3"]];
const SW = 36, SH = 68, SS = 0.56; // cell, and texels per figure unit (the figure 56 tall)
const PER = 17; // cells per person: front walk x4, back walk x4, each with and without an umbrella, and sitting
const cell = (w, h, draw, rim) => { const cv = canvas(w, h); draw(cv); if (rim) rimLight(cv); outline(cv); return cv; };
// lo-fi light: the edge facing away from the key light catches a cool rim (the monitor, the window), two pixels deep, fading
function rimLight(cv) {
  const RIM = [176, 196, 255], out = [];
  for (let k = 0; k < cv.c.length; k++) {
    if (!cv.c[k]) continue;
    const x = k % cv.w; if (x + 1 >= cv.w) continue;
    if (!cv.c[k + 1]) out.push([k, 0.42]); else if (x + 2 < cv.w && !cv.c[k + 2]) out.push([k, 0.18]);
  }
  for (const [k, a] of out) cv.c[k] = mix(cv.c[k], RIM, a);
}
function personCells(L, pal) {
  const out = [];
  for (const v of ["f", "b"]) for (let f = 0; f < 4; f++) for (const umb of [0, 1]) {
    const J = v === "f" ? walkF(f) : walkB(f);
    out.push(cell(SW, SH, (cv) => figure(cv, umb ? umbrellaWalk(J, pal) : J, L, SS, SW / 2, SH - 2)));
  }
  out.push(cell(SW, SH, (cv) => figure(cv, SIT_F, L, SS, SW / 2, SH - 2)));
  return out;
}
// index of a street cell: person, view ("F" front | "B" back | "S" sitting), walk frame 0-3, umbrella
export const personCell = (i, view, frame = 0, umb = false) => (i % PEOPLE.length) * PER + (view === "S" ? 16 : (view === "B" ? 8 : 0) + frame * 2 + (umb ? 1 : 0));
export const streetSheet = () => sheet(PEOPLE.flatMap((L, i) => personCells(L, BROLLY[i % BROLLY.length])), SW, SH);

/* ---------- tiny Taif: 64 x 100 cells, the standing figure 88 texels tall; a cell's bottom row is what he stands or sits on ---------- */
const TAIF_LOOK = { skin: "#a56d4f", hair: "#241c20", beard: "#2b2124", top: "#ad97c0", bottom: "#7b93b4", // his lilac tee and light jeans, a shade deeper than the photo so they hold their colour under the room's light
   shoes: "#e9e4dc", sleeve: 0.8, sleeveR: 4.3, shoulderR: 4.3, armR: 3.4, handR: 2.5, neckR: 3.1, taper: true, legR: [5.9, 4.5], hipSpread: 1.3, boxy: true, cuffs: true, folds: true, heads: true };
for (const k of ["skin", "top", "bottom", "shoes"]) LOFI.add(TAIF_LOOK[k]);
const TS = 1.3, TW = 96, TH = 148; // the standing figure about 127 texels tall, at the room's 400-row grain
// seated poses sit their hips on the cell's bottom row (y 100); the others stand on it
const SEATED = (J) => J;
const POSES = {
  // at the desk, seen from behind his right shoulder, typing (the chair back hides his lower back)
  desk0: SEATED({ v: "b", head: [52.5, 58.5], sh: [[41, 73.5], [61, 72.5]], hip: [[44, 100], [57, 100]], arms: [{ el: [37.5, 87], ha: [50, 84], fore: false }, { el: [65.5, 86], ha: [70, 80.5], upper: false, fore: false }] }),
  desk1: SEATED({ v: "b", head: [52.5, 59], sh: [[41, 73.8], [61, 72.8]], hip: [[44, 100], [57, 100]], arms: [{ el: [37.8, 87.6], ha: [50, 84], fore: false }, { el: [65.5, 86.2], ha: [70.6, 79.6], upper: false, fore: false }] }),
  // turned round in the chair to wave
  deskWave0: { v: "F", head: [50.5, 57.5], sh: [[61, 72.5], [40, 72.5]], hip: [[56, 100], [45, 100]], arms: [{ el: [70, 63.5], ha: [72, 52] }, { el: [37, 86.5], ha: [42, 95] }] },
  deskWave1: { v: "F", head: [50.5, 57.5], sh: [[61, 72.5], [40, 72.5]], hip: [[56, 100], [45, 100]], arms: [{ el: [70.5, 63], ha: [76.5, 53] }, { el: [37, 86.5], ha: [42, 95] }] },
  // sunk into the bean bag with the DualShock, facing the CRT (drawn facing up-right; flipped to face the left wall)
  ps20: { v: "b", head: [50.5, 44.5], sh: [[40.5, 59], [58.5, 58]], hip: [[46, 84], [56, 83]],
    arms: [{ el: [38.5, 73], ha: [50, 67], fore: false }, { el: [61.5, 71], ha: [64.5, 65.5], upper: false, fore: false }],
    legs: [{ kn: [58, 71], an: [63, 94], foot: 1, tip: true }, { kn: [67, 70.5], an: [73, 92.5], foot: 1, tip: true }],
    extra: [(cv, U, P, R) => { const c = U([61.5, 64.5]); ell(cv, c[0], c[1], R(4.2), R(2.4), tones("#2a2b31")); }] },
  ps21: { v: "b", head: [51, 45], sh: [[40.8, 59.4], [58.8, 58.4]], hip: [[46, 84], [56, 83]],
    arms: [{ el: [38.8, 73.4], ha: [50, 67.5], fore: false }, { el: [61.8, 71.4], ha: [65, 66], upper: false, fore: false }],
    legs: [{ kn: [58, 71], an: [63, 94], foot: 1, tip: true }, { kn: [67, 70.5], an: [73, 92.5], foot: 1, tip: true }],
    extra: [(cv, U, P, R) => { const c = U([62, 65]); ell(cv, c[0], c[1], R(4.2), R(2.4), tones("#2a2b31")); }] },
  // looking up at the papers and the TechFest trophy, hands clasped behind his back (flipped: faces the left wall)
  trophy0: { v: "b", head: [52, 9.5], sh: [[41, 25], [60, 24.5]], hip: [[44.5, 53], [56, 52.5]], arms: [{ el: [37.5, 38], ha: [48, 50], upper: true, fore: true }, { el: [62.5, 38], ha: [52.5, 50.5], upper: true, fore: true }], legs: [{ kn: [44.5, 75.5], an: [43.5, 95.5], foot: 1 }, { kn: [56.5, 75], an: [58, 95], foot: 1 }] },
  trophy1: { v: "b", head: [53, 9.2], sh: [[41, 24.6], [60, 24.1]], hip: [[44.5, 53], [56, 52.5]], arms: [{ el: [37.5, 37.6], ha: [48, 49.6], upper: true, fore: true }, { el: [62.5, 37.6], ha: [52.5, 50.1], upper: true, fore: true }], legs: [{ kn: [44.5, 75.5], an: [43.5, 95.5], foot: 1 }, { kn: [56.5, 75], an: [58, 95], foot: 1 }] },
  // on tiptoe, both hands up at the top shelf (flipped: faces the left wall)
  book0: { v: "b", head: [52.5, 8.5], bob: -1.5, sh: [[42, 23.5], [60, 23]], hip: [[44.5, 52], [56, 51.5]], arms: [{ el: [43.5, 9.5], ha: [50, -3.5] }, { el: [63, 9], ha: [64.5, -5.5], upper: true, fore: true }], legs: [{ kn: [45.5, 74.5], an: [45, 93], foot: 1, tip: true }, { kn: [55.5, 74], an: [55.5, 92.5], foot: 1, tip: true }] },
  book1: { v: "b", head: [52.5, 7.5], bob: -3, sh: [[42, 23.5], [60, 23]], hip: [[44.5, 52], [56, 51.5]], arms: [{ el: [44, 8.5], ha: [50.5, -5.5] }, { el: [63.5, 8], ha: [65, -8], upper: true, fore: true }], legs: [{ kn: [45.5, 74.5], an: [45, 92], foot: 1, tip: true }, { kn: [55.5, 74], an: [55.5, 91.5], foot: 1, tip: true }] },
  // leaning on the desk to look out of the window, by the cat
  window0: { v: "b", head: [54, 11.5], sh: [[42.5, 26.5], [61.5, 25.5]], hip: [[44.5, 54], [56, 53.5]], arms: [{ el: [39.5, 39], ha: [47, 46], fore: false }, { el: [64.5, 37.5], ha: [69, 44], upper: false, fore: false }], legs: [{ kn: [45, 76], an: [44, 95.5], foot: 1 }, { kn: [55.5, 75.5], an: [56.5, 95.5], foot: 1 }] },
  window1: { v: "b", head: [55.2, 11], sh: [[42.5, 26.5], [61.5, 25.5]], hip: [[44.5, 54], [56, 53.5]], arms: [{ el: [39.5, 39], ha: [47, 46], fore: false }, { el: [64.5, 37.5], ha: [69, 44], upper: false, fore: false }], legs: [{ kn: [45, 76], an: [44, 95.5], foot: 1 }, { kn: [55.5, 75.5], an: [56.5, 95.5], foot: 1 }] },
  // standing, turned to the camera, waving
  wave0: { v: "F", head: [50, 10], sh: [[61, 25], [39, 25]], hip: [[55.5, 53], [44.5, 53]], arms: [{ el: [69.5, 18], ha: [71, 6] }, { el: [37, 39], ha: [38.5, 51] }], legs: [{ kn: [55, 75.5], an: [55, 95.5] }, { kn: [45, 75.5], an: [45, 95.5] }] },
  wave1: { v: "F", head: [50, 10], sh: [[61, 25], [39, 25]], hip: [[55.5, 53], [44.5, 53]], arms: [{ el: [70.5, 19], ha: [75.5, 7.5] }, { el: [37, 39], ha: [38.5, 51] }], legs: [{ kn: [55, 75.5], an: [55, 95.5] }, { kn: [45, 75.5], an: [45, 95.5] }] },
};
// asleep on the futon: lying along it, head on the pillow (up and right on screen), the blanket to his shoulders
function sleeper(cv, breath) {
  const s = TS, at = (x, y) => [TW / 2 + (x - 50) * s, TH - 1 + (y - 100) * s], SK = tones(TAIF_LOOK.skin), BL = tones("#eeeae2"), TO = tones(TAIF_LOOK.top);
  const h = at(73, 78.5); // the head (the body runs down and left from it along the futon, about 0.35 down for 1 across)
  stamp(cv, TAIF_HEADS.Fs, h[0], h[1] + 1, 11); // his face, turned up to the ceiling, eyes shut
  // his shoulder and an arm out over the blanket
  cap(cv, at(61, 86), at(51, 90), 4.6 * s, TO); cap(cv, at(51, 90), at(42, 92), 2.9 * s, SK); ell(cv, ...at(41, 92.3), 2.7 * s, 2.7 * s, SK);
  // the blanket over the rest of him, rising and falling a little
  const b = breath ? 0.8 : 0;
  poly(cv, [at(66, 83.5 - b), at(56, 80.5 - b), at(32, 89.5 - b), at(25, 94.5), at(33, 97), at(62, 91.5)], BL);
  for (const [x0, y0, x1, y1] of [[50, 87, 36, 92.5], [42, 91.5, 31, 95.5]]) cap(cv, at(x0, y0 - b), at(x1, y1 - b), 0.7 * s, [BL[2], BL[2], BL[2], BL[3], BL[4]], false); // folds
}
export const TAIF = Object.fromEntries([...Object.keys(POSES), "sleep0", "sleep1"].map((k, i) => [k, i]));
export const taifSheet = () => sheet([
  ...Object.values(POSES).map((J) => cell(TW, TH, (cv) => figure(cv, J, TAIF_LOOK, TS, TW / 2, TH - 1), true)),
  cell(TW, TH, (cv) => sleeper(cv, false)), cell(TW, TH, (cv) => sleeper(cv, true)),
], TW, TH);

/* ---------- the atlas ---------- */
function sheet(cells, cw, ch) {
  const cols = Math.min(cells.length, 16), rows = Math.ceil(cells.length / cols), W = cols * cw, H = rows * ch;
  const data = new Uint8Array(W * H * 4);
  cells.forEach((cv, n) => {
    const ox = (n % cols) * cw, oy = Math.floor(n / cols) * ch;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const c = cv.c[y * cw + x]; if (!c) continue;
      const i = ((H - 1 - (oy + y)) * W + ox + x) * 4; // the texture is sRGB: the bytes go in as drawn
      data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
    }
  });
  const tex = new THREE.DataTexture(data, W, H); tex.colorSpace = THREE.SRGBColorSpace; tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.generateMipmaps = false; tex.needsUpdate = true;
  return { tex, cols, rows, cw, ch, W, H, n: cells.length, data };
}

/* ---------- the quads ---------- */
// unit: world units per texel (as seen on screen) at the size the figure was drawn for
export function spriteLayer({ sheet: sh, count, grad, unit, layer = 1, parent }) {
  const geo = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0); // anchored at the feet
  const cellA = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3); geo.setAttribute("aCell", cellA);
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
        cellA.setXYZ(i, (it.c % sh.cols) / sh.cols, (sh.rows - 1 - Math.floor(it.c / sh.cols)) / sh.rows, it.flip ? 1 : 0);
      }
      mesh.instanceMatrix.needsUpdate = true; cellA.needsUpdate = true;
    },
  };
}
export { sheet as spriteSheet };
