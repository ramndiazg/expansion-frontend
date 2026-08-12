"use client";

import { useState } from "react";
import { obtenerToken, obtenerUsuario } from "@/lib/auth";

export default function PerfilAdmin() {
  const usuario = obtenerUsuario();
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarNueva, setConfirmarNueva] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk(false);

    if (passwordNueva !== confirmarNueva) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/cambiar-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${obtenerToken()}`,
        },
        body: JSON.stringify({ passwordActual, passwordNueva }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar la contraseña");
      setOk(true);
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmarNueva("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl font-semibold text-ink">Mi perfil</h1>
      <p className="mt-1 text-ink/60">{usuario?.nombre} · {usuario?.email}</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        {ok && <p className="text-sm text-teal-700">Contraseña actualizada correctamente.</p>}
        <button type="submit" disabled={guardando}
          className="mt-1 w-fit rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {guardando ? "Guardando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
}