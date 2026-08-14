"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { provincias, provinciasMunicipios } from "@/lib/provinciasMunicipios";
import { guardarSesionMiembro } from "@/lib/authMiembro";

function AfiliateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    email: "",
    telefono: "",
    provincia: "",
    municipio: "",
    sectorInteres: "",
    password: "",
    confirmarPassword: "",
  });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function update(campo: string, valor: string) {
    setForm((f) => {
      if (campo === "provincia") {
        return { ...f, provincia: valor, municipio: "" };
      }
      return { ...f, [campo]: valor };
    });
  }

  const municipiosDisponibles = form.provincia
    ? provinciasMunicipios[form.provincia] ?? []
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setEnviando(true);
    try {
      const { password, confirmarPassword, ...resto } = form;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/miembros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resto, passwordHash: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar la solicitud");

      // Auto-aprobado: la cuenta ya está activa, se loguea directo con el
      // mismo formato de sesión que usa /login (token + datos del miembro).
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.tipo === "miembro") {
        guardarSesionMiembro(loginData.token, loginData.miembro);
        router.push(redirect || "/");
        router.refresh();
        return;
      }

      // Si por algo el auto-login falla, igual la cuenta quedó creada —
      // se manda a /login en vez de dejar a la persona atascada.
      router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Membresía
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Afíliate a La Expansión
      </h1>
      <p className="mt-3 text-ink/60">
        Completa tus datos — tu cuenta queda activa de inmediato.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink/70">Nombre</label>
            <input required value={form.nombre} onChange={(e) => update("nombre", e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Apellido</label>
            <input required value={form.apellido} onChange={(e) => update("apellido", e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Cédula</label>
          <input
            required
            value={form.cedula}
            onChange={(e) => update("cedula", e.target.value)}
            placeholder="001-1566974-2"
            pattern="\d{3}-\d{7}-\d{1}"
            title="Formato: XXX-XXXXXXX-X"
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Email</label>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Teléfono</label>
          <input required value={form.telefono} onChange={(e) => update("telefono", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink/70">Provincia</label>
            <select
              required
              value={form.provincia}
              onChange={(e) => update("provincia", e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-blue"
            >
              <option value="">Selecciona...</option>
              {provincias.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Municipio</label>
            <select
              required
              value={form.municipio}
              onChange={(e) => update("municipio", e.target.value)}
              disabled={!form.provincia}
              className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 outline-none focus:border-blue disabled:bg-ink/5 disabled:text-ink/40"
            >
              <option value="">
                {form.provincia ? "Selecciona..." : "Elige provincia primero"}
              </option>
              {municipiosDisponibles.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Sector </label>
          <input value={form.sectorInteres} onChange={(e) => update("sectorInteres", e.target.value)}
            placeholder=""
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Contraseña</label>
          <input required type="password" minLength={6} value={form.password} onChange={(e) => update("password", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
          <p className="mt-1 text-xs text-ink/40">La usarás para iniciar sesión.</p>
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Confirmar contraseña</label>
          <input required type="password" minLength={6} value={form.confirmarPassword} onChange={(e) => update("confirmarPassword", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 outline-none focus:border-blue" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={enviando}
          className="mt-2 rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {enviando ? "Creando cuenta..." : "Afiliarme"}
        </button>
      </form>
    </div>
  );
}

export default function Afiliate() {
  return (
    <Suspense fallback={null}>
      <AfiliateForm />
    </Suspense>
  );
}