# ams24-next-new

Новый статический коммерческий сайт `ams24.ru` для платформы маркетинговых продуктов «Импульс».

Текущий этап: статический Next.js-сайт собран и смёржен в canonical `main`. Production-релиз не выполнялся и требует отдельной команды владельца.

Карта проекта и Source of Truth: [`docs/README.md`](docs/README.md).

## Команды

- `corepack pnpm dev` — локальный запуск.
- `corepack pnpm build` — статический production build в `out/`.
- `corepack pnpm verify` — полный локальный proof: typecheck, lint, content tests, SourceCraft CI guard, static guards, build и artifact guard.
