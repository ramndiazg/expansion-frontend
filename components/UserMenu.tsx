"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { obtenerUsuario, cerrarSesion, alCambiarSesionUsuario, type SesionUsuario } from "@/lib/auth";
import { obtenerMiembro, cerrarSesionMiembro, alCambiarSesionMiembro, type SesionMiembro } from "@/lib/authMiembro";

function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/);
  const letras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return letras.join("") || "?";
}

function useCuentaActiva() {
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);
  const [miembro, setMiembro] = useState<SesionMiembro | null>(null);

  useEffect(() => {
    let ignore = false;

    Promise.resolve().then(() => {
      if (ignore) return;
      setUsuario(obtenerUsuario());
      setMiembro(obtenerMiembro());
    });

    const limpiarUsuario = alCambiarSesionUsuario(() => setUsuario(obtenerUsuario()));
    const limpiarMiembro = alCambiarSesionMiembro(() => setMiembro(obtenerMiembro()));

    return () => {
      ignore = true;
      limpiarUsuario();
      limpiarMiembro();
    };
  }, []);

  if (usuario) return { tipo: "usuario" as const, nombre: usuario.nombre };
  if (miembro) return { tipo: "miembro" as const, nombre: miembro.nombre };
  return null;
}

function handleLogoutPara(tipo: "usuario" | "miembro") {
  if (tipo === "usuario") cerrarSesion();
  else cerrarSesionMiembro();
}

export default function UserMenu({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const cuenta = useCuentaActiva();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  if (!cuenta) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className={
          variant === "mobile"
            ? "rounded-lg px-3 py-2.5 text-base font-medium text-ink/80 hover:bg-ink/5"
            : "text-sm font-medium text-ink/70 transition-colors hover:text-ink"
        }
      >
        Iniciar sesión
      </Link>
    );
  }

  const linkCuenta =
    cuenta.tipo === "usuario"
      ? { href: "/admin", label: "Panel admin" }
      : { href: "/cuenta", label: "Cambiar contraseña" };

  // --- Variante móvil: sin dropdown flotante, todo visible en línea ---
  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1 border-t border-ink/10 pt-3 mt-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
            {iniciales(cuenta.nombre)}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{cuenta.nombre}</p>
            <p className="text-xs text-ink/50">
              {cuenta.tipo === "usuario" ? "Panel administrativo" : "Miembro"}
            </p>
          </div>
        </div>
        <Link
          href={linkCuenta.href}
          onClick={onNavigate}
          className="rounded-lg px-3 py-2.5 text-base font-medium text-ink/80 hover:bg-ink/5"
        >
          {linkCuenta.label}
        </Link>
        <button
          onClick={() => {
            handleLogoutPara(cuenta.tipo);
            onNavigate?.();
          }}
          className="rounded-lg px-3 py-2.5 text-left text-base font-medium text-ink/80 hover:bg-ink/5"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  // --- Variante desktop: círculo + dropdown flotante ---
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white transition-opacity hover:opacity-90"
        aria-label="Menú de cuenta"
      >
        {iniciales(cuenta.nombre)}
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-ink/10 bg-white py-2 shadow-lg">
          <div className="border-b border-ink/10 px-4 py-2">
            <p className="text-sm font-medium text-ink">{cuenta.nombre}</p>
            <p className="text-xs text-ink/50">
              {cuenta.tipo === "usuario" ? "Panel administrativo" : "Miembro"}
            </p>
          </div>
          <Link
            href={linkCuenta.href}
            onClick={() => setAbierto(false)}
            className="block px-4 py-2 text-sm text-ink/80 hover:bg-ink/5"
          >
            {linkCuenta.label}
          </Link>
          <button
            onClick={() => {
              handleLogoutPara(cuenta.tipo);
              setAbierto(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-ink/80 hover:bg-ink/5"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}