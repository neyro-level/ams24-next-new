# EPIC-09 — release readiness evidence

Date: 2026-09-30
Branch: `work/epic-09-release-readiness`
Production: not authorized / not entered

## Decision

The repository can produce a verified static artifact, but production rollout remains blocked.

This document records release-readiness evidence without performing deployment, DNS, Nginx changes, uploads, symlink switches, API lead tests or live smoke.

## Exact repository baseline

| Item | Status | Evidence |
| --- | --- | --- |
| Canonical `main` after EPIC-08 | merged | `06202b94b1da805b801e75b551f5d22194740f25` |
| Static build command | available | `corepack pnpm verify` includes `next build` |
| Artifact directory | available after build | `out/` |
| Artifact secret scan | available | `scripts/verify-static-artifact.mjs` |
| Production authorization | not granted | separate owner command required |

## OD-05 production identity preflight

Read-only discovery found these safe names only:

| Area | Read-only finding | Release meaning |
| --- | --- | --- |
| Domain | `https://ams24.ru/` | canonical host for metadata and future smoke |
| Candidate server contour | AMS Main Server route, SSH aliases `ams` / `ams-main` exist locally | owner must confirm this is the target for the new `ams24-next-new` site |
| Secret Master contour | `ams-server/prod` exists and contains deploy-related secret names | values were not read or printed |
| Planned static release path | `/var/www/ams24/releases/<release-id>/` with `current` symlink | documented architecture target; not verified on server in this task |
| Rollback model | switch `current` back to previous verified release | procedure documented; not rehearsed because no production/staging rollout is authorized |
| Artifact store | unresolved | public release blocked until a durable artifact store/path is confirmed |

OD-05 is therefore narrowed to a concrete candidate contour, but not production-ready. The remaining decision is explicit owner confirmation of the target server/path/artifact store before any release command.

## Release blockers intentionally remaining

| Blocker | Why it blocks production | Safe repository state |
| --- | --- | --- |
| No explicit production command | Production is outside approved implementation plan | no deploy action taken |
| AMS Leads API endpoint/schema not approved | live form cannot submit PII safely | forms are disabled and typed |
| Legal text/reviewer not approved | consent/policy cannot be final | legal pages are draft/noindex |
| Analytics account/config not approved | live measurement cannot be validated | analytics adapter is noop |
| Complete redirect inventory not approved | current `ams24.ru` migration could miss URLs | only known redirects are encoded |
| Durable artifact store not confirmed | rollback-ready release cannot be attested | local artifact validation exists |
| Previous release ID not recorded for the new site | rollback target cannot be proven | rollback procedure documented only |

## Pre-production checklist status

| Checklist area | Status before production |
| --- | --- |
| Repository main | ready after EPIC-08 merge |
| Product architecture | ready with guarded placeholders |
| Content/evidence | not public-release-ready; proof pages guarded/noindex |
| Lead forms | not public-release-ready; disabled |
| Legal | not public-release-ready; draft/noindex |
| SEO/static build | repository-ready |
| Artifact scan | repository-ready |
| Performance/browser/live smoke | not performed; needs staging or production-like URL |
| Nginx/security headers | not verified; needs target server config |
| Rollback rehearsal | not performed; needs artifact store and previous release |

## Next production-safe step

When the owner explicitly says “Выпускаем production”, use the production-deploy route to:

1. confirm the exact target server/path/artifact store;
2. build from clean canonical `main`;
3. store the artifact and checksum;
4. deploy atomically to a release directory;
5. run live smoke;
6. record rollback evidence.

