"use client";

import { useRouter } from "next/navigation";
import { obtenerToken } from "@/lib/auth";
import VideoForm, { type VideoFormData } from "@/components/admin/VideoForm";

export default function NuevoVideo() {
  const router = useRouter();

  async function handleSubmit(data: VideoFormData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error al crear el video");
    router.push("/admin/videos");
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Nuevo video</h1>
      <VideoForm onSubmit={handleSubmit} submitLabel="Crear video (como borrador)" />
    </div>
  );
}