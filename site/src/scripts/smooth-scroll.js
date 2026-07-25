/* Damped wheel scrolling for the About page.
   The real scroll position still moves (window.scrollTo), so sticky headers,
   the native scrollbar, anchor links and IntersectionObserver reveals all keep
   working; only the wheel's step-per-notch is smoothed into a glide. */

const LERP = 0.11;       // fraction of the remaining distance travelled per frame
const SETTLE = 0.3;      // px: close enough, snap and stop the loop
const LINE = 18;         // px per line for deltaMode 1 (Firefox)

export function boot() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // touch and trackpad-on-phone already have inertia; do not fight it
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (reduced || coarse) return;

  let target = window.scrollY;
  let current = target;
  let raf = 0;
  let driving = false;

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const tick = () => {
    const delta = target - current;
    if (Math.abs(delta) < SETTLE) {
      current = target;
      driving = true;
      window.scrollTo(0, current);
      driving = false;
      raf = 0;
      return;
    }
    current += delta * LERP;
    driving = true;
    window.scrollTo(0, current);
    driving = false;
    raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  window.addEventListener(
    'wheel',
    (e) => {
      // let the browser keep zoom and horizontal gestures
      if (e.ctrlKey || e.metaKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const step =
        e.deltaMode === 1 ? e.deltaY * LINE
        : e.deltaMode === 2 ? e.deltaY * window.innerHeight
        : e.deltaY;
      target = Math.min(maxScroll(), Math.max(0, target + step));
      kick();
    },
    { passive: false },
  );

  // keyboard, scrollbar drag, anchor jumps: adopt whatever the browser did
  window.addEventListener(
    'scroll',
    () => {
      if (driving) return;
      target = current = window.scrollY;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { passive: true },
  );

  window.addEventListener('resize', () => {
    target = Math.min(maxScroll(), target);
  });
}
