import { NextResponse } from "next/server";

type Reserva = {
  nombre: string;
  email: string;
  fecha: string;
  turno: string;
  comensales: number;
};

function validate(body: unknown): Reserva | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const nombre = typeof b.nombre === "string" ? b.nombre.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const fecha = typeof b.fecha === "string" ? b.fecha : "";
  const turno = typeof b.turno === "string" ? b.turno : "";
  const comensales = Number(b.comensales);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minFecha = tomorrow.toISOString().slice(0, 10);

  if (nombre.length < 2 || nombre.length > 120) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || fecha < minFecha) return null;
  if (!["20:00", "22:30"].includes(turno)) return null;
  if (!Number.isInteger(comensales) || comensales < 1 || comensales > 4)
    return null;

  return { nombre, email, fecha, turno, comensales };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailHtml(r: Reserva) {
  const fechaLarga = new Date(`${r.fecha}T12:00:00`).toLocaleDateString(
    "es-ES",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #222;color:#888;font-size:12px;letter-spacing:2px;text-transform:uppercase;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #222;color:#F5F5F0;font-size:15px;text-align:right;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;background:#0A0A0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;padding:48px 24px;">
      <p style="margin:0 0 4px;color:#FF6B00;font-size:13px;letter-spacing:4px;text-transform:uppercase;">Nueva reserva</p>
      <h1 style="margin:0 0 36px;color:#F5F5F0;font-size:40px;font-weight:700;letter-spacing:-1px;">BRASA <span style="color:#FF6B00;">17</span></h1>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #222;">
        ${row("Nombre", escapeHtml(r.nombre))}
        ${row("Email", escapeHtml(r.email))}
        ${row("Fecha", escapeHtml(fechaLarga))}
        ${row("Turno", escapeHtml(r.turno))}
        ${row("Comensales", String(r.comensales))}
      </table>
      <p style="margin:36px 0 0;color:#555;font-size:12px;">Diecisiete sitios por turno. Sin excepciones.</p>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const reserva = validate(body);
  if (!reserva) {
    return NextResponse.json(
      { error: "Datos de reserva inválidos" },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVA_EMAIL;

  // Sin credenciales (demo/portfolio): registramos y respondemos OK para
  // que el flujo completo sea evaluable sin configurar Resend.
  if (!apiKey || !to) {
    console.warn(
      "[reserva] RESEND_API_KEY / RESERVA_EMAIL no configurados — email simulado:",
      reserva
    );
    return NextResponse.json({ ok: true, simulated: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESERVA_FROM ?? "BRASA 17 <onboarding@resend.dev>",
      to: [to],
      reply_to: reserva.email,
      subject: `Reserva — ${reserva.fecha} ${reserva.turno} · ${reserva.comensales} pax · ${reserva.nombre}`,
      html: emailHtml(reserva),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[reserva] Resend falló:", res.status, detail);
    return NextResponse.json(
      { error: "No se pudo enviar la reserva" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
