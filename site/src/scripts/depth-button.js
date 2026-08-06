// The hero's catalogue button: a real depth field behind the label, points
// drifting toward the reader in a perspective camera. three.js is already on
// this page for the hero sky, so this adds no new dependency.
//
// Degrades honestly: no WebGL leaves the canvas empty and the button is still a
// plain link, prefers-reduced-motion renders one settled frame and never
// animates, and the loop stops whenever the tab is hidden.

import * as THREE from 'three';

const FX = {
  SPEED: 1,
  DEPTH: 1,
  DENSITY: 1,
  GLOW: 1,
  PARALLAX: 1,
  HOVER: 1,
  OPACITY: 1,
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
  camera.position.z = 4.2 / FX.DEPTH;

  const group = new THREE.Group();
  group.scale.setScalar(FX.DENSITY * 0.9);
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

  const draw = (t) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    group.rotation.y = t * 0.05 + mx * 0.5 * FX.PARALLAX;
    group.rotation.x = my * 0.3 * FX.PARALLAX;
    mat.color.set(hexOf('--star'));
    mat.opacity = Math.min(1, FX.OPACITY * FX.GLOW * (0.55 + hover * 0.5));
    renderer.render(scene, camera);
  };

  const advance = () => {
    const arr = geom.attributes.position.array;
    const step = 0.05 * FX.SPEED * (1 + hover * FX.HOVER * 1.2);
    for (let i = 2; i < arr.length; i += 3) {
      arr[i] += step;
      if (arr[i] > NEAR) arr[i] = FAR;
    }
    geom.attributes.position.needsUpdate = true;
  };

  let raf = 0;
  const frame = (ms) => {
    raf = requestAnimationFrame(frame);
    hover += (target - hover) * 0.12;
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
