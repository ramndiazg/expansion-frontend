"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerToken } from "@/lib/auth";

export default function NuevaNoticia() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    resumen: "",
    contenido: "",
    categoria: "comunicado",
    autor: "",
  });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function update(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/noticias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${obtenerToken()}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear la noticia");
      router.push("/admin/noticias");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Nueva noticia</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Título</label>
          <input required value={form.titulo} onChange={(e) => update("titulo", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Resumen</label>
          <textarea required maxLength={300} value={form.resumen} onChange={(e) => update("resumen", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" rows={2} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Contenido</label>
          <textarea required value={form.contenido} onChange={(e) => update("contenido", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" rows={8} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-ink/70">Categoría</label>
            <select value={form.categoria} onChange={(e) => update("categoria", e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue">
              <option value="comunicado">Comunicado</option>
              <option value="actividad">Actividad</option>
              <option value="declaracion">Declaración</option>
              <option value="en_los_medios">En los medios</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-ink/70">Autor</label>
            <input required value={form.autor} onChange={(e) => update("autor", e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={guardando}
          className="mt-2 w-fit rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {guardando ? "Guardando..." : "Crear noticia (como borrador)"}
        </button>
      </form>
    </div>
  );
}