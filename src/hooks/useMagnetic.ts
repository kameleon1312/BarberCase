import { useCallback, useEffect, useRef } from "react";

const supportsHover =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const LEAVE_TRANSITION =
  "transform 500ms cubic-bezier(0.23, 1, 0.32, 1), " +
  "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease";

const MOVE_TRANSITION =
  "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease";

export function useMagnetic(strength = 0.32) {
  const rafRef = useRef(0);
  const timeoutRef = useRef(0);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const onMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transition = MOVE_TRANSITION;
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      cancelAnimationFrame(rafRef.current);
      const cx = e.clientX;
      const cy = e.clientY;
      const el = e.currentTarget;

      rafRef.current = requestAnimationFrame(() => {
        if (!el.isConnected) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const dx = (cx - (left + width / 2)) * strength;
        const dy = (cy - (top + height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    },
    [strength]
  );

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timeoutRef.current);
    const el = e.currentTarget;
    el.style.transition = LEAVE_TRANSITION;
    el.style.transform = "";
    timeoutRef.current = window.setTimeout(() => {
      if (el.isConnected) el.style.transition = "";
    }, 520);
  }, []);

  if (!supportsHover) {
    return { onMouseEnter: undefined, onMouseMove: undefined, onMouseLeave: undefined };
  }

  return { onMouseEnter, onMouseMove, onMouseLeave };
}
