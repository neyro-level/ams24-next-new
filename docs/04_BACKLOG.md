# Master Plan / Backlog — ams24-next-newЧише танцкан 

Plan ID: `AMS24-IMPULSE-2026`  
Version: v4  
Status: APPROVED  
Phase: `APPROVAL_HANDOFF`  
Updated: 2026-09-29

This is the single canonical master plan and backlog. Exact v4 was approved by the owner on 2026-09-29 with the phrase `План утверждён`. Production remains outside this approval and requires a separate explicit release command.

## 1. Primary Goal

Create a new production-ready static commercial website on `ams24.ru` that clearly presents the «Импульс» platform and its three products, converts visitors into compliant leads, supports evidence-based sales through tariffs/cases/reviews, and grows organic demand through articles and a product knowledge base.

## 2. Non-goals

- CMS, database, auth, cabinet, payments or server-side application runtime.
- Literal competitor cloning.
- Full public content written before page roles and evidence are approved.
- Production deployment inside implementation epics.
- Import into Beads before owner approval.

## 3. Major Outcomes

1. Canonical project documentation and owner-approved execution graph.
2. Reproducible static Next.js foundation in repository `ams24-next-new`.
3. Verified AMS Northline design foundation and representative homepage.
4. Validated content architecture with all agreed route skeletons.
5. Three differentiated product pages.
6. Evidence and commercial support pages: tariffs, cases, reviews, calculations.
7. Articles and knowledge-base publishing system.
8. Compliant lead, legal, analytics and SEO surface.
9. Verified static artifact and separately authorized production release.

## 4. Source of Truth

- Product: `01_PRD.md`.
- Routes/page roles/SEO: `02_PRODUCT_STRUCTURE.md`.
- Technical contracts: `03_ARCHITECTURE.md`.
- UI: `06_DESIGN_SYSTEM.md`.
- Release: `05_RELEASE_CHECKLIST.md`.
- Evidence: `research/COMPETITOR_SEO_BASELINE.md`.

## 5. Owner Decisions Already Recorded

- Brand and primary product: «Импульс».
- Domain: `ams24.ru`.
- Repository name: `ams24-next-new`.
- Universal platform homepage plus separate product pages.
- Three product routes: `/impuls/`, `/pixel/`, `/zashchita/`.
- Top-level tariffs, cases, reviews, calculations, articles and knowledge base.
- LEADLIFE architecture may inform roles, but competitor content/design is not copied.
- Existing AMS Northline system is the visual input.

## 6. Delivery Strategy

The program uses contract-first waves. A dependency blocks only the tasks that need its merged canonical contract. Each independent implementation epic uses its own branch/worktree and one terminal delivery task. Production requires separate owner authorization.

All implementation epics use `propagate_dependencies_to_children: false`. Every child task therefore declares exact stable task/decision dependencies; parent epic dependencies are descriptive and are not inherited automatically.

### Waves

```text
Wave 0: EPIC-00 documentation and plan
Approval bootstrap: AH-01 Git/SourceCraft control repository + approved docs checkpoint + Task Manager import
Wave 1: EPIC-01 repository/static foundation and early external preflights
Wave 2: EPIC-02 design foundation || EPIC-03 content/SEO contracts
Wave 3: EPIC-04 site shell and route skeleton || approved content/evidence preparation
Wave 4: EPIC-05 product pages || EPIC-06 proof/commercial pages || EPIC-07 content publishing
Wave 5: EPIC-08 kickoff after EPIC-05.D + EPIC-06.D + EPIC-07.D, then leads/legal/analytics/SEO hardening in one bounded stream
Wave 6: EPIC-09 release readiness
Production: separate explicit release command after implementation graph
```

## 7. EPIC-00 — Documentation Foundation

Status: `DONE`

### Outcome

The project has one consistent AMS Product Development Standard 2.0 canon and one reviewable execution plan with no competing Source of Truth.

### Why

Foundation code must not encode unresolved product, URL, delivery or UI decisions.

### Scope in

- root `AGENTS.md` and `README.md`;
- docs map, PRD, Product Structure, Architecture, Backlog, Release Checklist and Design System;
- competitor/SEO evidence baseline;
- owner-decision register and dependency waves;
- initial Task Manager Architect assembly review.

### Scope out

- Git initialization/remote creation;
- application code;
- final audit, Beads import or Developer handoff without the required owner phrase.

### Entry conditions

- owner-approved high-level site architecture;
- supplied static/UI/design standards.

### Exit conditions

- all canonical documents exist and cross-reference correctly;
- URL and product decisions are recorded once;
- master plan is `REVIEW` after an assembly pass;
- open owner decisions are explicit.

### Acceptance / verification

- file inventory matches `docs/README.md`;
- no conflicting repository/product/URL/stack values;
- every epic has observable outcome, scope, dependencies, acceptance and stop conditions;
- no Task Manager import occurs.

### Delivery mode

Docs-only working change. No merge/release authority.

### Recovery

Git history after repository foundation; until then, changes are local files and can be corrected in place.

### Stop conditions

Stop if a requested product/architecture decision contradicts an already approved owner decision and cannot be safely labelled TODO.

## 8. EPIC-01 — Repository and Static Foundation

Status: `BACKLOG`

### Outcome

`ams24-next-new` is a reproducible SourceCraft-first Next.js static-export project with pinned versions, local developer commands and architecture guards.

### Scope in

- verify the Git/SourceCraft control repository created by approval bootstrap and its canonical remotes;
- scaffold Next.js App Router, TypeScript strict, pnpm, Tailwind 4;
- verify and pin exact Node/Next/React/Tailwind versions from official docs;
- configure `output: "export"`, trailing slash and static images;
- configure lint/typecheck/test/build and `pnpm verify`;
- create 404/error baseline and static guard scripts;
- add root commands and version evidence to documentation;
- establish zero-auto-CI policy and manual gate placeholder per project canon.
- run early credential-free preflight for AMS Leads API contract availability, legal reviewer status, analytics/CAPTCHA inputs and old-site URL inventory.

### Scope out

- production server, secrets and deployment;
- product page design;
- CMS/database/auth.

### Dependencies

- `AH-01` approval bootstrap and CLEAN Task Manager reconcile.

### Parallel-safe with

None until repository and lockfile exist. After contract freeze it unlocks EPIC-02 and EPIC-03.

### Acceptance / verification

- fresh frozen install succeeds;
- `pnpm verify` succeeds;
- static build produces `out/`;
- guard confirms no dynamic runtime API or default image optimizer conflict;
- custom 404 exists in export;
- exact stack versions are recorded from actual package/lockfile.

### Risk

Version-sensitive framework setup. Requires official-doc verification.

### Recovery

Revert foundation commit/PR; no production or persistent data exists.

### Stop conditions

Stop for owner decision if current official Next/Tailwind constraints make the supplied static standard incompatible or require changing the platform contract.

## 9. EPIC-02 — Design Foundation and Representative Homepage

Status: `BACKLOG`

### Outcome

AMS Northline is normalized into a verified project-owned token/component system, and `/` proves the system across real responsive sections without visual drift.

### Scope in

- inventory/normalize Northline roles for Impulse;
- configure shadcn/ui and aliases once;
- create semantic tokens in `globals.css`;
- verify Manrope Cyrillic, license, weights and CSS variable mapping;
- build token/shadcn fixture;
- implement Container, Section, SectionHeader, Button, form primitives, Header, Footer, MobileMenu;
- implement representative homepage with approved content placeholders and all planned semantic section types;
- responsive/accessibility/performance baseline;
- design-system drift audit.

### Scope out

- final marketing copy and unverified case metrics;
- all secondary pages;
- a second UI library or registry.

### Dependencies

- HARD: EPIC-01 foundation and lockfile.
- CONTRACT: homepage page brief from `02_PRODUCT_STRUCTURE.md` already available.

### Parallel-safe with

EPIC-03 after EPIC-01, provided shared paths are coordinated: EPIC-02 owns UI/token paths; EPIC-03 owns content/core/project paths.

### Acceptance / verification

- token fixture compiles and actual Tailwind utilities resolve;
- no duplicate primitive foundation;
- homepage has one H1 and correct semantic sections;
- keyboard/mobile menu and form shell states work;
- representative mobile check meets layout/accessibility baseline;
- drift audit has no P0/P1 foundation finding;
- design intake exit criteria in `06_DESIGN_SYSTEM.md` are evidenced.

### Recovery

Revert UI foundation PR. No production data.

### Stop conditions

Stop for owner decision on a visual conflict that would materially change Northline or introduce a second visual language.

## 10. EPIC-03 — Content, Routing and SEO Contracts

Status: `BACKLOG`

### Outcome

All site entities and routes are generated from validated content contracts, with stable IDs/paths, build-time indexes, central navigation/SEO and hard failure on invalid content.

### Scope in

- Zod-first schemas and inferred DTOs;
- repository contract, Local Adapter, indexes and services;
- typed block registry and RichText abstraction;
- Site Settings, Navigation, Media, SEO and Redirect schemas/generators;
- product/tariff/case/review/calculation/article/KB models;
- published/hidden status and sitemap eligibility;
- generateStaticParams helpers;
- content validation tests for IDs, paths, refs, links, media, blocks and SEO.

### Scope out

- final content writing;
- Payload adapter;
- live lead submission.

### Dependencies

- HARD: EPIC-01 foundation.
- CONTRACT: entity and URL map from `02_PRODUCT_STRUCTURE.md`.

### Parallel-safe with

EPIC-02 after ownership split. Contract freeze for Page/Product/SEO DTO unlocks EPIC-04 before every content type implementation is complete.

### Acceptance / verification

- invalid schema/duplicate ID/duplicate `(locale,path)`/broken ref/unknown block fails verification;
- pages use services/repository, not raw content imports;
- published route inventory exactly matches expected fixture;
- metadata and sitemap generators consume the same validated data;
- article Markdown renders only through canonical RichText.

### Recovery

Revert content foundation PR; local fixture content is reproducible.

### Stop conditions

Stop if an entity requires dynamic request-time behavior incompatible with static export.

## 11. EPIC-04 — Site Shell and Complete Route Skeleton

Status: `BACKLOG`

### Outcome

The complete agreed architecture is navigable as static routes with a production-shaped header/footer and at least one meaningful semantic block per route type, while unfinished pages remain non-indexable.

### Scope in

- global layout, header, footer, breadcrumbs and mobile navigation;
- homepage composition from EPIC-02 integrated with content contracts;
- route skeletons for products, tariffs, cases, reviews, calculations, articles, KB, company, contacts and legal;
- one representative case/article/KB detail fixture;
- 404 and error boundary-equivalent;
- `noindex`/publication guards for unfinished routes.

### Scope out

- final page copy/design for every route;
- live lead transport;
- production deployment.

### Dependencies

- HARD: EPIC-02 shared UI foundation.
- CONTRACT: EPIC-03 Page/Product/SEO DTO and route helpers frozen.

### Acceptance / verification

- every agreed route type builds and is reachable through navigation or fixture links;
- unfinished routes do not enter sitemap/index;
- canonical/trailing-slash policy is reflected in generated routes;
- mobile and keyboard navigation cover all first-level destinations;
- representative detail routes have breadcrumbs and related links.

### Recovery

Revert shell/route PR without affecting content contracts.

### Stop conditions

Stop if requested route changes contradict active `02_PRODUCT_STRUCTURE.md`; update/approve that Source of Truth first.

## 12. EPIC-05 — Three Product Pages

Status: `BACKLOG`

### Outcome

`/impuls/`, `/pixel/` and `/zashchita/` each answer a distinct commercial intent, explain mechanism/limitations and convert to a product-specific action without SEO cannibalization.

### Scope in

- page strategy and approved factual content for each product;
- product-specific semantic sections, FAQ, evidence and CTA;
- distinct metadata/H1/internal linking;
- comparison/switcher between products;
- legal/evidence review of terminology and claims.

### Scope out

- new unapproved product features;
- absolute result/security guarantees;
- mass niche landing pages.

### Dependencies

- HARD: EPIC-04 shell/routes.
- EXTERNAL: owner-approved product facts and legal review for sensitive claims.
- CONTRACT: case/tariff refs can use placeholders until EPIC-06 content is published.

### Parallel-safe with

EPIC-06 and EPIC-07 after route/UI/content contracts freeze. Each stream owns separate page/content files; shared component changes require coordination.

### Acceptance / verification

- unique role, H1, metadata and content depth for each route;
- no paragraph-level duplicate between homepage and `/impuls/`;
- every public claim maps to owner-provided evidence or is labelled explanatory;
- responsive/accessibility/SEO page contract passes;
- primary CTA carries correct product/source context.

### Fallback

If facts/legal review are incomplete, keep affected blocks hidden/noindex rather than inventing content.

### Stop conditions

Stop only the affected product task on missing factual/legal approval; continue other independent product work.

## 13. EPIC-06 — Tariffs, Cases, Reviews and Calculations

Status: `BACKLOG`

### Outcome

The site has a verifiable commercial proof layer that lets prospects understand pricing logic and evaluate relevant experience without fabricated precision.

### Scope in

- tariffs comparison and product relations;
- cases hub plus complete detail template;
- reviews hub and evidence fields;
- calculation examples with explicit assumptions;
- three-niche filtering only when sufficient unique content exists;
- proof/evidence labels and permission/anonymization status.

### Scope out

- publishing unidentified metrics without source;
- automated pricing engine unless separately approved;
- thin niche pages.

### Dependencies

- HARD: EPIC-04 routes and shared UI.
- EXTERNAL: owner inventory of tariffs, cases, reviews and permissions.

### Parallel-safe with

EPIC-05 and EPIC-07. Content preparation can start from templates even if some evidence is pending.

### Acceptance / verification

- every case satisfies the case evidence contract;
- every review has permission/source status;
- every calculation exposes assumptions and limitations;
- filters/hubs contain no empty/thin indexable combination;
- all entities cross-link to relevant products and CTA.

### Fallback

Launch with fewer complete items; incomplete entities stay unpublished and out of sitemap.

### Stop conditions

Missing evidence blocks only the affected entity, not the complete epic if a release-minimum set remains possible.

## 14. EPIC-07 — Articles and Knowledge Base

Status: `BACKLOG`

### Outcome

The site supports scalable static publication of SEO/editorial articles and separate product instructions with distinct templates, taxonomy and internal-link logic.

### Scope in

- article and KB hubs/templates;
- product/topic relations and related-content rules;
- author/date/update metadata policy;
- editorial typography/media rules;
- initial content set defined after semantic research;
- optional topic hubs only with sufficient unique demand/content.

### Scope out

- CMS/editor roles;
- arbitrary MDX components;
- automatic AI publishing without review;
- mass programmatic pages.

### Dependencies

- HARD: EPIC-04 representative routes.
- CONTRACT: EPIC-03 Article/Knowledge DTO and RichText.
- EXTERNAL: approved editorial briefs/evidence for initial content.

### Parallel-safe with

EPIC-05 and EPIC-06.

### Acceptance / verification

- article and KB templates are visibly and semantically distinct;
- Markdown content validates and renders through canonical RichText;
- each published item has unique metadata, breadcrumb and next action;
- orphan detection and broken-link checks pass;
- no unsupported topic hub is indexable.

### Fallback

Publish a smaller reviewed initial set; the content engine remains ready for future Git-based additions.

### Stop conditions

Stop an item if evidence, authorship or legal review is missing; continue other approved items.

## 15. EPIC-08 — Leads, Legal, Analytics and SEO Hardening

Status: `BACKLOG`

### Outcome

All published routes can convert and be measured without leaking PII, while legal, indexing, redirect and static-security requirements are enforced mechanically.

### Scope in

- canonical LeadForm and product/context variants;
- `/api/leads` relative transport and Nginx contract fixture;
- consent version/timestamp/source context;
- anti-spam UX and AMS Leads API error handling;
- legal pages and consent links;
- typed analytics with no PII;
- populate final metadata/robots/structured data values and run full-site crawl validation using EPIC-03 generators;
- redirect inventory from current `ams24.ru` and final redirect validation using EPIC-03 contract;
- content/security static guards.

### Scope out

- CRM secrets in frontend;
- production credentials/server changes;
- production release.

### Dependencies

- HARD: EPIC-04 shell and form UI baseline.
- CONTRACT: page/product IDs from EPIC-03.
- EXTERNAL: AMS Leads API contract, analytics account data, legal text/approval, old-site URL inventory.

### Parallel-safe with

Final tasks of EPIC-05/06/07 until full-site crawl and final metadata pass.

### Acceptance / verification

- allowed and invalid lead scenarios verified against a safe non-production target;
- no PII appears in analytics/network logging beyond the approved lead request;
- form states and consent payload verified;
- sitemap/robots/canonical/redirect/404 checks pass;
- static artifact scan finds no secret-like values;
- staging protection contract is present.

### Fallback

If live lead integration is unavailable, keep forms disabled with a truthful contact alternative only for development/staging; public release remains blocked because working lead forms are part of the approved first-release PRD.

### Stop conditions

Stop live integration on missing safe test endpoint, secret boundary or legal consent approval; continue SEO/static checks. Public release is blocked by any missing working lead path, mandatory legal/consent target, approved redirect inventory or required analytics contract.

## 16. EPIC-09 — Release Readiness and Artifact

Status: `BACKLOG`

### Outcome

The exact approved `main` SHA produces a verified, rollback-ready static artifact and complete release evidence; production remains a separate owner-authorized action.

### Scope in

- full diff review and risk classification;
- one exact-head SourceCraft Merge Gate appropriate for CRITICAL profile;
- production-like build and artifact validation;
- browser E2E/smoke against artifact/staging;
- performance/accessibility/SEO final proof;
- Nginx config, security headers, trailing slash and 404 validation;
- artifact storage and rollback rehearsal/documentation;
- final release checklist evidence.

### Scope out

- actual production rollout without explicit owner command.

### Dependencies

- HARD: all release-scope tasks in EPIC-05–08 complete.
- EXTERNAL: production identity, server path, artifact store and DNS/TLS readiness.
- PRODUCTION: owner release authorization for rollout only.

### Acceptance / verification

- PR head SHA, merged canonical `main` SHA and release artifact SHA are recorded separately;
- no equivalent gate or build is repeated for the same SHA without a documented risk reason;
- artifact is reproducible and stored;
- critical flows pass on production-like surface;
- rollback target/procedure is known;
- `05_RELEASE_CHECKLIST.md` is complete except explicit production/post-deploy items.

### Recovery

Do not roll out failed artifact. If a staging rollout fails, restore previous staging release.

### Stop conditions

Any critical failure, unknown production identity, missing rollback or missing exact-head gate blocks release but not documentation/fix work.

## 17. Dependency Matrix

| Epic | Depends on | Type | Blocking scope | Can be softened? | Wave |
|---|---|---|---|---|---:|
| EPIC-00 | owner inputs | OWNER | governance only | completed nodes excluded from implementation import | 0 |
| AH-01 | exact owner approval | OWNER/HARD | approval handoff | no | approval bootstrap |
| EPIC-01 | AH-01 | HARD | foundation and preflight | no | 1 |
| EPIC-03 | EPIC-01.D | HARD | content foundation | no | 2 |
| EPIC-02 | EPIC-01.D and EPIC-03.D for homepage task | HARD | task-level | token work starts before content merge; homepage waits for 03.D | 2 |
| EPIC-04 | EPIC-02.D + EPIC-03.D | HARD | shell/routes | no; both canonical foundations required | 3 |
| EPIC-05 | EPIC-04.D + EPIC-01.D preflight | HARD/EXTERNAL | each product page | missing facts block only affected page | 4 |
| EPIC-06 | EPIC-04.D + evidence inventory | HARD/EXTERNAL | each entity | incomplete entities stay hidden | 4 |
| EPIC-07 | EPIC-04.D + approved briefs | HARD/EXTERNAL | each content item | smaller initial set | 4 |
| EPIC-08 | EPIC-05.D + EPIC-06.D + EPIC-07.D + EPIC-01.D preflight | HARD/EXTERNAL | bounded Wave-5 stream | development fallbacks exist, but mandatory release scope cannot be omitted | 5 |
| EPIC-09 | EPIC-05.D + EPIC-06.D + EPIC-07.D + EPIC-08.D | HARD/EXTERNAL/PRODUCTION | release readiness only | production authorization isolated | 6 |

Cycles: none in v4.  
Critical path: `AH-01 -> EPIC-01.D -> EPIC-03.D -> EPIC-02.D -> EPIC-04.D -> max(EPIC-05.D, EPIC-06.D, EPIC-07.D) -> EPIC-08.D -> EPIC-09.D`.

## 18. Shared Ownership / Conflict Guards

| Shared surface | Owner epic | Freeze point | Downstream rule |
|---|---|---|---|
| package/Next config | EPIC-01 | foundation acceptance | later changes require version-sensitive review |
| semantic tokens/primitives | EPIC-02 | token fixture + representative page | use REUSE -> VARIANT -> CREATE |
| DTO/repository/block registry | EPIC-03 | contract tests pass | downstream pages consume public contract only |
| header/footer/navigation | EPIC-04 | shell acceptance | content changes through central navigation source |
| lead schema/transport | EPIC-08 | safe integration test | forms do not invent fields/transport |
| SEO/redirect schemas and generators | EPIC-03 | contract tests pass | pages consume generators, not ad-hoc logic |
| final metadata/robots/redirect inventory/crawl | EPIC-08 | full-site validation | values use EPIC-03 contracts |

## 19. Delivery and SHA Policy

Approved implementation mode for `EPIC-01` through `EPIC-09`: `MERGE_AFTER_GATE`. Each epic is one independently reviewable stream/branch/worktree/PR and ends in exactly one `.D` delivery task.

```text
implementation task commits
-> terminal EPIC-NN.D creates/updates epic PR
-> review + one exact-head SourceCraft gate owned by EPIC-NN.D
-> merge into canonical main
-> record resulting main SHA and mapping to PR head
-> release workflow builds exact main SHA once
-> artifact SHA/checksum recorded
-> production only by separate owner release command
```

Rules:

- branch/PR push does not trigger paid CI automatically;
- dependent epics consume merged canonical contracts, not an unapproved stacked-PR chain;
- a changed PR head invalidates the previous gate evidence;
- a merge-created main SHA is recorded separately and must contain the reviewed diff;
- release does not repeat an equivalent development gate/build without a documented risk reason;
- production is never implied by `MERGE_AFTER_GATE`.

## 20. Approval Handoff Bootstrap

`AH-01` is a post-approval governance operation, not an implementation task and not part of the Developer ready-loop.

```text
exact owner phrase «План утверждён»
-> mark exact plan APPROVED and compute SHA-256
-> create/verify Git + SourceCraft control repository ams24-next-new
-> commit and push approved docs snapshot
-> build inventory schema v2
-> Validate / Init / Import / Reconcile
-> require CLEAN coverage and dependency graph
-> start Task Manager Developer goal
```

If repository creation, docs checkpoint or reconcile fails, handoff stops before Developer. No production action is allowed.

## 21. Stable Task Inventory v4

All tasks inherit program non-goals and the Source of Truth hierarchy. Recovery means revert the task/epic change or keep incomplete content unpublished; no task may repair a failure by entering production. EPIC-00 governance nodes and AH-01 are excluded from the implementation ready-loop.

### EPIC-00 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-00.1` | canonical docs and research baseline exist | all canonical docs | owner inputs | inventory, cross-reference and decision consistency checks pass | governance / closed before import | correct files in place; stop on unresolved contradiction |
| `EPIC-00.2` | assembly reviews and accepted findings produce versioned REVIEW snapshots | `04_BACKLOG.md` | `EPIC-00.1` | finding triage and revision history exist; no import | governance / closed before import | revert semantic delta; stop on owner-only conflict |
| `EPIC-00.3` | exact current plan passes final four-pass audit and readiness gate | `04_BACKLOG.md` | `EPIC-00.2`, explicit final-check command | blockers/cycles/before-approval decisions = 0; readiness verdict recorded | governance / closed before import | remain REVIEW on FAIL; approval handoff is separate AH-01 |

### EPIC-01 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-01.1` | approved control repository contract and canonical remotes are verified | `03_ARCHITECTURE.md` | `AH-01` | root/default branch/remotes verified; no secret printed | implementation | stop on credential/provider mismatch; do not create second repo |
| `EPIC-01.2` | pinned Next static scaffold builds reproducibly | `03_ARCHITECTURE.md` | `EPIC-01.1` | official-doc evidence, frozen install and `out/` build | implementation | revert scaffold commit; stop on platform incompatibility |
| `EPIC-01.3` | fast `pnpm verify` and static architecture guards exist | `03_ARCHITECTURE.md` | `EPIC-01.2` | typecheck/lint/tests/guards detect seeded invalid fixture | implementation | revert guard change; stop if checks require dynamic runtime |
| `EPIC-01.4` | manual-only SourceCraft workflow policy matches CRITICAL profile | `03_ARCHITECTURE.md`, global canon | `EPIC-01.2` | no push/PR auto-run; manual workflow definition validated | implementation | disable invalid workflow; stop before any paid run |
| `EPIC-01.5` | external preflight records AMS Leads API contract availability, legal reviewer status, analytics/CAPTCHA inputs and old-site URL inventory | `01_PRD.md`, `03_ARCHITECTURE.md` | `EPIC-01.1` | credential-free statuses, fallbacks and owners recorded; no secret extracted | implementation | record known blocker and continue independent foundation work |
| `EPIC-01.D` | foundation/preflight epic is reviewed, gated and merged to canonical main | delivery policy | `EPIC-01.2`, `EPIC-01.3`, `EPIC-01.4`, `EPIC-01.5` | epic PR head review + one exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | do not merge on failed review/gate; fix branch then rerun changed-head gate |

### EPIC-02 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-02.1` | Northline inventory becomes normalized semantic tokens/fonts | `06_DESIGN_SYSTEM.md` | `EPIC-01.D` | token/font fixture compiles; Cyrillic/license/variables verified | implementation | revert tokens; stop on material visual conflict |
| `EPIC-02.2` | one shadcn primitive and layout foundation exists | `06_DESIGN_SYSTEM.md` | `EPIC-02.1` | aliases and primitive paths verified; no duplicate Button/Input tree | implementation | revert component additions; stop on second UI library need |
| `EPIC-02.3` | representative homepage proves all major composition patterns | `02_PRODUCT_STRUCTURE.md`, `06_DESIGN_SYSTEM.md` | `EPIC-02.2`, `EPIC-03.D` | one H1, three routes, proof previews and embedded LeadForm shell render responsively | implementation | keep page unpublished; stop on unapproved claims |
| `EPIC-02.4` | design intake closes with accessibility/performance/drift evidence | `06_DESIGN_SYSTEM.md` | `EPIC-02.3` | no P0/P1 drift; keyboard/mobile/a11y and production-like budget measured | implementation | reopen intake; stop scaling pages on P0/P1 |
| `EPIC-02.D` | design foundation/homepage epic is reviewed, gated and merged | delivery policy | `EPIC-02.1`, `EPIC-02.2`, `EPIC-02.3`, `EPIC-02.4` | epic PR head review + exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | do not merge on P0/P1 or failed gate |

### EPIC-03 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-03.1` | stable Zod DTO contracts cover agreed entities | `02_PRODUCT_STRUCTURE.md`, `03_ARCHITECTURE.md` | `EPIC-01.D` | schema fixtures and inferred types pass; IDs/paths/locales normalized | implementation | revert contract; stop on request-time entity need |
| `EPIC-03.2` | repository/local adapter loads and indexes once per build | `03_ARCHITECTURE.md` | `EPIC-03.1` | getter/ref/index tests pass; duplicate ID/path hard-fails | implementation | revert adapter; stop on hidden persistence requirement |
| `EPIC-03.3` | typed block registry and canonical RichText work | `03_ARCHITECTURE.md` | `EPIC-03.1` | unknown block fails; Markdown renders without raw arbitrary HTML | implementation | revert registry; stop on arbitrary page-builder demand |
| `EPIC-03.4` | SEO/route/redirect generators expose tested contracts | `02_PRODUCT_STRUCTURE.md`, `03_ARCHITECTURE.md` | `EPIC-03.1`, `EPIC-03.2`, `EPIC-03.3` | metadata/sitemap/params/redirect fixtures pass | implementation | revert generator; stop on dynamic runtime dependency |
| `EPIC-03.D` | content/routing contract epic is reviewed, gated and merged | delivery policy | `EPIC-03.2`, `EPIC-03.3`, `EPIC-03.4` | epic PR head review + exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | do not merge incompatible contract |

### EPIC-04 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-04.1` | accessible shell/navigation/footer/breadcrumbs cover the architecture | `02_PRODUCT_STRUCTURE.md` | `EPIC-02.D`, `EPIC-03.D` | keyboard/mobile path reaches all first-level routes | implementation | revert shell; stop on route conflict |
| `EPIC-04.2` | every agreed route type has a static skeleton with publication guard | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.1` | build inventory matches map; unfinished routes absent from sitemap/index | implementation | hide route; stop on missing unique role |
| `EPIC-04.3` | representative case/article/KB details plus 404/error recovery work | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.2` | breadcrumbs/related links/404 export browser checks pass | implementation | revert fixture; stop on broken content contract |
| `EPIC-04.D` | shell/route skeleton epic is reviewed, gated and merged | delivery policy | `EPIC-04.1`, `EPIC-04.2`, `EPIC-04.3` | epic PR head review + exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | do not merge broken navigation/index guard |

### EPIC-05 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-05.1` | product fact/claim register and legal brief are ready | `01_PRD.md` | `EPIC-01.D`, `OD-03` | every planned claim has evidence/status and named legal-review route | implementation | keep claim hidden; stop affected page only |
| `EPIC-05.2` | `/impuls/` answers main commercial intent | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.D`, `EPIC-05.1`, `OD-07` | unique copy/metadata/CTA; responsive/a11y/SEO checks | implementation | unpublish page; stop on unapproved mechanism claim |
| `EPIC-05.3` | `/pixel/` answers own-site visitor intent | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.D`, `EPIC-05.1` | requirements/data boundary/CTA are explicit and verified | implementation | unpublish page; stop on privacy ambiguity |
| `EPIC-05.4` | `/zashchita/` explains audit/measures without absolute guarantee | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.D`, `EPIC-05.1` | threat/limits/evidence/CTA checks pass | implementation | unpublish page; stop on unsupported protection promise |
| `EPIC-05.5` | homepage/products do not cannibalize or contradict | `02_PRODUCT_STRUCTURE.md` | `EPIC-05.2`, `EPIC-05.3`, `EPIC-05.4` | duplicate/intent/internal-link review passes | implementation | revert conflicting copy; stop on unresolved positioning |
| `EPIC-05.D` | three-product epic is reviewed, gated and merged | delivery policy | `EPIC-05.2`, `EPIC-05.3`, `EPIC-05.4`, `EPIC-05.5` | epic PR head review + exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | do not merge unsupported claims or failed page contract |

### EPIC-06 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-06.1` | tariff/case/review evidence inventory is classified publishable/hidden | `01_PRD.md` | `EPIC-01.D`, `OD-04` | every item has evidence and permission state | implementation | keep incomplete item hidden |
| `EPIC-06.2` | tariff and calculation pages expose approved assumptions | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.D`, `EPIC-06.1`, `OD-02` | pricing/limits/assumptions cross-check passes | implementation | unpublish invalid item; stop on pricing ambiguity |
| `EPIC-06.3` | cases hub/detail meet evidence contract | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.D`, `EPIC-06.1`, `OD-01` | minimum set complete; metrics/source/period/permission verified | implementation | remove incomplete case from published set |
| `EPIC-06.4` | reviews hub keeps review separate from case evidence | `02_PRODUCT_STRUCTURE.md` | `EPIC-04.D`, `EPIC-06.1` | source/identity/anonymization/permission verified | implementation | hide review lacking permission |
| `EPIC-06.5` | proof hubs have no empty/thin indexable states | `02_PRODUCT_STRUCTURE.md` | `EPIC-06.2`, `EPIC-06.3`, `EPIC-06.4`, `OD-01` | crawl/index/link checks pass | implementation | noindex or remove incomplete hub |
| `EPIC-06.D` | proof/commercial epic is reviewed, gated and merged | delivery policy | `EPIC-06.2`, `EPIC-06.3`, `EPIC-06.4`, `EPIC-06.5` | epic PR head review + exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | do not merge incomplete release-minimum proof set |

### EPIC-07 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-07.1` | article and KB editorial contracts/templates are distinct | `02_PRODUCT_STRUCTURE.md`, `06_DESIGN_SYSTEM.md` | `EPIC-04.D`, `EPIC-03.D` | template/metadata/editorial typography checks pass | implementation | revert template; stop on role overlap |
| `EPIC-07.2` | initial briefs and evidence set satisfy approved release minimum | `01_PRD.md`, research | `EPIC-01.D`, `OD-04` | each brief has revalidated intent/source/product link | implementation | defer unsupported item |
| `EPIC-07.3` | initial articles are substantive and reviewed | approved article briefs | `EPIC-07.1`, `EPIC-07.2` | metadata/body/links/editorial QA pass | implementation | keep draft/hidden |
| `EPIC-07.4` | initial KB instructions are actionable and current | approved KB briefs | `EPIC-07.1`, `EPIC-07.2` | step/result/next-action checks pass | implementation | keep draft/hidden |
| `EPIC-07.5` | related-content graph has no orphan or duplicate hub | `02_PRODUCT_STRUCTURE.md` | `EPIC-07.3`, `EPIC-07.4` | broken/orphan/duplicate-intent crawl passes | implementation | remove bad relation or noindex hub |
| `EPIC-07.D` | article/knowledge epic is reviewed, gated and merged | delivery policy | `EPIC-07.3`, `EPIC-07.4`, `EPIC-07.5` | epic PR head review + exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | do not merge thin/orphan content set |

### EPIC-08 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-08.1` | bounded Wave-5 stream starts from merged products, proof, content and external preflight | delivery strategy | `EPIC-05.D`, `EPIC-06.D`, `EPIC-07.D`, `EPIC-01.D` | worktree starts from current canonical main; prerequisite SHAs/status recorded | implementation | stop on main drift or missing prerequisite merge |
| `EPIC-08.2` | LeadForm submits safely to test endpoint with consent/context | `03_ARCHITECTURE.md` | `EPIC-08.1`, `OD-08` | allowed/invalid/error/success/idempotency-safe scenarios; no analytics PII | implementation | disable submit for dev/staging only; public release blocked |
| `EPIC-08.3` | legal pages and consent targets match reviewed version | `01_PRD.md`, `05_RELEASE_CHECKLIST.md` | `EPIC-08.1`, `OD-03` | links/version/payload/content review pass | implementation | forms stay disabled; public release blocked |
| `EPIC-08.4` | typed analytics measures journeys without PII | `03_ARCHITECTURE.md` | `EPIC-08.1` | event schema and network inspection pass | implementation | provider adapter may be disabled in dev only; public release blocked by approved analytics scope |
| `EPIC-08.5` | final metadata/robots/sitemap/redirect/security crawl passes | `02_PRODUCT_STRUCTURE.md`, `03_ARCHITECTURE.md` | `EPIC-08.1`, `EPIC-08.2`, `EPIC-08.3`, `EPIC-08.4` | full static crawl, redirect loop/chain, artifact-secret and schema checks pass | implementation | block failing routes; missing approved redirect inventory blocks public release |
| `EPIC-08.D` | leads/legal/analytics/SEO epic is reviewed, gated and merged | delivery policy | `EPIC-08.2`, `EPIC-08.3`, `EPIC-08.4`, `EPIC-08.5` | epic PR head review + exact-head gate + merged main SHA mapping | delivery / MERGE_AFTER_GATE | no merge/public release with mandatory integration/legal/SEO failure |

### EPIC-09 tasks

| ID | Outcome / scope | Source of Truth | Depends on | Acceptance and verification | Delivery | Recovery / stop |
|---|---|---|---|---|---|---|
| `EPIC-09.1` | production identity/artifact store/Nginx/rollback preflight resolves OD-05 | `03_ARCHITECTURE.md`, `05_RELEASE_CHECKLIST.md` | `EPIC-05.D`, `EPIC-06.D`, `EPIC-07.D`, `EPIC-08.D` | target, artifact store and rollback proof exist without secret disclosure; OD-05 marked decided | implementation | no release; continue safe fixes |
| `EPIC-09.2` | pre-production checklist and risk-specific evidence are complete before delivery | `05_RELEASE_CHECKLIST.md` | `EPIC-09.1` | all non-merge, non-live checks evidenced; release-only items explicit | implementation | keep epic branch unmerged; fix failed evidence |
| `EPIC-09.D` | release-readiness epic is reviewed/gated/merged, then exact main builds one stored artifact with staging smoke | delivery policy, `03_ARCHITECTURE.md`, `05_RELEASE_CHECKLIST.md` | `EPIC-09.2` | one PR-head review/gate; merge SHA mapping; one exact-main artifact checksum; out validation and staging smoke; no production | delivery / MERGE_AFTER_GATE | do not merge on failed gate; discard bad artifact/restore staging; never issue production command |

## 22. Owner Decision Register

### OD-01 — Three priority niches

- Context: cases and future niche content require exact verticals.
- Recommendation: select one primary niche for the first complete case set, then two secondary niches.
- Blocks: final EPIC-06 content scope and niche SEO research.
- Deadline: before EPIC-06 content publication.
- Status: OPEN.

### OD-02 — Tariffs and pricing disclosure

- Context: `/tarify/` and `/raschety/` need approved commercial rules.
- Recommendation: publish a transparent pricing model/range and use personal calculation where inputs materially change price.
- Blocks: final EPIC-06 tariff copy.
- Deadline: before EPIC-06 content publication.
- Status: OPEN.

### OD-03 — Legal reviewer

- Context: PII, operator-audience language and protection claims are sensitive.
- Recommendation: name an external/legal reviewer before public release.
- Blocks: EPIC-05 claim approval, EPIC-08 legal acceptance and release.
- Deadline: before EPIC-05 public copy is marked approved.
- Status: OPEN.

### OD-04 — Initial release content minimum

- Context: every planned hub should not become thin.
- Recommendation: first public release includes at minimum 3 complete cases (one per confirmed niche), 3 attributable or transparently anonymized reviews, 3 substantive articles and 3 KB instructions (at least one content item tied to each product). Tariffs/calculations publish only after OD-02; incomplete hubs remain hidden/noindex.
- Blocks: release scope and sitemap.
- Deadline: before final audit/approval.
- Decision: first public release uses the recommended minimum: 3 complete cases, 3 reviews, 3 substantive articles and 3 KB instructions; incomplete hubs remain hidden/noindex.
- Decided by owner: 2026-09-29.
- Status: DECIDED.

### OD-05 — Production target identity

- Context: deployment path/server/artifact store are unknown.
- Recommendation: resolve only during EPIC-09 preflight through the canonical server/secret route.
- Blocks: production release, not implementation.
- Deadline: before EPIC-09 release gate.
- Status: OPEN (later gate).

### OD-06 — Epic delivery mode

- Context: downstream work needs merged canonical contracts.
- Recommendation: approve `MERGE_AFTER_GATE` for EPIC-01–09; each epic remains one PR by default and production stays separate.
- Blocks: executable Beads inventory and autonomous downstream waves.
- Deadline: before final audit/approval.
- Decision: `MERGE_AFTER_GATE` for EPIC-01–09; production remains a separate explicit command.
- Decided by owner: 2026-09-29.
- Status: DECIDED.

### OD-07 — Public subtitle for «Импульс»

- Context: the brand can work without an additional commercial subtitle, but one may improve immediate clarity.
- Recommendation: launch with brand «Импульс» plus descriptive value proposition in hero, without inventing a second formal product name.
- Blocks: final hero copy only; does not block foundation.
- Deadline: before EPIC-05.2 copy approval.
- Status: OPEN (later gate).

### OD-08 — CRM and delivery channels

- Context: frontend posts to AMS Leads API, while actual CRM/email/webhook routing is server-owned.
- Recommendation: keep frontend contract channel-agnostic; confirm live delivery destinations from the `EPIC-01.5` preflight before `EPIC-08.2`.
- Blocks: live integration, not frontend foundation.
- Deadline: before EPIC-08.2 live-safe test.
- Status: OPEN (later gate).

### DEC-01 — Homepage form

- Decision: final homepage CTA contains embedded `LeadForm`.
- Source: Architect recommendation accepted in v1.
- Status: DECIDED.

### DEC-02 — Topic hubs

- Decision: `/stati/tema/[slug]/` is outside first release until unique content and demand justify it.
- Status: DECIDED.

### DEC-03 — Thank-you behavior

- Decision: first release uses inline success; no separate thank-you route.
- Status: DECIDED.

## 23. Current NOW / NEXT / LATER

### NOW

- AH-01 approval handoff is active: Git/SourceCraft control repository, approved docs checkpoint, Task Manager import and Developer handoff.
- No production action is authorized by plan approval.

### NEXT

- EPIC-01 starts after CLEAN Task Manager import and Developer handoff.
- EPIC-01 runs foundation and early preflights; EPIC-02 token work and EPIC-03 content work open after `EPIC-01.D`.

### LATER

- Product/proof/content pages.
- Leads/legal/SEO hardening.
- Release readiness and separately authorized production.

## 24. Technical Debt

Not assessed before foundation. `TODO` decisions are not technical debt.

## 25. Night Run Readiness — final audit result

```text
Independent ready waves: EPIC-02 token work || EPIC-03; after EPIC-04.D: EPIC-05 || EPIC-06 || EPIC-07 || EPIC-08
Cycles: 0
Terminal delivery tasks: 9/9
Hard dependencies: stable task/decision IDs; merged-only cross-epic boundaries
External prerequisites: isolated in EPIC-01.5 and later decision tasks with dev fallback/release stop
Production-only stop: isolated in EPIC-09/release command
Before-approval owner decisions: 0
Result: READY_WITH_LIMITS
Limits: AH-01 must create/verify the control repository before import; later content/commercial/legal/integration decisions block only their declared tasks; EPIC-08 is intentionally serialized after the feature wave.
```

## 26. Revision History

### v4 — 2026-09-29 — READY_FOR_OWNER_APPROVAL

- Revision input: exact v3 findings F3-01–F3-03.
- Accepted: OD-04 minimum copied into PRD/Product Structure; OD-03/OD-07/OD-08 added as exact task gates; bounded EPIC-08 Wave-5 kickoff prevents a long-lived branch.
- Task inventory: 50 tasks, 9 terminal delivery tasks.
- Final audit input SHA-256: `B0DB27FAE7EE42996BC8A2FB5569CFA8F12646091A344F1FEEC650D4D67E69C3`.
- Final audit: PASS — logic/completeness, architecture/data/security, dependencies/autonomy and executability/evidence/delivery.
- Findings: 0 BLOCKER, 0 MAJOR; cycles: 0; undefined task refs: 0.
- Night Run Readiness: `READY_WITH_LIMITS`; all limits have explicit gates, fallback/stop conditions and independent safe work.

### v4 approval — 2026-09-29 — APPROVED

- Approver: owner.
- Approval phrase: `План утверждён`.
- Result: exact v4 is approved for AH-01, Task Manager import and authorized implementation/delivery work only.
- Production: not authorized.
- Approved source snapshot SHA-256 is recorded in the Task Manager inventory generated during AH-01.

### v3 — 2026-09-29 — REVIEW / FINAL AUDIT RERUN

- Revision input: exact v2 final audit findings F-01–F-09.
- Accepted: separate AH-01 approval bootstrap; governance-only EPIC-00; 9 terminal `.D` tasks; merged-only cross-epic dependencies; child dependency propagation disabled; early preflight moved into EPIC-01; EPIC-09 delivery lifecycle normalized; mandatory lead/legal/redirect/analytics release stops clarified.
- Resolved tooling evidence: canonical helper Doctor PASS, `bd 1.2.2`, `bd prime` exit code 0.
- Git checkout remains intentionally absent until AH-01 after exact approval.
- Final audit: rerun pending against exact v3.

### v2 — 2026-09-29 — REVIEW / FINAL AUDIT

- Revision input: owner confirmation of OD-04 and OD-06 plus explicit transition to final check.
- Accepted: first-release content minimum and `MERGE_AFTER_GATE` for EPIC-01–09.
- Owner decisions before approval: 0.
- Final audit: running against exact v2.
- Beads import/Developer handoff: not allowed until exact owner approval.

### v1 — 2026-09-29 — REVIEW

- Revision input: Task Manager Architect assembly review.
- Accepted: stable task IDs/contracts, delivery/SHA policy, early external preflights, task-level dependency softening, SEO ownership split, embedded homepage form, expanded decision register and rollback/stop conditions.
- Resolved: topic hubs excluded from first release; thank-you remains inline; technical debt status corrected.
- Needs owner: OD-04 release content minimum and OD-06 `MERGE_AFTER_GATE` policy.
- Tooling observation at v1: `bd` was not on PATH; v3 canonical helper later resolved it at the supported local path and passed Doctor/prime.
- Final audit/readiness/import: not run.

### v0 — 2026-09-29 — DRAFT

- Source: owner decisions plus competitor/SEO research and supplied technical/UI standards.
- Added: primary goal, nine implementation outcomes, dependency waves, epic contracts, owner decisions and release boundary.
- Preserved: agreed short URLs and universal-homepage model.
- Rejected: literal competitor copy; CMS/database baseline; long canonical product URLs.
- Open: niches, tariffs, legal reviewer, initial content minimum, production identity.

## 27. Approval Gate

Current version is approved. Required sequence:

```text
v4 APPROVED
-> AH-01 Git/SourceCraft control repository + approved docs checkpoint
-> inventory v2 Validate / Init / Import / Reconcile CLEAN
-> Task Manager Developer goal
```

No production action is authorized by plan approval.
