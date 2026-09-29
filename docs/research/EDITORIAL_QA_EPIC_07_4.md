# Editorial QA — EPIC-07.4 Initial Knowledge Base Instructions

Status: READY for draft scope
Plan: `AMS24-IMPULSE-2026 v4`
Task: `EPIC-07.4`
Checked: 2026-09-29

Scope: three initial knowledge-base draft instructions generated from `src/project/editorial-briefs.ts` and stored in `src/project/content/local-content.ts`.

Important boundary: this QA does not approve public publication. KB items remain `draft` and `noindex` until route/link/publication checks are complete.

## VERDICT: READY

Главное: every instruction gives a concrete task, ordered steps, expected result and product-specific next action. The texts avoid secrets, passwords, legal guarantees and unsupported technical promises.

## Findings

No P0/P1 findings for draft scope.

## Claims

- «Для расчёта нужны ниша, регион, цель продаж and constraints» — verified as support instruction derived from project CTA and calculation model.
  Источник: `docs/01_PRD.md`, `docs/02_PRODUCT_STRUCTURE.md`.
- «Pixel readiness requires site access, key pages and data-processing checks» — verified as cautious preparation guidance.
  Источник: `src/project/editorial-briefs.ts`, `docs/02_PRODUCT_STRUCTURE.md`.
- «Protection audit starts with symptoms, channels and fact/hypothesis separation» — verified as safe risk-audit guidance.
  Источник: `docs/01_PRD.md`, `docs/02_PRODUCT_STRUCTURE.md`.
- Password transfer, legal approval, exact integration code, pricing and guarantees — remove / not present.
  Источник: missing; intentionally excluded.

## Voice

- Говорящий: АМС.
- Режим: B2B support.
- Расхождение: none for draft scope. Instructions are practical and action-oriented without overclaiming.

## Step/result/next-action check

Each KB item has:

- `## Шаг 1` and subsequent ordered sections;
- explicit `Результат:` after each action;
- `## Следующий шаг`;
- product-specific link:
  - `/impuls/`;
  - `/pixel/`;
  - `/zashchita/`;
- `status: draft`;
- `seo.robots: noindex`.

## Next

1. Use these items in `EPIC-07.5` related-content/orphan checks.
2. Keep them out of sitemap until the final publication decision.
