/* Approved Works · sheet A-800 · "Solving bottlenecks", an 82 second silent film.

   One canvas, ink line on paper. Every frame is a pure function of t: the
   customer flow is simulated once at load (seeded) into a timetable, and
   frame(t) only reads it, so the film can be scrubbed, paused, looped and
   later exported frame by frame with nothing to replay.

   The story follows the six steps on fullbuild.ai/about. Customers move
   through four stages (reach, acquire, convert, expand). The channel is as
   wide as each stage's capacity, so the slow stage is literally a bottle neck:
   customers queue behind it, wait, hollow out and drop off dashed.

   Line law, same as the rest of the set: solid = flowing, dashed = lost,
   vermilion = the constraint a human has found. */

/* mulberry32: every random number in the film comes from a fixed seed */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------------------------------------- timing -- */
export const DUR = 82;
const T_FIX = 59; // the moment the fix lands and the throat opens
export const CHAPTERS = [
  { id: 'open', a: 0, b: 11, step: 0 },
  { id: 'faster', a: 11, b: 20, step: 0 },
  { id: 'find', a: 20, b: 29, step: 1 },
  { id: 'break', a: 29, b: 38, step: 2 },
  { id: 'build', a: 38, b: 48, step: 3 },
  { id: 'test', a: 48, b: 57, step: 4 },
  { id: 'hand', a: 57, b: 66, step: 5 },
  { id: 'next', a: 66, b: 74, step: 6 },
  { id: 'end', a: 74, b: DUR, step: 0 },
];
/* Statements: display type, about ten words at most, no periods. `hot` words
   take the constraint's vermilion, so the caption shares its actor's colour. */
const CAPTIONS = [
  { ch: 0, at: 2.0, kicker: 'A-800 · SOLVING BOTTLENECKS', lines: ['A business grows only', 'as fast as its slowest step'], hot: ['slowest'] },
  { ch: 1, at: 0.5, kicker: 'A-800 · SOLVING BOTTLENECKS', lines: ['Speeding up any other step', 'changes nothing'], hot: ['nothing'], sub: 'The work still queues at the slow one' },
  { ch: 2, at: 0.5, kicker: 'STEP 1 OF 6', lines: ['Find the slowest', 'step together'], hot: ['slowest'], sub: 'Find where customers drop off' },
  { ch: 3, at: 0.5, kicker: 'STEP 2 OF 6', lines: ['Break the goal down'], sub: 'Turn the goal into testable steps' },
  { ch: 4, at: 0.5, kicker: 'STEP 3 OF 6', lines: ['Build the fix'], sub: 'Build fast, review every change' },
  { ch: 5, at: 0.5, kicker: 'STEP 4 OF 6', lines: ['Test it many times'], sub: 'Repeat, score and compare' },
  { ch: 6, at: 0.5, kicker: 'STEP 5 OF 6', lines: ['Hand it over'], sub: 'You own the code and the tools' },
  { ch: 7, at: 0.5, kicker: 'STEP 6 OF 6', lines: ['Continue to optimize'], sub: 'Find the next weak point' },
  { ch: 8, at: 0.6, kicker: 'CONTACT', lines: ['Tell me what you want', 'to build or fix'], sub: 'And what’s slowing you down' },
];

/* ----------------------------------------------------------------- math -- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const ss = (u) => { const k = clamp(u); return k * k * (3 - 2 * k); };
const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
const easeIn = (u) => { const k = clamp(u); return k * k; };
/* fade in over the first half second of [a, b], out over the last */
const env = (t, a, b, d = 0.5) => ss((t - a) / d) * (1 - ss((t - (b - d)) / d));

/* --------------------------------------------------------------- stage --- */
const W = 1920, H = 1080; // desktop frame
const CW = 1080, CHH = 1350; // tall phone frame, same drawing recomposed
const CY = 300; // channel centre line
const X_C = 1220, X_E = 1580; // convert and expand throats
const STAGES = [
  { x: 380, name: 'REACH', sub: 'find you' },
  { x: 800, name: 'ACQUIRE', sub: 'get in touch' },
  { x: X_C, name: 'CONVERT', sub: 'buy' },
  { x: X_E, name: 'EXPAND', sub: 'come back' },
];
/* Channel half-width at x. Width stands for capacity; `hc` is the convert
   throat, 14 before the fix and 74 after. */
const XS = [0, 380, 800, 1090, X_C, 1330, 1480, X_E, 1920];
function halfW(x, hc) {
  const HS = [105, 105, 92, 92, hc, 80, 80, 46, 46];
  if (x <= XS[0]) return HS[0];
  for (let i = 0; i < XS.length - 1; i++) {
    if (x <= XS[i + 1]) return lerp(HS[i], HS[i + 1], ss((x - XS[i]) / (XS[i + 1] - XS[i])));
  }
  return HS[HS.length - 1];
}
const throatAt = (t) => {
  if (t < T_FIX) return 14;
  const u = t - T_FIX;
  return 14 + 60 * (1 - Math.exp(-2.3 * u) * Math.cos(4.4 * u)); // opens over most of a second, one small overshoot
};

/* ---------------------------------------------------------- simulation --- */
const X0 = 40, V = 150, VS = 190; // spawn x, approach speed, speed once served
const XJ_C = 1090, XJ_E = 1480; // where a customer joins each queue
const R = 6.5; // token radius
const LANES = [0, 4, 1, 5, 2, 6, 3]; // consecutive customers never share a lane

/* Chapter two speeds up the steps before the neck: everything upstream moves
   2.25 times faster for a while. PHI is distance travelled by clock time (the
   integral of that speed), tabulated so position stays a pure function of t. */
const speedAt = (t) => 1 + 1.25 * ss((t - 11.3) / 1.0) * (1 - ss((t - 19.4) / 1.2));
const PT0 = -46, PDT = 0.05, PHI = [];
for (let t = PT0, acc = 0; t <= DUR + 8; t += PDT) { PHI.push(acc); acc += speedAt(t) * PDT; }
const phi = (t) => {
  const f = clamp((t - PT0) / PDT, 0, PHI.length - 1.001), i = Math.floor(f);
  return lerp(PHI[i], PHI[i + 1], f - i);
};
const phiInv = (p) => {
  let lo = 0, hi = PHI.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (PHI[m] <= p) lo = m; else hi = m; }
  return PT0 + (lo + clamp((p - PHI[lo]) / (PHI[hi] - PHI[lo] || 1))) * PDT;
};

/* Serpentine queue slots behind a throat: single file at the mouth, widening
   with the funnel, each slot one step from the next so the line files forward. */
function slotLayout(xThroat, hc) {
  const out = [];
  for (let r = 0; out.length < 90; r++) {
    const x = xThroat - 12 - r * 21;
    const n = clamp(Math.floor((2 * (halfW(x, hc) - 9)) / 21) + 1, 1, 8);
    for (let j = 0; j < n; j++) {
      const jj = r % 2 ? n - 1 - j : j;
      out.push({ x, y: (jj - (n - 1) / 2) * 21 });
    }
  }
  return out;
}
const slotPos = (P, s) => {
  const k = clamp(s, 0, P.length - 2), i = Math.floor(k), f = k - i;
  return { x: lerp(P[i].x, P[i + 1].x, f), y: lerp(P[i].y, P[i + 1].y, f) };
};

function buildSim() {
  const rand = rng(8001);
  const toks = [];
  // spawned evenly along distance, so a faster upstream brings more people per second
  for (let p = phi(-42); p < phi(DUR + 1); ) {
    p += (0.5 + rand()) / 2.6;
    const id = toks.length;
    toks.push({ id, phi: p, spawn: phiInv(p), lane: (LANES[id % 7] / 3 - 1) * 0.86, u: rand(), pat: 7 + rand() * 3 });
  }
  const reach = (k, x) => phiInv(k.phi + (x - X0) / V); // when this customer gets to x
  const lost = [[], [], [], []]; // drop times per stage
  for (const k of toks) {
    // every stage loses a few people; one stage loses the most
    if (k.u < 0.055) { k.attX = 380; k.attT = reach(k, 380); lost[0].push(k.attT); }
    else if (k.u < 0.125) { k.attX = 800; k.attT = reach(k, 800); lost[1].push(k.attT); }
  }
  const cList = toks.filter((k) => k.attX == null);
  let free = -1e9;
  for (const k of cList) {
    k.arrC = reach(k, XJ_C);
    const start = Math.max(k.arrC, free);
    if (start - k.arrC > k.pat) { k.dropC = k.leaveC = k.arrC + k.pat; lost[2].push(k.dropC); }
    else { k.startC = k.leaveC = start; free = start + 1 / (start < T_FIX ? 0.9 : 7); }
  }
  const eList = cList.filter((k) => k.startC != null);
  free = -1e9;
  for (const k of eList) {
    k.arrE = k.startC + (XJ_E - (X_C - 12)) / VS;
    const start = Math.max(k.arrE, free);
    if (start - k.arrE > 9) { k.dropE = k.leaveE = k.arrE + 9; lost[3].push(k.dropE); }
    else { k.startE = k.leaveE = start; free = start + 1 / 3.2; }
  }
  const sorted = (a) => a.slice().sort((p, q) => p - q);
  return {
    toks, cList, eList,
    PC: slotLayout(X_C, 14), PE: slotLayout(X_E, 14),
    inT: toks.map((k) => k.spawn),
    outT: sorted(eList.filter((k) => k.startE != null).map((k) => k.startE)),
    lostT: sorted(lost.flat()),
    lost: lost.map(sorted),
    slotC: new Float32Array(toks.length), slotE: new Float32Array(toks.length),
  };
}

/* Queue position of every customer at time t: how many people ahead are still
   waiting. Someone who just left fades out of the count, so the line files
   forward instead of jumping a slot. */
function fillSlots(list, t, arr, leave, out) {
  let run = 0;
  for (const k of list) {
    if (k[arr] > t) break;
    out[k.id] = run;
    run += t < k[leave] ? 1 : 1 - ss((t - k[leave]) / 0.45);
  }
}
function slotOf(list, tok, t, arr, leave) {
  let run = 0;
  for (const k of list) {
    if (k === tok || k[arr] > t) break;
    run += t < k[leave] ? 1 : 1 - ss((t - k[leave]) / 0.45);
  }
  return run;
}
const lowerBound = (a, v) => { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] < v) lo = m + 1; else hi = m; } return lo; };
/* events per second around t, through a triangular window so the gauge glides */
function rate(times, t, tau = 4) {
  let sum = 0;
  for (let i = lowerBound(times, t - tau); i < times.length && times[i] <= t; i++) sum += 1 - (t - times[i]) / tau;
  return (sum * 2) / tau;
}
const countIn = (times, a, b) => lowerBound(times, b) - lowerBound(times, a);

/* Where one customer is at time t. Writes into `o`; returns false if absent. */
function place(sim, k, t, hc, o) {
  if (t < k.spawn) return false;
  o.a = clamp((t - k.spawn) / 0.4); o.fill = 1; o.lost = false;
  const xf = X0 + V * (phi(t) - k.phi);
  const laneY = (x, h = hc) => k.lane * (halfW(x, h) - 13);
  const fall = (x, y, t0) => {
    const d = t - t0;
    if (d > 2.5) return false;
    o.x = x - 16 * ss(d / 2.5); o.y = y + easeIn(d / 2.5) * 250;
    o.a = 1 - ss((d - 1.2) / 1.3); o.fill = 0; o.lost = true;
    return true;
  };
  const waitAt = (P, slot, arr, tt) => {
    const p = slotPos(P, slot);
    const sx = Math.min(X0 + V * (phi(tt) - k.phi), p.x);
    const u = ss((tt - arr) / 0.7);
    return { x: lerp(sx, p.x, u), y: lerp(laneY(sx, throatAt(tt)), p.y, u) };
  };
  if (k.attX != null) {
    if (t < k.attT) { o.x = xf; o.y = laneY(xf); return true; }
    return fall(k.attX, laneY(k.attX), k.attT);
  }
  if (t < k.arrC) { o.x = xf; o.y = laneY(xf); return true; }
  if (t < k.leaveC) {
    const p = waitAt(sim.PC, sim.slotC[k.id], k.arrC, t);
    o.x = p.x; o.y = p.y; o.fill = 1 - clamp((t - k.arrC) / k.pat);
    return true;
  }
  if (k.dropC != null) {
    k.dpC ??= waitAt(sim.PC, slotOf(sim.cList, k, k.dropC, 'arrC', 'leaveC'), k.arrC, k.dropC);
    return fall(k.dpC.x, k.dpC.y, k.dropC);
  }
  // served at convert: leave from wherever the queue had brought it, through the throat
  const exitFrom = (s, t0, wallX0) => {
    const d = t - t0, x = s.x + VS * d;
    const hw = wallX0 == null ? halfW(x, hc) : 46;
    const y = lerp(s.y, k.lane * (hw - 13), ss(d / 0.9));
    o.x = x; o.y = clamp(y, -(hw - 9), hw - 9);
  };
  if (t < k.arrE) {
    k.spC ??= waitAt(sim.PC, slotOf(sim.cList, k, k.startC, 'arrC', 'leaveC'), k.arrC, k.startC);
    exitFrom(k.spC, k.startC);
    o.fill = clamp((t - k.startC) / 0.3);
    return true;
  }
  const waitE = (slot, tt) => {
    const p = slotPos(sim.PE, slot);
    const sx = Math.min(k.spC.x + VS * (tt - k.startC), p.x);
    const u = ss((tt - k.arrE) / 0.6);
    return { x: lerp(sx, p.x, u), y: lerp(laneY(sx, throatAt(tt)), p.y, u) };
  };
  k.spC ??= waitAt(sim.PC, slotOf(sim.cList, k, k.startC, 'arrC', 'leaveC'), k.arrC, k.startC);
  if (t < k.leaveE) {
    const p = waitE(sim.slotE[k.id], t);
    o.x = p.x; o.y = p.y; o.fill = 1 - clamp((t - k.arrE) / 9) * 0.9;
    return true;
  }
  if (k.dropE != null) {
    k.dpE ??= waitE(slotOf(sim.eList, k, k.dropE, 'arrE', 'leaveE'), k.dropE);
    return fall(k.dpE.x, k.dpE.y, k.dropE);
  }
  k.spE ??= waitE(slotOf(sim.eList, k, k.startE, 'arrE', 'leaveE'), k.startE);
  exitFrom(k.spE, k.startE, X_E);
  if (o.x > W + 20) return false;
  o.a = 1 - ss((o.x - 1830) / 70);
  return true;
}

/* ------------------------------------------------------------- the film -- */
export function boot() {
  const canvas = document.getElementById('film-canvas');
  const page = document.getElementById('aw');
  if (!canvas || !page) return;
  const ctx = canvas.getContext('2d');
  const sim = buildSim();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DISPLAY = '"Alembic Titling", Didot, Georgia, serif';
  const BODY = 'Newsreader, Georgia, serif';
  const MONO = '"IBM Plex Mono", ui-monospace, monospace';

  /* inks follow the page theme */
  const C = {};
  const readInks = () => {
    const cs = getComputedStyle(page);
    const v = (n) => cs.getPropertyValue(n).trim();
    C.ink = v('--ink'); C.mute = v('--ink-mute'); C.soft = v('--ink-soft'); C.faint = v('--line');
    C.verm = v('--aw-verm'); C.viri = v('--aw-viri'); C.ochr = v('--aw-ochr'); C.blue = v('--accent-deep');
    C.paper = getComputedStyle(canvas.closest('.film')).backgroundColor;
  };
  readInks();

  let compact = false, scale = 1, LS = 1;
  let TX = 120, TY = 690; // statement anchor
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    compact = r.height > r.width;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    scale = canvas.width / (compact ? CW : W);
    TX = compact ? 60 : 120; TY = compact ? 560 : 716;
  };

  /* ------------------------------------------------------- draw helpers -- */
  const stroke = (color, w = 1.6, dash) => { ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); };
  const seg = (x1, y1, x2, y2, p = 1) => {
    if (p <= 0) return;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, clamp(p)), lerp(y1, y2, clamp(p))); ctx.stroke();
  };
  const mono = (size, weight = 500) => { ctx.font = `${weight} ${size * LS}px ${MONO}`; if ('letterSpacing' in ctx) ctx.letterSpacing = `${size * LS * 0.1}px`; };
  const label = (text, x, y, { size = 22, color = C.ink, align = 'left', a = 1, weight = 500 } = {}) => {
    if (a <= 0.003) return;
    mono(size, weight);
    ctx.textAlign = align; ctx.fillStyle = color; ctx.globalAlpha = a;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  };
  /* a box whose outline draws itself in */
  const box = (x, y, w, h, p = 1) => {
    if (p <= 0) return;
    const L = 2 * (w + h);
    ctx.save(); ctx.setLineDash([L * clamp(p), L]); ctx.strokeRect(x, y, w, h); ctx.restore();
  };
  const hatch = (x, y, w, h, gap = 9) => {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.beginPath();
    for (let k = -h; k < w; k += gap) { ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); }
    ctx.stroke(); ctx.restore();
  };
  const tick = (x, y, p, s = 10) => { // a check mark that draws in
    if (p <= 0) return;
    ctx.beginPath(); ctx.moveTo(x - s, y);
    const u = clamp(p) * 2;
    ctx.lineTo(x - s + Math.min(u, 1) * s * 0.7, y + Math.min(u, 1) * s * 0.7);
    if (u > 1) ctx.lineTo(x - s * 0.3 + (u - 1) * s * 1.5, y + s * 0.7 - (u - 1) * s * 1.7);
    ctx.stroke();
  };
  /* the two viewports: A is the channel, B the working drawing beside the text */
  const inA = (fn) => {
    ctx.save();
    if (compact) { ctx.beginPath(); ctx.rect(0, 24, CW, 400); ctx.clip(); ctx.translate(0, 24); ctx.scale(0.664, 0.664); ctx.translate(-270, -64); }
    LS = compact ? 1.9 : 1;
    fn(); ctx.restore(); LS = 1;
  };
  const inB = (fn) => {
    ctx.save();
    if (compact) { ctx.translate(27, 716); ctx.scale(1.35, 1.35); ctx.translate(-1030, -560); }
    LS = compact ? 1.12 : 1;
    fn(); ctx.restore(); LS = 1;
  };

  /* ---------------------------------------------------------- channel --- */
  function drawChannel(t) {
    const hc = throatAt(t);
    const reveal = t < 1.5 ? lerp(0, W, easeOut(t / 1.3)) : W;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, reveal, H); ctx.clip();
    // centre line
    stroke(C.mute, 0.9, [22, 6, 3, 6]); seg(30, CY, W - 30, CY);
    // walls, with section hatching on the outside
    for (const side of [-1, 1]) {
      stroke(C.ink, 2.2);
      ctx.beginPath();
      for (let x = 30; x <= W - 30; x += 10) { const y = CY + side * halfW(x, hc); x === 30 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      stroke(C.mute, 0.8);
      ctx.beginPath();
      for (let x = 40; x <= W - 40; x += 18) { const y = CY + side * halfW(x, hc); ctx.moveTo(x, y); ctx.lineTo(x + 8, y + side * 10); }
      ctx.stroke();
    }
    // stations
    STAGES.forEach((s, i) => {
      const hw = halfW(s.x, hc), a = ss((t - 0.5 - i * 0.18) / 0.5);
      stroke(C.mute, 0.9, [3, 5]); ctx.globalAlpha = a;
      seg(s.x, 168, s.x, CY - hw - 4); seg(s.x, CY + hw + 4, s.x, CY + hw + 30);
      ctx.globalAlpha = 1;
      label(s.name, s.x, compact ? 150 : 122, { size: 24, align: 'center', a });
      if (!compact) { // the phone frame has no room for the second line
        ctx.font = `italic 400 25px ${BODY}`; ctx.textAlign = 'center'; ctx.fillStyle = C.soft; ctx.globalAlpha = a;
        ctx.fillText(s.sub, s.x, 154); ctx.globalAlpha = 1; ctx.textAlign = 'left';
      }
    });
    // the constraint takes the accent: vermilion walls at whichever stage is the neck
    const neck = (x0, a) => {
      if (a <= 0) return;
      ctx.globalAlpha = a; stroke(C.verm, 3.4);
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let x = x0 - 70; x <= x0 + 46; x += 6) { const y = CY + side * halfW(x, hc); x === x0 - 70 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    neck(X_C, ss((t - 23.2) / 0.6) * (1 - ss((t - T_FIX) / 0.5)));
    neck(X_E, env(t, 67.6, 74.4));
    // the fixed throat, just after the change lands
    const fixed = env(t, T_FIX, 66, 0.6);
    if (fixed > 0) {
      ctx.globalAlpha = fixed; stroke(C.viri, 3.2);
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let x = X_C - 70; x <= X_C + 46; x += 6) { const y = CY + side * halfW(x, hc); x === X_C - 70 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      label('FIXED', X_C, CY + hc + 62, { size: 22, color: C.viri, align: 'center', a: fixed });
    }
    ctx.restore();
  }

  const scratch = {};
  function drawTokens(t) {
    const hc = throatAt(t);
    fillSlots(sim.cList, t, 'arrC', 'leaveC', sim.slotC);
    fillSlots(sim.eList, t, 'arrE', 'leaveE', sim.slotE);
    const open = ss((t - 0.3) / 1.1);
    for (const k of sim.toks) {
      if (k.spawn > t) break;
      if (!place(sim, k, t, hc, scratch)) continue;
      const a = scratch.a * open;
      if (a <= 0.01) continue;
      const y = CY + scratch.y;
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(scratch.x, y, R, 0, Math.PI * 2);
      ctx.fillStyle = C.paper; ctx.fill();
      if (scratch.fill > 0.02) { ctx.globalAlpha = a * scratch.fill; ctx.fillStyle = C.ink; ctx.fill(); ctx.globalAlpha = a; }
      if (scratch.lost) stroke(C.soft, 1.6, [3.5, 3]); else stroke(C.ink, 1.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.setLineDash([]);
  }

  /* A revision cloud: the mark a drafter rings around the part that changes. */
  function cloud(cx, cy, rx, ry, p, fade, tag, tx, ty, align) {
    if (p <= 0 || fade <= 0) return;
    const N = 20, n = Math.ceil(clamp(p) * N);
    ctx.globalAlpha = fade; stroke(C.verm, 2);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a0 = (i / N) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / N) * Math.PI * 2 - Math.PI / 2;
      const am = (a0 + a1) / 2;
      const x0 = cx + rx * Math.cos(a0), y0 = cy + ry * Math.sin(a0);
      const x1 = cx + rx * Math.cos(a1), y1 = cy + ry * Math.sin(a1);
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cx + (rx + 26) * Math.cos(am), cy + (ry + 26) * Math.sin(am), x1, y1);
    }
    ctx.stroke(); ctx.globalAlpha = 1;
    const a = ss((p - 0.85) / 0.15) * fade;
    if (a > 0) {
      const sx = align === 'right' ? cx - rx * 0.62 : cx + rx * 0.62, sy = cy + ry * 0.86;
      ctx.globalAlpha = a; stroke(C.verm, 1.4); seg(sx, sy, tx, ty - 8); ctx.globalAlpha = 1;
      label(tag, tx + (align === 'right' ? -10 : 10), ty, { size: 25, color: C.verm, align, a, weight: 600 });
    }
  }
  function drawCallouts(t) {
    const hcNow = throatAt(t);
    const drop = env(t, 4.6, 20.2);
    if (drop > 0) {
      ctx.globalAlpha = drop; stroke(C.soft, 1.3, [5, 4]); seg(1150, 428, 1150, 478); ctx.setLineDash([]);
      stroke(C.soft, 1.3); seg(1143, 470, 1150, 480); seg(1157, 470, 1150, 480); ctx.globalAlpha = 1;
      label('DROP OFF', 1150, 512, { size: 21, color: C.soft, align: 'center', a: drop });
    }
    const fast = env(t, 11.8, 20, 0.6);
    if (fast > 0) {
      for (const s of STAGES.slice(0, 2)) {
        const y = CY + halfW(s.x, hcNow) + 60;
        label('FASTER', s.x - 8, y, { size: 22, color: C.blue, align: 'center', a: fast, weight: 600 });
        ctx.globalAlpha = fast; stroke(C.blue, 2);
        for (const dx of [58, 72]) { seg(s.x + dx - 9, y - 16, s.x + dx, y - 8); seg(s.x + dx - 9, y, s.x + dx, y - 8); }
        ctx.globalAlpha = 1;
      }
    }
    // the caliper: measure every stage, then stop on the narrow one
    if (t > 20.5 && t < 23.4) {
      const u = (t - 20.5) / 2.4;
      const x = u < 0.78 ? lerp(180, 1760, ss(u / 0.78)) : lerp(1760, X_C, ss((u - 0.78) / 0.22));
      const hw = halfW(x, throatAt(t)), a = env(t, 20.5, 23.4, 0.3);
      ctx.globalAlpha = a; stroke(C.verm, 1.6);
      seg(x, CY - hw, x, CY + hw); seg(x - 12, CY - hw, x + 12, CY - hw); seg(x - 12, CY + hw, x + 12, CY + hw);
      ctx.globalAlpha = 1;
      label('MEASURING', x, CY + hw + 34, { size: 19, color: C.verm, align: 'center', a });
    }
    const c1 = t < T_FIX ? (t - 23.1) / 1.5 : 1;
    const f1 = 1 - ss((t - T_FIX) / 0.5);
    cloud(X_C - 52, CY, 158, 112, c1, f1, 'BOTTLENECK', 1352, 482, 'left');
    const c2 = (t - 67.4) / 1.5, f2 = 1 - ss((t - 73.6) / 0.6);
    cloud(X_E - 44, CY, 132, 98, c2, f2, 'NEXT WEAK POINT', 1420, 482, 'right');
    // the change travels up into the throat it was built for
    if (t > 57.3 && t < T_FIX + 0.5) {
      const u = ss((t - 57.5) / (T_FIX - 57.5));
      const x = lerp(1010, X_C - 4, u) + Math.sin(u * Math.PI) * 40, y = lerp(520, CY, u);
      const pa = ss((t - 57.3) / 0.4) * (1 - ss((t - T_FIX) / 0.45));
      ctx.globalAlpha = pa; ctx.fillStyle = C.blue; ctx.fillRect(x - 18, y - 12, 36, 24); ctx.globalAlpha = 1;
      label('THE FIX', x - 30, y + 8, { size: 20, color: C.blue, align: 'right', a: pa * (1 - ss((t - 58.5) / 0.4)), weight: 600 });
    }
  }

  /* ----------------------------------------------- right-hand drawings --- */
  const BX = 1040;
  const thr0 = rate(sim.outT, 10); // "through" before anything changed
  function gauges(t, a, y0 = 652, gap = 92) {
    if (a <= 0) return;
    const K = 85, x0 = BX + 212;
    const rows = [
      ['ARRIVING', rate(sim.inT, t), C.ink, null],
      ['THROUGH', rate(sim.outT, t), C.ink, null],
      ['LOST', rate(sim.lostT, t), C.mute, [9, 7]],
    ];
    ctx.globalAlpha = a;
    rows.forEach(([name, v, color, dash], i) => {
      const y = y0 + i * gap;
      ctx.globalAlpha = 1; label(name, BX, y + 8, { size: 24, color: i === 2 ? C.mute : C.ink, a });
      ctx.globalAlpha = a;
      stroke(C.mute, 1); seg(x0, y - 18, x0, y + 18);
      stroke(color, i === 1 ? 7 : 4, dash); seg(x0, y, x0 + Math.max(v * K, 2), y);
      stroke(color, 1.6); seg(x0 + v * K, y - 14, x0 + v * K, y + 14);
    });
    // where "through" stood before: the mark that shows nothing moved, or how far it did
    const gy = y0 + gap, gx = x0 + thr0 * K;
    const same = env(t, 15.2, 20, 0.5), before = ss((t - T_FIX) / 0.6);
    const g = Math.max(same, before) * a;
    if (g > 0) {
      ctx.globalAlpha = g; stroke(C.verm, 1.6); seg(gx, gy - 26, gx, gy + 26); ctx.globalAlpha = 1;
      if (same > 0) label('UNCHANGED', gx, gy + 56, { size: 21, color: C.verm, align: 'center', a: same * a, weight: 600 });
      if (before > 0) label('BEFORE', gx, gy + 54, { size: 19, color: C.verm, align: 'center', a: before * a });
    }
    ctx.globalAlpha = 1;
  }

  const lostWin = sim.lost.map((arr) => countIn(arr, 2, 20));
  const lostMax = Math.max(...lostWin, 1);
  function findBars(t, a) {
    if (a <= 0) return;
    label('WHERE CUSTOMERS DROP OFF', BX, 598, { size: 22, color: C.mute, a });
    const base = 900;
    ctx.globalAlpha = a; stroke(C.ink, 1.6); seg(BX, base, 1800, base, (t - 20.6) / 0.7); ctx.globalAlpha = 1;
    STAGES.forEach((s, i) => {
      const cx = 1150 + i * 180, hgt = (lostWin[i] / lostMax) * 236 * easeOut((t - 21 - i * 0.3) / 0.9);
      const most = lostWin[i] === lostMax, hot = most ? ss((t - 23.4) / 0.6) : 0;
      ctx.globalAlpha = a;
      stroke(hot ? C.verm : C.ink, hot ? 2.2 : 1.4); ctx.strokeRect(cx - 38, base - hgt, 76, hgt);
      stroke(hot ? C.verm : C.mute, 0.9); if (hgt > 2) hatch(cx - 38, base - hgt, 76, hgt, most ? 8 : 13);
      ctx.globalAlpha = 1;
      label(s.name, cx, base + 34, { size: 20, align: 'center', color: hot ? C.verm : C.ink, a });
      if (hot) label('LOSES THE MOST', cx, base - hgt - 18, { size: 20, color: C.verm, align: 'center', a: hot * a, weight: 600 });
    });
  }

  function tree(t, a) {
    if (a <= 0) return;
    const q = t - 29;
    const node = (text, cx, y, at, color = C.ink, w = 300) => {
      const p = (q - at) / 0.8;
      ctx.globalAlpha = a; stroke(color, 1.7); box(cx - w / 2, y - 27, w, 54, p); ctx.globalAlpha = 1;
      label(text, cx - w / 2 + 18, y + 8, { size: 22, color, a: ss((q - at - 0.3) / 0.4) * a });
    };
    const link = (x1, y1, x2, y2, at) => { ctx.globalAlpha = a; stroke(C.mute, 1.1); seg(x1, y1, x2, y2, (q - at) / 0.4); ctx.globalAlpha = 1; };
    node('MORE GROWTH', 1420, 620, 0.7);
    link(1420, 647, 1420, 683, 1.5); node('MORE ADS', 1420, 710, 1.7);
    link(1420, 737, 1420, 762, 2.5); link(1420, 762, 1220, 762, 2.7); link(1420, 762, 1620, 762, 2.7);
    link(1220, 762, 1220, 783, 3.0); link(1620, 762, 1620, 783, 3.0);
    const cut = ss((q - 5.2) / 0.6); // version A stops converting: dashed, the line law for killed work
    node('VERSION A', 1220, 810, 3.2, cut > 0.5 ? C.mute : C.ink);
    node('VERSION B', 1620, 810, 3.2);
    // five customers through each version: filled ones converted
    const dots = (cx, won, color) => {
      for (let i = 0; i < 5; i++) {
        const p = ss((q - 3.7 - i * 0.24) / 0.3);
        if (p <= 0) continue;
        ctx.globalAlpha = p * a; ctx.beginPath(); ctx.arc(cx + 28 + i * 24, 810, 7, 0, Math.PI * 2);
        ctx.fillStyle = i < won ? color : C.paper; ctx.fill(); stroke(color, 1.4); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    dots(1220, 1, cut > 0.5 ? C.mute : C.ink); dots(1620, 4, C.ink);
    if (cut > 0) { // strike version A
      ctx.globalAlpha = cut * a; stroke(C.mute, 1.4, [8, 6]); seg(1070, 810, 1370, 810, cut); ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    link(1620, 837, 1620, 873, 5.7);
    node('KEEP WHAT CONVERTS', 1620, 900, 5.9, C.viri, 340);
  }

  function buildLoop(t, a) {
    if (a <= 0) return;
    const q = t - 38, rail = 742, xs = [1125, 1325, 1525, 1725], names = ['BUILD', 'REVIEW', 'TEST', 'SHIP'];
    const inks = [C.blue, C.ochr, C.ink, C.ink];
    label('REVIEWED INDEPENDENTLY · TESTED IN REAL USE', BX, 598, { size: 20, color: C.mute, a });
    ctx.globalAlpha = a; stroke(C.mute, 1.1); seg(xs[0], rail, xs[3], rail, (q - 0.5) / 0.9); ctx.globalAlpha = 1;
    names.forEach((n, i) => {
      const p = (q - 0.6 - i * 0.2) / 0.7;
      ctx.globalAlpha = a; stroke(inks[i], 1.7); box(xs[i] - 78, 790, 156, 56, p);
      stroke(C.mute, 1); seg(xs[i], rail, xs[i], 790, p); ctx.globalAlpha = 1;
      label(n, xs[i], 827, { size: 22, color: inks[i], align: 'center', a: ss(p - 0.3) * a });
    });
    // the change: built, caught once by the independent reviewer, rebuilt, passed, tested, shipped
    const hop = (from, to, t0, d) => lerp(xs[from], xs[to], ss((q - t0) / d));
    let x = xs[0], y = rail, caught = 0;
    if (q < 2.2) x = hop(0, 1, 1.2, 1.0);
    else if (q < 2.9) { x = xs[1]; caught = ss((q - 2.2) / 0.3); }
    else if (q < 4.1) { const u = ss((q - 2.9) / 1.2); x = lerp(xs[1], xs[0], u); y = rail - Math.sin(u * Math.PI) * 60; caught = 1; }
    else if (q < 4.7) { x = xs[0]; caught = 1 - ss((q - 4.1) / 0.4); }
    else if (q < 5.9) x = hop(0, 1, 4.7, 0.9);
    else if (q < 7.1) x = hop(1, 2, 5.9, 0.9);
    else x = hop(2, 3, 7.1, 0.9);
    const arc = env(t, 40.7, 43.2, 0.4);
    if (arc > 0) {
      ctx.globalAlpha = arc * a; stroke(C.ochr, 1.3, [7, 6]);
      ctx.beginPath(); ctx.moveTo(xs[1], rail - 6); ctx.quadraticCurveTo(1225, rail - 126, xs[0], rail - 6); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      label('CONFIDENT MISTAKE · CAUGHT', 1225, 644, { size: 20, color: C.ochr, align: 'center', a: arc * a });
    }
    const pa = ss((q - 0.9) / 0.4) * a;
    if (pa > 0) {
      ctx.globalAlpha = pa;
      if (caught > 0.5) { ctx.fillStyle = C.paper; ctx.fillRect(x - 18, y - 12, 36, 24); stroke(C.ochr, 1.8, [4, 3]); ctx.strokeRect(x - 18, y - 12, 36, 24); ctx.setLineDash([]); }
      else { ctx.fillStyle = C.blue; ctx.fillRect(x - 18, y - 12, 36, 24); }
      label('THE FIX', x, y - 24, { size: 19, color: caught > 0.5 ? C.ochr : C.blue, align: 'center', a: pa * (1 - arc), weight: 600 });
      ctx.globalAlpha = a;
      stroke(C.viri, 2.6); tick(xs[1] + 4, 872, (q - 5.6) / 0.35); tick(xs[2] + 4, 872, (q - 6.8) / 0.35); tick(xs[3] + 4, 872, (q - 8.0) / 0.35);
      ctx.globalAlpha = 1;
    }
  }

  /* many scored runs, before and after one change (seeded once) */
  const runs = (() => {
    const rand = rng(4242), gauss = () => (rand() + rand() + rand() + rand() - 2) / 0.58;
    const out = [], heights = new Array(26).fill(0);
    for (let b = 0; b < 2; b++) {
      for (let i = 0; i < 26; i++) {
        const v = clamp((b ? 0.64 : 0.4) + gauss() * (b ? 0.085 : 0.11), 0.03, 0.97);
        const bin = Math.floor(v * 26);
        out.push({ b, v, bin, stack: heights[bin]++, at: (b ? 3.9 : 0.8) + i * 0.08 });
      }
    }
    const mean = (b) => out.filter((r) => r.b === b).reduce((s, r) => s + r.v, 0) / 26;
    const vs = out.map((r) => r.v);
    return { out, avg: [mean(0), mean(1)], lo: Math.min(...vs), hi: Math.max(...vs) };
  })();
  function scores(t, a) {
    if (a <= 0) return;
    const q = t - 48, ax0 = 1080, ax1 = 1770, base = 868, X = (v) => lerp(ax0, ax1, v);
    label('ONE MARK PER RUN', BX, 598, { size: 22, color: C.mute, a });
    ctx.globalAlpha = a; stroke(C.ink, 1.6); seg(ax0, base, ax1, base, (q - 0.4) / 0.7); ctx.globalAlpha = 1;
    label('LOWER SCORE', ax0, base + 34, { size: 19, color: C.mute, a: ss(q - 0.8) * a });
    label('HIGHER SCORE', ax1, base + 34, { size: 19, color: C.mute, align: 'right', a: ss(q - 0.8) * a });
    for (const r of runs.out) {
      const p = easeOut((q - r.at) / 0.3);
      if (p <= 0) continue;
      const x = ax0 + (r.bin + 0.5) * ((ax1 - ax0) / 26), y = base - 13 - r.stack * 21 - (1 - p) * 34;
      ctx.globalAlpha = p * a; ctx.beginPath(); ctx.arc(x, y, 8.5, 0, Math.PI * 2);
      ctx.fillStyle = r.b ? C.viri : C.paper; ctx.fill(); stroke(r.b ? C.viri : C.mute, 1.5); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const avg = (b, at, text, yTop, align, color) => {
      const p = (q - at) / 0.5;
      if (p <= 0) return;
      ctx.globalAlpha = a; stroke(color, 1.5, [14, 5, 3, 5]); seg(X(runs.avg[b]), base, X(runs.avg[b]), yTop + 14, p); ctx.setLineDash([]); ctx.globalAlpha = 1;
      label(text, X(runs.avg[b]) + (align === 'right' ? -10 : 10), yTop + 6, { size: 20, color, align, a: ss(p - 0.6) * a, weight: 600 });
    };
    avg(0, 3.0, 'AVERAGE', 688, 'right', C.mute);
    avg(1, 6.1, 'AVERAGE AFTER THE CHANGE', 646, 'left', C.viri);
    const br = (q - 3.3) / 0.6;
    if (br > 0) { // dimension line: the full range of results
      const y = base + 62, x0 = X(runs.lo), x1 = X(runs.hi);
      ctx.globalAlpha = a; stroke(C.ink, 1.1); seg(x0, y, x1, y, br); seg(x0, y - 9, x0, y + 9); if (br >= 1) seg(x1, y - 9, x1, y + 9); ctx.globalAlpha = 1;
      label('FULL RANGE', (x0 + x1) / 2, y + 30, { size: 19, align: 'center', a: ss(br - 0.5) * a });
    }
  }

  function handover(t, a) {
    if (a <= 0) return;
    const q = t - 57;
    ['CODE', 'TOOLS', 'FLOW'].forEach((n, i) => {
      const x = BX + i * 172, p = (q - 4.6 - i * 0.35) / 0.6;
      ctx.globalAlpha = a; stroke(C.ink, 1.6); box(x, 872, 154, 54, p);
      stroke(C.viri, 2.6); tick(x + 130, 897, (q - 5.2 - i * 0.35) / 0.35, 9); ctx.globalAlpha = 1;
      label(n, x + 16, 907, { size: 22, a: ss(p - 0.3) * a });
    });
    label('RUNS ON ITS OWN SCHEDULE', BX, 962, { size: 19, color: C.mute, a: ss((q - 6.2) / 0.5) * a });
    const sp = (q - 6.5) / 0.32;
    if (sp > 0) { // the stamp comes down from just above full size
      const s = lerp(1.22, 1, easeOut(sp));
      ctx.save(); ctx.translate(1690, 900); ctx.rotate(-0.1); ctx.scale(s, s); ctx.globalAlpha = clamp(sp * 2) * a;
      stroke(C.verm, 3); ctx.strokeRect(-122, -36, 244, 72); stroke(C.verm, 1.2); ctx.strokeRect(-114, -28, 228, 56);
      ctx.restore();
      ctx.save(); ctx.translate(1690, 900); ctx.rotate(-0.1); ctx.scale(s, s);
      label('ALL YOURS', 0, 10, { size: 27, color: C.verm, align: 'center', a: clamp(sp * 2) * a, weight: 600 });
      ctx.restore();
    }
  }

  function cycle(t, a) {
    if (a <= 0) return;
    const q = t - 66, cx = 1420, cy = 772, r = 138;
    const names = ['CHECK', 'NEXT WEAK POINT', 'FIX', 'COMPARE'];
    ctx.globalAlpha = a;
    for (let i = 0; i < 4; i++) {
      const a0 = -Math.PI / 2 + i * (Math.PI / 2) + 0.2, a1 = a0 + Math.PI / 2 - 0.4, p = clamp((q - 0.6 - i * 0.35) / 0.6);
      if (p <= 0) continue;
      stroke(C.ink, 1.6); ctx.beginPath(); ctx.arc(cx, cy, r, a0, lerp(a0, a1, p)); ctx.stroke();
      if (p >= 1) { // arrowhead
        const ex = cx + r * Math.cos(a1), ey = cy + r * Math.sin(a1), ta = a1 + Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(ex - 13 * Math.cos(ta - 0.45), ey - 13 * Math.sin(ta - 0.45)); ctx.lineTo(ex, ey); ctx.lineTo(ex - 13 * Math.cos(ta + 0.45), ey - 13 * Math.sin(ta + 0.45)); ctx.stroke();
      }
      const na = -Math.PI / 2 + i * (Math.PI / 2);
      ctx.beginPath(); ctx.arc(cx + r * Math.cos(na), cy + r * Math.sin(na), 6, 0, Math.PI * 2); ctx.fillStyle = C.paper; ctx.fill(); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const la = (i) => ss((q - 0.9 - i * 0.35) / 0.5) * a;
    label(names[0], cx, cy - r - 24, { size: 22, align: 'center', a: la(0) });
    label(names[1], cx + r + 22, cy + 8, { size: 22, color: C.verm, a: la(1), weight: 600 });
    label(names[2], cx, cy + r + 40, { size: 22, align: 'center', a: la(2) });
    label(names[3], cx - r - 22, cy + 8, { size: 22, align: 'right', a: la(3) });
    const oa = ss((q - 2.2) / 0.5) * a;
    if (oa > 0) { // each round is compared with the last
      const ang = -Math.PI / 2 + ((q - 2.2) / 5.2) * Math.PI * 2;
      ctx.globalAlpha = oa; ctx.beginPath(); ctx.arc(cx + r * Math.cos(ang), cy + r * Math.sin(ang), 9, 0, Math.PI * 2); ctx.fillStyle = C.verm; ctx.fill(); ctx.globalAlpha = 1;
    }
  }

  function slate(t, a) {
    if (a <= 0) return;
    const q = t - 74;
    ctx.globalAlpha = a; stroke(C.ink, 1.6); seg(BX, 664, 1800, 664, (q - 0.8) / 0.8); ctx.globalAlpha = 1;
    label('HI@FULLBUILD.AI', BX, 748, { size: 56, color: C.blue, a: ss((q - 1.3) / 0.6) * a });
    label('RYAN ALLEN', BX, 818, { size: 24, a: ss((q - 1.8) / 0.6) * a });
    label('WEBSITES, BRANDS, AND USEFUL SOFTWARE', BX, 856, { size: 21, color: C.mute, a: ss((q - 2.0) / 0.6) * a });
  }

  /* ----------------------------------------------------------- captions -- */
  function drawCaption(t) {
    for (const c of CAPTIONS) {
      const ch = CHAPTERS[c.ch], tin = ch.a + c.at, tout = ch.b - 0.1;
      if (t < tin - 0.1 || t > tout) continue;
      const out = 1 - ss((t - (tout - 0.45)) / 0.45);
      const size = compact ? 74 : 70, lh = size * 1.12;
      label(c.kicker, TX, TY - (compact ? 96 : 92), { size: compact ? 30 : 21, color: C.mute, a: ss((t - tin) / 0.5) * out });
      ctx.font = `400 ${size}px ${DISPLAY}`;
      const space = ctx.measureText(' ').width * 1.15;
      let wi = 0;
      c.lines.forEach((ln, li) => {
        let x = TX;
        for (const word of ln.split(' ')) {
          const p = easeOut((t - tin - wi * 0.07) / 0.45);
          ctx.globalAlpha = p * out;
          ctx.fillStyle = c.hot?.includes(word) ? C.verm : C.ink;
          ctx.font = `400 ${size}px ${DISPLAY}`;
          ctx.fillText(word, x, TY + li * lh + (1 - p) * 14);
          x += ctx.measureText(word).width + space; wi++;
        }
      });
      if (c.sub) {
        const p = ss((t - tin - wi * 0.07 - 0.35) / 0.6);
        ctx.globalAlpha = p * out; ctx.fillStyle = C.soft;
        ctx.font = `italic 400 ${compact ? 44 : 40}px ${BODY}`;
        ctx.fillText(c.sub, TX, TY + (c.lines.length - 1) * lh + (compact ? 72 : 66));
      }
      ctx.globalAlpha = 1;
    }
  }

  /* -------------------------------------------------------------- frame -- */
  function frame(tRaw) {
    const t = Math.round(clamp(tRaw, 0, DUR) * 1e6) / 1e6;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, compact ? CW : W, compact ? CHH : H);
    ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.textBaseline = 'alphabetic'; ctx.setLineDash([]);
    inA(() => { drawChannel(t); drawTokens(t); drawCallouts(t); });
    inB(() => {
      gauges(t, env(t, 3.4, 20));
      findBars(t, env(t, 20.3, 29));
      tree(t, env(t, 29.3, 38));
      buildLoop(t, env(t, 38.3, 48));
      scores(t, env(t, 48.3, 57));
      gauges(t, env(t, 59.2, 66), 630, 78); handover(t, env(t, 60.5, 66));
      cycle(t, env(t, 66.3, 74));
      slate(t, env(t, 74.3, DUR + 1));
    });
    drawCaption(t);
    // the loop seam: in from paper, out to paper
    const veil = 1 - ss(t / 0.45) * (1 - ss((t - (DUR - 0.7)) / 0.7));
    if (veil > 0) { ctx.globalAlpha = veil; ctx.fillStyle = C.paper; ctx.fillRect(0, 0, compact ? CW : W, compact ? CHH : H); ctx.globalAlpha = 1; }
  }

  /* ---------------------------------------------------------- transport -- */
  const playBtn = document.getElementById('film-play');
  const scrub = document.getElementById('film-scrub');
  const timeEl = document.getElementById('film-time');
  const ticks = document.getElementById('film-ticks');
  const stepEls = [...document.querySelectorAll('#film-steps li')];
  const pad = (n) => String(Math.floor(n)).padStart(2, '0');
  let t = 0, playing = false, wanted = !reduced, visible = false, raf = 0, last = 0, lastStep = -1;

  CHAPTERS.slice(1).forEach((c) => { const i = document.createElement('i'); i.style.left = `${(c.a / DUR) * 100}%`; ticks?.appendChild(i); });
  const sync = () => {
    if (scrub && document.activeElement !== scrub) scrub.value = String(t);
    if (timeEl) timeEl.textContent = `${pad(t)} / ${DUR} S`;
    const step = (CHAPTERS.find((c) => t >= c.a && t < c.b) ?? CHAPTERS[0]).step;
    if (step !== lastStep) { lastStep = step; stepEls.forEach((li, i) => li.classList.toggle('on', i + 1 === step)); }
  };
  const render = () => { frame(t); sync(); };
  const loop = (now) => {
    raf = 0;
    if (!playing) return;
    t += Math.min((now - last) / 1000, 0.1); last = now;
    if (t >= DUR) t -= DUR;
    render();
    raf = requestAnimationFrame(loop);
  };
  const setPlaying = (on) => {
    playing = on;
    if (playBtn) { playBtn.textContent = wanted ? 'PAUSE' : 'PLAY'; playBtn.setAttribute('aria-pressed', String(wanted)); }
    if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  const want = (on) => { wanted = on; setPlaying(on && visible); };
  const seek = (v, { play } = {}) => { t = clamp(Number(v) || 0, 0, DUR - 0.001); render(); if (play) want(true); };

  playBtn?.addEventListener('click', () => want(!wanted));
  canvas.addEventListener('click', () => want(!wanted));
  scrub?.addEventListener('input', () => seek(scrub.value));
  stepEls.forEach((li) => li.querySelector('button')?.addEventListener('click', (e) => {
    seek(e.currentTarget.dataset.seek, { play: !reduced });
    canvas.closest('.film')?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }));
  new IntersectionObserver((es) => {
    es.forEach((e) => { visible = e.isIntersecting; setPlaying(wanted && visible); });
  }, { threshold: 0.3 }).observe(canvas);
  new ResizeObserver(() => { resize(); render(); }).observe(canvas);
  new MutationObserver(() => { requestAnimationFrame(() => { readInks(); render(); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // dev and capture: /about/?film=24.5 opens paused on that second
  const q = new URLSearchParams(location.search).get('film');
  if (q != null) { wanted = false; t = clamp(Number(q) || 0, 0, DUR - 0.001); }
  else if (reduced) t = 25; // one still that carries the point: the bottleneck, found
  window.__film = { seek, play: () => want(true), pause: () => want(false), get t() { return t; }, DUR, CHAPTERS, CAPTIONS, frame, stats: () => ({ lostWin, thr0, customers: sim.toks.length }) };

  resize(); setPlaying(false); render();
  document.fonts?.ready.then(() => Promise.all([
    document.fonts.load(`84px ${DISPLAY}`), document.fonts.load(`500 22px ${MONO}`), document.fonts.load(`italic 40px ${BODY}`),
  ])).then(() => { readInks(); render(); }).catch(() => {});
}
