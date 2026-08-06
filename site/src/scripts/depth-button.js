// The hero's catalogue button: a real depth field behind the label, points
// drifting toward the reader in a perspective camera. three.js is already on
// this page for the hero sky, so this adds no new dependency.
//
// Motion values below were tuned by the editor in the hover lab and are the
// source of truth for the feel; the box (padding, size, tracking) lives in
// index.astro.
//
// Degrades honestly: no WebGL leaves the canvas empty and the button is still a
// plain link, prefers-reduced-motion renders one settled frame and never
// animates, and the loop stops whenever the tab is hidden.

import * as THREE from 'three';

const FX = {
  // Hover ramps in fast and falls away slowly, so arriving feels responsive
  // while leaving fades rather than cuts.
  HOVER_IN: 0.4,
  HOVER_OUT: 0.09,
  // Heavy pointer smoothing: the field trails the cursor by a long way, which
  // is what kills the jitter the raw 1:1 tracking used to show.
  POINTER_LERP: 0.02,
  PARALLAX_Y: 0.5,
  PARALLAX_X: 0.3,
  RECENTER: 1,
  DRIFT_SPEED: 0.05,
  SPEED_BOOST: 1.2,
  ROT_SPEED: 0.05,
  OPACITY_BASE: 0.55,
  OPACITY_BOOST: 0.5,
};
const COUNT = 420;
const FAR = -22;
const NEAR = 2.5;

const hexOf = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#2743d0';

export function boot() {
  const canvas = document.querySelector('canvas[data-depth]');
  if (!canvas) return;
  const button = canvas.closest('a');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return; // no WebGL: the link still works, the canvas simply stays empty
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.z = 4.2;

  const group = new THREE.Group();
  group.scale.setScalar(0.9);
  scene.add(group);

  // Deterministic layout: the same field on every load, so the button never
  // reshuffles itself between visits.
  let seed = 20260806;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (rnd() - 0.5) * 9;
    pos[i * 3 + 1] = (rnd() - 0.5) * 5;
    pos[i * 3 + 2] = FAR * rnd();
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.055,
    sizeAttenuation: true,
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geom, mat);
  group.add(points);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let hover = 0;
  let target = 0;
  let rawX = 0; // where the pointer actually is
  let rawY = 0;
  let mx = 0; // where the field has eased to, always chasing the raw values
  let my = 0;
  let inside = false;

  button.addEventListener('pointerenter', () => { target = 1; inside = true; });
  button.addEventListener('pointerleave', () => { target = 0; inside = false; });
  button.addEventListener('pointermove', (e) => {
    const r = button.getBoundingClientRect();
    rawX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    rawY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  button.addEventListener('focus', () => { target = 1; });
  button.addEventListener('blur', () => { target = 0; });

  const draw = (t) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    group.rotation.y = t * FX.ROT_SPEED + mx * FX.PARALLAX_Y;
    group.rotation.x = my * FX.PARALLAX_X;
    mat.color.set(hexOf('--star'));
    mat.opacity = Math.min(1, FX.OPACITY_BASE + hover * FX.OPACITY_BOOST);
    renderer.render(scene, camera);
  };

  const advance = () => {
    const arr = geom.attributes.position.array;
    const step = FX.DRIFT_SPEED * (1 + hover * FX.SPEED_BOOST);
    for (let i = 2; i < arr.length; i += 3) {
      arr[i] += step;
      if (arr[i] > NEAR) arr[i] = FAR;
    }
    geom.attributes.position.needsUpdate = true;
  };

  let raf = 0;
  const frame = (ms) => {
    raf = requestAnimationFrame(frame);
    // separate rates in and out, so the fade away is gentler than the arrival
    hover += (target - hover) * (target > hover ? FX.HOVER_IN : FX.HOVER_OUT);
    // the pointer is chased, never matched; on leave the field eases back to
    // centre at its own rate rather than being reset to zero in one frame
    const tx = inside ? rawX : 0;
    const ty = inside ? rawY : 0;
    const lerp = inside ? FX.POINTER_LERP : FX.RECENTER;
    mx += (tx - mx) * lerp;
    my += (ty - my) * lerp;
    advance();
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
      draw(0); // one settled frame, no motion
      return;
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduced.addEventListener('change', start);
  new MutationObserver(() => { if (reduced.matches) draw(0); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('resize', () => { if (reduced.matches) draw(0); });

  start();
}

boot();
