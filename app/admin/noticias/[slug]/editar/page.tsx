"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { obtenerToken } from "@/lib/auth";
import NoticiaForm, { type NoticiaFormData } from "@/components/admin/NoticiaForm";

type Noticia = NoticiaFormData & { _id: string };

export default function EditarNoticia() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  useEffect(() => {
    let ignore = false;

    Promise.resolve().then(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/noticias/${params.slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar la noticia");
        if (!ignore) setNoticia(data);
      } catch (err) {
        if (!ignore) setErrorCarga(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (!ignore) setCargando(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [params.slug]);

  async function handleSubmit(data: NoticiaFormData) {
    if (!noticia) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/noticias/${noticia._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error al actualizar la noticia");
    router.push("/admin/noticias");
  }

  if (cargando) return <p className="text-sm text-ink/50">Cargando...</p>;
  if (errorCarga) return <p className="text-sm text-red-600">{errorCarga}</p>;
  if (!noticia) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Editar noticia</h1>
      <NoticiaForm initial={noticia} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
    </div>
  );
}