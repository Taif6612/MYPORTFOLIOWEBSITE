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
  stmartin: "Saint Martin’s Island", sundarbans: "The Sundarbans",
};

const SAND = "#e2c79b", WHITE = "#f2f1ec", GOLD = "#d6ae4f", GREEN = "#3f7a3c", LEAF = "#4f9a46";
const hemi = (r) => new THREE.SphereGeometry(r, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);

export async function buildWorld({ scene, grad, G, pause = async () => {} }) { // pause yields between sections
  const root = new THREE.Group(); root.visible = false; scene.add(root);
  const lit = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: grad });
  const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const kit = kitFor(root), S = kit(), N = kit(); // static lit · night lights
  const picks = [];
  const pick = (name, w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial()); m.position.set(x, y, z); m.visible = false; root.add(m); picks.push([name, [m]]); };
  const geo = (g, c, x, y, z) => S.geo(g, c, x, y, z);
  // a flat window or door on one of the two walls facing the camera: +z, or +x when side is set (a plane is 6 vertices, a box 36)
  const quad = (k, w, h, c, x, y, z, side) => k.geo(side ? new THREE.PlaneGeometry(w, h).rotateY(Math.PI / 2) : new THREE.PlaneGeometry(w, h), c, x, y, z);
  const Y = G; // ground level

  /* ---------- ground: home land, Dubai's sand, Abu Dhabi's island; the sea is the slab underneath ---------- */
  const rects = [[-130, 47, 2.4, 44]]; // every rectangle of ground (the street's own strip included), so the water glints know what is land
  const land = (x0, x1, z0, z1, c, top = 0.02) => { rects.push([x0, x1, z0, z1]); S.box(x1 - x0, 0.14, z1 - z0, c, (x0 + x1) / 2, Y + top - 0.07, (z0 + z1) / 2); };
  const HOME = "#7f8c63";
  // Shaped ground: a flat outline (x, z points), extruded so its top sits where a land() box's would. Coasts wave and the
  // Karnaphuli winds instead of running ruler-straight; quays (Chattogram, the Abu Dhabi marina) stay straight like real ones.
  const shapes = []; // every shaped outline, so the water glints know what is land
  const flat = (pts, c, top = 0.02) => { shapes.push(pts); S.geo(new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z))), { depth: 0.14, bevelEnabled: false, curveSegments: 1 }).rotateX(-Math.PI / 2), c, 0, Y + top - 0.14, 0); };
  const smooth = (ctrl, n, closed = false) => new THREE.CatmullRomCurve3(ctrl.map(([a, b, c = 0]) => new THREE.Vector3(a, c, b)), closed).getPoints(n).map((p) => [p.x, p.z, p.y]); // [x, z, extra]
  const wave = (s, lo, hi, k = 0) => lo + (hi - lo) * (0.5 + 0.3 * Math.sin(s * 0.23 + k) + 0.2 * Math.sin(s * 0.091 + 2 * k)); // a gentle, uneven 0..1 swing between lo and hi
  const ramp = (s, a, b, w = 4) => Math.min(1, Math.max(0, Math.min(s - a, b - s) / w)); // 0 at a and b, 1 between, w to ease in
  // Bangladesh's north coast bulges out a little (never in: lots stand right up to z -44), straight along the port, calm at the river mouth
  const coast = (x) => -44 - wave(x, 0, 2.2) * (1 - ramp(x, -34, -7, 3)) * Math.min(1, Math.abs(x + 75) / 9);
  // the Karnaphuli: from the sea past Cox's Bazar's end, under the Shah Amanat Bridge, narrowing inland to a stream ([x, z, half width])
  const river = smooth([[-75, -48, 4.4], [-75.4, -43, 3.6], [-77.4, -38, 3.0], [-79.2, -33, 2.6], [-79.6, -28, 2.4], [-78.2, -23, 2.3], [-76.2, -19, 2.3], [-75.2, -16, 2.3],
    [-75.8, -13, 2.0], [-77.6, -10, 1.6], [-78.4, -7, 1.1], [-78.2, -5, 0.6], [-78, -4, 0.05]], 60);
  const bank = river.filter(([, z]) => z >= -44); // the part inside the land outline
  const along = (x0, x1, f, step = 1.5) => { const p = []; for (let x = x0; x <= x1 + 1e-6; x += step) p.push([x, f(x)]); return p; };
  flat([[-130, 48], ...along(-130, -80, coast), ...bank.map(([x, z, h]) => [x - h, z]), ...bank.slice().reverse().map(([x, z, h]) => [x + h, z]), ...along(-70, 17, coast), [17, 48]], HOME);
  land(17, 58, -46, 14, SAND); // Dubai
  // Abu Dhabi's island: soft wavy edges all round (outward only: its lots fill the old rectangle), the marina quay straight
  const isle = (x) => -52 + wave(x, 0, 1.3, 1) * (1 - ramp(x, -10.5, -3.5, 2)); // stays clear of Burj Al Arab's islet
  flat([...along(-42, 12, isle), [12.6, -53], ...along(14, 36, () => -53, 4), ...along(-77, -53, (z) => 36 + wave(z, 0.4, 2, 2)).map(([z, x]) => [x, z]).reverse(),
    ...along(-42, 36, (x) => -79 - wave(x, 0.4, 2.2, 3)).reverse(), ...along(-79, -52, (z) => -42 - wave(z, 0.3, 2.4, 4)).map(([z, x]) => [x, z])], SAND);
  const palm = (x, z, h = 2.6) => { S.box(0.22, h, 0.22, "#8a6a44", x, Y + h / 2, z); for (let i = 0; i < 5; i++) geo(new THREE.BoxGeometry(1.5, 0.12, 0.34).translate(0.7, 0, 0).rotateZ(-0.35).rotateY((i / 5) * Math.PI * 2), LEAF, x, Y + h, z); };

  await pause(); // short tasks: the room keeps animating while this builds
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

  await pause();
  /* ---------- the water between: Burj Al Arab on its islet, a dhow, a container ship ---------- */
  let sail;
  { const X = -7, Z = -49.5; S.cyl(3.0, 0.5, SAND, X, Y + 0.25, Z, "y", 14);
    const prof = new THREE.Shape([[0, 0], [0, 11], [0.6, 11], [1.9, 9.5], [3.0, 7.1], [3.6, 4.4], [3.7, 1.7], [3.6, 0]].map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(prof, { depth: 2.4, bevelEnabled: false, curveSegments: 1 }).translate(-1.6, 0, -1.2).rotateY(-0.5);
    geo(g, WHITE, X, Y + 0.5, Z);
    geo(new THREE.BoxGeometry(0.35, 11, 0.35).rotateY(-0.5), "#c9ced6", X - 1.6 * Math.cos(-0.5), Y + 6.0, Z + 1.6 * Math.sin(-0.5));
    for (let i = 0; i < 4; i++) geo(new THREE.BoxGeometry(0.12, 3.1, 0.12).rotateX(i % 2 ? 0.5 : -0.5).rotateY(-0.5), "#c9ced6", X - 1.75 * Math.cos(-0.5), Y + 2.2 + i * 2.4, Z + 1.75 * Math.sin(-0.5));
    S.cyl(1.0, 0.16, "#e6e6e6", X + 1.2, Y + 9.1, Z + 1.6, "y", 12);
    sail = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: 0.1, bevelEnabled: false, curveSegments: 1 }).translate(-1.55, 0, 1.22).rotateY(-0.5), new THREE.MeshBasicMaterial({ color: "#7fb8ff" }));
    sail.position.set(X, Y + 0.5, Z); sail.scale.set(0.96, 0.97, 1); root.add(sail);
    pick("burjalarab", 5, 12, 5, X, Y + 6, Z);
  }
  const dhow = new THREE.Group(); dhow.position.set(-30, Y, -48.5); dhow.rotation.y = 0.3; root.add(dhow);
  { const k = kit(); const hull = new THREE.Shape([[-2.4, 0.9], [-1.8, 0], [1.8, 0], [2.8, 1.2], [2.4, 1.2], [1.9, 0.8], [-2.0, 0.8]].map(([x, y]) => new THREE.Vector2(x, y)));
    k.geo(new THREE.ExtrudeGeometry(hull, { depth: 1.4, bevelEnabled: false, curveSegments: 1 }).translate(0, 0, -0.7), "#7a4f2e");
    k.box(0.14, 3.6, 0.14, "#5a3a22", 0.2, 2.4, 0); k.geo(new THREE.ShapeGeometry(new THREE.Shape([[0, 0], [2.4, 0.2], [0.1, 3.0]].map(([x, y]) => new THREE.Vector2(x, y)))).translate(0.2, 1.1, 0.05), "#f0e6cc");
    k.mesh(lit, dhow); pick("dhow", 5, 4, 2, -30, Y + 1.8, -48.5); }
  const ship = (X, Z) => { // a container ship
    S.box(11, 1.1, 2.6, "#1f2b44", X, Y + 0.55, Z); S.box(11, 0.4, 2.62, "#9a2f2a", X, Y + 0.15, Z); S.box(1.6, 1.8, 2.2, WHITE, X + 4.4, Y + 2, Z);
    ["#c8463c", "#2f6fb0", "#3f9a5a", "#e09a3a", "#2a8a8a", "#c8463c", "#e0c040", "#2f6fb0"].forEach((c, i) => S.box(1.15, 0.8, 2.2, c, X - 4.2 + (i % 6) * 1.2, Y + 1.5 + Math.floor(i / 6) * 0.8, Z));
    N.box(0.2, 0.2, 0.2, "#ff5a4a", X + 4.4, Y + 3.1, Z);
  };
  ship(-18, -48.5); // leaving Chattogram

  await pause();
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
    const X = 8, Z = -57; geo(new THREE.BoxGeometry(2.3, 12, 2.3).translate(0, 6, 0).rotateZ(-0.32).rotateY(0.8), "#6f8daa", X, Y, Z);
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
  { // Sheikh Zayed Grand Mosque: white marble on a raised platform; the prayer hall under the great dome, with smaller domes either side;
    // arcades of pointed arches round a courtyard inlaid with flowers, a gold-tipped dome over every bay and a bigger one on each corner;
    // the domed main gate; four minarets with two balconies each; columns with gold capitals along the reflecting pools; at night the
    // arches and balconies light up blue-white, like its lunar lighting
    const X = -27, Z = -63, R = 0.75, cos = Math.cos(R), sin = Math.sin(R), MARBLE = "#f4f2ec", ARCH = "#55607a", MOON = "#a9c0ff", POOL = "#4f9ad0";
    const at = (u, v) => [X + u * cos + v * sin, Z - u * sin + v * cos]; // the mosque's own axes, turned to face the camera (+v)
    const b = (w, h, d, c, u, y, v, k = S) => { const [x, z] = at(u, v); k.geo(new THREE.BoxGeometry(w, h, d).rotateY(R), c, x, Y + y, z); };
    const dome = (r, u, y, v, tall = 1) => { const [x, z] = at(u, v); geo(hemi(r).scale(1, tall, 1), WHITE, x, Y + y, z); geo(new THREE.ConeGeometry(r * 0.14, r * 0.7, 5), GOLD, x, Y + y + r * tall + r * 0.3, z); };
    const arch = (u, y, v, w, h) => { b(w, h, 0.06, ARCH, u, y, v + 0.03); b(w * 0.55, h * 0.22, 0.06, ARCH, u, y + h * 0.6, v + 0.03); b(w * 0.9, h * 0.9, 0.05, MOON, u, y, v + 0.06, N); }; // pointed, lit at night
    b(16.4, 0.9, 11.4, "#d9dcd6", 0, 0.45, 0); b(15.8, 0.12, 10.8, MARBLE, 0, 0.96, 0); // the raised platform and its marble top
    b(11.6, 0.04, 6.2, "#e9efe9", 0, 1.04, 0.9); // the courtyard...
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const u = -4.6 + i * 2.3, v = -0.7 + j * 1.75; b(0.95, 0.02, 0.95, (i + j) % 2 ? "#d8b44a" : "#7fae5e", u, 1.07, v); b(0.38, 0.025, 0.38, "#4f8fbf", u, 1.08, v); } // ...and its inlaid flowers
    // the prayer hall, its gold cornice, its arches onto the courtyard
    b(12, 2.5, 3.4, MARBLE, 0, 2.27, -3.5); b(12.1, 0.16, 3.5, GOLD, 0, 3.6, -3.5);
    for (let u = -5; u <= 5.01; u += 1.25) arch(u, 2.0, -1.8, 0.62, 1.3);
    { const [x, z] = at(0, -3.5); S.cyl(1.5, 1.0, MARBLE, x, Y + 4.2, z, "y", 14); geo(hemi(1.65).scale(1, 1.35, 1), WHITE, x, Y + 4.7, z); // the great dome on its drum
      S.cyl(0.22, 0.12, GOLD, x, Y + 6.95, z, "y", 8); geo(new THREE.ConeGeometry(0.15, 1.1, 6), GOLD, x, Y + 7.45, z); N.geo(hemi(0.6), "#dbe6ff", x, Y + 5.3, z); }
    for (let k = -2; k <= 2; k++) arch(Math.sin(k * 0.5) * 1.5, 4.2, -3.5 + Math.cos(k * 0.5) * 1.5, 0.22, 0.5); // windows round the drum
    for (const s of [-1, 1]) { dome(0.9, s * 2.9, 3.68, -3.5, 1.15); dome(0.7, s * 4.8, 3.68, -3.5, 1.1); }
    for (let u = -5; u <= 5.01; u += 2.5) dome(0.42, u, 3.68, -4.75);
    // the arcades round the courtyard, gold along their tops, arches either side of the gate, a dome over every bay
    b(16, 1.9, 1.0, MARBLE, 0, 1.97, 5.0); for (const s of [-1, 1]) b(1.0, 1.9, 10.4, MARBLE, s * 7.5, 1.97, 0);
    b(16.1, 0.12, 1.05, GOLD, 0, 2.97, 5.0); for (const s of [-1, 1]) b(1.05, 0.12, 10.4, GOLD, s * 7.5, 2.97, 0);
    for (let u = -7; u <= 7.01; u += 1) if (Math.abs(u) > 1.2) arch(u, 1.75, 5.5, 0.55, 1.05);
    for (let u = -6.1; u <= 6.11; u += 1.75) if (Math.abs(u) > 1.5) dome(0.36, u, 3.03, 5.0);
    for (let v = -3.6; v <= 3.61; v += 1.8) for (const s of [-1, 1]) dome(0.36, s * 7.5, 3.03, v);
    for (const s of [-1, 1]) for (const t of [-1, 1]) dome(0.55, s * 7.5, 3.03, t * 5.0, 1.1);
    // the main gate: taller, domed, a great arch
    b(3.0, 3.0, 1.4, MARBLE, 0, 2.5, 5.2); b(3.05, 0.14, 1.45, GOLD, 0, 4.03, 5.2); arch(0, 2.25, 5.9, 1.3, 2.0); dome(0.75, 0, 4.1, 5.2, 1.2);
    // four minarets: a base, the shaft, two balconies with gold rims (lit at night), a lantern and its gold cap
    for (const [u, v] of [[-8, -5.4], [8, -5.4], [-8, 5.4], [8, 5.4]]) { const [x, z] = at(u, v);
      S.cyl(0.5, 1.2, "#e6e4dc", x, Y + 1.6, z, "y", 8); S.cyl(0.32, 8.6, WHITE, x, Y + 6.3, z, "y", 8);
      for (const y of [5.2, 8.0]) { S.cyl(0.5, 0.16, WHITE, x, Y + y, z, "y", 8); S.cyl(0.53, 0.06, GOLD, x, Y + y + 0.1, z, "y", 8); N.box(0.42, 0.12, 0.42, "#cfe0ff", x, Y + y - 0.13, z); }
      S.cyl(0.36, 0.7, WHITE, x, Y + 10.9, z, "y", 8); geo(hemi(0.36).scale(1, 1.4, 1), GOLD, x, Y + 11.25, z); geo(new THREE.ConeGeometry(0.08, 0.6, 5), GOLD, x, Y + 12.0, z); }
    // the reflecting pools (a lit edge at night) and the columns with gold palm capitals along them
    b(15, 0.07, 1.8, POOL, 0, 0.04, 7.2); b(14.6, 0.02, 0.12, "#bfe0ff", 0, 0.09, 6.5, N); for (const s of [-1, 1]) b(1.4, 0.07, 9, POOL, s * 9.1, 0.04, 0.4);
    for (let u = -6.5; u <= 6.51; u += 1.3) { b(0.16, 1.4, 0.16, MARBLE, u, 0.7, 6.2); b(0.36, 0.14, 0.36, GOLD, u, 1.42, 6.2); }
    pick("mosque", 16.4, 10, 12, X, Y + 4.5, Z);
  }
  { // Louvre Abu Dhabi: a flat lattice dome floating over white galleries at the water's edge
    const X = -38.5, Z = -54.5; S.cyl(5.4, 0.1, "#d9d2c2", X, Y + 0.01, Z, "y", 20); for (const [dx, dz, h] of [[-1.5, 0.5, 1.6], [1.2, -1, 2], [0.4, 1.6, 1.3]]) S.box(2.2, h, 2.2, WHITE, X + dx, Y + h / 2, Z + dz);
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
  for (const [x, z] of [[-30, -70], [-20, -75], [-38, -66], [-8, -76]]) palm(x, z, 2.2);
  for (const [x, z, r] of [[-34, -75, 4], [-22, -78, 3.5], [8, -76, 3]]) geo(new THREE.SphereGeometry(r, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.6, 0.35, 1), "#d8bc8c", x, Y, z); // dunes

  await pause();
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

  await pause();
  /* ---------- Chattogram: the port on the shore, the Shah Amanat Bridge over the Karnaphuli ---------- */
  { // three ship-to-shore cranes and the container yard
    for (const x of [-28, -20, -12]) {
      const z = -42; for (const dx of [-1.2, 1.2]) for (const dz of [-1, 1]) S.box(0.3, 4.6, 0.3, x === -20 ? "#2f6fb0" : "#c8463c", x + dx, Y + 2.3, z + dz);
      S.box(2.8, 0.5, 2.4, WHITE, x, Y + 4.7, z); S.box(0.5, 0.45, 7, x === -20 ? "#2f6fb0" : "#c8463c", x, Y + 4.3, z - 1.5); S.box(1.0, 0.8, 1.0, WHITE, x, Y + 3.7, z - 4.2);
      N.box(0.22, 0.22, 0.22, "#ff5a4a", x, Y + 5.1, z - 4.9);
    }
    ["#c8463c", "#2f6fb0", "#3f9a5a", "#e09a3a", "#2a8a8a", "#7a5aa8", "#c8463c", "#2f6fb0", "#e0c040", "#3f9a5a"].forEach((c, i) => S.box(2.4, 1.0, 1.1, c, -30 + (i % 5) * 2.6, Y + 0.5 + Math.floor(i / 5) * 1.0, -37.5));
    land(-32, -9, -44, -35.5, "#8f8c84", 0.04); // the concrete apron
    pick("port", 20, 5, 9, -20, Y + 2.5, -41);
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

  await pause();
  /* ---------- Cox's Bazar (past Chakaria), and the easter eggs: Bandarban, Sreemangal, Madhabkunda ---------- */
  { flat([...along(-70, -34, coast), [-34, -40.5], [-70, -40.5]], "#ead6a6", 0.05); // the beach runs out to the wavy coast
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
  const coco = (x, z) => { S.box(0.22, 3, 0.22, "#7a5c3c", x, Y + 1.5, z); for (let i = 0; i < 6; i++) geo(new THREE.BoxGeometry(1.4, 0.1, 0.3).translate(0.65, 0, 0).rotateZ(-0.45).rotateY(i), "#3f8a3a", x, Y + 3, z); }; // a coconut palm
  for (const [x, z] of [[-40, -16], [-62, -26], [-36, -32], [-66, 4], [-84, -2]]) coco(x, z);

  await pause();
  /* ---------- neighbourhoods: homes, parks and boats, so no ground is left bare ---------- */
  const rnd = (a, b, c) => { let h = Math.imul((a * 73856093) ^ (b * 19349663) ^ (c * 83492791), 2654435761); h ^= h >>> 15; return (h >>> 0) / 4294967296; };
  // an apartment block with windows on its two camera-facing walls (lit ones glow at night). Windows are few and big, like
  // the main building's, and soft against the wall, so a street of blocks reads calm from the map instead of speckled.
  // Bangladesh style: a water tank on the roof. Gulf style: a glass band on every floor, a plant room on top.
  const FH = 2.2; // storey height: tall enough that the owner's block stands among the city, not over it
  const block = (x, z, w, d, floors, c, gulf = false) => {
    const h = floors * FH + 0.4, glass = gulf ? "#86a2b8" : "#7d8fa3";
    S.box(w, h, d, c, x, Y + h / 2, z);
    const nx = Math.max(1, Math.round(w / 1.8)), nz = Math.max(1, Math.round(d / 1.8));
    for (let f = 0; f < floors; f++) {
      const y = Y + 1.25 + f * FH;
      if (gulf) {
        quad(S, w - 0.4, 1.0, glass, x, y, z + d / 2 + 0.02); quad(S, d - 0.4, 1.0, glass, x + w / 2 + 0.02, y, z, 1);
        if (rnd(x | 0, f, 1) < 0.5) quad(N, w - 0.4, 1.0, "#ffe2a8", x, y, z + d / 2 + 0.035); if (rnd(z | 0, f, 2) < 0.5) quad(N, d - 0.4, 1.0, "#ffe2a8", x + w / 2 + 0.035, y, z, 1);
        continue;
      }
      for (let i = 0; i < nx; i++) { const xx = x - w / 2 + (w / nx) * (i + 0.5); quad(S, 0.9, 1.1, glass, xx, y, z + d / 2 + 0.02); if (rnd(x | 0, f, i) < 0.45) quad(N, 0.9, 1.1, "#ffd890", xx, y, z + d / 2 + 0.035); }
      for (let i = 0; i < nz; i++) { const zz = z - d / 2 + (d / nz) * (i + 0.5); quad(S, 0.9, 1.1, glass, x + w / 2 + 0.02, y, zz, 1); if (rnd(z | 0, f, i + 9) < 0.45) quad(N, 0.9, 1.1, "#ffd890", x + w / 2 + 0.035, y, zz, 1); }
    }
    if (gulf) S.box(w * 0.55, 0.6, d * 0.55, "#e2ddd2", x, Y + h + 0.3, z);
    else { S.box(w + 0.1, 0.25, d + 0.1, "#d9d2c4", x, Y + h + 0.12, z); S.cyl(0.32, 0.55, rnd(x | 0, z | 0, 2) < 0.5 ? "#4f6f9a" : "#3a3d4c", x - w * 0.2, Y + h + 0.52, z - d * 0.2, "y", 6); }
  };
  const tree = (x, z, k = 1) => { S.box(0.28 * k, 1.4 * k, 0.28 * k, "#6a4c32", x, Y + 0.7 * k, z); S.box(1.7 * k, 1.4 * k, 1.7 * k, rnd(x | 0, z | 0, 5) < 0.5 ? "#2f6b3a" : "#3f8448", x, Y + 1.9 * k, z); };
  const villa = (x, z, c = WHITE) => { S.box(3, 1.7, 2.6, c, x, Y + 0.85, z); S.box(1.6, 0.9, 1.4, c, x - 0.5, Y + 2.15, z - 0.4); S.box(3.1, 0.12, 2.7, "#c9b48a", x, Y + 1.76, z); S.box(0.06, 0.7, 0.9, "#5a86ad", x + 1.52, Y + 0.9, z + 0.4); land(x - 1.2, x + 1.2, z + 1.6, z + 2.9, "#5ab0d8", 0.06); };
  const park = (x0, x1, z0, z1, pond) => {
    land(x0, x1, z0, z1, "#4f8a45", 0.05); S.box(x1 - x0, 0.03, 0.7, "#c9b48a", (x0 + x1) / 2, Y + 0.08, (z0 + z1) / 2);
    if (pond) land(pond[0] - 1.6, pond[0] + 1.6, pond[1] - 1.1, pond[1] + 1.1, "#5aa0d0", 0.07);
    for (let x = x0 + 1.4; x < x1 - 1; x += 3.1) for (const z of [z0 + 1.2, z1 - 1.2]) if (!pond || Math.hypot(x - pond[0], z - pond[1]) > 2.6) tree(x, z, 0.85);
  };
  // Bangladesh: the corner past the bridge (low homes, a pond park), a row facing the park, blocks either side of the port
  park(-96, -84, -40, -25);
  [[-92, -19, 3.4, 3.2, 3, "#e8c9a0"], [-87.5, -13.5, 3.4, 3, 3, "#bfe0d0"], [-92.5, -8, 3, 3, 2, "#f0b8b0"], [-87, -6.5, 3, 3, 3, "#f3e3b0"]].forEach((b) => block(...b));
  [[-58, -7.6, 3.6, 3, 2, "#f1d9b5"], [-53.5, -7.6, 3.4, 3, 2, "#cfe3e8"], [-46.5, -7.6, 3.8, 3, 2, "#f0c7c0"], [-42, -7.6, 3.2, 3, 2, "#e7e0a8"]] /* low: the Parliament stands behind them */.forEach((b) => block(...b));
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
  // Dubai: a marina cluster of glass towers on the right, a lawn of palms behind the fort
  [[50, -27, 3.2, 3.2, 11, "#cfd6de"], [54.5, -20, 3, 3, 9, "#e6dcc8"], [48.5, -14, 3.4, 3, 12, "#a9bfd2"], [54, -8, 3, 3, 8, "#e9e4da"], [50, -36, 3.2, 3, 7, "#dcd3c2"]].forEach(([x, z, w, d, f, c]) => block(x, z, w, d, f, c, true));
  land(40, 47, -44, -33, "#6aa64e", 0.05); for (const [x, z] of [[41.5, -42], [45, -42], [41.5, -35], [45, -35], [43.2, -38.5]]) palm(x, z, 2.4);
  // Abu Dhabi: the island runs on to the right, with townhouses and a marina full of yachts
  land(12, 36, -77, -53, SAND);
  [[17, -60, 4, 3, 3, "#efe6d6"], [23, -66, 4, 3, 4, "#e6dccb"], [29.5, -61, 3.6, 3, 3, "#f2ece0"], [18, -70, 3.6, 3, 4, "#e9dfcc"], [30, -70, 3.4, 3, 5, "#dfe6ec"]].forEach(([x, z, w, d, f, c]) => block(x, z, w, d, f, c, true));
  for (const [x, z] of [[14, -56], [21, -56], [27, -56], [34, -64], [25, -74]]) palm(x, z, 2.3);
  S.box(14, 0.3, 0.9, "#b9a07a", 22, Y + 0.15, -52.2); for (const x of [16.5, 21, 25.5, 30]) S.box(0.6, 0.3, 2.4, "#b9a07a", x, Y + 0.15, -51);
  const yacht = (x, z, r) => { geo(new THREE.BoxGeometry(2.8, 0.5, 1.0).rotateY(r), WHITE, x, Y + 0.25, z); geo(new THREE.BoxGeometry(1.2, 0.45, 0.8).rotateY(r), "#e8eef4", x - 0.2, Y + 0.72, z); geo(new THREE.BoxGeometry(1.0, 0.12, 0.82).rotateY(r), "#2d3546", x - 0.2, Y + 0.6, z); };
  yacht(18.7, -49.8, 0.1); yacht(23.3, -49.6, -0.05); yacht(27.8, -50, 0.12); yacht(33, -48.5, 0.6);
  pick("marina", 18, 2, 5, 25, Y + 0.6, -50.5);

  await pause();
  /* ---------- the fill: every lot still bare gets homes, a block, a park, a pond, a mosque, a field or a market ---------- */
  // From the pulled-back camera (az 40°, el 34°) a ground point's screen x and y. A lot nearer the camera than a landmark it
  // overlaps on screen stays low enough to leave at least the top 70% of the landmark in sight; lots the block hides are skipped.
  const sx = (x, z) => 0.766 * x - 0.643 * z, sy = (x, z) => -0.359 * x - 0.428 * z;
  const KEEP = [[26, -20, 4, 40], [34, -2, 4.2, 9], [24, -35, 4, 14], [38, -27, 3, 4], [44, -10, 2, 2.5], [21, -42, 3, 8], [-7, -49.5, 3, 12], [-4, -58, 3.5, 17], [8, -57, 3, 12], [-14, -66, 4, 8.6],
    [-27, -63, 9, 12], [-38.5, -54.5, 5, 3], [-1, -73, 7, 9], [-50, -21, 7, 6], [-66, -9, 4, 6.5], [-75, -16, 8, 10.5], [-70, -32, 4, 5], [-59, -36, 5, 3], [-45, -34, 3, 7.5], [-20, -41, 10, 5]]; // x, z, half size, height
  const maxH = (x, z, r) => { let h = 30; for (const [lx, lz, lr, lh] of KEEP) if ((x - lx) * 0.533 + (z - lz) * 0.635 > 0 && Math.abs(sx(x, z) - sx(lx, lz)) < 1.41 * (r + lr)) h = Math.min(h, (sy(lx, lz) - sy(x, z) - 0.79 * (r + lr)) / 0.83 + 0.3 * lh); return h; };
  const hidden = (x, z, r, h) => { const b = sx(x, z) + 1.41 * r; return x + r < 3.15 && z + r < -3.3 && sx(x, z) - 1.41 * r > -19.7 && b < 4.5 && sy(x, z) + 0.79 * r + 0.83 * h < 24.7 + (4.53 - b) * 0.466; }; // under the block's roofline
  const used = [ // what is already on the ground: x0, x1, z0, z1
    [-129, 47, 2.4, 43.6], [-29.3, 3.9, -4.1, 3.9], [-64.8, -29.2, -5.3, 5.3], [2.4, 19, -47, 6.9], // the street and its park strip, the block, the green beside it, the side road down to its jetty
    [-61.8, -38.2, -31.8, -10.2], [-71.5, -60.5, -13, -5], [-84, -66, -18.5, -13.5], [-71, -33, -45, -39.7], // Parliament lake, Minar, bridge, beach
    [-75, -65, -36.5, -27.5], [-65, -53, -40.5, -31.5], [-50.5, -39.5, -36, -29], [-32, -9, -45, -35], [-37, -35, -33, -31], [-67, -65, 3, 5], [-85, -83, -3, -1], // hills, tea, waterfall, port, palms
    [-96.8, -83.2, -40.8, -24.2], [-94.8, -84.8, -21, -4.5], [-60.6, -39.6, -9.6, -5.6], [-37.8, -32, -29.5, -10], [-3.6, 2, -35.5, -15], [-10.3, -3.2, -36.8, -11.2], // neighbourhoods
    [19, 32, -27, -13], [29.4, 38.6, -5.6, 1.6], [19.5, 28.5, -39, -31], [34.5, 41.5, -30.5, -23.5], [41.5, 46.5, -12.5, -7.5], [17, 25, -45.8, -38.5], [39.5, 47.5, -44.5, -32.5], // Dubai
    [-8.5, 0.5, -62.5, -54.5], [-18.5, -10.5, -58.5, -51.5], [-18.5, -9.5, -69.5, -62.5], [-38.5, -15.5, -74, -52.5], [-44, -33, -60, -49], [5.5, 11.5, -60, -54], [-7, 6, -79, -67], [5, 10.5, -70, -63.5], // Abu Dhabi
    [-40, -28, -79, -71], [-27.6, -16.4, -79, -74.5], [3, 13, -79, -73], [-39, -37, -67, -65], // dunes, palms
  ];
  for (const [x, z, h] of river) if (z > -47) used.push([x - h - 0.8, x + h + 0.8, z - 1, z + 1]); // the Karnaphuli, bank to bank
  for (const [x, z, w, d] of [[50, -27, 3.2, 3.2], [54.5, -20, 3, 3], [48.5, -14, 3.4, 3], [54, -8, 3, 3], [50, -36, 3.2, 3], [17, -60, 4, 3], [23, -66, 4, 3], [29.5, -61, 3.6, 3], [18, -70, 3.6, 3], [30, -70, 3.4, 3], [14, -56, 1, 1], [21, -56, 1, 1], [27, -56, 1, 1], [34, -64, 1, 1], [25, -74, 1, 1]]) used.push([x - w / 2 - 0.5, x + w / 2 + 0.5, z - d / 2 - 0.5, z + d / 2 + 0.5]);
  // the grounds round the landmarks: lawns (Burj Park and its fountain lake, Zabeel Park round the Frame, the mosque gardens), plazas
  const LAWN = "#6aa64e", PAVE = "#d9d2c2";
  for (const [x0, x1, z0, z1, c] of [[19, 32, -27, -13, LAWN], [19.5, 28.5, -39, -31, LAWN], [-38.5, -15.5, -74, -52.5, LAWN], [-71.5, -60.5, -13, -5, "#4f8a45"], [17, 25, -45.8, -38.5, PAVE], [29.4, 38.6, -5.6, 1.6, PAVE], [34.5, 41.5, -30.5, -23.5, "#d9c4a0"],
    [-8.5, 0.5, -62.5, -54.5, PAVE], [-18.5, -10.5, -58.5, -51.5, PAVE], [-18.5, -9.5, -69.5, -62.5, PAVE], [5.5, 11.5, -60, -54, PAVE], [-7, 6, -79, -67, "#a88a6a"]]) land(x0, x1, z0, z1, c, c === PAVE ? 0.036 : 0.03); // paving a hair above lawns: at the same height they flickered
  land(21, 31, -15.6, -13.4, "#5aa0d0", 0.05); for (let x = 22.5; x < 30; x += 1.8) N.box(0.12, 1.2, 0.12, "#e8f4ff", x, Y + 0.6, -14.5); // the Dubai Fountain, lit at night
  const free = (x0, x1, z0, z1) => used.every(([a, b, c, d]) => x1 <= a || x0 >= b || z1 <= c || z0 >= d);
  const BDC = ["#efe0c4", "#ecc9a6", "#e6d3a8", "#e8bba2", "#f1e6d2", "#dcc3a1"], GUC = ["#efe8da", "#e6d8bd", "#ddd2bf", "#f2ece0"]; // warm: cream, peach, sand, terracotta
  const TIN = ["#a8553e", "#8f6a52", "#8a8f96"], AWN = ["#c8463c", "#2f6fb0", "#e0a83a", "#3f9a7a"]; // AWN: beach umbrellas
  const of = (a, r) => a[Math.floor(r * a.length) % a.length];
  const plot = (x, z, c, r = 2.5) => land(x - r, x + r, z - r, z + r, c, 0.05);
  const house = (x, z, c, roof) => { // a one-storey home with a sloping tin roof
    S.box(2.4, 1.5, 2.1, c, x, Y + 0.75, z); for (const s of [-1, 1]) geo(new THREE.BoxGeometry(2.7, 0.1, 1.3).rotateX(s * 0.42), roof, x, Y + 1.78, z + s * 0.52);
    quad(S, 0.5, 0.9, "#4a3426", x - 0.5, Y + 0.45, z + 1.06); quad(S, 0.5, 0.45, "#2d3546", x + 1.21, Y + 0.9, z, 1); quad(N, 0.5, 0.45, "#ffd890", x + 1.22, Y + 0.9, z, 1);
  };
  const green = (x, z, hm, gulf) => { if (gulf) plot(x, z, "#6aa64e", 2.3); for (const [dx, dz] of [[-1.1, -0.9], [1.1, 1.0]]) if (hm < 2.7) S.box(1.2, 0.6, 1.2, "#3f7a3c", x + dx, Y + 0.35, z + dz); else if (gulf) palm(x + dx, z + dz, 2.4); else tree(x + dx, z + dz, 1); };
  const mosque = (x, z, gulf) => {
    const c = gulf ? "#efe6d2" : WHITE, dome = gulf ? "#d8c49a" : "#3f8a5a"; plot(x, z, "#c9c2b0");
    S.box(3.2, 2.0, 3.0, c, x, Y + 1.0, z); geo(hemi(1.15), dome, x, Y + 2.0, z); quad(S, 0.9, 1.3, "#5a86ad", x, Y + 0.7, z + 1.51);
    S.cyl(0.24, 5, c, x + 1.9, Y + 2.5, z - 1.6, "y", 8); geo(new THREE.ConeGeometry(0.3, 0.8, 8), dome, x + 1.9, Y + 5.4, z - 1.6); N.box(0.3, 0.12, 0.3, "#ffe2a8", x + 1.9, Y + 4, z - 1.6);
  };
  const mall = (x, z) => { S.box(4.4, 2.2, 2.8, "#efe8da", x, Y + 1.1, z - 0.6); quad(S, 4.0, 0.6, "#86a2b8", x, Y + 1.4, z + 0.82); quad(N, 4.0, 0.6, "#ffe2a8", x, Y + 1.4, z + 0.835); };
  const lot = (x, z, style, r, r2, hm) => {
    if (style === "bd") {
      if (hm < 2.2) green(x, z, hm, false);
      else if (r < 0.55 && hm > 3.4) block(x + (r2 - 0.5) * 0.6, z, 3.6 + r2 * 1.0, 3.4 + r * 1.0, Math.max(2, Math.min(2 + Math.floor(r2 * 5), Math.floor((hm - 0.6) / FH))), of(BDC, r2));
      else if (r < 0.72) { house(x - 1.2, z - 1.1, of(BDC, r2), of(TIN, r)); house(x + 1.2, z + 1.2, of(BDC, 1 - r2), of(TIN, r2)); }
      else if (r < 0.9) green(x, z, hm, false);
      else if (r < 0.96 || hm < 5.6) green(x, z, hm, false);
      else mosque(x, z, false);
      return;
    }
    const ad = style === "ad"; // Abu Dhabi stays lower than Dubai
    if (hm < 2.2) green(x, z, hm, true);
    else if (r < 0.5 && hm > 5) block(x, z, 3.4 + r2 * 0.6, 3.2 + r * 0.6, Math.max(3, Math.min((ad ? 3 : 4) + Math.floor(r2 * (ad ? 6 : 12)), Math.floor((hm - 1) / FH))), of(GUC, r2), true);
    else if (r < 0.72 && hm > 2.6) villa(x - 0.3, z - 1, of(GUC, r2));
    else if (r < 0.86) green(x, z, hm, true);
    else if (r < 0.95 || hm < 5.6) mall(x, z);
    else mosque(x, z, true);
  };
  // lots of 5.6 standing straight on the ground (no lane grid: fewer edges), then a 2.8 pass puts a tree in what is left
  const fill = (X0, X1, Z0, Z1, style, C = 5.6) => {
    for (let x0 = X0; x0 + C <= X1 + 1e-6; x0 += C) for (let z0 = Z0; z0 + C <= Z1 + 1e-6; z0 += C) {
      const x = x0 + C / 2, z = z0 + C / 2, hm = maxH(x, z, C / 2 - 0.3), r = rnd(x0 * 7 | 0, z0 * 7 | 0, 1), r2 = rnd(x0 * 7 | 0, z0 * 7 | 0, 2);
      if (!free(x0, x0 + C, z0, z0 + C) || hidden(x, z, C / 2, Math.min(hm, 18))) continue;
      used.push([x0, x0 + C, z0, z0 + C]);
      land(x0, x0 + C, z0, z0 + C, style === "bd" ? "#4f8a45" : "#e6dcc6", 0.04);
      if (C > 3) lot(x, z, style, r, r2, hm);
      else if (hm >= 2.7 && r < 0.5) style === "bd" ? tree(x, z, 0.9) : r < 0.3 && palm(x, z, 2.3);
    }
  };
  land(46, 58, 14, 44, SAND); land(-130, 58, 44, 52, "#ead6a6", 0.01); // Dubai's shore past the end of the road; a beach along the front (above the sea's surface, never level with it)
  for (const C of [5.6, 2.8]) { fill(-96, 17, -44, 48, "bd", C); fill(-129.6, -96, -44, 48, "bd", C); await pause(); fill(17, 58, -46, 44, "gulf", C); await pause(); fill(-42, 36, -79, -52, "ad", C); await pause(); }
  for (let x = -126.5; x < 56; x += 7.3) { const c = AWN[Math.floor(rnd(x | 0, 1, 7) * 4)]; S.box(0.1, 1.5, 0.1, "#6a5a4a", x, Y + 0.75, 50); geo(new THREE.ConeGeometry(1.0, 0.45, 8), c, x, Y + 1.5, 50); S.box(0.6, 0.12, 1.1, WHITE, x + 0.9, Y + 0.1, 50.6); }

  await pause();
  /* ---------- out at sea: Saint Martin's Island, the Sundarbans, more boats (they fill the tall phone view) ---------- */
  { // Saint Martin's Island off Cox's Bazar: coral sand, coconut palms, two resort huts, rocks along the edge
    const X = -64, Z = -58;
    const blob = (cx, cz, rx, rz, k) => smooth(Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2, r = 0.86 + 0.14 * Math.sin(a * 3 + k); return [cx + Math.cos(a) * rx * r, cz + Math.sin(a) * rz * r]; }), 40, true).slice(0, -1);
    flat(blob(X + 0.5, Z - 0.8, 9.5, 6.4, 1), "#ead6a6", 0.03); flat(blob(X, Z - 0.3, 6.6, 3.8, 2.5), "#6f9a4f", 0.06);
    for (let i = 0; i < 9; i++) coco(X - 5 + (i % 5) * 2.6 + rnd(i, 1, 1), Z - 2.4 + Math.floor(i / 5) * 3.4);
    for (const dx of [-3, 1.5]) { S.box(1.6, 1, 1.4, "#c9a56a", X + dx, Y + 0.5, Z + 3.1); geo(new THREE.ConeGeometry(1.3, 0.9, 4).rotateY(Math.PI / 4), "#8a6a3c", X + dx, Y + 1.45, Z + 3.1); N.box(0.4, 0.4, 0.05, "#ffd890", X + dx, Y + 0.6, Z + 3.82); }
    for (const [dx, dz] of [[-8.6, 1], [8.6, -1], [6, 4.3], [-6, -4.5], [3, -6.8]]) S.box(1.2, 0.5, 0.9, "#6f6a62", X + dx, Y + 0.2, Z + dz);
    pick("stmartin", 17, 3.5, 11, X, Y + 1.5, Z - 1);
  }
  { // the Sundarbans: mangrove islands cut by channels, and a Bengal tiger on the bank
    const X = -86, Z = -78;
    land(X - 10, X + 10, Z - 7, Z + 7, "#5b6a3e", 0.03); land(X - 10, X + 10, Z - 0.8, Z + 0.8, "#2f78a8", 0.05); land(X + 2.2, X + 3.6, Z - 7, Z + 7, "#2f78a8", 0.05);
    for (let i = 0; i < 40; i++) { const x = X - 9.2 + rnd(i, 2, 3) * 18.4, z = Z - 6.4 + rnd(i, 4, 5) * 12.8; if (Math.abs(z - Z) < 1.5 || Math.abs(x - X - 2.9) < 1.3 || (Math.abs(x - X + 3) < 1.6 && Math.abs(z - Z - 2.2) < 1.2)) continue; S.box(0.14, 1.1, 0.14, "#5a4430", x, Y + 0.55, z); S.box(1.5, 1.0, 1.5, i % 3 ? "#2c5a2c" : "#3a6b30", x, Y + 1.5, z); }
    const T = [X - 3, Y + 0.55, Z + 2.2]; S.box(1.2, 0.45, 0.48, "#e0822b", ...T); S.box(0.5, 0.45, 0.46, "#e0822b", T[0] + 0.75, T[1] + 0.15, T[2]); S.box(0.7, 0.08, 0.08, "#e0822b", T[0] - 0.85, T[1] + 0.2, T[2]);
    for (const dx of [-0.35, 0, 0.35]) S.box(0.08, 0.47, 0.5, "#1d1e22", T[0] + dx, T[1], T[2]); for (const dx of [-0.45, 0.45]) for (const dz of [-0.16, 0.16]) S.box(0.14, 0.35, 0.14, "#e0822b", T[0] + dx, Y + 0.2, T[2] + dz);
    pick("sundarbans", 20, 3, 14, X, Y + 1.5, Z);
  }
  const boat = (x, z, r, c) => { geo(new THREE.BoxGeometry(2.4, 0.45, 0.85).rotateY(r), c, x, Y + 0.22, z); geo(new THREE.BoxGeometry(0.9, 0.45, 0.65).rotateY(r), "#c9a56a", x, Y + 0.65, z); };
  const sailboat = (x, z, c) => { S.box(2.0, 0.4, 0.8, WHITE, x, Y + 0.2, z); S.box(0.08, 2.4, 0.08, "#8a8f96", x, Y + 1.6, z); S.box(0.06, 1.8, 1.1, c, x - 0.1, Y + 1.5, z + 0.55); };
  [[-75, -48, 0.4, "#c8463c"], [-86, -58, -0.3, "#2f6fb0"], [-45, -60, 0.9, "#3f9a5a"], [-98, -50, 0.2, "#e0a83a"], [-40, 53, 0.3, "#c8463c"], [-12, 51, -0.4, "#2f6fb0"], [-58, 60, 0.6, "#3f9a5a"], [-102, -70, -0.6, "#c8463c"], [-70, -90, 0.5, "#e0a83a"]].forEach((b) => boat(...b));
  sailboat(-100, -64, "#e8501e"); sailboat(-56, -84, "#2f6fb0"); sailboat(10, 58, "#e0c040"); sailboat(38, 48, "#c8463c");
  ship(-52, -70); ship(-25, 62);

  /* ---------- the water, just moving: glints that swell and fade on the sea, ripples drifting down the Karnaphuli ---------- */
  const inside = (pts, x, z) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, zi] = pts[i], [xj, zj] = pts[j]; if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
  const ground = (x, z) => rects.some(([a, b, c, d]) => x > a && x < b && z > c && z < d) || shapes.some((pts) => inside(pts, x, z));
  const wet = (x, z) => !ground(x, z) && !ground(x + 1.4, z) && !ground(x - 1.4, z) && !ground(x, z + 1.4) && !ground(x, z - 1.4); // clear of every shore
  const sea = [];
  for (let i = 0; sea.length < 170 && i < 4000; i++) { const x = -135 + rnd(i, 7, 1) * 205, z = -95 + rnd(i, 7, 2) * 167; if (wet(x, z)) sea.push([x, z, rnd(i, 7, 3), 3.5 + rnd(i, 7, 4) * 3]); }
  const ripples = Array.from({ length: 26 }, (_, i) => [rnd(i, 8, 1), rnd(i, 8, 2) - 0.5]); // place along the river, side to side
  const gMat = new THREE.MeshBasicMaterial({ color: "#d6e6ff", transparent: true, opacity: 0.3, depthWrite: false });
  const glints = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 0.16).rotateX(-Math.PI / 2), gMat, sea.length);
  const flow = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.14, 0.9).rotateX(-Math.PI / 2), gMat, ripples.length);
  for (const m of [glints, flow]) { m.layers.set(1); m.renderOrder = 4; m.frustumCulled = false; root.add(m); } // layer 1 = FX in pixelRoom.js: never outlined
  const _gm = new THREE.Matrix4(), WY = Y + 0.012; // just above the sea's surface, below every land top

  await pause();
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
    gMat.opacity = isNight ? 0.2 : 0.32;
    sea.forEach(([x, z, ph, T], i) => { const k = (t / T + ph) % 1, a = Math.sin(Math.PI * k) ** 2; glints.setMatrixAt(i, _gm.makeScale(0.15 + a * 1.1, 1, 1).setPosition(x + (k - 0.5) * 0.9, WY, z)); });
    ripples.forEach(([u0, side], i) => { // downstream is toward the sea (the start of the river's points)
      const u = (((u0 - t * 0.035) % 1) + 1) % 1, f = u * (river.length - 1) * 0.85, j = Math.floor(f), [x0, z0, h0] = river[j], [x1, z1, h1] = river[Math.min(j + 1, river.length - 1)], r = f - j; // wrapped both ways: a plain % went negative after ~5 minutes and froze the map
      const a = Math.sin(Math.PI * ((u0 * 7 + t * 0.4) % 1)) ** 2;
      flow.setMatrixAt(i, _gm.makeScale(1, 1, 0.3 + a * 0.9).setPosition(x0 + (x1 - x0) * r + side * (h0 + (h1 - h0) * r), WY, z0 + (z1 - z0) * r));
    });
    glints.instanceMatrix.needsUpdate = flow.instanceMatrix.needsUpdate = true;
  }

  return { root, update, picks };
}
