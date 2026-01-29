import type { RefObject } from "react";
import { useEffect, useState } from "react";

type UseInViewOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
};

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  options: UseInViewOptions = {}
) {
  const { root = null, rootMargin = "0px 0px -10% 0px", threshold = 0.15, once = true } =
    options;

  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window === "undefined") return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, root, rootMargin, threshold, once]);

  return isInView;
}
