"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerToken } from "@/lib/auth";

export default function NuevaEncuesta() {
  const router = useRouter();
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState(["", ""]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function actualizarOpcion(i: number, valor: string) {
    setOpciones((ops) => ops.map((o, idx) => (idx === i ? valor : o)));
  }

  function agregarOpcion() {
    setOpciones((ops) => [...ops, ""]);
  }

  function quitarOpcion(i: number) {
    setOpciones((ops) => ops.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const opcionesLimpias = opciones.map((o) => o.trim()).filter(Boolean);
    if (opcionesLimpias.length < 2) {
      setError("Necesitas al menos 2 opciones con texto");
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/encuestas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${obtenerToken()}`,
        },
        body: JSON.stringify({
          pregunta,
          opciones: opcionesLimpias.map((texto) => ({ texto })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear la encuesta");
      router.push("/admin/encuestas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Nueva encuesta</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Pregunta</label>
          <input
            required
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Opciones</label>
          <div className="mt-1 flex flex-col gap-2">
            {opciones.map((op, i) => (
              <div key={i} className="flex gap-2">
                <input
                  required
                  value={op}
                  onChange={(e) => actualizarOpcion(i, e.target.value)}
                  placeholder={`Opción ${i + 1}`}
                  className="flex-1 rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue"
                />
                {opciones.length > 2 && (
                  <button
                    type="button"
                    onClick={() => quitarOpcion(i)}
                    className="rounded-lg border border-ink/15 px-3 text-sm text-ink/50"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={agregarOpcion}
            className="mt-2 text-sm font-medium text-blue"
          >
            + Agregar opción
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="mt-2 w-fit rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Crear encuesta"}
        </button>
      </form>
    </div>
  );
}