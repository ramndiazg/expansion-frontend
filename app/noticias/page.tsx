import Link from "next/link";

type Noticia = {
  _id: string;
  titulo: string;
  slug: string;
  resumen: string;
  categoria: string;
  fechaPublicacion?: string;
  createdAt: string;
};

const categoriaLabels: Record<string, string> = {
  comunicado: "Comunicado",
  actividad: "Actividad",
  declaracion: "Declaración",
  en_los_medios: "En los medios",
};

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

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q, categoria } = await searchParams;
  const noticias = await getNoticias(q, categoria);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Prensa
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">Noticias</h1>

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
        {(q || categoria) && (
          <Link
            href="/noticias"
            className="flex items-center justify-center rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/60"
          >
            Limpiar
          </Link>
        )}
      </form>

      {noticias.length === 0 && (
        <p className="mt-10 text-ink/60">
          {q || categoria ? "No se encontraron noticias con esos filtros." : "Todavía no hay noticias publicadas."}
        </p>
      )}

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {noticias.map((noticia) => (
          <Link
            key={noticia._id}
            href={`/noticias/${noticia.slug}`}
            className="group rounded-xl border border-ink/10 p-6 transition-colors hover:border-slate"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-blue">
              {categoriaLabels[noticia.categoria] ?? noticia.categoria}
            </span>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink group-hover:text-blue">
              {noticia.titulo}
            </h2>
            <p className="mt-2 text-sm text-ink/60">{noticia.resumen}</p>
            <p className="mt-4 text-xs text-ink/40">
              {new Date(noticia.fechaPublicacion ?? noticia.createdAt).toLocaleDateString("es-DO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}