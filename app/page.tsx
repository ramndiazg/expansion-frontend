import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <svg
          className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] opacity-30 sm:h-[560px] sm:w-[560px]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle cx="200" cy="200" r="80" stroke="#4E7FDB" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="140" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="200" stroke="#4E7FDB" strokeWidth="1" opacity="0.6" />
        </svg>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20 sm:gap-8 sm:py-32 lg:py-40">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
            Movimiento ciudadano
          </span>

          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Un movimiento que{" "}
            <span className="bg-gradient-to-r from-blue to-sky-300 bg-clip-text text-transparent">
              expande
            </span>{" "}
            lo posible.
          </h1>

          <p className="max-w-xl text-base text-white/70 sm:text-lg">
            La Expansión nace para representar a quienes creen que otro camino
            es posible. Súmate al cambio que estamos construyendo.
          </p>

          <Link
            href="/liderazgo"
            className="group flex w-fit items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
          >
            {/* PLACEHOLDER: reemplazar por foto real de Mario Díaz */}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase">
              MD
            </span>
            <span>
              Liderado por{" "}
              <span className="font-semibold text-white">Mario Díaz</span>,
              Secretario General
            </span>
          </Link>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/afiliate"
              className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
            >
              Afíliate ahora
            </Link>
            <Link
              href="/sobre-el-movimiento"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60"
            >
              Conoce el movimiento
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Lo que nos mueve
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            { title: "Cercanía", desc: "Placeholder: texto sobre este pilar." },
            { title: "Transparencia", desc: "Placeholder: texto sobre este pilar." },
            { title: "Futuro", desc: "Placeholder: texto sobre este pilar." },
          ].map((item) => (
            <div key={item.title} className="border-t-2 border-slate pt-4">
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