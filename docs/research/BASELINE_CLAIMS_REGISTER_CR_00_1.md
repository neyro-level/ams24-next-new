# Baseline Claims Register — CR-00.1

Task: `CR-00.1`

Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`

Worktree SHA: `514b731814836d38b2f4aba3e46b004f94dacac6`

Code baseline under audit: `bef0a51eecdbad8cd7af9b1d5ba1d609063b1c81`

Approval snapshot SHA-256: `2c663f2fb01a4fa3f5e1c6ea6b25a8b227d1e74c559687fd54b05052018dbb43`

## Scope

This register classifies baseline claims as `PROVEN`, `FALSE / DRIFT` or
`UNKNOWN / BLOCKED`. It does not remediate implementation defects and does not
authorize production.

## Evidence Commands

Executed from the task worktree:

```powershell
git rev-parse HEAD
Get-Content package.json -Raw
Get-Content next.config.ts -Raw
Test-Path src\app\sitemap.ts
Test-Path src\app\robots.ts
Test-Path out\sitemap.xml
Test-Path out\robots.txt
rg -n 'SectionHeader|h1' src docs -S
rg -n 'Claim guard|Proof preview|Data boundary|publicationStatus|/api/leads/test|static Next export|publication guard|unsupported-hidden|EPIC-|OD-' src docs -S
rg -n 'ContentRepository|@/project|src/project|local-adapter|buildSitemapPaths' src tests docs -S
```

## Classification

| Claim | Classification | Evidence |
|---|---|---|
| Static export is configured. | PROVEN | `next.config.ts` has `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`. |
| Runtime stack is pinned. | PROVEN | `package.json` records `pnpm@12.8.1`, `next@16.3.7`, `react@19.3.0`, `typescript@6.0.3`, `zod@4.6.5`. |
| No CMS/database/auth/server runtime belongs to baseline. | PROVEN | `package.json` has no Payload, Prisma, PostgreSQL, auth, Redis or Docker runtime dependency; `docs/03_ARCHITECTURE.md` states static-export baseline. |
| `SectionHeader` supports semantic heading level independent of visual role. | FALSE / DRIFT | `src/ui/shared/section.tsx` renders a fixed `<h2>` and exposes no `as`/heading-level prop. |
| Standalone/contact/legal pages all have one logical H1. | FALSE / DRIFT | `/kontakty/` and legal page templates use `SectionHeader`; with current fixed `<h2>` they do not provide their own logical H1 through that component. |
| `buildSitemapPaths()` exists and is tested. | PROVEN | `src/core/seo/routes.ts` exports `buildSitemapPaths`; tests reference it in `tests/content/seo.test.ts`, `route-skeletons.test.tsx`, `proof-hubs-indexability.test.tsx` and `final-static-hardening.test.tsx`. |
| Static sitemap and robots app routes exist. | FALSE / DRIFT | `Test-Path src\app\sitemap.ts` and `Test-Path src\app\robots.ts` both returned `False`. |
| Exported `out/sitemap.xml` and `out/robots.txt` exist in the current worktree. | FALSE / DRIFT | `Test-Path out\sitemap.xml` and `Test-Path out\robots.txt` both returned `False`. |
| Content repository boundary is fully isolated from local adapter/project content. | FALSE / DRIFT | `src/core/content/repository/local-adapter.ts` still exports `ContentRepository`; `src/core/content/services/repository.ts` imports `localContent` from `@/project/content/local-content`. |
| Routes and reusable UI avoid direct project content imports. | FALSE / DRIFT | `rg` found direct `@/project/*` imports in routes and UI, including `src/app/baza-znaniy/page.tsx`, `src/app/layout.tsx`, `src/ui/shell/site-header.tsx`, `src/ui/forms/lead-form.tsx` and others. |
| Public UI contains internal implementation vocabulary. | PROVEN | `rg` found customer-facing strings such as `Claim guard`, `Proof preview`, `Data boundary`, `publicationStatus`, `unsupported-hidden`, `publication guard`, `EPIC-*` and `OD-*` in `src/app/*`, `src/project/*` and UI files. |
| Disabled lead form uses canonical relative `/api/leads`. | FALSE / DRIFT | `src/project/lead-contract.ts` sets `endpoint: '/api/leads/test'`; `submissionEnabled` is `false`. |
| Live lead submission is enabled. | FALSE / DRIFT | `src/project/lead-contract.ts` sets `submissionEnabled: false` and records approval blockers. |
| Design System completion claims are fully proven by current accessibility/performance/browser evidence. | UNKNOWN / BLOCKED | `docs/06_DESIGN_SYSTEM.md` records foundation-level PASS evidence, while `docs/05_RELEASE_CHECKLIST.md` still has unchecked accessibility, performance, release and live-proof items. |
| Production release is authorized. | FALSE / DRIFT | `docs/05_RELEASE_CHECKLIST.md` states release requires explicit owner command and lists production-only blockers; the approved plan also says production is outside authorization. |
| SourceCraft API is currently usable for PR/gate/merge automation. | PASS | SourceCraft REST credential routing was repaired in global skills at `020e6095767ae2ecd7492d90afadff779efc022c`; `TestAccess` passes for `integrator-p/ams24-next-new` without browser fallback. |

## Result

Baseline claims are now classified for the approved remediation program:

- `PROVEN`: static-export configuration, pinned stack, no CMS/database/auth/server runtime baseline, existing sitemap helper/tests, internal-vocabulary presence, disabled lead submission.
- `FALSE / DRIFT`: semantic heading flexibility, standalone H1 coverage, static sitemap/robots artifacts, content-boundary isolation, canonical lead endpoint and production authorization claims.
- `UNKNOWN / BLOCKED`: full accessibility/performance/browser proof and SourceCraft REST readiness.

This evidence should be consumed by `CR-00.2`, `CR-04.*`, `CR-05.*`, `CR-06.*`,
`CR-08.*`, `CR-09.*`, `CR-13.*` and delivery tasks. It should not be treated as
implementation completion for those tasks.
