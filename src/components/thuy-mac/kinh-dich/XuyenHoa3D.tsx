"use client";

import { useEffect, useRef, useState } from "react";
import { castLine, type Cast } from "@/lib/kinh-dich";
import { rnd } from "./KinhDichTool";
import XuyenHoa from "./XuyenHoa";

/**
 * Xuyên Hỏa Thành Thê in real 3D (demo, 2026-10-21), drawn by one WebGL fragment shader, no library:
 * the flame is a volume of light (Diệm 焰: ngoại diệm, nội diệm, diệm tâm) ray-marched through noise;
 * the ladder rails, the rungs and the three bronze needles are solid shapes lit by that flame.
 * Tilting the phone (or moving the pointer) turns the view a little. Without WebGL it falls back to the 2D flame.
 */
const NAC = ["thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm", "thứ sáu"];
const PIERCE_MS = 760;

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime, uCalm, uDone, uNY, uNT; uniform vec3 uThrough; uniform vec2 uTilt;
uniform float uRung[6]; uniform float uDong[6];

float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ return 0.55 * noise(p) + 0.3 * noise(p * 2.07) + 0.15 * noise(p * 4.11); }

float rungY(float k){ return -1.0 + k * 0.38; }

// one tongue of the flame: a soft cone rising from y = -1.3, radius w, height h
float tongue(vec3 q, float cx, float h, float w){
  float y = (q.y + 1.3) / h;
  if (y < 0.0 || y > 1.0) return 0.0;
  float r = w * pow(1.0 - y, 0.75) * smoothstep(0.0, 0.18, y);
  float d = length(vec2(q.x - cx, q.z));
  return smoothstep(r, r * 0.25, d);
}
// the flame volume: three tongues pushed upward by rising noise; returns density, and heat in .y
vec2 flame(vec3 p){
  float s = mix(1.0, 0.07, uDone);
  vec3 q = p; q.y = (p.y + 1.3) / s - 1.3; q.xz /= s;
  float n = fbm(vec3(q.x * 2.3, q.y * 1.7 - uTime * 1.9, q.z * 2.3 + uTime * 0.25));
  float amp = mix(0.34, 0.1, uCalm);
  q.x += (n - 0.5) * amp * (q.y + 1.3);
  q.z += (noise(vec3(q.y * 2.0 - uTime, 1.7, 0.0)) - 0.5) * amp * 0.6;
  float a = tongue(q, -0.4, 2.2, 0.4), b = tongue(q, 0.0, 2.95, 0.56), c = tongue(q, 0.4, 2.2, 0.4);
  float m = max(max(a, c), b);
  float dens = m * (0.55 + 0.9 * n) * mix(1.0, 0.6, uCalm);
  return vec2(dens, m);
}

float sdBox(vec3 p, vec3 b){ vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }

// x of a needle at time t (s): through needles cross the whole flame; stopped ones halt at its edge and fall
vec3 needlePos(float i){
  float t = uNT - i * 0.08;
  float y = uNY + (i - 1.0) * 0.06;
  float thr = i < 0.5 ? uThrough.x : (i < 1.5 ? uThrough.y : uThrough.z);
  float x = -2.8 + clamp(t / 0.6, 0.0, 1.0) * 5.8;
  if (thr < 0.5) { float tStop = (1.85 / 5.8) * 0.6; x = min(x, -0.95); if (t > tStop) y -= (t - tStop) * (t - tStop) * 9.0; }
  return vec3(x, y, 0.0);
}

// the solid scene: .x distance, .y material (1 rail bronze, 2 rung ink, 3 needle bronze, 4 seal vermilion)
vec2 map(vec3 p){
  vec2 r = vec2(1e5, 0.0);
  float d = min(sdCap(p, vec3(-0.95, -1.35, 0.0), vec3(-0.95, 1.2, 0.0), 0.02), sdCap(p, vec3(0.95, -1.35, 0.0), vec3(0.95, 1.2, 0.0), 0.02));
  if (d < r.x) r = vec2(d, 1.0);
  for (int k = 0; k < 6; k++) {
    float v = uRung[k];
    if (v < -0.5) continue;
    float y = rungY(float(k));
    float rb = v > 0.5 ? sdBox(p - vec3(0.0, y, 0.0), vec3(0.8, 0.045, 0.06)) - 0.01
                       : min(sdBox(p - vec3(-0.47, y, 0.0), vec3(0.33, 0.045, 0.06)), sdBox(p - vec3(0.47, y, 0.0), vec3(0.33, 0.045, 0.06))) - 0.01;
    if (rb < r.x) r = vec2(rb, 2.0);
    if (uDong[k] > 0.5) { float s = length(p - vec3(1.12, y, 0.0)) - 0.05; if (s < r.x) r = vec2(s, 4.0); }
  }
  if (uNT >= 0.0) {
    for (int i = 0; i < 3; i++) {
      vec3 np = needlePos(float(i));
      float nd = sdCap(p, np - vec3(0.62, 0.0, 0.0), np, 0.016);
      if (nd < r.x) r = vec2(nd, 3.0);
    }
  }
  return r;
}
vec3 normalAt(vec3 p){ vec2 e = vec2(0.002, 0.0); return normalize(vec3(map(p + e.xyy).x - map(p - e.xyy).x, map(p + e.yxy).x - map(p - e.yxy).x, map(p + e.yyx).x - map(p - e.yyx).x)); }

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(uTilt.x * 0.9, 0.05 + uTilt.y * 0.5, 4.3);
  vec3 ta = vec3(0.0, 0.05, 0.0);
  vec3 fw = normalize(ta - ro), rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0))), up = cross(rt, fw);
  vec3 rd = normalize(fw * 1.2 + uv.x * rt + uv.y * up); // wide enough to keep the rails and the vermilion seals in view

  // 1. solids
  float t = 2.6, hit = 0.0; vec2 m = vec2(0.0);
  for (int i = 0; i < 56; i++) { m = map(ro + rd * t); if (m.x < 0.0015) { hit = 1.0; break; } t += m.x; if (t > 6.5) break; }
  vec3 solid = vec3(0.0); float solidA = 0.0;
  vec3 lightPos = vec3(0.0, -0.35, 0.25);
  float lightAmt = mix(1.0, 0.25, uDone);
  if (hit > 0.5) {
    vec3 p = ro + rd * t, n = normalAt(p);
    vec3 l = normalize(lightPos - p);
    float dif = max(dot(n, l), 0.0) * lightAmt;
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    vec3 warm = vec3(1.0, 0.72, 0.38);
    vec3 amb = vec3(0.93, 0.88, 0.8) * 0.42;
    if (m.y < 1.5 || (m.y > 2.5 && m.y < 3.5)) { // bronze
      vec3 base = vec3(0.56, 0.42, 0.22);
      float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 28.0) * lightAmt;
      solid = base * (amb + warm * dif * 1.3) + warm * spec * 0.9 + base * rim * 0.3;
    } else if (m.y < 2.5) { // ink rung, backlit by the flame
      solid = vec3(0.16, 0.11, 0.08) * (0.6 + amb) + warm * rim * 0.55 * lightAmt;
    } else { // vermilion seal
      solid = vec3(0.66, 0.14, 0.12) * (0.5 + amb + dif);
    }
    solidA = 1.0;
  }

  // 2. the flame volume, in front of whatever was hit
  vec3 em = vec3(0.0); float fa = 0.0;
  float tEnd = hit > 0.5 ? t : 5.2;
  for (int i = 0; i < 34; i++) {
    float tt = 3.45 + float(i) * 0.052;
    if (tt > tEnd) break;
    vec2 f = flame(ro + rd * tt);
    if (f.x > 0.002) {
      float heat = clamp(f.x * 1.25, 0.0, 1.0);
      vec3 col = mix(vec3(0.74, 0.27, 0.08), vec3(0.98, 0.72, 0.34), heat);
      col = mix(col, vec3(1.0, 0.93, 0.76), smoothstep(0.85, 1.0, heat));
      vec3 pp = ro + rd * tt;
      float heart = smoothstep(0.3, 0.0, length(pp.xz)) * smoothstep(-0.7, -1.15, pp.y) * (1.0 - uDone);
      col = mix(col, vec3(0.55, 0.09, 0.05), heart * 0.85);
      float w = f.x * 0.085 * (1.0 - fa);
      em += col * w * 1.05; fa += w;
    }
  }
  // the halo the flame throws on the paper, and the ember at the end
  float halo = exp(-length(uv - vec2(0.0, -0.05)) * 3.2) * 0.22 * (1.0 - uDone * 0.7);
  em += vec3(0.95, 0.72, 0.4) * halo;
  float ember = exp(-length(uv - vec2(0.0, -0.27)) * 38.0) * uDone;
  em += vec3(1.0, 0.8, 0.45) * ember * 1.4;

  vec3 rgb = em + solid * solidA * (1.0 - fa);
  float a = clamp(solidA + max(max(em.r, em.g), em.b) * 0.85, 0.0, 1.0);
  gl_FragColor = vec4(rgb, a);
}`;

type Anim = { level: number; through: boolean[]; start: number };

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

export default function XuyenHoa3D({ casts, onCast }: { casts: Cast[]; onCast: (c: Cast) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const anim = useRef<Anim | null>(null);
  const castsRef = useRef(casts);
  const tilt = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const n = casts.length;
  const done = n === 6;
  const last = casts[n - 1];

  useEffect(() => {
    castsRef.current = casts;
  }, [casts]);

  useEffect(() => {
    const cv = canvas.current!;
    const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) {
      // later than the effect body, so the fallback is not a synchronous state update
      queueMicrotask(() => setFailed(true));
      return;
    }
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (name: string) => gl.getUniformLocation(prog, name);
    const u = { res: U("uRes"), time: U("uTime"), calm: U("uCalm"), done: U("uDone"), ny: U("uNY"), nt: U("uNT"), thr: U("uThrough"), tilt: U("uTilt"), rung: U("uRung"), dong: U("uDong") };

    // render below the screen's density: a soft flame does not need more, and phones stay cool
    const size = () => {
      const r = cv.getBoundingClientRect();
      const s = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7;
      cv.width = Math.max(1, Math.round(r.width * s));
      cv.height = Math.max(1, Math.round(r.height * s));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt.current.tx = Math.max(-1, Math.min(1, e.gamma / 30));
      tilt.current.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
    };
    const onMove = (e: PointerEvent) => {
      tilt.current.tx = (e.clientX / window.innerWidth - 0.5) * 1.2;
      tilt.current.ty = (0.5 - e.clientY / window.innerHeight) * 0.8;
    };
    if (!reduce) {
      window.addEventListener("deviceorientation", onTilt);
      window.addEventListener("pointermove", onMove);
    }

    let raf = 0, doneAt = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const cs = castsRef.current;
      const k = cs.length;
      const tl = tilt.current;
      tl.x += (tl.tx - tl.x) * 0.05;
      tl.y += (tl.ty - tl.y) * 0.05;
      if (k === 6 && !doneAt) doneAt = now + 450;
      const doneV = doneAt ? Math.min(1, Math.max(0, (now - doneAt) / 1100)) : 0;
      gl.uniform2f(u.res, cv.width, cv.height);
      gl.uniform1f(u.time, reduce ? 0 : (now - t0) / 1000);
      gl.uniform1f(u.calm, k / 6);
      gl.uniform1f(u.done, doneV * doneV * (3 - 2 * doneV));
      gl.uniform2f(u.tilt, tl.x, tl.y);
      gl.uniform1fv(u.rung, Array.from({ length: 6 }, (_, i) => (i < k ? cs[i].hao : -1)));
      gl.uniform1fv(u.dong, Array.from({ length: 6 }, (_, i) => (i < k && cs[i].dong ? 1 : 0)));
      const a = anim.current;
      if (a) {
        gl.uniform1f(u.ny, -1.0 + a.level * 0.38);
        gl.uniform1f(u.nt, (now - a.start) / 1000);
        gl.uniform3f(u.thr, a.through[0] ? 1 : 0, a.through[1] ? 1 : 0, a.through[2] ? 1 : 0);
      } else gl.uniform1f(u.nt, -1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("deviceorientation", onTilt);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (failed) return <XuyenHoa casts={casts} onCast={onCast} />;

  const pierce = () => {
    if (busy || done) return;
    const c = castLine(rnd);
    const through = [0, 1, 2].map((i) => i < c.lung).sort(() => rnd() - 0.5);
    anim.current = { level: n, through, start: performance.now() };
    setBusy(true);
    setTimeout(() => onCast(c), PIERCE_MS * 0.5);
    setTimeout(() => {
      anim.current = null;
      setBusy(false);
    }, PIERCE_MS);
  };

  return (
    <div className="xh">
      <button type="button" data-focus className="xhFire xh3d" onClick={pierce} disabled={done} aria-busy={busy} aria-label={done ? "Sáu nấc đã thành" : `Xuyên nấc ${NAC[n]}, nấc ${n + 1} trên 6`}>
        <canvas ref={canvas} className="xh3d-canvas" aria-hidden="true" />
        {!done && <span className="xhCta">{n ? `Ấn để xuyên nấc ${NAC[n]}` : "Ấn vào ngọn lửa"}</span>}
      </button>
      <p className="ctBeat-text" aria-live="polite">
        {done ? "Sáu nấc đã thành. Ngọn lửa đã lặng." : last ? `Nấc ${NAC[n - 1]}: ${last.lung} ngọn bị xuyên, ${last.hao ? "dương" : "âm"}${last.dong ? ", Động Diệm" : ""}.` : "Ba cây châm xuyên ba ngọn lửa trong tâm: tham, sân, si. Sáu lần xuyên, sáu Nấc Thê."}
      </p>
    </div>
  );
}
