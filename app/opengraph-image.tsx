import { ImageResponse } from "next/og";

export const alt = "BRASA 17 — Diecisiete sitios frente al fuego";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "#0A0A0A",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 200,
            fontWeight: 700,
            letterSpacing: -10,
            lineHeight: 0.9,
          }}
        >
          <span style={{ color: "#F5F5F0" }}>BRASA&nbsp;</span>
          <span style={{ color: "#FF6B00" }}>17</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            color: "#F5F5F0",
            opacity: 0.6,
            letterSpacing: 1,
          }}
        >
          Diecisiete sitios frente al fuego — Madrid
        </div>
      </div>
    ),
    size
  );
}
