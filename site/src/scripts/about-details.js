/* Approved Works · sheet A-600 detail figures and the A-1000 engineering loop.
   Each figure draws into a host element by id; a missing host is skipped.
   Same contract as about-plates.js: geometry is computed here and emitted as
   SVG, every figure is a function of elapsed time, and the line law holds:
     solid = shipped or allowed · dashed = killed, blocked or removed ·
     phantom = unreleased · vermilion = a human decided. */

import {
  el, svgRoot, prepDraw, onEnter, rng, axonometric, v3, fmt, pathFrom, smoothPathFrom, lerp, DASHED, reduced,
} from './about-plates.js';

/* ------------------------------------------------------------- utilities - */
const RAD = Math.PI / 180;
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (k) => { const c = clamp(k); return c * c * (3 - 2 * c); };
const ramp = (t, a, b) => ease((t - a) / (b - a));
const LIVE = { 'data-nodraw': 1 };
// dev aid, like ?only= in about-plates.js: /about/?figt=4.7 holds every figure at that second
const FREEZE = new URLSearchParams(location.search).get('figt');

function tx(parent, x, y, str, cls = 'annf', anchor) {
  const t = el('text', { x: fmt(x), y: fmt(y), class: cls }, parent);
  if (anchor) t.setAttribute('text-anchor', anchor);
  t.textContent = str;
  return t;
}
const ln = (parent, x1, y1, x2, y2, cls = 'st-carbon-thin', extra = {}) =>
  el('line', { x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2), class: cls, ...extra }, parent);
// Cached writes: a frame only touches the attributes that actually changed.
function put(n, k, v) {
  const c = n._c || (n._c = {});
  if (c[k] !== v) { c[k] = v; n.setAttribute(k, v); }
}
function fade(n, v) {
  const s = fmt(clamp(v));
  if (n._o !== s) { n._o = s; n.style.opacity = s; }
}
const noDraw = (g) => g.querySelectorAll('path, line, circle, rect').forEach((n) => { n.dataset.nodraw = 1; });

// 45 degree hatching inside a rect. Endpoints are computed, so no clip is needed.
function hatchRect(parent, x, y, wd, ht, gap, cls, extra = {}) {
  for (let c = x + y + gap; c < x + wd + y + ht - 0.01; c += gap) {
    const xa = Math.max(x, c - (y + ht)), xb = Math.min(x + wd, c - y);
    ln(parent, xa, c - xa, xb, c - xb, cls, extra);
  }
}
// Horizontal dimension: extension lines, dimension line, 45 degree tick
// terminators, text above the line. `wavy` swaps the ticks for a tilde, the
// way an estimate is printed differently from a measurement.
function dimH(parent, xa, xb, y, from, str, { cls = 'st-carbon-thin', tcls = 'annf', wavy = false, ext = [1, 1], ty = y - 3.5 } = {}) {
  const dir = Math.sign(y - from) || 1;
  [xa, xb].forEach((x, i) => { if (ext[i]) ln(parent, x, from + dir * 2, x, y + dir * 3, cls); });
  ln(parent, xa, y, xb, y, cls);
  for (const x of [xa, xb]) {
    if (wavy) el('path', { d: `M${fmt(x - 3)} ${fmt(y)}q1.5 -3 3 0t3 0`, class: cls }, parent);
    else ln(parent, x - 2.4, y + 2.4, x + 2.4, y - 2.4, 'st-carbon');
  }
  return tx(parent, (xa + xb) / 2, ty, str, tcls, 'middle');
}
// Polyline with arc-length lookup, for marks that travel along a drawn route.
function route(pts) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[cum.length - 1];
  return {
    total,
    at(k) {
      const d = clamp(k) * total;
      let i = 1;
      while (i < cum.length - 1 && cum[i] < d) i++;
      const s = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
      return { x: lerp(pts[i - 1].x, pts[i].x, s), y: lerp(pts[i - 1].y, pts[i].y, s) };
    },
  };
}
const cubic = (p0, c1, c2, p1, n = 20) => [...Array(n + 1)].map((_, i) => {
  const t = i / n, u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
  };
});
const pt = (x, y) => ({ x, y });

/* Shared life cycle. frame(t, dt) is called once to lay the figure out, the
   static linework then draws in on first view, and the loop runs on elapsed
   visible time only. `live` groups hold the moving marks: they skip the
   stroke draw-in and fade up behind it. Reduced motion gets one posed frame. */
function animate(host, svg, frame, { pose = 0, live = [], stagger = 8, dur = 560 } = {}) {
  if (reduced || FREEZE != null) { frame(FREEZE != null ? Number(FREEZE) || 0 : pose, 0); return; }
  frame(0, 0);
  for (const g of live) g.style.opacity = '0';
  const play = prepDraw(svg, { stagger, dur });
  onEnter(host, () => {
    play();
    for (const g of live) { g.style.transition = 'opacity 800ms ease 420ms'; g.style.opacity = '1'; }
  }, 0.2);
  let raf = null, last = null, t = 0, visible = false;
  const tick = (now) => {
    raf = null;
    if (!visible) { last = null; return; }
    const dt = last == null ? 0 : Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;
    frame(t, dt);
    raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver((es) => {
    es.forEach((e) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
  }, { threshold: 0.2 }).observe(host);
}

/* ---------------------------------------------- A-601 · Latter Design ---- */
/* Exploded axonometric: three layer planes on one centre line, each carrying
   its own moving pattern, and the composite plane below where the same three
   patterns superimpose. The composite re-uses the layer geometry, so what it
   shows is literally the layers added together. */
function initLatter(host) {
  const w = 360, h = 236, cx = 160, X = 54, Z = 38;
  const svg = svgRoot(host, w, h);
  const ax = axonometric({ alpha: 22, beta: 22, s: 1, cx, cy: 0 });
  const P = (u, v) => ax.project(v3(u, 0, v));
  const ys = [42, 86, 130], yc = 190;
  const plane = pathFrom([P(-X, -Z), P(X, -Z), P(X, Z), P(-X, Z)], true);
  const defs = el('defs', {}, svg);
  el('path', { d: plane }, el('clipPath', { id: 'ld-clip' }, defs));
  ln(svg, cx, 3, cx, h - 3, 'st-center', LIVE);
  // explode lines: each corner of the top layer projected down onto the composite
  for (const c of [P(-X, Z), P(X, -Z), P(X, Z)]) ln(svg, c.x, ys[0] + c.y, c.x, yc + c.y, 'st-faint');

  const live = [];
  const centreMark = (g) => {
    const a = P(-5, 0), b = P(5, 0), c = P(0, -5), d = P(0, 5);
    ln(g, a.x, a.y, b.x, b.y, 'st-carbon-thin');
    ln(g, c.x, c.y, d.x, d.y, 'st-carbon-thin');
  };
  // composite first: it is the lowest plane, so the layers overlap it
  const comp = el('g', { transform: `translate(0 ${yc})` }, svg);
  el('path', { d: plane, class: 'nd', 'fill-opacity': 0.9, style: 'stroke-width:1.35' }, comp);
  const compPat = el('g', { 'clip-path': 'url(#ld-clip)', class: 'st-key-thin' }, comp);
  for (let i = 0; i < 3; i++) el('use', { href: `#ld-pat-${i}` }, compPat);
  live.push(compPat);

  const blank = (n, parent) => [...Array(n)].map(() => el('path', { fill: 'none', ...LIVE }, parent));
  let waves, stripes, rings;
  for (let i = 2; i >= 0; i--) {
    const g = el('g', { transform: `translate(0 ${ys[i]})` }, svg);
    el('path', { d: plane, class: 'nd', 'fill-opacity': 0.84 }, g);
    const clip = el('g', { 'clip-path': 'url(#ld-clip)', class: 'st-carbon-thin' }, g);
    live.push(clip);
    const pat = el('g', { id: `ld-pat-${i}` }, clip);
    if (i === 0) waves = blank(5, pat);
    if (i === 1) stripes = blank(9, pat);
    if (i === 2) rings = blank(3, pat);
    centreMark(g);
  }
  centreMark(comp);

  // layer labels off the right corner, composite off the left, exports fanned
  const rc = P(X, -Z), lc = P(-X, Z);
  ys.forEach((y, i) => {
    ln(svg, rc.x + 3, y + rc.y, rc.x + 13, y + rc.y);
    tx(svg, rc.x + 17, y + rc.y + 3, `LAYER ${i + 1}`);
  });
  ln(svg, lc.x - 3, yc + lc.y, lc.x - 12, yc + lc.y, 'st-carbon');
  tx(svg, lc.x - 15, yc + lc.y + 3, 'COMPOSITE', 'annf ann-key', 'end');
  [['PNG', -17], ['VIDEO', 0], ['HTML', 17]].forEach(([name, dy]) => {
    const ox = rc.x + 3, oy = yc + rc.y, ex = rc.x + 27 - Math.abs(dy) * 0.2, ey = oy + dy;
    ln(svg, ox, oy, ex, ey);
    el('circle', { cx: fmt(ex), cy: fmt(ey), r: 1.3, class: 'nd-solid' }, svg);
    tx(svg, ex + 5, ey + 3, name);
  });

  // the three patterns travel down the centre line to the composite
  const dropG = el('g', {}, svg);
  live.push(dropG);
  const drops = [...Array(3)].map(() => el('circle', { cx, r: 1.5, class: 'nd-solid', ...LIVE }, dropG));

  const frame = (t) => {
    waves.forEach((p, j) => {
      const v0 = -27 + j * 13.5, pts = [];
      for (let u = -X - 4; u <= X + 4.01; u += 8) pts.push(P(u, v0 + 4.2 * Math.sin(u * 0.085 + t * 1.15 + j * 0.8)));
      p.setAttribute('d', smoothPathFrom(pts));
    });
    const span = 2 * X + 18;
    stripes.forEach((p, j) => {
      const c = ((j * span / stripes.length + t * 7) % span) - X - 9;
      const a = P(c - 9, -Z - 2), m = P(c + 7 * Math.sin(t * 0.7 + j * 0.9), 0), b = P(c + 9, Z + 2);
      p.setAttribute('d', `M${fmt(a.x)} ${fmt(a.y)}Q${fmt(m.x)} ${fmt(m.y)} ${fmt(b.x)} ${fmt(b.y)}`);
    });
    const u0 = 7 * Math.sin(t * 0.31), v0 = 5 * Math.cos(t * 0.27);
    rings.forEach((p, j) => {
      const r = 8 + j * 10, pts = [];
      for (let k = 0; k < 30; k++) {
        const th = (k / 30) * TAU;
        const rr = r * (1 + 0.2 * Math.sin(3 * th + t * 0.6 + j * 1.1) + 0.12 * Math.sin(2 * th - t * 0.45));
        pts.push(P(u0 + rr * Math.cos(th) * 1.2, v0 + rr * Math.sin(th) * 0.85));
      }
      p.setAttribute('d', pathFrom(pts, true));
    });
    drops.forEach((d, k) => {
      const ph = (t * 0.2 + k / 3) % 1;
      d.setAttribute('cy', fmt(lerp(ys[0], yc, ph)));
      fade(d, Math.sin(Math.PI * ph) * 0.9);
    });
  };
  animate(host, svg, frame, { pose: 3, live, stagger: 14 });
}

/* ------------------------------------------- A-602 · CoreWise Academy ---- */
/* A star chart read from the catalogue: one constellation per track, exactly
   one star per guide, joined as a minimum spanning tree so no line is longer
   than it has to be. The largest track takes the middle of the sheet. */
function initAcademy(host) {
  let tracks = [];
  try { tracks = JSON.parse(host.dataset.fig || '[]'); } catch { tracks = []; }
  tracks = tracks.filter((t) => t && t.name).map((t) => ({ name: String(t.name), count: Math.max(0, Math.round(Number(t.count) || 0)) })).slice(0, 5);
  if (!tracks.length) return;
  const w = 360, h = 236, F = { x: 4, y: 6, w: 352, h: 224 };
  const svg = svgRoot(host, w, h);
  const defs = el('defs', {}, svg);
  el('rect', { x: F.x, y: F.y, width: F.w, height: F.h }, el('clipPath', { id: 'ac-clip' }, defs));

  // graticule: declination arcs and meridians of a chart whose pole sits far below the sheet
  const pole = { x: 180, y: 700 };
  const grat = el('g', { 'clip-path': 'url(#ac-clip)' }, svg);
  for (const top of [34, 78, 122, 166, 210]) {
    const r = pole.y - top, dy = Math.sqrt(r * r - 176 * 176);
    el('path', { d: `M4 ${fmt(pole.y - dy)}A${r} ${r} 0 0 1 356 ${fmt(pole.y - dy)}`, class: 'st-faint' }, grat);
  }
  for (let k = -3; k <= 3; k++) {
    const a = k * 4.5 * RAD;
    const xa = pole.x + Math.tan(a) * (pole.y - F.y), xb = pole.x + Math.tan(a) * (pole.y - F.y - F.h);
    ln(grat, xa, F.y, xb, F.y + F.h, 'st-faint');
    ln(svg, xa, F.y, xa, F.y - 3.5, 'st-carbon-thin');
    ln(svg, xb, F.y + F.h, xb, F.y + F.h + 3.5, 'st-carbon-thin');
  }
  el('rect', { x: F.x, y: F.y, width: F.w, height: F.h, class: 'st-carbon-thin' }, svg);

  // the largest track takes the centre; the rest take the corners in order
  const big = tracks.reduce((m, t, i) => (t.count > tracks[m].count ? i : m), 0);
  const corners = [[60, 46], [300, 46], [60, 168], [300, 168]];
  let ci = 0;
  const slots = tracks.map((_, i) => (i === big
    ? { x: 180, y: 102, rx: 60, ry: 44 }
    : { x: corners[ci][0], y: corners[ci++][1], rx: 40, ry: 23 }));

  const lineG = el('g', {}, svg);
  const starG = el('g', {}, svg);
  const stars = [], leads = [];
  tracks.forEach((trk, i) => {
    const s = slots[i], n = trk.count;
    const rand = rng(602001 + i * 7919 + trk.name.length * 131);
    const pts = [];
    let d = Math.min(15, 0.62 * Math.sqrt((Math.PI * s.rx * s.ry) / Math.max(n, 1))), tries = 0;
    while (pts.length < n) {
      const a = rand() * TAU, r = Math.sqrt(rand());
      const p = { x: s.x + Math.cos(a) * r * s.rx, y: s.y + Math.sin(a) * r * s.ry, m: rand() };
      if (pts.every((q) => Math.hypot(q.x - p.x, q.y - p.y) >= d)) { pts.push(p); tries = 0; }
      else if (++tries > 240) { d *= 0.9; tries = 0; }
    }
    // minimum spanning tree (Prim): n stars, n - 1 joins
    const inTree = pts.map(() => false);
    if (n) inTree[0] = true;
    for (let e = 1; e < n; e++) {
      let best = null;
      for (let a = 0; a < n; a++) {
        if (!inTree[a]) continue;
        for (let b = 0; b < n; b++) {
          if (inTree[b]) continue;
          const dist = Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y);
          if (!best || dist < best.dist) best = { a, b, dist };
        }
      }
      inTree[best.b] = true;
      ln(lineG, pts[best.a].x, pts[best.a].y, pts[best.b].x, pts[best.b].y, 'st-key-thin', { 'data-conv': 'solid' });
    }
    let lead = null;
    pts.forEach((p) => {
      const r = 1.1 + 1.6 * p.m * p.m;
      const c = el('circle', { cx: fmt(p.x), cy: fmt(p.y), r: fmt(r), class: 'nd-solid', ...LIVE }, starG);
      if (!lead || r > lead.r) lead = { x: p.x, y: p.y, r, c };
      stars.push({ c, w: 0.45 + rand() * 0.75, ph: rand() * TAU });
    });
    if (lead) {
      // the lead star of each constellation carries a four-point glint
      lead.r = Math.max(lead.r, 2.5);
      lead.c.setAttribute('r', fmt(lead.r));
      const q = lead.r + 1.8, e = lead.r + 5.2;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ln(lineG, lead.x + dx * q, lead.y + dy * q, lead.x + dx * e, lead.y + dy * e, 'st-key-thin');
      leads.push(lead);
    }
    tx(svg, s.x, s.y + s.ry + 14, `${trk.name.toUpperCase()} · ${n}`, 'annf ann-key', 'middle');
  });
  const total = tracks.reduce((sum, t) => sum + t.count, 0);
  tx(svg, 180, F.y + F.h - 6, `${total} GUIDES · ${tracks.length} CONSTELLATIONS`, 'annf', 'middle');

  const ping = el('circle', { r: 4, class: 'st-key-thin', ...LIVE }, starG);
  const frame = (t) => {
    for (const s of stars) fade(s.c, 0.5 + 0.5 * (0.5 + 0.5 * Math.sin(t * s.w + s.ph)));
    if (!leads.length) { fade(ping, 0); return; }
    // a survey ring visits each lead star in turn
    const k = (t / 2.6) % leads.length, i = Math.floor(k), f = k - i;
    put(ping, 'cx', fmt(leads[i].x));
    put(ping, 'cy', fmt(leads[i].y));
    ping.setAttribute('r', fmt(leads[i].r + 2 + ease(f) * 8));
    fade(ping, 0.75 * (1 - ease(f)) * ramp(f, 0, 0.08));
  };
  animate(host, svg, frame, { pose: 1.1, live: [starG], stagger: 5 });
}

/* -------------------------------------------- A-604 · savetokens.tips ---- */
/* A dimensioned before and after. The top strip is the mechanism: lines of
   command output pass a filter and 29 in every 64 (45.3%) drop away dashed.
   The section below is the measurement. The last row is an estimate, so it is
   drawn in graphite with tilde terminators instead of ticks. */
function initSaveTokens(host) {
  const w = 360, h = 236, x0 = 14, L = 332, x1 = x0 + L, CUT = 0.453;
  const xk = x0 + L * (1 - CUT), xf = 150;
  const svg = svgRoot(host, w, h);

  // the filter: a narrow hatched slot the stream runs through
  hatchRect(svg, xf - 4, 14, 8, 40, 4, 'st-carbon-thin');
  ln(svg, xf - 4, 14, xf - 4, 54, 'st-carbon');
  ln(svg, xf + 4, 14, xf + 4, 54, 'st-carbon');
  tx(svg, xf, 9, 'FILTER', 'annf', 'middle');
  const stream = el('g', {}, svg);
  const rowY = [22, 30, 38, 46], SLOTS = 14, SP = 24, V = 30, XS = x0 - 6;
  const marks = rowY.map(() => [...Array(SLOTS)].map(() => el('line', { class: 'st-carbon', ...LIVE }, stream)));
  // 64 marks to a cycle, exactly 29 of them removed: 29 / 64 = 45.3%
  const rand = rng(45300);
  const removed = [...Array(64)].map((_, i) => i < 29);
  for (let i = 63; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [removed[i], removed[j]] = [removed[j], removed[i]]; }
  const lens = [...Array(64)].map(() => 8 + rand() * 10);

  // before: the whole output
  tx(svg, x0, 74, 'COMMAND OUTPUT');
  el('rect', { x: x0, y: 78, width: L, height: 11, class: 'nd', 'data-conv': 'solid' }, svg);
  // projection lines carry the cut down from the full bar
  for (const x of [x0, xk, x1]) ln(svg, x, 91, x, 98, 'st-faint');
  // after: 54.7% kept solid, 45.3% removed, hatched and dashed
  hatchRect(svg, xk, 100, x1 - xk, 11, 4.5, 'st-graphite', { 'data-conv': 'dashed' });
  el('rect', { x: fmt(xk), y: 100, width: fmt(x1 - xk), height: 11, class: 'st-carbon', 'stroke-dasharray': DASHED, 'data-conv': 'dashed' }, svg);
  el('rect', { x: x0, y: 100, width: fmt(xk - x0), height: 11, class: 'nd', 'data-conv': 'solid' }, svg);
  dimH(svg, x0, xk, 128, 111, '54.7% KEPT', { tcls: 'annf ann-key' });
  dimH(svg, xk, x1, 128, 111, '45.3% REMOVED · MEASURED', { tcls: 'annf ann-key', ext: [0, 1] });

  // estimate row: graphite, torn edge, tilde terminators
  const xm = x0 + L / 2, ey = 170;
  el('rect', { x: x0, y: ey, width: L, height: 10, class: 'st-faint' }, svg);
  el('path', { d: `M${xm} ${ey}H${x0}V${ey + 10}H${xm}q3 -2.5 0 -5t0 -5`, class: 'st-graphite' }, svg);
  const est = dimH(svg, xm, x1, ey + 25, ey + 10, '~50% SHORTER REPLIES · ESTIMATE', { cls: 'st-graphite', tcls: 'annf', wavy: true, ty: ey + 39 });
  est.setAttribute('x', x1);
  est.setAttribute('text-anchor', 'end');

  const frame = (t) => {
    const s = t * V + 400, base = Math.floor(s / SP), off = s - base * SP;
    for (let r = 0; r < rowY.length; r++) {
      for (let j = 0; j < SLOTS; j++) {
        const n = base - j, idx = (((n * 4 + r) % 64) + 64) % 64;
        const m = marks[r][j], len = lens[idx];
        const x = XS + off + j * SP + r * 6;
        let y = rowY[r], o = ramp(x, XS, XS + 16);
        const gone = removed[idx] && x + len / 2 > xf;
        if (gone) {
          const k = clamp((x + len / 2 - xf) / 58);
          y += ease(k) * 19;
          o *= 1 - k * k * k;
        } else {
          o *= 1 - ramp(x + len, x1 - 30, x1);
        }
        m.setAttribute('x1', fmt(x));
        m.setAttribute('x2', fmt(x + len));
        m.setAttribute('y1', fmt(y));
        m.setAttribute('y2', fmt(y));
        put(m, 'stroke-dasharray', gone ? '2.4,1.8' : 'none');
        fade(m, o);
      }
    }
  };
  animate(host, svg, frame, { pose: 2, live: [stream], stagger: 6 });
}

/* ------------------------------------------- A-605 · Harness Firmware ---- */
/* The loop as a closed circuit: a ring seen in dimetric projection, six
   stations, one task travelling round. It waits at VERIFY while the checks
   run, and at REVIEWED CHANGE it waits for the one vermilion gate. */
function initHarness(host) {
  const w = 360, h = 236, cx = 180, cy = 110, K = 0.5, RO = 106, RI = 80, RM = 93, D = 8, PH = 16;
  const svg = svgRoot(host, w, h);
  const P = (deg, r, up = 0) => ({ x: cx + r * Math.cos(deg * RAD), y: cy + r * Math.sin(deg * RAD) * K - up });
  const ell = (r) => `M${cx - r} ${cy}A${r} ${r * K} 0 1 1 ${cx + r} ${cy}A${r} ${r * K} 0 1 1 ${cx - r} ${cy}Z`;
  // axis of the ring, broken round the centre note
  ln(svg, cx, cy - RO * K - 12, cx, cy - 12, 'st-center', LIVE);
  ln(svg, cx, cy + 10, cx, cy + RO * K + D + 12, 'st-center', LIVE);
  // thickness: the front rim and the far inner wall
  for (let a = 8; a <= 172; a += 6.5) { const p = P(a, RO); ln(svg, p.x, p.y, p.x, p.y + D, 'st-graphite'); }
  el('path', { d: `M${cx - RO} ${cy + D}A${RO} ${RO * K} 0 0 0 ${cx + RO} ${cy + D}`, class: 'st-carbon' }, svg);
  ln(svg, cx - RO, cy, cx - RO, cy + D, 'st-carbon');
  ln(svg, cx + RO, cy, cx + RO, cy + D, 'st-carbon');
  const dl = Math.asin(D / (2 * RI * K)) / RAD, wa = P(180 + dl, RI), wb = P(360 - dl, RI);
  el('path', { d: `M${fmt(wa.x)} ${fmt(wa.y + D)}A${RI} ${RI * K} 0 0 1 ${fmt(wb.x)} ${fmt(wb.y + D)}`, class: 'st-carbon-thin' }, svg);
  el('path', { d: ell(RO), class: 'st-carbon' }, svg);
  el('path', { d: ell(RI), class: 'st-carbon' }, svg);
  el('path', { d: ell(RM), class: 'st-faint' }, svg);
  // direction of travel, drawn on the running line between stations
  for (const a of [-90, 30, 150]) {
    const tip = P(a + 4, RM), b1 = P(a - 3, RM - 3.2), b2 = P(a - 3, RM + 3.2);
    el('path', { d: `M${fmt(b1.x)} ${fmt(b1.y)}L${fmt(tip.x)} ${fmt(tip.y)}L${fmt(b2.x)} ${fmt(b2.y)}`, class: 'st-carbon-thin' }, svg);
  }
  tx(svg, cx, cy + 3.5, '54 SKILLS', 'ann', 'middle');

  const NAMES = ['RECALL', 'WORK', 'VERIFY', 'REFINE', 'REVIEWED CHANGE', 'NEXT TASK'];
  const ANG = NAMES.map((_, i) => -120 + i * 60), GATE = 4;
  const lit = [];
  let beam;
  NAMES.forEach((name, i) => {
    const a = ANG[i], pi = P(a, RI), po = P(a, RO);
    ln(svg, pi.x, pi.y, po.x, po.y, 'st-carbon');
    if (i === GATE) {
      // the human gate: two posts astride the track, a lintel, and a beam that closes
      const ti = P(a, RI, 11), to = P(a, RO, 11);
      ln(svg, pi.x, pi.y, ti.x, ti.y, 'st-human', { 'stroke-width': 1.3, 'data-conv': 'solid' });
      ln(svg, po.x, po.y, to.x, to.y, 'st-human', { 'stroke-width': 1.3, 'data-conv': 'solid' });
      ln(svg, ti.x, ti.y, to.x, to.y, 'st-human', { 'stroke-width': 0.6 });
      const bi = P(a, RI, 5), bo = P(a, RO, 5);
      beam = ln(svg, bi.x, bi.y, bo.x, bo.y, 'st-human', { 'stroke-width': 1.5, ...LIVE });
      lit.push(null);
    } else {
      const base = P(a, RM), top = P(a, RM, PH);
      ln(svg, base.x, base.y, top.x, top.y, 'st-carbon-thin');
      el('circle', { cx: fmt(top.x), cy: fmt(top.y), r: 2.8, class: 'nd' }, svg);
      lit.push(el('circle', { cx: fmt(top.x), cy: fmt(top.y), r: 2.8, class: 'nd-solid', ...LIVE }, svg));
    }
    const top = P(a, RM, PH);
    if (i === 0) tx(svg, top.x - 7, top.y + 1, name, 'annf', 'end');
    else if (i === 1) tx(svg, top.x + 7, top.y + 1, name);
    else if (i === 2) tx(svg, top.x + 9, top.y - 5, name);
    else if (i === 5) tx(svg, top.x - 9, top.y - 5, name, 'annf', 'end');
    else {
      const side = i === 3 ? 1 : -1;
      ln(svg, po.x + side, po.y + D + 2, po.x + side * 7, po.y + D + 12);
      tx(svg, po.x + side * 10, po.y + D + 17, name, i === GATE ? 'annf ann-human' : 'annf', side > 0 ? 'start' : 'end');
    }
  });

  const liveG = el('g', {}, svg);
  const trail = el('path', { class: 'st-key', 'stroke-width': 1.4, 'stroke-linecap': 'round', fill: 'none', ...LIVE }, liveG);
  const ring = el('circle', { r: 4, class: 'st-key-thin', ...LIVE }, liveG);
  const token = el('circle', { r: 3.8, class: 'nd', ...LIVE }, liveG);
  const core = el('circle', { r: 1.3, class: 'nd-solid', ...LIVE }, liveG);

  // dwell at each station, then one eased leg to the next
  const DW = [0.3, 0.3, 1.15, 0.3, 1.35, 0.6], LEG = 0.95;
  let acc = 0;
  const at = DW.map((d) => { const s = { arrive: acc, leave: acc + d }; acc += d + LEG; return s; });
  const LAP = acc;
  const frame = (t) => {
    const tl = t % LAP;
    let i = 0;
    while (i < 5 && tl >= at[i].leave + LEG) i++;
    const f = ease((tl - at[i].leave) / LEG);
    const deg = ANG[0] + (i + f) * 60;
    const p = P(deg, RM, 3);
    token.setAttribute('cx', fmt(p.x)); token.setAttribute('cy', fmt(p.y));
    core.setAttribute('cx', fmt(p.x)); core.setAttribute('cy', fmt(p.y));
    const pts = [];
    for (let k = 0; k <= 7; k++) pts.push(P(deg - 26 + k * (26 / 7), RM, 0));
    trail.setAttribute('d', pathFrom(pts));
    // a new task takes the token's place at NEXT TASK
    const swap = 1 - ramp(tl, at[5].arrive + 0.1, at[5].arrive + 0.35) * (1 - ramp(tl, at[5].leave, at[5].leave + 0.3));
    fade(token, swap); fade(core, swap); fade(trail, swap * 0.9);
    // VERIFY: two check rings while it waits
    const v = (tl - at[2].arrive) / (DW[2] / 2);
    if (v >= 0 && v < 2) {
      const k = v % 1;
      put(ring, 'cx', fmt(p.x)); put(ring, 'cy', fmt(p.y));
      ring.setAttribute('r', fmt(4.5 + ease(k) * 8));
      fade(ring, 0.8 * (1 - ease(k)) * ramp(k, 0, 0.1));
    } else fade(ring, 0);
    // REVIEWED CHANGE: the beam closes on arrival and lifts when the change is accepted
    fade(beam, ramp(tl, at[GATE].arrive - 0.15, at[GATE].arrive + 0.1) * (1 - ramp(tl, at[GATE].leave - 0.35, at[GATE].leave - 0.1)));
    // stations fill as the task clears them, and empty for the next task
    lit.forEach((c, k) => {
      if (!c) return;
      const mark = k === 0 ? 0 : at[k].arrive;
      fade(c, ramp(tl, mark, mark + 0.3) * (1 - ramp(tl, at[5].leave + LEG - 0.5, at[5].leave + LEG)));
    });
  };
  animate(host, svg, frame, { pose: at[GATE].arrive + 0.5, live: [liveG], stagger: 9 });
}

/* ------------------------------------------------ A-606 · Secure Wall ---- */
/* Apps on the left, the network on the right, a wall drawn in section between
   them. A rule is an opening in the wall. Everything else stops at the wall
   face. The unknown app is blocked, a prompt appears, and a vermilion mark
   makes the choice: the line resolves solid or stays dashed. */
function initSecureWall(host) {
  const w = 360, h = 236, nx = 36, wx = 170, ww = 16, wy0 = 18, wy1 = 226;
  const rows = [36, 68, 100, 132, 164], RULE = [true, false, true, false];
  const G = { x: 300, y: 100, r: 25 }, UY = rows[4];
  const svg = svgRoot(host, w, h);
  const wx1 = wx + ww, sx = nx + 22;

  // the wall, in section
  hatchRect(svg, wx, wy0, ww, wy1 - wy0, 5, 'st-carbon-thin');
  el('rect', { x: wx, y: wy0, width: ww, height: wy1 - wy0, class: 'st-carbon', 'stroke-width': 1.2 }, svg);
  tx(svg, wx + ww / 2, 11, 'DEFAULT DENY', 'ann', 'middle');
  const port = (parent, y) => {
    el('rect', { x: wx - 1, y: y - 5, width: ww + 2, height: 10, class: 'nd', style: 'stroke:none' }, parent);
    ln(parent, wx, y - 5, wx1, y - 5, 'st-carbon');
    ln(parent, wx, y + 5, wx1, y + 5, 'st-carbon');
  };
  const cross = (parent, y) => {
    ln(parent, wx - 8, y - 2.6, wx - 2.8, y + 2.6, 'st-carbon');
    ln(parent, wx - 8, y + 2.6, wx - 2.8, y - 2.6, 'st-carbon');
  };
  // the network: a globe in orthographic projection
  el('circle', { cx: G.x, cy: G.y, r: G.r, class: 'st-carbon' }, svg);
  for (const k of [0.38, 0.78]) el('path', { d: `M${G.x} ${G.y - G.r}A${fmt(G.r * k)} ${G.r} 0 0 0 ${G.x} ${G.y + G.r}A${fmt(G.r * k)} ${G.r} 0 0 0 ${G.x} ${G.y - G.r}`, class: 'st-carbon-thin' }, svg);
  for (const k of [-0.55, 0, 0.55]) { const hw = G.r * Math.sqrt(1 - k * k); ln(svg, G.x - hw, G.y + k * G.r, G.x + hw, G.y + k * G.r, 'st-carbon-thin'); }
  ln(svg, G.x, G.y - G.r, G.x, G.y + G.r, 'st-carbon-thin');
  tx(svg, G.x, G.y + G.r + 14, 'NETWORK', 'ann', 'middle');

  const onward = (y, deg) => {
    const e = pt(G.x + G.r * Math.cos(deg * RAD), G.y + G.r * Math.sin(deg * RAD));
    return { c1: pt(wx1 + 42, y), c2: pt(e.x - 36, e.y), e };
  };
  const through = (y, deg) => {
    const o = onward(y, deg);
    return {
      d: `M${sx} ${y}H${wx1}C${o.c1.x} ${o.c1.y} ${fmt(o.c2.x)} ${fmt(o.c2.y)} ${fmt(o.e.x)} ${fmt(o.e.y)}`,
      path: route([pt(sx, y), pt(wx1, y), ...cubic(pt(wx1, y), o.c1, o.c2, o.e).slice(1)]),
    };
  };
  const app = (y, name, mark) => {
    el('rect', { x: nx, y: y - 7, width: 22, height: 14, rx: 1, class: 'nd' }, svg);
    ln(svg, nx, y - 3.2, nx + 22, y - 3.2, 'st-carbon-thin');
    if (mark) tx(svg, nx + 11, y + 4.6, mark, 'annf ann-key', 'middle');
    tx(svg, sx + 4, y - 5, name);
  };

  const liveG = el('g', {}, svg);
  const flows = [], stops = [];
  RULE.forEach((ok, i) => {
    const y = rows[i];
    if (ok) {
      port(svg, y);
      const th = through(y, i === 0 ? 207 : 180);
      el('path', { d: th.d, class: 'st-carbon', 'data-conv': 'solid' }, svg);
      for (let k = 0; k < 2; k++) flows.push({ c: el('circle', { r: 1.8, class: 'nd-solid', ...LIVE }, liveG), path: th.path, ph: i * 0.37 + k * 0.5 });
    } else {
      ln(svg, sx, y, wx - 9, y, 'st-carbon', { 'stroke-dasharray': DASHED, 'data-conv': 'dashed' });
      cross(svg, y);
      stops.push({ c: el('circle', { r: 1.8, class: 'nd-solid', ...LIVE }, liveG), y, ph: i * 0.29 });
    }
    app(y, ok ? 'APP · RULE' : 'APP');
  });

  // the unknown app: blocked by default, resolved by the prompt
  const uTh = through(UY, 152);
  const uDash = ln(svg, sx, UY, wx - 9, UY, 'st-carbon', { 'stroke-dasharray': DASHED, 'data-conv': 'dashed', ...LIVE });
  const uCross = el('g', {}, svg); cross(uCross, UY); noDraw(uCross);
  const uPort = el('g', {}, svg); port(uPort, UY); noDraw(uPort);
  const uSolid = el('path', { d: uTh.d, class: 'st-carbon', 'data-conv': 'solid', ...LIVE }, svg);
  app(UY, 'UNKNOWN APP', '?');
  const uTry = el('circle', { r: 1.8, class: 'nd-solid', ...LIVE }, liveG);
  const uFlow = [0, 0.5].map((ph) => ({ c: el('circle', { r: 1.8, class: 'nd-solid', ...LIVE }, liveG), ph }));

  // the prompt plate
  const OPTS = ['ALLOW OUTGOING', 'ALWAYS ALLOW', 'IGNORE'];
  const px = 38, py = 184, pw = 118, rh = 14;
  const plate = el('g', {}, svg);
  ln(plate, wx - 5, UY + 4, px + pw - 10, py, 'st-carbon-thin');
  el('rect', { x: px, y: py, width: pw, height: rh * 3, class: 'nd' }, plate);
  OPTS.forEach((o, i) => {
    if (i) ln(plate, px, py + rh * i, px + pw, py + rh * i, 'st-faint');
    el('rect', { x: px + 6, y: py + rh * i + 4.5, width: 6, height: 6, class: 'st-carbon-thin' }, plate);
    tx(plate, px + 18, py + rh * i + 10.8, o);
  });
  const pick = el('g', {}, plate);
  el('rect', { x: px + 2, y: py + 2, width: pw - 4, height: rh - 4, class: 'st-human', 'stroke-width': 1 }, pick);
  el('path', { d: `M${px + 7} ${py + 7.6}l2 2.2l3.4 -4.6`, class: 'st-human', 'stroke-width': 1.3 }, pick);
  const hand = el('circle', { cx: px + 9, r: 4.6, class: 'st-human', 'stroke-width': 1.1 }, plate);
  noDraw(plate);

  // seeded choices, never the same twice running, opening on an allow
  const rand = rng(606011);
  const seq = [1];
  while (seq.length < 18) { const c = Math.floor(rand() * 3); if (c !== seq[seq.length - 1]) seq.push(c); }
  const CYC = 9;
  const frame = (t) => {
    for (const f of flows) {
      const k = (t / 3.1 + f.ph) % 1, p = f.path.at(k);
      f.c.setAttribute('cx', fmt(p.x)); f.c.setAttribute('cy', fmt(p.y));
      fade(f.c, ramp(k, 0, 0.06) * (1 - ramp(k, 0.92, 1)));
    }
    for (const s of stops) {
      const k = (t / 2.7 + s.ph) % 1;
      s.c.setAttribute('cx', fmt(lerp(sx, wx - 11, ease(k / 0.55))));
      put(s.c, 'cy', fmt(s.y));
      fade(s.c, ramp(k, 0, 0.08) * (1 - ramp(k, 0.6, 0.85)));
    }
    const cyc = Math.floor(t / CYC), u = t - cyc * CYC, choice = seq[cyc % seq.length], allow = choice !== 2;
    // attempt, and for IGNORE a second attempt that is refused the same way
    const tries = allow ? [0.1] : [0.1, 5.9];
    let tryO = 0, tryX = sx;
    for (const t0 of tries) {
      const k = (u - t0) / 1.6;
      if (k >= 0 && k < 1) { tryX = lerp(sx, wx - 11, ease(k / 0.62)); tryO = ramp(k, 0, 0.1) * (1 - ramp(k, 0.7, 1)); }
    }
    uTry.setAttribute('cx', fmt(tryX)); put(uTry, 'cy', fmt(UY)); fade(uTry, tryO);
    const open = allow ? ramp(u, 3.5, 4.2) * (1 - ramp(u, 7.7, 8.5)) : 0;
    fade(uSolid, open); fade(uPort, open); fade(uDash, 1 - open); fade(uCross, 1 - open);
    uFlow.forEach((f) => {
      const k = ((u - 4.1) / 2.6 + f.ph) % 1, p = uTh.path.at(k);
      f.c.setAttribute('cx', fmt(p.x)); f.c.setAttribute('cy', fmt(p.y));
      fade(f.c, u > 4.1 ? open * ramp(k, 0, 0.06) * (1 - ramp(k, 0.92, 1)) : 0);
    });
    fade(plate, ramp(u, 1.2, 1.7) * (1 - ramp(u, 5.0, 5.6)));
    const hy = py + rh / 2 + rh * choice * ease((u - 2.0) / (0.5 + 0.35 * choice));
    hand.setAttribute('cy', fmt(hy));
    fade(hand, ramp(u, 1.7, 2.0) * (1 - ramp(u, 3.1, 3.4)));
    put(pick, 'transform', `translate(0 ${rh * choice})`);
    fade(pick, ramp(u, 3.0, 3.3));
  };
  animate(host, svg, frame, { pose: 4.7, live: [liveG], stagger: 7 });
}

/* -------------------------------------------------------- A-607 · STK ---- */
/* A long file beside a byte ruler. Three phases: a whole-file read runs into
   the threshold and is clamped (the rest goes dashed), the read comes back as
   a short line-numbered outline, and then only one bracketed slice is read. */
function initStk(host) {
  const w = 360, h = 236, fx = 100, fw = 62, rx0 = 90, NR = 40;
  const ry = (i) => 22 + i * 5, yT = ry(14.5);
  const svg = svgRoot(host, w, h);
  const rand = rng(16384);
  const SRC = [2, 7, 12, 19, 26, 33], NUM = [12, 93, 148, 210, 287, 362], KW = ['fn', 'fn', 'struct', 'impl', 'fn', 'fn'];
  const SLICE = 6;

  // ruler of bytes
  ln(svg, rx0, 14, rx0, 224, 'st-carbon-thin');
  for (let y = 14, k = 0; y <= 224; y += 7, k++) ln(svg, rx0 - (k % 5 ? 2.5 : 5), y, rx0, y, 'st-carbon-thin');
  // the file: a page with a folded corner, broken at the foot because it runs on
  el('path', { d: `M${fx} 226V12H${fx + fw - 8}L${fx + fw} 20V226`, class: 'st-carbon' }, svg);
  el('path', { d: `M${fx + fw - 8} 12V20H${fx + fw}`, class: 'st-carbon-thin' }, svg);
  el('path', { d: `M${fx - 4} 226H${fx + 22}l4 -5l6 10l4 -5H${fx + fw + 4}`, class: 'st-carbon-thin' }, svg);
  const rowsG = el('g', {}, svg), inkG = el('g', {}, svg);
  const rows = [];
  for (let i = 0; i < NR; i++) {
    const src = SRC.includes(i);
    const ind = src ? 0 : rand() < 0.6 ? 6 : 12, len = src ? 40 + rand() * 8 : 14 + rand() * (40 - ind);
    const xa = fx + 5 + ind, xb = xa + len, y = ry(i);
    rows.push({
      y,
      base: ln(rowsG, xa, y, xb, y, 'st-graphite', { 'stroke-width': 0.8 }),
      ink: ln(inkG, xa, y, xb, y, src ? 'st-key' : 'st-carbon', { 'stroke-width': src ? 1.5 : 1.1, ...LIVE }),
    });
  }
  // the threshold
  ln(svg, 12, yT, fx + fw + 8, yT, 'st-key', { 'stroke-width': 1.2 });
  tx(svg, rx0 - 8, yT - 4.5, '16,384 BYTES', 'annf ann-key', 'end');
  const head = el('g', {}, svg);
  ln(head, fx - 3, 0, fx + fw + 3, 0, 'st-key', { 'stroke-width': 1.2 });
  el('path', { d: `M${fx + fw + 3} 0l5 -3v6z`, class: 'nd-solid' }, head);
  noDraw(head);

  // phase key
  const PH = ['READ', 'OUTLINE', 'SLICE'];
  const keys = PH.map((p, i) => {
    const g = el('g', {}, svg);
    el('rect', { x: 14, y: 148 + i * 14, width: 5, height: 5, class: 'nd-solid', ...LIVE }, g);
    tx(g, 25, 153 + i * 14, p, 'annf ann-key');
    return g;
  });

  // the outline
  const ox = 200, oy = 38, og = 11;
  const outline = el('g', {}, svg);
  tx(outline, ox, 20, 'OUTLINE · 80 LINES AT MOST', 'annf ann-key');
  ln(outline, ox, 26, 352, 26, 'st-carbon');
  const entries = SRC.map((r, j) => {
    const g = el('g', {}, outline), y = oy + j * og;
    tx(g, ox + 20, y + 3, String(NUM[j]), 'annf ann-key', 'end');
    tx(g, ox + 27, y + 3, KW[j]);
    const mx0 = ox + 31 + KW[j].length * 5.9;
    ln(g, mx0, y, mx0 + 22 + rand() * 40, y, 'st-carbon', { 'stroke-width': 1.1 });
    const lead = ln(svg, fx + fw + 2, ry(r), ox - 3, y, 'st-faint', LIVE);
    return { g, lead, y };
  });
  noDraw(outline);

  // the slice: a bracket on the file, tied back to the outline entry that asked for it
  const slice = el('g', {}, svg);
  const tie = el('path', { class: 'st-key-thin', fill: 'none' }, slice);
  const brk = el('path', { class: 'st-key', 'stroke-width': 1.3, fill: 'none' }, slice);
  const sTxt = tx(slice, fx + fw + 14, 0, '--OFFSET N --LIMIT M', 'annf ann-key');
  noDraw(slice);

  const picks = [4, 3, 5, 4, 5, 3];
  const CYC = 10.6;
  const frame = (t) => {
    const cyc = Math.floor(t / CYC), u = t - cyc * CYC;
    const pick = picks[cyc % picks.length], r0 = SRC[pick];
    const out = 1 - ramp(u, 9.6, 10.2);
    // 1 · read attempt: the head runs down the file and stops dead on the threshold
    const yh = lerp(16, yT, clamp((u - 0.3) / 1.9));
    const sweep = 1 - ramp(u, 2.9, 3.5);
    // 3 · slice fetch
    const sel = ramp(u, 6.5, 6.9) * out;
    const ya = ry(r0) - 2.5, yb = ry(r0 + SLICE - 1) + 2.5;
    const ys2 = lerp(ya, yb, clamp((u - 7.1) / 1.0));
    const inSlice = u >= 7.1 && u < 9.0;
    put(head, 'transform', `translate(0 ${fmt(inSlice ? ys2 : yh)})`);
    fade(head, inSlice ? ramp(u, 7.1, 7.25) * (1 - ramp(u, 8.2, 8.5)) : ramp(u, 0.15, 0.4) * (1 - ramp(u, 2.6, 3.0)));
    const clamped = u >= 2.25 && u < 10.1;
    rows.forEach((row, i) => {
      const over = row.y > yT, sliced = i >= r0 && i < r0 + SLICE;
      const read = clamp((yh - row.y) / 3 + 0.5) * sweep * (over ? 0 : 1);
      const got = sliced ? ramp(u, 7.1 + (i - r0) * 0.16, 7.3 + (i - r0) * 0.16) * out : 0;
      const src = SRC.indexOf(i);
      const named = src < 0 ? 0 : ramp(u, 3.2 + src * 0.38, 3.5 + src * 0.38) * out * 0.9;
      fade(row.ink, Math.max(read, got, named));
      put(row.base, 'stroke-dasharray', over && clamped && !(sliced && u >= 7.0) ? '2.2,2.2' : 'none');
    });
    // 2 · the read comes back as an outline
    fade(outline, ramp(u, 2.9, 3.3) * out);
    entries.forEach((e, j) => {
      const o = ramp(u, 3.2 + j * 0.38, 3.5 + j * 0.38);
      fade(e.g, o * (u > 6.5 && j !== pick ? 1 - 0.5 * sel : 1));
      fade(e.lead, o * (1 - ramp(u, 6.0, 6.4)));
    });
    put(tie, 'd', `M${ox - 3} ${entries[pick].y}H${ox - 14}V${fmt(ya)}H${fx + fw + 8}`);
    put(brk, 'd', `M${fx + fw + 3} ${fmt(ya)}H${fx + fw + 8}V${fmt(yb)}H${fx + fw + 3}`);
    put(sTxt, 'y', fmt((ya + yb) / 2 + 3.2));
    fade(slice, sel);
    const phase = u < 2.9 ? 0 : u < 6.5 ? 1 : 2;
    keys.forEach((g, i) => fade(g, i === phase ? 1 : 0.32));
  };
  animate(host, svg, frame, { pose: 8.9, live: [inkG], stagger: 6 });
}

/* ------------------------------------------------------ A-608 · MAVVI ---- */
/* A flavor wheel: six sectors, six hatches, the way a drafter tells six
   materials apart. The wheel turns, the names ride round with their sectors
   and stay upright, and fine bubbles rise through it. */
function initMavvi(host) {
  const w = 360, h = 236, cx = 180, cy = 118, R = 72, R0 = 19;
  const NAMES = ['APPLE CRUSH', 'BERRY DRIFT', 'GUAVA HOUR', 'MATCHA MOOD', 'PINEAPPLE DAY', 'VANILLA DUSK'];
  const svg = svgRoot(host, w, h);
  const defs = el('defs', {}, svg);
  const pol = (deg, r) => pt(r * Math.cos(deg * RAD), r * Math.sin(deg * RAD));
  const a0 = pol(-30, R0), a1 = pol(-30, R), b1 = pol(30, R), b0 = pol(30, R0);
  el('path', { d: `M${fmt(a0.x)} ${fmt(a0.y)}L${fmt(a1.x)} ${fmt(a1.y)}A${R} ${R} 0 0 1 ${fmt(b1.x)} ${fmt(b1.y)}L${fmt(b0.x)} ${fmt(b0.y)}A${R0} ${R0} 0 0 0 ${fmt(a0.x)} ${fmt(a0.y)}Z` }, el('clipPath', { id: 'mv-clip' }, defs));

  const wheel = el('g', {}, svg);
  const rand = rng(608006);
  const HATCH = [
    // 1 · single 45 degree lines
    (g) => { for (let c = -30; c < 120; c += 5.5) ln(g, c + 45, -45, c - 45, 45); },
    // 2 · cross hatch
    (g) => { for (let c = -30; c < 120; c += 8) { ln(g, c + 45, -45, c - 45, 45); ln(g, c - 45, -45, c + 45, 45); } },
    // 3 · stipple
    (g) => {
      for (let k = 0; k < 46; k++) {
        const p = pol(-28 + rand() * 56, Math.sqrt(lerp(R0 * R0, R * R, rand())));
        el('circle', { cx: fmt(p.x), cy: fmt(p.y), r: 0.7, class: 'nd-solid', style: 'stroke:none' }, g);
      }
    },
    // 4 · concentric arcs
    (g) => {
      for (let r = R0 + 6; r < R; r += 6) {
        const a = pol(-31, r), b = pol(31, r);
        el('path', { d: `M${fmt(a.x)} ${fmt(a.y)}A${r} ${r} 0 0 1 ${fmt(b.x)} ${fmt(b.y)}` }, g);
      }
    },
    // 5 · radial lines, long and short alternating
    (g) => {
      for (let k = 0, a = -26; a <= 26.01; a += 4, k++) {
        const p = pol(a, k % 2 ? R0 + 22 : R0 + 3), q = pol(a, R);
        ln(g, p.x, p.y, q.x, q.y);
      }
    },
    // 6 · zigzag courses
    (g) => {
      for (let c = R0; c < R + 4; c += 7.5) {
        let d = '';
        for (let y = -40, k = 0; y <= 40; y += 4, k++) d += `${k ? 'L' : 'M'}${fmt(c + (k % 2 ? 1.8 : -1.8))} ${y}`;
        el('path', { d }, g);
      }
    },
  ];
  HATCH.forEach((draw, i) => {
    const s = el('g', { transform: `rotate(${i * 60})` }, wheel);
    draw(el('g', { 'clip-path': 'url(#mv-clip)', class: 'st-carbon-thin' }, s));
    // sector edge, and a leader out to the name
    ln(s, a0.x, a0.y, a1.x, a1.y, 'st-carbon');
    ln(s, R + 3, 0, R + 8, 0, 'st-carbon-thin');
  });
  el('circle', { cx: 0, cy: 0, r: R, class: 'st-carbon' }, wheel);
  el('circle', { cx: 0, cy: 0, r: R + 3, class: 'st-carbon-thin' }, wheel);
  el('circle', { cx: 0, cy: 0, r: R0, class: 'nd' }, wheel);
  // the centre mark does not turn
  ln(svg, cx - 9, cy, cx + 9, cy, 'st-center', LIVE);
  ln(svg, cx, cy - 9, cx, cy + 9, 'st-center', LIVE);

  const labels = NAMES.map((n) => ({ t: tx(svg, cx, cy, n, 'annf ann-key', 'middle'), hw: n.length * 2.93 }));
  const bubG = el('g', {}, svg);
  const bubbles = [...Array(15)].map(() => {
    const dx = (rand() - 0.5) * 108, half = Math.sqrt(R * R - dx * dx) * 0.92;
    return {
      c: el('circle', { r: fmt(1 + rand() * 1.5), class: 'nd', style: 'stroke-width:0.6', ...LIVE }, bubG),
      dx, half, per: 4.5 + rand() * 4, ph: rand(), sw: 1.5 + rand() * 2, sp: 0.8 + rand(),
    };
  });

  const frame = (t) => {
    const rot = 12 + t * 5;
    wheel.setAttribute('transform', `translate(${cx} ${cy}) rotate(${fmt(rot)})`);
    labels.forEach((l, i) => {
      const a = (rot + i * 60) * RAD, c = Math.cos(a), s = Math.sin(a);
      // anchored at its inner end on the sides, centred at the top and foot, with no jump between
      l.t.setAttribute('x', fmt(cx + (R + 13) * c + l.hw * clamp(c * 1.7, -1, 1)));
      l.t.setAttribute('y', fmt(cy + (R + 14) * s + 3.2));
    });
    for (const b of bubbles) {
      const k = (t / b.per + b.ph) % 1;
      b.c.setAttribute('cx', fmt(cx + b.dx + Math.sin(t * b.sp + b.ph * 9) * b.sw));
      b.c.setAttribute('cy', fmt(cy + b.half - k * 2 * b.half));
      fade(b.c, ramp(k, 0, 0.15) * (1 - ramp(k, 0.8, 1)));
    }
  };
  animate(host, svg, frame, { pose: 2, live: [bubG], stagger: 4, dur: 480 });
}

/* ------------------------------------------- A-1000 · engineering loop --- */
/* Sibling of the merge gate. Changes descend through plan, build, tests and
   review. Review is a switch: a seeded minority are thrown onto the return
   loop, corrected, and sent back through the tests; the rest ride the rail
   out as shipped. Tokens advance in step, two beats apart, so a returning
   change always re-enters the rail in the gap between two others. */
function initLoop(host) {
  const w = 240, h = 344, mx = 150, rx = 206;
  const Y = { plan: 46, build: 100, tests: 164, review: 226, refine: 194, out: 300 };
  const svg = svgRoot(host, w, h, true);
  // rails: the main line is carbon and ships; the return loop is graphite construction
  ln(svg, mx, 14, mx, Y.out, 'st-carbon', { 'data-conv': 'solid' });
  el('path', { d: `M${mx - 3.5} ${Y.out - 6}L${mx} ${Y.out}L${mx + 3.5} ${Y.out - 6}`, class: 'st-carbon' }, svg);
  const A = [pt(mx, Y.review), pt(mx + 32, Y.review), pt(rx, Y.review), pt(rx, Y.review - 14)];
  const B = [pt(rx, 158), pt(rx, 122), pt(mx, 116), pt(mx, 142)];
  el('path', {
    d: `M${A[0].x} ${A[0].y}C${A[1].x} ${A[1].y} ${A[2].x} ${A[2].y} ${A[3].x} ${A[3].y}V${B[0].y}C${B[1].x} ${B[1].y} ${B[2].x} ${B[2].y} ${B[3].x} ${B[3].y}`,
    class: 'st-graphite', 'stroke-width': 0.8,
  }, svg);
  el('path', { d: `M${rx - 3} ${Y.refine - 14}L${rx} ${Y.refine - 20}L${rx + 3} ${Y.refine - 14}`, class: 'st-graphite' }, svg);
  tx(svg, mx, 8, 'CHANGE', 'annf', 'middle');

  // stations, each with its own symbol
  const lab = (y, name) => { ln(svg, mx - 8, y, mx - 13, y); tx(svg, mx - 16, y + 3.2, name, 'annf', 'end'); };
  el('circle', { cx: mx, cy: Y.plan, r: 5, class: 'nd' }, svg);
  ln(svg, mx - 5, Y.plan, mx + 5, Y.plan);
  ln(svg, mx, Y.plan - 5, mx, Y.plan + 5);
  lab(Y.plan, 'CLEAR PLAN');
  el('circle', { cx: mx, cy: Y.build, r: 5, class: 'nd' }, svg);
  el('circle', { cx: mx, cy: Y.build, r: 2.2, class: 'st-carbon-thin' }, svg);
  lab(Y.build, 'AGENT BUILD');
  ln(svg, mx - 13, Y.tests - 7, mx - 13, Y.tests + 7, 'st-key', { 'stroke-width': 1.3 });
  ln(svg, mx + 13, Y.tests - 7, mx + 13, Y.tests + 7, 'st-key', { 'stroke-width': 1.3 });
  const beam = ln(svg, mx - 13, Y.tests, mx + 13, Y.tests, 'st-key', { 'stroke-width': 1.4, ...LIVE });
  ln(svg, mx - 13, Y.tests, mx - 18, Y.tests);
  tx(svg, mx - 21, Y.tests + 3.2, 'REAL-WORLD TESTS', 'annf', 'end');
  const blade = ln(svg, mx + 8, Y.review, mx + 20, Y.review, 'st-key', { 'stroke-width': 1.5, 'stroke-linecap': 'round', ...LIVE });
  el('path', { d: `M${mx} ${Y.review - 7}L${mx + 7} ${Y.review}L${mx} ${Y.review + 7}L${mx - 7} ${Y.review}Z`, class: 'nd' }, svg);
  ln(svg, mx - 9, Y.review, mx - 14, Y.review);
  tx(svg, mx - 17, Y.review + 3.2, 'INDEPENDENT REVIEW', 'annf', 'end');
  el('circle', { cx: rx, cy: Y.refine, r: 5, class: 'nd' }, svg);
  el('circle', { cx: rx, cy: Y.refine, r: 1.6, class: 'nd-solid' }, svg);
  el('text', { x: rx + 17, y: Y.refine, class: 'annf', 'text-anchor': 'middle', transform: `rotate(-90 ${rx + 17} ${Y.refine})` }, svg).textContent = 'REFINE & CORRECT';
  const pulse = el('circle', { cx: mx, cy: Y.out - 12, r: 3, class: 'st-key', fill: 'none', ...LIVE }, svg);
  const shippedTxt = tx(svg, mx, h - 24, '', 'annf', 'middle');
  const backTxt = tx(svg, mx, h - 10, '', 'annf dim', 'middle');

  // hold points sit just before each station; a token rests there, then passes through
  const H = {
    in: pt(mx, -8), plan: pt(mx, Y.plan - 13), build: pt(mx, Y.build - 13), tests: pt(mx, Y.tests - 13),
    review: pt(mx, Y.review - 13), refine: pt(rx, Y.refine + 18), out: pt(mx, Y.out - 12),
  };
  const S = {
    in: route([H.in, H.plan]), b: route([H.plan, H.build]), c: route([H.build, H.tests]), d: route([H.tests, H.review]),
    out: route([H.review, H.out]),
    ret: route([H.review, ...cubic(A[0], A[1], A[2], A[3]), H.refine]),
    back: route([H.refine, ...cubic(B[0], B[1], B[2], B[3]), H.tests]),
  };
  const PASS = [S.in, S.b, S.c, S.d, S.out];
  const BACK = [S.in, S.b, S.c, S.d, S.ret, S.back, S.d, S.out];

  // seeded verdicts: roughly three changes in ten are sent back once
  const rand = rng(20261110);
  const sentBack = [...Array(64)].map(() => rand() < 0.3);
  const pre = [0];
  sentBack.forEach((v, i) => pre.push(pre[i] + (v ? 1 : 0)));
  const backUpTo = (n) => Math.floor(n / 64) * pre[64] + pre[n % 64]; // sent back among tokens 0 .. n-1
  const verdict = (n) => sentBack[n % 64];
  const pool = [...Array(6)].map(() => {
    const r = el('rect', { width: 16, height: 10, rx: 1, class: 'nd', ...LIVE }, svg);
    r.style.opacity = '0';
    return r;
  });
  const pad = (n) => String(Math.min(n, 99)).padStart(2, '0');
  const BEAT = 1.15, MOVE = 0.6;
  let beamO = 0, bladeA = 90;
  const frame = (t, dt) => {
    const s = t / BEAT + 3;
    const nMax = Math.floor(s / 2), nMin = Math.max(0, Math.ceil((s - 8) / 2));
    let beamT = 0, bladeT = bladeA, pulseK = -1, shipped = nMin, back = backUpTo(nMin);
    const used = new Set();
    for (let n = nMin; n <= nMax; n++) {
      const a = s - 2 * n, v = verdict(n), path = v ? BACK : PASS;
      if (a >= path.length) { shipped++; if (v) back++; continue; }
      if (v && a >= 6) back++;
      const i = Math.floor(a), f = a - i, k = ease(f / MOVE), seg = path[i], p = seg.at(k);
      const r = pool[n % pool.length];
      used.add(r);
      let o = 1;
      if (i === 0) o = ramp(f, 0, 0.3);
      if (seg === S.out) { o = 1 - ramp(k, 0.55, 1); if (f > 0.45) pulseK = (f - 0.45) / 0.55; }
      r.setAttribute('x', fmt(p.x - 8));
      r.setAttribute('y', fmt(p.y - 5));
      fade(r, o);
      // held at the tests: the beam is down. released: it lifts.
      if ((seg === S.c || seg === S.back) && f > MOVE * 0.8) beamT = 1;
      // held at review: the switch is thrown for this change
      if (seg === S.d && f > MOVE * 0.7) bladeT = path[i + 1] === S.ret ? 0 : 90;
    }
    for (const r of pool) if (!used.has(r)) fade(r, 0);
    const q = dt ? Math.min(1, dt * 9) : 1;
    beamO += (beamT - beamO) * q;
    bladeA += (bladeT - bladeA) * q;
    fade(beam, beamO);
    blade.setAttribute('transform', `rotate(${fmt(bladeA)} ${mx} ${Y.review})`);
    if (pulseK >= 0) { pulse.setAttribute('r', fmt(3 + pulseK * 9)); fade(pulse, 0.7 * (1 - pulseK)); } else fade(pulse, 0);
    const a1 = `SHIPPED ${pad(shipped)}`, a2 = `RE-CHECKED ${pad(back)}`;
    if (shippedTxt.textContent !== a1) shippedTxt.textContent = a1;
    if (backTxt.textContent !== a2) backTxt.textContent = a2;
  };
  animate(host, svg, frame, { pose: 9.1, stagger: 12 });
}

/* ------------------------------------------------------------------ boot - */
export function boot() {
  const draw = (id, init) => { const host = document.getElementById(id); if (host) init(host); };
  draw('fig-d-latter', initLatter);
  draw('fig-d-academy', initAcademy);
  draw('fig-d-savetokens', initSaveTokens);
  draw('fig-d-harness', initHarness);
  draw('fig-d-securewall', initSecureWall);
  draw('fig-d-stk', initStk);
  draw('fig-d-mavvi', initMavvi);
  draw('fig-loop', initLoop);
}
