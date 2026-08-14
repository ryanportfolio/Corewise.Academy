/* The graduated edge: the site's scrollbar.

   A star atlas graduates the coordinate edge of every plate: a hairline down the
   margin, minor ticks, longer labelled majors. The browser scrollbar sits exactly
   where that edge belongs, so here it is that edge. The bracket riding it is your
   field of view. The stars on it are the document's real <h2> sections, plotted at
   their measured offsets, exactly as many stars as there are headings.

   Coordinate model: the rail's height maps the WHOLE document, so a point at
   document offset y sits at y / docH * trackH. The bracket spans the visible window
   under the same mapping, which makes "star inside the bracket" mean exactly
   "heading on screen".

   Progressive enhancement: the native scrollbar is hidden by the .has-atlas-rail
   class, which is added only after this mounts. No script, no hiding.

   Everything is namespaced .atlas-rail: the About page already owns .rail and
   .rail-rule for its margin asides.
*/

const MIN_BRACKET = 28; // px: below this the bracket is too small to grab
const MIN_TICK_GAP = 9; // px: closer than this and the graduation is mush
const MIN_LABEL_GAP = 21; // px between catalogue names: one 2xs line plus air
const STAR_HIT = 22; // px tall click target per star
const STAR_PATH = 'M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z';
const NS = 'http://www.w3.org/2000/svg';

export function boot() {
  // touch devices already have overlay scrollbars that behave well; leave them alone
  if (matchMedia('(pointer: coarse)').matches || !matchMedia('(hover: hover)').matches) return;

  const rail = el('div', 'atlas-rail');
  rail.setAttribute('aria-hidden', 'true');
  const ticks = el('div', 'ticks');
  const nums = el('div', 'nums');
  const names = el('div', 'names');
  const stars = el('div', 'stars');
  const field = el('div', 'field');
  field.append(el('span', 'corner top'), el('span', 'corner bot'));
  rail.append(el('div', 'rule'), ticks, nums, names, stars, field);
  document.body.appendChild(rail);
  document.documentElement.classList.add('has-atlas-rail');

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  let trackH = 0;
  let docH = 0;
  let rawH = 0; // the scrollHeight measure() last drew from, unclamped
  let viewH = 0;
  let bracketH = MIN_BRACKET;
  let fieldTop = 0;
  let headH = 0; // the sticky masthead: the catalogue never opens across it
  let scrollable = false;
  let marks = [];

  /* ---- measure and draw ---------------------------------------------- */

  const measure = () => {
    trackH = rail.clientHeight;
    viewH = window.innerHeight;
    const head = document.querySelector('.masthead');
    headH = head ? head.offsetHeight : 0;
    rail.style.setProperty('--atlas-head', `${headH}px`);
    rawH = document.documentElement.scrollHeight;
    docH = Math.max(rawH, viewH);
    scrollable = docH - viewH > 40;
    rail.classList.toggle('is-idle', !scrollable);
    if (!scrollable) return;
    bracketH = Math.max(MIN_BRACKET, (viewH / docH) * trackH);
    field.style.height = `${bracketH}px`;
    drawTicks();
    drawStars();
  };

  // One minor tick per viewport height of document, so the tick density reports the
  // document's length in screens. Every fifth is a labelled major. If the minors
  // would crowd, the unit multiplies by five until they clear.
  const drawTicks = () => {
    let unit = viewH;
    while ((unit / docH) * trackH < MIN_TICK_GAP) unit *= 5;
    ticks.textContent = '';
    nums.textContent = '';
    for (let i = 1; i * unit < docH; i += 1) {
      const top = ((i * unit) / docH) * trackH;
      const major = i % 5 === 0;
      const t = el('i', major ? 'tick major' : 'tick');
      t.style.top = `${top}px`;
      ticks.appendChild(t);
      if (!major || top < headH + 8) continue;
      const n = el('span', 'num');
      n.style.top = `${top}px`;
      n.textContent = String(Math.round((i * unit) / viewH)).padStart(2, '0');
      nums.appendChild(n);
    }
  };

  // Exactly one star per rendered <h2>, at its measured offset. No extras.
  const drawStars = () => {
    stars.textContent = '';
    names.textContent = '';
    marks = [...document.querySelectorAll('h2')]
      .filter((h) => h.offsetParent !== null)
      .map((h) => {
        const docY = docTop(h);
        const y = Math.min(trackH, Math.max(0, (docY / docH) * trackH));

        const star = document.createElementNS(NS, 'svg');
        star.setAttribute('viewBox', '0 0 12 12');
        star.setAttribute('class', 'star');
        star.style.top = `${y}px`;
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', STAR_PATH);
        star.appendChild(path);

        const hit = el('button', 'star-hit');
        hit.type = 'button';
        hit.tabIndex = -1;
        hit.style.top = `${y - STAR_HIT / 2}px`;
        hit.addEventListener('click', (e) => {
          e.stopPropagation();
          goTo(docY);
        });
        stars.append(star, hit);

        // guide sections carry their number in a .sec-no span; keep it a numeral,
        // not the first two characters of the title
        const name = el('span', 'name');
        const no = h.querySelector('.sec-no');
        if (no) {
          const numeral = el('i', 'no');
          numeral.textContent = no.textContent.trim();
          name.append(numeral, headingText(h));
        } else {
          name.textContent = headingText(h);
        }
        names.appendChild(name);

        return { docY, y, star, name };
      });

    // catalogue names never overlap: push each below the last, drop what runs off
    let lastY = -Infinity;
    for (const m of marks) {
      const y = Math.max(m.y, lastY + MIN_LABEL_GAP);
      if (y > trackH - 8 || y < headH + 8) {
        m.name.remove();
        continue;
      }
      m.name.style.top = `${y}px`;
      lastY = y;
    }
  };

  /* ---- track the scroll position -------------------------------------- */

  let raf = 0;
  const paint = () => {
    raf = 0;
    if (!scrollable) return;
    // Read before writing: the document can change height under us with no event
    // we listen for, and a rail drawn to a stale height lies about where you are.
    if (document.documentElement.scrollHeight !== rawH) {
      measure();
      if (!scrollable) return;
    }
    const sy = window.scrollY;
    fieldTop = Math.max(0, Math.min(trackH - bracketH, (sy / docH) * trackH));
    field.style.transform = `translateY(${fieldTop}px)`;
    const hi = sy + viewH;
    for (const m of marks) m.star.classList.toggle('lit', m.docY >= sy && m.docY <= hi);
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(paint);
  };

  /* ---- drag, jump, navigate ------------------------------------------- */

  const scrollTo = (top, smooth) => {
    window.scrollTo({
      top: Math.min(Math.max(0, docH - viewH), Math.max(0, top)),
      behavior: smooth && !reduced() ? 'smooth' : 'instant',
    });
  };

  // land the heading below the sticky masthead rather than under it
  const goTo = (docY) => {
    const head = document.querySelector('.masthead');
    scrollTo(docY - (head ? head.offsetHeight : 0) - 16, true);
  };

  // a rail y (0..trackH) is the scroll position that puts the field's top there
  const scrollForRailY = (y) => (y / trackH) * docH;
  const railY = (clientY) => clientY - rail.getBoundingClientRect().top;

  // Dragging listens on the window rather than the bracket, so the drag survives
  // the pointer wandering off the 30px strip, exactly as a native scrollbar does.
  let grab = null; // px from the field's top edge to the pointer
  let dragged = false;
  const onDragMove = (e) => {
    scrollTo(scrollForRailY(railY(e.clientY) - grab), false);
    schedule();
  };
  const endDrag = () => {
    if (grab === null) return;
    grab = null;
    dragged = true;
    removeEventListener('pointermove', onDragMove);
    removeEventListener('pointerup', endDrag);
    removeEventListener('pointercancel', endDrag);
    rail.classList.remove('is-dragging');
    document.body.classList.remove('atlas-rail-dragging');
  };
  field.addEventListener('pointerdown', (e) => {
    if (!scrollable) return;
    e.preventDefault();
    grab = railY(e.clientY) - fieldTop;
    addEventListener('pointermove', onDragMove);
    addEventListener('pointerup', endDrag);
    addEventListener('pointercancel', endDrag);
    rail.classList.add('is-dragging');
    document.body.classList.add('atlas-rail-dragging');
  });

  // clicking the edge jumps the field there, centred on the click. A drag that
  // ends over the track raises a click too; that one is not a jump. Every fresh
  // press clears the flag, so a drag whose click never lands cannot eat the next one.
  rail.addEventListener('pointerdown', () => { dragged = false; }, true);
  rail.addEventListener('click', (e) => {
    if (dragged) {
      dragged = false;
      return;
    }
    if (!scrollable || e.target.closest('.field, .star-hit')) return;
    scrollTo(scrollForRailY(railY(e.clientY) - bracketH / 2), true);
  });

  /* ---- stay honest as the page changes -------------------------------- */

  let mraf = 0;
  const scheduleMeasure = () => {
    if (mraf) return;
    mraf = requestAnimationFrame(() => {
      mraf = 0;
      measure();
      paint();
    });
  };

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', scheduleMeasure);
  addEventListener('load', scheduleMeasure);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleMeasure).observe(document.body);
  // an FAQ closing shortens the page while nothing scrolls; toggle does not bubble
  document.addEventListener('toggle', scheduleMeasure, true);
  // fonts land after first paint and move every heading with them
  if (document.fonts) document.fonts.ready.then(scheduleMeasure);

  measure();
  paint();
}

// Layout offset, not getBoundingClientRect: a heading inside an unrevealed
// .reveal block still carries its translateY, and the star belongs where the
// heading will settle, not where a transient transform is holding it.
function docTop(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}

function headingText(h) {
  return [...h.childNodes]
    .filter((n) => !(n.nodeType === 1 && n.classList.contains('sec-no')))
    .map((n) => n.textContent)
    .join('')
    .trim();
}

function el(tag, className) {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}
