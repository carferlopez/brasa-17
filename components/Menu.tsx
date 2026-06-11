"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MediaImage } from "@/components/Media";
import { scrollToAnchor } from "@/lib/lenis";

const PASES = [
  { num: "01", name: "Pan y brasa", img: "pase-01.jpg" },
  { num: "02", name: "Puerro a la llama", img: "pase-02.jpg" },
  { num: "03", name: "Lubina al hueso", img: "pase-03.jpg" },
  { num: "04", name: "Tuétano", img: "pase-04.jpg" },
  { num: "05", name: "Chuleta 60 días", img: "pase-05.jpg" },
  { num: "06", name: "Pimientos del rescoldo", img: "pase-06.jpg" },
  { num: "07", name: "Helado de humo", img: "pase-07.jpg" },
];

function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);
  return canHover;
}

export default function Menu({ media }: { media: string[] }) {
  const canHover = useCanHover();
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

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
      const on = activeRef.current !== null;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${on ? 1 : 0.85})`;
      el.style.opacity = on ? "1" : "0";
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
        {PASES.map((pase, i) => (
          <li key={pase.num} className="border-t border-bone/10 last:border-b">
            <div
              data-cursor="reservar"
              role="link"
              tabIndex={0}
              onClick={() => scrollToAnchor("#reservas")}
              onKeyDown={(e) => e.key === "Enter" && scrollToAnchor("#reservas")}
              onPointerEnter={() => canHover && setActive(i)}
              onPointerLeave={() => canHover && setActive(null)}
              className="group flex items-baseline gap-4 py-5 md:gap-10 md:py-7"
            >
              <span className="font-mono text-xs text-ember md:text-sm">
                {pase.num}
              </span>
              <h3 className="font-medium leading-none tracking-[-0.02em] transition-colors duration-300 [font-size:clamp(1.8rem,6vw,5.5rem)] group-hover:text-ember">
                {pase.name}
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
                  src={pase.img}
                  alt={pase.name}
                  media={media}
                  sizes="70vw"
                />
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
          {PASES.map((pase, i) => (
            <div
              key={pase.num}
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: active === i ? 1 : 0 }}
            >
              <MediaImage
                src={pase.img}
                alt=""
                media={media}
                sizes="288px"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
