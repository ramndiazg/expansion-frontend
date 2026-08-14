type Video = {
  _id: string;
  titulo: string;
  videoUrl: string;
  fechaPublicacion?: string;
  createdAt: string;
};

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|(?:v|embed|shorts)\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

async function getVideos(): Promise<Video[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/videos?estado=publicado`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Multimedia
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">Videos</h1>

      {videos.length === 0 && (
        <p className="mt-10 text-ink/60">Todavía no hay videos publicados.</p>
      )}

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {videos.map((video) => {
          const embedUrl = youtubeEmbedUrl(video.videoUrl);
          return (
            <div key={video._id} className="rounded-xl border border-ink/10 p-4">
              {embedUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="text-sm text-red-600">Link de YouTube no válido</p>
              )}
              <h2 className="mt-3 font-display text-lg font-semibold text-ink">
                {video.titulo}
              </h2>
              <p className="mt-1 text-xs text-ink/40">
                {new Date(video.fechaPublicacion ?? video.createdAt).toLocaleDateString("es-DO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}