# CR-20.1 — Canonical doc/runtime traceability matrix

Date: 2026-09-30
Task: `ams24r-cr-20-1`
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`
Exact implemented main SHA: `b1027ae635a41648b3a5981b8b574ce5f7a161af`
Mode: documentation reconciliation, no production

## Verdict

`PASS WITH RELEASE BLOCKERS`

The canonical documents now match the exact implemented `main` state for repository/runtime evidence. Production remains blocked only by explicit release-only prerequisites and owner command; this task does not authorize release.

## Traceability matrix

| Canonical document | Claim area | Runtime/source evidence | CR-20.1 state |
|---|---|---|---|
| `docs/README.md` | Source-of-Truth map and current focus | EPIC-18 merge `b0735dfc384572d70e33ea07fc9a8ff291ea923e`; EPIC-19 merge `b1027ae635a41648b3a5981b8b574ce5f7a161af`; Task Manager claim moved to Wave 20 | Updated: focus is Wave 20 closeout; EPIC-18/19 proof is merged; production not authorized. |
| `docs/01_PRD.md` | Product scope, open owner decisions and KPIs | Open TODOs for niches, tariffs, CRM, legal, analytics/CAPTCHA and redirect inventory still match release blockers in `docs/05_RELEASE_CHECKLIST.md` | No change needed: open product/commercial decisions are still true. |
| `docs/02_PRODUCT_STRUCTURE.md` | Canonical routes, index policy, page roles | `src/app/**/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, CR-19 SEO artifact | No change needed: route map remains source of truth; unfinished/legal/support/evidence pages remain noindex/excluded from sitemap as documented. |
| `docs/03_ARCHITECTURE.md` | Static Next.js contract, SEO artifacts, module map, production blockers | `next.config.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `ops/nginx/ams24-site.conf.template`, verification scripts, CR-19 SEO evidence | Updated stale baseline: sitemap/robots now exist and artifact SEO proof is complete; production blockers remain. |
| `docs/04_BACKLOG.md` | Approved remediation graph and dependencies | Task Manager records EPIC-18 and EPIC-19 closed; current task CR-20.1 is in progress | No change needed in this task: backlog is the approved plan source, not live task-state ledger. |
| `docs/05_RELEASE_CHECKLIST.md` | Release/runbook gates | CR-18 browser/a11y/perf evidence; CR-19 SEO/UI/zero-P0/P1 evidence; remaining external blockers | Updated snapshot: remediation proof through EPIC-19 is recorded; production remains blocked by explicit release-only checks. |
| `docs/06_DESIGN_SYSTEM.md` | AMS Northline UI policy and drift status | `docs/research/ACCESSIBILITY_CR_18_2.md`, `docs/research/PERFORMANCE_CR_18_3.md`, `docs/research/UI_DRIFT_AUDIT_CR_19_2.md`, `docs/research/EPIC_19_P0_P1_DISPOSITION_CR_19_3.md` | Updated: accessibility/performance/UI drift proof is complete for current static scope; P2/P3 cleanup remains tracked. |
| `docs/07_SEO_SYSTEM.md` | SEO policy and artifact proof expectations | CR-19 SEO audit confirms sitemap/robots/metadata/canonical/H1/OG/noindex behavior; `src/core/seo/*` implements helpers | No change needed: policy remains valid and is now backed by CR-19 evidence. |
| `ops/nginx/*` | Nginx static/proxy/redirect/security-header artifact ownership | `ops/nginx/ams24-site.conf.template`, `ops/nginx/README.md`, `scripts/verify-nginx-contract.mjs` | README/Release Checklist wording updated from future tense to current repository artifact ownership. |

## Remaining release blockers

These are not documentation drift; they remain true release gates:

- no explicit owner production command;
- final target server/path/artifact store not confirmed for rollout;
- live AMS Leads API endpoint/schema not approved;
- legal text/reviewer not approved;
- analytics provider account/config not approved;
- complete current `ams24.ru` redirect inventory not approved;
- Nginx/security headers, live smoke and rollback rehearsal not performed on production.

## Checks

```text
git rev-parse HEAD
Test-Path src/app/sitemap.ts
Test-Path src/app/robots.ts
Test-Path docs/research/SEO_FINAL_AUDIT_CR_19_1.md
Test-Path docs/research/UI_DRIFT_AUDIT_CR_19_2.md
Test-Path docs/research/EPIC_19_P0_P1_DISPOSITION_CR_19_3.md
rg stale claims across canonical docs
```

## Scope boundary

This reconciliation updates document truthfulness only. It does not change product scope, public claims, URLs, runtime code, server config, release state or production.
