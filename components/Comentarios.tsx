"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTokenMiembro, obtenerMiembro } from "@/lib/authMiembro";

type Comentario = {
  _id: string;
  texto: string;
  createdAt: string;
  miembro: { nombre: string };
};

export default function Comentarios({ noticiaId }: { noticiaId: string }) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [miembro, setMiembro] = useState<ReturnType<typeof obtenerMiembro>>(null);

  useEffect(() => {
    let ignore = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comentarios/noticia/${noticiaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setComentarios(data);
          setCargando(false);
          setMiembro(obtenerMiembro());
        }
      });

    return () => {
      ignore = true;
    };
  }, [noticiaId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comentarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${obtenerTokenMiembro()}`,
        },
        body: JSON.stringify({ noticia: noticiaId, texto }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al comentar");
      setTexto("");
      setEnviado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mt-16 border-t border-ink/10 pt-10">
      <h2 className="font-display text-xl font-semibold text-ink">Comentarios</h2>

      {cargando && <p className="mt-4 text-sm text-ink/50">Cargando comentarios...</p>}
      {!cargando && comentarios.length === 0 && (
        <p className="mt-4 text-sm text-ink/50">Todavía no hay comentarios.</p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {comentarios.map((c) => (
          <div key={c._id} className="rounded-lg border border-ink/10 p-4">
            <p className="text-sm font-medium text-ink">{c.miembro?.nombre}</p>
            <p className="mt-1 text-ink/70">{c.texto}</p>
          </div>
        ))}
      </div>

      {miembro ? (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <textarea
            required
            maxLength={1000}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue"
            rows={3}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {enviado && !error && (
            <p className="text-sm text-teal-700">
              Comentario enviado — será visible después de ser revisado.
            </p>
          )}
          <button type="submit" disabled={enviando}
            className="w-fit rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {enviando ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-ink/60">
          <Link href="/login" className="font-medium text-blue hover:underline">
            Inicia sesión como miembro
          </Link>{" "}
          para comentar.
        </p>
      )}
    </div>
  );
}