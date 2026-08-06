// The catalogue button's depth: stars streaming out of the distance behind the
// label. One fragment shader on a fullscreen triangle, no library.
//
// Values below were tuned by the editor in the button lab and are the source of
// truth for the effect; the box (padding, size, tracking) lives in index.astro.
//
// Degrades honestly: no WebGL leaves the canvas empty and the button is still a
// plain link, prefers-reduced-motion draws one settled frame and never animates,
// and the loop stops whenever the tab is hidden.

const FX = {
  SPEED: 0.45,
  DEPTH: 1.1,
  DENSITY: 1,
  GLOW: 1.05,
  PARALLAX: 1,
  HOVER: 1.15,
  OPACITY: 1,
};
// the frame a still render settles on, so the reduced-motion picture is composed
// rather than whatever the clock happened to be at
const STILL_T = 3.2;

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const FRAG = `
precision highp float;
uniform vec2 uRes, uMouse;
uniform float uTime, uHover, uSpeed, uDepth, uDensity, uGlow, uParallax, uOpacity;
uniform vec3 uAccent, uStar;
float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
vec3 h33(vec3 q){ q = fract(q * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yxz + 33.33); return fract((q.xxy + q.yxx) * q.zyx); }
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * uSpeed;
  vec2 mo = uMouse * uParallax;
  vec3 col = vec3(0.0);
  for (int i = 0; i < 54; i++){
    float fi = float(i);
    float z = fract(h11(fi) + t * 0.16 * (1.0 + uHover * 0.9));
    vec3 r = h33(vec3(fi, 3.0, 7.0));
    vec2 dir = normalize(r.xy - 0.5 + 0.0001);
    vec2 sp = dir * mix(0.02, 1.35, z * z) * uDepth * (0.6 + r.z) + mo * 0.05 * z;
    float d = length(uv - sp);
    float sz = mix(0.0006, 0.0075, z) * (1.0 + uHover * 0.7) * uDensity;
    col += mix(uStar, uAccent, z) * (sz / (d + 0.0012)) * z * uGlow;
  }
  col *= uOpacity;
  // Normal alpha rather than additive: additive adds light, which is nearly
  // invisible on warm paper. Keeping the hue and using brightness as coverage
  // makes one shader read as ink by day and as starlight on slate by night.
  float I = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
  vec3 rgb = col / max(1e-4, max(max(col.r, col.g), col.b));
  gl_FragColor = vec4(rgb, I);
}`;

const rgbOf = (name) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseInt(v.slice(1), 16);
  if (Number.isNaN(n)) return [0.15, 0.26, 0.82];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function boot() {
  const canvas = document.querySelector('canvas[data-warp]');
  if (!canvas) return;
  const button = canvas.closest('a');

  let gl;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  } catch (e) {
    return;
  }
  if (!gl) return; // no WebGL: the link still works, the canvas simply stays empty

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const U = (n) => gl.getUniformLocation(prog, n);
  const u = {
    res: U('uRes'), mouse: U('uMouse'), time: U('uTime'), hover: U('uHover'),
    speed: U('uSpeed'), depth: U('uDepth'), density: U('uDensity'), glow: U('uGlow'),
    parallax: U('uParallax'), opacity: U('uOpacity'), accent: U('uAccent'), star: U('uStar'),
  };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let hover = 0;
  let target = 0;
  let mx = 0;
  let my = 0;

  button.addEventListener('pointerenter', () => { target = 1; });
  button.addEventListener('pointerleave', () => { target = 0; mx = 0; my = 0; });
  button.addEventListener('pointermove', (e) => {
    const r = button.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  button.addEventListener('focus', () => { target = 1; });
  button.addEventListener('blur', () => { target = 0; });

  const draw = (seconds) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.res, w, h);
    gl.uniform2f(u.mouse, mx, my);
    gl.uniform1f(u.time, seconds);
    gl.uniform1f(u.hover, hover * FX.HOVER);
    gl.uniform1f(u.speed, FX.SPEED);
    gl.uniform1f(u.depth, FX.DEPTH);
    gl.uniform1f(u.density, FX.DENSITY);
    gl.uniform1f(u.glow, FX.GLOW);
    gl.uniform1f(u.parallax, FX.PARALLAX);
    gl.uniform1f(u.opacity, FX.OPACITY);
    gl.uniform3fv(u.accent, rgbOf('--accent'));
    gl.uniform3fv(u.star, rgbOf('--star'));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let raf = 0;
  const frame = (ms) => {
    raf = requestAnimationFrame(frame);
    hover += (target - hover) * 0.12;
    draw(ms / 1000);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  const start = () => {
    if (reduced.matches) {
      stop();
      hover = 0;
      draw(STILL_T); // one settled frame, no motion
      return;
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduced.addEventListener('change', start);
  // the theme swap changes the ink, so a still frame has to be redrawn
  new MutationObserver(() => { if (reduced.matches) draw(STILL_T); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('resize', () => { if (reduced.matches) draw(STILL_T); });

  start();
}

boot();
