/* Purely decorative props for the pixel room: no hit boxes, no labels, no lights, nothing that moves.
   Everything goes into `statics`, so it is baked into the room's one vertex-coloured mesh with the rest
   (no extra draw calls, no per-frame work). Colours come from the room's own palette (C in pixelRoom.js).
   Placed on bare wall and floor where the camera's view of every clickable stays clear:
   a poster of the CRT's racing game above the project frames, a floating shelf with a trailing pothos over
   the cork board, a monstera in a woven basket by the bin, and a round pouf by the retro table. */
import * as THREE from "three";

export function decorate({ box, cyl, statics, C }) {
  // left wall, above the four project frames: a poster for the racing game on the CRT (same sunset, road and red car)
  { const X = -2.98, Y = 4.35, Z = 1.55, f = (w, h, c, y, z, dx) => box(0.01, h, w, c, X + 0.025 + dx, Y + y, Z + z);
    box(0.04, 1.0, 0.72, C.ink, X, Y, Z);
    ["#3a5bd0", "#6a86ea", "#f0a070", "#fad98c"].forEach((c, i) => f(0.62, 0.1, c, 0.4 - i * 0.1, 0, 0)); // sky
    f(0.2, 0.14, C.flower, 0.02, 0, 0.004); // the sun, half under the horizon
    f(0.62, 0.45, "#5aa046", -0.225, 0, 0.008); // grass
    [0.08, 0.18, 0.28, 0.4].forEach((w, i) => f(w, 0.1125, "#55575f", -0.056 - i * 0.1125, 0, 0.012)); // the road, widening toward us
    [-0.11, -0.3].forEach((y) => f(0.025, 0.06, "#f2f2ea", y, 0, 0.016)); // centre line
    f(0.14, 0.07, "#d6362c", -0.36, 0, 0.02); f(0.08, 0.03, "#f2c641", -0.31, 0, 0.02); // the car
    f(0.36, 0.06, C.mug, 0.36, 0, 0.008); f(0.22, 0.025, C.cream, 0.29, 0, 0.008); // title
  }

  // back wall, over the cork board: a floating shelf with a trailing pothos, two books lying flat and a small cactus
  { const Y = 4.35, Z = -2.86;
    box(1.3, 0.06, 0.28, C.desk, -1.6, Y, Z); for (const x of [-2.1, -1.1]) box(0.05, 0.14, 0.2, C.deskDark, x, Y - 0.1, Z - 0.03);
    cyl(0.1, 0.08, 0.18, C.books[5], -2.02, Y + 0.12, Z, statics, 8);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; box(0.12, 0.05, 0.1, i % 2 ? C.leaf : C.leaf2, -2.02 + Math.cos(a) * 0.09, Y + 0.24 + (i % 3) * 0.03, Z + Math.sin(a) * 0.07).rotation.y = a; }
    for (const [x, n] of [[-2.15, 5], [-1.93, 3]]) for (let k = 0; k < n; k++) box(0.07, 0.06, 0.03, k % 2 ? C.leaf : C.leaf2, x + (k % 2 ? 0.03 : -0.02), Y - 0.04 - k * 0.09, Z + 0.13); // vines over the edge
    box(0.32, 0.06, 0.22, C.books[1], -1.58, Y + 0.06, Z); box(0.28, 0.05, 0.2, C.books[0], -1.57, Y + 0.115, Z).rotation.y = 0.15;
    cyl(0.06, 0.05, 0.09, C.pot, -1.2, Y + 0.075, Z, statics, 8); box(0.06, 0.16, 0.06, C.books[3], -1.2, Y + 0.2, Z); box(0.04, 0.07, 0.04, C.books[3], -1.15, Y + 0.2, Z);
  }

  // floor, right side between the bin and the book stack: a monstera in a woven basket
  { const g = new THREE.Group(); g.position.set(2.6, 0, -0.35); statics.add(g);
    cyl(0.22, 0.18, 0.34, C.cork, 0, 0.17, 0, g, 10); cyl(0.225, 0.225, 0.05, "#8a6a44", 0, 0.24, 0, g, 10); cyl(0.2, 0.2, 0.02, "#3a2a20", 0, 0.335, 0, g, 10);
    box(0.04, 0.5, 0.04, C.leaf, 0, 0.55, 0, g);
    [[0.3, 0.75, 0.5], [1.4, 0.95, 0.35], [2.5, 0.68, 0.6], [3.6, 1.05, 0.25], [4.7, 0.82, 0.45], [5.7, 0.62, 0.65]].forEach(([a, y, tilt], i) => {
      const p = new THREE.Group(); p.position.y = y; p.rotation.y = a; g.add(p);
      box(0.3, 0.03, 0.24, i % 2 ? C.leaf : "#3f6b3a", 0.2, 0, 0, p).rotation.z = -tilt;
    });
  }

  // floor, front of the retro table: a round pouf in the rug's terracotta with a cream band
  cyl(0.3, 0.3, 0.26, C.rugEdge, -1.85, 0.13, 2.6, statics, 12); cyl(0.305, 0.305, 0.06, C.cream, -1.85, 0.14, 2.6, statics, 12); cyl(0.26, 0.26, 0.02, C.rug, -1.85, 0.265, 2.6, statics, 12);
}
