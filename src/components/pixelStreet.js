/* The street under the pixel room: what the camera finds when the hero pulls back
   and then drops to ground level. Roads and pavements, lamps and trees, people
   walking, traffic (a bus, CNGs, cars), and two cars parked in front of the building:
   a Jeep Cherokee Liberty and a Honda CR-V.

   Built with the same rules as the room (pixelRoom.js): no DOM, everything static is
   merged into a few vertex-coloured meshes, crowds are instanced, and nothing here is
   drawn or updated until the camera has left the room (root.visible). */
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const STREET_LABELS = { crv: "Honda CR-V", jeep: "Jeep Cherokee Liberty", bus: "City bus", cng: "CNG" };

const TYRE = "#15161b", HUB = "#b4b8c2", GLASS = "#1f2c3a", DARK = "#26272d", CHROME = "#c9ccd3", LAMP = "#f6efd8", TAIL = "#c8261f";
const WARM = "#ffd98a", HEAD = "#fff3c4", RED = "#ff4a3a"; // glow colours (night only)
const WALK = "#8d919c", ASPHALT = "#3b3e48", MARK = "#dcd9cc", POST = "#2b2e3d";
const SHIRTS = ["#d2553a", "#3e6e8e", "#d9a441", "#5b8a5a", "#8a5a9e", "#e0d4bc", "#2f4f6b", "#c0644f", "#b9a4cf", "#4f8f8a"];
const SKINS = ["#9b6b4b", "#7d5238", "#b98863"], BROLLY = ["#c8463c", "#3f9a7a", "#e0a83a", "#3e6e8e", "#e9e2d3"];

/* G = ground height; front / right = the building's street-facing walls (z and x). */
export function buildStreet({ scene, grad, G, front, right }) {
  const lit = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: grad });
  const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const hazeMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.2, depthWrite: false });
  const root = new THREE.Group(); root.visible = false; scene.add(root);
  const _c = new THREE.Color();

  // a kit collects coloured boxes and cylinders, then merges them into one mesh
  const kit = () => {
    const geos = [];
    const add = (g, c, x = 0, y = 0, z = 0) => {
      g.translate(x, y, z); _c.set(c);
      const n = g.attributes.position.count, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i * 3] = _c.r; a[i * 3 + 1] = _c.g; a[i * 3 + 2] = _c.b; }
      g.setAttribute("color", new THREE.BufferAttribute(a, 3)); geos.push(g);
    };
    return {
      geo: add,
      box: (w, h, d, c, x, y, z) => add(new THREE.BoxGeometry(w, h, d), c, x, y, z),
      cyl: (r, h, c, x, y, z, axis = "y", seg = 10) => { const g = new THREE.CylinderGeometry(r, r, h, seg); if (axis === "z") g.rotateX(Math.PI / 2); else if (axis === "x") g.rotateZ(Math.PI / 2); add(g, c, x, y, z); },
      mesh: (mat, parent = root) => { const m = new THREE.Mesh(mergeGeometries(geos), mat); m.castShadow = m.receiveShadow = false; parent.add(m); return m; },
    };
  };
  const nightOnly = []; // glow meshes, switched with the street lights

  /* ---------- layout (x along the building front, z toward the camera) ---------- */
  const BAY0 = front + 3.05, BAY1 = BAY0 + 7.6, LANE_A = BAY1 + 2.5, LANE_B = BAY1 + 7.5, NB0 = BAY1 + 10, NB1 = NB0 + 7.6; // pavement | bays | two lanes | bays | pavement
  const XL = -66, XR = 46, SX0 = right + 3.05, SX1 = SX0 + 9, SZ0 = -38; // main road extent; the side road beside the building
  const BAYS = [-25.15, -21.25, -17.35, -13.45, -9.55, -5.65, -1.75]; // bay centres, 3.9 apart
  const S = kit(), SG = kit(), P = kit(); // static lit, static glow, light pools on the ground

  // roads and pavements
  S.box(XR - XL, 0.1, NB1 - BAY0, ASPHALT, (XL + XR) / 2, G + 0.05, (BAY0 + NB1) / 2);
  S.box(SX1 - SX0, 0.1, BAY0 - SZ0, ASPHALT, (SX0 + SX1) / 2, G + 0.05, (BAY0 + SZ0) / 2);
  S.box(SX0 - XL, 0.3, 3.05, WALK, (XL + SX0) / 2, G + 0.15, front + 1.525);
  S.box(XR - SX1, 0.3, 3.05, WALK, (XR + SX1) / 2, G + 0.15, front + 1.525);
  S.box(3.05, 0.3, front - SZ0, WALK, right + 1.525, G + 0.15, (front + SZ0) / 2);
  S.box(3, 0.3, front - SZ0, WALK, SX1 + 1.5, G + 0.15, (front + SZ0) / 2);
  S.box(XR - XL, 0.3, 3, WALK, (XL + XR) / 2, G + 0.15, NB1 + 1.5);
  // markings: lane dashes, bay lines, a zebra crossing at the corner, the side road's centre line
  for (let x = XL + 3; x < XR; x += 4) S.box(1.8, 0.02, 0.2, MARK, x, G + 0.11, BAY1 + 5);
  for (let i = 0; i <= BAYS.length; i++) for (const z of [BAY0 + 3.8, NB0 + 3.8]) S.box(0.16, 0.02, 7.2, MARK, BAYS[0] - 1.95 + i * 3.9, G + 0.11, z);
  for (let z = BAY0 + 0.9; z < NB1 - 0.4; z += 1.4) S.box(4, 0.02, 0.6, MARK, SX0 + 2.6, G + 0.11, z);
  for (let z = SZ0 + 2; z < BAY0 - 2; z += 4) S.box(0.2, 0.02, 1.8, MARK, (SX0 + SX1) / 2, G + 0.11, z);
  S.box(SX1 - SX0 - 0.6, 0.02, 0.3, MARK, (SX0 + SX1) / 2, G + 0.11, BAY0 - 0.6);

  // street lamps (the head glows and throws a pool at night)
  const lamp = (x, z, dz) => {
    S.box(0.2, 6.6, 0.2, POST, x, G + 3.6, z); S.box(0.16, 0.16, 1.9, POST, x, G + 6.85, z + 0.85 * dz); S.box(0.5, 0.18, 0.8, "#3a3d4c", x, G + 6.82, z + 1.7 * dz);
    SG.box(0.4, 0.1, 0.62, WARM, x, G + 6.7, z + 1.7 * dz); P.cyl(4.4, 0.02, "#ffcf87", x, G + 0.34, z + 2.1 * dz, "y", 14);
  };
  for (const x of [-50, -36.6, -23.2, -11.5, 0.2]) lamp(x, BAY0 - 0.45, 1);
  for (const x of [-58, -34, BAYS[2] - 2.6, BAYS[6] + 4.2, 26]) lamp(x, NB1 + 0.45, -1); // from this camera a post hides what is up and to its left, so these two stand clear of the Jeep and the CR-V
  for (const z of [-30, -14]) { S.box(0.2, 6.6, 0.2, POST, SX0 - 0.45, G + 3.6, z); S.box(1.9, 0.16, 0.16, POST, SX0 + 0.4, G + 6.85, z); SG.box(0.62, 0.1, 0.4, WARM, SX0 + 1.25, G + 6.7, z); P.cyl(4.2, 0.02, "#ffcf87", SX0 + 1.7, G + 0.14, z, "y", 14); }

  // trees
  const tree = (x, z, k = 1) => { S.box(0.36, 2.6 * k, 0.36, "#5a3d2a", x, G + 0.3 + 1.3 * k, z); S.box(2.6, 2.2, 2.6, "#2f6b3a", x, G + 0.3 + 2.6 * k + 1.0, z); S.box(1.7, 1.1, 1.7, "#3f8448", x + 0.25, G + 0.3 + 2.6 * k + 2.5, z - 0.2); };
  for (const x of [-29.6, -17.3, -5.7]) tree(x, front + 0.9);
  for (const z of [-33, -22, -6]) tree(right + 1.5, z, 0.9);
  for (const x of [-62, -46, 12, 34]) tree(x, NB1 + 2.1, 1.1);
  // a small park beside the building
  S.box(34, 0.24, 9, "#3c6b3b", -47, G + 0.12, 0);
  for (const [x, z] of [[-34, -2], [-40, 2.2], [-47, -1.6], [-54, 1.8], [-60, -2.4]]) tree(x, z, 1.2);
  S.box(2.6, 0.14, 0.7, "#6f4630", -43.5, G + 0.75, 3.0); S.box(0.14, 0.5, 0.6, POST, -44.5, G + 0.5, 3.0); S.box(0.14, 0.5, 0.6, POST, -42.5, G + 0.5, 3.0); // bench

  // a strip of park across the road (low things only: this is the edge nearest the camera)
  S.box(XR - XL, 0.24, 9, "#3c6b3b", (XL + XR) / 2, G + 0.12, NB1 + 7.5); S.box(XR - XL, 0.9, 0.5, "#2f5a33", (XL + XR) / 2, G + 0.6, NB1 + 3.3);
  for (let x = XL + 5; x < XR; x += 13) { S.box(0.9, 0.5, 0.9, "#d9a441", x, G + 0.45, NB1 + 6 + (x % 3)); S.box(0.7, 0.4, 0.7, "#c0644f", x + 4.5, G + 0.4, NB1 + 8.5 - (x % 2)); }

  // a tea stall on the pavement, and a bus-stop sign
  S.box(2.6, 2.2, 1.5, "#7a4f33", -31, G + 1.4, front + 0.9); S.box(3.0, 0.14, 2.3, "#e2a13a", -31, G + 2.8, front + 1.3); S.box(2.6, 0.12, 0.5, "#caa47b", -31, G + 1.5, front + 1.75);
  S.box(0.4, 0.5, 0.4, "#3e6e8e", -32.6, G + 0.55, front + 2.5); S.box(0.4, 0.5, 0.4, "#c0644f", -29.5, G + 0.55, front + 2.6);
  SG.box(0.22, 0.22, 0.22, WARM, -31, G + 2.55, front + 1.6); P.cyl(2.6, 0.02, "#ffcf87", -31, G + 0.34, front + 2.1, "y", 12);
  S.box(0.12, 3.6, 0.12, POST, -38.4, G + 2.1, BAY0 - 0.5); S.box(0.1, 0.9, 0.9, "#2b6cb0", -38.4, G + 3.6, BAY0 - 0.5);

  // a low block across the side road, so the corner reads as a city and not an edge
  S.box(25, 9, 30, "#6b5a7a", 31.2, G + 4.5, front - 15.1); S.box(25.4, 0.4, 30.4, "#4c3f58", 31.2, G + 9.2, front - 15.1);
  for (let z = front - 27; z < front - 2; z += 4.2) for (const y of [2.6, 6.4]) { S.box(0.1, 1.8, 2.2, GLASS, 18.66, G + y, z); if (Math.abs(Math.round(z * 7 + y * 3)) % 3 < 2) SG.box(0.12, 1.8, 2.2, WARM, 18.64, G + y, z); }
  for (let x = 21; x < 43; x += 4.4) { S.box(2.6, 2.4, 0.1, GLASS, x, G + 2.0, front - 0.06); SG.box(2.6, 2.4, 0.12, WARM, x, G + 2.0, front - 0.05); S.box(3.2, 0.3, 1.2, ["#c8463c", "#3f9a7a", "#e0a83a"][Math.round(x) % 3], x, G + 3.5, front + 0.5); }


  /* ---------- vehicles: each is drawn facing +x, wheels on y = 0 ---------- */
  const wheels = (b, xs, zh, r, w = 0.44) => { for (const x of xs) for (const s of [-1, 1]) { b.cyl(r, w, TYRE, x, r, s * zh, "z", 10); b.cyl(r * 0.5, w + 0.06, HUB, x, r, s * zh, "z", 8); } };

  // Jeep Cherokee Liberty (KJ): upright and boxy, round headlamps, seven-slot grille, flared arches, roof rails, spare wheel on the tailgate
  const jeep = (b, g, c = "#a3271f") => {
    b.box(6.6, 1.15, 2.9, c, 0, 1.125, 0); b.box(3.9, 1.15, 2.7, c, -0.75, 2.275, 0);
    b.box(3.5, 0.72, 2.74, GLASS, -0.75, 2.36, 0); b.box(0.16, 0.76, 2.76, c, -0.35, 2.36, 0); b.box(0.16, 0.76, 2.76, c, -1.75, 2.36, 0);
    b.box(0.1, 0.8, 2.3, GLASS, 1.22, 2.34, 0); b.box(0.1, 0.72, 2.2, GLASS, -2.72, 2.38, 0);
    b.box(1.75, 0.5, 3.08, DARK, 2.1, 1.0, 0); b.box(1.75, 0.5, 3.08, DARK, -2.1, 1.0, 0);
    b.box(0.34, 0.46, 2.96, DARK, 3.42, 0.85, 0); b.box(0.3, 0.42, 2.96, DARK, -3.4, 0.84, 0);
    for (let i = -3; i <= 3; i++) b.box(0.08, 0.52, 0.11, "#101114", 3.32, 1.42, i * 0.2);
    for (const s of [-1, 1]) {
      b.cyl(0.27, 0.1, LAMP, 3.32, 1.42, s * 1.05, "x", 10); b.box(0.08, 0.14, 0.26, "#e8912c", 3.32, 1.02, s * 1.1);
      b.box(0.1, 0.5, 0.3, TAIL, -3.31, 1.5, s * 1.28); b.box(3.2, 0.08, 0.1, DARK, -0.8, 2.9, s * 1.12); b.box(0.22, 0.2, 0.18, DARK, 1.0, 2.0, s * 1.5);
      g.cyl(0.27, 0.12, HEAD, 3.34, 1.42, s * 1.05, "x", 10); g.box(0.12, 0.5, 0.3, RED, -3.33, 1.5, s * 1.28);
    }
    b.cyl(0.64, 0.42, TYRE, -3.68, 1.72, 0.2, "x", 12); b.cyl(0.3, 0.46, c, -3.7, 1.72, 0.2, "x", 8);
    wheels(b, [2.1, -2.1], 1.42, 0.62);
  };
  // Honda CR-V: raked windscreen, smooth roof, dark lower cladding, tall tail lamps running up beside the rear window
  const crv = (b, g, c = "#e6e9ee") => {
    b.box(7.0, 1.05, 2.95, c, 0, 0.975, 0); b.box(7.08, 0.3, 3.0, "#2d2f35", 0, 0.6, 0); b.box(4.5, 1.15, 2.75, c, -1.0, 2.075, 0);
    b.geo(new THREE.BoxGeometry(1.5, 0.1, 2.5).rotateZ(-Math.PI / 4), GLASS, 1.78, 2.07, 0); b.box(0.55, 0.5, 2.7, c, 1.5, 1.75, 0);
    b.box(4.0, 0.6, 2.79, GLASS, -1.05, 2.22, 0); b.box(0.14, 0.62, 2.8, c, -0.6, 2.22, 0); b.box(0.14, 0.62, 2.8, c, -2.0, 2.22, 0);
    b.geo(new THREE.BoxGeometry(1.1, 0.3, 2.8).rotateZ(0.45), c, -2.78, 2.02, 0);
    b.box(0.1, 0.62, 2.0, GLASS, -3.27, 2.25, 0); b.box(0.08, 0.12, 1.5, CHROME, -3.53, 1.42, 0); b.box(0.06, 0.26, 0.75, "#f1efe6", -3.54, 1.1, 0); b.box(0.2, 0.3, 2.9, "#2d2f35", -3.5, 0.62, 0);
    b.box(0.1, 0.3, 1.1, "#17181c", 3.5, 1.3, 0); b.box(0.12, 0.08, 1.2, CHROME, 3.52, 1.38, 0); b.box(0.13, 0.14, 0.16, CHROME, 3.53, 1.28, 0); b.box(0.1, 0.25, 2.0, "#17181c", 3.5, 0.75, 0);
    b.box(0.32, 0.12, 0.08, c, -2.7, 2.71, 0);
    for (const s of [-1, 1]) {
      b.box(0.12, 1.3, 0.3, TAIL, -3.3, 2.0, s * 1.28); b.box(0.12, 0.3, 0.5, TAIL, -3.52, 1.3, s * 1.15);
      b.box(0.32, 0.22, 0.85, LAMP, 3.38, 1.32, s * 0.98); b.box(0.22, 0.18, 0.18, c, 1.05, 1.9, s * 1.52);
      g.box(0.34, 0.22, 0.85, HEAD, 3.4, 1.32, s * 0.98); g.box(0.14, 1.3, 0.3, RED, -3.32, 2.0, s * 1.28);
    }
    wheels(b, [2.25, -2.25], 1.44, 0.58);
  };
  const sedan = (c) => (b, g) => {
    b.box(6.8, 0.9, 2.8, c, 0, 0.85, 0); b.box(3.3, 0.8, 2.6, c, -0.3, 1.7, 0); b.box(2.9, 0.55, 2.64, GLASS, -0.3, 1.74, 0);
    b.box(0.1, 0.55, 2.2, GLASS, 1.37, 1.72, 0); b.box(0.1, 0.55, 2.2, GLASS, -1.97, 1.72, 0);
    for (const s of [-1, 1]) { b.box(0.1, 0.22, 0.6, LAMP, 3.4, 1.0, s * 0.95); b.box(0.1, 0.22, 0.6, TAIL, -3.4, 1.0, s * 0.95); g.box(0.12, 0.22, 0.6, HEAD, 3.42, 1.0, s * 0.95); g.box(0.12, 0.22, 0.6, RED, -3.42, 1.0, s * 0.95); }
    wheels(b, [2.1, -2.1], 1.36, 0.5);
  };
  const van = (c) => (b, g) => {
    b.box(7.4, 2.5, 2.9, c, 0, 1.75, 0); b.box(5.6, 0.8, 2.94, GLASS, -0.3, 2.35, 0); b.box(0.1, 0.9, 2.5, GLASS, 3.71, 2.3, 0);
    for (const s of [-1, 1]) { b.box(0.1, 0.26, 0.5, LAMP, 3.71, 1.1, s * 1.05); b.box(0.1, 0.5, 0.3, TAIL, -3.71, 1.5, s * 1.25); g.box(0.12, 0.26, 0.5, HEAD, 3.73, 1.1, s * 1.05); g.box(0.12, 0.5, 0.3, RED, -3.73, 1.5, s * 1.25); }
    wheels(b, [2.4, -2.3], 1.4, 0.52);
  };
  const bus = (b, g, c = "#c2362c") => {
    b.box(14.5, 4.2, 4, c, 0, 2.8, 0); b.box(14.54, 0.55, 4.04, "#f1e9d2", 0, 2.1, 0);
    b.box(12.6, 1.35, 4.06, GLASS, -0.4, 3.6, 0); for (let x = -6; x <= 5; x += 2.2) b.box(0.22, 1.35, 4.08, c, x, 3.6, 0);
    b.box(0.1, 2.0, 3.5, GLASS, 7.26, 3.3, 0); b.box(0.12, 0.5, 2.4, "#f1e9d2", 7.27, 4.55, 0);
    b.box(0.3, 0.4, 4.04, DARK, 7.2, 0.9, 0); b.box(0.3, 0.4, 4.04, DARK, -7.2, 0.9, 0);
    for (const s of [-1, 1]) { b.box(0.1, 0.3, 0.6, LAMP, 7.27, 1.4, s * 1.4); b.box(0.1, 0.4, 0.4, TAIL, -7.27, 1.6, s * 1.6); g.box(0.12, 0.3, 0.6, HEAD, 7.29, 1.4, s * 1.4); g.box(0.12, 0.4, 0.4, RED, -7.29, 1.6, s * 1.6); }
    g.box(12.6, 1.35, 4.07, WARM, -0.4, 3.6, 0); g.box(0.14, 0.5, 2.4, "#ffb347", 7.29, 4.55, 0);
    wheels(b, [4.6, -4.2], 1.95, 0.8, 0.5);
  };
  // CNG: the green three-wheeled auto-rickshaw, dark canopy, caged passenger doors, one headlamp
  const cng = (b, g) => {
    const c = "#1f8f4e", top = "#1b2420";
    b.box(2.7, 1.0, 2.1, c, -0.65, 0.95, 0); b.box(1.4, 0.75, 1.5, c, 1.35, 0.9, 0); b.box(0.9, 0.2, 0.5, c, 1.9, 0.9, 0);
    b.box(1.9, 1.1, 1.9, "#101214", -0.75, 1.95, 0); b.box(0.6, 0.7, 0.6, "#3d5a80", 0.25, 1.5, 0); b.box(0.5, 0.5, 0.5, SKINS[0], 0.25, 2.05, 0);
    b.box(0.1, 1.05, 1.8, GLASS, 0.72, 2.0, 0); b.box(0.12, 1.3, 2.06, top, -1.94, 2.05, 0); b.box(3.0, 0.16, 2.2, top, -0.55, 2.78, 0);
    for (const s of [-1, 1]) { b.box(0.1, 1.25, 0.1, top, 0.72, 2.1, s * 0.95); b.box(2.0, 0.08, 0.06, "#8d949c", -0.75, 1.9, s * 1.04); b.box(2.0, 0.08, 0.06, "#8d949c", -0.75, 1.6, s * 1.04);
      b.box(0.1, 0.22, 0.3, TAIL, -2.0, 1.0, s * 0.8); g.box(0.12, 0.22, 0.3, RED, -2.02, 1.0, s * 0.8); b.cyl(0.42, 0.3, TYRE, -1.35, 0.42, s * 1.0, "z", 10); }
    b.box(0.1, 0.24, 0.34, LAMP, 2.06, 1.1, 0); g.box(0.12, 0.24, 0.34, HEAD, 2.08, 1.1, 0); b.cyl(0.42, 0.3, TYRE, 1.9, 0.42, 0, "z", 10);
  };

  const vehicle = (build) => {
    const b = kit(), g = kit(), grp = new THREE.Group(); build(b, g); root.add(grp);
    b.mesh(lit, grp); nightOnly.push(g.mesh(glowMat, grp)); return grp;
  };
  const park = (build, x, z, heading) => { const v = vehicle(build); v.position.set(x, G + 0.1, z); v.rotation.y = heading; return v; };
  const IN = Math.PI / 2, OUT = -Math.PI / 2; // nose toward the building / toward the road
  // The two stars park on the camera side of the road, at the bottom of the view, so traffic passes behind them:
  // the Jeep nose-out (grille and round lamps to the camera), the CR-V beside it tail-out (its tall tail lamps to the camera).
  const jeepCar = park(jeep, BAYS[2], NB0 + 3.9, OUT), crvCar = park(crv, BAYS[4], NB0 + 3.9, IN); // an empty bay between them
  park(sedan("#3a6ea5"), BAYS[1], BAY0 + 3.8, IN); park(van("#eceff1"), BAYS[4], BAY0 + 3.9, IN); park(sedan("#2c2f38"), BAYS[6], BAY0 + 3.8, OUT);
  const cngs = [park(cng, SX0 + 1.4, -3, OUT), park(cng, SX0 + 1.4, -8.2, OUT)]; park(sedan("#8a8f99"), SX0 + 1.6, -19, OUT); // a CNG stand on the side road
  const starLamp = new THREE.PointLight("#ffd9a0", 0, 0, 2); starLamp.position.set(BAYS[3], G + 6.4, NB0 + 5.2); scene.add(starLamp); // real light on the two stars
  P.cyl(5.2, 0.02, "#ffcf87", BAYS[3], G + 0.14, NB0 + 4.2, "y", 16); // and its pool on the tarmac

  S.mesh(lit); nightOnly.push(SG.mesh(glowMat), P.mesh(hazeMat)); // all the static street: three draw calls

  // traffic keeps left: the lane nearer the building runs +x, the outer lane -x
  const beamGeo = new THREE.PlaneGeometry(6.5, 2.6).rotateX(-Math.PI / 2); { const a = new Float32Array(12); _c.set("#ffe9a8"); for (let i = 0; i < 4; i++) a.set([_c.r, _c.g, _c.b], i * 3); beamGeo.setAttribute("color", new THREE.BufferAttribute(a, 3)); }
  const movers = [], SPAN = XR - XL - 4;
  const drive = (build, len, lane, dir, x0, speed) => {
    const v = vehicle(build), beam = new THREE.Mesh(beamGeo, hazeMat); beam.position.set(len / 2 + 3.4, 0.06, 0); v.add(beam); nightOnly.push(beam);
    v.position.set(x0, G + 0.1, lane); v.rotation.y = dir > 0 ? 0 : Math.PI; movers.push({ v, dir, x0, speed }); return v;
  };
  drive(sedan("#3f7fb8"), 6.8, LANE_A, 1, -52, 6.5); cngs.push(drive(cng, 4.2, LANE_A, 1, -34, 6.5)); drive(van("#eceff1"), 7.4, LANE_A, 1, -12, 6.5); cngs.push(drive(cng, 4.2, LANE_A, 1, 16, 6.5));
  const busV = drive(bus, 14.5, LANE_B, -1, 30, 5.5); drive(sedan("#e0b12e"), 6.8, LANE_B, -1, 4, 5.5); cngs.push(drive(cng, 4.2, LANE_B, -1, -22, 5.5)); drive(sedan("#7b8089"), 6.8, LANE_B, -1, -46, 5.5);

  /* ---------- people: instanced parts walked up and down the pavements ---------- */
  const walkers = [];
  const walker = (axis, fixed, from, to, speed, phase) => walkers.push({ axis, fixed, from, to, speed, phase });
  for (let i = 0; i < 8; i++) walker("x", front + 0.8 + (i % 3) * 0.75, -42, SX0 - 0.6, 1.5 + (i % 4) * 0.35, i * 11.3);
  for (let i = 0; i < 3; i++) walker("z", right + 0.9 + i * 0.6, SZ0 + 4, front + 2, 1.6 + i * 0.3, i * 7.1);
  for (let i = 0; i < 5; i++) walker("x", NB1 + 0.8 + (i % 2) * 1.1, -52, 34, 1.4 + (i % 3) * 0.4, i * 17.7);
  walker("x", front + 2.5, -32.6, -32.6, 0, 0); walker("x", front + 2.6, -29.5, -29.5, 0, 0); // two regulars sitting at the tea stall
  const N = walkers.length;
  const part = (geo, color) => { const m = new THREE.InstancedMesh(geo, new THREE.MeshToonMaterial({ color, gradientMap: grad }), N); m.frustumCulled = false; m.castShadow = m.receiveShadow = false; root.add(m); return m; };
  const torso = part(new THREE.BoxGeometry(0.5, 1.05, 0.8), "#ffffff"), headM = part(new THREE.BoxGeometry(0.55, 0.55, 0.55), "#ffffff"), hair = part(new THREE.BoxGeometry(0.6, 0.2, 0.6), "#1d1715");
  const legGeo = new THREE.BoxGeometry(0.32, 1.0, 0.3).translate(0, -0.5, 0), legL = part(legGeo, "#2b2c3e"), legR = part(legGeo, "#2b2c3e");
  const brolly = part(mergeGeometries([new THREE.ConeGeometry(1.05, 0.45, 8), new THREE.BoxGeometry(0.06, 1.3, 0.06).translate(0, -0.8, 0)]), "#ffffff"); brolly.visible = false;
  for (let i = 0; i < N; i++) { torso.setColorAt(i, _c.set(SHIRTS[i % SHIRTS.length])); headM.setColorAt(i, _c.set(SKINS[i % SKINS.length])); brolly.setColorAt(i, _c.set(BROLLY[i % BROLLY.length])); }
  const base = new THREE.Matrix4(), loc = new THREE.Matrix4(), tmp = new THREE.Matrix4();

  let wasNight = null;
  function update(t, env) {
    const night = env.lamp > 0.4;
    if (night !== wasNight) { wasNight = night; nightOnly.forEach((o) => (o.visible = night)); starLamp.intensity = night ? 70 : 0; }
    for (const m of movers) m.v.position.x = XL + 2 + ((((m.x0 - XL - 2 + m.dir * m.speed * t) % SPAN) + SPAN) % SPAN);
    brolly.visible = env.rain;
    for (let i = 0; i < N; i++) {
      const w = walkers[i], L = w.to - w.from; let p = w.from, d = 1, sw = 0, bob = 0, sit = 0;
      if (L > 0) { const u = (t * w.speed + w.phase) % (2 * L); d = u < L ? 1 : -1; p = w.from + (u < L ? u : 2 * L - u); const ph = t * w.speed * 2.6 + w.phase; sw = Math.sin(ph) * 0.55; bob = Math.abs(Math.cos(ph)) * 0.05; }
      else { sit = 0.45; sw = 1.2; }
      const x = w.axis === "x" ? p : w.fixed, z = w.axis === "x" ? w.fixed : p, yaw = L > 0 ? (w.axis === "x" ? (d > 0 ? 0 : Math.PI) : d > 0 ? -Math.PI / 2 : Math.PI / 2) : Math.PI / 2;
      base.makeRotationY(yaw).setPosition(x, G + 0.3 + bob - sit, z);
      torso.setMatrixAt(i, tmp.multiplyMatrices(base, loc.makeTranslation(0, 1.53, 0)));
      headM.setMatrixAt(i, tmp.multiplyMatrices(base, loc.makeTranslation(0, 2.33, 0)));
      hair.setMatrixAt(i, tmp.multiplyMatrices(base, loc.makeTranslation(0, 2.66, 0)));
      legL.setMatrixAt(i, tmp.multiplyMatrices(base, loc.makeRotationZ(sw).setPosition(0, 1.0, 0.2)));
      legR.setMatrixAt(i, tmp.multiplyMatrices(base, loc.makeRotationZ(sit ? sw : -sw).setPosition(0, 1.0, -0.2)));
      if (env.rain) brolly.setMatrixAt(i, tmp.multiplyMatrices(base, loc.makeTranslation(0.1, 3.25, 0)));
    }
    for (const m of [torso, headM, hair, legL, legR, brolly]) m.instanceMatrix.needsUpdate = true;
  }

  return {
    root, update, light: starLamp,
    picks: [["jeep", [jeepCar]], ["crv", [crvCar]], ["bus", [busV]], ["cng", cngs]],
    /* where the camera ends up: the two stars in the lower part of the frame, traffic and the shop fronts behind them.
       (Aimed 6 back and 5 left of the cars: from this camera angle that keeps them centred left to right.) */
    focus: new THREE.Vector3(BAYS[3] - 2.4, G + 2, NB0 + 3.9 - 3),
  };
}
