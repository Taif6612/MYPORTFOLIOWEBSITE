/* Runs the pixel room off the main thread. Hero.jsx hands this worker the hero's
   canvas (transferControlToOffscreen) and talks to it in two message shapes:
     in:  { init: {...options, canvas} }  then  { call: "method", a: [args] }
     out: { ui: "callback", a: [args] }
   Calls that arrive while the room is still being built are queued. Hero ends the
   room by terminating the worker, so there is no dispose message.
   The GPU check happens here, not on the page: creating a WebGL context on the main thread
   (the first one also starts the GPU process) was the page's longest start-up task. If this
   worker has no WebGL it says { ui: "gpu", a: ["none"] } and Hero builds the room on the main
   thread instead; on a software rasteriser it says "software" and Hero keeps the plain hero. */
import { createPixelRoom } from "./pixelRoom.js";

let room = null;
const queue = [];
const ui = new Proxy({}, { get: (_, name) => (...a) => postMessage({ ui: name, a }) });
const run = ({ call, a = [] }) => room[call]?.(...a);

function gpu() {
  try {
    const gl = new OffscreenCanvas(1, 1).getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return "none";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|software|llvmpipe|basic render|microsoft basic/i.test(renderer) ? "software" : "ok";
  } catch {
    return "none";
  }
}

onmessage = async ({ data }) => {
  if (!data.init) { if (room) run(data); else queue.push(data); return; }
  const g = String(data.init.query).includes("gpunone") ? "none" : gpu(); // ?gpunone: test the hand-back to the main thread
  if (g !== "ok") { postMessage({ ui: "gpu", a: [g] }); return; }
  try {
    room = await createPixelRoom({ ...data.init, ui });
    queue.splice(0).forEach(run);
  } catch (e) {
    postMessage({ ui: "fail", a: [String(e)] });
  }
};
