"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Imagen y vídeo con fallback: si el asset no existe en /public/media,
 * se renderiza un placeholder negro con borde naranja fino y el nombre
 * del archivo, para que el layout sea evaluable sin assets.
 */

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center border border-ember/60 bg-ash">
      <span className="font-mono text-[10px] tracking-widest text-bone/40">
        /media/{name}
      </span>
    </div>
  );
}

export function MediaImage({
  src,
  alt,
  media,
  sizes = "100vw",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  media: string[];
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!media.includes(src)) return <Placeholder name={src} />;
  return (
    <Image
      src={`/media/${src}`}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}

export function MediaVideo({
  src,
  media,
  eager = false,
  className = "",
}: {
  src: string;
  media: string[];
  /** true solo para el vídeo del hero: carga y reproduce de inmediato */
  eager?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Los vídeos below-the-fold solo se reproducen dentro del viewport;
  // fuera, se pausan para no consumir CPU/batería.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || eager) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [eager]);

  if (!media.includes(src)) return <Placeholder name={src} />;

  const poster = src.replace(/\.mp4$/, "-poster.jpg");

  return (
    <video
      ref={videoRef}
      className={`h-full w-full object-cover ${className}`}
      src={`/media/${src}`}
      poster={media.includes(poster) ? `/media/${poster}` : undefined}
      muted
      loop
      playsInline
      autoPlay={eager}
      preload={eager ? "metadata" : "none"}
    />
  );
}
