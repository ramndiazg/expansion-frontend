"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { obtenerToken } from "@/lib/auth";
import VideoForm, { type VideoFormData } from "@/components/admin/VideoForm";

type Video = VideoFormData & { _id: string };

export default function EditarVideo() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  useEffect(() => {
    let ignore = false;

    Promise.resolve().then(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${params.id}`, {
          headers: { Authorization: `Bearer ${obtenerToken()}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar el video");
        if (!ignore) setVideo(data);
      } catch (err) {
        if (!ignore) setErrorCarga(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (!ignore) setCargando(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [params.id]);

  async function handleSubmit(data: VideoFormData) {
    if (!video) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error al actualizar el video");
    router.push("/admin/videos");
  }

  if (cargando) return <p className="text-sm text-ink/50">Cargando...</p>;
  if (errorCarga) return <p className="text-sm text-red-600">{errorCarga}</p>;
  if (!video) return null;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Editar video</h1>
      <VideoForm initial={video} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
    </div>
  );
}