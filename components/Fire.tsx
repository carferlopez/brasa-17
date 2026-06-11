"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MediaVideo } from "@/components/Media";

/**
 * Bloque "El fuego".
 *
 * Desktop: la ventana de vídeo arranca a ~30vw y escala hasta fullscreen
 * con ScrollTrigger (pin + scrub). Se anima clip-path inset() en lugar de
 * width/height: el vídeo ya está pintado a viewport completo y el clip
 * se compone en GPU, sin relayouts — clave para mantener 60fps.
 *
 * Móvil y prefers-reduced-motion: vídeo a viewport completo con fade-in
 * simple, sin pin (fallback de performance descrito en el brief).
 */
export default function Fire({ media }: { media: string[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const gsapRef = useRef<typeof import("gsap").gsap | null>(null);
  const [pinned, setPinned] = useState(false);

  // GSAP solo se carga si este media query aplica: en móvil no se
  // descarga ni un byte de la librería.
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
    );
    if (!mq.matches) return;

    let cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        gsapRef.current = gsap;
        setPinned(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  // El timeline se crea en un segundo efecto, una vez React ha montado
  // el frame del modo "pinned" y los refs apuntan al DOM definitivo.
  useEffect(() => {
    const gsap = gsapRef.current;
    if (!pinned || !gsap || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    tl.fromTo(
      frameRef.current,
      { clipPath: "inset(30% 35% 30% 35%)" },
      { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }
    ).fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, ease: "none", duration: 0.35 },
      0.7
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [pinned]);

  return (
    <section ref={sectionRef} className="relative h-[100svh]" aria-label="El fuego">
      {pinned ? (
        <>
          <div ref={frameRef} className="absolute inset-0 will-change-[clip-path]">
            <MediaVideo src="fire-vertical.mp4" media={media} />
          </div>
          <p
            ref={textRef}
            className="absolute inset-x-0 bottom-16 z-10 px-10 text-center font-medium leading-tight tracking-[-0.02em] text-bone opacity-0 [font-size:clamp(1.8rem,4vw,3.5rem)]"
          >
            El fuego no se controla. <span className="text-ember">Se escucha.</span>
          </p>
        </>
      ) : (
        // Fallback móvil / reduced-motion: fullscreen + fade-in
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 1.2 }}
        >
          <MediaVideo src="fire-vertical.mp4" media={media} />
          <div className="absolute inset-0 bg-gradient-to-t from-ash/80 via-transparent to-transparent" />
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute inset-x-0 bottom-12 z-10 px-6 text-center text-3xl font-medium leading-tight tracking-[-0.02em] text-bone"
          >
            El fuego no se controla.{" "}
            <span className="text-ember">Se escucha.</span>
          </motion.p>
        </motion.div>
      )}
    </section>
  );
}
