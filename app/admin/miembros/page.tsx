"use client";

import { useEffect, useState } from "react";
import { obtenerToken } from "@/lib/auth";

type Miembro = {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  provincia: string;
  municipio: string;
  estado: string;
  createdAt: string;
};

async function fetchMiembros(): Promise<Miembro[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/miembros`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  if (!res.ok) return [];
  return res.json();
}

const estadoStyles: Record<string, string> = {
  pendiente: "bg-ink/10 text-ink/60",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
};

export default function GestionMiembros() {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>("pendiente");

  useEffect(() => {
    let ignore = false;
    fetchMiembros().then((data) => {
      if (!ignore) {
        setMiembros(data);
        setCargando(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  async function cambiarEstado(id: string, estado: "aprobado" | "rechazado") {
    setProcesando(id);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/miembros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify({ estado }),
    });
    setMiembros((prev) =>
      prev.map((m) => (m._id === id ? { ...m, estado } : m))
    );
    setProcesando(null);
  }

  const visibles = filtro === "todos" ? miembros : miembros.filter((m) => m.estado === filtro);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Miembros</h1>
      <p className="mt-1 text-ink/60">Solicitudes de afiliación.</p>

      <div className="mt-4 flex gap-2">
        {["pendiente", "aprobado", "rechazado", "todos"].map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${filtro === f ? "bg-ink text-white" : "bg-ink/5 text-ink/60"
              }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {cargando && <p className="mt-6 text-ink/60">Cargando...</p>}
      {!cargando && visibles.length === 0 && (
        <p className="mt-10 text-ink/50">No hay miembros en este filtro.</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {visibles.map((m) => (
          <div key={m._id} className="rounded-lg border border-ink/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-ink">
                  {m.nombre} {m.apellido}
                </p>
                <p className="text-sm text-ink/50">{m.email} · {m.telefono}</p>
                <p className="text-sm text-ink/50">{m.municipio ? `${m.municipio}, ` : ""}{m.provincia}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${estadoStyles[m.estado]}`}>
                {m.estado}
              </span>
            </div>

            {m.estado === "pendiente" && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => cambiarEstado(m._id, "aprobado")}
                  disabled={procesando === m._id}
                  className="rounded-full bg-blue px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => cambiarEstado(m._id, "rechazado")}
                  disabled={procesando === m._id}
                  className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-semibold text-ink/70 disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}