/* =========================================================================
   App entry — vite-react-ssg
   -------------------------------------------------------------------------
   In dev (`vite`) this mounts client-side (CSR). In `vite-react-ssg build`
   every route in ./routes is pre-rendered to static HTML, then hydrated.
   Mounts into <div id="root"> (the default container).
   ========================================================================= */

import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";

import "./styles/global.css";
import "./styles/components.css";
import "./styles/blog.css";

export const createRoot = ViteReactSSG({ routes });
