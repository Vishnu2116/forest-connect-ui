import { useEffect, useRef, useCallback } from "react";

/**
 * useAutoScroll — shared smooth auto-scroll engine.
 *
 * Used by (src/pages/Index.tsx):
 *   - UpdatesPanel         (What's New / Notifications / Tenders)
 *   - ProjectHighlightsColumn
 *
 * SPEED is controlled at the call site:
 *   - AUTO_SCROLL_SPEED_UPDATES  (Index.tsx)
 *   - AUTO_SCROLL_SPEED_PROJECTS (Index.tsx)
 *
 * The list rendered inside the scroll container MUST be duplicated
 * (rendered twice back-to-back) so wrapping scrollTop back to 0 looks seamless.
 *
 * Smoothness notes:
 *   - We drive scrollTop on every animation frame using a sub-pixel accumulator,
 *     so motion stays continuous even at low speeds.
 *   - The CSS `scroll-behavior: smooth` MUST NOT be applied to the container,
 *     because it would interpolate every per-frame scrollTop write and cause
 *     jitter. Manual arrow clicks animate themselves (rAF tween) and briefly
 *     pause the auto-scroll loop to avoid fighting.
 */
export function useAutoScroll<T extends HTMLElement>(
  pixelsPerSecond = 30,
  paused = false,
) {
  const ref = useRef<T | null>(null);
  // Sub-pixel position accumulator so slow speeds still move smoothly.
  const posRef = useRef(0);
  // Auto-scroll is suppressed while a manual tween is running.
  const manualActiveRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Keep accumulator in sync if something else moved the scroll position.
    posRef.current = el.scrollTop;
    if (paused) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const el2 = ref.current;
      if (el2 && !manualActiveRef.current) {
        const half = el2.scrollHeight / 2;
        if (half > 0) {
          let next = posRef.current + pixelsPerSecond * dt;
          if (next >= half) next -= half;
          if (next < 0) next += half;
          posRef.current = next;
          el2.scrollTop = next;
        }
      } else if (el2) {
        // While manual tween runs, keep accumulator aligned with DOM.
        posRef.current = el2.scrollTop;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pixelsPerSecond, paused]);

  // Smooth manual scroll using a self-managed rAF tween (so it works even
  // when the container has no native `scroll-behavior: smooth`, and so we
  // can pause the auto-scroll loop during the tween).
  const scrollByAmount = useCallback((delta: number) => {
    const el = ref.current;
    if (!el) return;
    const half = el.scrollHeight / 2 || el.scrollHeight || 1;
    const start = el.scrollTop;
    const wrap = (v: number) => {
      let n = v;
      while (n < 0) n += half;
      while (n >= half) n -= half;
      return n;
    };
    const end = wrap(start + delta);
    // Pick the shortest direction around the circular buffer.
    let travel = end - start;
    if (travel > half / 2) travel -= half;
    if (travel < -half / 2) travel += half;

    const duration = Math.min(450, 180 + Math.abs(travel) * 1.2);
    const startTime = performance.now();
    manualActiveRef.current = true;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const v = wrap(start + travel * ease(t));
      posRef.current = v;
      if (ref.current) ref.current.scrollTop = v;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        manualActiveRef.current = false;
      }
    };
    requestAnimationFrame(step);
  }, []);

  return { ref, scrollByAmount };
}
