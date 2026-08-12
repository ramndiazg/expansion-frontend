"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { guardarSesion } from "@/lib/auth";
import { guardarSesionMiembro } from "@/lib/authMiembro";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      if (data.tipo === "usuario") {
        guardarSesion(data.token, data.usuario);
        router.push("/admin");
      } else {
        guardarSesionMiembro(data.token, data.miembro);
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Contraseña</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={cargando}
          className="mt-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        ¿Todavía no eres miembro?{" "}
        <Link href="/afiliate" className="font-medium text-blue hover:underline">Afíliate aquí</Link>
      </p>
    </div>
  );
}