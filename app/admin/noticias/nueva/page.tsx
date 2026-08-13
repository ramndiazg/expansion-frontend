"use client";

import { useRouter } from "next/navigation";
import { obtenerToken } from "@/lib/auth";
import NoticiaForm, { type NoticiaFormData } from "@/components/admin/NoticiaForm";

export default function NuevaNoticia() {
  const router = useRouter();

  async function handleSubmit(data: NoticiaFormData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/noticias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error al crear la noticia");
    router.push("/admin/noticias");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Nueva noticia</h1>
      <NoticiaForm onSubmit={handleSubmit} submitLabel="Crear noticia (como borrador)" />
    </div>
  );
}