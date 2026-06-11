"use client";

import { useEffect, useRef } from "react";

type CursorMode = "dot" | "link" | "reservar";

const SIZES: Record<CursorMode, { w: number; h: number }> = {
  dot: { w: 12, h: 12 },
  link: { w: 40, h: 40 },
  reservar: { w: 112, h: 40 },
};

/**
 * Cursor custom: punto naranja que sigue al puntero con lerp.
 * Sobre los pases del menú ([data-cursor="reservar"]) se expande
 * a una pill con el texto "Reservar". Desactivado en touch; con
 * prefers-reduced-motion el seguimiento es directo, sin lerp.
 */
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
    const label = root.querySelector<HTMLSpanElement>("[data-label]")!;

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let visible = false;
    let mode: CursorMode = "dot";
    let rafId = 0;

    const setMode = (m: CursorMode) => {
      if (mode === m) return;
      mode = m;
      pill.style.width = `${SIZES[m].w}px`;
      pill.style.height = `${SIZES[m].h}px`;
      pill.style.opacity = m === "link" ? "0.85" : "1";
      label.style.opacity = m === "reservar" ? "1" : "0";
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
        '[data-cursor="reservar"], a, button, [role="button"], input, select, textarea, label'
      );
      if (!t) setMode("dot");
      else if (t.matches('[data-cursor="reservar"]')) setMode("reservar");
      else if (t.matches("input, select, textarea, label")) setMode("dot");
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
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden opacity-0 transition-opacity duration-300"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div
          data-pill
          className="flex h-3 w-3 items-center justify-center rounded-full bg-ember transition-[width,height,opacity] duration-300 [transition-timing-function:var(--ease-brasa)]"
        />
        <span
          data-label
          className="absolute inset-0 flex items-center justify-center text-[13px] font-medium tracking-wide text-ash opacity-0 transition-opacity duration-200"
        >
          Reservar
        </span>
      </div>
    </div>
  );
}
