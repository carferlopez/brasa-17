export default function Footer() {
  return (
    <footer className="border-t border-bone/10 px-5 py-20 md:px-10 md:py-28">
      <div className="grid gap-12 text-sm leading-relaxed text-bone/60 md:grid-cols-4">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-bone/50">
            Dónde
          </p>
          <p>
            Calle de la Palma 17
            <br />
            Madrid
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-bone/50">
            Cuándo
          </p>
          <p>
            Martes a sábado
            <br />
            Dos turnos — 20:00 / 22:30
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-bone/50">
            Contacto
          </p>
          <p>
            <a
              href="tel:+34915170017"
              className="transition-colors hover:text-ember"
            >
              +34 915 17 00 17
            </a>
            <br />
            <a
              href="https://instagram.com/brasa17.madrid"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ember"
            >
              Instagram
            </a>
          </p>
        </div>
        <div className="md:text-right">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-bone/50">
            Crédito
          </p>
          <p>
            <a
              href="https://carlosmakes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ember"
            >
              Web de Autor — carlosmakes.com
            </a>
          </p>
        </div>
      </div>

      {/* Marca de agua decorativa: SVG para quedar fuera de los checks de contraste */}
      <svg
        className="mt-20 w-full select-none"
        viewBox="0 0 800 120"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="400"
          y="100"
          textAnchor="middle"
          className="fill-bone/[0.06]"
          style={{ font: "700 130px var(--font-display)", letterSpacing: "-0.03em" }}
        >
          BRASA 17
        </text>
      </svg>
    </footer>
  );
}
