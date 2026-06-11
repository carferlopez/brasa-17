import type Lenis from "lenis";

/**
 * Singleton de Lenis para que cualquier componente (CTA del hero,
 * items del menú…) pueda hacer scrollTo sin prop-drilling.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToAnchor(hash: string) {
  if (instance) {
    instance.scrollTo(hash, { duration: 1.6 });
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }
}
