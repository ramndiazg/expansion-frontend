export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-cream/80">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <p className="font-display text-lg text-cream">La Expansión</p>
        <p className="mt-2 max-w-md text-cream/60">
          {/* PLACEHOLDER: reemplazar con la descripción/lema real del movimiento */}
          Un movimiento ciudadano comprometido con el futuro del país.
        </p>
        <p className="mt-6 text-xs text-cream/40">
          © {new Date().getFullYear()} La Expansión. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}