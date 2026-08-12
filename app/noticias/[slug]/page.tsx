import { notFound } from "next/navigation";
import Comentarios from "@/components/Comentarios";

type Noticia = {
  _id: string;
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  categoria: string;
  autor: string;
  imagenDestacada?: string;
  imagenesAdicionales?: string[];
  videoUrl?: string;
  fechaPublicacion?: string;
  createdAt: string;
  tags: string[];
};

const categoriaLabels: Record<string, string> = {
  comunicado: "Comunicado",
  actividad: "Actividad",
  declaracion: "Declaración",
  en_los_medios: "En los medios",
};

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

async function getNoticia(slug: string): Promise<Noticia | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/noticias/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function NoticiaDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = await getNoticia(slug);

  if (!noticia) notFound();

  const embedUrl = noticia.videoUrl ? youtubeEmbedUrl(noticia.videoUrl) : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <span className="text-xs font-medium uppercase tracking-wide text-blue">
        {categoriaLabels[noticia.categoria] ?? noticia.categoria}
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {noticia.titulo}
      </h1>
      <p className="mt-4 text-sm text-ink/50">
        Por {noticia.autor} ·{" "}
        {new Date(noticia.fechaPublicacion ?? noticia.createdAt).toLocaleDateString("es-DO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {noticia.imagenDestacada && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={noticia.imagenDestacada}
          alt={noticia.titulo}
          className="mt-8 w-full rounded-xl object-cover"
        />
      )}

      <div className="mt-10 whitespace-pre-line text-lg leading-relaxed text-ink/80">
        {noticia.contenido}
      </div>

      {embedUrl && (
        <div className="mt-10 aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {noticia.imagenesAdicionales && noticia.imagenesAdicionales.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {noticia.imagenesAdicionales.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={noticia.titulo}
              className="aspect-square w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {noticia.tags?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {noticia.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink/60">
              {tag}
            </span>
          ))}
        </div>
      )}

      <Comentarios noticiaId={noticia._id} />
    </article>
  );
}