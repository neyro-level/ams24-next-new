# Документация ams24-next-new

Status: Active  
Version: 1.0  
Updated: 2026-09-29

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

## Статус комплекта

| Документ | Статус | Комментарий |
|---|---|---|
| `01_PRD.md` | Draft | требует подтверждения продуктовых формулировок и KPI |
| `02_PRODUCT_STRUCTURE.md` | Active | верхнеуровневая архитектура и короткие URL согласованы владельцем |
| `03_ARCHITECTURE.md` | Draft | platform contract определён; exact package versions появятся после scaffold |
| `04_BACKLOG.md` | Approved | canonical master plan v4 утверждён владельцем; AH-01 выполняет Task Manager import и Developer handoff |
| `05_RELEASE_CHECKLIST.md` | Draft | уточняется до первого release |
| `06_DESIGN_SYSTEM.md` | Draft | Northline принят как input; intake завершается после token fixture и representative page |

## Текущий фокус

`EPIC-00 — Documentation Foundation` завершён. Master plan v4 имеет статус `APPROVED`. Следующий шаг — AH-01: Git/SourceCraft checkpoint, Task Manager import/reconcile и Developer handoff. Production не входит в это approval.

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
