/* Runs the pixel room off the main thread. Hero.jsx hands this worker the hero's
   canvas (transferControlToOffscreen) and talks to it in two message shapes:
     in:  { init: {...options, canvas} }  then  { call: "method", a: [args] }
     out: { ui: "callback", a: [args] }
   Calls that arrive while the room is still being built are queued. Hero ends the
   room by terminating the worker, so there is no dispose message. */
import { createPixelRoom } from "./pixelRoom.js";

let room = null;
const queue = [];
const ui = new Proxy({}, { get: (_, name) => (...a) => postMessage({ ui: name, a }) });
const run = ({ call, a = [] }) => room[call]?.(...a);

onmessage = async ({ data }) => {
  if (!data.init) { if (room) run(data); else queue.push(data); return; }
  try {
    room = await createPixelRoom({ ...data.init, ui });
    queue.splice(0).forEach(run);
  } catch (e) {
    postMessage({ ui: "fail", a: [String(e)] });
  }
};
