# Документация ams24-next-new

Status: Active  
Version: 1.0  
Updated: 2026-09-30

## Назначение

Этот каталог — единая карта продукта «Импульс». Детали не дублируются между файлами: каждое решение имеет один Source of Truth.

## Source of Truth

| Область | Source of Truth |
|---|---|
| продукт, аудитории, цели, scope | `01_PRD.md` |
| страницы, URL, пользовательские маршруты, SEO-кластеры | `02_PRODUCT_STRUCTURE.md` |
| стек, content/data boundaries, modules, security, delivery и production | `03_ARCHITECTURE.md` |
| мастер-план, эпики, задачи, зависимости и текущий фокус | `04_BACKLOG.md` |
| release gate, rollout, live proof и rollback | `05_RELEASE_CHECKLIST.md` |
| визуальная система и UI-policy | `06_DESIGN_SYSTEM.md` |
| конкурентное и SEO-evidence | `research/COMPETITOR_SEO_BASELINE.md` |
| external preflight: leads/legal/analytics/CAPTCHA/current URLs | `research/EXTERNAL_PREFLIGHT_EPIC_01_5.md` |

## Статус комплекта

| Документ | Статус | Комментарий |
|---|---|---|
| `01_PRD.md` | Draft | продуктовые формулировки, KPI, тарифы, кейсы и юридические claims требуют подтверждения владельца |
| `02_PRODUCT_STRUCTURE.md` | Active | верхнеуровневая архитектура и короткие URL согласованы владельцем |
| `03_ARCHITECTURE.md` | Active | статический Next.js contract, pinned stack, delivery policy и release boundary recorded |
| `04_BACKLOG.md` | Approved / Implemented | canonical master plan v4 утверждён владельцем и реализован до EPIC-09; production вне approval |
| `05_RELEASE_CHECKLIST.md` | Draft / Blocked | релиз требует отдельной команды и закрытия внешних production-блокеров |
| `06_DESIGN_SYSTEM.md` | Active | Northline адаптирован в AMS Northline for Impulse и применён в UI foundation |

## Текущий фокус

Implementation graph `AMS24-IMPULSE-2026 v4` реализован и смёржен в canonical `main@97800548162ec8384f9afebee2adec805a351bf4`. Production не выполнялся. Следующий безопасный фокус: подтвердить контент/юридические claims, leads API, аналитику, CAPTCHA, redirect inventory и затем отдельной командой запускать production release.

## Как читать

1. `AGENTS.md` в корне.
2. Этот файл.
3. Релевантный раздел PRD, Product Structure и Architecture.
4. Текущая READY-задача из Backlog.
5. Design System для UI-задач.

## Входные нормативы

- AMS Static Site Core Standard 1.1 — технический platform contract.
- AMS UI Core v5.0 — UI engineering contract.
- AMS Northline v3.1 — визуальный input от действующего `ams24.ru`.

Входные нормативы не являются проектными задачами и не подменяют файлы Source of Truth выше.
