"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerToken } from "@/lib/auth";

type ComentarioPendiente = {
  _id: string;
  texto: string;
  createdAt: string;
  miembro: { nombre: string; email: string };
  noticia: { titulo: string; slug: string };
};

async function fetchPendientes(): Promise<ComentarioPendiente[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comentarios/pendientes`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export default function ModeracionComentarios() {
  const [comentarios, setComentarios] = useState<ComentarioPendiente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetchPendientes().then((data) => {
      if (!ignore) {
        setComentarios(data);
        setCargando(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  async function moderar(id: string, estado: "aprobado" | "rechazado") {
    setProcesando(id);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comentarios/${id}/moderar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify({ estado }),
    });
    setComentarios((prev) => prev.filter((c) => c._id !== id));
    setProcesando(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Comentarios pendientes
      </h1>
      <p className="mt-1 text-ink/60">
        {comentarios.length} comentario{comentarios.length !== 1 && "s"} esperando revisión.
      </p>

      {cargando && <p className="mt-6 text-ink/60">Cargando...</p>}

      {!cargando && comentarios.length === 0 && (
        <p className="mt-10 text-ink/50">No hay comentarios pendientes. 🎉</p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {comentarios.map((c) => (
          <div key={c._id} className="rounded-lg border border-ink/10 p-5">
            <div className="flex items-center justify-between text-sm text-ink/50">
              <Link href={`/noticias/${c.noticia.slug}`} target="_blank" className="hover:underline">
                En: {c.noticia.titulo}
              </Link>
              <span>{new Date(c.createdAt).toLocaleDateString("es-DO")}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-ink">
              {c.miembro.nombre} <span className="font-normal text-ink/40">({c.miembro.email})</span>
            </p>
            <p className="mt-2 text-ink/80">{c.texto}</p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => moderar(c._id, "aprobado")}
                disabled={procesando === c._id}
                className="rounded-full bg-teal px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Aprobar
              </button>
              <button
                onClick={() => moderar(c._id, "rechazado")}
                disabled={procesando === c._id}
                className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-semibold text-ink/70 disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}