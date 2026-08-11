export default function SobreElMovimiento() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Sobre el movimiento
      </span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">
        Nuestra historia
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">
        La Expansión surge de la convicción de que el cambio se construye desde
        la ciudadanía organizada. Este texto es un placeholder — reemplazar con
        la historia real del movimiento: cuándo y por qué nació, quiénes lo
        impulsaron, y qué momento marcó su fundación.
      </p>
      <div className="mt-16 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Misión</h2>
          <p className="mt-3 text-ink/70">Texto placeholder de la misión del movimiento.</p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Visión</h2>
          <p className="mt-3 text-ink/70">Texto placeholder de la visión del movimiento.</p>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="font-display text-2xl font-semibold text-ink">Valores</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {["Cercanía", "Transparencia", "Compromiso", "Innovación"].map((valor) => (
            <li key={valor} className="rounded-lg border border-ink/10 px-4 py-3 text-ink/80">
              {valor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}