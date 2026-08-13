"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerToken } from "@/lib/auth";

type Encuesta = {
  _id: string;
  slug: string;
  pregunta: string;
  opciones: { _id: string; texto: string; votos: number }[];
  activa: boolean;
  createdAt: string;
};

export default function AdminEncuestas() {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setCargando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/encuestas`);
      const data = await res.json();
      setEncuestas(data);
    } catch {
      setError("No se pudieron cargar las encuestas");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      cargar();
    });
  }, []);

  async function cerrarEncuesta(id: string) {
    if (!confirm("¿Cerrar esta encuesta? No se podrá volver a abrir.")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/encuestas/${id}/cerrar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${obtenerToken()}` },
      });
      if (!res.ok) throw new Error();
      cargar();
    } catch {
      alert("No se pudo cerrar la encuesta");
    }
  }

  async function eliminarEncuesta(id: string) {
    if (!confirm("¿Eliminar esta encuesta? Esta acción no se puede deshacer.")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/encuestas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${obtenerToken()}` },
      });
      if (!res.ok) throw new Error();
      cargar();
    } catch {
      alert("No se pudo eliminar la encuesta");
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Encuestas</h1>
        <Link
          href="/admin/encuestas/nueva"
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white"
        >
          Nueva encuesta
        </Link>
      </div>

      {cargando && <p className="mt-8 text-sm text-ink/50">Cargando...</p>}
      {error && <p className="mt-8 text-sm text-red-600">{error}</p>}

      {!cargando && encuestas.length === 0 && (
        <p className="mt-8 text-sm text-ink/50">Todavía no hay encuestas creadas.</p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {encuestas.map((enc) => {
          const totalVotos = enc.opciones.reduce((acc, o) => acc + o.votos, 0);
          return (
            <div key={enc._id} className="rounded-lg border border-ink/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">{enc.pregunta}</p>
                  <p className="mt-1 text-xs text-ink/50">
                    {totalVotos} voto{totalVotos !== 1 ? "s" : ""} ·{" "}
                    {enc.activa ? "Activa" : "Cerrada"} ·{" "}
                    {new Date(enc.createdAt).toLocaleDateString("es-DO")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/encuestas/${enc.slug}`}
                    target="_blank"
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70"
                  >
                    Ver
                  </Link>
                  {enc.activa && (
                    <button
                      onClick={() => cerrarEncuesta(enc._id)}
                      className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70"
                    >
                      Cerrar
                    </button>
                  )}
                  <button
                    onClick={() => eliminarEncuesta(enc._id)}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}