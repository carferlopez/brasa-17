"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MediaImage } from "@/components/Media";
import DishPanel from "@/components/DishPanel";
import { DISHES, type Dish } from "@/lib/dishes";

function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);
  return canHover;
}

function PlusButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label="Ver detalle del plato"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`group/plus pointer-events-auto absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-ember bg-transparent transition-colors duration-300 hover:bg-ember focus-visible:bg-ember ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-4 w-4 text-ember transition-[transform,color] duration-300 group-hover/plus:rotate-90 group-hover/plus:text-ash group-focus-visible/plus:rotate-90 group-focus-visible/plus:text-ash"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M8 2v12M2 8h12" />
      </svg>
    </button>
  );
}

export default function Menu({ media }: { media: string[] }) {
  const canHover = useCanHover();
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);
  const [detail, setDetail] = useState<Dish | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;
  const detailRef = useRef<Dish | null>(null);
  detailRef.current = detail;

  const openDetail = (dish: Dish) => {
    setActive(null); // la flotante (y su "+") desaparecen al abrir el panel
    setDetail(dish);
  };

  // Imagen flotante que sigue al cursor con lerp (solo desktop)
  useEffect(() => {
    if (!canHover) return;
    const el = floatRef.current;
    if (!el) return;

    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let rafId = 0;
    let snapped = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!snapped) {
        pos.x = target.x;
        pos.y = target.y;
        snapped = true;
      }
    };

    const tick = () => {
      const k = reduced ? 1 : 0.12;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      // Con el panel abierto, el seguimiento queda en pausa
      const on = activeRef.current !== null && detailRef.current === null;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${on ? 1 : 0.85})`;
      el.style.opacity = on ? "1" : "0";
      el.style.pointerEvents = on ? "" : "none";
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
    };
  }, [canHover, reduced]);

  return (
    <section className="relative px-5 py-24 md:px-10 md:py-40" aria-label="El menú">
      <h2 className="mb-12 text-xs font-normal uppercase tracking-[0.3em] text-bone/60 md:mb-20">
        El menú — siete pases
      </h2>

      <ol>
        {DISHES.map((dish, i) => (
          <li key={dish.id} className="border-t border-bone/10 last:border-b">
            <div
              role="button"
              tabIndex={0}
              data-cursor="dish"
              onClick={() => openDetail(dish)}
              onKeyDown={(e) => e.key === "Enter" && openDetail(dish)}
              onPointerEnter={() => canHover && setActive(i)}
              onPointerLeave={() => canHover && setActive(null)}
              className="group flex items-baseline gap-4 py-5 md:gap-10 md:py-7"
            >
              <span className="font-mono text-xs text-ember md:text-sm">
                {dish.id}
              </span>
              <h3 className="font-medium leading-none tracking-[-0.02em] transition-colors duration-300 [font-size:clamp(1.8rem,6vw,5.5rem)] group-hover:text-ember">
                {dish.name}
              </h3>
            </div>

            {/* Móvil: la imagen del pase se revela al entrar en viewport */}
            {!canHover && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className={`mb-8 aspect-[4/5] w-[70%] max-w-xs ${
                  i % 2 ? "ml-auto" : ""
                } relative`}
              >
                <MediaImage
                  src={dish.image}
                  alt={dish.name}
                  media={media}
                  sizes="70vw"
                />
                <PlusButton onClick={() => openDetail(dish)} />
              </motion.div>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-12 text-sm text-bone/60 md:mt-16 md:text-base">
        Menú único — <span className="text-bone">95 €</span> · Maridaje{" "}
        <span className="text-bone">+45 €</span>
      </p>

      {/* Desktop: imagen flotante que sigue al cursor */}
      {canHover && (
        <div
          ref={floatRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 h-[24rem] w-[18rem] opacity-0 transition-opacity duration-300"
        >
          {DISHES.map((dish, i) => (
            <div
              key={dish.id}
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: active === i ? 1 : 0 }}
            >
              <MediaImage src={dish.image} alt="" media={media} sizes="288px" />
            </div>
          ))}
        </div>
      )}

      {/* Panel de detalle */}
      <AnimatePresence>
        {detail && (
          <DishPanel
            dish={detail}
            media={media}
            onClose={() => setDetail(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
