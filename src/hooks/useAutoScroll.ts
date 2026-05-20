import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useAutoScroll — smooth circular auto-scroll engine.
 *
 * Behavior:
 *  - Detects whether content actually overflows the container.
 *  - If NOT overflowing → content stays static, no auto-scroll, arrows no-op.
 *  - If overflowing     → infinite circular auto-scroll starts immediately
 *    after render, pauses on hover, resumes on un-hover. Arrows tween
 *    smoothly via rAF without fighting the loop.
 *
 * Consumer contract:
 *  - The hook returns `shouldScroll`. When `shouldScroll === true`, the
 *    consumer MUST render the list duplicated back-to-back so the wrap
 *    from scrollHeight/2 back to 0 looks seamless. When `false`, the
 *    consumer should render the list once.
 */
export function useAutoScroll<T extends HTMLElement>(
  pixelsPerSecond = 30,
  paused = false,
) {
  const ref = useRef<T | null>(null);
  const posRef = useRef(0);
  const manualActiveRef = useRef(false);
  const [shouldScroll, setShouldScroll] = useState(false);

  // Measure overflow. When the consumer is rendering duplicated content the
  // "natural" content height is scrollHeight / 2; when single, it's scrollHeight.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const naturalHeight = shouldScroll ? el.scrollHeight / 2 : el.scrollHeight;
      const overflows = naturalHeight > el.clientHeight + 4;
      setShouldScroll((prev) => (prev === overflows ? prev : overflows));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [shouldScroll]);

  // Auto-scroll loop — only runs when overflow exists and not paused.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!shouldScroll) {
      el.scrollTop = 0;
      posRef.current = 0;
      return;
    }
    if (paused) return;

    posRef.current = el.scrollTop;
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
        posRef.current = el2.scrollTop;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldScroll, paused, pixelsPerSecond]);

  const scrollByAmount = useCallback((delta: number) => {
    const el = ref.current;
    if (!el || !shouldScroll) return;
    const half = el.scrollHeight / 2 || el.scrollHeight || 1;
    const start = el.scrollTop;
    const wrap = (v: number) => {
      let n = v;
      while (n < 0) n += half;
      while (n >= half) n -= half;
      return n;
    };
    const end = wrap(start + delta);
    let travel = end - start;
    if (travel > half / 2) travel -= half;
    if (travel < -half / 2) travel += half;

    const duration = Math.min(450, 180 + Math.abs(travel) * 1.2);
    const startTime = performance.now();
    manualActiveRef.current = true;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const v = wrap(start + travel * ease(t));
      posRef.current = v;
      if (ref.current) ref.current.scrollTop = v;
      if (t < 1) requestAnimationFrame(step);
      else manualActiveRef.current = false;
    };
    requestAnimationFrame(step);
  }, [shouldScroll]);

  return { ref, scrollByAmount, shouldScroll };
}
