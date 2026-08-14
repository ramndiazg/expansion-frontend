"use client";

import { useState } from "react";

export type VideoFormData = {
  titulo: string;
  videoUrl: string;
};

type VideoFormProps = {
  initial?: Partial<VideoFormData>;
  onSubmit: (data: VideoFormData) => Promise<void>;
  submitLabel: string;
};

const vacio: VideoFormData = { titulo: "", videoUrl: "" };

export default function VideoForm({ initial, onSubmit, submitLabel }: VideoFormProps) {
  const [form, setForm] = useState<VideoFormData>({ ...vacio, ...initial });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function update<K extends keyof VideoFormData>(campo: K, valor: VideoFormData[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-ink/70">Título</label>
        <input required value={form.titulo} onChange={(e) => update("titulo", e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink/70">Link de YouTube</label>
        <input required value={form.videoUrl} onChange={(e) => update("videoUrl", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={guardando}
        className="mt-2 w-fit rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {guardando ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}