import { MeshGradient } from "@paper-design/shaders-react";

/* Soft animated paper mesh-gradient behind the hero — tuned to the site
   palette (warm museum-plaster + a cool ultramarine wash) and kept LIGHT so
   the dark headline reads cleanly over it. Frozen (speed 0) under reduced
   motion. WebGL failures are caught by the surrounding error boundary, which
   falls back to the CSS gradient. */
export default function HeroShader({ animate = true }) {
  return (
    <MeshGradient
      className="hero-shader"
      colors={["#ece8de", "#e6e1d4", "#dfe4ff", "#eef1ff", "#cdd6ff"]}
      distortion={1.1}
      swirl={0.22}
      speed={animate ? 0.5 : 0}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
