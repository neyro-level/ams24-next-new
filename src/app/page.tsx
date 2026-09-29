export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-[var(--ams-accent)]">
        AMS24
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--ams-fg)] md:text-6xl">
        Импульс
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ams-muted)]">
        Статический foundation сайта готовится по утверждённой архитектуре: сначала стек,
        маршруты и система блоков, затем тексты, доказательства и дизайн.
      </p>
    </main>
  )
}
