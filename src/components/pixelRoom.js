/* The pixel room behind the hero: a small three.js scene drawn at low resolution
   with 1-px outlines and stepped (toon) light, so it reads as hand-made pixel art
   that can still turn in 3D.

   This module touches no DOM: Hero.jsx runs it inside a worker on an OffscreenCanvas
   (pixelRoom.worker.js) so building and drawing the room never blocks the page, and
   falls back to the main thread where workers can't have WebGL. Everything goes in
   through the returned API and out through the `ui` callbacks (plain data only).

   Pipeline per frame: scene → low-res colour target (with depth) → normals target
   → post pass draws outlines (dark on depth silhouettes, light on creases) to a
   canvas the size of the low-res target that CSS upscales with `pixelated`.
   Sky, light and the wristwatch follow the visitor's clock. */
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const V3 = THREE.Vector3;
const { lerp, clamp, degToRad } = THREE.MathUtils;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const AZ0 = degToRad(40), EL0 = degToRad(28);
const NEAR = 1, FAR = 140, FX = 1; // FX layer: rain/steam/stars/sparkles, never outlined (and never ray-picked)

/* hour → sky, sun colour, sun intensity, sun elevation°, lamp, hemi sky, hemi ground, hemi intensity, stars, moon/sun disc.
   The sky column is mirrored by the inline script in index.html (first paint, before this loads). */
export const KEYS = [
  [0, "#0e1326", "#9fb2ff", 1.1, 32, 1, "#5a6aa8", "#3a2630", 1.5, 1, "#f4f1e2"],
  [5, "#141a36", "#a7b4ff", 1.0, 20, 1, "#5a6aa8", "#3a2630", 1.5, 0.8, "#f4f1e2"],
  [6.5, "#e79a7f", "#ffb07a", 3.0, 9, 0.5, "#c4a2c0", "#5a3a3a", 2.0, 0.1, "#ffd2a0"],
  [9, "#8ec2ef", "#fff0d6", 4.5, 38, 0, "#d4e2f7", "#8a6a50", 3.0, 0, "#ffffff"],
  [15, "#86bdf0", "#fff3dc", 4.5, 46, 0, "#d4e2f7", "#8a6a50", 3.0, 0, "#ffffff"],
  [18, "#e98a55", "#ff9a52", 3.2, 8, 0.85, "#b48ac0", "#4a3030", 1.8, 0.15, "#ffb26b"],
  [19.6, "#2a2a55", "#c49aff", 1.1, 10, 1, "#6a5f9a", "#34203a", 1.4, 0.6, "#f4f1e2"],
  [21, "#0e1326", "#9fb2ff", 1.1, 32, 1, "#5a6aa8", "#3a2630", 1.5, 1, "#f4f1e2"],
  [24, "#0e1326", "#9fb2ff", 1.1, 32, 1, "#5a6aa8", "#3a2630", 1.5, 1, "#f4f1e2"],
];

const C = {
  wall: "#4f4677", wall2: "#5a4f85", base: "#2f2848", floor: "#86593c", plank: "#6c452f", rug: "#8a3a42", rugEdge: "#c0644f",
  desk: "#9a6640", deskDark: "#6f4630", metal: "#2b2e3d", metal2: "#474c63", frame: "#caa47b", curtain: "#7c3d50",
  mug: "#e8501e", coffee: "#3b2418", pot: "#b9653d", leaf: "#4c7a46", leaf2: "#86b25e", flower: "#ffd36b",
  skin: "#9b6b4b", hair: "#1d1715", tee: "#b9a4cf", pants: "#2b2c3e", shoe: "#e9e2d3", bag: "#17181f",
  gold: "#d6a656", cream: "#f4ecd8", red: "#d2553a", strap: "#4a3326", ink: "#1e1b26", cork: "#b98a5a",
  books: ["#c4553d", "#3e6e8e", "#d9a441", "#5b8a5a", "#8a5a9e", "#e0d4bc", "#2f4f6b"],
  notes: ["#ffd86b", "#ff9ab0", "#8fd3ff", "#b6e388"],
};

// Start-up is split into short tasks so the thread stays responsive (it matters on the main-thread fallback).
const pause = () => (globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((r) => setTimeout(r, 0)));
const nextFrame = (cb) => (globalThis.requestAnimationFrame ? globalThis.requestAnimationFrame(cb) : setTimeout(() => cb(performance.now()), 16));
const stopFrame = (id) => (globalThis.cancelAnimationFrame ? globalThis.cancelAnimationFrame(id) : clearTimeout(id));
const makeCanvas = (w, h) => (typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), { width: w, height: h }));

export async function createPixelRoom({ canvas, width, height, reduced = false, query = "", screenSrc, frames = [], copy = {}, ui, signal }) {
  let dirty = true, shadowsDirty = true, gone = false; // first: async callbacks (texture loads) may set these mid-construction
  const Q = new URLSearchParams(query);
  const hourOverride = Q.has("h") ? +Q.get("h") : null;

  /* ---------- renderer & low-res pipeline ---------- */
  await pause();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  renderer.shadowMap.autoUpdate = false; // re-rendered on demand: env change, clicks, and a few times a second for the typing hands
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.debug.checkShaderErrors = false; // status checks force a synchronous compile; shaders here are fixed

  const nearest = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter };
  const rtC = new THREE.WebGLRenderTarget(4, 4, { ...nearest, type: THREE.HalfFloatType, depthTexture: new THREE.DepthTexture(4, 4) });
  const rtN = new THREE.WebGLRenderTarget(4, 4, nearest);
  const normalMat = new THREE.MeshNormalMaterial();
  const post = new THREE.ShaderMaterial({
    uniforms: { tC: { value: rtC.texture }, tD: { value: rtC.depthTexture }, tN: { value: rtN.texture }, res: { value: new THREE.Vector2(4, 4) }, span: { value: FAR - NEAR } },
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
    fragmentShader: `
uniform sampler2D tC,tD,tN;uniform vec2 res;uniform float span;varying vec2 vUv;
float D(vec2 u){return texture2D(tD,u).x*span;}
vec3 N(vec2 u){return texture2D(tN,u).xyz*2.-1.;}
void main(){
  vec2 p=1./res; vec3 col=texture2D(tC,vUv).rgb; float d=D(vUv); vec3 n=N(vUv);
  vec2 o[4]; o[0]=vec2(p.x,0.); o[1]=vec2(-p.x,0.); o[2]=vec2(0.,p.y); o[3]=vec2(0.,-p.y);
  float dd=0., nd=0.;
  for(int i=0;i<4;i++){
    float dn=D(vUv+o[i]); dd+=clamp(dn-d,0.,1.);
    vec3 nn=N(vUv+o[i]);
    float ni=clamp(smoothstep(-.01,.01,dot(n-nn,vec3(1.))),0.,1.);
    float di=clamp(sign((dn-d)*.25+.0025),0.,1.);
    nd+=(1.-dot(n,nn))*di*ni;
  }
  col = step(.18,dd)>0. ? col*.58 : col*(1.+step(.25,nd)*.32);
  gl_FragColor=vec4(col,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,
  });
  const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));

  await pause();
  /* ---------- helpers ---------- */
  const scene = new THREE.Scene();
  const statics = new THREE.Group(); scene.add(statics); // everything added here is baked into one mesh below
  const grad = new THREE.DataTexture(new Uint8Array([105, 105, 105, 255, 160, 160, 160, 255, 215, 215, 215, 255, 255, 255, 255, 255]), 4, 1);
  grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
  const MC = new Map();
  const tm = (c) => { if (!MC.has(c)) MC.set(c, new THREE.MeshToonMaterial({ color: c, gradientMap: grad })); return MC.get(c); };
  const basic = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, ...o });
  const mesh = (geo, mat, x, y, z, parent) => { const m = new THREE.Mesh(geo, typeof mat === "string" ? tm(mat) : mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const box = (w, h, d, mat, x, y, z, parent = statics) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const cyl = (rt, rb, h, mat, x, y, z, parent = statics, seg = 12) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z, parent);
  // baked things can't be ray-picked one by one, so each clickable one gets an invisible box (the raycaster ignores .visible)
  const proxy = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), basic("#000000")); m.position.set(x, y, z); m.visible = false; scene.add(m); return m; };
  const _a = new V3(), _b = new V3(), _w = new V3(), _c = new THREE.Color(), _m4 = new THREE.Matrix4();
  // a box stretched between two points (points are in the parent's space)
  const limb = (m, p1, p2) => { m.position.copy(_a.copy(p1).add(p2).multiplyScalar(0.5)); m.parent.updateWorldMatrix(true, false); m.parent.localToWorld(_w.copy(p2)); m.lookAt(_w); m.scale.z = p1.distanceTo(p2); };
  const limbMesh = (t, col, parent) => mesh(new THREE.BoxGeometry(t, t, 1), col, 0, 0, 0, parent);
  const fx = (o) => { o.layers.set(FX); o.renderOrder = 5; return o; };
  // Images arrive as ImageBitmaps (the only decoder a worker has). They upload unflipped (row 0 = top),
  // so V is flipped in the texture transform: show `rep` of the height, starting `off` up from the bottom.
  const bitmaps = new THREE.ImageBitmapLoader();
  const setV = (t, rep, off) => { t.repeat.y = -rep; t.offset.y = 1 - off; };
  const loadTex = (src) => {
    const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.flipY = false; setV(t, 1, 0);
    bitmaps.load(src, (bmp) => { if (gone) return; t.image = bmp; t.needsUpdate = true; dirty = true; }, undefined, () => {});
    return t;
  };

  /* ---------- the room (x,z in [-3,3], y up) ---------- */
  const ROOM = new V3(0, 2.1, -0.4);
  box(6.3, 0.2, 6.3, C.floor, -0.15, -0.1, -0.15);
  for (let i = 0; i < 7; i++) box(6.3, 0.012, 0.03, C.plank, -0.15, 0.006, -3 + i * 0.92);
  box(0.3, 5.6, 6.3, C.wall2, -3.15, 2.8, -0.15);
  const WX0 = 0.7, WX1 = 2.7, WY0 = 2.4, WY1 = 4.4; // window opening in the back wall
  box(4, 5.6, 0.3, C.wall, -1.45, 2.8, -3.15);
  box(3 - WX1, 5.6, 0.3, C.wall, (WX1 + 3) / 2, 2.8, -3.15);
  box(WX1 - WX0, WY0, 0.3, C.wall, (WX0 + WX1) / 2, WY0 / 2, -3.15);
  box(WX1 - WX0, 5.6 - WY1, 0.3, C.wall, (WX0 + WX1) / 2, (WY1 + 5.6) / 2, -3.15);
  box(6, 0.22, 0.06, C.base, 0, 0.11, -2.98); box(0.06, 0.22, 6, C.base, -2.98, 0.11, 0);
  const wm = (WX0 + WX1) / 2, wy = (WY0 + WY1) / 2;
  box(WX1 - WX0 + 0.16, 0.1, 0.16, C.frame, wm, WY1 + 0.05, -3.02); box(WX1 - WX0 + 0.3, 0.08, 0.34, C.frame, wm, WY0 - 0.04, -2.92);
  box(0.1, WY1 - WY0, 0.16, C.frame, WX0 - 0.05, wy, -3.02); box(0.1, WY1 - WY0, 0.16, C.frame, WX1 + 0.05, wy, -3.02);
  box(0.06, WY1 - WY0, 0.08, C.frame, wm, wy, -3.1); box(WX1 - WX0, 0.06, 0.08, C.frame, wm, wy, -3.1);
  box(0.34, 2.5, 0.12, C.curtain, WX0 - 0.32, WY0 + 0.85, -2.9); box(0.5, 0.08, 0.08, C.metal, WX0 - 0.2, WY1 + 0.2, -2.92);
  // rug with two woven stripes
  box(3.2, 0.04, 2.4, C.rugEdge, -0.2, 0.02, 0.5); box(2.9, 0.045, 2.1, C.rug, -0.2, 0.024, 0.5);
  box(2.9, 0.05, 0.07, C.rugEdge, -0.2, 0.025, -0.2); box(2.9, 0.05, 0.07, C.rugEdge, -0.2, 0.025, 1.2);

  // left wall: shelf of books, and the TechFest trophy standing on the one lying flat
  box(0.5, 0.08, 2.2, C.desk, -2.75, 3.7, -0.9);
  { let z = -1.9; C.books.forEach((c, i) => { const h = 0.42 + ((i * 37) % 5) * 0.06, w = 0.16 + ((i * 13) % 3) * 0.04; box(0.36, h, w, c, -2.78, 3.74 + h / 2, z + w / 2); z += w + 0.02; }); }
  box(0.36, 0.3, 0.5, C.books[2], -2.78, 3.89, 0);
  const TROPHY_Y = 4.04;
  box(0.2, 0.06, 0.2, C.deskDark, -2.78, TROPHY_Y + 0.03, 0); cyl(0.03, 0.045, 0.14, C.gold, -2.78, TROPHY_Y + 0.13, 0, statics, 8);
  cyl(0.13, 0.06, 0.2, C.gold, -2.78, TROPHY_Y + 0.3, 0, statics, 10);
  box(0.04, 0.1, 0.04, C.gold, -2.78, TROPHY_Y + 0.31, 0.17); box(0.04, 0.1, 0.04, C.gold, -2.78, TROPHY_Y + 0.31, -0.17);
  const pTrophy = proxy(0.4, 0.5, 0.46, -2.78, TROPHY_Y + 0.22, 0);

  // left wall: four framed screenshots of real projects (click → the work section)
  const FR = { w: 1.0, h: 0.625 };
  const frameMat = (t) => new THREE.MeshToonMaterial({ map: t, gradientMap: grad, emissive: "#ffffff", emissiveMap: t, emissiveIntensity: 0.3 }); // a little self-lit so the work still reads at night
  const shots = frames.slice(0, 4).map((src, i) => {
    const z = 0.95 + (i % 2) * 1.2, y = 3.15 - Math.floor(i / 2) * 0.85;
    box(0.06, FR.h + 0.1, FR.w + 0.1, C.frame, -2.97, y, z);
    const m = mesh(new THREE.PlaneGeometry(FR.w, FR.h), frameMat(loadTex(src)), -2.935, y, z, scene);
    m.rotation.y = Math.PI / 2; m.castShadow = false; return m;
  });
  // low cabinet under them: a speaker, a few books, a cactus
  box(0.55, 0.9, 2.3, C.deskDark, -2.72, 0.45, 1.55); box(0.62, 0.06, 2.4, C.desk, -2.7, 0.93, 1.55);
  box(0.02, 0.72, 0.03, C.base, -2.44, 0.45, 1.55); box(0.03, 0.09, 0.03, C.gold, -2.43, 0.5, 1.4); box(0.03, 0.09, 0.03, C.gold, -2.43, 0.5, 1.7);
  box(0.34, 0.5, 0.34, C.metal, -2.72, 1.21, 0.72);
  cyl(0.1, 0.1, 0.02, C.metal2, -2.54, 1.29, 0.72).rotation.z = Math.PI / 2; cyl(0.05, 0.05, 0.02, C.metal2, -2.54, 1.08, 0.72).rotation.z = Math.PI / 2;
  box(0.36, 0.08, 0.5, C.books[0], -2.72, 1.0, 1.32); box(0.34, 0.08, 0.46, C.books[1], -2.72, 1.08, 1.34); box(0.3, 0.07, 0.42, C.books[5], -2.72, 1.155, 1.3);
  cyl(0.12, 0.1, 0.18, C.pot, -2.72, 1.05, 1.88); box(0.1, 0.3, 0.1, C.leaf, -2.72, 1.29, 1.88); box(0.06, 0.06, 0.14, C.leaf, -2.72, 1.3, 1.99); box(0.06, 0.14, 0.06, C.leaf2, -2.72, 1.37, 2.03);
  cyl(0.1, 0.12, 0.05, C.metal, -2.72, 0.985, 2.42); box(0.03, 0.26, 0.03, C.metal, -2.72, 1.13, 2.42);
  const nookShade = mesh(new THREE.CylinderGeometry(0.1, 0.19, 0.24, 8), basic("#ffd9a0"), -2.72, 1.36, 2.42, scene); nookShade.castShadow = false;
  const nook = new THREE.PointLight("#ffb46b", 4, 0, 2); nook.position.set(-2.5, 1.5, 2.42); scene.add(nook);

  // back wall: a cork board of sticky notes, and the degree above the monitor
  box(1.4, 1.0, 0.06, C.frame, -2.05, 3.35, -2.97); box(1.28, 0.88, 0.05, C.cork, -2.05, 3.35, -2.955);
  [[-2.5, 3.6], [-2.2, 3.62], [-1.9, 3.58], [-1.6, 3.6], [-2.35, 3.2], [-1.75, 3.15], [-2.05, 3.1]].forEach(([x, y], i) => box(0.2, 0.2, 0.02, C.notes[i % 4], x, y, -2.92));
  box(0.72, 0.56, 0.06, C.gold, -0.2, 3.72, -2.97); box(0.6, 0.44, 0.05, C.cream, -0.2, 3.72, -2.955);
  box(0.36, 0.035, 0.02, C.ink, -0.2, 3.84, -2.925); box(0.44, 0.025, 0.02, "#8b7a62", -0.2, 3.75, -2.925); box(0.3, 0.025, 0.02, "#8b7a62", -0.2, 3.68, -2.925); box(0.08, 0.08, 0.02, C.red, 0, 3.58, -2.925);
  const pDegree = proxy(0.76, 0.6, 0.1, -0.2, 3.72, -2.95);

  // fairy lights along the back wall: one instanced mesh so each bulb can twinkle
  const fairy = new THREE.PointLight("#ff9d5c", 2.2, 0, 2); fairy.position.set(0, 4.6, -2.2); scene.add(fairy);
  const NB = 16, bulbCols = ["#ffcf6a", "#ff9a62", "#ffe9b0"].map((c) => new THREE.Color(c));
  const bulbs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), new THREE.MeshBasicMaterial(), NB);
  for (let i = 0; i < NB; i++) { bulbs.setMatrixAt(i, _m4.makeTranslation(-2.7 + i * 0.37, 5.1 - Math.sin((i / 15) * Math.PI * 3) ** 2 * 0.18, -2.95)); bulbs.setColorAt(i, bulbCols[i % 3]); }
  scene.add(bulbs);

  await pause();
  /* desk, monitor (shows the About section, slowly scrolling), keyboard */
  const DESK_Y = 1.62;
  box(3.7, 0.14, 1.3, C.desk, 0.3, DESK_Y - 0.07, -2.3);
  for (const [x, z] of [[-1.47, -2.88], [2.07, -2.88], [-1.47, -1.72], [2.07, -1.72]]) box(0.1, DESK_Y - 0.14, 0.1, C.deskDark, x, (DESK_Y - 0.14) / 2, z);
  box(0.8, 0.5, 1.1, C.deskDark, 1.6, 1.2, -2.3); box(0.6, 0.04, 0.02, C.gold, 1.6, 1.25, -1.74);
  const tex = loadTex(screenSrc);
  const MON = new V3(-0.2, 2.42, -2.62);
  box(1.62, 1.0, 0.08, C.metal, MON.x, MON.y, MON.z);
  const screen = mesh(new THREE.PlaneGeometry(1.5, 0.9), basic("#ffffff", { map: tex }), MON.x, MON.y, MON.z + 0.045, scene);
  box(0.12, 0.5, 0.08, C.metal2, MON.x, DESK_Y + 0.25, MON.z - 0.04); box(0.6, 0.04, 0.34, C.metal2, MON.x, DESK_Y + 0.02, MON.z + 0.05);
  const monLight = new THREE.PointLight("#b4dcff", 3, 0, 2); monLight.position.set(MON.x, MON.y, MON.z + 0.5); scene.add(monLight);
  box(0.95, 0.05, 0.32, C.metal, -0.2, DESK_Y + 0.025, -1.95); box(0.85, 0.02, 0.24, "#5a6078", -0.2, DESK_Y + 0.055, -1.95);
  box(0.12, 0.04, 0.2, C.metal2, 0.42, DESK_Y + 0.02, -1.98);
  box(0.5, 0.03, 0.66, "#e6dcc5", -1.05, DESK_Y + 0.015, -1.95).rotation.y = 0.25;
  // pen cup, and the PC under the desk with a slow colour-cycling light
  cyl(0.09, 0.08, 0.2, C.books[1], 1.95, DESK_Y + 0.1, -2.72);
  box(0.025, 0.3, 0.025, C.notes[0], 1.92, DESK_Y + 0.27, -2.72).rotation.z = 0.2; box(0.025, 0.3, 0.025, C.red, 1.99, DESK_Y + 0.27, -2.7).rotation.z = -0.16; box(0.025, 0.3, 0.025, C.cream, 1.95, DESK_Y + 0.28, -2.76).rotation.x = 0.2;
  box(0.42, 0.95, 0.9, C.metal, -0.95, 0.475, -2.4); box(0.36, 0.85, 0.02, C.metal2, -0.95, 0.475, -1.945);
  const pcLight = mesh(new THREE.BoxGeometry(0.04, 0.6, 0.02), basic("#59d0ff"), -0.82, 0.5, -1.93, scene); pcLight.castShadow = false;
  // the phone (click → booking)
  const phone = new THREE.Group(); phone.position.set(1.86, DESK_Y + 0.02, -1.9); phone.rotation.y = -0.3; scene.add(phone);
  box(0.22, 0.035, 0.4, C.metal, 0, 0, 0, phone);
  const phoneScreen = mesh(new THREE.BoxGeometry(0.18, 0.012, 0.34), basic("#1b2030"), 0, 0.02, 0, phone); phoneScreen.castShadow = false;
  // bin with a few failed ideas
  cyl(0.2, 0.15, 0.42, "#3b3f55", 2.6, 0.21, -1.2); box(0.14, 0.1, 0.14, C.cream, 2.56, 0.44, -1.22); box(0.1, 0.08, 0.1, C.cream, 2.66, 0.43, -1.14).rotation.y = 0.5; box(0.1, 0.08, 0.1, C.cream, 2.22, 0.04, -1.0).rotation.y = 0.3;

  /* lamp */
  const LAMP_BASE = new V3(-1.15, DESK_Y, -2.55), LAMP_HEAD = new V3(-0.78, 2.78, -2.2), ELBOW = new V3(-1.22, 2.62, -2.72);
  cyl(0.2, 0.22, 0.06, C.metal, LAMP_BASE.x, DESK_Y + 0.03, LAMP_BASE.z);
  const la1 = limbMesh(0.06, C.metal, scene), la2 = limbMesh(0.06, C.metal, scene);
  limb(la1, new V3(LAMP_BASE.x, DESK_Y + 0.05, LAMP_BASE.z), ELBOW); limb(la2, ELBOW, LAMP_HEAD);
  const shadeMat = new THREE.MeshToonMaterial({ color: "#d9553a", gradientMap: grad, side: THREE.DoubleSide });
  const shade = mesh(new THREE.ConeGeometry(0.26, 0.32, 10, 1, true), shadeMat, LAMP_HEAD.x, LAMP_HEAD.y, LAMP_HEAD.z, scene); shade.rotation.set(0.35, 0, 0.45);
  const bulb = mesh(new THREE.SphereGeometry(0.08, 8, 6), basic("#ffe7b0"), LAMP_HEAD.x + 0.04, LAMP_HEAD.y - 0.13, LAMP_HEAD.z + 0.05, scene);
  const lamp = new THREE.SpotLight("#ffbf6e", 7, 0, 0.95, 0.55, 2);
  lamp.position.copy(bulb.position); lamp.target.position.set(-0.25, DESK_Y, -1.95); scene.add(lamp, lamp.target);
  lamp.castShadow = true; lamp.shadow.mapSize.set(512, 512); lamp.shadow.bias = -0.002; lamp.shadow.normalBias = 0.03; lamp.shadow.camera.near = 0.1;

  /* mug + steam */
  const MUG = new V3(1.42, DESK_Y, -2.25);
  const mug = cyl(0.13, 0.12, 0.26, C.mug, MUG.x, MUG.y + 0.13, MUG.z, scene);
  const handle = mesh(new THREE.TorusGeometry(0.07, 0.025, 6, 10), C.mug, MUG.x + 0.15, MUG.y + 0.14, MUG.z, scene);
  const coffee = cyl(0.11, 0.11, 0.02, C.coffee, MUG.x, MUG.y + 0.2, MUG.z, scene);
  const steam = [];
  for (let i = 0; i < 9; i++) { const s = fx(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), basic("#ffffff", { transparent: true, depthWrite: false }))); s.userData.t = Math.random(); s.userData.k = i * 1.7; scene.add(s); steam.push(s); }

  /* wristwatch on a little cushion, tilted toward the viewer: the visitor's real time */
  const watch = new THREE.Group(); watch.position.set(0.92, DESK_Y + 0.27, -1.84); watch.rotation.set(0.75, AZ0, 0, "YXZ"); scene.add(watch);
  box(0.24, 0.03, 1.0, C.strap, 0, -0.02, 0, watch); box(0.5, 0.32, 0.62, "#7c4a5a", 0, -0.2, 0.02, watch);
  cyl(0.3, 0.3, 0.08, C.gold, 0, 0, 0, watch, 20); cyl(0.26, 0.26, 0.09, C.cream, 0, 0.005, 0, watch, 20);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, q = i % 3 === 0; const mk = box(q ? 0.035 : 0.022, 0.01, q ? 0.06 : 0.04, q ? C.ink : "#8b7a62", Math.sin(a) * 0.21, 0.05, -Math.cos(a) * 0.21, watch); mk.rotation.y = -a; mk.castShadow = false; }
  const hand = (len, w, col, y) => { const p = new THREE.Group(); p.position.y = y; watch.add(p); box(w, 0.012, len, col, 0, 0, -len / 2 + 0.02, p).castShadow = false; return p; };
  const hH = hand(0.14, 0.045, C.ink, 0.06), hM = hand(0.2, 0.032, C.ink, 0.07), hS = hand(0.22, 0.016, C.red, 0.08);
  cyl(0.02, 0.02, 0.03, C.gold, 0, 0.08, 0, watch, 8);

  /* plant */
  const plant = new THREE.Group(); plant.position.set(2.45, 0.55, -2.35); scene.add(plant);
  cyl(0.3, 0.24, 0.55, C.pot, 2.45, 0.275, -2.35); cyl(0.27, 0.27, 0.02, "#3a2a20", 2.45, 0.54, -2.35);
  const leaf = (a, tilt, len, col) => { const pivot = new THREE.Group(), g = new THREE.Group(); pivot.rotation.y = a; g.rotation.x = -tilt; box(0.16, 0.05, len, col, 0, 0, len / 2, g); pivot.add(g); plant.add(pivot); };
  for (let i = 0; i < 7; i++) leaf((i / 7) * Math.PI * 2, 0.7 + (i % 3) * 0.25, 0.55 + (i % 2) * 0.25, i % 2 ? C.leaf : C.leaf2);
  box(0.06, 0.9, 0.06, C.leaf, 0, 0.45, 0, plant);

  await pause();
  /* chair (sling bag hung on its back) + tiny Taif (dark hair, short beard, lavender tee) */
  const CH = new V3(0, 0, -1.12);
  cyl(0.06, 0.06, 0.6, C.metal, CH.x, 0.4, CH.z);
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; box(0.06, 0.06, 0.45, C.metal, CH.x + Math.sin(a) * 0.2, 0.1, CH.z + Math.cos(a) * 0.2).rotation.y = a; }
  box(0.8, 0.12, 0.75, "#3b3f55", CH.x, 0.82, CH.z); box(0.78, 0.62, 0.1, "#3b3f55", CH.x, 1.25, CH.z + 0.4);
  box(0.46, 0.3, 0.14, C.bag, 0.08, 1.12, -0.6); box(0.3, 0.02, 0.02, "#5a6078", 0.08, 1.2, -0.525);
  box(0.05, 0.36, 0.05, C.bag, -0.1, 1.42, -0.63); box(0.05, 0.36, 0.05, C.bag, 0.26, 1.42, -0.63);
  const me = new THREE.Group(); me.position.copy(CH); scene.add(me);
  box(0.56, 0.3, 0.5, C.pants, 0, 1.02, 0, me);
  const torso = new THREE.Group(); torso.position.set(0, 1.15, 0); me.add(torso);
  box(0.62, 0.72, 0.42, C.tee, 0, 0.38, 0, torso);
  const head = new THREE.Group(); head.position.set(0, 0.98, 0); torso.add(head);
  box(0.5, 0.5, 0.48, C.skin, 0, 0, 0, head); box(0.54, 0.2, 0.52, C.hair, 0, 0.2, 0, head); box(0.54, 0.4, 0.14, C.hair, 0, 0.04, 0.2, head);
  box(0.06, 0.07, 0.02, C.hair, -0.12, 0.04, -0.245, head); box(0.06, 0.07, 0.02, C.hair, 0.12, 0.04, -0.245, head);
  box(0.46, 0.14, 0.04, C.hair, 0, -0.18, -0.235, head); // beard
  const thighs = [limbMesh(0.2, C.pants, me), limbMesh(0.2, C.pants, me)], shins = [limbMesh(0.17, C.pants, me), limbMesh(0.17, C.pants, me)];
  for (const s of [-1, 1]) { const i = s < 0 ? 0 : 1; limb(thighs[i], new V3(s * 0.15, 1.0, 0), new V3(s * 0.16, 1.0, -0.55)); limb(shins[i], new V3(s * 0.16, 1.0, -0.55), new V3(s * 0.17, 0.12, -0.62)); box(0.2, 0.1, 0.3, C.shoe, s * 0.17, 0.06, -0.7, me); }
  const uArms = [limbMesh(0.16, C.tee, me), limbMesh(0.16, C.tee, me)], fArms = [limbMesh(0.13, C.skin, me), limbMesh(0.13, C.skin, me)], hands = [limbMesh(0.12, C.skin, me), limbMesh(0.12, C.skin, me)];
  // "z z z" for the small hours
  const zGeo = mergeGeometries([new THREE.BoxGeometry(0.16, 0.04, 0.01).translate(0, 0.075, 0), new THREE.BoxGeometry(0.2, 0.04, 0.01).rotateZ(0.72), new THREE.BoxGeometry(0.16, 0.04, 0.01).translate(0, -0.075, 0)]);
  const zs = [0, 1, 2].map(() => { const m = fx(new THREE.Mesh(zGeo, basic("#ffffff", { transparent: true, depthWrite: false }))); m.visible = false; scene.add(m); return m; });

  await pause();
  /* ---------- outside: stars, the view through the window, rain, the building ---------- */
  const stars = fx(new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: "#e9eeff", size: 1, sizeAttenuation: false, transparent: true, depthWrite: false })));
  { const p = []; for (let i = 0; i < 260; i++) p.push(-40 + Math.random() * 60, -6 + Math.random() * 40, -30 - Math.random() * 4); stars.geometry.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); }
  scene.add(stars);
  // The view is a tiny hand-painted canvas (sky bands, moon or sun, clouds, a skyline) on a plane just outside
  // the glass. It is repainted when the light changes and slides a few pixels with the camera for depth.
  const OUT = 40, outCv = makeCanvas(OUT, OUT), outCtx = outCv.getContext("2d");
  const outTex = new THREE.CanvasTexture(outCv); outTex.colorSpace = THREE.SRGBColorSpace; outTex.minFilter = outTex.magFilter = THREE.NearestFilter; outTex.generateMipmaps = false; outTex.repeat.set(0.8, 1);
  const outside = mesh(new THREE.PlaneGeometry(WX1 - WX0 + 0.3, WY1 - WY0 + 0.3), basic("#ffffff", { map: outTex }), wm, wy, -3.34, scene); outside.castShadow = outside.receiveShadow = false;
  const SKYLINE = [[0, 7, 13], [6, 5, 19], [10, 8, 11], [17, 6, 22], [22, 7, 15], [28, 5, 18], [32, 8, 12]];
  const STARPX = Array.from({ length: 14 }, (_, i) => [(i * 17 + 5) % OUT, (i * 7 + 2) % 18]);
  const hex = (c) => "#" + c.getHexString();
  function paintOutside() {
    const g = outCtx, top = ENV.sky, hor = top.clone().lerp(_c.set(ENV.night ? "#3a3f86" : ENV.elev < 15 ? "#ffd9a8" : "#e4f2ff"), 0.6);
    for (let b = 0; b < 5; b++) { g.fillStyle = hex(top.clone().lerp(hor, b / 4)); g.fillRect(0, b * 8, OUT, 8); }
    if (ENV.stars > 0.3) { g.fillStyle = "#e9eeff"; STARPX.forEach(([x, y]) => g.fillRect(x, y, 1, 1)); }
    const dot = (x, y, r, c) => { g.fillStyle = c; for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (i * i + j * j <= r * r + 1) g.fillRect(x + i, y + j, 1, 1); };
    if (ENV.night) { dot(28, 10, 3, "#f4f1e2"); dot(30, 9, 3, hex(top.clone().lerp(hor, 0.25))); } // crescent moon
    else if (ENV.elev < 30) dot(27, 20, 4, hex(ENV.disc)); // low sun
    else { g.fillStyle = "#ffffff"; [[5, 6, 9], [8, 4, 5], [24, 11, 8], [27, 9, 4]].forEach(([x, y, w]) => g.fillRect(x, y, w, 2)); } // clouds
    const sil = top.clone().lerp(_c.set(ENV.night ? "#04050d" : "#4c607c"), ENV.night ? 0.6 : 0.55), lit = ENV.lamp > 0.4, pane = hex(sil.clone().lerp(_c.set("#ffffff"), 0.22));
    SKYLINE.forEach(([x, w, h], k) => {
      g.fillStyle = hex(sil); g.fillRect(x, OUT - h, w, h);
      g.fillStyle = lit ? "#ffcf87" : pane;
      for (let j = 0; j < h - 3; j += 3) for (let i = 1; i < w - 1; i += 2) if ((i * 7 + j * 13 + k * 5) % 5 < (lit ? 2 : 3)) g.fillRect(x + i, OUT - h + 2 + j, 1, 1);
    });
    outTex.needsUpdate = true;
  }
  const rainSystem = (n, win, len, box3) => {
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 6), 3));
    const m = fx(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: "#a7bbec", transparent: true, depthWrite: false })));
    m.userData = { n, win, len, box3, seed: Array.from({ length: n }, () => [Math.random(), Math.random(), Math.random()]) };
    scene.add(m); return m;
  };
  const rainIn = rainSystem(26, true, 0.35), rainOut = rainSystem(520, false, 1.4, [[-34, 10], [-30, 12], [-6, 14]]);

  // the room is the open top-right corner of a block one room deep; it fades in as the camera pulls back
  const CELL = { w: 6.3, h: 5.8 }, COLS = 5, FLOORS = 4;
  const bld = new THREE.Group(); scene.add(bld);
  const bMats = [];
  const bm = (n, d) => { const m = new THREE.MeshBasicMaterial(); m.userData = { n: new THREE.Color(n), d: new THREE.Color(d), c: new THREE.Color(n) }; bMats.push(m); return m; };
  const faces = () => [bm("#2c2c4c", "#a8987f"), bm("#2c2c4c", "#a8987f"), bm("#3d3d66", "#d8cbb3"), bm("#3d3d66", "#d8cbb3"), bm("#35355c", "#c4b49a"), bm("#35355c", "#c4b49a")];
  const addB = (w, h, d, x, y, z, m) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); bld.add(b); };
  const L0 = -3.3, X1 = 3.15, Z0 = -3.3, Z1 = 3.15, span = (COLS - 1) * CELL.w;
  addB(X1 - (L0 - span), CELL.h * FLOORS, Z1 - Z0, (X1 + L0 - span) / 2, -0.2 - (CELL.h * FLOORS) / 2, (Z0 + Z1) / 2, faces());
  addB(span, CELL.h, Z1 - Z0, L0 - span / 2, CELL.h / 2 - 0.2, (Z0 + Z1) / 2, faces());
  addB(span + 0.4, 0.3, Z1 - Z0 + 0.4, L0 - span / 2, CELL.h - 0.05, (Z0 + Z1) / 2, faces());
  addB(240, 0.2, 240, -10, -0.4 - CELL.h * FLOORS, 4, bm("#0c1022", "#9cb8d2"));
  const winCols = { warm: "#ffcf87", tv: "#86a9e0", dark: "#1a1d30" };
  const winMats = { warm: bm(winCols.warm, "#9cc3e6"), tv: bm(winCols.tv, "#9cc3e6"), dark: bm(winCols.dark, "#5b7fa6") }, winGeo = new THREE.PlaneGeometry(1.1, 1.6);
  const addWin = (x, y, z, ry) => {
    const r = Math.random(), m = new THREE.Mesh(winGeo, winMats[r < 0.42 ? "warm" : r < 0.52 ? "tv" : "dark"]);
    m.position.set(x, y, z); m.rotation.y = ry; bld.add(m);
  };
  for (let f = -FLOORS; f <= 0; f++) for (let c = 0; c < COLS; c++) {
    if (f === 0 && c === 0) continue;
    const y = f * CELL.h + CELL.h * 0.5 - 0.2, x0 = c === 0 ? 0 : L0 - (c - 1) * CELL.w - CELL.w / 2;
    addWin(x0 - 1.4, y, Z1 + 0.02, 0); addWin(x0 + 1.4, y, Z1 + 0.02, 0);
    if (c === 0) { addWin(X1 + 0.02, y, 1.4, Math.PI / 2); addWin(X1 + 0.02, y, -1.4, Math.PI / 2); }
  }

  await pause();
  // ~300 static boxes → one vertex-coloured mesh: the whole room costs a handful of draw calls
  {
    statics.updateMatrixWorld(true);
    const geos = [];
    statics.traverse((o) => {
      if (!o.isMesh) return;
      const g = o.geometry.clone().applyMatrix4(o.matrixWorld), c = o.material.color, n = g.attributes.position.count, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
      g.setAttribute("color", new THREE.BufferAttribute(a, 3)); geos.push(g); o.geometry.dispose();
    });
    scene.remove(statics);
    const m = new THREE.Mesh(mergeGeometries(geos), new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: grad })); m.castShadow = m.receiveShadow = true; scene.add(m);
  }

  await pause();
  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight("#4a5a8a", "#2a1d26", 0.9); scene.add(hemi);
  const sky = new THREE.DirectionalLight("#9fb2ff", 0.6); sky.castShadow = true; sky.shadow.mapSize.set(1024, 1024);
  Object.assign(sky.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 60 }); sky.shadow.bias = -0.001; sky.shadow.normalBias = 0.03;
  sky.target.position.set(1.2, 1.2, -1); scene.add(sky, sky.target);

  /* ---------- the visitor's local time ---------- */
  const now = () => { const d = new Date(); if (hourOverride != null) d.setHours(Math.floor(hourOverride), Math.round((hourOverride % 1) * 60)); return d; };
  const col = (a, b, t) => new THREE.Color(a).lerp(new THREE.Color(b), t);
  let ENV;
  function applyEnv() {
    const d = now(), h = d.getHours() + d.getMinutes() / 60;
    let i = 0; while (h >= KEYS[i + 1][0]) i++;
    const A = KEYS[i], B = KEYS[i + 1], t = (h - A[0]) / (B[0] - A[0]);
    ENV = { hour: h, sky: col(A[1], B[1], t), sunI: lerp(A[3], B[3], t), elev: lerp(A[4], B[4], t), lamp: lerp(A[5], B[5], t), hI: lerp(A[8], B[8], t), stars: lerp(A[9], B[9], t), disc: col(A[10], B[10], t) };
    ENV.night = ENV.stars > 0.5;
    ENV.rain = Q.has("rain") ? Q.get("rain") !== "0" : ENV.stars > 0.7;
    scene.background = ENV.sky;
    const el = degToRad(ENV.elev);
    sky.position.set(1.5 - Math.cos(el) * 6, 1.5 + Math.sin(el) * 20, -3 - Math.cos(el) * 20); sky.color.copy(col(A[2], B[2], t)); sky.intensity = ENV.sunI;
    hemi.color.copy(col(A[6], B[6], t)); hemi.groundColor.copy(col(A[7], B[7], t)); hemi.intensity = ENV.hI;
    stars.material.opacity = ENV.stars * (ENV.rain ? 0.1 : 1);
    const dayK = clamp(1 - ENV.stars * 1.4, 0, 1);
    for (const m of bMats) m.userData.c.copy(m.userData.n).lerp(m.userData.d, dayK);
    paintOutside();
    // text colour: whichever of paper or ink has more contrast against this sky (WCAG luminance, linear channels)
    const L = ENV.sky.r * 0.2126 + ENV.sky.g * 0.7152 + ENV.sky.b * 0.0722;
    ui.env({ bg: hex(ENV.sky), fg: L > 0.18 ? "#14171a" : "#f1ede4", time: d.getTime() });
    dirty = shadowsDirty = true;
  }

  /* ---------- camera & framing ---------- */
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, NEAR, FAR); cam.layers.enable(FX);
  const BUILD = new V3(-12.5, -8, 0);
  let W = Math.max(1, width), H = Math.max(1, height), S = 4, lw = 1, lh = 1, portrait = false, VH = 11.2, coarse = 0;
  function resize(w = W, h = H) {
    W = Math.max(1, w); H = Math.max(1, h); portrait = W / H < 0.8;
    S = clamp(Math.round(Math.min(H / 230, W / 300)), 2, 5) + coarse;
    lw = Math.ceil(W / S); lh = Math.ceil(H / S);
    renderer.setSize(lw, lh, false); ui.size({ w: lw * S, h: lh * S });
    rtC.setSize(lw, lh); rtN.setSize(lw, lh); post.uniforms.res.value.set(lw, lh);
    VH = portrait ? Math.max(10.5, 9.4 / (W / H)) : 11.2;
    dirty = true;
  }
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, inside: false, last: 0 };
  let scrollP = 0;
  const shotRoom = () => {
    const e = ease(scrollP);
    return { target: ROOM.clone().lerp(BUILD, e), az: AZ0 + ptr.x * degToRad(8) * (1 - e), el: EL0 + degToRad(ptr.y * 5 * (1 - e) + e * 6), zoom: lerp(1, portrait ? 0.24 : 0.27, e), fx: lerp(portrait ? 0.5 : 0.74, 0.5, e), fy: lerp(portrait ? 0.3 : 0.5, 0.5, e), near: NEAR };
  };
  // the near plane slides up to the screen so the camera flies through tiny Taif instead of being blocked
  const shotScreen = () => ({ target: screen.position.clone(), az: 0, el: degToRad(3), zoom: VH / (0.9 * 1.06), fx: 0.5, fy: 0.5, near: 59.75 });
  const shotWatch = () => ({ target: watch.localToWorld(new V3(0, 0.05, 0)), az: AZ0, el: degToRad(42), zoom: VH / (portrait ? 1.4 : 2.0), fx: 0.5, fy: 0.58, near: NEAR });
  const mixShot = (a, b, t) => ({ target: a.target.clone().lerp(b.target, t), az: lerp(a.az, b.az, t), el: lerp(a.el, b.el, t), zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), t)), fx: lerp(a.fx, b.fx, t), fy: lerp(a.fy, b.fy, t), near: lerp(a.near, b.near, Math.min(1, t * 2.2)) });
  function placeCam(s) {
    // zoom is folded into the frustum: three.js scales an ortho frustum by .zoom but not its off-centre offset
    const h = VH / 2 / s.zoom, w = (h * W) / H;
    cam.left = -s.fx * 2 * w; cam.right = (1 - s.fx) * 2 * w; cam.bottom = -s.fy * 2 * h; cam.top = (1 - s.fy) * 2 * h;
    cam.near = s.near; post.uniforms.span.value = FAR - s.near; cam.updateProjectionMatrix();
    cam.position.set(s.target.x + Math.sin(s.az) * Math.cos(s.el) * 60, s.target.y + Math.sin(s.el) * 60, s.target.z + Math.cos(s.az) * Math.cos(s.el) * 60);
    cam.lookAt(s.target); cam.updateMatrixWorld();
    // snap translation to the texel grid so a moving target never shimmers
    const tx = (cam.top - cam.bottom) / lh, r = _a.set(1, 0, 0).applyQuaternion(cam.quaternion), u = _b.set(0, 1, 0).applyQuaternion(cam.quaternion);
    const pr = cam.position.dot(r), pu = cam.position.dot(u);
    cam.position.addScaledVector(r, Math.round(pr / tx) * tx - pr).addScaledVector(u, Math.round(pu / tx) * tx - pu); cam.updateMatrixWorld();
  }

  /* ---------- picking & easter eggs (coordinates are NDC on the canvas: x right, y up, both -1..1) ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const clickables = [["screen", [screen]], ["watch", [watch]], ["mug", [mug, handle, coffee]], ["lamp", [shade, bulb, la1, la2]], ["plant", [plant]], ["me", [me]],
    ["trophy", [pTrophy]], ["degree", [pDegree]], ["frames", shots], ["phone", [phone]]];
  const owns = (o) => clickables.some(([, objs]) => objs.some((c) => { for (let p = o; p; p = p.parent) if (p === c) return true; return false; }));
  function pick(nx, ny) {
    ndc.set(nx, ny); ray.setFromCamera(ndc, cam);
    let best = null, bd = Infinity;
    for (const [name, objs] of clickables) for (const o of objs) { const h = ray.intersectObject(o, true)[0]; if (h && h.distance < bd) { bd = h.distance; best = name; } }
    const first = ray.intersectObjects(scene.children.filter((o) => o !== bld), true)[0]; // a nearer wall wins
    if (best && first && first.distance < bd - 0.01 && !owns(first.object)) best = null;
    return best;
  }
  // a small sparkle marks each thing that can be clicked until it has been
  const ANCHORS = {
    screen: new V3(MON.x + 0.62, MON.y + 0.42, MON.z + 0.1), watch: new V3(1.15, DESK_Y + 0.62, -1.8), mug: new V3(MUG.x, MUG.y + 0.5, MUG.z), lamp: new V3(LAMP_HEAD.x + 0.2, LAMP_HEAD.y + 0.28, LAMP_HEAD.z),
    plant: new V3(2.45, 1.55, -2.35), me: new V3(0.32, 2.5, -1.1), trophy: new V3(-2.78, TROPHY_Y + 0.62, 0), degree: new V3(0.24, 4.06, -2.9), frames: new V3(-2.9, 3.62, 1.55), phone: new V3(1.86, DESK_Y + 0.3, -1.9),
  };
  const sparkGeo = mergeGeometries([new THREE.BoxGeometry(0.24, 0.05, 0.01), new THREE.BoxGeometry(0.05, 0.24, 0.01)]), sparkMat = basic("#ffffff", { transparent: true, depthTest: false, depthWrite: false });
  const hints = Object.entries(ANCHORS).map(([name, p], i) => { const m = fx(new THREE.Mesh(sparkGeo, sparkMat)); m.position.copy(p); m.visible = false; m.userData = { name, i }; scene.add(m); return m; });
  const seen = new Set();

  let mode = "room", modeT = 0, from = null, hovered = null, lampOn = true, growth = 0, coffeeLevel = 0.6, burst = 0, waveT = -1, wakeT = 0, sleepK = 0, phoneT = 0;
  const go = (m) => { from = currentShot; mode = m; modeT = 0; ui.mode(m); dirty = true; };
  const asleep = () => ENV.hour >= 1 && ENV.hour < 5 && wakeT <= 0;
  function click(nx, ny) {
    if (mode === "watch") { go("room"); return true; }
    if (mode !== "room" || scrollP > 0.05) return false;
    const n = pick(nx, ny); if (!n) return false;
    seen.add(n);
    if (n === "screen") go("dive");
    else if (n === "watch") go("watch");
    else if (n === "mug") { coffeeLevel = 1; steam.forEach((s) => (s.userData.t = Math.random() * 0.3)); burst = 1.5; ui.toast("Fresh coffee."); }
    else if (n === "lamp") { lampOn = !lampOn; ui.toast(lampOn ? "Light on." : "Light off."); }
    else if (n === "plant") {
      growth++;
      if (growth <= 3) { leaf(growth * 1.3, 0.35, 0.7 + growth * 0.1, C.leaf2); ui.toast("It grew."); }
      else if (growth === 4) { box(0.22, 0.22, 0.22, C.flower, 0, 1.0, 0, plant); box(0.1, 0.1, 0.1, C.mug, 0, 1.12, 0, plant); ui.toast("It flowered."); }
      else ui.toast("That’s as big as it gets.");
    }
    else if (n === "me") {
      if (asleep()) { wakeT = 9; ui.toast("Still up? Me too."); }
      else { waveT = 0; ui.toast("Hi! Thanks for stopping by."); }
    }
    else if (n === "trophy") ui.toast(copy.trophy || "A trophy.");
    else if (n === "degree") ui.toast(copy.degree || "A degree.");
    else if (n === "frames") ui.go("#work");
    else if (n === "phone") { phoneT = 2.4; ui.toast("Let’s talk."); setTimeout(() => { if (!gone) ui.go("#booking"); }, 900); }
    dirty = shadowsDirty = true; return true;
  }

  /* ---------- tiny Taif: types, waves, and sleeps on the keyboard between 1 and 5 am ---------- */
  const SH = [new V3(-0.36, 0.69, -0.02), new V3(0.36, 0.69, -0.02)]; // shoulders, in the torso's space
  function poseMe(t, dt) {
    let wave = 0;
    if (waveT >= 0) { waveT += dt; wave = waveT < 2.4 ? Math.sin((Math.min(1, waveT / 0.35) * Math.PI) / 2) * (waveT > 2 ? (2.4 - waveT) / 0.4 : 1) : 0; if (waveT > 2.4) waveT = -1; }
    wakeT = Math.max(0, wakeT - dt);
    const before = sleepK; sleepK += ((asleep() ? 1 : 0) - sleepK) * (reduced ? 1 : Math.min(1, dt * 3)); if (sleepK < 0.002) sleepK = 0;
    const sk = sleepK, idleNod = Math.sin(t * 0.7) * 0.03;
    torso.rotation.set(-0.85 * sk, -0.55 * wave, 0);
    head.rotation.set(lerp(0.12 + idleNod, 0.2, sk) * (1 - wave), -1.25 * wave, 0.45 * sk);
    torso.updateMatrix();
    for (let i = 0; i < 2; i++) {
      const s = i ? 1 : -1, tap = reduced || sk > 0.5 ? 0 : Math.max(0, Math.sin(t * 14 + i * 2.1)) * 0.035;
      const el = new V3(s * 0.4, 1.62, -0.42).lerp(_a.set(s * 0.5, 1.68, -0.74), sk), hd = new V3(s * 0.2, 1.73 - tap, -0.86).lerp(_a.set(s * 0.2, 1.7, -1.02), sk);
      if (i === 1 && wave > 0) { el.lerp(new V3(0.62, 2.25, 0.05), wave); hd.lerp(new V3(0.68 + Math.sin(t * 12) * 0.12, 2.75, 0.2), wave); }
      const sh = SH[i].clone().applyMatrix4(torso.matrix);
      limb(uArms[i], sh, el); limb(fArms[i], el, hd);
      limb(hands[i], hd, hd.clone().add(_b.copy(hd).sub(el).normalize().multiplyScalar(0.12)));
    }
    return wave > 0 || Math.abs(sleepK - before) > 0.0005;
  }

  function updateRain(sys, on, a, t) {
    sys.visible = on && a > 0.01; if (!sys.visible) return;
    const { n, win, len, box3, seed } = sys.userData, arr = sys.geometry.attributes.position.array;
    sys.material.opacity = (win ? 0.5 : 0.55) * a;
    for (let i = 0; i < n; i++) {
      const s = seed[i];
      if (win) _a.set(WX0 + s[0] * (WX1 - WX0), WY1 + 0.3 - ((s[1] * 2.3 + t * 6) % 2.3), -3.32); // a thin sheet just outside the glass
      else { const [X, Yb, Z] = box3; _a.set(X[0] + s[0] * (X[1] - X[0]), Yb[1] - ((s[1] * (Yb[1] - Yb[0]) + t * 9) % (Yb[1] - Yb[0])), Z[0] + s[2] * (Z[1] - Z[0])); }
      arr[i * 6] = _a.x; arr[i * 6 + 1] = _a.y; arr[i * 6 + 2] = _a.z; arr[i * 6 + 3] = _a.x - 0.05; arr[i * 6 + 4] = _a.y - len; arr[i * 6 + 5] = _a.z;
    }
    sys.geometry.attributes.position.needsUpdate = true;
  }

  /* ---------- loop ---------- */
  let currentShot = shotRoom(), last = performance.now(), raf = 0, active = true, frames_ = 0, slowSum = 0, lastSec = -1;
  function frame(nowMs) {
    raf = nextFrame(frame);
    if (!active) { last = nowMs; return; }
    const steering = from || nowMs - ptr.last < 700 || waveT >= 0 || phoneT > 0;
    if (!steering && nowMs - last < 31) return; // idle: 30 fps is plenty for pixel art and halves the cost
    const dt = Math.min(0.05, (nowMs - last) / 1000); last = nowMs; const t = nowMs / 1000;
    const idle = !ptr.inside || nowMs - ptr.last > 4000;
    const gx = reduced ? 0 : idle ? Math.sin(t * 0.23) * 0.35 : ptr.tx, gy = reduced ? 0 : idle ? Math.sin(t * 0.31 + 1) * 0.25 : ptr.ty;
    const k = 1 - Math.exp(-6 * dt); ptr.x += (gx - ptr.x) * k; ptr.y += (gy - ptr.y) * k;

    const target = mode === "dive" ? shotScreen() : mode === "watch" ? shotWatch() : shotRoom();
    if (from) {
      modeT = Math.min(1, modeT + dt / (reduced ? 0.01 : 1.3)); currentShot = mixShot(from, target, ease(modeT));
      if (modeT >= 1) { from = null; if (mode === "dive") { mode = "site"; ui.dive(); } }
    } else currentShot = target;

    const d = now(), sec = d.getSeconds();
    const moving = poseMe(t, dt);
    if (phoneT > 0) { phoneT = Math.max(0, phoneT - dt); dirty = true; }
    // reduced motion: only render when something changed (a click, a scroll, the second hand)
    if (reduced && !dirty && !from && !moving && sec === lastSec) return;
    lastSec = sec; dirty = false;
    if (mode !== "site") placeCam(currentShot);

    const reveal = clamp((scrollP - 0.04) / 0.3, 0, 1);
    bld.visible = reveal > 0; for (const m of bMats) m.color.copy(ENV.sky).lerp(m.userData.c, reveal);
    updateRain(rainIn, ENV.rain && !reduced, 1, t); updateRain(rainOut, ENV.rain && !reduced, reveal, t);
    setV(tex, 0.7, 0.3 - (Math.sin(t * 0.12) * 0.5 + 0.5) * 0.3);
    outTex.offset.x = Math.round((0.1 + ptr.x * 0.06) * OUT) / OUT;
    coffeeLevel = Math.max(0.25, coffeeLevel - dt * 0.004); coffee.position.y = MUG.y + 0.05 + coffeeLevel * 0.18;
    burst = Math.max(0, burst - dt);
    for (const s of steam) {
      s.userData.t += dt * (reduced ? 0.05 : 0.35) * (1 + burst); if (s.userData.t > 1) s.userData.t -= 1; const u = s.userData.t, kk = s.userData.k;
      s.position.set(MUG.x + Math.sin(u * 7 + kk) * 0.06, MUG.y + 0.3 + u * 0.9, MUG.z + Math.cos(u * 5 + kk) * 0.04);
      s.material.opacity = (1 - u) * (0.35 + 0.4 * Math.min(1, burst + coffeeLevel)); s.scale.setScalar(1 + u * 1.4);
    }
    const lit = ENV.lamp > 0 && lampOn; lamp.intensity = lit ? 7 * Math.max(0.35, ENV.lamp) : 0; bulb.material.color.set(lit ? "#ffe7b0" : "#6b5a4a");
    const fl = ENV.lamp > 0.3 || ENV.night; bulbs.visible = fl; fairy.intensity = fl ? 2.2 : 0; nook.intensity = fl ? 4 : 0; nookShade.material.color.set(fl ? "#ffd9a0" : "#b9a78c");
    if (fl && !reduced) { for (let i = 0; i < NB; i++) bulbs.setColorAt(i, _c.copy(bulbCols[i % 3]).multiplyScalar(0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 2.4)))); bulbs.instanceColor.needsUpdate = true; }
    if (!reduced) { plant.rotation.z = Math.sin(t * 0.9) * 0.025; pcLight.material.color.setHSL((t * 0.04) % 1, 0.75, 0.62); }
    phoneScreen.material.color.set(phoneT > 0 ? (Math.floor(phoneT * 6) % 2 ? "#9fd0ff" : "#e6f4ff") : "#1b2030"); phone.rotation.z = phoneT > 0 && !reduced ? Math.sin(t * 40) * 0.05 : 0;
    me.visible = !(mode === "dive" && modeT > 0.18) && mode !== "site"; // step out of the way of the dive
    const min = d.getMinutes() + sec / 60, hr = (d.getHours() % 12) + min / 60;
    hS.rotation.y = (-sec / 60) * Math.PI * 2; hM.rotation.y = (-min / 60) * Math.PI * 2; hH.rotation.y = (-hr / 12) * Math.PI * 2;
    if (mode === "watch") ui.watch(d.getTime());
    if (sleepK > 0.05) {
      // rise up and to the left on screen, over the dark wall (to the right they vanish against the monitor)
      head.getWorldPosition(_w); _a.set(1, 0, 0).applyQuaternion(cam.quaternion); _b.set(0, 1, 0).applyQuaternion(cam.quaternion);
      zs.forEach((z, i) => { const u = ((reduced ? 0.35 : t * 0.22) + i / 3) % 1; z.visible = true; z.position.copy(_w).addScaledVector(_a, -0.55 - u * 0.5).addScaledVector(_b, 0.5 + u * 1.0); z.quaternion.copy(cam.quaternion); z.scale.setScalar(0.8 + u * 1.0); z.material.opacity = Math.sin(Math.PI * u) * sleepK; });
    } else zs.forEach((z) => (z.visible = false));
    const hintsOn = !reduced && mode === "room" && scrollP < 0.05 && !from;
    for (const h of hints) {
      const u = hintsOn && !seen.has(h.userData.name) ? ((t + h.userData.i * 0.7) % 7) / 0.7 : 2;
      h.visible = u < 1;
      if (h.visible) { h.quaternion.copy(cam.quaternion); h.rotateZ(u * 1.6); h.scale.setScalar(Math.sin(Math.PI * u) + 0.001); }
    }

    if (shadowsDirty || moving || frames_ % 8 === 0) { renderer.shadowMap.needsUpdate = true; shadowsDirty = false; }
    renderer.setRenderTarget(rtC); renderer.render(scene, cam);
    const bg = scene.background; scene.background = null; scene.overrideMaterial = normalMat; cam.layers.set(0);
    renderer.setClearColor(0x000000, 1); renderer.setRenderTarget(rtN); renderer.render(scene, cam);
    scene.overrideMaterial = null; scene.background = bg; cam.layers.enable(FX);
    renderer.setRenderTarget(null); renderer.render(postScene, postCam);

    if (++frames_ === 1) ui.ready();
    // slow device: count frames that arrived late for their intended pace (60 fps steering, 30 idle), then draw bigger pixels
    if (frames_ > 30 && frames_ <= 120 && dt > (steering ? 0.028 : 0.05)) slowSum++;
    if (frames_ === 120 && slowSum > 30 && coarse < 2) { coarse++; frames_ = 30; slowSum = 0; resize(); }
  }

  applyEnv(); resize(); placeCam(currentShot);
  const envTimer = setInterval(applyEnv, 60000);
  await pause();
  const warm = new THREE.Scene(); warm.add(new THREE.Mesh(new THREE.PlaneGeometry(), normalMat));
  for (const [sc, c] of [[scene, cam], [warm, cam], [postScene, postCam]]) { await renderer.compileAsync(sc, c).catch(() => {}); await pause(); }
  // Warm-up. ANGLE (Chrome on Windows) only finishes a shader at its first draw, so the first full frame
  // used to block for ~150 ms. Draw one object per shader variant, each in its own task, into the same
  // targets the real frame uses (a private layer hides everything else; lights join it so the variant matches).
  const WARM = 2, lights = [hemi, sky, lamp, fairy, monLight, nook], reps = new Map();
  scene.traverse((o) => {
    const m = o.material; if (!m || Array.isArray(m) || !o.visible) return;
    const key = [o.type, !!o.isInstancedMesh, m.type, m.vertexColors, !!m.map, m.side, m.transparent].join();
    if (!reps.has(key)) reps.set(key, o);
  });
  lights.forEach((l) => l.layers.enable(WARM));
  renderer.shadowMap.needsUpdate = true; // the first warm-up draw also fills the shadow maps
  renderer.setRenderTarget(rtC);
  for (const o of reps.values()) {
    if (signal?.aborted) break;
    o.layers.enable(WARM); cam.layers.set(WARM); renderer.render(scene, cam); o.layers.disable(WARM);
    await pause();
  }
  lights.forEach((l) => l.layers.disable(WARM));
  const bg0 = scene.background; scene.background = null; scene.overrideMaterial = normalMat; cam.layers.set(0);
  renderer.setRenderTarget(rtN); renderer.render(scene, cam);
  scene.overrideMaterial = null; scene.background = bg0; cam.layers.enable(FX);
  await pause();
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
  await pause();
  if (!signal?.aborted) raf = nextFrame(frame);

  return {
    resize,
    setScroll(p) { const q = reduced ? 0 : clamp(p, 0, 1); if (q === scrollP) return; scrollP = q; dirty = true; if (q > 0.05 && hovered) { hovered = null; ui.hover(null); } },
    setActive(v) { active = v; },
    /* pointer over the stage: tx,ty steer the camera (-1..1 across the stage); nx,ny are NDC on the canvas for picking */
    pointer(tx, ty, nx, ny, overUi) {
      ptr.tx = tx; ptr.ty = ty; ptr.inside = true; ptr.last = performance.now();
      const name = !overUi && mode === "room" && scrollP < 0.05 ? pick(nx, ny) : null;
      if (name !== hovered) { hovered = name; ui.hover(name); }
    },
    leave() { ptr.inside = false; ptr.tx = ptr.ty = 0; if (hovered) { hovered = null; ui.hover(null); } },
    click,
    probe(id, nx, ny) { ui.probe(id, pick(nx, ny)); }, // automated tests
    /* after the dive has landed: snap back to the room, no flight */
    reset() { mode = "room"; from = null; ui.mode("room"); currentShot = shotRoom(); dirty = true; },
    leaveWatch() { if (mode === "watch") go("room"); },
    dispose() {
      gone = true; stopFrame(raf); clearInterval(envTimer);
      scene.traverse((o) => { o.geometry?.dispose(); [].concat(o.material || []).forEach((m) => { m.map?.dispose(); m.dispose(); }); });
      [rtC, rtN, grad, normalMat, post, sparkGeo, zGeo].forEach((x) => x.dispose());
      renderer.dispose();
    },
  };
}
