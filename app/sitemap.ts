import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Noticia = { slug: string; createdAt: string };
type Encuesta = { slug: string; createdAt: string };

async function getNoticias(): Promise<Noticia[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/noticias?estado=publicado`,
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getEncuestas(): Promise<Encuesta[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/encuestas`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [noticias, encuestas] = await Promise.all([
    getNoticias(),
    getEncuestas(),
  ]);

  const paginasEstaticas: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/prensa`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/encuestas`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/videos`, changeFrequency: "weekly", priority: 0.6 },
    {
      url: `${siteUrl}/sobre-el-movimiento`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    { url: `${siteUrl}/liderazgo`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/afiliate`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const paginasNoticias: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `${siteUrl}/prensa/${n.slug}`,
    lastModified: n.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const paginasEncuestas: MetadataRoute.Sitemap = encuestas.map((e) => ({
    url: `${siteUrl}/encuestas/${e.slug}`,
    lastModified: e.createdAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...paginasEstaticas, ...paginasNoticias, ...paginasEncuestas];
}
