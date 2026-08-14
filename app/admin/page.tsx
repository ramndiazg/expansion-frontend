"use client";

import Link from "next/link";
import { obtenerUsuario } from "@/lib/auth";

export default function AdminHome() {
  const usuario = obtenerUsuario();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Hola, {usuario?.nombre}
      </h1>
      <p className="mt-1 text-ink/60">Rol: {usuario?.rol}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/noticias" className="rounded-xl border border-ink/10 p-6 hover:border-blue">
          <h2 className="font-display text-lg font-semibold text-ink">Noticias</h2>
          <p className="mt-1 text-sm text-ink/60">Crear y gestionar noticias</p>
        </Link>
        <Link href="/admin/videos" className="rounded-xl border border-ink/10 p-6 hover:border-blue">
          <h2 className="font-display text-lg font-semibold text-ink">Videos</h2>
          <p className="mt-1 text-sm text-ink/60">Publicar videos de YouTube</p>
        </Link>
        <Link href="/admin/encuestas" className="rounded-xl border border-ink/10 p-6 hover:border-blue">
          <h2 className="font-display text-lg font-semibold text-ink">Encuestas</h2>
          <p className="mt-1 text-sm text-ink/60">Crear encuestas y ver resultados</p>
        </Link>
        <Link href="/admin/comentarios" className="rounded-xl border border-ink/10 p-6 hover:border-blue">
          <h2 className="font-display text-lg font-semibold text-ink">Comentarios</h2>
          <p className="mt-1 text-sm text-ink/60">Revisar comentarios pendientes</p>
        </Link>
        <Link href="/admin/miembros" className="rounded-xl border border-ink/10 p-6 hover:border-blue">
          <h2 className="font-display text-lg font-semibold text-ink">Miembros</h2>
          <p className="mt-1 text-sm text-ink/60">Aprobar solicitudes de afiliación</p>
        </Link>
      </div>
    </div>
  );
}