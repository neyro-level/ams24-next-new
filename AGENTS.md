# AMS24 Next New — локальный router

## Проект

- Repository: `ams24-next-new`
- Product: платформа маркетинговых продуктов «Импульс»
- Domain: `https://ams24.ru/`
- Platform contract: AMS Static Site Core Standard 1.1
- UX scope: `PUBLIC_COMMERCIAL`
- Canonical Git mode: `SOURCECRAFT_PRIMARY_GITHUB_MIRROR`

## Обязательный порядок чтения

1. Глобальный `~/.codex/AGENTS.md` и релевантные AMS skills.
2. `docs/README.md`.
3. Только релевантные разделы `01_PRD.md`, `02_PRODUCT_STRUCTURE.md` и `03_ARCHITECTURE.md`.
4. READY-задача из `04_BACKLOG.md`.
5. `06_DESIGN_SYSTEM.md` для любого UI-scope.

## Инварианты

- Production — статический export Next.js; Nginx раздаёт готовый `out/`.
- CMS, БД, ORM, auth, Docker, worker и Redis не добавляются без отдельного архитектурного решения.
- Контентная граница: `Page -> Content Service -> Repository -> Local Adapter`.
- Канонические URL имеют ведущий и завершающий `/`.
- Страницы и UI не импортируют файлы контента напрямую.
- Zod-схемы являются source of truth для DTO.
- Server Components используются по умолчанию; client boundary остаётся на интерактивных листьях.
- Единственная визуальная система проекта — AMS Northline, адаптированная в `docs/06_DESIGN_SYSTEM.md`.
- Заявки отправляются только через относительный `/api/leads`, который Nginx проксирует в AMS Leads API.
- Персональные данные и секреты не попадают в аналитику, статический bundle или Git.
- Direct push в `main`, merge и production без явной команды владельца запрещены.

## Команды и версии

Команды появятся после foundation-эпика и фиксируются в `README.md` и `package.json`. До появления lockfile точные версии framework-пакетов считаются `TODO`, а не предполагаются.
