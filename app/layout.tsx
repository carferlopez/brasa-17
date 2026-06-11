import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://brasa17.vercel.app"),
  title: "BRASA 17 — Diecisiete sitios frente al fuego",
  description:
    "Restaurante de brasa en Madrid. Una sola barra de diecisiete sitios frente al fuego y un menú degustación único de siete pases. Sin carta. Calle de la Palma 17.",
  openGraph: {
    title: "BRASA 17 — Diecisiete sitios frente al fuego",
    description:
      "Una sola barra de diecisiete sitios frente al fuego. Menú degustación único de siete pases. Sin carta. Madrid.",
    locale: "es_ES",
    type: "website",
    siteName: "BRASA 17",
  },
  twitter: {
    card: "summary_large_image",
    title: "BRASA 17 — Diecisiete sitios frente al fuego",
    description:
      "Una sola barra de diecisiete sitios frente al fuego. Menú degustación único de siete pases. Sin carta. Madrid.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
