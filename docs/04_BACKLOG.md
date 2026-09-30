# Constitution Remediation Master Plan — ams24-next-new

Plan ID: `AMS24-CONSTITUTION-REMEDIATION-2026`

Version: v3

Status: APPROVED

Phase: `EXECUTION_CLOSEOUT`

Input: owner-supplied `AMS24 CONSTITUTION REMEDIATION MASTER PLAN V2`

Audit baseline: `main@bef0a51eecdbad8cd7af9b1d5ba1d609063b1c81`

Updated: 2026-09-30

This is the single active master-plan Markdown for the remediation program. The previous `AMS24-IMPULSE-2026 v4` remains a completed historical snapshot in Git and in the closed Task Manager graph. It is not rewritten or silently re-imported.

`v3 APPROVED` was approved by the owner on 2026-09-30 with the phrase `План утверждён`. Task Manager import and Developer handoff are authorized for this exact plan snapshot. Production remains unauthorized.

Execution status after EPIC-19: remediation implementation and delivery streams through `CR-19.D` are merged to canonical `main`; Wave 20 owns final documentation reconciliation and closeout. The baseline section below intentionally preserves the original `bef0a51` audit facts for traceability and is not a current-runtime status section.

## 1. Primary Goal

Bring the repository into factual, mechanically verified conformance with AMS Static Site Core 1.1, AMS UI Core 5.0, the project docs-first architecture, one SEO policy, one content boundary, one UI foundation and a reproducible static release contract.

```text
DOCUMENTED -> IMPLEMENTED -> MECHANICALLY VERIFIED -> RELEASE-READY
```

Production deployment is outside this plan.

## 2. Non-goals and Safety Boundaries

- Do not add Payload, PostgreSQL, Prisma, auth, Redis, Docker, workers or server runtime.
- Do not change the static-export project class.
- Do not invent tariffs, cases, reviews, legal claims, metrics or evidence.
- Do not enable live lead submission before AMS Leads API, legal and anti-spam contracts are approved.
- Do not add programmatic SEO routes without current demand evidence and a separate owner decision.
- Do not create a second UI foundation or universal page builder.
- Do not report `PASS`, `DONE` or `COMPLIANT` without matching proof.
- Do not change DNS, production Nginx or production state.
- Keep unresolved external surfaces `draft`, `hidden`, `noindex` or disabled.

## 3. Source of Truth

| Scope | Canonical source |
|---|---|
| Product, audience, business scope, claims | `docs/01_PRD.md` |
| Information architecture, URLs, page roles | `docs/02_PRODUCT_STRUCTURE.md` |
| Runtime, boundaries, security, delivery | `docs/03_ARCHITECTURE.md` |
| Active remediation graph | `docs/04_BACKLOG.md` |
| Release proof, rollout, rollback | `docs/05_RELEASE_CHECKLIST.md` |
| UI policy and AMS Northline | `docs/06_DESIGN_SYSTEM.md` |
| SEO policy/publication contract | `docs/07_SEO_SYSTEM.md` |
| Actual content | validated content repository |
| Research/audit evidence | `docs/research/*`; evidence, not normative truth |

## 4. Verified Baseline Evidence

Checked against exact baseline `bef0a51`:

- clean `main`; local `main`, `origin/main` and `github/main` point to the baseline;
- static export, trailing slash and unoptimized images are configured;
- Node `24.20.0`, pnpm `12.8.1`, Next `16.3.7`, React `19.3.0` and TypeScript `6.0.3` are pinned;
- `SectionHeader` renders a fixed `h2` inside a `div` and is used by more than ten surfaces;
- `/kontakty/` and three legal pages do not render a logical `h1` through `SectionHeader`;
- `buildSitemapPaths()` exists and is tested, but `src/app/sitemap.ts`, `src/app/robots.ts`, `out/sitemap.xml` and `out/robots.txt` do not exist;
- `ContentRepository` is declared inside `local-adapter.ts`; routes/reusable UI directly import several `src/project/*` implementations;
- public UI contains `Claim guard`, `Proof preview`, `Data boundary` and `publicationStatus`;
- the disabled lead form points to `/api/leads/test`, not the canonical `/api/leads` boundary;
- Design System records `PASS` while accessibility, performance and drift exit items remain unchecked;
- Architecture calls the repository implemented although SEO artifact and browser/performance proof are incomplete;
- the previous Task Manager graph is closed: 57/57 closed, 0 open/in-progress/blocked.

Unverified claims remain preflight items; they are not treated as facts merely because the input plan states them.

## 5. Delivery Contract

```text
implementation
-> relevant local proof
-> commit and push
-> Pull Request
-> full diff review
-> one risk-classified exact-head SourceCraft gate
-> authorized merge to canonical main
-> next dependent stream
```

- Owner decision OD-R01 fixes `MERGE_AFTER_GATE` for each independent remediation epic because dependent work needs merged contracts.
- No automatic paid CI on push or PR; production needs a separate explicit command.
- One stream = one branch/worktree = one PR.

## 6. Preliminary Master Plan Map

### Outcomes

1. Docs report real repository state.
2. Product, route, SEO and technical contracts have non-overlapping ownership.
3. Accessibility, content and UI boundaries are enforced.
4. SEO routes/metadata exist in the exported artifact.
5. Public copy contains only customer-facing, evidenced language.
6. Leads/legal/analytics stay safe while external approvals are open.
7. Daily and release verification prove different promises.
8. SourceCraft, static guards and operations are reproducible.
9. Browser, accessibility, SEO and performance proof close P0/P1.
10. Final docs are reconciled after implementation evidence.

### Assembly waves

```text
Wave 0 contracts/baseline:  EPIC-00, 01, 02, 03, 04
Wave 1 foundations:         EPIC-05 || 06 || 09 || 11 || 14
Wave 2 boundary consumers:  EPIC-07 || 10 || 12 || 13
Wave 3 artifact/delivery:   EPIC-08 || 15 || 16 || 17
Wave 4 integrated proof:    EPIC-18 -> EPIC-19
Wave 5 factual closeout:    EPIC-20
```

These waves are backed by the v1 task-level dependency matrix below. Final audit must still independently check cycles, minimum blocking scope and autonomy.

## 7. Candidate Epic Register

All supplied epics are accepted as candidate scope. Exact task contracts, dependencies, shared-file owners, rollback, stop conditions and terminal delivery tasks remain assembly work.

### EPIC-00 — Documentation Canon Repair

Outcome: docs describe the baseline without false completion claims. Reconcile docs map, Architecture, Design System and Release Checklist; distinguish tests from generated-artifact proof. Do not write future implementation as achieved state.

Acceptance: no unchecked criterion is represented as passed; the plan remains `DRAFT`/`REVIEW` until the Architect gate.

### EPIC-01 — PRD and Commercial Page Contract

Outcome: PRD remains business truth. Define `WHO`, `AUDIENCE`, `PROBLEM`, `OFFER`, `DIFFERENCE`, `VALUE`, `MECHANISM`, `PROOF`, `LIMITS`, `OBJECTION`, `NEXT ACTION`, CTA, proof dependency, lead context and event owner for primary commercial routes. SEO goals stay `REQUIRES_MEASUREMENT` / `OWNER_DECISION` until measured.

### EPIC-02 — Information Architecture Hardening

Outcome: Product Structure becomes the canonical route/page-role model. Extend Page Role Map; define route classes; prohibit new indexable routes without distinct demand, intent, role, content, evidence and cannibalization proof; defer niche pages until owner/evidence gates close.

### EPIC-03 — Canonical SEO System

Outcome: one SEO policy controls intent ownership, keyword revalidation, indexability, metadata/OG, one-H1 hierarchy, canonical URLs, robots/staging, sitemap, internal links, cannibalization, article-vs-KB roles, structured data, media, redirects and release crawl proof. Create `07_SEO_SYSTEM.md` only after OD-R02.

### EPIC-04 — Technical Architecture Reconciliation

Outcome: Architecture matches code. Freeze boundaries for `app`, `core/content`, `core/seo`, `core/leads`, `core/analytics`, `project`, `ui`; assign one owner for metadata, robots, sitemap, redirects, structured data, navigation, repository, lead transport and analytics.

### EPIC-05 — Accessibility Foundation Fix

Outcome: headings and dark/light sections are semantic and legible. Make `SectionHeader` heading level independent from visual typography, preserve tone/`className`/`cn()`, fix dark sections, add one logical H1 to contacts/legal/standalone pages, and test H1 count/hierarchy/tone.

### EPIC-06 — Restore Content Boundary

Outcome: enforce `Page -> Content Service -> Repository -> Local Adapter -> Project Content`. Move `ContentRepository` out of Local Adapter, validate navigation/site settings, replace route/UI imports of raw project modules with service DTO/ViewModels, and add an import guard.

### EPIC-07 — Content Graph Validation

Outcome: one `validateContentGraph()` rejects inconsistent content. Cover global IDs, locale/path uniqueness, canonical equality, slugs, entity refs, navigation, Markdown links, media, redirects, blocks, publication state, SEO completeness and contradictory index policy. Every guard gets a negative fixture.

### EPIC-08 — SEO Implementation

Outcome: SEO exists in the static artifact. Implement repository-driven `sitemap.ts`/`robots.ts`, one metadata service with full OG, repository-owned dynamic metadata, artifact checks and only approved safely serialized structured data.

### EPIC-09 — Evidence and Public Commercial Truth

Outcome: indexable UI contains no unsupported claim or internal vocabulary. Enforce evidence+permission+no-blocker+publishable, revalidate “cases in three niches”, remove `EPIC-*`, `OD-*`, `publicationStatus`, `Proof preview`, `Claim guard`, `Data boundary`, `unsupported-hidden`, `/api/leads/test`, `static Next export`, `foundation` and `publication guard` from customer copy; add regression tests.

### EPIC-10 — UI Composition Remediation

Outcome: page entrypoints are composition-only and semantic sections have explicit ownership. Normalize page/domain/shared/primitive ownership only where evidence supports it; decompose primary routes by semantic section; prohibit premature shared components and a universal builder.

### EPIC-11 — Canonical UI Primitives

Outcome: one project-owned primitive set. Remove competing CTA visuals, audit Button/Input/Textarea/Checkbox/Card/Dialog/Table, verify aliases, raw colors, arbitrary system values, dead tokens and dark variants; preserve necessary internal shadcn dark variants.

### EPIC-12 — Blocks and Rich Text

Outcome: `blockType -> Zod schema -> DTO -> component`; unknown blocks hard-fail; one RichText DTO/renderer; no speculative blocks or Lexical without a real approved Payload migration.

### EPIC-13 — Leads, Legal and Analytics

Outcome: disabled-safe frontend ready for later approval. Use relative `POST /api/leads`; keep `submissionEnabled=false`; define fields/context/consent/idempotency and UI states; keep authoritative validation/rate limit/CAPTCHA secret/persistence/integrations in AMS Leads API; never send PII to analytics.

### EPIC-14 — Static Architecture Guards

Outcome: static/boundary violations fail fast. Cover middleware/proxy, Server Actions, dynamic APIs, route handlers, dynamic params, ISR/revalidate, runtime opt-ins, runtime redirects/rewrites/headers, raw content imports, frontend CRM integrations, suspicious public secrets and image configuration. Each guard needs a seeded invalid self-test.

### EPIC-15 — Verification Model

Outcome: fast daily proof and complete release proof.

```text
pnpm verify
  typecheck + lint + fast tests + content graph + architecture guards

pnpm verify:release
  pnpm verify + next build + artifact/SEO validation + critical E2E
```

### EPIC-16 — SourceCraft Reproducibility

Outcome: manual exact-head gates use pinned Node `24.20.0`, pnpm `12.8.1`, frozen lockfile and runtime assertions; no floating runtime image, automatic paid CI or unbound SHA evidence.

### EPIC-17 — Operations and Nginx Contract

Outcome: repository-side contract covers static `out/`, release directories, `current` symlink, trailing slash, 404, `/api/leads` proxy, headers/CSP, immutable assets, HTML cache, staging protection, X-Robots-Tag, reload/cache and rollback without inventing credentials. Add `ops/nginx/` only when executable config is justified; avoid duplicating Architecture/Release Checklist in premature extra docs.

### EPIC-18 — Browser, Accessibility and Performance Proof

Outcome: production-like browser proof covers home/product/article/KB/case/navigation/mobile/404/trailing slash/lead form; accessibility covers semantics, headings, keyboard, focus, labels, errors, contrast, alt, touch, reduced motion; mobile LCP `<=2.5s` and CLS `<=0.1` or an approved evidence-backed exception.

### EPIC-19 — Final SEO and UI Drift Audit

Outcome: no unresolved P0/P1 SEO/UI drift. Mechanically inspect route/index policy, metadata, canonical, OG, H1, schema, sitemap, robots, redirects, links, orphans, cannibalization, thin routes, colors, arbitrary values, primitives, sections, composition, client/data boundaries, responsive, accessibility, motion, tokens and exceptions.

### EPIC-20 — Final Documentation Reconciliation

Outcome: canonical docs describe only implementation/proof that actually exist. Reconcile README, PRD, Product Structure, Architecture, Backlog, Release Checklist, Design System and approved SEO extension after integrated proof.

## 8. External Prerequisites

| ID | Prerequisite | Safe fallback | Stop condition |
|---|---|---|---|
| EXT-01 | Legal reviewer/texts/claims | legal routes noindex; forms disabled | no public lead release |
| EXT-02 | Live AMS Leads API test contract | submission disabled | no live submission |
| EXT-03 | Analytics config/event scope | provider disabled | no measurement claim |
| EXT-04 | CAPTCHA/anti-spam decision | disabled submission | no live public form |
| EXT-05 | Full legacy redirect inventory | no invented mass redirects | no production migration |
| EXT-06 | Production identity/artifact store | repository/staging proof only | no production release |

These prerequisites must not block independent repository remediation.

## 9. Initial Finding Register

| ID | Severity | Finding | Triage / change |
|---|---|---|---|
| F-001 | BLOCKER | Input mixes `V2`, proposed `V5` and no valid lifecycle status. | Canonicalized as `v0 DRAFT`; increment only after a completed assembly round. |
| F-002 | BLOCKER | `APPROVED_FOR_IMPLEMENTATION` bypasses owner approval. | Use `DRAFT -> REVIEW -> READY_FOR_OWNER_APPROVAL -> APPROVED`. |
| F-003 | MAJOR | Input puts PR after review/gate. | Corrected to commit/push -> PR -> review -> exact-head gate -> authorized merge. |
| F-004 | BLOCKER | 21 epics form one serial chain without task-level dependencies/bypass. | Build matrix and parallel-safe waves before readiness. |
| F-005 | MAJOR | Several P0/P1 claims lacked exact evidence. | Core findings verified; remaining claims require task preflight. |
| F-006 | MAJOR | Mandatory extra docs may duplicate canon. | Create extensions only when independent complexity warrants them. |
| F-007 | BLOCKER | Closed v4 graph cannot be overwritten with a new Plan ID/node set. | Choose explicit new-graph/migration route after approval. |
| F-008 | MAJOR | EPIC-00 and EPIC-20 can write contradictory future/past states. | EPIC-00 records baseline/target separately; EPIC-20 records achieved state. |
| F-009 | MAJOR | Epic contracts lacked exact entry/exit/dependencies/rollback/stops/delivery tasks. | RESOLVED in v1 assembly; final audit pending. |
| F-010 | MAJOR | `P0=0/P1=0` lacked one severity/exception policy. | RESOLVED by OD-R04 and v1 severity contract. |
| F-011 | BLOCKER | v1 task IDs collided with 33 closed v4 node IDs. | RESOLVED in v2 with collision-safe `CR-*` task IDs and `CR-EPIC-*` inventory keys. |
| F-012 | BLOCKER | Five cross-epic edges depended on unmerged intermediate tasks. | RESOLVED in v2: cross-epic edges target merged `.D` boundaries only. |
| F-013 | BLOCKER | Delivery tasks did not directly depend on every implementation child. | RESOLVED in v2: all 21 `.D` tasks have complete direct child coverage. |
| F-014 | MAJOR | v2 exposed only one initial ready task, creating an avoidable documentation bottleneck. | RESOLVED in v3: PRD, IA and primitive inventory start independently on the same frozen baseline and disjoint owned files. |

## 10. Owner Decision Register

### OD-R01 — Delivery mode

Decision: `MERGE_AFTER_GATE` for each independent remediation epic; production remains separate. Accepted by owner: 2026-09-30. Status: `DECIDED`.

### OD-R02 — Separate SEO Source of Truth

Decision: create `docs/07_SEO_SYSTEM.md`; the domain is independently complex enough to warrant an extension. Accepted by owner: 2026-09-30. Status: `DECIDED`.

### OD-R03 — Task Manager graph strategy

Decision: create an explicitly validated new managed graph for this distinct Plan ID after approval, preserving closed v4 history. Accepted by owner: 2026-09-30. Status: `DECIDED`.

### OD-R04 — Severity and exception policy

Decision: only owner may accept an evidence-backed P1 exception; P0 cannot be waived. Accepted by owner: 2026-09-30. Status: `DECIDED`.

## 11. Epic Contracts

All epics use `MERGE_AFTER_GATE`. Gate risk is provisional and must be confirmed from the exact diff before merge. A failed check returns the epic to implementation; it never authorizes partial merge or production.

| Epic | Entry condition | Exit condition | Parallel-safe with | Recovery / stop condition |
|---|---|---|---|---|
| EPIC-00 | v0 baseline and exact SHA recorded | truthful docs baseline merged | none at start | revert docs PR; stop on conflicting Source of Truth |
| EPIC-01 | exact audit baseline recorded | commercial route contract merged | EPIC-00, EPIC-02, EPIC-11 | revert PR; stop rather than invent business facts |
| EPIC-02 | exact audit baseline recorded | route classes and expansion policy merged | EPIC-00, EPIC-01, EPIC-11 | revert PR; stop on disputed canonical URL/role |
| EPIC-03 | CR-01.D, CR-02.D, OD-R02 | canonical SEO policy merged | CR-04.1 after contract freeze | revert SEO doc; stop on duplicate route ownership |
| EPIC-04 | CR-00.D; SEO ownership after CR-03.1 | architecture ownership/direction merged | EPIC-03 after CR-04.1 | revert docs PR; stop on platform-class change |
| EPIC-05 | CR-04.D | heading/tone fixes and regressions merged | EPIC-06, 11, 14 | revert UI PR; stop on design-system conflict |
| EPIC-06 | CR-04.D | content boundary and import guard merged | EPIC-05, 11 | revert refactor PR; stop on circular ownership or behavior drift |
| EPIC-07 | CR-03.D, CR-06.D | graph validation wired into daily verification | EPIC-09 after service contract | revert validator; stop on false rejection of valid canonical content |
| EPIC-08 | CR-03.D, 06.D, 07.D | SEO surfaces proven in static artifact | none on owned SEO/app files | revert SEO PR; stop on index leakage or artifact mismatch |
| EPIC-09 | CR-01.D, 04.D, 06.2 | evidence gate and public-copy cleanup merged | EPIC-07 | revert copy/gate PR; hide disputed content |
| EPIC-10 | CR-05.D, 06.D, 09.D, 11.D | route entrypoints are composition-only | EPIC-12 on disjoint files | revert page refactor; stop on content/SEO behavior drift |
| EPIC-11 | exact audit baseline recorded | one primitive/token foundation merged | EPIC-00, 01, 02 | revert primitives PR; stop on accessibility regression |
| EPIC-12 | CR-06.D, CR-07.1 | typed blocks/RichText merged | EPIC-10 on disjoint files | revert content-rendering PR; stop on unknown live block |
| EPIC-13 | CR-01.D, CR-04.D | disabled-safe lead/legal/analytics contract merged | EPIC-07, 11, 14 | disable integration/revert PR; stop on PII leak or missing consent |
| EPIC-14 | CR-04.D; boundary guard after CR-06.D | guards and seeded self-tests merged | EPIC-05, 11, 13 | revert guard PR; stop on material false positive |
| EPIC-15 | CR-07.D, 08.D, 14.D | daily/release verification split merged | none on scripts/package files | revert tooling PR; stop if release proof can bypass artifact build |
| EPIC-16 | CR-15.D | pinned manual exact-head workflow merged | none on SourceCraft files | revert CI PR; stop on automatic paid trigger or unbound SHA |
| EPIC-17 | CR-04.D, 13.D, 16.D | repository-side Nginx/rollback contract validates | none on ops files | discard config/revert PR; stop on unknown production identity |
| EPIC-18 | CR-05.D, 08.D, 09.D, 10.D, 11.D, 12.D, 13.D, 15.D, 17.D | browser/a11y/performance evidence complete | none | fix affected epic; stop on unavailable representative runtime surface |
| EPIC-19 | CR-18.D | SEO/UI audit has P0=0 and P1=0 or owner-approved P1 exception | SEO/UI passes may run independently | reopen owning epic; P0 cannot be waived |
| EPIC-20 | CR-19.D | docs and closeout evidence match exact main | none | revert docs PR; stop on any unsupported completion claim |

## 12. Stable Task Inventory

### Wave 0 — contracts and truthful baseline

| ID | Observable outcome | Depends on | Verification / evidence |
|---|---|---|---|
| CR-00.1 | baseline claims are classified as proven, unknown or false | none | exact-SHA evidence register and docs diff |
| CR-00.2 | docs map, Architecture, Design System and Release Checklist report current state | CR-00.1 | cross-reference scan; no false PASS/DONE |
| CR-00.D | EPIC-00 PR reviewed, STANDARD-gated and merged | CR-00.1, CR-00.2 | PR source/target/head, review, green exact-head gate, merge SHA |
| CR-01.1 | primary commercial routes have complete business contracts | none | requirements matrix across named routes |
| CR-01.2 | conversion ownership and measurable SEO goal placeholders are explicit | CR-01.1 | PRD cross-check; no invented KPI |
| CR-01.D | EPIC-01 PR reviewed, STANDARD-gated and merged | CR-01.1, CR-01.2 | review/gate/merge evidence |
| CR-02.1 | route classes and expanded Page Role Map are canonical | none | route inventory coverage and unique owner check |
| CR-02.2 | expansion, niche and cannibalization gates are deterministic | CR-02.1, CR-01.D | decision examples and forbidden-overlap review |
| CR-02.D | EPIC-02 PR reviewed, STANDARD-gated and merged | CR-02.1, CR-02.2 | review/gate/merge evidence |
| CR-03.1 | `07_SEO_SYSTEM.md` defines source priority and intent ownership | CR-01.D, CR-02.D | duplicate-policy scan and cluster contract review |
| CR-03.2 | indexability, metadata, H1, canonical, robots and sitemap contracts are deterministic | CR-03.1 | policy decision table with index/noindex examples |
| CR-03.3 | linking, schema, media, redirects and release proof are deterministic | CR-03.1 | eligibility/redirect/proof matrices |
| CR-03.D | EPIC-03 PR reviewed, STANDARD-gated and merged | CR-03.1, CR-03.2, CR-03.3 | review/gate/merge evidence |
| CR-04.1 | actual module/import ownership baseline is documented | CR-00.D | source inventory plus targeted dependency evidence |
| CR-04.2 | allowed dependency direction and single owners are frozen | CR-04.1, CR-03.D | ownership matrix; no competing owner |
| CR-04.D | EPIC-04 PR reviewed, STANDARD-gated and merged | CR-04.1, CR-04.2 | review/gate/merge evidence |

### Wave 1 — independent foundations

| ID | Observable outcome | Depends on | Verification / evidence |
|---|---|---|---|
| CR-05.1 | `SectionHeader` supports semantic heading level independent of visual role | CR-04.D | focused component tests and typecheck |
| CR-05.2 | standalone/legal/contact routes have one H1 and correct dark/light tone | CR-05.1 | rendered route matrix; H1/tone assertions |
| CR-05.3 | heading hierarchy and tone regressions fail tests | CR-05.2 | negative/representative fixtures |
| CR-05.D | EPIC-05 PR reviewed, STANDARD-gated and merged | CR-05.1, CR-05.2, CR-05.3 | review/gate/merge evidence |
| CR-06.1 | repository contract is independent from Local Adapter | CR-04.D | typecheck, unit tests, dependency inspection |
| CR-06.2 | services expose validated settings/navigation/content ViewModels | CR-06.1 | service tests with invalid fixtures |
| CR-06.3 | routes/UI no longer import forbidden project implementations | CR-06.2 | import guard plus targeted route tests |
| CR-06.D | EPIC-06 PR reviewed, RISKY-gated and merged | CR-06.1, CR-06.2, CR-06.3 | full diff review, boundary proof, exact-head gate, merge SHA |
| CR-09.1 | one publication/evidence gate controls public proof/claims | CR-01.D, CR-04.D, CR-06.D | allowed/denied fixtures and evidence matrix |
| CR-09.2 | public routes contain no internal implementation vocabulary | CR-09.1, CR-05.D | rendered-copy scan and route tests |
| CR-09.3 | unsupported content cannot enter indexable UI | CR-09.2 | negative regression fixtures |
| CR-09.D | EPIC-09 PR reviewed, STANDARD-gated and merged | CR-09.1, CR-09.2, CR-09.3 | review/gate/merge evidence |
| CR-11.1 | primitive/token duplication inventory is complete | none | code/token inventory with reuse decisions |
| CR-11.2 | CTA/form visuals use canonical primitives without semantic link loss | CR-11.1 | component/render/accessibility tests |
| CR-11.3 | raw color, arbitrary value, dead token and dark-variant drift is classified/fixed | CR-11.1 | mechanical scan plus exception list |
| CR-11.D | EPIC-11 PR reviewed, STANDARD-gated and merged | CR-11.1, CR-11.2, CR-11.3 | review/gate/merge evidence |
| CR-14.1 | static-runtime violations are covered by guards | CR-04.D | seeded invalid fixtures per static rule |
| CR-14.2 | boundary, CRM and public-secret violations are covered | CR-06.D | seeded invalid fixtures per boundary/security rule |
| CR-14.3 | guard self-test proves every rule fails its fixture and passes repository | CR-14.1, CR-14.2 | self-test transcript |
| CR-14.D | EPIC-14 PR reviewed, RISKY-gated and merged | CR-14.1, CR-14.2, CR-14.3 | tooling review/gate/merge evidence |

### Wave 2 — boundary consumers

| ID | Observable outcome | Depends on | Verification / evidence |
|---|---|---|---|
| CR-07.1 | one content-graph validator contract owns cross-entity validation | CR-03.D, CR-06.D | validator API and ownership tests |
| CR-07.2 | every declared invariant has a negative fixture | CR-07.1 | parameterized negative-test matrix |
| CR-07.3 | daily verification invokes graph validation exactly once | CR-07.2 | command trace and failure propagation test |
| CR-07.D | EPIC-07 PR reviewed, STANDARD-gated and merged | CR-07.1, CR-07.2, CR-07.3 | review/gate/merge evidence |
| CR-10.1 | page/section ownership map avoids shared-file conflicts | CR-05.D, CR-06.D, CR-09.D, CR-11.D | route-to-component matrix |
| CR-10.2 | primary route entrypoints are composition-only | CR-10.1 | dependency/readability review and route tests |
| CR-10.3 | shared components exist only for proven reuse | CR-10.2 | reuse inventory; no universal builder |
| CR-10.D | EPIC-10 PR reviewed, STANDARD-gated and merged | CR-10.1, CR-10.2, CR-10.3 | review/gate/merge evidence |
| CR-12.1 | block/RichText inventory identifies reachable and speculative formats | CR-06.D, CR-07.D | reachability inventory |
| CR-12.2 | supported blocks follow schema-to-component registry and unknown blocks fail | CR-12.1 | registry tests and unknown-block negative fixture |
| CR-12.3 | one RichText DTO/renderer serves real consumers | CR-12.1 | render tests and duplicate-contract scan |
| CR-12.D | EPIC-12 PR reviewed, STANDARD-gated and merged | CR-12.1, CR-12.2, CR-12.3 | review/gate/merge evidence |
| CR-13.1 | lead request, consent, idempotency and analytics boundaries are canonical | CR-01.D, CR-04.D | contract tests including denied/invalid inputs |
| CR-13.2 | frontend uses disabled-safe relative `/api/leads` and complete UI states | CR-13.1 | rendered/network tests; zero request while disabled |
| CR-13.3 | analytics contract rejects PII/raw form values | CR-13.1 | allowed/denied event fixtures |
| CR-13.D | EPIC-13 PR reviewed, RISKY-gated and merged | CR-13.1, CR-13.2, CR-13.3 | PII/security review, exact-head gate, merge SHA |

### Wave 3 — artifact and delivery system

| ID | Observable outcome | Depends on | Verification / evidence |
|---|---|---|---|
| CR-08.1 | exported sitemap and robots are repository-driven | CR-03.D, CR-06.D, CR-07.D | build fixture and artifact assertions |
| CR-08.2 | static/dynamic routes use one metadata service with full OG | CR-08.1 | metadata uniqueness/canonical/OG matrix |
| CR-08.3 | only approved factual structured data is safely serialized | CR-03.D, CR-07.D | schema eligibility and escaping tests |
| CR-08.4 | artifact validator proves SEO files/content and index exclusions | CR-08.1, CR-08.2, CR-08.3 | exact `out/` inspection |
| CR-08.D | EPIC-08 PR reviewed, STANDARD-gated and merged | CR-08.1, CR-08.2, CR-08.3, CR-08.4 | review/gate/merge evidence |
| CR-15.1 | `pnpm verify` is fast and covers types/lint/tests/content/guards | CR-07.D, CR-14.D | command composition and fail propagation |
| CR-15.2 | `pnpm verify:release` builds once and validates artifact/SEO/E2E | CR-08.D, CR-15.1 | clean release command transcript |
| CR-15.3 | daily/release separation cannot silently omit required proof | CR-15.2 | seeded failure matrix and package-script review |
| CR-15.D | EPIC-15 PR reviewed, RISKY-gated and merged | CR-15.1, CR-15.2, CR-15.3 | tooling review/gate/merge evidence |
| CR-16.1 | runtime and package-manager versions fail closed on drift | CR-15.D | wrong-version negative fixture |
| CR-16.2 | SourceCraft workflow is manual-only, frozen-install and exact-head | CR-16.1 | workflow static verifier and trigger scan |
| CR-16.3 | paid-run duplication and floating image regressions fail checks | CR-16.2 | CI policy self-tests |
| CR-16.D | EPIC-16 PR reviewed, RISKY-gated and merged | CR-16.1, CR-16.2, CR-16.3 | CI-policy review/gate/merge evidence |
| CR-17.1 | minimal operations/runbook ownership is fixed without duplicate docs | CR-04.D, CR-13.D, CR-16.D | docs ownership/cross-reference review |
| CR-17.2 | project-owned Nginx config covers static/proxy/staging/security/rollback | CR-17.1 | syntax/config tests without production access |
| CR-17.3 | atomic rollout and rollback proof is deterministic | CR-17.2 | local/staging-safe validation; no production mutation |
| CR-17.D | EPIC-17 PR reviewed, RISKY-gated and merged | CR-17.1, CR-17.2, CR-17.3 | ops review/gate/merge evidence |

### Waves 4–5 — integrated proof and factual closeout

| ID | Observable outcome | Depends on | Verification / evidence |
|---|---|---|---|
| CR-18.1 | browser E2E covers representative route/navigation/404/lead surfaces | CR-08.D, CR-10.D, CR-12.D, CR-13.D, CR-15.D, CR-17.D | production-like browser report |
| CR-18.2 | accessibility proof covers semantics, keyboard, focus, labels, errors, contrast, alt, touch and motion | CR-05.D, CR-11.D, CR-18.1 | automated scan plus keyboard/manual matrix |
| CR-18.3 | mobile LCP/CLS are measured against approved thresholds | CR-18.1 | reproducible performance report or owner-approved P1 exception |
| CR-18.D | EPIC-18 evidence PR reviewed, STANDARD-gated and merged | CR-18.1, CR-18.2, CR-18.3 | review/gate/merge evidence |
| CR-19.1 | final SEO audit covers all declared mechanical surfaces | CR-18.D | finding register and crawl artifacts |
| CR-19.2 | final UI drift audit covers all declared design/architecture surfaces | CR-18.D | finding register and visual/code evidence |
| CR-19.3 | all P0/P1 findings are resolved or validly dispositioned | CR-19.1, CR-19.2 | zero-P0 ledger; zero-P1 or owner exception ledger |
| CR-19.D | EPIC-19 audit/closure PR reviewed, STANDARD-gated and merged | CR-19.1, CR-19.2, CR-19.3 | review/gate/merge evidence |
| CR-20.1 | every canonical document matches exact implemented main | CR-19.D | cross-doc/runtime traceability matrix |
| CR-20.2 | closeout report records exact SHA, proof and external blockers | CR-20.1 | required report completeness check |
| CR-20.D | EPIC-20 PR reviewed, STANDARD-gated and merged | CR-20.1, CR-20.2 | review/gate/merge evidence; no production |

## 13. Dependency Matrix

Only minimum blocking scope is encoded. Edges not listed are `SOFT` ordering hints and must not block the ready queue.

| Dependent scope | Prerequisite | Type | Why / blocking scope | Fallback or softening |
|---|---|---|---|---|
| CR-03.1 | CR-01.D, CR-02.D | CONTRACT | SEO policy needs frozen business/route roles | later SEO implementation remains blocked, not unrelated foundations |
| CR-04.2 | CR-03.1 | CONTRACT | technical SEO ownership needs policy owner | CR-04.1 can run earlier |
| CR-05.* | CR-04.D | CONTRACT | UI fix follows frozen ownership | no need to wait for SEO implementation |
| CR-06.* | CR-04.D | HARD | refactor needs allowed dependency direction | none |
| CR-09.1 | CR-06.2 | CONTRACT | publication gate consumes service/ViewModel boundary | other evidence inventory may prepare earlier |
| CR-14.2 | CR-06.D | CONTRACT | boundary guard must target final allowed imports | CR-14.1 static guards run earlier |
| CR-07.* | CR-03.D, CR-06.D | HARD | validator needs SEO/content contracts and repository boundary | none |
| CR-10.* | CR-05.D, 06.D, 09.D, 11.D | HARD | same pages/components would otherwise conflict | task owns page composition only after foundations merge |
| CR-12.1 | CR-07.1 | CONTRACT | block validation plugs into graph contract | inventory can start after CR-06.D |
| EPIC-13 live enablement | EXT-01..04 | EXTERNAL/OWNER | PII/legal/anti-spam cannot be assumed | keep relative endpoint disabled; repository work continues |
| CR-08.* | CR-03.D, 06.D, 07.D | HARD | artifact SEO must consume final contracts/validator | none |
| CR-15.2 | CR-08.D | CONTRACT | release command validates actual SEO artifact | daily verification CR-15.1 runs earlier |
| CR-16.* | CR-15.D | HARD | gate must call frozen release command | none |
| CR-17.* | CR-13.D, CR-16.D | CONTRACT | Nginx/runbook needs lead boundary and delivery toolchain | production identity remains external |
| CR-18.1 | listed implementation deliveries | HARD | integrated proof must exercise merged surfaces | individual epic proof remains useful earlier |
| EPIC-18 production lead smoke | EXT-01..04 | EXTERNAL | live PII flow needs external approvals | test disabled/error path; mark live proof blocked |
| CR-19.* | CR-18.D | HARD | final audit needs integrated evidence | SEO/UI audit passes run in parallel |
| CR-20.* | CR-19.D | HARD | final docs may record only achieved state | none |
| production release | EXT-01..06 and explicit owner command | PRODUCTION | outside implementation authority | no production action in this graph |

Cycle check for the v1 designed graph: `0` by construction; final audit must independently verify inventory edges.

## 14. Shared Ownership and Conflict Control

| Surface | Primary owner | Freeze/unlock point | Parallel rule |
|---|---|---|---|
| `docs/01_PRD.md` | EPIC-01 | CR-01.D | later edits only EPIC-20 or explicit source correction |
| `docs/02_PRODUCT_STRUCTURE.md` | EPIC-02 | CR-02.D | EPIC-03 references, does not duplicate |
| `docs/07_SEO_SYSTEM.md` | EPIC-03 | CR-03.D | implementation epics consume policy read-only |
| `docs/03_ARCHITECTURE.md` | EPIC-04 | CR-04.D | EPIC-17 adds only approved operations facts or defers to EPIC-20 |
| `docs/06_DESIGN_SYSTEM.md` | EPIC-00 truth status, then EPIC-11 policy corrections | CR-11.D | EPIC-05 implements existing semantic contract |
| `src/ui/shared/section.tsx` | EPIC-05 | CR-05.D | EPIC-10 consumes after merge |
| content repository/services | EPIC-06 | CR-06.D | EPIC-07/08/09/12 consume frozen interfaces |
| public route copy | EPIC-09 | CR-09.D | EPIC-10 composes afterward; does not reintroduce internal text |
| page/section composition | EPIC-10 | CR-10.D | EPIC-13 owns form behavior, not route layout |
| primitives/tokens | EPIC-11 | CR-11.D | page epics consume; no second primitive owner |
| block registry/RichText | EPIC-12 | CR-12.D | EPIC-10 avoids these files |
| lead form/contracts/analytics | EPIC-13 | CR-13.D | EPIC-10 treats form as component boundary |
| static guard script | EPIC-14 | CR-14.D | EPIC-15 invokes, does not redefine rules |
| package verification scripts | EPIC-15 | CR-15.D | EPIC-16 workflow invokes frozen command |
| `.sourcecraft/ci.yaml` | EPIC-16 | CR-16.D | no other epic changes CI |
| `ops/nginx/*` and operations section | EPIC-17 | CR-17.D | production identity remains external/read-only |

## 15. Verification and Severity Contract

Promise/evidence tiers:

- `domain-model`: unit/property tests plus typecheck/static checks;
- `wired`: domain-model proof plus a real route, build command, validator or workflow consumer;
- `live`: browser/artifact/runtime surface proof;
- `external-blocked`: deterministic safe fallback proven, live proof explicitly not claimed.

Severity:

- `P0`: security/PII exposure, invalid static architecture, index leakage, inaccessible critical path, corrupted content ownership or release/rollback hazard. No waiver.
- `P1`: material commercial, SEO, accessibility, UI-system or reproducibility failure. Must be fixed; only owner may accept an evidence-backed exception with containment and follow-up.
- `P2`: bounded quality/debt issue that does not invalidate epic outcome; record follow-up and owner.

Each task ledger must include changed files, checks, artifact/browser evidence where required, exact commit/push SHA, deviations and discovered work. A test that only proves a helper exists cannot satisfy a `wired` or `live` promise.

## 16. Task Manager Graph Strategy

- Plan ID remains `AMS24-CONSTITUTION-REMEDIATION-2026`; inventory uses collision-safe epic keys `CR-EPIC-00`…`CR-EPIC-20`, task IDs `CR-*` and prefix `ams24r`.
- Closed `AMS24-IMPULSE-2026 v4` nodes remain immutable historical records.
- Approval handoff must validate the new inventory without mutating the store, then prove whether the supported helper can reconcile a second managed Plan ID in the existing store.
- If helper validation reports old-graph collision or unsupported topology, stop. Do not delete/reinitialize `.beads`; prepare an explicit migration/rebuild operation that preserves closed evidence.
- Import is allowed only after exact plan status is `APPROVED`, source SHA is frozen, coverage is complete, cycles are zero and every epic has one `.D` delivery task.
- No production node belongs to the managed implementation graph.

## 17. Final Audit Scorecard

Final audit target: exact v3 execution design after findings F-011–F-014 were resolved.

### Pass 1 — Logic / Completeness: PASS

- primary goal, non-goals and ten outcomes map to 21 epics;
- every epic has observable outcome, entry/exit, recovery and stop conditions;
- external/legal/live/production work is isolated from repository remediation;
- blockers: 0; major findings open: 0.

### Pass 2 — Architecture / Data / Security: PASS

- static-export platform and content boundary are preserved;
- no database, CMS, auth, worker or server runtime is introduced;
- PII/live submission remains disabled until external contracts close;
- shared owners and freeze points are explicit;
- blockers: 0; major findings open: 0.

### Pass 3 — Dependencies / Autonomy: PASS

- nodes visited by topological check: 80/80;
- cycles: 0; unknown references: 0; old-node collisions: 0;
- cross-epic dependencies on unmerged intermediate tasks: 0;
- terminal delivery tasks: 21/21 with complete direct child coverage;
- initial ready work: `CR-00.1`, `CR-01.1`, `CR-02.1`, `CR-11.1`;
- maximum designed ready width: 5; critical path: 42 task levels;
- significant dependency taxonomy: 9 HARD, 8 CONTRACT, external/owner and production gates isolated.

### Pass 4 — Executability / Evidence / Delivery: PASS

- all 59 implementation tasks have an observable outcome and required proof;
- all 21 delivery tasks require review, exact-head gate and merged SHA evidence;
- evidence tiers distinguish domain-model, wired, live and external-blocked promises;
- `ValidateDraft` PASS: schema v2, coverage 21/21, 80 tasks, detected anchors, source review SHA `675675754830f6be503d7a4e7759f205032c456cca5c3472b5845c72b9446092`;
- owner decisions before approval: 0;
- production actions in implementation graph: 0.

## 18. Night Run Readiness

```text
Independent initial work: CR-00.1 || CR-01.1 || CR-02.1 || CR-11.1
Critical path: contracts -> architecture/content boundary -> SEO artifact
  -> verification/CI/operations -> integrated proof -> final audits -> docs
Single blocking points: integrated proof, final audit and factual closeout are
  intentionally sequential after all contributing surfaces merge
External prerequisites: EXT-01..06, each with safe fallback and stop condition
Owner decisions remaining before approval: 0
Production-only stops: isolated; production is not represented as a task
Safe work if one stream blocks: other ready contract/foundation/consumer work
Expected stop conditions: scope expansion, failed gate, new secret,
  irreversible external action, PII risk or explicit production boundary
Result: READY_WITH_LIMITS
Limits: the 42-level contract-first critical path and manual SourceCraft gates
  cannot be safely removed without allowing shared-contract drift or unverified
  merges. External live/production proof remains blocked but does not prevent
  completion of safe repository remediation.
Task Manager import: AUTHORIZED_AFTER_APPROVAL
Developer handoff: AUTHORIZED_AFTER_CLEAN_RECONCILE
Production: NOT AUTHORIZED
```

## 19. Required Closeout Report

```text
BASELINE SHA:
FINAL MAIN SHA:
EPICS COMPLETED:
DOCS CHANGED:
SEO SYSTEM CREATED:
ARCHITECTURE VIOLATIONS FIXED:
UI VIOLATIONS FIXED:
SEO VIOLATIONS FIXED:
CONTENT BOUNDARY FIXED:
P0 REMAINING:
P1 REMAINING:
P2 REMAINING:
VERIFY:
VERIFY:RELEASE:
BUILD:
E2E:
ACCESSIBILITY:
SEO CRAWL:
PERFORMANCE:
EXTERNAL BLOCKERS:
PRODUCTION: NOT EXECUTED
```

## 20. Revision History

### v3 final audit — 2026-09-30 — READY_FOR_OWNER_APPROVAL

- Audit passes: logic/completeness PASS; architecture/data/security PASS; dependencies/autonomy PASS; executability/evidence/delivery PASS.
- Findings: 0 BLOCKER open, 0 MAJOR open, 0 NEEDS_OWNER.
- Graph: 21 epics, 80 tasks, 21 delivery tasks, 0 cycles, 0 unknown references, 0 collisions.
- Night Run Readiness: `READY_WITH_LIMITS`; limits are explicit and do not block safe repository work.
- Draft inventory validation: PASS 21/21 against exact REVIEW snapshot SHA `675675754830f6be503d7a4e7759f205032c456cca5c3472b5845c72b9446092`.
- Approval/import/Developer: not allowed until the owner says `План утверждён` or `План утвержден` for exact v3.

### v3 approval — 2026-09-30 — APPROVED

- Approver: owner.
- Approval phrase: `План утверждён`.
- Result: exact v3 is approved for Task Manager import, safe implementation, authorized delivery tasks and Developer handoff.
- Production: not authorized.
- Approved source snapshot SHA-256 is recorded in the Task Manager inventory generated during approval handoff.

### v3 — 2026-09-30 — REVIEW / AUTONOMY CORRECTION

- Final-audit finding F-014: v2 had one avoidable initial ready bottleneck.
- Resolved: `CR-01.1`, `CR-02.1` and `CR-11.1` now start from the same exact baseline with disjoint file ownership; `CR-00.1` remains independently ready.
- Cross-epic merged boundaries, collision-safe IDs and complete delivery coverage remain unchanged.
- Final audit and `ValidateDraft` must rerun against exact v3.

### v2 — 2026-09-30 — REVIEW / FINAL AUDIT CORRECTIONS

- Final-audit findings: F-011 ID collision, F-012 unmerged cross-epic boundaries and F-013 incomplete delivery coverage.
- Resolved: all task IDs moved to collision-safe `CR-*`; inventory epic keys are `CR-EPIC-*`; cross-epic dependencies use merged `.D` tasks; every `.D` directly depends on all implementation children.
- Added dependency: integrated browser proof `CR-18.1` waits for blocks/RichText delivery `CR-12.D`.
- Owner decisions: unchanged and fully decided.
- Final audit must rerun against exact v2 before readiness.

### v1 — 2026-09-30 — REVIEW / ASSEMBLY

- Revision input: owner accepted OD-R01 through OD-R04.
- Accepted decisions: `MERGE_AFTER_GATE`, separate SEO Source of Truth, explicit new managed graph, P0 non-waivable and owner-only P1 exception.
- Added: 21 Epic Contracts, 80 stable task/delivery IDs, task-level dependency matrix, shared ownership, evidence tiers, severity policy and graph migration stop conditions.
- Resolved: F-009 and F-010 at assembly level; final audit remains pending.
- Dependency design: zero cycles by construction; blocking scope softened for EPIC-04, EPIC-12, EPIC-14 and EPIC-15 so independent work can open earlier.
- Task Manager import and Developer handoff: not allowed before final audit and exact owner approval.

### v0 — 2026-09-30 — DRAFT / ASSEMBLY BASELINE

- Input: owner-supplied `AMS24 CONSTITUTION REMEDIATION MASTER PLAN V2`.
- Accepted: remediation goal, 21 candidate epics, external-safe fallbacks and no-production boundary.
- Corrected: lifecycle/version, Git delivery sequence, old-plan relationship and preliminary waves.
- Confirmed: heading defect, absent sitemap/robots artifact, content-boundary violations, internal public vocabulary, lead endpoint mismatch and docs status drift.
- Rejected: immediate approval, silent v4 graph reuse, fully serial chain and unconditional duplicating docs.
- Owner decisions OD-R01 through OD-R04 were open at v0 and are resolved in v1.
- Open: full Epic/Task Contracts, dependency matrix, shared-file ownership, delivery tasks, verification map and rollback/stop conditions.

## 21. Next Step

Exact v3 is owner-approved. Approval handoff must generate and validate the exact approved inventory, reconcile the new managed graph and hand off to Task Manager Developer. Production remains outside that authorization.
