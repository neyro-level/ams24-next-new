const swatches = [
  ['background', 'bg-background text-foreground'],
  ['surface', 'bg-surface text-foreground'],
  ['surface-muted', 'bg-surface-muted text-foreground'],
  ['dark-section', 'bg-surface-dark text-surface-dark-foreground'],
  ['primary', 'bg-primary text-primary-foreground'],
] as const

export function TokenFixture() {
  return (
    <section aria-label="Token fixture" className="mt-section-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {swatches.map(([name, className]) => (
          <div className={`${className} rounded-card border border-border p-4 shadow-card`} key={name}>
            <p className="text-label font-bold uppercase">{name}</p>
            <p className="mt-6 text-caption">Кириллица · 400–800 · OFL</p>
          </div>
        ))}
      </div>
    </section>
  )
}
