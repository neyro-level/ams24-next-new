# Editorial QA — EPIC-07.3 Initial Articles

Status: READY for draft scope
Plan: `AMS24-IMPULSE-2026 v4`
Task: `EPIC-07.3`
Checked: 2026-09-29

Scope: three initial draft articles generated from `src/project/editorial-briefs.ts` and stored in `src/project/content/local-content.ts`.

Important boundary: this QA does not approve public publication. Articles remain `draft` and `noindex` until product/legal/case evidence gates are complete.

## VERDICT: READY

Главное: the three articles satisfy the approved draft-scope requirement: each has metadata, body, internal product/support links, cautious claim language and no invented case, price, timing or guarantee.

## Findings

No P0/P1 findings for draft scope.

## Claims

- «Продукт работает около 1,5 лет» — not used in article body.
  Источник: `docs/01_PRD.md`; kept out of public body until case/evidence layer.
- «Импульс подходит when niche/region/process are known» — verified as project positioning / implementation guidance.
  Источник: `docs/01_PRD.md`, `docs/02_PRODUCT_STRUCTURE.md`.
- «Пиксель не identifies every visitor» — verified as safe limitation derived from forbidden claims and privacy boundary.
  Источник: `src/project/editorial-briefs.ts`, `docs/01_PRD.md`.
- «Защита does not guarantee absolute protection» — verified as explicit PRD/Product Structure rule.
  Источник: `docs/01_PRD.md`, `docs/02_PRODUCT_STRUCTURE.md`.
- Pricing, launch time, conversion uplift, legal guarantees, named case results — remove / not present.
  Источник: missing; intentionally excluded.

## Voice

- Говорящий: АМС.
- Режим: B2B.
- Расхождение: none for draft scope. Text is direct, practical and cautious; it avoids invented first-person experience.

## Metadata and links

Each article has:

- one target commercial page link:
  - `/impuls/`;
  - `/pixel/`;
  - `/zashchita/`;
- one support/KB next-step link;
- `status: draft`;
- `seo.robots: noindex`;
- canonical path matching its brief output path.

## Next

1. Use these drafts as the starting point for `EPIC-07.5` related-content graph checks.
2. Keep them out of sitemap until final legal/product evidence and publication decision.
