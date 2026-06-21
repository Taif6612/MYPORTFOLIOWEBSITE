import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------
   A full-frame fragment shader: animated topographic contour lines — a
   "detection field" — in ultramarine, melting into the paper at the edges.
   The pointer pushes a soft ripple through the field. This is the one
   immersive, on-theme moment (watch / detect) behind the hero headline.
   ------------------------------------------------------------------------- */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;   // 0..1
  uniform float uAspect;
  uniform vec3  uSignal;

  // Ashima simplex noise 2D
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i = 0; i < 5; i++){ v += a * snoise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p  = (uv - 0.5) * vec2(uAspect, 1.0);

    float t = uTime * 0.045;

    // pointer ripple
    vec2 m  = (uMouse - 0.5) * vec2(uAspect, 1.0);
    float d = distance(p, m);
    float ripple = 0.16 * exp(-d * 2.6) * sin(d * 16.0 - uTime * 1.4);

    float n = fbm(p * 1.55 + vec2(t, -t * 0.6)) + ripple;

    // topographic contour lines from the iso-bands of the field
    float bands = abs(fract(n * 6.5) - 0.5);
    float contour = smoothstep(0.045, 0.0, bands);

    // a brighter "scan" band sweeping slowly downward
    float scan = smoothstep(0.02, 0.0, abs(uv.y - fract(uTime * 0.06)));
    contour += scan * 0.5;

    // melt into paper at the edges
    float vig = smoothstep(1.15, 0.25, length((uv - 0.5) * vec2(1.25, 1.5)));

    float a = clamp(contour * vig, 0.0, 1.0) * 0.62;
    gl_FragColor = vec4(uSignal, a);
  }
`;

function Field() {
  const mat = useRef();
  const { viewport, size } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: size.width / size.height },
      uSignal: { value: new THREE.Color("#2438ff") },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useFrame((state, delta) => {
    const ptr = state.pointer; // -1..1
    target.current.set((ptr.x + 1) / 2, (ptr.y + 1) / 2);
    mouse.current.lerp(target.current, 0.06);
    if (mat.current) {
      mat.current.uniforms.uTime.value += delta;
      mat.current.uniforms.uMouse.value.copy(mouse.current);
      mat.current.uniforms.uAspect.value = size.width / size.height;
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroCanvas({ animate = true }) {
  return (
    <Canvas
      className="hero-canvas"
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      // When motion is reduced we still render the field once (frozen), so it's
      // visible without continuously animating.
      frameloop={animate ? "always" : "demand"}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <Field />
    </Canvas>
  );
}
