# EPIC-08.1 — Wave-5 kickoff checkpoint

Date: 2026-09-29
Repository: `integrator-p/ams24-next-new`
Branch: `work/epic-08-hardening`
Production: not authorized / not entered

## Decision

Wave 5 starts only after product pages, proof/commercial pages, articles/knowledge base and foundation/preflight are merged into canonical `main`.

This checkpoint records that EPIC-08 work starts from the current SourceCraft `origin/main` after the prerequisite merge sequence.

## Canonical start point

| Item | Status | Evidence |
| --- | --- | --- |
| Current `origin/main` | merged | `e702d67ab98862943b59b9fdb60816ca3ca2a78c` |
| EPIC-01.D foundation/preflight | merged | SourceCraft PR #1, merge `d7fdbd331c7f368a731e22ea56550b4959ca2601` |
| EPIC-05.D product pages | merged | SourceCraft PR #6, merge `aaefc63c9ea59ce2c256b2b2dae8c48e35d71fb8` |
| EPIC-06.D proof/commercial pages | merged | SourceCraft PR #7, gate run #7, merge `e702d67ab98862943b59b9fdb60816ca3ca2a78c` |
| EPIC-07.D articles/knowledge base | merged | SourceCraft PR #5, merge `d6ad7bb44e122639328ae54a9feafe4f7c70f95c` |

## Scope guard

EPIC-08 may implement lead, legal, analytics and SEO hardening as a static-site-safe bounded stream.

Where external facts or approvals are still absent:

- do not invent legal, tariff, review, case or integration facts;
- keep forms, legal copy, analytics providers and public-release assumptions guarded or disabled;
- prefer explicit noindex/blocked-release states over unsupported public claims;
- do not enter production.

## Open external decisions carried into EPIC-08

| Decision | Current safe handling |
| --- | --- |
| OD-03 legal reviewer / approved legal text | Legal pages may exist as placeholders; forms stay guarded if consent text is not approved. |
| OD-08 AMS Leads API safe endpoint/schema | Lead form can be implemented against a typed static-safe contract; live submission stays disabled until endpoint is approved. |
| Analytics provider/account | Event schema may be typed locally; provider adapter stays disabled until account/config is approved. |
| Redirect inventory for current `ams24.ru` | Final SEO crawl may record release blocker instead of inventing redirects. |

