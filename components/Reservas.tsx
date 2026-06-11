"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "idle" | "sending" | "success" | "error";

type FormData = {
  nombre: string;
  email: string;
  fecha: string;
  turno: string;
  comensales: string;
};

const EMPTY: FormData = {
  nombre: "",
  email: "",
  fecha: "",
  turno: "20:00",
  comensales: "2",
};

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const inputClass =
  "w-full border-b border-bone/20 bg-transparent py-3 text-base text-bone placeholder:text-bone/30 focus:border-ember focus:outline-none transition-colors";

const labelClass = "block text-xs uppercase tracking-[0.25em] text-bone/60";

export default function Reservas() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [minDate, setMinDate] = useState("");

  // La fecha mínima (mañana) se calcula en cliente para evitar
  // desajustes de hidratación alrededor de medianoche.
  useEffect(() => setMinDate(tomorrowISO()), []);

  const set = (field: keyof FormData) => (value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (data.nombre.trim().length < 2) e.nombre = "Dinos tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Revisa el email.";
    if (!data.fecha || data.fecha < tomorrowISO())
      e.fecha = "Reservamos a partir de mañana.";
    if (!["20:00", "22:30"].includes(data.turno)) e.turno = "Elige turno.";
    const n = Number(data.comensales);
    if (!Number.isInteger(n) || n < 1 || n > 4)
      e.comensales = "Entre 1 y 4 comensales.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, comensales: Number(data.comensales) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="reservas"
      className="flex min-h-[100svh] flex-col justify-center px-5 py-24 md:px-10 md:py-40"
      aria-label="Reservas"
    >
      <div className="mx-auto w-full max-w-2xl">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-bone/60">
          Reservas
        </p>
        <h2 className="mb-14 font-bold leading-[0.9] tracking-[-0.03em] [font-size:clamp(2.5rem,8vw,5.5rem)]">
          Tu sitio<span className="text-ember">.</span>
        </h2>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="border border-ember/60 p-8 md:p-12"
              role="status"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6 block h-3 w-3 rounded-full bg-ember"
                aria-hidden="true"
              />
              <p className="text-2xl font-medium leading-snug md:text-3xl">
                Tu sitio frente al fuego está pedido.
                <br />
                <span className="text-bone/60">Te confirmamos por email.</span>
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              onSubmit={submit}
              noValidate
              className="grid gap-10"
            >
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <label htmlFor="r-nombre" className={labelClass}>
                    Nombre
                  </label>
                  <input
                    id="r-nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    required
                    value={data.nombre}
                    onChange={(e) => set("nombre")(e.target.value)}
                    className={inputClass}
                    placeholder="Tu nombre"
                    aria-invalid={!!errors.nombre}
                  />
                  {errors.nombre && (
                    <p className="mt-2 text-sm text-ember">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="r-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="r-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={data.email}
                    onChange={(e) => set("email")(e.target.value)}
                    className={inputClass}
                    placeholder="tu@email.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-ember">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-10 md:grid-cols-3">
                <div>
                  <label htmlFor="r-fecha" className={labelClass}>
                    Fecha
                  </label>
                  <input
                    id="r-fecha"
                    name="fecha"
                    type="date"
                    required
                    min={minDate}
                    value={data.fecha}
                    onChange={(e) => set("fecha")(e.target.value)}
                    className={inputClass}
                    aria-invalid={!!errors.fecha}
                  />
                  {errors.fecha && (
                    <p className="mt-2 text-sm text-ember">{errors.fecha}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="r-turno" className={labelClass}>
                    Turno
                  </label>
                  <select
                    id="r-turno"
                    name="turno"
                    value={data.turno}
                    onChange={(e) => set("turno")(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="20:00">20:00</option>
                    <option value="22:30">22:30</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="r-comensales" className={labelClass}>
                    Comensales
                  </label>
                  <select
                    id="r-comensales"
                    name="comensales"
                    value={data.comensales}
                    onChange={(e) => set("comensales")(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  {errors.comensales && (
                    <p className="mt-2 text-sm text-ember">
                      {errors.comensales}
                    </p>
                  )}
                </div>
              </div>

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-ember"
                  role="alert"
                >
                  Algo se ha quemado por el camino. Inténtalo de nuevo.
                </motion.p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full border border-bone/30 px-8 py-4 text-sm uppercase tracking-[0.25em] transition-colors duration-300 hover:border-ember hover:bg-ember hover:text-ash disabled:opacity-40 md:w-fit"
              >
                {status === "sending"
                  ? "Enviando…"
                  : status === "error"
                    ? "Reintentar"
                    : "Pedir sitio"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-14 text-sm text-bone/60">
          Diecisiete sitios por turno. Sin excepciones.
        </p>
      </div>
    </section>
  );
}
