"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { MediaImage } from "@/components/Media";
import { scrollToAnchor, startLenis, stopLenis } from "@/lib/lenis";
import type { Dish } from "@/lib/dishes";

const EASE = [0.76, 0, 0.24, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};

const line = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Panel de detalle de un pase: overlay fullscreen en negro con la imagen
 * a un lado (desktop) o arriba (móvil). Bloquea el scroll del body, pausa
 * Lenis, restaura el cursor nativo (clase .dish-open) y cierra con × o
 * Escape. Renderizar dentro de <AnimatePresence>.
 */
export default function DishPanel({
  dish,
  media,
  onClose,
}: {
  dish: Dish;
  media: string[];
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    stopLenis();
    document.documentElement.style.overflow = "hidden";
    document.documentElement.classList.add("dish-open");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("dish-open");
      startLenis();
      prevFocus?.focus?.();
    };
  }, [onClose]);

  // Único elemento de conversión del panel: cerrar, restaurar el scroll
  // y bajar suave hasta el formulario.
  const goReservas = (e: MouseEvent) => {
    e.preventDefault();
    document.documentElement.style.overflow = "";
    document.documentElement.classList.remove("dish-open");
    startLenis();
    onClose();
    requestAnimationFrame(() => scrollToAnchor("#reservas"));
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${dish.name} — detalle del plato`}
      data-lenis-prevent
      className="fixed inset-0 z-[95] overflow-y-auto bg-ash md:overflow-hidden"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Cerrar detalle"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-3xl font-light leading-none text-bone transition-colors duration-300 hover:text-ember md:right-8 md:top-8"
      >
        ×
      </button>

      <div className="grid min-h-full md:h-full md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
          <MediaImage
            src={dish.image}
            alt={dish.name}
            media={media}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center px-6 py-14 md:px-14 md:py-10 lg:px-20"
        >
          <motion.p variants={line} className="font-mono text-sm text-ember">
            {dish.id}
          </motion.p>
          <motion.h3
            variants={line}
            className="mt-4 font-bold leading-[0.95] tracking-[-0.03em] [font-size:clamp(2.5rem,6vw,4.5rem)]"
          >
            {dish.name}
          </motion.h3>
          <motion.p
            variants={line}
            className="mt-8 max-w-[44ch] text-base leading-relaxed text-bone/80 md:text-lg"
          >
            {dish.copy}
          </motion.p>

          <motion.p variants={line} className="mt-16 text-[13px] text-bone/60 md:mt-20">
            Forma parte del menú único —{" "}
            <a
              href="#reservas"
              onClick={goReservas}
              className="border-b border-transparent pb-px text-ember transition-colors duration-300 hover:border-ember"
            >
              Reservar
            </a>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
