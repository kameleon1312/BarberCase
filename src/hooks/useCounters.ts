import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

type CounterConfig = {
  target: number;
  duration?: number;
  decimals?: number;
};

/**
 * Animates multiple counters with a single shared RAF loop.
 * Returns formatted string values, one per config entry.
 */
export function useCounters(configs: CounterConfig[], start: boolean): string[] {
  const [values, setValues] = useState<number[]>(() => configs.map(() => 0));
  const rafRef = useRef(0);
  const startedRef = useRef(false);
  const configsRef = useRef(configs);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    const cfgs = configsRef.current;
    const maxDuration = Math.max(...cfgs.map((c) => c.duration ?? 1400));

    const tick = (now: number) => {
      const elapsed = now - startTime;

      setValues(
        cfgs.map(({ target, duration = 1400 }) => {
          const progress = Math.min(elapsed / duration, 1);
          return easeOutCubic(progress) * target;
        })
      );

      if (elapsed < maxDuration) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [start]);

  return values.map((v, i) => v.toFixed(configsRef.current[i]?.decimals ?? 0));
}
