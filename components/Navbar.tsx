"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { obtenerMiembro, cerrarSesionMiembro, type SesionMiembro } from "@/lib/authMiembro";

const links = [
  { href: "/noticias", label: "Noticias" },
  { href: "/sobre-el-movimiento", label: "Sobre el movimiento" },
  { href: "/liderazgo", label: "Liderazgo" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [miembro, setMiembro] = useState<SesionMiembro | null>(null);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) setMiembro(obtenerMiembro());
    });
    return () => {
      ignore = true;
    };
  }, []);

  function handleLogout() {
    cerrarSesionMiembro();
    setMiembro(null);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink" onClick={() => setOpen(false)}>
          La Expansión
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink/70 transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}

          {miembro ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-ink/60">Hola, {miembro.nombre.split(" ")[0]}</span>
              <button onClick={handleLogout} className="font-medium text-blue hover:underline">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-ink/70 transition-colors hover:text-ink">
              Iniciar sesión
            </Link>
          )}

          <Link href="/afiliate" className="rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue/90">
            Afíliate
          </Link>
        </nav>

        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Abrir menú">
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 px-6 py-4 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium text-ink/80 hover:bg-ink/5">
              {link.label}
            </Link>
          ))}

          {miembro ? (
            <button onClick={handleLogout} className="rounded-lg px-3 py-2.5 text-left text-base font-medium text-ink/80 hover:bg-ink/5">
              Cerrar sesión ({miembro.nombre.split(" ")[0]})
            </button>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium text-ink/80 hover:bg-ink/5">
              Iniciar sesión
            </Link>
          )}

          <Link href="/afiliate" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-blue px-5 py-3 text-center text-sm font-semibold text-white">
            Afíliate
          </Link>
        </nav>
      )}
    </header>
  );
}