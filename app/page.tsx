import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <svg
          className="pointer-events-none absolute -right-24 -top-24 h-[560px] w-[560px] opacity-30"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle cx="200" cy="200" r="80" stroke="#F2A93B" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="140" stroke="#2D8C7F" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="200" stroke="#F2A93B" strokeWidth="1" opacity="0.6" />
        </svg>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-32 sm:py-40">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber">
            Movimiento ciudadano
          </span>
          {/* PLACEHOLDER: reemplazar con el eslogan real del movimiento */}
          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Un movimiento que expande lo posible.
          </h1>
          {/* PLACEHOLDER: reemplazar con la bajada real */}
          <p className="max-w-xl text-lg text-cream/70">
            La Expansión nace para representar a quienes creen que otro camino
            es posible. Súmate al cambio que estamos construyendo.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/afiliate"
              className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-amber/90"
            >
              Afíliate ahora
            </Link>
            <Link
              href="/sobre-el-movimiento"
              className="rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-cream/60"
            >
              Conoce el movimiento
            </Link>
          </div>
        </div>
      </section>

      {/* PILARES — PLACEHOLDER: reemplazar con los valores/ejes reales */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold text-ink">
          Lo que nos mueve
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            { title: "Cercanía", desc: "Placeholder: texto sobre este pilar." },
            { title: "Transparencia", desc: "Placeholder: texto sobre este pilar." },
            { title: "Futuro", desc: "Placeholder: texto sobre este pilar." },
          ].map((item) => (
            <div key={item.title} className="border-t-2 border-teal pt-4">
              <h3 className="font-display text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-ink/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}