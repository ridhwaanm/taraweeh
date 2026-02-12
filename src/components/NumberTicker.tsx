import { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  className?: string;
}

export function NumberTicker({ value, className = "" }: NumberTickerProps) {
  const [display, setDisplay] = useState(value);
  const ref = useRef({ value, raf: 0 });

  useEffect(() => {
    const start = ref.current.value;
    const end = value;
    if (start === end) return;

    const duration = 400; // ms
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        ref.current.raf = requestAnimationFrame(tick);
      } else {
        ref.current.value = end;
      }
    };

    ref.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current.raf);
  }, [value]);

  return <span className={className}>{display}</span>;
}
