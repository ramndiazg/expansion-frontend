"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerMiembro, obtenerTokenMiembro } from "@/lib/authMiembro";

type Opcion = { _id: string; texto: string; votos: number };

type Encuesta = {
  _id: string;
  slug: string;
  pregunta: string;
  opciones: Opcion[];
  activa: boolean;
};

export default function EncuestaVotacion({ encuesta }: { encuesta: Encuesta }) {
  const router = useRouter();
  const [datos, setDatos] = useState(encuesta);
  const [yaVoto, setYaVoto] = useState(false);
  const [cargandoEstado, setCargandoEstado] = useState(true);
  const [votando, setVotando] = useState(false);
  const [error, setError] = useState("");

  const miembro = obtenerMiembro();

  useEffect(() => {
    async function chequearEstado() {
      if (!miembro) {
        setCargandoEstado(false);
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/encuestas/${datos._id}/mi-estado`,
          {
            headers: { Authorization: `Bearer ${obtenerTokenMiembro()}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setYaVoto(data.yaVoto);
        }
      } finally {
        setCargandoEstado(false);
      }
    }
    chequearEstado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function votar(opcionId: string) {
    setError("");
    setVotando(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/encuestas/${datos._id}/votar/${opcionId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${obtenerTokenMiembro()}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo registrar el voto");
      setDatos(data);
      setYaVoto(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setVotando(false);
    }
  }

  function irARegistrarse() {
    const retorno = `/encuestas/${datos.slug}`;
    router.push(`/afiliate?redirect=${encodeURIComponent(retorno)}`);
  }

  function irALogin() {
    const retorno = `/encuestas/${datos.slug}`;
    router.push(`/login?redirect=${encodeURIComponent(retorno)}`);
  }

  const totalVotos = datos.opciones.reduce((acc, o) => acc + o.votos, 0);
  const mostrarResultados = yaVoto || !datos.activa;

  if (cargandoEstado) {
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
            {yaVoto && datos.activa && " · Ya votaste"}
          </p>
        </div>
      ) : miembro ? (
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
      ) : (
        <div className="rounded-lg border border-ink/10 bg-ink/[0.03] p-5">
          <p className="text-sm text-ink/70">
            Solo los miembros afiliados pueden votar en las encuestas.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={irARegistrarse}
              className="rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white"
            >
              Afiliarme
            </button>
            <button
              onClick={irALogin}
              className="rounded-full border border-ink/15 px-5 py-2 text-sm font-medium text-ink/80"
            >
              Ya soy miembro, iniciar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}