/* The world around the block: the places the owner has lived, laid out like a map around his street.
   The home side is Bangladesh: Dhaka (the Parliament in its lake, the Shaheed Minar), Chattogram (the port,
   the Shah Amanat Bridge over the Karnaphuli), the beach at Cox's Bazar on the way past Chakaria, and as easter
   eggs the Bandarban hills above their clouds, a Sreemangal tea garden and the Madhabkunda waterfall.
   Across the water is the UAE: Dubai (Burj Khalifa, Museum of the Future, Dubai Frame, Burj Al Arab) and
   Abu Dhabi (Sheikh Zayed Grand Mosque, Etihad Towers, Capital Gate, Aldar HQ, the Louvre's dome), with the other
   five emirates as small easter eggs: Al Noor Mosque (Sharjah), Jebel Jais and its zipline (Ras Al Khaimah),
   the museum fort (Ajman), a dhow (Umm Al Quwain), Al Bidyah Mosque (Fujairah).

   Same rules as the street: no DOM, the static parts merged into one lit and one night-glow mesh, a few small
   moving parts, nothing drawn until the camera leaves the room. Everything sits where the pulled-back camera can
   see all of it (the far side of the map is high on screen, so the far things are the low ones).
   Hover names a place (WORLD_LABELS); a tap says it. */
import * as THREE from "three";
import { kitFor } from "./pixelStreet.js";

export const WORLD_LABELS = {
  burj: "Burj Khalifa, Dubai", museum: "Museum of the Future, Dubai", frame: "Dubai Frame", burjalarab: "Burj Al Arab, Dubai",
  etihad: "Etihad Towers, Abu Dhabi", capgate: "Capital Gate, Abu Dhabi", mosque: "Sheikh Zayed Grand Mosque, Abu Dhabi", aldar: "Aldar HQ, Abu Dhabi", louvre: "Louvre Abu Dhabi",
  alnoor: "Al Noor Mosque, Sharjah", jebeljais: "Jebel Jais, Ras Al Khaimah", ajman: "Ajman Museum, Ajman", dhow: "A dhow off Umm Al Quwain", bidyah: "Al Bidyah Mosque, Fujairah",
  parliament: "Jatiya Sangsad Bhaban, Dhaka", minar: "Shaheed Minar, Dhaka", bridge: "Shah Amanat Bridge, Chattogram", port: "Chattogram Port", coxs: "Cox’s Bazar, past Chakaria",
  bandarban: "Bandarban, above the clouds", tea: "Sreemangal tea gardens", waterfall: "Madhabkunda waterfall",
  launch: "A river launch", marina: "A marina in Abu Dhabi",
};

const SAND = "#e2c79b", WHITE = "#f2f1ec", GOLD = "#d6ae4f", GREEN = "#3f7a3c", LEAF = "#4f9a46";
const hemi = (r) => new THREE.SphereGeometry(r, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);

export function buildWorld({ scene, grad, G }) {
  const root = new THREE.Group(); root.visible = false; scene.add(root);
  const lit = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: grad });
  const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const kit = kitFor(root), S = kit(), N = kit(); // static lit · night lights
  const picks = [];
  const pick = (name, w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial()); m.position.set(x, y, z); m.visible = false; root.add(m); picks.push([name, [m]]); };
  const geo = (g, c, x, y, z) => S.geo(g, c, x, y, z);
  const Y = G; // ground level

  /* ---------- ground: home land, Dubai's sand, Abu Dhabi's island; the sea is the slab underneath ---------- */
  const land = (x0, x1, z0, z1, c, top = 0.02) => S.box(x1 - x0, 0.14, z1 - z0, c, (x0 + x1) / 2, Y + top - 0.07, (z0 + z1) / 2);
  const HOME = "#7f8c63";
  land(-72, 17, -44, 48, HOME); land(-96, -78, -44, 48, HOME); land(-78, -72, -6, 48, HOME); // the gap is the Karnaphuli
  land(17, 58, -46, 14, SAND); land(-42, 12, -79, -52, SAND); // Dubai · Abu Dhabi island
  const palm = (x, z, h = 2.6) => { S.box(0.22, h, 0.22, "#8a6a44", x, Y + h / 2, z); for (let i = 0; i < 5; i++) geo(new THREE.BoxGeometry(1.5, 0.12, 0.34).translate(0.7, 0, 0).rotateZ(-0.35).rotateY((i / 5) * Math.PI * 2), LEAF, x, Y + h, z); };

  /* ---------- Dubai ---------- */
  { // Burj Khalifa: a Y-shaped plan in setbacks, then the spire
    const X = 26, Z = -20; S.box(7.5, 1.2, 7.5, "#cdd4dc", X, Y + 0.6, Z);
    let y = Y + 1.2;
    for (let i = 0; i < 9; i++) {
      const k = i / 9, L = 3.0 * (1 - k * 0.78), w = 1.25 * (1 - k * 0.5), h = 3.3, c = i % 2 ? "#a7b6c6" : "#b8c5d3";
      for (let a = 0; a < 3; a++) geo(new THREE.BoxGeometry(L, h, w).translate(L / 2 - 0.3, h / 2, 0).rotateY(0.6 + (a * Math.PI * 2) / 3), c, X, y, Z);
      S.cyl(0.95 * (1 - k * 0.6), h, c, X, y + h / 2, Z, "y", 8);
      N.box(0.3, 0.12, 0.3, "#d6e6ff", X + Math.cos(0.6) * L * 0.6, y + h - 0.1, Z - Math.sin(0.6) * L * 0.6);
      y += h;
    }
    geo(new THREE.CylinderGeometry(0.06, 0.32, 8, 6), "#dfe4ea", X, y + 4, Z);
    pick("burj", 7, y + 8 - Y, 7, X, (Y + y + 8) / 2, Z);
    palm(21, -14); palm(31, -15); palm(20, -26); palm(30, -26);
  }
  { // Museum of the Future: a silver torus standing on a green mound
    const X = 34, Z = -2; geo(new THREE.SphereGeometry(4.2, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.32, 0.8), GREEN, X, Y, Z);
    geo(new THREE.TorusGeometry(3.0, 1.15, 8, 18).scale(1, 1.22, 1).rotateY(-0.7), "#cfd5dc", X, Y + 4.6, Z);
    for (let i = 0; i < 6; i++) geo(new THREE.BoxGeometry(0.9, 0.12, 0.2).rotateZ(i * 0.9).translate(0, 3.6, 0).rotateZ(i * 0.55).rotateY(-0.7), "#2c3440", X, Y + 4.6 - 3.6, Z);
    N.geo(new THREE.TorusGeometry(1.8, 0.08, 4, 18).scale(1, 1.22, 1).rotateY(-0.7), "#bfe0ff", X, Y + 4.6, Z);
    pick("museum", 7.5, 9, 4, X, Y + 4.6, Z);
  }
  { // Dubai Frame: two gold towers bridged at the top
    const X = 24, Z = -35;
    for (const s of [-1, 1]) { const dx = s * 3.6 * Math.cos(0.7), dz = -s * 3.6 * Math.sin(0.7); S.box(1.3, 12.5, 1.3, GOLD, X + dx, Y + 6.25, Z + dz); N.box(0.2, 11, 0.2, "#ffd27a", X + dx * 1.18, Y + 6, Z + dz * 1.18); }
    geo(new THREE.BoxGeometry(8.6, 1.4, 1.3).rotateY(0.7), GOLD, X, Y + 12.9, Z); geo(new THREE.BoxGeometry(8.6, 0.7, 1.3).rotateY(0.7), GOLD, X, Y + 0.35, Z);
    geo(new THREE.BoxGeometry(6, 0.5, 1.32).rotateY(0.7), "#9fc6e0", X, Y + 12.6, Z);
    pick("frame", 9, 14, 3, X, Y + 7, Z);
  }
  { // Ajman Museum: a sand-coloured fort with round towers and crenellations
    const X = 38, Z = -27; S.box(5, 2.2, 4, "#d6b47f", X, Y + 1.1, Z);
    for (let i = 0; i < 6; i++) { S.box(0.5, 0.4, 0.4, "#d6b47f", X - 2.2 + i * 0.88, Y + 2.4, Z + 2); S.box(0.5, 0.4, 0.4, "#d6b47f", X - 2.2 + i * 0.88, Y + 2.4, Z - 2); }
    for (const [dx, dz] of [[-2.5, 2], [2.5, -2]]) { S.cyl(0.85, 3.2, "#cfa972", X + dx, Y + 1.6, Z + dz, "y", 10); S.box(0.3, 0.4, 0.3, "#cfa972", X + dx, Y + 3.4, Z + dz); }
    S.box(1.1, 1.6, 1.1, "#c39d68", X + 0.8, Y + 3.0, Z); S.box(0.7, 0.9, 0.08, "#4a3a2a", X + 0.8, Y + 3.0, Z + 0.56); // wind tower
    pick("ajman", 6, 4, 5, X, Y + 2, Z);
  }
  { // Al Bidyah Mosque: low mud walls and four little domes
    const X = 44, Z = -10; S.box(3.4, 1.5, 3.4, "#c9a57a", X, Y + 0.75, Z);
    for (const [dx, dz] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) geo(hemi(0.62), "#c9a57a", X + dx, Y + 1.5, Z + dz);
    pick("bidyah", 3.6, 2.3, 3.6, X, Y + 1.1, Z);
  }
  { // Al Noor Mosque, Sharjah: a white Ottoman dome and two pencil minarets
    const X = 21, Z = -42; S.box(4.2, 2.6, 4.2, WHITE, X, Y + 1.3, Z); S.cyl(1.4, 0.6, WHITE, X, Y + 2.9, Z, "y", 12); geo(hemi(1.5), WHITE, X, Y + 3.2, Z);
    for (const s of [-1, 1]) { S.cyl(0.24, 7, WHITE, X + s * 2.4, Y + 3.5, Z + 2.2, "y", 8); geo(new THREE.ConeGeometry(0.3, 1, 8), "#9aa4ae", X + s * 2.4, Y + 7.5, Z + 2.2); N.box(0.34, 0.12, 0.34, "#ffe2a8", X + s * 2.4, Y + 5.5, Z + 2.2); }
    N.geo(hemi(0.4), "#ffe2a8", X, Y + 4.7, Z);
    pick("alnoor", 6, 8, 6, X, Y + 4, Z + 0.5);
  }

  /* ---------- the water between: Burj Al Arab on its islet, a dhow, a container ship ---------- */
  let sail;
  { const X = -7, Z = -49.5; S.cyl(3.0, 0.5, SAND, X, Y + 0.25, Z, "y", 14);
    const prof = new THREE.Shape([[0, 0], [0, 13], [0.6, 13], [1.9, 11.2], [3.0, 8.4], [3.6, 5.2], [3.7, 2], [3.6, 0]].map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(prof, { depth: 2.4, bevelEnabled: false, curveSegments: 1 }).translate(-1.6, 0, -1.2).rotateY(-0.5);
    geo(g, WHITE, X, Y + 0.5, Z);
    geo(new THREE.BoxGeometry(0.35, 14, 0.35).rotateY(-0.5), "#c9ced6", X - 1.6 * Math.cos(-0.5), Y + 7.5, Z + 1.6 * Math.sin(-0.5));
    for (let i = 0; i < 4; i++) geo(new THREE.BoxGeometry(0.12, 3.6, 0.12).rotateX(i % 2 ? 0.5 : -0.5).rotateY(-0.5), "#c9ced6", X - 1.75 * Math.cos(-0.5), Y + 2.5 + i * 2.8, Z + 1.75 * Math.sin(-0.5));
    S.cyl(1.0, 0.16, "#e6e6e6", X + 1.2, Y + 10.6, Z + 1.6, "y", 12);
    sail = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: 0.1, bevelEnabled: false, curveSegments: 1 }).translate(-1.55, 0, 1.22).rotateY(-0.5), new THREE.MeshBasicMaterial({ color: "#7fb8ff" }));
    sail.position.set(X, Y + 0.5, Z); sail.scale.set(0.96, 0.97, 1); root.add(sail);
    pick("burjalarab", 5, 14, 5, X, Y + 7, Z);
  }
  const dhow = new THREE.Group(); dhow.position.set(-30, Y, -48.5); dhow.rotation.y = 0.3; root.add(dhow);
  { const k = kit(); const hull = new THREE.Shape([[-2.4, 0.9], [-1.8, 0], [1.8, 0], [2.8, 1.2], [2.4, 1.2], [1.9, 0.8], [-2.0, 0.8]].map(([x, y]) => new THREE.Vector2(x, y)));
    k.geo(new THREE.ExtrudeGeometry(hull, { depth: 1.4, bevelEnabled: false, curveSegments: 1 }).translate(0, 0, -0.7), "#7a4f2e");
    k.box(0.14, 3.6, 0.14, "#5a3a22", 0.2, 2.4, 0); k.geo(new THREE.ShapeGeometry(new THREE.Shape([[0, 0], [2.4, 0.2], [0.1, 3.0]].map(([x, y]) => new THREE.Vector2(x, y)))).translate(0.2, 1.1, 0.05), "#f0e6cc");
    k.mesh(lit, dhow); pick("dhow", 5, 4, 2, -30, Y + 1.8, -48.5); }
  { // a container ship leaving Chattogram
    const X = -18, Z = -48.5; S.box(11, 1.1, 2.6, "#1f2b44", X, Y + 0.55, Z); S.box(11, 0.4, 2.62, "#9a2f2a", X, Y + 0.15, Z); S.box(1.6, 1.8, 2.2, WHITE, X + 4.4, Y + 2, Z);
    ["#c8463c", "#2f6fb0", "#3f9a5a", "#e09a3a", "#2a8a8a", "#c8463c", "#e0c040", "#2f6fb0"].forEach((c, i) => S.box(1.15, 0.8, 2.2, c, X - 4.2 + (i % 6) * 1.2, Y + 1.5 + Math.floor(i / 6) * 0.8, Z));
    N.box(0.2, 0.2, 0.2, "#ff5a4a", X + 4.4, Y + 3.1, Z);
  }

  /* ---------- Abu Dhabi, on its island ---------- */
  { // Etihad Towers: five curved glass towers of different heights
    const X = -4, Z = -58;
    [[0, 0, 17], [2.6, 1.4, 15], [-2.6, 1.2, 13.5], [1.4, -2.4, 12], [-1.6, -2.2, 10.5]].forEach(([dx, dz, h], i) => {
      geo(new THREE.CylinderGeometry(0.75, 1.1, h, 8).scale(1.25, 1, 0.85).translate(0, h / 2, 0).rotateY(i * 0.7), "#4f6c8c", X + dx, Y, Z + dz);
      geo(new THREE.SphereGeometry(0.75, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.25, 0.6, 0.85).rotateY(i * 0.7), "#6f8aa6", X + dx, Y + h, Z + dz);
      N.box(0.16, h * 0.7, 0.16, "#cfe0ff", X + dx + 0.95, Y + h * 0.45, Z + dz + 0.3);
    });
    pick("etihad", 7, 17, 6, X, Y + 8.5, Z);
  }
  { // Capital Gate: leaning 18 degrees, with its steel splash at the foot
    const X = -15, Z = -55; geo(new THREE.BoxGeometry(2.3, 12, 2.3).translate(0, 6, 0).rotateZ(-0.32).rotateY(0.8), "#6f8daa", X, Y, Z);
    geo(new THREE.BoxGeometry(2.36, 0.12, 2.36).translate(0, 4, 0).rotateZ(-0.32).rotateY(0.8), "#9fb6cc", X, Y, Z); geo(new THREE.BoxGeometry(2.36, 0.12, 2.36).translate(0, 8, 0).rotateZ(-0.32).rotateY(0.8), "#9fb6cc", X, Y, Z);
    geo(new THREE.BoxGeometry(5, 0.3, 2).rotateZ(0.25).rotateY(0.3), "#d9dde2", X + 2.4, Y + 1.4, Z + 1.2);
    pick("capgate", 6, 12, 4, X + 1.5, Y + 6, Z);
  }
  { // Aldar HQ: the round building, a coin on its edge
    const X = -14, Z = -66; S.box(3, 0.6, 2, "#b8c2cc", X, Y + 0.3, Z);
    geo(new THREE.CylinderGeometry(4.1, 4.1, 1.5, 20).rotateX(Math.PI / 2).rotateY(0.7), "#6d8fb0", X, Y + 4.4, Z);
    geo(new THREE.TorusGeometry(4.1, 0.22, 4, 20).rotateY(0.7), "#cdd6de", X, Y + 4.4, Z);
    for (let i = -3; i <= 3; i++) geo(new THREE.BoxGeometry(0.1, Math.sqrt(16 - i * i) * 2, 1.54).rotateY(0.7), "#4d6a88", X + i * Math.cos(0.7), Y + 4.4, Z - i * Math.sin(0.7));
    N.geo(new THREE.TorusGeometry(2.4, 0.1, 4, 16).rotateY(0.7), "#cfe0ff", X, Y + 4.4, Z);
    pick("aldar", 8.4, 8.6, 3, X, Y + 4.4, Z);
  }
  { // Sheikh Zayed Grand Mosque: white courtyard, a big dome and many small ones, four minarets, the pools in front
    const X = -27, Z = -63, R = 0.75, cos = Math.cos(R), sin = Math.sin(R);
    const at = (u, v) => [X + u * cos + v * sin, Z - u * sin + v * cos]; // the mosque's own axes, turned to face the camera
    const b = (w, h, d, c, u, y, v) => { const [x, z] = at(u, v); geo(new THREE.BoxGeometry(w, h, d).rotateY(R), c, x, Y + y, z); };
    b(15, 1.0, 10, WHITE, 0, 0.5, 0); b(12, 0.06, 6, "#e6eee8", 0, 1.03, 0.6); // platform, courtyard
    b(11, 2.2, 3, WHITE, 0, 2.1, -3.3); b(15, 1.6, 0.8, WHITE, 0, 1.8, 4.6); b(0.8, 1.6, 9, WHITE, -7.1, 1.8, 0); b(0.8, 1.6, 9, WHITE, 7.1, 1.8, 0);
    { const [x, z] = at(0, -3.3); S.cyl(1.35, 0.7, WHITE, x, Y + 3.55, z, "y", 12); geo(hemi(1.5).scale(1, 1.25, 1), WHITE, x, Y + 3.9, z); geo(new THREE.ConeGeometry(0.12, 0.8, 6), GOLD, x, Y + 6.1, z); N.geo(hemi(0.5), "#dbe6ff", x, Y + 4.4, z); }
    for (const u of [-4.2, -2.4, 2.4, 4.2]) { const [x, z] = at(u, -3.3); geo(hemi(0.75), WHITE, x, Y + 3.2, z); }
    for (let u = -6; u <= 6; u += 2) { const [x, z] = at(u, 4.6); geo(hemi(0.45), WHITE, x, Y + 2.6, z); }
    for (let v = -2.5; v <= 3; v += 2.75) for (const u of [-7.1, 7.1]) { const [x, z] = at(u, v); geo(hemi(0.45), WHITE, x, Y + 2.6, z); }
    for (const [u, v] of [[-7.3, -4.8], [7.3, -4.8], [-7.3, 4.8], [7.3, 4.8]]) { const [x, z] = at(u, v); S.cyl(0.32, 8, WHITE, x, Y + 4, z, "y", 8); S.cyl(0.42, 0.3, WHITE, x, Y + 6.4, z, "y", 8); geo(new THREE.ConeGeometry(0.2, 0.9, 6), GOLD, x, Y + 8.4, z); N.box(0.36, 0.14, 0.36, "#ffe2a8", x, Y + 6.6, z); }
    { const [x, z] = at(0, 6.5); geo(new THREE.BoxGeometry(12, 0.08, 1.4).rotateY(R), "#5aa0d0", x, Y + 0.06, z); }
    pick("mosque", 15, 8, 11, X, Y + 4, Z);
  }
  { // Louvre Abu Dhabi: a flat lattice dome floating over white galleries at the water's edge
    const X = -35, Z = -57; for (const [dx, dz, h] of [[-1.5, 0.5, 1.6], [1.2, -1, 2], [0.4, 1.6, 1.3]]) S.box(2.2, h, 2.2, WHITE, X + dx, Y + h / 2, Z + dz);
    geo(new THREE.CylinderGeometry(4.6, 4.8, 0.5, 18), "#a9adb4", X, Y + 2.6, Z); geo(new THREE.CylinderGeometry(3.6, 3.6, 0.52, 18), "#c4c8ce", X, Y + 2.62, Z);
    for (const a of [0.5, 2.6, 4.7]) S.box(0.2, 2.4, 0.2, "#8d9198", X + Math.cos(a) * 4.2, Y + 1.2, Z + Math.sin(a) * 4.2);
    pick("louvre", 9.6, 3, 9.6, X, Y + 1.6, Z);
  }
  { // Jebel Jais, Ras Al Khaimah: the mountain and the world's longest zipline
    const X = -1, Z = -73; geo(new THREE.ConeGeometry(7, 8.5, 6).rotateY(0.3), "#9a7556", X, Y + 4.25, Z); geo(new THREE.ConeGeometry(3.4, 2.4, 6).rotateY(0.3), "#86644a", X, Y + 7.3, Z);
    S.box(0.8, 0.5, 0.8, "#5a5f68", X, Y + 8.7, Z);
    pick("jebeljais", 12, 9, 10, X, Y + 4.5, Z);
  }
  const zipA = new THREE.Vector3(-1, Y + 8.6, -73), zipB = new THREE.Vector3(8.5, Y + 0.9, -66);
  { const d = zipB.clone().sub(zipA), len = d.length(); const line = new THREE.BoxGeometry(len, 0.05, 0.05); const m = new THREE.Matrix4().lookAt(new THREE.Vector3(), d, new THREE.Vector3(0, 1, 0)); line.rotateY(-Math.PI / 2).applyMatrix4(m); geo(line, "#2a2c33", (zipA.x + zipB.x) / 2, (zipA.y + zipB.y) / 2, (zipA.z + zipB.z) / 2); S.box(1.2, 0.8, 1.2, "#5a5f68", zipB.x, zipB.y - 0.4, zipB.z); }
  const rider = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.55, 0.3), new THREE.MeshToonMaterial({ color: "#e8501e", gradientMap: grad })); root.add(rider);
  for (const [x, z] of [[-30, -70], [-20, -75], [6, -60], [-38, -66], [-8, -76]]) palm(x, z, 2.2);
  for (const [x, z, r] of [[-34, -75, 4], [-22, -78, 3.5], [8, -76, 3]]) geo(new THREE.SphereGeometry(r, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.6, 0.35, 1), "#d8bc8c", x, Y, z); // dunes

  /* ---------- Bangladesh: Dhaka ---------- */
  { // Jatiya Sangsad Bhaban (Louis Kahn): concrete volumes with round and triangular cut-outs, standing in its lake
    const X = -50, Z = -21; land(-61, -39, -31, -11, "#4d8fbf", 0.04);
    S.box(14, 0.5, 14, "#d9d3c6", X, Y + 0.25, Z); S.cyl(3.2, 7, "#b9b0a2", X, Y + 3.5, Z, "y", 8);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8, x = X + Math.cos(a) * 4.6, z = Z + Math.sin(a) * 4.6, h = i % 2 ? 5 : 5.8;
      geo(new THREE.BoxGeometry(2.6, h, 2.6).rotateY(-a), "#b4ab9d", x, Y + h / 2 + 0.5, z);
      const ox = Math.cos(a) * 1.32, oz = Math.sin(a) * 1.32; // the cut-out on the outward face
      geo(new THREE.CylinderGeometry(0.75, 0.75, 0.06, 12).rotateZ(Math.PI / 2).rotateY(-a), "#2a2a30", x + ox, Y + h / 2 + 0.7, z + oz);
      if (i % 2 === 0) geo(new THREE.ConeGeometry(0.6, 0.9, 3).rotateX(Math.PI).rotateY(-a), "#2a2a30", x + ox * 1.01, Y + 1.6, z + oz * 1.01);
      for (let k = 1; k < 4; k++) geo(new THREE.BoxGeometry(2.62, 0.07, 2.62).rotateY(-a), "#ece8df", x, Y + 0.5 + k * (h / 4), z); // the marble bands
      N.geo(new THREE.CylinderGeometry(0.5, 0.5, 0.07, 10).rotateZ(Math.PI / 2).rotateY(-a), "#ffd890", x + ox * 1.02, Y + h / 2 + 0.7, z + oz * 1.02);
    }
    pick("parliament", 13, 7, 13, X, Y + 3.5, Z);
  }
  { // Shaheed Minar: the bowed white columns and the red sun behind them
    const X = -66, Z = -9, R = 0.75, at = (u) => [X + u * Math.cos(R), Z - u * Math.sin(R)];
    S.box(8, 0.5, 5, "#e9e6dd", X, Y + 0.25, Z); S.box(6.5, 0.5, 3.6, "#f1eee6", X, Y + 0.75, Z - 0.3);
    { const [x, z] = at(0); geo(new THREE.CylinderGeometry(1.9, 1.9, 0.1, 18).rotateX(Math.PI / 2).rotateY(R), "#d23a2e", x - Math.sin(R) * 1.2, Y + 3.6, z - Math.cos(R) * 1.2); }
    for (const [u, h] of [[-2.6, 3.6], [-2.1, 3.6], [-0.9, 5.4], [-0.3, 5.4], [0.3, 5.4], [0.9, 5.4], [2.1, 3.6], [2.6, 3.6]]) {
      const [x, z] = at(u); geo(new THREE.BoxGeometry(0.22, h, 0.24).rotateY(R), WHITE, x, Y + 1 + h / 2, z);
      if (Math.abs(u) < 1) geo(new THREE.BoxGeometry(0.22, 1.2, 0.24).translate(0, 0.6, 0).rotateX(0.7).rotateY(R), WHITE, x, Y + 1 + h, z); // the bowed head
    }
    { const [x, z] = at(-0.6); geo(new THREE.BoxGeometry(2.0, 0.2, 0.24).rotateY(R), WHITE, x + 0.3 * Math.cos(R), Y + 6.4, z - 0.3 * Math.sin(R)); }
    pick("minar", 8, 6.5, 5, X, Y + 3, Z);
  }

  /* ---------- Chattogram: the port on the shore, the Shah Amanat Bridge over the Karnaphuli ---------- */
  { // three ship-to-shore cranes and the container yard
    for (const x of [-28, -20, -12]) {
      const z = -42; for (const dx of [-1.2, 1.2]) for (const dz of [-1, 1]) S.box(0.3, 6.5, 0.3, x === -20 ? "#2f6fb0" : "#c8463c", x + dx, Y + 3.25, z + dz);
      S.box(2.8, 0.5, 2.4, WHITE, x, Y + 6.6, z); S.box(0.5, 0.45, 10, x === -20 ? "#2f6fb0" : "#c8463c", x, Y + 6.2, z - 2.5); S.box(1.0, 0.8, 1.0, WHITE, x, Y + 5.6, z - 5.5);
      N.box(0.22, 0.22, 0.22, "#ff5a4a", x, Y + 7.0, z - 7.4);
    }
    ["#c8463c", "#2f6fb0", "#3f9a5a", "#e09a3a", "#2a8a8a", "#7a5aa8", "#c8463c", "#2f6fb0", "#e0c040", "#3f9a5a"].forEach((c, i) => S.box(2.4, 1.0, 1.1, c, -30 + (i % 5) * 2.6, Y + 0.5 + Math.floor(i / 5) * 1.0, -37.5));
    pick("port", 20, 7, 9, -20, Y + 3.5, -41);
  }
  { // Shah Amanat Bridge: a single A-shaped pylon, cables fanning down to the deck
    const X = -75, Z = -16;
    S.box(16, 0.5, 2.6, "#cfcbc2", X, Y + 1.6, Z); S.box(16, 0.2, 2.7, "#8a8d94", X, Y + 1.9, Z);
    for (const dx of [-7.5, 7.5]) S.box(1.2, 1.4, 2.4, "#bcb8ae", X + dx, Y + 0.7, Z);
    for (const s of [-1, 1]) geo(new THREE.BoxGeometry(0.45, 10.2, 0.45).rotateX(s * 0.15), "#d8d4cb", X, Y + 5.0, Z + s * 0.75);
    S.box(0.6, 1.2, 0.6, "#d8d4cb", X, Y + 10.3, Z);
    for (const s of [-1, 1]) for (let i = 1; i <= 4; i++) { const dx = s * i * 1.7, top = new THREE.Vector3(X, Y + 9.8, Z), end = new THREE.Vector3(X + dx, Y + 1.9, Z), d = end.clone().sub(top); const g = new THREE.BoxGeometry(0.06, d.length(), 0.06).rotateZ(-Math.atan2(d.x, -d.y)); geo(g, "#f0eee8", (top.x + end.x) / 2, (top.y + end.y) / 2, Z); }
    for (const dx of [-6, -2, 2, 6]) N.box(0.2, 0.3, 0.2, "#ffd890", X + dx, Y + 2.2, Z + 1.4);
    pick("bridge", 16, 10.5, 3, X, Y + 5, Z);
  }

  /* ---------- Cox's Bazar (past Chakaria), and the easter eggs: Bandarban, Sreemangal, Madhabkunda ---------- */
  { land(-70, -34, -44, -40.5, "#ead6a6", 0.05);
    [["#c8463c", -66], ["#e0c040", -60], ["#2f6fb0", -54], ["#3f9a5a", -48], ["#e8501e", -42]].forEach(([c, x]) => { S.box(0.1, 1.5, 0.1, "#6a5a4a", x, Y + 0.8, -42.4); geo(new THREE.ConeGeometry(1.1, 0.5, 8), c, x, Y + 1.6, -42.4); S.box(0.6, 0.15, 1.2, WHITE, x + 0.9, Y + 0.3, -41.8); });
    const boat = new THREE.Shape([[-1.6, 0.6], [-1.2, 0], [1.2, 0], [1.9, 0.9], [1.5, 0.6]].map(([x, y]) => new THREE.Vector2(x, y)));
    geo(new THREE.ExtrudeGeometry(boat, { depth: 0.8, bevelEnabled: false, curveSegments: 1 }).translate(0, 0, -0.4).rotateY(0.4), "#3f6fa0", -52, Y, -46.5);
    pick("coxs", 30, 2.5, 5, -52, Y + 1, -42.5);
  }
  { // Bandarban: steep green hills, Nilgiri above the clouds
    for (const [dx, dz, h, r] of [[0, 0, 5, 2.6], [-2.6, 1.6, 3.6, 2.2], [2.4, 1.8, 3.2, 2], [-1, -2.2, 4, 2.2]]) geo(new THREE.ConeGeometry(r, h, 6).rotateY(dx), dx === 0 ? "#3c7a3a" : "#4a8a44", -70 + dx, Y + h / 2, -32 + dz);
    for (const [dx, dz] of [[-1.6, 0.6], [1.4, 0.9], [0.2, 2.2]]) S.box(2.2, 0.5, 1.0, "#f4f4f4", -70 + dx, Y + 2.4, -32 + dz);
    pick("bandarban", 8, 5, 7, -70, Y + 2.5, -31.5);
  }
  { // Sreemangal: a tea garden, rows of bushes on a low hill, two shade trees
    const X = -59, Z = -36; geo(new THREE.SphereGeometry(4, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.3, 0.35, 0.8), "#6a9a4a", X, Y, Z);
    for (let r = -2; r <= 2; r++) for (let c = -3; c <= 3; c++) { const h = 1.35 - Math.hypot(c / 4, r / 2.5) * 0.9; if (h > 0.2) S.box(0.9, 0.42, 0.55, r % 2 ? "#3f8a3a" : "#56a44a", X + c * 1.15, Y + h, Z + r * 1.1); }
    for (const dx of [-3.2, 2.8]) { S.box(0.2, 2.2, 0.2, "#6a5038", X + dx, Y + 1.8, Z - 0.6); S.box(2.2, 0.5, 1.8, "#2f6b33", X + dx, Y + 3.0, Z - 0.6); }
    pick("tea", 10, 3.4, 7, X, Y + 1.5, Z);
  }
  const drops = [];
  { // Madhabkunda: a dark cliff, the fall, and its pool
    const X = -45, Z = -34; S.box(5, 7, 2.4, "#6f6052", X, Y + 3.5, Z); S.box(4, 1.2, 2.6, "#5d7a4a", X, Y + 7.2, Z); S.box(3, 2.4, 2, "#7d6c5c", X - 3.4, Y + 1.2, Z + 0.3); S.box(2.4, 3, 2, "#7d6c5c", X + 3.2, Y + 1.5, Z + 0.2);
    land(X - 2.4, X + 2.4, Z + 1.2, Z + 4.2, "#5aa0d0", 0.06);
    S.box(1.1, 6.6, 0.1, "#cfe8f4", X - 0.4 * 0 + 0.3, Y + 3.6, Z + 1.24);
    for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.08), new THREE.MeshBasicMaterial({ color: "#ffffff" })); m.position.set(X + 0.1 + (i % 3) * 0.3, Y, Z + 1.3); m.userData.k = i / 7; root.add(m); drops.push(m); }
    pick("waterfall", 5, 7.5, 3, X, Y + 3.8, Z + 0.6);
  }
  for (const [x, z] of [[-40, -16], [-62, -26], [-36, -32], [-80, -30], [-66, 4], [-84, -2]]) { S.box(0.22, 3, 0.22, "#7a5c3c", x, Y + 1.5, z); for (let i = 0; i < 6; i++) geo(new THREE.BoxGeometry(1.4, 0.1, 0.3).translate(0.65, 0, 0).rotateZ(-0.45).rotateY(i), "#3f8a3a", x, Y + 3, z); } // coconut palms

  /* ---------- neighbourhoods: homes, parks and boats, so no ground is left bare ---------- */
  const rnd = (a, b, c) => { let h = Math.imul((a * 73856093) ^ (b * 19349663) ^ (c * 83492791), 2654435761); h ^= h >>> 15; return (h >>> 0) / 4294967296; };
  // an apartment block with windows on its two camera-facing walls (lit ones glow at night). Bangladesh style: pastel
  // render, balconies, water tanks on the roof. Gulf style: glass, white floor bands, a plant room on top.
  const block = (x, z, w, d, floors, c, gulf = false) => {
    const FH = 1.35, h = floors * FH + 0.4, win = gulf ? "#5a86ad" : "#2d3546";
    S.box(w, h, d, c, x, Y + h / 2, z);
    const nx = Math.max(1, Math.floor((w - 0.3) / 0.95)), nz = Math.max(1, Math.floor((d - 0.3) / 0.95));
    for (let f = 0; f < floors; f++) {
      const y = Y + 0.95 + f * FH;
      for (let i = 0; i < nx; i++) { const xx = x - w / 2 + (w / nx) * (i + 0.5); S.box(0.48, 0.6, 0.06, win, xx, y, z + d / 2 + 0.02); if (rnd(x | 0, f, i) < 0.45) N.box(0.48, 0.6, 0.07, "#ffd890", xx, y, z + d / 2 + 0.03); if (!gulf && f > 0 && (f + i) % 3 === 0) S.box(0.8, 0.08, 0.4, "#ece6da", xx, y - 0.45, z + d / 2 + 0.2); }
      for (let i = 0; i < nz; i++) { const zz = z - d / 2 + (d / nz) * (i + 0.5); S.box(0.06, 0.6, 0.48, win, x + w / 2 + 0.02, y, zz); if (rnd(z | 0, f, i + 9) < 0.45) N.box(0.07, 0.6, 0.48, "#ffd890", x + w / 2 + 0.03, y, zz); }
      if (gulf && f % 2 === 1) S.box(w + 0.06, 0.1, d + 0.06, "#f2f1ec", x, Y + 0.3 + f * FH, z);
    }
    if (gulf) S.box(w * 0.55, 0.6, d * 0.55, "#d8dde3", x, Y + h + 0.3, z);
    else { S.box(w + 0.1, 0.25, d + 0.1, "#d9d2c4", x, Y + h + 0.12, z); for (const s of [-1, 1]) S.cyl(0.3, 0.55, rnd(x | 0, z | 0, s + 2) < 0.5 ? "#2f5fb8" : "#1d1e22", x + s * w * 0.22, Y + h + 0.52, z - d * 0.2, "y", 8); }
  };
  const tree = (x, z, k = 1) => { S.box(0.28 * k, 1.4 * k, 0.28 * k, "#6a4c32", x, Y + 0.7 * k, z); S.box(1.7 * k, 1.4 * k, 1.7 * k, rnd(x | 0, z | 0, 5) < 0.5 ? "#2f6b3a" : "#3f8448", x, Y + 1.9 * k, z); };
  const villa = (x, z, c = WHITE) => { S.box(3, 1.7, 2.6, c, x, Y + 0.85, z); S.box(1.6, 0.9, 1.4, c, x - 0.5, Y + 2.15, z - 0.4); S.box(3.1, 0.12, 2.7, "#c9b48a", x, Y + 1.76, z); S.box(0.06, 0.7, 0.9, "#5a86ad", x + 1.52, Y + 0.9, z + 0.4); land(x - 1.2, x + 1.2, z + 1.6, z + 2.9, "#5ab0d8", 0.06); palm(x + 1.9, z + 2.2, 2.2); };
  const park = (x0, x1, z0, z1, pond) => {
    land(x0, x1, z0, z1, "#4f8a45", 0.05); S.box(x1 - x0, 0.03, 0.7, "#c9b48a", (x0 + x1) / 2, Y + 0.08, (z0 + z1) / 2);
    if (pond) land(pond[0] - 1.6, pond[0] + 1.6, pond[1] - 1.1, pond[1] + 1.1, "#5aa0d0", 0.07);
    for (let x = x0 + 1.4; x < x1 - 1; x += 3.1) for (const z of [z0 + 1.2, z1 - 1.2]) if (!pond || Math.hypot(x - pond[0], z - pond[1]) > 2.6) tree(x, z, 0.85);
  };
  // Bangladesh: the corner past the bridge (low homes, a pond park), a row facing the park, blocks either side of the port
  park(-96, -84, -40, -25, [-90, -33]);
  [[-92, -19, 3.4, 3.2, 3, "#e8c9a0"], [-87.5, -13.5, 3.4, 3, 3, "#bfe0d0"], [-92.5, -8, 3, 3, 2, "#f0b8b0"], [-87, -6.5, 3, 3, 3, "#f3e3b0"]].forEach((b) => block(...b));
  [[-58, -7.6, 3.6, 3, 3, "#f1d9b5"], [-53.5, -7.6, 3.4, 3, 4, "#cfe3e8"], [-46.5, -7.6, 3.8, 3, 3, "#f0c7c0"], [-42, -7.6, 3.2, 3, 3, "#e7e0a8"]] /* low: the Parliament stands behind them */.forEach((b) => block(...b));
  [[-35, -27, 4, 4, 6, "#e9d3b0"], [-35.2, -20, 4.2, 4, 8, "#cfe0d6"], [-34.8, -12.6, 4.4, 4, 7, "#f2c9b8"]].forEach((b) => block(...b));
  [[-0.8, -33, 4, 4, 6, "#f0dcc0"], [-0.8, -25.4, 4.4, 4, 8, "#c9dbe9"], [-0.6, -17.6, 4, 4, 7, "#e8c8d0"]].forEach((b) => block(...b));
  park(-9.5, -4, -36, -12); for (const [x, z] of [[-6.8, -28], [-6.8, -20]]) { S.box(1.4, 0.18, 0.5, "#7a5a3c", x, Y + 0.45, z); S.box(0.15, 0.4, 0.5, "#3a3d4c", x - 0.6, Y + 0.25, z); S.box(0.15, 0.4, 0.5, "#3a3d4c", x + 0.6, Y + 0.25, z); }
  { // the river launch (double-decker, white with its blue and red bands) and two sampans off the home shore
    const X = -52, Z = -49.6; S.box(8, 1.0, 2.2, WHITE, X, Y + 0.5, Z); S.box(8.04, 0.22, 2.24, "#2f6fb0", X, Y + 0.85, Z); S.box(8.04, 0.18, 2.24, "#c8463c", X, Y + 0.2, Z);
    S.box(6.4, 0.9, 2.0, WHITE, X - 0.3, Y + 1.45, Z); S.box(6.6, 0.12, 2.2, "#2f6fb0", X - 0.3, Y + 1.95, Z); S.box(4.4, 0.8, 1.8, WHITE, X - 0.8, Y + 2.4, Z); S.box(4.6, 0.12, 2.0, "#c8463c", X - 0.8, Y + 2.85, Z); S.cyl(0.25, 0.8, "#1d1e22", X + 1.6, Y + 3.2, Z, "y", 8);
    for (let i = 0; i < 6; i++) { S.box(0.5, 0.4, 0.04, "#2d3546", X - 3 + i * 1.05, Y + 1.5, Z + 1.01); N.box(0.5, 0.4, 0.05, "#ffe2a8", X - 3 + i * 1.05, Y + 1.5, Z + 1.02); }
    for (const [x, z, r] of [[-63, -47.6, 0.3], [-39, -50.8, -0.5]]) geo(new THREE.BoxGeometry(2.6, 0.45, 0.9).rotateY(r), "#6a4a2e", x, Y + 0.22, z), geo(new THREE.BoxGeometry(1.0, 0.5, 0.8).rotateY(r), "#c9a56a", x - 0.2, Y + 0.65, z);
    pick("launch", 8, 3, 2.4, X, Y + 1.5, Z);
  }
  // Dubai: a marina cluster of glass towers on the right, villas with pools along the front, a lawn of palms behind the fort
  [[50, -27, 3.2, 3.2, 11, "#cfd6de"], [54.5, -20, 3, 3, 9, "#e6dcc8"], [48.5, -14, 3.4, 3, 12, "#a9bfd2"], [54, -8, 3, 3, 8, "#e9e4da"], [50, -36, 3.2, 3, 7, "#dcd3c2"]].forEach(([x, z, w, d, f, c]) => block(x, z, w, d, f, c, true));
  for (let x = 21; x < 57; x += 5.6) villa(x, 8.5, (x | 0) % 2 ? WHITE : "#efe3cc");
  land(40, 47, -44, -33, "#6aa64e", 0.05); for (const [x, z] of [[41.5, -42], [45, -42], [41.5, -35], [45, -35], [43.2, -38.5]]) palm(x, z, 2.4);
  // Abu Dhabi: the island runs on to the right, with townhouses and a marina full of yachts
  land(12, 36, -77, -53, SAND);
  [[17, -60, 4, 3, 3, "#efe6d6"], [23, -66, 4, 3, 4, "#e6dccb"], [29.5, -61, 3.6, 3, 3, "#f2ece0"], [18, -70, 3.6, 3, 4, "#e9dfcc"], [30, -70, 3.4, 3, 5, "#dfe6ec"]].forEach(([x, z, w, d, f, c]) => block(x, z, w, d, f, c, true));
  for (const [x, z] of [[14, -56], [21, -56], [27, -56], [34, -64], [25, -74]]) palm(x, z, 2.3);
  S.box(14, 0.3, 0.9, "#b9a07a", 22, Y + 0.15, -52.2); for (const x of [16.5, 21, 25.5, 30]) S.box(0.6, 0.3, 2.4, "#b9a07a", x, Y + 0.15, -51);
  const yacht = (x, z, r) => { geo(new THREE.BoxGeometry(2.8, 0.5, 1.0).rotateY(r), WHITE, x, Y + 0.25, z); geo(new THREE.BoxGeometry(1.2, 0.45, 0.8).rotateY(r), "#e8eef4", x - 0.2, Y + 0.72, z); geo(new THREE.BoxGeometry(1.0, 0.12, 0.82).rotateY(r), "#2d3546", x - 0.2, Y + 0.6, z); };
  yacht(18.7, -49.8, 0.1); yacht(23.3, -49.6, -0.05); yacht(27.8, -50, 0.12); yacht(33, -48.5, 0.6);
  pick("marina", 18, 2, 5, 25, Y + 0.6, -50.5);

  S.mesh(lit); const night = N.mesh(glowMat);
  const burjTip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: "#ff4a3a" })); burjTip.position.set(26, Y + 39.5, -20); root.add(burjTip);

  let wasNight = null;
  function update(t, env) {
    const isNight = env.lamp > 0.4;
    if (isNight !== wasNight) { wasNight = isNight; night.visible = isNight; }
    sail.visible = isNight; if (isNight) sail.material.color.setHSL((t * 0.03) % 1, 0.55, 0.62); // Burj Al Arab's façade lights cycle colour
    burjTip.visible = isNight && Math.floor(t * 1.2) % 2 === 0;
    const u = (t * 0.16) % 1; rider.position.lerpVectors(zipA, zipB, u).y -= 0.35; rider.visible = u < 0.94; // someone on the zipline, about every six seconds
    dhow.position.y = Y + Math.sin(t * 1.3) * 0.08; dhow.rotation.z = Math.sin(t * 1.1) * 0.04;
    for (const m of drops) { const k = (m.userData.k + t * 0.6) % 1; m.position.y = Y + 6.8 - k * 6.4; }
  }

  return { root, update, picks };
}
