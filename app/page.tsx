import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { getExistingMedia } from "@/lib/media";

// Bloques below-the-fold en chunks separados: se renderizan en servidor
// igualmente, pero su JS de hidratación no bloquea la carga inicial.
// El Hero no usa framer-motion, así que la librería entera queda
// fuera del bundle crítico.
const Manifesto = dynamic(() => import("@/components/Manifesto"));
const Menu = dynamic(() => import("@/components/Menu"));
const Fire = dynamic(() => import("@/components/Fire"));
const Author = dynamic(() => import("@/components/Author"));
const Interlude = dynamic(() => import("@/components/Interlude"));
const Reservas = dynamic(() => import("@/components/Reservas"));

export default function Home() {
  // Lista de assets presentes en /public/media — los componentes
  // renderizan placeholders evaluables para los que falten.
  const media = getExistingMedia();

  return (
    <main>
      <Hero media={media} />
      <Manifesto />
      <Menu media={media} />
      <Fire media={media} />
      <Author media={media} />
      <Interlude media={media} />
      <Reservas />
      <Footer />
    </main>
  );
}
