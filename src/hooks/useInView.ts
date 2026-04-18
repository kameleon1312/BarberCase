import { useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
  rootMargin?: string;
  /** Fire only once — element stays visible after first enter (default: true) */
  once?: boolean;
}

/**
 * Returns a ref to attach to a DOM element and an `inView` boolean.
 * Uses IntersectionObserver internally — no external dependencies.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  threshold = 0.12,
  rootMargin = "0px",
  once = true,
}: Options = {}): { ref: React.RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
