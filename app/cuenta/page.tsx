"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { obtenerMiembro, obtenerTokenMiembro, type SesionMiembro } from "@/lib/authMiembro";

type ComentarioPropio = {
  _id: string;
  texto: string;
  estado: string;
  createdAt: string;
  noticia: { titulo: string; slug: string };
};

const estadoLabels: Record<string, string> = {
  pendiente: "En revisión",
  aprobado: "Publicado",
  rechazado: "Rechazado",
};

export default function MiCuenta() {
  const router = useRouter();
  const [miembro, setMiembro] = useState<SesionMiembro | null>(null);
  const [listo, setListo] = useState(false);
  const [comentarios, setComentarios] = useState<ComentarioPropio[]>([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(true);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarNueva, setConfirmarNueva] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [okPassword, setOkPassword] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (ignore) return;
      const m = obtenerMiembro();
      if (!m) {
        router.replace("/login");
        return;
      }
      setMiembro(m);
      setListo(true);
    });
    return () => {
      ignore = true;
    };
  }, [router]);

  useEffect(() => {
    if (!listo) return;
    let ignore = false;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comentarios/mios`, {
      headers: { Authorization: `Bearer ${obtenerTokenMiembro()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setComentarios(data);
          setCargandoComentarios(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [listo]);

  async function handleCambiarPassword(e: React.FormEvent) {
    e.preventDefault();
    setErrorPassword("");
    setOkPassword(false);

    if (passwordNueva !== confirmarNueva) {
      setErrorPassword("Las contraseñas nuevas no coinciden");
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/cambiar-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${obtenerTokenMiembro()}`,
        },
        body: JSON.stringify({ passwordActual, passwordNueva }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar la contraseña");
      setOkPassword(true);
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmarNueva("");
    } catch (err) {
      setErrorPassword(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  if (!listo) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Mi cuenta
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Hola, {miembro?.nombre}
      </h1>

      {/* Cambiar contraseña */}
      <section className="mt-10 rounded-xl border border-ink/10 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Cambiar contraseña</h2>
        <form onSubmit={handleCambiarPassword} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-ink/70">Contraseña actual</label>
            <input required type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Nueva contraseña</label>
            <input required type="password" minLength={6} value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Confirmar nueva contraseña</label>
            <input required type="password" minLength={6} value={confirmarNueva} onChange={(e) => setConfirmarNueva(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
          </div>
          {errorPassword && <p className="text-sm text-red-600">{errorPassword}</p>}
          {okPassword && <p className="text-sm text-teal-700">Contraseña actualizada correctamente.</p>}
          <button type="submit" disabled={guardando}
            className="mt-1 w-fit rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {guardando ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>
      </section>

      {/* Mis comentarios */}
      <section className="mt-8 rounded-xl border border-ink/10 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Mis comentarios</h2>
        {cargandoComentarios && <p className="mt-3 text-sm text-ink/50">Cargando...</p>}
        {!cargandoComentarios && comentarios.length === 0 && (
          <p className="mt-3 text-sm text-ink/50">Todavía no has comentado en ninguna noticia.</p>
        )}
        <div className="mt-3 flex flex-col gap-3">
          {comentarios.map((c) => (
            <div key={c._id} className="rounded-lg border border-ink/10 p-3">
              <div className="flex items-center justify-between">
                <Link href={`/noticias/${c.noticia.slug}`} className="text-sm font-medium text-ink hover:underline">
                  {c.noticia.titulo}
                </Link>
                <span className="text-xs text-ink/50">{estadoLabels[c.estado]}</span>
              </div>
              <p className="mt-1 text-sm text-ink/70">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mis votos — placeholder hasta construir encuestas */}
      <section className="mt-8 rounded-xl border border-ink/10 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Mis votos en encuestas</h2>
        <p className="mt-3 text-sm text-ink/50">
          Próximamente — todavía no hemos construido el sistema de encuestas.
        </p>
      </section>
    </div>
  );
}