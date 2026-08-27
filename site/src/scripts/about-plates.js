/* Approved Works · client engine.
   Same math as the PDF's build script: true 3D to 2D projection computed here
   and emitted as SVG. The web upgrade is that it happens live: the chandelier
   orbits, the gates close, the audit re-runs and lands identical.
   Line contract (declared on the page, obeyed here):
     solid = shipped · dashed = killed · phantom = unreleased. */

const NS = 'http://www.w3.org/2000/svg';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------- math -- */
const v3 = (x, y, z) => ({ x, y, z });
const scale3 = (a, s) => v3(a.x * s, a.y * s, a.z * s);
const sub3 = (a, b) => v3(a.x - b.x, a.y - b.y, a.z - b.z);
const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross3 = (a, b) => v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const norm3 = (a) => { const l = Math.hypot(a.x, a.y, a.z) || 1; return v3(a.x / l, a.y / l, a.z / l); };
const lerp = (a, b, t) => a + (b - a) * t;
const fmt = (n) => (Math.round(n * 100) / 100).toString();

function camera({ eye, target, up = v3(0, 1, 0), fov = 32, w, h }) {
  const fwd = norm3(sub3(target, eye));
  const right = norm3(cross3(fwd, up));
  const trueUp = cross3(right, fwd);
  const f = (h / 2) / Math.tan((fov * Math.PI) / 360);
  return {
    project(p) {
      const rel = sub3(p, eye);
      const cz = Math.max(dot3(rel, fwd), 1e-6);
      return { x: w / 2 + (dot3(rel, right) / cz) * f, y: h / 2 - (dot3(rel, trueUp) / cz) * f, depth: cz };
    },
  };
}
function axonometric({ alpha, beta, s = 1, cx, cy }) {
  const a = (alpha * Math.PI) / 180, b = (beta * Math.PI) / 180;
  return {
    project(p) {
      return { x: cx + (p.x * Math.cos(a) - p.z * Math.cos(b)) * s, y: cy + (p.x * Math.sin(a) + p.z * Math.sin(b) - p.y) * s, depth: p.x + p.z - p.y };
    },
  };
}
function bez3(p0, c1, c2, p1, steps) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    out.push(v3(
      u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
      u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
      u * u * u * p0.z + 3 * u * u * t * c1.z + 3 * u * t * t * c2.z + t * t * t * p1.z));
  }
  return out;
}
const pathFrom = (pts, close = false) => pts.length
  ? pts.map((p, i) => `${i ? 'L' : 'M'}${fmt(p.x)} ${fmt(p.y)}`).join('') + (close ? 'Z' : '') : '';
function smoothPathFrom(pts) {
  if (pts.length < 3) return pathFrom(pts);
  let d = `M${fmt(pts[0].x)} ${fmt(pts[0].y)}`;
  for (let i = 0; i < pts.length - 2; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += `C${fmt(p1.x + (p2.x - p0.x) / 6)} ${fmt(p1.y + (p2.y - p0.y) / 6)} ${fmt(p2.x - (p3.x - p1.x) / 6)} ${fmt(p2.y - (p3.y - p1.y) / 6)} ${fmt(p2.x)} ${fmt(p2.y)}`;
  }
  return d;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16).padStart(8, '0'); };

/* ------------------------------------------------------------- svg utils - */
function el(name, attrs = {}, parent) {
  const n = document.createElementNS(NS, name);
  for (const [k, val] of Object.entries(attrs)) n.setAttribute(k, val);
  if (parent) parent.appendChild(n);
  return n;
}
function svgRoot(host, w, h, fixedWidth = false) {
  const s = el('svg', { viewBox: `0 0 ${w} ${h}`, class: 'plate-svg' });
  s.setAttribute('role', 'img');
  if (fixedWidth) { s.style.width = `${w}px`; s.style.maxWidth = '100%'; }
  host.appendChild(s);
  return s;
}
const PHANTOM = '7,3.5,1.5,3.5,1.5,3.5';
const DASHED = '5,3';

/* Draw-in: give every path/line/circle a stroke-draw animation with stagger. */
function prepDraw(svg, { stagger = 14, dur = 700 } = {}) {
  if (reduced) return () => {};
  const marks = svg.querySelectorAll('path, line, circle, rect');
  marks.forEach((m) => {
    let len = 0;
    try { len = m.getTotalLength ? m.getTotalLength() : 0; } catch { len = 0; }
    if (!len || m.dataset.nodraw) return;
    m.style.strokeDasharray = m.dataset.conv ? m.style.strokeDasharray : `${len}`;
    if (!m.dataset.conv) {
      m.style.strokeDashoffset = `${len}`;
      m.dataset.drawlen = len;
    } else {
      m.style.opacity = '0';
    }
  });
  return () => {
    let i = 0;
    marks.forEach((m) => {
      const delay = i++ * stagger;
      if (m.dataset.drawlen) {
        m.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
        requestAnimationFrame(() => { m.style.strokeDashoffset = '0'; });
        m.addEventListener('transitionend', () => { m.style.strokeDasharray = ''; m.style.transition = ''; }, { once: true });
      } else if (m.dataset.conv) {
        m.style.transition = `opacity 420ms ease ${delay}ms`;
        requestAnimationFrame(() => { m.style.opacity = '1'; });
      }
    });
  };
}

/* ------------------------------------------------------------ chandelier - */
function chandelierGeometry(az, fov) {
  const S = v3(0, 172, 0), A = v3(0, -14, 0), R = 78, ringY = 58;
  const eye = v3(340 * Math.sin(az), 210, 340 * Math.cos(az));
  const cam = camera({ eye, target: v3(0, 52, 0), fov, w: 520, h: 470 });
  const nodes = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 7;
    nodes.push(v3(R * Math.cos(a), ringY, R * Math.sin(a)));
  }
  const strands = nodes.map((N, i) => {
    const bulge = 20 + 13 * Math.sin(i * 2.1 + 0.7);
    const l = Math.hypot(N.x, N.z) || 1;
    const out = v3((N.x / l) * bulge, 0, (N.z / l) * bulge);
    const top = bez3(S, v3(S.x + out.x * 0.45, 148 - i * 2, S.z + out.z * 0.45), v3(N.x + out.x, N.y + 44, N.z + out.z), N, 30);
    const down = bez3(N, v3(N.x * (0.86 + 0.05 * Math.sin(i * 1.3)), N.y - 36, N.z * 0.9), v3(N.x * 0.16, A.y + 28, N.z * 0.16), A, 30);
    return [...top, ...down.slice(1)];
  });
  return { cam, S, A, nodes, strands };
}
function createChandelier(svg, { labels = true } = {}) {
  // labeled version needs headroom for the source annotation; fov widens the frame
  const fov = labels ? 42 : 34;
  const CHUNKS = 8;
  // Built once; update(az) only rewrites attributes and z-reorders strand groups.
  // Full innerHTML rebuilds per frame were the jitter: layout + GC churn at 60fps.
  const ringPath = el('path', { class: 'st-faint', fill: 'none' }, svg);
  const centerLine = el('line', { class: 'st-center', 'data-nodraw': 1 }, svg);
  const strandsG = el('g', {}, svg);
  const strandGs = [], chunkPaths = [];
  for (let i = 0; i < 6; i++) {
    const g = el('g', {}, strandsG);
    strandGs.push(g);
    const arr = [];
    for (let c = 0; c < CHUNKS; c++) arr.push(el('path', { class: 'st-key', fill: 'none', 'stroke-linecap': 'round', 'data-conv': 'solid' }, g));
    chunkPaths.push(arr);
  }
  const nodeDots = [], nodeTexts = [];
  for (let i = 0; i < 6; i++) {
    nodeDots.push(el('circle', { r: 2.6, class: 'nd', 'data-conv': 'solid' }, svg));
    if (labels) nodeTexts.push(el('text', { class: 'annf' }, svg));
  }
  // Hover FX: two chromatic echoes of the strand linework plus a bright tracer
  // that runs along each strand. Hidden until update() receives an fx state.
  const fxG = el('g', {}, svg);
  fxG.style.opacity = '0';
  fxG.style.pointerEvents = 'none';
  const echoLayer = (stroke, glow, width) => {
    const g = el('g', {}, fxG);
    g.style.stroke = stroke;
    g.style.filter = `drop-shadow(0 0 ${glow}px ${stroke})`;
    const paths = [];
    for (let i = 0; i < 6; i++) paths.push(el('path', { fill: 'none', 'stroke-width': width, 'stroke-linecap': 'round', 'data-nodraw': 1 }, g));
    return { g, paths };
  };
  const echoA = echoLayer('var(--accent)', 4, 0.8);
  const echoB = echoLayer('var(--accent-deep)', 4, 0.8);
  const tracer = echoLayer('var(--accent)', 5, 1.7);
  tracer.paths.forEach((p) => p.setAttribute('stroke-dasharray', '12 228'));
  const sDot = el('circle', { r: 3.4, class: 'nd-solid', 'data-conv': 'solid' }, svg);
  const aDot = el('circle', { r: 3.4, class: 'nd', 'data-conv': 'solid' }, svg);
  const outs = [[-128, 1.6, 'CONVERGENCE'], [0, 0.9, 'DIVERGENCE'], [128, 0.45, 'UNIQUE INSIGHTS']];
  let srcTxt, outPaths = [], outTexts = [], sepLine, synthTxt;
  if (labels) {
    srcTxt = el('text', { class: 'ann' }, svg);
    srcTxt.textContent = 'SOURCE · ONE URL';
    for (const [, sw, label] of outs) {
      outPaths.push(el('path', { class: 'st-key', fill: 'none', 'stroke-width': sw, 'stroke-linecap': 'round', 'data-conv': 'solid' }, svg));
      const t = el('text', { class: 'annf ann-key', 'text-anchor': 'middle' }, svg);
      t.textContent = label;
      outTexts.push(t);
    }
    sepLine = el('line', { class: 'st-carbon-thin' }, svg);
    synthTxt = el('text', { class: 'ann', 'text-anchor': 'middle' }, svg);
    synthTxt.textContent = 'ONE SYNTHESIS';
  }
  return function update(az, windAt, fx) {
    const { cam, S, A, nodes, strands } = chandelierGeometry(az, fov);
    // windAt(p) is a world-space x displacement; both anchors sit where its
    // height envelope is zero, so the spire and apex stay pinned.
    const proj = windAt ? (p) => cam.project(v3(p.x + windAt(p), p.y, p.z)) : (p) => cam.project(p);
    ringPath.setAttribute('d', pathFrom([...nodes, nodes[0]].map(proj)));
    const ps = proj(S), pa = proj(A);
    centerLine.setAttribute('x1', fmt(ps.x)); centerLine.setAttribute('y1', fmt(ps.y - 30));
    centerLine.setAttribute('x2', fmt(pa.x)); centerLine.setAttribute('y2', fmt(pa.y + 34));
    const fxOn = fx && fx.e > 0.004;
    fxG.style.opacity = fxOn ? fmt(fx.e) : '0';
    if (fxOn) {
      echoA.g.setAttribute('transform', `translate(${fmt(fx.off)} ${fmt(-fx.off * 0.35)})`);
      echoB.g.setAttribute('transform', `translate(${fmt(-fx.off)} ${fmt(fx.off * 0.35)})`);
      tracer.paths.forEach((p) => p.setAttribute('stroke-dashoffset', fmt(fx.dash)));
    }
    const order = strands.map((pts, i) => ({ pts, d: proj(nodes[i]).depth, i })).sort((a, b) => b.d - a.d);
    for (const s of order) {
      strandsG.appendChild(strandGs[s.i]); // re-sort back-to-front; moves nodes, no rebuild
      const pp = s.pts.map(proj);
      if (fxOn) {
        const dFull = pathFrom(pp);
        echoA.paths[s.i].setAttribute('d', dFull);
        echoB.paths[s.i].setAttribute('d', dFull);
        tracer.paths[s.i].setAttribute('d', dFull);
      }
      const depths = pp.map((p) => p.depth);
      const lo = Math.min(...depths), hi = Math.max(...depths);
      const per = Math.ceil((pp.length - 1) / CHUNKS);
      for (let c = 0; c < CHUNKS; c++) {
        const seg = pp.slice(c * per, Math.min(c * per + per + 1, pp.length));
        const path = chunkPaths[s.i][c];
        if (seg.length < 2) { path.setAttribute('d', ''); continue; }
        const mid = (seg[0].depth + seg[seg.length - 1].depth) / 2;
        const wgt = hi === lo ? 1 : 1.15 - ((mid - lo) / (hi - lo)) * 0.7;
        path.setAttribute('d', pathFrom(seg));
        path.setAttribute('stroke-width', fmt(wgt));
      }
    }
    nodes.forEach((N, i) => {
      const p = proj(N);
      nodeDots[i].setAttribute('cx', fmt(p.x)); nodeDots[i].setAttribute('cy', fmt(p.y));
      if (labels) {
        nodeTexts[i].setAttribute('x', fmt(p.x + (p.x > 260 ? 10 : -10)));
        nodeTexts[i].setAttribute('y', fmt(p.y + 3.5));
        nodeTexts[i].setAttribute('text-anchor', p.x > 260 ? 'start' : 'end');
        nodeTexts[i].textContent = `M${i + 1}`;
      }
    });
    sDot.setAttribute('cx', fmt(ps.x)); sDot.setAttribute('cy', fmt(ps.y));
    aDot.setAttribute('cx', fmt(pa.x)); aDot.setAttribute('cy', fmt(pa.y));
    if (labels) {
      srcTxt.setAttribute('x', fmt(ps.x + 11)); srcTxt.setAttribute('y', fmt(ps.y - 2));
      const oy = pa.y + 12, ey = pa.y + 54;
      outs.forEach(([dx], i) => {
        const ex = pa.x + dx;
        outPaths[i].setAttribute('d', `M${fmt(pa.x)} ${fmt(oy)} C ${fmt(pa.x)} ${fmt(oy + 20)}, ${fmt(ex)} ${fmt(ey - 20)}, ${fmt(ex)} ${fmt(ey)}`);
        outTexts[i].setAttribute('x', fmt(ex)); outTexts[i].setAttribute('y', fmt(ey + 14));
      });
      sepLine.setAttribute('x1', fmt(pa.x - 158)); sepLine.setAttribute('y1', fmt(ey + 24));
      sepLine.setAttribute('x2', fmt(pa.x + 158)); sepLine.setAttribute('y2', fmt(ey + 24));
      synthTxt.setAttribute('x', fmt(pa.x)); synthTxt.setAttribute('y', fmt(ey + 38));
    }
  };
}
function initChandelier(host, { hero = false }) {
  const svg = svgRoot(host, 520, 470);
  const update = createChandelier(svg, { labels: !hero });
  const REST = 0.50;
  update(REST);
  const play = prepDraw(svg, { stagger: 10, dur: 900 });
  let drawn = false, raf = null, visible = false;
  // Two independent layers, both pure functions of time:
  //  - Ambient breeze, always on: the strands sway on slow overlapping waves
  //    (pinned at spire and apex) and the camera drifts a few degrees. No
  //    pointer input touches the geometry, so it can never stutter.
  //  - Hover FX: the pointer feeds an eased energy level that fades in a
  //    chromatic echo (two glowing offset copies of the linework) plus a
  //    bright tracer running along each strand, direction set by entry side.
  const YT = 172, YB = -14;
  let energy = 0, target = 0, dir = 1, last = null, ambient0 = null;
  const tick = (t) => {
    raf = null;
    if (!visible) { last = null; return; }
    const dt = last == null ? 0 : Math.min((t - last) / 1000, 0.1);
    last = t;
    const ts = t / 1000;
    energy += (target - energy) * (1 - Math.exp(-dt / 0.22));
    if (!target && energy < 0.004) energy = 0;
    // Amplitude ramps from zero after the draw-in, so the first animated frame
    // is the rest pose itself and the sway grows out of it with no snap.
    if (ambient0 == null && drawn) ambient0 = t;
    const k = ambient0 == null ? 0 : Math.min((t - ambient0) / 2500, 1);
    const ramp = k * k * (3 - 2 * k);
    const az = REST + ramp * (0.085 * Math.sin(ts * 0.13) + 0.03 * Math.sin(ts * 0.051 + 2.1));
    const windAt = (p) => {
      const env = Math.sin(Math.PI * Math.min(Math.max((YT - p.y) / (YT - YB), 0), 1));
      return ramp * env * (9 * Math.sin(ts * 0.55 - p.x * 0.013) + 5 * Math.sin(ts * 0.23 + p.z * 0.011 + 1.7));
    };
    const fx = {
      e: energy,
      off: dir * energy * (2.4 + 0.5 * Math.sin(ts * 1.6)),
      dash: dir * ts * -170,
    };
    if (drawn) update(az, windAt, fx);
    raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf && !reduced && visible) raf = requestAnimationFrame(tick); };
  host.addEventListener('pointerenter', (e) => {
    const r = host.getBoundingClientRect();
    dir = e.clientX < r.left + r.width / 2 ? 1 : -1;
    target = 1;
  });
  host.addEventListener('pointerleave', () => { target = 0; });
  new IntersectionObserver((es) => {
    es.forEach((e) => {
      visible = e.isIntersecting;
      if (visible && !drawn) {
        play();
        setTimeout(() => { drawn = true; }, reduced ? 0 : 1500);
      }
      if (visible) kick();
    });
  }, { threshold: 0.2 }).observe(host);
}

/* ----------------------------------------------------------- commit disc - */
function initDisc(host) {
  const w = 220, h = 220, cx = w / 2, cy = h / 2, r0 = 66, r1 = 96;
  const svg = svgRoot(host, w, h, true);
  el('circle', { cx, cy, r: r1 + 5, class: 'st-carbon', fill: 'none' }, svg);
  el('circle', { cx, cy, r: r0 - 15, class: 'st-faint', fill: 'none' }, svg);
  const spokes = [];
  for (let i = 0; i < 109; i++) {
    const a = (2 * Math.PI * i) / 109 - Math.PI / 2;
    const major = i % 9 === 0;
    const ra = major ? r0 - 10 : r0;
    const ln = el('line', {
      x1: fmt(cx + ra * Math.cos(a)), y1: fmt(cy + ra * Math.sin(a)),
      x2: fmt(cx + r1 * Math.cos(a)), y2: fmt(cy + r1 * Math.sin(a)),
      class: major ? 'st-key-heavy' : 'st-key-thin', 'data-conv': 'solid',
    }, svg);
    spokes.push(ln);
  }
  const t1 = el('text', { x: cx, y: cy + 4, class: 'ann', 'text-anchor': 'middle' }, svg);
  el('text', { x: cx, y: cy + 16, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = 'COMMITS · ~8 MO';
  if (reduced) { t1.textContent = '~10.9K'; return; }
  spokes.forEach((s) => { s.style.opacity = '0'; });
  new IntersectionObserver((es, io) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(host);
      spokes.forEach((s, i) => setTimeout(() => { s.style.opacity = '1'; t1.textContent = `~${(((i + 1) * 100) / 1000).toFixed(1)}K`; }, i * 16));
    });
  }, { threshold: 0.4 }).observe(host);
}

/* -------------------------------------------------------------- corridor - */
function initCorridor(host, controls) {
  const w = 520, h = 300, cx = w * 0.5, cy = h * 0.42, f = 224, camY = 62;
  const P = (x, y, z) => ({ x: cx + (x * f) / z, y: cy - ((y - camY) * f) / z });
  const gates = [];
  for (let i = 0; i < 10; i++) gates.push(140 * Math.pow(1.29, i));
  const gw = 112, gh = 118;
  const svg = svgRoot(host, w, h);
  for (const gx of [-gw, -gw / 2, 0, gw / 2, gw]) {
    const a = P(gx, 0, gates[0] * 0.9), b = P(gx, 0, gates[9] * 1.2);
    el('line', { x1: fmt(a.x), y1: fmt(a.y), x2: fmt(b.x), y2: fmt(b.y), class: 'st-faint' }, svg);
  }
  gates.forEach((z) => {
    const a = P(-gw, 0, z), b = P(gw, 0, z);
    el('line', { x1: fmt(a.x), y1: fmt(a.y), x2: fmt(b.x), y2: fmt(b.y), class: 'st-faint' }, svg);
  });
  const gateEls = [];
  for (let i = 9; i >= 0; i--) {
    const z = gates[i], human = i >= 8;
    const sw = human ? 1.35 : lerp(1.25, 0.55, i / 9);
    const tl = P(-gw, gh, z), tr = P(gw, gh, z), br = P(gw, 0, z), bl = P(-gw, 0, z);
    const g = el('g', {}, svg);
    if (human) {
      // jambs drawn now; the top beam closes only when the human acts
      el('line', { x1: fmt(bl.x), y1: fmt(bl.y), x2: fmt(tl.x), y2: fmt(tl.y), class: 'st-human', 'stroke-width': sw }, g);
      el('line', { x1: fmt(br.x), y1: fmt(br.y), x2: fmt(tr.x), y2: fmt(tr.y), class: 'st-human', 'stroke-width': sw }, g);
      const beam = el('line', { x1: fmt(tl.x), y1: fmt(tl.y), x2: fmt(tr.x), y2: fmt(tr.y), class: 'st-human', 'stroke-width': sw }, g);
      beam.style.opacity = '0';
      gateEls[i] = { g, beam };
    } else {
      el('path', { d: `M${fmt(bl.x)} ${fmt(bl.y)}L${fmt(tl.x)} ${fmt(tl.y)}L${fmt(tr.x)} ${fmt(tr.y)}L${fmt(br.x)} ${fmt(br.y)}`, class: 'st-key', fill: 'none', 'stroke-width': fmt(sw) }, g);
      gateEls[i] = { g };
      const left = i % 2 === 0;
      const corner = P(left ? -gw : gw, gh, z);
      el('text', { x: fmt(corner.x + (left ? -6 : 6)), y: fmt(corner.y + 7), class: 'annf', 'text-anchor': left ? 'end' : 'start' }, g).textContent = String(i + 1).padStart(2, '0');
    }
  }
  const sIn = P(0, 26, gates[0] * 0.94);
  const dot = el('circle', { cx: fmt(sIn.x), cy: fmt(sIn.y), r: 3, class: 'nd-solid' }, svg);
  el('text', { x: fmt(sIn.x), y: fmt(sIn.y + 17), class: 'ann', 'text-anchor': 'middle' }, svg).textContent = 'EOD SIGNAL ENTERS HERE';
  const stamp = el('text', { x: fmt(cx), y: 18, class: 'ann ann-human', 'text-anchor': 'middle' }, svg);
  stamp.textContent = 'ORDER TRANSMITS · PAPER';
  stamp.style.opacity = '0';

  // Auto-demo: gates 01..08 close, a human gate 09 closes, gate 10 confirms and
  // the order walks the corridor to the vanishing point. Then it resets and
  // loops. Pauses when offscreen; static all-closed pose under reduced motion.
  const armBeam = gateEls[8].beam, sendBeam = gateEls[9].beam;

  if (reduced) {
    for (let i = 0; i < 8; i++) gateEls[i].g.style.opacity = '1';
    armBeam.style.opacity = '1'; sendBeam.style.opacity = '1';
    const pEnd = P(0, 26, gates[9] * 1.14);
    dot.setAttribute('cx', fmt(pEnd.x)); dot.setAttribute('cy', fmt(pEnd.y)); dot.setAttribute('r', '1.4');
    stamp.style.opacity = '1';
    controls.progress(10);
    return;
  }

  let visible = false, timers = [], walkRaf = null;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; if (walkRaf) cancelAnimationFrame(walkRaf); walkRaf = null; };

  const reset = () => {
    for (let i = 0; i < 8; i++) { gateEls[i].g.style.transition = 'opacity 220ms ease'; gateEls[i].g.style.opacity = '0'; }
    armBeam.style.opacity = '0'; sendBeam.style.opacity = '0';
    stamp.style.opacity = '0';
    dot.setAttribute('cx', fmt(sIn.x)); dot.setAttribute('cy', fmt(sIn.y)); dot.setAttribute('r', '3');
    controls.progress(0);
  };

  const walk = () => {
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      const z = lerp(gates[0] * 0.94, gates[9] * 1.14, k * k);
      const p = P(0, 26, z);
      dot.setAttribute('cx', fmt(p.x)); dot.setAttribute('cy', fmt(p.y));
      dot.setAttribute('r', fmt(lerp(3, 1.4, k)));
      if (k < 1) { walkRaf = requestAnimationFrame(step); }
      else { walkRaf = null; stamp.style.transition = 'opacity 400ms ease'; stamp.style.opacity = '1'; }
    };
    walkRaf = requestAnimationFrame(step);
  };

  const cycle = () => {
    if (!visible) return;
    clearAll();
    reset();
    let t = 500;
    for (let i = 0; i < 8; i++) { const gi = i; at(t, () => { gateEls[gi].g.style.transition = 'opacity 300ms ease'; gateEls[gi].g.style.opacity = '1'; controls.progress(gi + 1); }); t += 240; }
    t += 500; at(t, () => { armBeam.style.transition = 'opacity 350ms ease'; armBeam.style.opacity = '1'; controls.progress(9); });
    t += 950; at(t, () => { sendBeam.style.transition = 'opacity 350ms ease'; sendBeam.style.opacity = '1'; controls.progress(10); walk(); });
    t += 3400; at(t, cycle);
  };

  new IntersectionObserver((es) => {
    es.forEach((e) => {
      visible = e.isIntersecting;
      if (visible) { if (!timers.length && !walkRaf) cycle(); }
      else clearAll();
    });
  }, { threshold: 0.35 }).observe(host);
}

/* ---------------------------------------------------------- ledger strip - */
function initLedger(host) {
  const w = 520, h = 54, x0 = 6, x1 = w - 6, y = h * 0.42;
  const svg = svgRoot(host, w, h);
  el('line', { x1: x0, y1: y, x2: x1, y2: y, class: 'st-carbon' }, svg);
  for (let i = 0; i < 69; i++) {
    const x = x0 + ((x1 - x0) * i) / 68, tall = i % 10 === 0;
    el('line', { x1: fmt(x), y1: fmt(y - (tall ? 12 : 7)), x2: fmt(x), y2: fmt(y + (tall ? 8 : 5)), class: tall ? 'st-key' : 'st-key-thin', 'data-conv': 'solid' }, svg);
  }
  el('text', { x: x0, y: h - 3, class: 'annf' }, svg).textContent = 'ENTRY 01 · 2026-06';
  el('text', { x: x1, y: h - 3, class: 'annf', 'text-anchor': 'end' }, svg).textContent = 'ENTRY 69 · 2026-07';
  const play = prepDraw(svg, { stagger: 12, dur: 300 });
  onEnter(host, play);
}

/* -------------------------------------------------------------- strata --- */
function initStrata(host) {
  const w = 520, h = 128, bw = 148, bh = h - 46, top = 18;
  const cells = [['SPY', 25], ['QQQ', 75], ['IWM', 65]];
  const svg = svgRoot(host, w, h);
  cells.forEach(([sym, pct], ci) => {
    const x0 = 4 + ci * (bw + 26), yB = top + bh;
    const floorY = top + bh * (1 - pct / 100);
    el('rect', { x: x0, y: top, width: bw, height: bh, class: 'st-carbon', fill: 'none' }, svg);
    let hatch = '';
    for (let d = 5; d < bw + (floorY - top); d += 5) {
      const px1 = x0 + Math.max(0, d - (floorY - top));
      const py1 = floorY - Math.min(d, floorY - top);
      const px2 = x0 + Math.min(d, bw);
      const py2 = floorY - Math.max(0, d - bw);
      if (px1 <= x0 + bw) hatch += `M${fmt(px1)} ${fmt(py1)}L${fmt(px2)} ${fmt(py2)}`;
    }
    el('path', { d: hatch, class: 'st-key-thin', fill: 'none', 'data-conv': 'solid' }, svg);
    el('line', { x1: x0, y1: fmt(floorY), x2: x0 + bw, y2: fmt(floorY), class: 'st-key-heavy' }, svg);
    el('text', { x: x0, y: top - 6, class: 'ann' }, svg).textContent = sym;
    el('text', { x: x0 + bw - 4, y: fmt(floorY + 12), class: 'annf', 'text-anchor': 'end' }, svg).textContent = `${pct}TH PCTL FLOOR`;
  });
  el('text', { x: 4, y: h - 1, class: 'annf' }, svg).textContent = 'FEAR RISES ↑ · HATCH = BUY ZONE · SPY BUYS EARLY, QQQ WAITS FOR DEEP FEAR';
  onEnter(host, prepDraw(svg, { stagger: 6, dur: 420 }));
}

/* ------------------------------------------------------------ confluence - */
function initConfluence(host, figure) {
  const w = 520, h = 320, midY = 132;
  const proj = axonometric({ alpha: 10, beta: 34, s: 1.12, cx: 128, cy: midY });
  const svg = svgRoot(host, w, h);
  const rand = rng(1936482);
  const passers = new Set([3, 11, 19, 27, 44, 53, 62, 74]);
  const fils = [];
  let gi = 0;
  for (const yC of [78, -78]) {
    for (let i = 0; i < 40; i++) {
      const t = i / 39;
      const start = v3(-108, yC + (t - 0.5) * 66, 34 - t * 68);
      const spread = (yC > 0 ? 1 : -1) * (4 + t * 46);
      const end = v3(86, spread * 0.9, (t - 0.5) * 26);
      const isPass = passers.has(gi);
      fils.push({ pts: bez3(start, v3(-42, yC * 0.78 + (t - 0.5) * 52, (34 - t * 68) * 0.7), v3(38, spread * 0.95, (t - 0.5) * 30), end, 24), isPass, z: start.z });
      gi++;
      void rand();
    }
  }
  fils.sort((a, b) => b.z - a.z);
  for (const fil of fils) {
    const pp = fil.pts.map((p) => proj.project(p));
    el('path', { d: smoothPathFrom(pp), class: fil.isPass ? 'st-key flow' : 'st-key-thin dim flow', fill: 'none', 'data-conv': 'solid' }, svg);
    if (!fil.isPass) {
      const e = pp[pp.length - 1];
      el('circle', { cx: fmt(e.x), cy: fmt(e.y), r: 1.1, class: 'nd', 'data-conv': 'solid' }, svg);
    }
  }
  const portalPts = [v3(86, 62, 40), v3(86, 62, -40), v3(86, -62, -40), v3(86, -62, 40)].map((p) => proj.project(p));
  el('path', { d: pathFrom(portalPts, true), class: 'st-carbon', fill: 'none' }, svg);
  const pTop = proj.project(v3(86, 70, 40));
  el('text', { x: fmt(pTop.x - 6), y: fmt(pTop.y - 14), class: 'ann' }, svg).textContent = 'RERANK → TOP 8';
  const portalX = 236, gateX = 356, ansX = 462;
  for (let k = 0; k < 8; k++) {
    const y = midY - 14 + k * 4;
    el('path', { d: `M${fmt(portalX)} ${fmt(midY - 26 + k * 7.4)} C ${fmt(portalX + 30)} ${fmt(midY - 26 + k * 7.4)}, ${fmt(gateX - 52)} ${fmt(y)}, ${fmt(gateX - 16)} ${fmt(y)}`, class: 'st-key flow', fill: 'none', 'data-conv': 'solid' }, svg);
  }
  el('text', { x: fmt((portalX + gateX) / 2 - 8), y: fmt(midY + 46), class: 'annf', 'text-anchor': 'middle' }, svg).textContent = '8 CANDIDATES';
  el('path', { d: `M${fmt(gateX)} ${fmt(midY - 15)}L${fmt(gateX + 15)} ${fmt(midY)}L${fmt(gateX)} ${fmt(midY + 15)}L${fmt(gateX - 15)} ${fmt(midY)}Z`, class: 'st-carbon diamond', fill: 'none' }, svg);
  el('text', { x: fmt(gateX), y: fmt(midY - 24), class: 'ann', 'text-anchor': 'middle' }, svg).textContent = 'CONFIDENCE GATE';
  const ansLine = el('line', { x1: fmt(gateX + 15), y1: fmt(midY), x2: fmt(ansX - 7), y2: fmt(midY), class: 'st-key answer', 'stroke-width': 1.3 }, svg);
  const ansDot = el('circle', { cx: fmt(ansX), cy: fmt(midY), r: 4, class: 'nd answer', 'stroke-width': 1.3 }, svg);
  const ansTxt = el('text', { x: fmt(ansX), y: fmt(midY + 20), class: 'annf answer', 'text-anchor': 'middle' }, svg);
  ansTxt.textContent = '1 CITED ANSWER';
  const ry = midY + 78;
  const refLine = el('line', { x1: fmt(gateX), y1: fmt(midY + 15), x2: fmt(gateX), y2: fmt(ry - 12), class: 'st-key refuse-path' }, svg);
  const refBox = el('rect', { x: fmt(gateX - 38), y: fmt(ry - 12), width: 76, height: 23, class: 'st-carbon refuse-box', fill: 'none' }, svg);
  const refTxt = el('text', { x: fmt(gateX), y: fmt(ry + 4), class: 'ann refuse-txt', 'text-anchor': 'middle' }, svg);
  refTxt.textContent = 'REFUSES';
  el('text', { x: fmt(gateX), y: fmt(ry + 25), class: 'annf', 'text-anchor': 'middle' }, svg).textContent = 'LOW CONFIDENCE → NO LLM CALL AT ALL';
  const b1 = proj.project(v3(-112, 100, 0)), b2 = proj.project(v3(-112, -100, 0));
  el('text', { x: fmt(b1.x), y: fmt(b1.y - 4), class: 'ann ann-key' }, svg).textContent = 'VECTOR TOP-40';
  el('text', { x: fmt(b2.x), y: fmt(b2.y + 12), class: 'ann ann-key' }, svg).textContent = 'BM25 TOP-40';
  onEnter(host, prepDraw(svg, { stagger: 7, dur: 520 }));
  // Auto-demo: retrieval confidence rises and falls on its own, crossing the
  // 0.30 gate so the cited-answer branch and the refusal branch each light in
  // turn. Pauses when offscreen; holds the answer-live pose under reduced motion.
  if (reduced) { figure.classList.remove('refusing'); return; }
  let visible = false, timer = null;
  const flip = (refusing) => {
    figure.classList.toggle('refusing', refusing);
    timer = setTimeout(() => { if (visible) flip(!refusing); }, refusing ? 2600 : 3600);
  };
  new IntersectionObserver((es) => {
    es.forEach((e) => {
      visible = e.isIntersecting;
      if (visible && timer == null) flip(false);
      else if (!visible && timer != null) { clearTimeout(timer); timer = null; }
    });
  }, { threshold: 0.3 }).observe(host);
}

/* ------------------------------------------------------------- tally ----- */
function initTally(host) {
  const w = 504, h = 52;
  const svg = svgRoot(host, w, h, true);
  let x = 4;
  const group = (gx, n, crossed) => {
    for (let i = 0; i < n; i++) el('line', { x1: gx + i * 6, y1: 10, x2: gx + i * 6, y2: 36, class: 'st-key', 'data-conv': 'solid' }, svg);
    if (crossed) el('line', { x1: gx - 4, y1: 32, x2: gx + 22, y2: 13, class: 'st-key', 'data-conv': 'solid' }, svg);
  };
  for (let g = 0; g < 14; g++) { group(x, 4, true); x += 34; }
  group(x, 3, false);
  el('text', { x: 4, y: h - 2, class: 'annf' }, svg).textContent = '73+ COMMITTED TEST FILES · EVAL EXITS NON-ZERO ON FAILURE · A CI GATE';
  onEnter(host, prepDraw(svg, { stagger: 18, dur: 240 }));
}

/* ------------------------------------------------------------ twin seals - */
function sealPath(r) {
  // Center-relative on purpose: the hash must describe the seal's geometry,
  // not where it happens to be printed, so run N and run 1 can be compared.
  const parts = [];
  const step = (Math.PI * 2) / 9;
  for (const rr of [r, r * 0.84, r * 0.56]) {
    let d = '';
    for (let i = 0; i < 9; i++) {
      const a = step * i - Math.PI / 2 - step / 2;
      d += `${i ? 'L' : 'M'}${fmt(rr * Math.cos(a))} ${fmt(rr * Math.sin(a))}`;
    }
    parts.push({ d: d + 'Z', main: rr === r });
  }
  return parts;
}
function drawSeal(g, cx, cy, r, run) {
  g.innerHTML = '';
  g.setAttribute('transform', `translate(${fmt(cx)} ${fmt(cy)})`);
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  const step = (Math.PI * 2) / 9;
  let hashSrc = '';
  for (const p of sealPath(r)) {
    hashSrc += p.d;
    el('path', { d: p.d, class: p.main ? 'st-key' : 'st-carbon-thin', fill: 'none', 'stroke-width': p.main ? 1.2 : 0.6 }, g);
  }
  for (let i = 0; i < 9; i++) {
    const a = step * i - Math.PI / 2 - step / 2;
    const d = `M${fmt(r * 0.84 * Math.cos(a))} ${fmt(r * 0.84 * Math.sin(a))}L${fmt(r * Math.cos(a))} ${fmt(r * Math.sin(a))}`;
    hashSrc += d;
    el('path', { d, class: 'st-key-thin' }, g);
    el('text', { x: fmt((r + 14) * Math.cos(a)), y: fmt((r + 14) * Math.sin(a) + 3), class: 'annf ann-key', 'text-anchor': 'middle' }, g).textContent = roman[i];
  }
  el('text', { x: 0, y: -4, class: 'ann', 'text-anchor': 'middle' }, g).textContent = 'GEO AUDIT';
  el('text', { x: 0, y: 9, class: 'annf', 'text-anchor': 'middle' }, g).textContent = '9 DIM · 0 LLM';
  el('text', { x: 0, y: r + 32, class: 'ann', 'text-anchor': 'middle' }, g).textContent = `RUN ${run}`;
  return fnv(hashSrc);
}
function initSeals(host) {
  const w = 520, h = 258, r = 72, cy = h * 0.46;
  const svg = svgRoot(host, w, h);
  const gL = el('g', {}, svg), gR = el('g', {}, svg);
  const dy = cy - r - 24;
  const cx1 = w * 0.26, cx2 = w * 0.74;
  el('line', { x1: fmt(cx1), y1: fmt(dy), x2: fmt(cx2), y2: fmt(dy), class: 'st-carbon-thin' }, svg);
  el('text', { x: fmt((cx1 + cx2) / 2), y: fmt(dy - 7), class: 'ann', 'text-anchor': 'middle' }, svg).textContent = 'DISPLACEMENT BETWEEN RUNS = 0';
  // Same URL, audited twice: identical input gives an identical seal, so the two
  // runs are the same drawing at zero displacement.
  drawSeal(gL, cx1, cy, r, 1);
  drawSeal(gR, cx2, cy, r, 2);
  onEnter(host, prepDraw(svg, { stagger: 8, dur: 520 }));
}

/* --------------------------------------------------------------- day bar - */
function initDayBar(host) {
  const w = 520, h = 62, x0 = 34, x1 = w - 34, y = 32;
  const svg = svgRoot(host, w, h);
  el('line', { x1: x0, y1: y, x2: x1, y2: y, class: 'st-carbon' }, svg);
  el('circle', { cx: x0, cy: y, r: 2.8, class: 'nd-solid key', 'data-conv': 'solid' }, svg);
  el('rect', { x: x1 - 3.5, y: y - 3.5, width: 7, height: 7, class: 'st-key', fill: 'none', 'data-conv': 'solid' }, svg);
  for (let i = 0; i < 15; i++) {
    const x = x0 + 20 + ((x1 - x0 - 52) * i) / 14;
    el('line', { x1: fmt(x), y1: y - 7, x2: fmt(x), y2: y + 7, class: 'st-key', 'data-conv': 'solid' }, svg);
  }
  el('text', { x: x1 - 24, y: y + 4.5, class: 'ann ann-key' }, svg).textContent = '+';
  el('text', { x: x0, y: y - 15, class: 'ann' }, svg).textContent = 'SPEC · MORNING';
  el('text', { x: x1, y: y - 15, class: 'ann', 'text-anchor': 'end' }, svg).textContent = 'LIVE · SAME DAY';
  el('text', { x: (x0 + x1) / 2, y: y + 24, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = '15 PRS MERGED DAY ONE · HUMAN MERGE GATE';
  onEnter(host, prepDraw(svg, { stagger: 40, dur: 260 }));
}

/* ------------------------------------------------------------ guard rings - */
function initRings(host) {
  const w = 520, h = 150, cx = 104, cy = h / 2;
  const svg = svgRoot(host, w, h);
  const rings = [[26, 'DNS-REBINDING PINNING'], [45, 'PRIVATE / METADATA-IP REFUSAL'], [64, 'PER-IP RATE LIMITS']];
  el('rect', { x: cx - 8, y: cy - 8, width: 16, height: 16, class: 'st-carbon', fill: 'none' }, svg);
  rings.forEach(([r], i) => el('circle', { cx, cy, r, class: 'st-key', fill: 'none', 'stroke-width': fmt(1.05 - i * 0.2), 'data-conv': 'solid' }, svg));
  [['FETCHER', 0], ...rings.map(([r0, label]) => [label, r0])].forEach(([label, r0], i) => {
    const ty = 24 + i * 32, elbowX = 224 + i * 12;
    el('path', { d: `M${fmt(cx + r0 + 2)} ${fmt(cy)}L${fmt(elbowX)} ${fmt(ty + 3)}L${fmt(elbowX + 9)} ${fmt(ty + 3)}`, class: 'st-graphite', fill: 'none' }, svg);
    el('text', { x: fmt(elbowX + 13), y: fmt(ty + 6), class: 'annf' }, svg).textContent = label;
  });
  onEnter(host, prepDraw(svg, { stagger: 30, dur: 600 }));
}

/* ---------------------------------------------------------------- stemma - */
function initStemma(host) {
  const w = 520, h = 400;
  const svg = svgRoot(host, w, h);
  const med = (x, y, n) => {
    el('circle', { cx: x, cy: y, r: 9, class: 'nd med', 'data-conv': 'solid' }, svg);
    el('text', { x, y: y + 3, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = n;
  };
  const link = (x1, y1, x2, y2, sw = 0.5) => el('line', { x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2), class: 'st-graphite', 'stroke-width': sw }, svg);
  const ry1 = 36;
  const readers = [...Array(5)].map((_, i) => ({ x: 56 + i * 40, y: ry1 }));
  const researchers = [...Array(4)].map((_, i) => ({ x: 320 + i * 40, y: ry1 }));
  el('text', { x: readers[2].x, y: ry1 - 20, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = 'CODE READERS ×5';
  el('text', { x: researchers[1].x + 20, y: ry1 - 20, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = 'WEB RESEARCHERS ×4';
  const py = 128, props = [...Array(3)].map((_, i) => ({ x: 130 + i * 130, y: py }));
  const jy = 210, judges = [...Array(3)].map((_, i) => ({ x: 130 + i * 130, y: jy }));
  for (const r of [...readers, ...researchers]) for (const p of props) link(r.x, r.y + 9, p.x, p.y - 12, 0.35);
  for (const p of props) for (const j of judges) link(p.x, p.y + 12, j.x, j.y - 9, 0.45);
  const sy = 282, sx = 260;
  for (const j of judges) link(j.x, j.y + 9, sx, sy - 10, 0.5);
  const hy = 330, prodY = 376;
  link(sx, sy + 10, sx, hy - 10, 0.75);
  link(sx, hy + 10, sx, prodY - 12, 0.75);
  let n = 1;
  for (const r of readers) med(r.x, r.y, n++);
  for (const r of researchers) med(r.x, r.y, n++);
  for (const p of props) {
    el('rect', { x: p.x - 54, y: p.y - 12, width: 108, height: 24, class: 'st-key box', fill: 'none' }, svg);
    med(p.x - 38, p.y, n++);
    el('text', { x: p.x + 9, y: p.y + 3, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = `PROPOSAL ${'ABC'[props.indexOf(p)]}`;
  }
  for (const j of judges) med(j.x, j.y, n++);
  el('text', { x: 8, y: jy + 26, class: 'annf' }, svg).textContent = 'JUDGE PANEL · 3 LENSES';
  med(sx, sy, 16);
  el('text', { x: sx + 18, y: sy + 3, class: 'annf' }, svg).textContent = 'SYNTHESIS · AGENT 16 OF 16';
  el('rect', { x: sx - 13, y: hy - 10, width: 26, height: 20, class: 'st-human box', 'data-conv': 'solid' }, svg);
  el('text', { x: sx, y: hy + 3.5, class: 'annf ann-human', 'text-anchor': 'middle' }, svg).textContent = 'R.A.';
  el('text', { x: sx + 22, y: hy + 3.5, class: 'annf' }, svg).textContent = 'CLAIMS RE-VERIFIED BY HAND';
  el('rect', { x: sx - 108, y: prodY - 12, width: 216, height: 24, class: 'st-carbon box', fill: 'none' }, svg);
  el('text', { x: sx, y: prodY + 4, class: 'ann', 'text-anchor': 'middle' }, svg).textContent = 'kinefractal.com · PRODUCTION';
  onEnter(host, prepDraw(svg, { stagger: 9, dur: 460 }));
}

/* ------------------------------------------------------------ skill grid - */
function initSkillGrid(host, counter) {
  const cols = 8, size = 20, gap = 8;
  const w = cols * (size + gap), rows = Math.ceil(31 / cols);
  const svg = svgRoot(host, w, rows * (size + gap) + 6, true);
  const cells = [];
  for (let i = 0; i < 31; i++) {
    const c = i % cols, r0 = Math.floor(i / cols);
    const x = 2 + c * (size + gap), y = 4 + r0 * (size + gap);
    const g = el('g', {}, svg);
    el('rect', { x, y, width: size, height: size, class: 'st-carbon', fill: 'none' }, g);
    el('line', { x1: x + 4, y1: y + size - 4.5, x2: x + size - 4, y2: y + size - 4.5, class: 'st-graphite' }, g);
    cells.push(g);
  }
  if (reduced) { counter.textContent = '31'; return; }
  cells.forEach((c) => { c.style.opacity = '0'; });
  new IntersectionObserver((es, io) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(host);
      cells.forEach((c, i) => setTimeout(() => { c.style.transition = 'opacity 160ms ease'; c.style.opacity = '1'; counter.textContent = String(i + 1); }, 120 + i * 55));
    });
  }, { threshold: 0.4 }).observe(host);
}

/* ------------------------------------------------------- ptt + githelp --- */
function initPtt(host) {
  const w = 520, h = 96, y = 54;
  const svg = svgRoot(host, w, h);
  el('rect', { x: 4, y: 18, width: w - 8, height: 62, class: 'st-carbon', fill: 'none' }, svg);
  el('text', { x: 12, y: 34, class: 'annf' }, svg).textContent = 'OFFLINE BOUNDARY · NOTHING LEAVES THE MACHINE';
  const stages = [['MIC', 26, 58], ['SILERO VAD', 44, 168], ['WHISPER · CPU ONLY', 66, 316], ['CLIPBOARD', 42, 462]];
  stages.forEach(([label, hw, x], i) => {
    el('rect', { x: x - hw, y: y - 11, width: hw * 2, height: 22, class: 'st-carbon stage', fill: 'none' }, svg);
    el('text', { x, y: y + 3.5, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = label;
    if (i) el('line', { x1: stages[i - 1][2] + stages[i - 1][1], y1: y, x2: x - hw, y2: y, class: 'st-carbon-thin pulse-path' }, svg);
  });
  onEnter(host, prepDraw(svg, { stagger: 25, dur: 420 }));
}
function initGithelp(host) {
  const w = 520, h = 84, y = 40;
  const svg = svgRoot(host, w, h);
  const stages = [['SCOUT', 56], ['RANK', 148], ['READ', 240], ['DRAFT', 332]];
  stages.forEach(([label, x], i) => {
    el('rect', { x: x - 36, y: y - 11, width: 72, height: 22, class: 'st-carbon', fill: 'none' }, svg);
    el('text', { x, y: y + 3.5, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = label;
    if (i) el('line', { x1: stages[i - 1][1] + 36, y1: y, x2: x - 36, y2: y, class: 'st-carbon-thin' }, svg);
  });
  const sx = 412;
  el('line', { x1: 368, y1: y, x2: sx - 12, y2: y, class: 'st-carbon-thin' }, svg);
  el('circle', { cx: sx - 9, cy: y, r: 1.8, class: 'nd-solid' }, svg);
  const arm = el('line', { x1: sx - 9, y1: y, x2: sx + 7, y2: y - 11, class: 'st-human', 'stroke-width': 1.4 }, svg);
  el('circle', { cx: sx + 9, cy: y, r: 1.8, class: 'nd-solid' }, svg);
  el('text', { x: sx, y: y + 19, class: 'annf ann-human', 'text-anchor': 'middle' }, svg).textContent = 'EXPLICIT HUMAN GO';
  el('line', { x1: sx + 9, y1: y, x2: w - 78, y2: y, class: 'st-carbon-thin' }, svg);
  const post = el('rect', { x: w - 76, y: y - 11, width: 62, height: 22, class: 'st-carbon', fill: 'none' }, svg);
  el('text', { x: w - 45, y: y + 3.5, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = 'POST';
  onEnter(host, prepDraw(svg, { stagger: 20, dur: 420 }));
}

/* ----------------------------------------------------------- pixelswarm -- */
function initPixelswarm(host) {
  const w = 240, h = 150;
  const svg = svgRoot(host, w, h, true);
  const proj = axonometric({ alpha: 26, beta: 26, s: 1.15, cx: w * 0.5, cy: h * 0.52 });
  const B = 44, T = 30, D = 26;
  const corners = [
    v3(-B, -T, -D), v3(B, -T, -D), v3(B, T, -D), v3(-B, T, -D),
    v3(-B, -T, D), v3(B, -T, D), v3(B, T, D), v3(-B, T, D),
  ].map((p) => proj.project(p));
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (const [a, b] of edges) {
    el('line', { x1: fmt(corners[a].x), y1: fmt(corners[a].y), x2: fmt(corners[b].x), y2: fmt(corners[b].y), class: 'st-graphite', 'stroke-dasharray': PHANTOM, 'data-conv': 'phantom', 'data-nodraw': 1 }, svg);
  }
  const rand = rng(777001);
  const swarm = [];
  for (let i = 0; i < 26; i++) {
    const p = proj.project(v3((rand() - 0.5) * 70, (rand() - 0.5) * 44, (rand() - 0.5) * 40));
    swarm.push(el('circle', { cx: fmt(p.x), cy: fmt(p.y), r: 1, class: 'nd-graphite', 'data-nodraw': 1 }, svg));
  }
  if (!reduced) {
    // the swarm drifts: tiny deterministic orbits, phantom-quiet
    let t0 = null, visible = false;
    const centers = swarm.map((c, i) => ({ x: Number(c.getAttribute('cx')), y: Number(c.getAttribute('cy')), ph: i * 2.399 }));
    const step = (t) => {
      if (!t0) t0 = t;
      const k = (t - t0) / 1000;
      swarm.forEach((c, i) => {
        c.setAttribute('cx', fmt(centers[i].x + Math.sin(k * 0.8 + centers[i].ph) * 3));
        c.setAttribute('cy', fmt(centers[i].y + Math.cos(k * 0.6 + centers[i].ph) * 2));
      });
      if (visible) requestAnimationFrame(step);
    };
    new IntersectionObserver((es) => {
      es.forEach((e) => { const was = visible; visible = e.isIntersecting; if (visible && !was) requestAnimationFrame(step); });
    }, { threshold: 0.2 }).observe(host);
  }
}

/* ------------------------------------------------------- merge gate ------ */
/* The review queue as a perpetual machine. Changes descend the claude/*
   branch, pause at the one red gate, and a decision happens: approved work
   arcs onto main and rides it down; declined work falls away dashed. The
   line law is the whole drawing: solid = shipped, dashed = killed,
   vermilion = a human decided. Decisions come from a seeded sequence, so
   the machine is deterministic like every other figure in the set. */
function initMergeGate(host) {
  const w = 240, h = 380, bx = 70, mx = 170, gy = 218;
  const mergeY = gy + 52;
  const svg = svgRoot(host, w, h, true);
  // rails: branch is graphite construction; below the gate it is the
  // discard path and goes dashed. main is carbon and runs the full sheet.
  el('line', { x1: mx, y1: 14, x2: mx, y2: h - 24, class: 'st-carbon', 'data-conv': 'solid' }, svg);
  el('line', { x1: bx, y1: 14, x2: bx, y2: gy - 10, class: 'st-graphite' }, svg);
  el('line', { x1: bx, y1: gy + 10, x2: bx, y2: h - 52, class: 'st-graphite', 'stroke-dasharray': DASHED, 'data-conv': 'dashed' }, svg);
  el('path', { d: `M${bx} ${fmt(gy + 4)} C ${bx} ${fmt(gy + 40)}, ${mx} ${fmt(gy + 12)}, ${mx} ${fmt(mergeY)}`, class: 'st-faint', fill: 'none' }, svg);
  el('text', { x: bx, y: 8, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = 'claude/*';
  el('text', { x: mx, y: 8, class: 'annf', 'text-anchor': 'middle' }, svg).textContent = 'main';
  // the gate: two posts astride the branch, a beam that closes to decide
  el('line', { x1: bx - 14, y1: gy - 8, x2: bx - 14, y2: gy + 8, class: 'st-human', 'stroke-width': 1.3 }, svg);
  el('line', { x1: bx + 14, y1: gy - 8, x2: bx + 14, y2: gy + 8, class: 'st-human', 'stroke-width': 1.3 }, svg);
  const beam = el('line', { x1: bx - 14, y1: gy, x2: bx + 14, y2: gy, class: 'st-human', 'stroke-width': 1.4 }, svg);
  el('text', { x: bx - 22, y: gy + 3.5, class: 'annf ann-human', 'text-anchor': 'end' }, svg).textContent = 'HUMAN GATE';
  const pulse = el('circle', { cx: mx, cy: mergeY, r: 3, class: 'st-key', fill: 'none' }, svg);
  pulse.style.opacity = '0';
  const mergedTxt = el('text', { x: mx, y: h - 8, class: 'annf', 'text-anchor': 'middle' }, svg);
  const declinedTxt = el('text', { x: bx, y: h - 36, class: 'annf dim', 'text-anchor': 'middle' }, svg);

  if (reduced) {
    beam.style.opacity = '1';
    el('rect', { x: bx - 8, y: gy - 16, width: 16, height: 10, class: 'nd' }, svg);
    el('rect', { x: mx - 8, y: mergeY + 18, width: 16, height: 10, class: 'nd' }, svg);
    const dashed = el('rect', { x: bx - 8, y: gy + 44, width: 16, height: 10, class: 'nd', 'stroke-dasharray': '3,2' }, svg);
    dashed.style.opacity = '0.5';
    mergedTxt.textContent = 'MERGED · SOLID';
    declinedTxt.textContent = 'DECLINED · DASHED';
    return;
  }

  // seeded decision sequence: deterministic, roughly one decline in four
  const rand = rng(20260718);
  const verdicts = [...Array(64)].map(() => rand() < 0.26);
  let spawned = 0, merged = 0, declined = 0, pulseAge = 1;
  mergedTxt.textContent = 'MERGED 00';
  declinedTxt.textContent = 'DECLINED 00';
  const pad = (n) => String(Math.min(n, 99)).padStart(2, '0');
  const ease = (k) => k * k * (3 - 2 * k);
  // one lifecycle: descend 0..1.35s, held at the gate to 2.05s, exit to 3.0s
  const DESCEND = 1.35, HOLD = 2.05, DONE = 3.0, SPAWN_EVERY = 2.2;
  const pool = [...Array(3)].map(() => {
    const r = el('rect', { width: 16, height: 10, rx: 1, class: 'nd' }, svg);
    r.style.opacity = '0';
    return { r, age: -1, declinedRun: false };
  });
  let sinceSpawn = SPAWN_EVERY; // spawn immediately on first visible frame
  const place = (p) => {
    const { r, age } = p;
    if (age < 0) { r.style.opacity = '0'; return; }
    let x = bx, y, op = 1;
    if (age <= DESCEND) {
      y = -6 + ease(age / DESCEND) * (gy - 16 - -6);
    } else if (age <= HOLD) {
      y = gy - 16;
    } else {
      const k = ease(Math.min((age - HOLD) / (DONE - HOLD), 1));
      if (p.declinedRun) {
        y = gy - 16 + k * 120;
        op = 1 - Math.max(0, (k - 0.55) / 0.45);
      } else if (k < 0.55) {
        const t = k / 0.55; // along the merge curve, bezier in x and y
        const u = 1 - t;
        x = u * u * u * bx + 3 * u * u * t * bx + 3 * u * t * t * mx + t * t * t * mx;
        y = u * u * u * (gy + 4) + 3 * u * u * t * (gy + 40) + 3 * u * t * t * (gy + 12) + t * t * t * mergeY - 5;
      } else {
        x = mx;
        const t = (k - 0.55) / 0.45;
        y = mergeY - 5 + t * 92;
        op = 1 - Math.max(0, (t - 0.6) / 0.4);
      }
    }
    r.setAttribute('x', fmt(x - 8));
    r.setAttribute('y', fmt(y));
    r.style.opacity = fmt(op);
  };
  let raf = null, last = null, visible = false;
  const tick = (t) => {
    raf = null;
    if (!visible) { last = null; return; }
    const dt = last == null ? 0 : Math.min((t - last) / 1000, 0.05);
    last = t;
    sinceSpawn += dt;
    if (sinceSpawn >= SPAWN_EVERY) {
      const free = pool.find((p) => p.age < 0);
      if (free) {
        sinceSpawn = 0;
        free.age = 0;
        free.declinedRun = verdicts[spawned % verdicts.length];
        free.r.setAttribute('stroke-dasharray', '');
        spawned++;
      }
    }
    let holding = false;
    for (const p of pool) {
      if (p.age < 0) continue;
      p.age += dt;
      if (p.age > DESCEND && p.age <= HOLD) holding = true;
      // the verdict lands the moment the beam lifts: killed work goes dashed
      if (p.declinedRun && p.age > HOLD && !p.r.getAttribute('stroke-dasharray')) p.r.setAttribute('stroke-dasharray', '3,2');
      if (p.age >= DONE) {
        if (p.declinedRun) { declined++; declinedTxt.textContent = `DECLINED ${pad(declined)}`; }
        else { merged++; mergedTxt.textContent = `MERGED ${pad(merged)}`; pulseAge = 0; }
        p.age = -1;
      }
      place(p);
    }
    beam.style.opacity = fmt(Math.max(0, Math.min(1, holding ? beam._o = (beam._o ?? 0) + dt * 6 : beam._o = (beam._o ?? 0) - dt * 6)));
    if (pulseAge < 1) {
      pulseAge = Math.min(pulseAge + dt * 1.6, 1);
      pulse.setAttribute('r', fmt(3 + pulseAge * 9));
      pulse.style.opacity = fmt(0.7 * (1 - pulseAge));
    }
    raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver((es) => {
    es.forEach((e) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
  }, { threshold: 0.25 }).observe(host);
}

/* ------------------------------------------------------- shared helpers -- */
function onEnter(host, fn, threshold = 0.35) {
  new IntersectionObserver((es, io) => {
    es.forEach((e) => { if (e.isIntersecting) { io.unobserve(host); fn(); } });
  }, { threshold }).observe(host);
}
function initCounters() {
  document.querySelectorAll('[data-count]').forEach((n) => {
    const target = Number(n.dataset.count);
    const fmtN = (x) => x.toLocaleString('en-US');
    if (reduced) { n.textContent = fmtN(target); return; }
    n.textContent = '0';
    onEnter(n, () => {
      const t0 = performance.now(), dur = 900;
      const step = (t) => {
        const k = Math.min((t - t0) / dur, 1);
        n.textContent = fmtN(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 0.6);
  });
}

/* -------------------------------------------------- furniture: title bar - */
function initFurniture() {
  const sheetCell = document.getElementById('tb-sheet');
  const zoneCell = document.getElementById('tb-zone');
  const sheets = [...document.querySelectorAll('[data-sheet]')];
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) sheetCell.textContent = e.target.dataset.sheet; });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sheets.forEach((s) => io.observe(s));
  if (!zoneCell || matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('pointermove', (e) => {
    const s = sheets.find((sh) => { const r = sh.getBoundingClientRect(); return e.clientY >= r.top && e.clientY <= r.bottom; });
    if (!s) { zoneCell.textContent = ''; return; }
    const r = s.getBoundingClientRect();
    const row = 'ABCDEF'[Math.min(5, Math.floor(((e.clientY - r.top) / r.height) * 6))];
    const col = 1 + Math.min(3, Math.floor(((e.clientX - r.left) / r.width) * 4));
    zoneCell.textContent = `ZONE ${row}${col}`;
  });
}

/* ----------------------------------------------- legend: live line law --- */
function initLegend() {
  const page = document.getElementById('aw');
  document.querySelectorAll('[data-legend]').forEach((row) => {
    const conv = row.dataset.legend;
    const on = () => { page.dataset.hl = conv; };
    const off = () => { delete page.dataset.hl; };
    row.addEventListener('pointerenter', on);
    row.addEventListener('pointerleave', off);
    row.addEventListener('focus', on);
    row.addEventListener('blur', off);
  });
}

/* ------------------------------------------------------------------ boot - */
export function boot() {
  const $ = (id) => document.getElementById(id);
  // debug bisect: /about/?only=a,b or ?skip=a,b (dev aid, harmless in prod)
  const q = new URLSearchParams(location.search);
  const only = q.get('only')?.split(',');
  const skip = q.get('skip')?.split(',') ?? [];
  const gate = (name, fn) => { if ((only && !only.includes(name)) || skip.includes(name)) return; fn(); };
  gate('hero', () => initChandelier($('fig-hero'), { hero: true }));
  gate('chand', () => initChandelier($('fig-chandelier'), { hero: false }));
  gate('disc', () => initDisc($('fig-disc')));
  const gateReadout = $('gate-readout');
  gate('corridor', () => { initCorridor($('fig-corridor'), {
    progress(nGate) { gateReadout.textContent = `GATES CLOSED ${String(nGate).padStart(2, '0')} / 10`; },
  }); });
  gate('ledger', () => initLedger($('fig-ledger')));
  gate('strata', () => initStrata($('fig-strata')));
  gate('conf', () => initConfluence($('fig-confluence'), $('sec-a300')));
  gate('tally', () => initTally($('fig-tally')));
  gate('seals', () => initSeals($('fig-seals')));
  gate('daybar', () => initDayBar($('fig-daybar')));
  gate('rings', () => initRings($('fig-rings')));
  gate('stemma', () => initStemma($('fig-stemma')));
  gate('skills', () => initSkillGrid($('fig-skills'), $('skill-count')));
  gate('ptt', () => initPtt($('fig-ptt')));
  gate('githelp', () => initGithelp($('fig-githelp')));
  gate('pixel', () => initPixelswarm($('fig-pixelswarm')));
  gate('mergegate', () => initMergeGate($('fig-mergegate')));
  gate('counters', () => initCounters());
  gate('furniture', () => initFurniture());
  gate('legend', () => initLegend());
}
