"use client";

import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  titulo: string;
  texto?: string;
};

export default function ShareButtons({ url, titulo, texto }: ShareButtonsProps) {
  const [copiado, setCopiado] = useState(false);
  const [nativoDisponible] = useState(
    () => typeof navigator !== "undefined" && !!navigator.share
  );

  async function compartirNativo() {
    try {
      await navigator.share({ title: titulo, text: texto, url });
    } catch {
      // el usuario canceló el selector, no hacemos nada
    }
  }

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // noop
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTexto = encodeURIComponent(texto ?? titulo);

  const enlaces = [
    { nombre: "WhatsApp", href: `https://wa.me/?text=${encodedTexto}%20${encodedUrl}` },
    { nombre: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { nombre: "X", href: `https://twitter.com/intent/tweet?text=${encodedTexto}&url=${encodedUrl}` },
  ];

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-ink/60">Compartir:</span>

      {nativoDisponible ? (
        <button
          onClick={compartirNativo}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-blue hover:text-blue"
        >
          Compartir
        </button>
      ) : (
        enlaces.map((red) => (
          <a
            key={red.nombre}
            href={red.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-blue hover:text-blue"
          >
            {red.nombre}
          </a>
        ))
      )
      }

      <button
        onClick={copiarLink}
        className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-blue hover:text-blue"
      >
        {copiado ? "¡Copiado!" : "Copiar link"}
      </button>
    </div >
  );
}