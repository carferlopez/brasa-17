"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MediaVideo } from "@/components/Media";

/** Banda de vídeo (plating.mp4) entre el autor y las reservas. */
export default function Interlude({ media }: { media: string[] }) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1 }}
      className="relative h-[60svh] overflow-hidden"
      aria-label="Emplatado"
    >
      <MediaVideo src="plating.mp4" media={media} />
      <div className="absolute inset-0 bg-gradient-to-b from-ash/60 via-transparent to-ash/60" />
    </motion.section>
  );
}
