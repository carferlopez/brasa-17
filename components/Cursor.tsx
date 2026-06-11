"use client";

import { useEffect, useRef } from "react";

type CursorMode = "dot" | "link" | "dish";

const SIZES: Record<CursorMode, number> = {
  dot: 12,
  link: 40,
  dish: 44,
};

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const root = rootRef.current;
    if (!fine.matches || !root) return;

    document.documentElement.classList.add("has-custom-cursor");
    root.style.display = "block";

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const pill = root.querySelector<HTMLDivElement>("[data-pill]")!;
    const plus = root.querySelector<SVGElement>("[data-plus]")!;

    // Estado inicial: punto ember relleno
    pill.style.backgroundColor = "#ff6b00";
    pill.style.boxShadow = "none";

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let visible = false;
    let mode: CursorMode = "dot";
    let rafId = 0;

    const setMode = (m: CursorMode) => {
      if (mode === m) return;
      mode = m;
      pill.style.width = `${SIZES[m]}px`;
      pill.style.height = `${SIZES[m]}px`;

      if (m === "dish") {
        // Círculo con fondo semitransparente, borde ember y «+» ember
        pill.style.backgroundColor = "rgba(0,0,0,0.35)";
        pill.style.boxShadow = "inset 0 0 0 1.5px #ff6b00";
        pill.style.opacity = "1";
        plus.style.opacity = "1";
      } else {
        // Punto/bola ember rellena
        pill.style.backgroundColor = "#ff6b00";
        pill.style.boxShadow = "none";
        pill.style.opacity = m === "link" ? "0.85" : "1";
        plus.style.opacity = "0";
      }
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        pos.x = target.x;
        pos.y = target.y;
        visible = true;
        root.style.opacity = "1";
      }
      const t = (e.target as Element | null)?.closest?.(
        'a, button, [role="button"], input, select, textarea, label'
      );
      if (!t || t.matches("input, select, textarea, label")) setMode("dot");
      else if (t.matches('[data-cursor="dish"]') || !!t.closest('[data-cursor="dish"]')) setMode("dish");
      else setMode("link");
    };

    const onLeave = () => {
      visible = false;
      root.style.opacity = "0";
    };

    const tick = () => {
      const k = reduced ? 1 : 0.18;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      root.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[100] hidden opacity-0 transition-opacity duration-300"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div
          data-pill
          className="flex items-center justify-center h-3 w-3 rounded-full transition-[width,height,opacity,background-color,box-shadow] duration-300 [transition-timing-function:var(--ease-brasa)]"
        >
          <svg
            data-plus
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-[14px] w-[14px] shrink-0 opacity-0 transition-opacity duration-200"
            fill="none"
            stroke="#ff6b00"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 2v12M2 8h12" />
          </svg>
        </div>
      </div>
    </div>
  );
}
