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

async function getNoticias(): Promise<Noticia[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/noticias?estado=publicado`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function NoticiasPage() {
  const noticias = await getNoticias();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Prensa
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">Noticias</h1>

      {noticias.length === 0 && (
        <p className="mt-10 text-ink/60">Todavía no hay noticias publicadas.</p>
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