import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButtons from "@/components/ShareButtons";
import EncuestaVotacion from "@/components/EncuestaVotacion";

type Encuesta = {
  _id: string;
  slug: string;
  pregunta: string;
  opciones: { _id: string; texto: string; votos: number }[];
  activa: boolean;
  createdAt: string;
};

async function getEncuesta(slug: string): Promise<Encuesta | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/encuestas/slug/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const encuesta = await getEncuesta(slug);

  if (!encuesta) return { title: "Encuesta no encontrada" };

  const descripcion = `Vota en esta encuesta de La Expansión: ${encuesta.pregunta}`;

  return {
    title: encuesta.pregunta,
    description: descripcion,
    openGraph: {
      title: encuesta.pregunta,
      description: descripcion,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: encuesta.pregunta,
      description: descripcion,
    },
  };
}

export default async function EncuestaDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const encuesta = await getEncuesta(slug);

  if (!encuesta) notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/encuestas/${encuesta.slug}`;

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <span className="text-xs font-medium uppercase tracking-wide text-blue">
        Encuesta
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {encuesta.pregunta}
      </h1>
      <p className="mt-4 text-sm text-ink/50">
        {new Date(encuesta.createdAt).toLocaleDateString("es-DO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {!encuesta.activa && " · Cerrada"}
      </p>

      <EncuestaVotacion encuesta={encuesta} />

      <ShareButtons
        url={url}
        titulo={encuesta.pregunta}
        texto={`Vota en esta encuesta de La Expansión: ${encuesta.pregunta}`}
      />
    </article>
  );
}