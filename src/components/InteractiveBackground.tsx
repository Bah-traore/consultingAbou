"use client";

import { useEffect, useRef, useState } from "react";

type InteractiveBackgroundProps = {
  children: React.ReactNode;
};

export default function InteractiveBackground({
  children,
}: InteractiveBackgroundProps) {
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const [pos, setPos] = useState({ x: 0.5, y: 0.12 });

  useEffect(() => {
    const update = () => {
      rafRef.current = null;
      const next = pendingRef.current;
      if (!next) return;
      pendingRef.current = null;
      setPos(next);
    };

    const onMove = (event: PointerEvent) => {
      const x = event.clientX / Math.max(1, window.innerWidth);
      const y = event.clientY / Math.max(1, window.innerHeight);
      pendingRef.current = { x, y };
      if (rafRef.current == null) {
        rafRef.current = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-[radial-gradient(900px_circle_at_var(--mx)_var(--my),hsl(var(--secondary)/0.22),transparent_56%),radial-gradient(950px_circle_at_calc(100%_-_var(--mx))_calc(14%_+_var(--my)),hsl(var(--primary)/0.18),transparent_54%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]"
      style={{
        // Use percentages so Tailwind arbitrary values can consume it with var()
        // Example: --mx: 40%; --my: 20%
        ["--mx" as any]: `${Math.round(pos.x * 100)}%`,
        ["--my" as any]: `${Math.round(pos.y * 100)}%`,
      }}
    >
      {children}
    </div>
  );
}
