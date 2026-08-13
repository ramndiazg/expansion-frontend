import Link from "next/link";

type Encuesta = {
  _id: string;
  slug: string;
  pregunta: string;
  opciones: { _id: string; texto: string; votos: number }[];
  activa: boolean;
  createdAt: string;
};

async function getEncuestas(): Promise<Encuesta[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/encuestas?activa=true`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function EncuestasPage() {
  const encuestas = await getEncuestas();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Participación
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">Encuestas</h1>

      {encuestas.length === 0 && (
        <p className="mt-10 text-ink/60">No hay encuestas activas en este momento.</p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {encuestas.map((encuesta) => {
          const totalVotos = encuesta.opciones.reduce((acc, o) => acc + o.votos, 0);
          return (
            <Link
              key={encuesta._id}
              href={`/encuestas/${encuesta.slug}`}
              className="group rounded-xl border border-ink/10 p-6 transition-colors hover:border-slate"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-blue">
                Encuesta activa
              </span>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink group-hover:text-blue">
                {encuesta.pregunta}
              </h2>
              <p className="mt-4 text-xs text-ink/40">
                {totalVotos} voto{totalVotos !== 1 ? "s" : ""} ·{" "}
                {new Date(encuesta.createdAt).toLocaleDateString("es-DO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}