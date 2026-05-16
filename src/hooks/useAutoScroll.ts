import { useEffect, useRef, useCallback } from "react";

/**
 * useAutoScroll — shared auto-scroll engine.
 *
 * Used by:
 *   - src/pages/Index.tsx → UpdatesPanel  (What's New / Notifications / Tenders)
 *   - src/pages/Index.tsx → Project Highlights column
 *
 * AUTO-SCROLL SPEED:
 *   Speed is controlled by the `pixelsPerSecond` argument passed where this
 *   hook is called. To change a section's speed later, update the number
 *   passed to `useAutoScroll(...)` in that section.
 *
 *     UpdatesPanel        → `AUTO_SCROLL_SPEED_UPDATES`        in Index.tsx
 *     Project Highlights  → `AUTO_SCROLL_SPEED_PROJECTS`       in Index.tsx
 *
 * The list passed in should be DUPLICATED (content rendered twice back-to-back)
 * so that when the first half is fully scrolled, scrollTop wraps to 0 and the
 * loop appears seamless.
 *
 * @param pixelsPerSecond  Scroll speed in CSS pixels per second.
 * @param paused           When true, auto-scroll is paused (hover / manual).
 */
export function useAutoScroll<T extends HTMLElement>(
  pixelsPerSecond = 30,
  paused = false,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const half = el.scrollHeight / 2;
      if (half > 0) {
        let next = el.scrollTop + pixelsPerSecond * dt;
        if (next >= half) next -= half;
        el.scrollTop = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pixelsPerSecond, paused]);

  const scrollByAmount = useCallback((delta: number) => {
    const el = ref.current;
    if (!el) return;
    const half = el.scrollHeight / 2 || el.scrollHeight || 1;
    let next = el.scrollTop + delta;
    while (next < 0) next += half;
    while (next >= half) next -= half;
    el.scrollTo({ top: next, behavior: "smooth" });
  }, []);

  return { ref, scrollByAmount };
}
