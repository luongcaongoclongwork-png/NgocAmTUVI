/**
 * The ink-wash painting as a WebGL surface: it bleeds in from a single drop
 * of ink, the camera pushes into it, the pointer stirs it like a brush in
 * water, and mist can wash it back to paper. Plain WebGL 1, no library.
 *
 * Two sources:
 *  - one flat painting: depth is faked (the water below and the pine at top
 *    right move as if nearer);
 *  - up to 4 layered paintings (transparent PNG/WebP, back to front, each
 *    with a depth 0 = far … 1 = near): the camera really moves through them.
 */

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() { v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D uL0, uL1, uL2, uL3;
uniform int uLayers;                 // 0 = one flat painting in uL0
uniform vec4 uDepth;                 // depth per layer
uniform vec2 uRes;
uniform float uImgAspect, uReveal, uTime, uZoom, uFog, uMouseAmt;
uniform vec2 uMouse, uFocus, uDrop;
uniform vec3 uPaper;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}

vec2 through(vec2 t, float depth) {
  vec2 f = vec2(uFocus.x, 0.66);
  float z = 1.0 + (uZoom - 1.0) * (0.35 + 1.3 * depth);
  return f + (t - f) / z;
}

vec4 over(vec4 back, vec4 front) { return vec4(mix(back.rgb, front.rgb, front.a), 1.0); }

void main() {
  vec2 uv = vec2(v.x, 1.0 - v.y);            // screen, y down
  float sa = uRes.x / uRes.y;

  // cover-fit, centred on uFocus
  vec2 t = uv;
  if (sa > uImgAspect) { t.y = (t.y - 0.5) * (uImgAspect / sa) + 0.5; }
  else { t.x = (t.x - 0.5) * (sa / uImgAspect) + uFocus.x; }

  // brush in water: rings around the pointer
  vec2 m = uv - uMouse; m.x *= sa;
  float d = length(m);
  t += (m / (d + 1e-4)) * sin(d * 55.0 - uTime * 5.0) * 0.0035 * exp(-d * 7.0) * uMouseAmt;

  vec3 col;
  if (uLayers == 0) {
    float near = clamp(smoothstep(0.66, 1.0, t.y) + smoothstep(0.58, 0.95, t.x) * smoothstep(0.42, 0.0, t.y), 0.0, 1.0);
    col = texture2D(uL0, through(t, 0.15 + 0.6 * near)).rgb;
  } else {
    vec4 c = vec4(uPaper, 1.0);
    c = over(c, texture2D(uL0, through(t, uDepth.x)));
    if (uLayers > 1) c = over(c, texture2D(uL1, through(t, uDepth.y)));
    if (uLayers > 2) c = over(c, texture2D(uL2, through(t, uDepth.z)));
    if (uLayers > 3) c = over(c, texture2D(uL3, through(t, uDepth.w)));
    col = c.rgb;
  }

  vec3 paper = uPaper * (0.975 + 0.05 * fbm(uv * vec2(70.0, 110.0)));
  col = mix(col, paper, uFog);

  // ink bleeding out from one drop, ragged edge, darker rim where the ink pools
  vec2 q = uv - uDrop; q.x *= sa;
  float r = length(q) + (fbm(uv * 4.0 + 3.0) - 0.5) * 0.45;
  float front = uReveal * 2.3;
  float inside = smoothstep(front, front - 0.12, r);
  float rim = smoothstep(front - 0.16, front - 0.05, r) * (1.0 - smoothstep(front - 0.02, front, r));
  vec3 outc = mix(paper, col, inside);
  outc = mix(outc, outc * 0.7, rim * 0.75 * (1.0 - smoothstep(1.2, 1.9, front)));
  gl_FragColor = vec4(outc, 1.0);
}
`;

export type InkLayer = { src: string; depth: number };

export type InkUniforms = {
  reveal: number; time: number; zoom: number; fog: number;
  mouse: [number, number]; mouseAmt: number; focusX: number;
};

/** `layers` empty → the single `painting`; otherwise up to 4 layers, back to front. */
export function createInk(canvas: HTMLCanvasElement, source: { painting: string; layers: InkLayer[] }, onReady: () => void) {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl || gl.isContextLost()) return null;

  const compile = (type: number, code: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, code);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = {
    res: u("uRes"), aspect: u("uImgAspect"), reveal: u("uReveal"), time: u("uTime"), zoom: u("uZoom"),
    fog: u("uFog"), mouse: u("uMouse"), mouseAmt: u("uMouseAmt"), focus: u("uFocus"), drop: u("uDrop"), paper: u("uPaper"),
    layers: u("uLayers"), depth: u("uDepth"),
  };

  const list = source.layers.length ? source.layers.slice(0, 4) : [{ src: source.painting, depth: 0 }];
  const depth = [0, 0, 0, 0];
  list.forEach((l, i) => (depth[i] = l.depth));
  gl.uniform1i(U.layers, source.layers.length ? list.length : 0);
  gl.uniform4f(U.depth, depth[0], depth[1], depth[2], depth[3]);
  gl.uniform3f(U.paper, 236 / 255, 226 / 255, 206 / 255);

  const textures: WebGLTexture[] = [];
  let loaded = 0;
  let ready = false;
  list.forEach((layer, i) => {
    gl.uniform1i(u(`uL${i}`), i);
    const tex = gl.createTexture()!;
    textures.push(tex);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      if (i === 0) gl.uniform1f(U.aspect, img.naturalWidth / img.naturalHeight);
      if (++loaded === list.length) {
        ready = true;
        onReady();
      }
    };
    img.src = layer.src;
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(U.res, w, h);
  };

  return {
    draw(s: InkUniforms) {
      if (!ready) return;
      resize();
      gl.uniform1f(U.reveal, s.reveal);
      gl.uniform1f(U.time, s.time);
      gl.uniform1f(U.zoom, s.zoom);
      gl.uniform1f(U.fog, s.fog);
      gl.uniform2f(U.mouse, s.mouse[0], s.mouse[1]);
      gl.uniform1f(U.mouseAmt, s.mouseAmt);
      gl.uniform2f(U.focus, s.focusX, 0.62);
      gl.uniform2f(U.drop, 0.3, 0.78);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    // Free our objects but keep the context: a canvas hands back the same
    // context on the next getContext(), so losing it would break a remount.
    destroy() {
      ready = false;
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    },
  };
}
