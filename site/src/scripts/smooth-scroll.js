/* Damped wheel scrolling for the About page.
   The real scroll position still moves (window.scrollTo), so sticky headers,
   the native scrollbar, anchor links and IntersectionObserver reveals all keep
   working; only the wheel's step-per-notch is smoothed into a glide.
   Every write is behavior:'instant'. The site sets html { scroll-behavior: smooth },
   and letting that apply would start a fresh CSS animation on every frame. */

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

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const tick = () => {
    const delta = target - current;
    if (Math.abs(delta) < SETTLE) {
      current = target;
      window.scrollTo({ top: current, behavior: 'instant' });
      raf = 0;
      return;
    }
    current += delta * LERP;
    window.scrollTo({ top: current, behavior: 'instant' });
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

  // keyboard, scrollbar drag, anchor jumps: adopt whatever the browser did.
  // Scroll events fire asynchronously, so a flag around scrollTo cannot tell
  // our own writes apart; compare against the position we last wrote instead.
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (Math.abs(y - current) < 2) return; // our own write, echoing back
      target = current = y;
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
