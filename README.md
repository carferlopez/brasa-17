# BRASA 17

One-page de portfolio para BRASA 17 — restaurante ficticio de Madrid: una sola
barra de diecisiete sitios frente al fuego, menú degustación único de siete
pases, sin carta.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 ·
Framer Motion · Lenis · GSAP + ScrollTrigger (solo el bloque "El fuego").

## Desarrollo

```bash
npm install
npm run dev
```

## Assets

Los medios viven en `public/media/` con estos nombres exactos:

```
hero-loop.mp4   fire-vertical.mp4   plating.mp4
pase-01.jpg … pase-07.jpg
chef.jpg   espacio-01.jpg   espacio-02.jpg
```

Si un asset falta, el layout muestra un placeholder negro con borde naranja y
el nombre del archivo: la web es evaluable sin assets.

## Tipografía

El stack display cae a Helvetica Neue. Si tienes licencia de Neue Haas
Grotesk, coloca los `.woff2` en `public/fonts/` y descomenta los `@font-face`
al inicio de [app/globals.css](app/globals.css).

## Reservas (Resend)

El formulario envía a `/api/reserva`, que manda un email vía Resend. Copia
`.env.example` a `.env.local` y define:

- `RESEND_API_KEY` — API key de Resend
- `RESERVA_EMAIL` — destinatario de las reservas
- `RESERVA_FROM` — remitente opcional (por defecto `onboarding@resend.dev`)

Sin credenciales, el endpoint valida y responde OK en modo simulado
(se registra en el log del servidor) para que el flujo sea demostrable.

## Performance y accesibilidad

- Vídeos con `preload="metadata"` (hero) o `preload="none"` + play/pause por
  IntersectionObserver (resto). `next/image` en todas las imágenes.
- GSAP se importa dinámicamente y **solo** en desktop sin
  `prefers-reduced-motion`; en móvil el bloque del fuego usa un fade-in simple
  sin pin.
- `prefers-reduced-motion` desactiva preloader, scrub, parallax y lerp.

## Deploy

Pensado para Vercel: `vercel deploy` (añade las env vars en el dashboard).
