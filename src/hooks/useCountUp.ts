import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Raqamlar o'zgarganda silliq count-up animatsiyasi.
 * prefers-reduced-motion yoqilganida yoki test muhitida qiymatni darhol qaytaradi.
 */
export function useCountUp(target: number, durationMs = 280): number {
  const prefersReducedMotion = useReducedMotion();
  const isTestEnv = import.meta.env.MODE === 'test';
  const [displayValue, setDisplayValue] = useState<number>(target);
  const previousRef = useRef<number>(target);

  useEffect(() => {
    if (prefersReducedMotion || isTestEnv || durationMs <= 0) {
      setDisplayValue(target);
      previousRef.current = target;
      return;
    }

    const startValue = previousRef.current;
    const diff = target - startValue;

    if (diff === 0) {
      setDisplayValue(target);
      return;
    }

    let animationFrameId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * eased);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        previousRef.current = target;
        setDisplayValue(target);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      previousRef.current = target;
    };
  }, [target, durationMs, prefersReducedMotion, isTestEnv]);

  return prefersReducedMotion || isTestEnv ? target : displayValue;
}
