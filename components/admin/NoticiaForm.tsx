"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

export type NoticiaFormData = {
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  autor: string;
  imagenDestacada: string;
  imagenesAdicionales: string[];
};

type NoticiaFormProps = {
  initial?: Partial<NoticiaFormData>;
  onSubmit: (data: NoticiaFormData) => Promise<void>;
  submitLabel: string;
};

const vacio: NoticiaFormData = {
  titulo: "",
  resumen: "",
  contenido: "",
  categoria: "comunicado",
  autor: "",
  imagenDestacada: "",
  imagenesAdicionales: [],
};

export default function NoticiaForm({ initial, onSubmit, submitLabel }: NoticiaFormProps) {
  const [form, setForm] = useState<NoticiaFormData>({ ...vacio, ...initial });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function update<K extends keyof NoticiaFormData>(campo: K, valor: NoticiaFormData[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function actualizarGaleria(i: number, url: string) {
    setForm((f) => ({
      ...f,
      imagenesAdicionales: f.imagenesAdicionales.map((img, idx) => (idx === i ? url : img)),
    }));
  }

  function agregarSlotGaleria() {
    setForm((f) => ({ ...f, imagenesAdicionales: [...f.imagenesAdicionales, ""] }));
  }

  function quitarSlotGaleria(i: number) {
    setForm((f) => ({
      ...f,
      imagenesAdicionales: f.imagenesAdicionales.filter((_, idx) => idx !== i),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      await onSubmit({
        ...form,
        imagenesAdicionales: form.imagenesAdicionales.filter(Boolean),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
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

      <ImageUploader
        label="Imagen destacada"
        value={form.imagenDestacada}
        onChange={(url) => update("imagenDestacada", url)}
      />

      <div>
        <label className="text-sm font-medium text-ink/70">Galería de imágenes adicionales</label>
        <div className="mt-1 flex flex-col gap-3">
          {form.imagenesAdicionales.map((img, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1">
                <ImageUploader value={img} onChange={(url) => actualizarGaleria(i, url)} />
              </div>
              <button
                type="button"
                onClick={() => quitarSlotGaleria(i)}
                className="mt-1 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={agregarSlotGaleria}
          className="mt-2 text-sm font-medium text-blue"
        >
          + Agregar imagen a la galería
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={guardando}
        className="mt-2 w-fit rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {guardando ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}