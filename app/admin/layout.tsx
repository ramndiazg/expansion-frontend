"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerToken, obtenerUsuario, cerrarSesion, type SesionUsuario } from "@/lib/auth";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let ignore = false;

    Promise.resolve().then(() => {
      if (ignore) return;
      const token = obtenerToken();
      const user = obtenerUsuario();
      if (!token) {
        router.replace("/login");
        return;
      }
      setUsuario(user);
      setListo(true);
    });

    return () => {
      ignore = true;
    };
  }, [router]);

  if (!listo) return null;

  function handleLogout() {
    cerrarSesion();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-ink/[0.02]">
      <div className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-display text-lg font-semibold text-ink">
            Panel — La Expansión
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink/60">
              {usuario?.nombre} · {usuario?.rol}
            </span>
            <button onClick={handleLogout} className="font-medium text-blue hover:underline">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}