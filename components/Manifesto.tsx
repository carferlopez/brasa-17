"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const TEXT =
  "No hay carta. Hay mercado, hay fuego y hay diecisiete sillas. Cocinamos lo que la brasa pide. Cada noche, una sola vez.";

// Palabras que se encienden en naranja
const EMBER_WORDS = new Set(["fuego", "brasa"]);

function Word({
  word,
  progress,
  range,
  reduced,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const clean = word.replace(/[.,]/g, "");
  return (
    <motion.span
      style={reduced ? undefined : { opacity }}
      className={EMBER_WORDS.has(clean) ? "text-ember" : undefined}
    >
      {word}{" "}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = TEXT.split(" ");

  return (
    <section className="px-5 py-[30vh] md:px-10" aria-label="Manifiesto">
      {/* Texto íntegro para lectores de pantalla; el visual es decorativo */}
      <p className="sr-only">{TEXT}</p>
      <p
        ref={ref}
        aria-hidden="true"
        className="mx-auto max-w-[14ch] font-medium leading-[1.1] tracking-[-0.02em] [font-size:clamp(2rem,8vw,7rem)] md:max-w-[16ch]"
      >
        {words.map((word, i) => (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
            reduced={reduced}
          />
        ))}
      </p>
    </section>
  );
}
