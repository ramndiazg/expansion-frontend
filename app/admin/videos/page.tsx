"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerToken } from "@/lib/auth";

type Video = {
  _id: string;
  titulo: string;
  estado: string;
  createdAt: string;
};

async function fetchVideos(): Promise<Video[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  return res.json();
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    fetchVideos().then((data) => {
      if (!ignore) {
        setVideos(data);
        setCargando(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  async function togglePublicar(video: Video) {
    setActualizando(video._id);
    const nuevoEstado = video.estado === "publicado" ? "borrador" : "publicado";
    const body: Record<string, unknown> = { estado: nuevoEstado };
    if (nuevoEstado === "publicado") body.fechaPublicacion = new Date().toISOString();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify(body),
    });

    const data = await fetchVideos();
    setVideos(data);
    setActualizando(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Videos</h1>
        <Link href="/admin/videos/nueva" className="rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white">
          + Nuevo video
        </Link>
      </div>

      {cargando && <p className="mt-6 text-ink/60">Cargando...</p>}

      <div className="mt-6 flex flex-col gap-3">
        {videos.map((v) => (
          <div key={v._id} className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3">
            <span className="text-ink">{v.titulo}</span>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${v.estado === "publicado" ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/60"}`}>
                {v.estado}
              </span>
              <Link href={`/admin/videos/${v._id}/editar`} className="text-sm font-medium text-blue hover:underline">
                Editar
              </Link>
              <button
                onClick={() => togglePublicar(v)}
                disabled={actualizando === v._id}
                className="text-sm font-medium text-blue hover:underline disabled:opacity-50"
              >
                {actualizando === v._id ? "..." : v.estado === "publicado" ? "Despublicar" : "Publicar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}