"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerToken } from "@/lib/auth";

type Noticia = {
  _id: string;
  titulo: string;
  estado: string;
  categoria: string;
  createdAt: string;
};

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/noticias`, {
      headers: { Authorization: `Bearer ${obtenerToken()}` },
    })
      .then((res) => res.json())
      .then(setNoticias)
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Noticias</h1>
        <Link href="/admin/noticias/nueva" className="rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white">
          + Nueva noticia
        </Link>
      </div>

      {cargando && <p className="mt-6 text-ink/60">Cargando...</p>}

      <div className="mt-6 flex flex-col gap-3">
        {noticias.map((n) => (
          <div key={n._id} className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3">
            <span className="text-ink">{n.titulo}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${n.estado === "publicado" ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/60"}`}>
              {n.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}