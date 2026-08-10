"use client";

import { useEffect, useState } from "react";

type HealthStatus = {
  status: string;
  timestamp: string;
};

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/api/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`Respuesta del servidor: ${res.status}`);
        return res.json();
      })
      .then((data: HealthStatus) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-6 py-32 px-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          La Expansión
        </h1>

        {error && (
          <p className="text-red-600 dark:text-red-400">
            No se pudo conectar con el backend: {error}
          </p>
        )}

        {!error && !health && (
          <p className="text-zinc-600 dark:text-zinc-400">
            Conectando con el backend…
          </p>
        )}

        {health && (
          <div className="rounded-lg border border-zinc-200 px-6 py-4 text-left dark:border-zinc-800">
            <p className="text-zinc-800 dark:text-zinc-200">
              Estado del backend: <strong>{health.status}</strong>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {health.timestamp}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}