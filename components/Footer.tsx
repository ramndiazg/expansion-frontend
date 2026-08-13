import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white/80">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <p className="font-display text-lg text-white">La Expansión</p>
        <p className="mt-2 max-w-md text-white/60">
          {/* PLACEHOLDER: reemplazar con la descripción/lema real del movimiento */}
          Un movimiento ciudadano comprometido con el futuro del país.
        </p>
        <div className="mt-6 flex items-center justify-between text-xs text-white/40">
          <p>© {new Date().getFullYear()} La Expansión. Todos los derechos reservados.</p>
          <Link href="/login" className="hover:text-white/70">

          </Link>
        </div>
      </div>
    </footer>
  );
}