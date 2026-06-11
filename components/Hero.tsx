"use client";

import { useEffect, useRef, useState } from "react";
import { MediaVideo } from "@/components/Media";
import { scrollToAnchor } from "@/lib/lenis";

const COUNT_DURATION = 1000;

/**
 * Preloader + Hero, sin framer-motion: todas las animaciones de entrada
 * son CSS (keyframes/transitions en el compositor) y el contador escribe
 * en el DOM imperativamente. Así framer-motion queda fuera del bundle
 * inicial y el main thread libre durante la carga — clave para el TBT.
 */
export default function Hero({ media }: { media: string[] }) {
  // loading → exit (cortina subiendo) → done (preloader desmontado)
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    let rafId = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_DURATION);
      // ease-out: el contador frena al acercarse al 17
      const n = Math.round((1 - Math.pow(1 - p, 3)) * 17);
      if (countRef.current) {
        countRef.current.textContent = String(n).padStart(2, "0");
      }
      if (p < 1) rafId = requestAnimationFrame(tick);
      else timeout = setTimeout(() => setPhase("exit"), 150);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeout);
    };
  }, []);

  // Bloquea el scroll mientras el preloader está en pantalla
  useEffect(() => {
    document.documentElement.style.overflow = phase === "loading" ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  // Red de seguridad: si la pestaña está en segundo plano el navegador
  // congela las transiciones CSS y transitionend nunca llega — pasado
  // un margen, desmontamos el preloader igualmente.
  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(() => setPhase("done"), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  // Las animaciones del hero arrancan a la vez que la cortina sube
  const intro = phase !== "loading";

  return (
    <header
      className={`relative h-[100svh] overflow-hidden ${intro ? "hero-intro" : ""}`}
    >
      {phase !== "done" && (
        <div
          className={`preloader-curtain fixed inset-0 z-[80] flex items-end bg-ash ${
            phase === "exit" ? "is-exiting" : ""
          }`}
          onTransitionEnd={() => setPhase("done")}
          aria-hidden="true"
        >
          <div className="flex w-full items-end justify-between p-6 md:p-10">
            <span className="text-xs uppercase tracking-[0.3em] text-bone/60">
              Madrid — frente al fuego
            </span>
            <span
              ref={countRef}
              className="font-medium leading-none text-bone tabular-nums [font-size:clamp(7rem,36vw,16rem)]"
            >
              00
            </span>
          </div>
        </div>
      )}

      {/* Vídeo de fondo */}
      <div className="absolute inset-0">
        <MediaVideo src="hero-loop.mp4" media={media} eager />
        <div className="absolute inset-0 bg-gradient-to-t from-ash via-ash/20 to-ash/40" />
      </div>

      {/* Logo + claim */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <h1 className="font-bold leading-[0.85] tracking-[-0.03em] text-bone [font-size:17vw]">
          <span className="block overflow-hidden">
            <span className="hero-line block" style={{ animationDelay: "0.05s" }}>
              Brasa
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block" style={{ animationDelay: "0.17s" }}>
              <span className="text-ember">17</span>
              <span className="sr-only"> — restaurante de brasa en Madrid</span>
            </span>
          </span>
        </h1>

        <div
          className="hero-fade mt-8 flex flex-col gap-6 opacity-0 [animation-delay:0.5s] md:mt-10 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-[16ch] text-lg leading-tight text-bone/80 md:text-xl">
            Diecisiete sitios frente al fuego
          </p>
          <a
            href="#reservas"
            onClick={(e) => {
              e.preventDefault();
              scrollToAnchor("#reservas");
            }}
            className="inline-flex w-fit items-center gap-3 border border-bone/30 px-7 py-3.5 text-sm uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-ember hover:bg-ember hover:text-ash"
          >
            Reservar
            <span aria-hidden="true" className="text-ember">
              ↓
            </span>
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        className="absolute bottom-0 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <div className="hero-fade opacity-0 [animation-delay:1.2s]">
          <div className="relative h-16 w-px overflow-hidden bg-bone/20">
            <div className="scroll-beam absolute left-0 top-0 h-1/2 w-full bg-ember" />
          </div>
        </div>
      </div>
    </header>
  );
}
