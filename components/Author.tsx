"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MediaImage } from "@/components/Media";

export default function Author({ media }: { media: string[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });
  // Parallax sutil en direcciones opuestas
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 50]);

  return (
    <section className="px-5 py-24 md:px-10 md:py-40" aria-label="El autor">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[80vh]">
          <MediaImage
            src="chef.jpg"
            alt="Julián Ferro, cocinero de BRASA 17, frente a la brasa"
            media={media}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-bone/60">
            El autor
          </p>
          <h2 className="font-bold leading-[0.9] tracking-[-0.03em] [font-size:clamp(3rem,9vw,7rem)]">
            Julián
            <br />
            Ferro<span className="text-ember">.</span>
          </h2>
          <p className="mt-8 max-w-[38ch] text-base leading-relaxed text-bone/70 md:text-lg">
            Veinte años mirando el fuego. Julián Ferro abrió BRASA 17 para
            cocinar de frente: sin pase, sin sala, sin escondite.
          </p>
        </div>
      </div>

      {/* Grid asimétrico del espacio, con parallax sutil */}
      <div
        ref={gridRef}
        className="mt-20 grid grid-cols-12 items-start gap-4 md:mt-32 md:gap-6"
      >
        <motion.div
          style={reduced ? undefined : { y: y1 }}
          className="relative col-span-7 aspect-[4/5]"
        >
          <MediaImage
            src="espacio-01.jpg"
            alt="La barra de BRASA 17 frente a la parrilla"
            media={media}
            sizes="(min-width: 768px) 55vw, 60vw"
          />
        </motion.div>
        <motion.div
          style={reduced ? undefined : { y: y2 }}
          className="relative col-span-5 mt-[20%] aspect-square"
        >
          <MediaImage
            src="espacio-02.jpg"
            alt="Detalle del espacio de BRASA 17"
            media={media}
            sizes="(min-width: 768px) 38vw, 42vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
