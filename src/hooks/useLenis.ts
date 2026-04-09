import { useEffect, useRef } from "react";
import Lenis from "lenis";

const HEADER_OFFSET = -84;

const isCoarsePointer =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

export function useLenis(disabled = false, paused = false) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (disabled || isCoarsePointer) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const loop = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // Intercept anchor clicks so Lenis handles the scroll (not the browser)
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: HEADER_OFFSET });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disabled]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (paused) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [paused]);
}
