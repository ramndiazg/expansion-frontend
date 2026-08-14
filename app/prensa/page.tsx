import Link from "next/link";

type Noticia = {
  _id: string;
  titulo: string;
  slug: string;
  resumen: string;
  categoria: string;
  imagenDestacada?: string;
  fechaPublicacion?: string;
  createdAt: string;
};

const categoriaLabels: Record<string, string> = {
  comunicado: "Comunicado",
  actividad: "Actividad",
  declaracion: "Declaración",
  en_los_medios: "En los medios",
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getNoticias(q?: string, categoria?: string): Promise<Noticia[]> {
  try {
    const params = new URLSearchParams({ estado: "publicado" });
    if (q) params.set("q", q);
    if (categoria) params.set("categoria", categoria);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/noticias?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PrensaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q, categoria } = await searchParams;
  const noticias = await getNoticias(q, categoria);
  const [destacada, ...resto] = noticias;
  const hayFiltros = Boolean(q || categoria);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Prensa
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">Sala de Prensa</h1>
      <p className="mt-3 text-ink/60">
        Comunicados, actividades, declaraciones y cobertura del movimiento.
      </p>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar noticias..."
          className="flex-1 rounded-lg border border-ink/15 px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <select
          name="categoria"
          defaultValue={categoria ?? ""}
          className="rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          <option value="">Todas las categorías</option>
          <option value="comunicado">Comunicado</option>
          <option value="actividad">Actividad</option>
          <option value="declaracion">Declaración</option>
          <option value="en_los_medios">En los medios</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
        >
          Buscar
        </button>
        {hayFiltros && (
          <Link
            href="/prensa"
            className="flex items-center justify-center rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/60"
          >
            Limpiar
          </Link>
        )}
      </form>

      {noticias.length === 0 && (
        <p className="mt-10 text-ink/60">
          {hayFiltros ? "No se encontraron noticias con esos filtros." : "Todavía no hay noticias publicadas."}
        </p>
      )}

      {!hayFiltros && destacada && (
        <Link
          href={`/prensa/${destacada.slug}`}
          className="group mt-10 grid gap-6 overflow-hidden rounded-2xl border border-ink/10 transition-colors hover:border-slate sm:grid-cols-2"
        >
          <div className="aspect-video bg-ink/5 sm:aspect-auto">
            {destacada.imagenDestacada ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={destacada.imagenDestacada}
                alt={destacada.titulo}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink/20">
                La Expansión
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <span className="text-xs font-medium uppercase tracking-wide text-blue">
              Más reciente · {categoriaLabels[destacada.categoria] ?? destacada.categoria}
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink group-hover:text-blue sm:text-3xl">
              {destacada.titulo}
            </h2>
            <p className="mt-3 text-ink/60">{destacada.resumen}</p>
            <p className="mt-4 text-xs text-ink/40">
              {formatearFecha(destacada.fechaPublicacion ?? destacada.createdAt)}
            </p>
          </div>
        </Link>
      )}

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {(hayFiltros ? noticias : resto).map((noticia) => (
          <Link
            key={noticia._id}
            href={`/prensa/${noticia.slug}`}
            className="group overflow-hidden rounded-xl border border-ink/10 transition-colors hover:border-slate"
          >
            <div className="aspect-video bg-ink/5">
              {noticia.imagenDestacada ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={noticia.imagenDestacada}
                  alt={noticia.titulo}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-ink/20">
                  La Expansión
                </div>
              )}
            </div>
            <div className="p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-blue">
                {categoriaLabels[noticia.categoria] ?? noticia.categoria}
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold text-ink group-hover:text-blue">
                {noticia.titulo}
              </h3>
              <p className="mt-2 text-sm text-ink/60">{noticia.resumen}</p>
              <p className="mt-4 text-xs text-ink/40">
                {formatearFecha(noticia.fechaPublicacion ?? noticia.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}