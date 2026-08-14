"use client";

import { useEffect, useState } from "react";
import { obtenerVotanteId, yaVoto, marcarVotado } from "@/lib/votante";

type Opcion = { _id: string; texto: string; votos: number };

type Encuesta = {
  _id: string;
  slug: string;
  pregunta: string;
  opciones: Opcion[];
  activa: boolean;
};

export default function EncuestaVotacion({ encuesta }: { encuesta: Encuesta }) {
  const [datos, setDatos] = useState(encuesta);
  const [votado, setVotado] = useState(false);
  const [listo, setListo] = useState(false);
  const [votando, setVotando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => {
      setVotado(yaVoto(datos.slug));
      setListo(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function votar(opcionId: string) {
    setError("");
    setVotando(true);
    try {
      const votanteId = obtenerVotanteId();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/encuestas/${datos._id}/votar/${opcionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ votanteId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar el voto");
      setDatos(data);
      marcarVotado(datos.slug);
      setVotado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setVotando(false);
    }
  }

  const totalVotos = datos.opciones.reduce((acc, o) => acc + o.votos, 0);
  const mostrarResultados = votado || !datos.activa;

  if (!listo) {
    return <p className="mt-8 text-sm text-ink/50">Cargando...</p>;
  }

  return (
    <div className="mt-8">
      {mostrarResultados ? (
        <div className="flex flex-col gap-3">
          {datos.opciones.map((op) => {
            const pct = totalVotos > 0 ? Math.round((op.votos / totalVotos) * 100) : 0;
            return (
              <div key={op._id}>
                <div className="flex justify-between text-sm text-ink/80">
                  <span>{op.texto}</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-blue" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <p className="mt-2 text-xs text-ink/50">
            {totalVotos} voto{totalVotos !== 1 ? "s" : ""}
            {!datos.activa && " · Encuesta cerrada"}
            {votado && datos.activa && " · Ya votaste"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {datos.opciones.map((op) => (
            <button
              key={op._id}
              disabled={votando}
              onClick={() => votar(op._id)}
              className="rounded-lg border border-ink/15 px-4 py-2.5 text-left text-sm font-medium text-ink/80 transition hover:border-blue hover:text-blue disabled:opacity-50"
            >
              {op.texto}
            </button>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}