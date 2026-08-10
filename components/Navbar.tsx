import Link from "next/link";

const links = [
  { href: "/sobre-el-movimiento", label: "Sobre el movimiento" },
  { href: "/liderazgo", label: "Liderazgo" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          La Expansión
        </Link>

        <nav className="flex flex-wrap items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/afiliate"
            className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-amber/90"
          >
            Afíliate
          </Link>
        </nav>
      </div>
    </header>
  );
}