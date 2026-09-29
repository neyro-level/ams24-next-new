# EPIC-08.5 — final static SEO/security hardening

Date: 2026-09-30
Branch: `work/epic-08-hardening`
Production: not authorized / not entered

## Result

The site can be statically built and crawled as a guarded first architecture:

- indexable pages are limited to the homepage and product landing pages;
- proof, legal, tariff, calculation, review, article and knowledge placeholders stay `noindex`;
- short product URLs are canonical: `/impuls/`, `/pixel/`, `/zashchita/`;
- legacy long product URLs redirect to short product URLs without loops or chains;
- live lead submit, legal text and analytics provider stay blocked until the external approvals are supplied.

## Public-release blockers intentionally kept

| Area | Blocker | Current handling |
| --- | --- | --- |
| Legal text | OD-03 not approved | legal pages are draft/noindex; LeadForm disabled |
| Lead endpoint | OD-08 endpoint/schema not approved | `/api/leads/test` is only a typed contract; no live submit |
| Analytics provider | account/config not approved | typed event schema exists; provider is `noop` |
| Old-site redirect inventory | complete current `ams24.ru` inventory is not approved | only known shortener redirects are encoded; public release remains blocked |
| Commercial proof | tariffs/cases/reviews still require evidence/permission | proof hubs are guarded/noindex |

## Static artifact checks

`pnpm verify` includes:

- TypeScript strict check;
- ESLint;
- content/architecture tests;
- SourceCraft CI policy guard;
- static Next export guard and self-test;
- `next build`;
- static artifact secret marker scan over `out/`.

This does not authorize production. It only proves that the repository contains a buildable static site architecture ready for review and merge.

