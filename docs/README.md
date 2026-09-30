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
| SEO policy, intent ownership, indexability and search artifact contracts | `07_SEO_SYSTEM.md` |
| конкурентное и SEO-evidence | `research/COMPETITOR_SEO_BASELINE.md` |
| external preflight: leads/legal/analytics/CAPTCHA/current URLs | `research/EXTERNAL_PREFLIGHT_EPIC_01_5.md` |
| remediation baseline classification | `research/BASELINE_CLAIMS_REGISTER_CR_00_1.md` |

## Статус комплекта

| Документ | Статус | Комментарий |
|---|---|---|
| `01_PRD.md` | Draft | продуктовые формулировки, KPI, тарифы, кейсы и юридические claims требуют подтверждения владельца |
| `02_PRODUCT_STRUCTURE.md` | Active | верхнеуровневая архитектура и короткие URL согласованы владельцем |
| `03_ARCHITECTURE.md` | Active | статический Next.js contract, pinned stack, SEO artifacts, Nginx/rollout repository contracts and remaining production blockers recorded |
| `04_BACKLOG.md` | Approved | remediation plan `AMS24-CONSTITUTION-REMEDIATION-2026 v3` утверждён владельцем; прежний v4 завершён и сохранён в Git/закрытом Task Manager |
| `05_RELEASE_CHECKLIST.md` | Draft / Blocked | remediation proof through EPIC-19 recorded; production still requires explicit command and release-only checks |
| `06_DESIGN_SYSTEM.md` | Active | Northline адаптирован; CR-18/CR-19 record accessibility, performance and zero-P0/P1 UI drift proof |
| `07_SEO_SYSTEM.md` | Active | source priority, intent ownership, indexability, sitemap/robots/metadata artifact proof and release crawl rules recorded |

## Текущий фокус

Предыдущий execution graph `AMS24-IMPULSE-2026 v4` закрыт: 57/57 задач завершены, production не выполнялся. Remediation-план `AMS24-CONSTITUTION-REMEDIATION-2026 v3` утверждён владельцем и импортирован в Task Manager cleanly. Текущий фокус — Wave 20 final documentation reconciliation and closeout. EPIC-18/EPIC-19 integrated proof merged to `main`; production пока не разрешён.

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

## Operations ownership

Операционный контракт не дублируется отдельным runbook-файлом:

- `03_ARCHITECTURE.md` owns production topology, release-directory model, rollback contract and open production identity gaps;
- `05_RELEASE_CHECKLIST.md` owns the executable release/runbook checklist, rollout proof, live smoke and rollback evidence;
- `ops/nginx/*` files own only validated Nginx configuration artifacts.

Until an explicit production command, operations work remains repository-side
planning/validation only and must not require server or secret access.
