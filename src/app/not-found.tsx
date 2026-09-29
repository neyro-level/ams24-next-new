import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-[var(--ams-accent)]">
        404
      </p>
      <h1 className="text-4xl font-semibold text-[var(--ams-fg)]">Страница не найдена</h1>
      <p className="mt-4 text-lg leading-8 text-[var(--ams-muted)]">
        Эта страница ещё не опубликована или адрес изменился.
      </p>
      <Link className="mt-8 text-[var(--ams-accent)] underline" href="/">
        На главную
      </Link>
    </main>
  )
}
