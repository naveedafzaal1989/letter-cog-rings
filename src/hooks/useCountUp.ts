import { useEffect, useRef, useState } from 'react';

/** Counts the displayed number up to `value` over `durationMs`. */
export function useCountUp(value: number, durationMs: number = 700): number {
  const [shown, setShown] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    if (from === value) {
      return;
    }
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const t = Math.min(1, (Date.now() - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (t >= 1) {
        fromRef.current = value;
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [value, durationMs]);

  return shown;
}
