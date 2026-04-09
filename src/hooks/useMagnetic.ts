import { useCallback, useEffect, useRef } from "react";

// Disable on touch/coarse-pointer devices — native touch is already optimal
const supportsHover =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const LEAVE_TRANSITION =
  "transform 500ms cubic-bezier(0.23, 1, 0.32, 1), " +
  "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease";

const MOVE_TRANSITION =
  "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease";

export function useMagnetic(strength = 0.32) {
  const ref = useRef<HTMLButtonElement>(null);
  const rafRef = useRef(0);
  const timeoutRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const onMouseEnter = useCallback(() => {
    if (!supportsHover) return;
    const el = ref.current;
    if (!el) return;
    // Remove transform from CSS transition so hover background/shadow animate
    // but transform follows cursor instantly via RAF
    el.style.transition = MOVE_TRANSITION;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!supportsHover) return;
      const el = ref.current;
      if (!el) return;

      cancelAnimationFrame(rafRef.current);

      const cx = e.clientX;
      const cy = e.clientY;

      rafRef.current = requestAnimationFrame(() => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const dx = (cx - (left + width / 2)) * strength;
        const dy = (cy - (top + height / 2)) * strength;
        ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    if (!supportsHover) return;
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timeoutRef.current);

    const el = ref.current;
    if (!el) return;

    // Elastic spring return
    el.style.transition = LEAVE_TRANSITION;
    el.style.transform = "";

    timeoutRef.current = window.setTimeout(() => {
      if (ref.current) {
        ref.current.style.transition = "";
      }
    }, 520);
  }, []);

  if (!supportsHover) {
    return { ref, onMouseEnter: undefined, onMouseMove: undefined, onMouseLeave: undefined };
  }

  return { ref, onMouseEnter, onMouseMove, onMouseLeave };
}
