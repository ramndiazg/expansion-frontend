export default function Liderazgo() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Liderazgo
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">
        Dirección del movimiento
      </h1>
      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="h-40 w-40 shrink-0 rounded-2xl bg-ink-soft" />
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Mario Díaz</h2>
          <p className="text-sm font-medium uppercase tracking-wide text-blue">
            Secretario General
          </p>
          <p className="mt-4 max-w-xl text-ink/70">
            Texto placeholder de la biografía y trayectoria de Mario Díaz al
            frente de La Expansión.
          </p>
        </div>
      </div>
      <div className="mt-20">
        <h2 className="font-display text-2xl font-semibold text-ink">Estructura organizativa</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {["Coordinación Nacional", "Coordinación de Comunicaciones", "Coordinación de Voluntariado"].map((rol) => (
            <div key={rol} className="rounded-lg border border-ink/10 p-5">
              <div className="h-16 w-16 rounded-full bg-ink-soft" />
              <p className="mt-4 font-medium text-ink">{rol}</p>
              <p className="text-sm text-ink/50">Placeholder: nombre</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}