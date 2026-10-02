# Technical Completion Master Plan — ams24-next-new

Plan ID: `AMS24-TECHNICAL-COMPLETION-2026`

Version: v4

Status: APPROVED

Phase: `APPROVAL_HANDOFF`

Baseline: `origin/main@d1c5753de2bef5a6a42d88d5dbf7a9684bf7061a`

Updated: 2026-10-01

Input: owner-supplied `Технический план для Codex` plus revision packet
`Что GPT упустил` from 2026-10-01.

Approved by: owner

Approved at: `2026-10-01T17:54:09+03:00`

Approval phrase: `План утверждён`

The previous plan `AMS24-CONSTITUTION-REMEDIATION-2026 v3` is complete and
remains preserved in Git history and the closed Task Manager graph. This file
is the single canonical master-plan Markdown for the new technical-completion
program. The new program is not an upgrade of the closed graph and requires a
new inventory/import after final audit and owner approval.

## 1. Primary goal

Close the repository/runtime gaps that remained after the constitution
remediation: make the static artifact safe under Nginx, establish a reproducible
artifact/rollout contract, finish the content boundary, route real content
through the repository, remove UI and public-copy drift, and prepare the lead
form without enabling live submission.

```text
CURRENT IMPLEMENTATION
-> CONTRACT-COMPLETE
-> ARTIFACT-VERIFIED
-> BROWSER-PROVED
-> READY FOR A SEPARATE RELEASE DECISION
```

Program closeout requires P0 = 0, P1 = 0 and every remaining P2 explicitly
documented with evidence/owner. In addition, an unknown URL must return 404
under Nginx, browser proof must show zero CSP violations, the content graph must
contain no broken internal links and `out/` must contain no internal/service
phrases.

## 2. Non-goals and safety boundaries

- No production deploy, DNS, certificate issuance, live Nginx mutation or
  server access in this plan.
- Do not enable lead submission while `submissionEnabled=false` or before the
  AMS Leads API, legal text and anti-spam contract are approved.
- Do not invent cases, reviews, organization requisites, tariffs, metrics or
  evidence.
- Do not add CMS, database, ORM, auth, Docker, Redis or workers.
- Do not change the static-export platform contract.
- Do not run CI on branch push or Pull Request events. SourceCraft workflows
  remain manual and exact-head.
- Do not call repository-side Nginx/TLS/deploy artifacts production proof.
- Unknown blocks, broken internal links and duplicate canonical identities fail
  verification; they are not silently ignored.

## 3. Program model and delivery contract

The owner input requires `one task = one PR`. To keep that rule compatible
with Task Manager, headings `EPIC 0` through `EPIC 7` are program waves, while
every `Tn.m` item is imported as an atomic managed epic with:

```text
Tn.m.I implementation
Tn.m.D delivery
```

Each `Tn.m.D` creates exactly one SourceCraft PR with approved delivery mode
`MERGE_AFTER_GATE`: full diff review, risk classification, one exact-head
SourceCraft gate for `DELIVERY_PROFILE=CRITICAL`, non-force merge and safe
cleanup. Direct push to `main` is forbidden. Production is always outside the
graph.

Verification policy from the owner input:

- every implementation task: task-scope proof plus `corepack pnpm verify`
  before merge;
- T0.* and T1.*: additionally `corepack pnpm verify:release` before merge;
- a PR is created without automatically running checks;
- exact-head SourceCraft gate runs once per PR immediately before merge
  (`RISKY` for Nginx/CI/deploy/security tasks, otherwise risk-classified per
  diff);
- `CHECKED`, `PASS`, `DONE` and `COMPLIANT` require actual evidence;
- every completed task records `EXECUTION_LEDGER_V1`; final program closeout
  uses section 19.

Because the owner explicitly requires one independent PR per atomic task, the
program may need one paid exact-head SourceCraft gate per task. The exact count
is recalculated by the final audited inventory. Before the first merge, Developer
must read current CI quota. If quota is unavailable or exhausted, the affected
PR remains open with `CI NOT VERIFIED`, is not merged, and Developer continues
another independent safe task. Quota exhaustion never authorizes local-proof
substitution or switching the project from `CRITICAL`.

Common contract for every atomic `Tn.m` delivery unit:

- one task-owned branch/worktree created from current canonical `origin/main`;
- scope is limited to the named task and its explicit acceptance criteria;
- allowed actions: read, edit, task-scope tests, commit, push, PR, review,
  exact-head gate and non-force merge;
- required evidence: changed files, criterion-by-criterion acceptance,
  task-scope checks, full required pre-merge command, exact commit/push/PR/gate/
  merge SHA chain and `EXECUTION_LEDGER_V1`;
- stop on production, unknown secret/server identity, destructive/external
  action, architecture conflict, missing mandatory proof or scope expansion;
- a blocker releases the claim and must not stop independent ready work.

## 4. Source of Truth

| Scope | Canonical source |
|---|---|
| product and claims | `docs/01_PRD.md` |
| routes and information architecture | `docs/02_PRODUCT_STRUCTURE.md` |
| static/content/security/delivery boundaries | `docs/03_ARCHITECTURE.md` |
| this execution program | `docs/04_BACKLOG.md` |
| release, rollout and rollback gates | `docs/05_RELEASE_CHECKLIST.md` |
| UI system and exceptions | `docs/06_DESIGN_SYSTEM.md` |
| SEO policy | `docs/07_SEO_SYSTEM.md` |
| operator runbook after T1.6 | `docs/OPERATIONS.md` |
| supported dependency/security matrix after T7.6 | `docs/VERSION_MATRIX.md` |
| actual runtime behavior | code, configuration and tests at exact task SHA |

## 5. Verified baseline and input triage

Read-only triage against `d1c5753` found that the input describes current
drift rather than already-completed work:

- Nginx security headers live at server level while nested locations define
  `add_header`, so inheritance is incomplete; trailing-slash handling uses a
  broad `308`; HTML fallback ends in `/404.html` rather than `=404`; TLS/HSTS
  and reusable header snippets are absent.
- manual SourceCraft gates exist, but the risky gate does not run
  `verify:release`; no release-artifact workflow, deploy scripts, rollback
  scripts, contract smoke script or Playwright dependency exists.
- `RichText` remains under `core/content/services`; the block registry contains
  string component names and `schemaOnlyBlockTypes`; repository state remains
  synchronously exposed through arrays and optional site/navigation fields.
- article/knowledge `updatedAt` exists only partially; page/product contracts,
  locale+path uniqueness and sitemap `lastmod` are incomplete.
- article, knowledge and case detail routes still use representative/project
  fixtures instead of repository collections.
- `buildMetadata` has hardcoded domain/site fallbacks and root layout appends a
  brand template to already-complete titles; local content truncates titles
  with `.slice(0, 70)`.
- `SectionHeader` shares a file with `Section`; no Card/Input/Textarea/Checkbox/
  Label primitives exist; header mobile behavior and internal link ownership
  are incomplete; the lead form still has native POST attributes and a fixed
  `aria-disabled`.
- public UI still renders `static Next export` and `editorial intent`; existing
  source-level vocabulary tests do not prove the final `out/` artifact.
- Manrope declares five weights, `robots.ts` emits `host`, no default OG image
  is required by Site Settings, static compression is not part of the artifact
  contract, and staging leads share the production upstream placeholder.
- Nginx has no generated redirects, short-cache policy for unhashed public
  assets or redirect-target validation. Artifact verification hardcodes fixture
  routes, the production domain and obsolete `Host:` output.
- Current Next.js is `16.3.7`. The official 2026-09-30 release requires
  `16.3.8` for seven disclosed fixes; one critical and one high fix were
  postponed because of upstream dependency delays and require release-time
  re-evaluation.

Triage result: all input workstreams are retained, with normalization and
constraints below. `T7.5` remains external/owner-blocked until organization
facts are approved.

## 6. Shared foundations and ownership

| Contract | Owner | Freeze point | Downstream consumers |
|---|---|---|---|
| Nginx headers/routes/TLS template | `T0.*` | after T0.1–T0.5/T0.7–T0.9 | T0.6, T1.4, T1.5, T7.4 |
| artifact and rollout contract | `T1.*` | after T1.2–T1.4 | T1.5, release checklist |
| DTO/repository/product ID/path contract | `T2.*` | after T2.1–T2.5/T2.8 | T2.6–T2.7, T3.*, T5.* |
| route/content/SEO/manifest contract | `T3.*` | after T3.1–T3.7 | T0.7, T6.*, T7.2–T7.3 |
| UI primitives/tokens | `T4.1–T4.5` | before page decomposition | T4.6–T4.10, T5.* |
| lead request client contract | `T5.*` | after T5.1–T5.2 | future external enablement |

Shared-file owners are exclusive within a running task. Tasks touching
`package.json`, `.sourcecraft/ci.yaml`, `src/core/content/schemas/*`,
`src/app/layout.tsx`, `src/app/globals.css`, `ops/nginx/*` or shared primitives
run sequentially against current `origin/main`; logically independent tasks
may proceed in separate worktrees.

## 7. EPIC 0 — Nginx and security (P0)

Outcome: repository configuration serves the static artifact with deterministic
URLs, real 404 status, inherited security headers and an explicit TLS template.
All tasks are `RISKY`; production application remains out of scope.

### T0.1 — Header inheritance

- Create production and staging snippets under `ops/nginx/snippets/`.
- Put CSP, Referrer-Policy, nosniff, XFO and Permissions-Policy in the shared
  security snippet; staging additionally owns `X-Robots-Tag`.
- Every location containing `add_header` includes the applicable snippet so
  cache/header additions do not erase security headers.
- Acceptance: contract fixtures and local Nginx smoke cover `/`, `/impuls/`,
  `/_next/static/*`, an unknown route and `/404.html`, each with the required
  header set.

### T0.2 — Trailing slash

- Redirect only extensionless paths outside `/_next/`.
- Use `301` and preserve the query with `return 301 $uri/$is_args$args`.
- Files such as `/sitemap.xml`, `/robots.txt` and `/favicon.ico` must not be
  rewritten.
- Acceptance: artifact smoke proves three file URLs return `200` and
  `/impuls?utm=1` returns `301` to `/impuls/?utm=1`.

### T0.3 — Real 404

- Use `try_files $uri $uri/index.html =404;` for public routes and retain
  `error_page 404 /404.html`.
- Acceptance: unknown routes render the custom artifact with HTTP `404`.

### T0.4 — CSP compatible with static Next output

- Build `out/`, inventory every inline `<script>` and test hash stability across
  two clean builds.
- If stable, add `scripts/generate-csp-hashes.mjs` and a generated hash snippet
  validated against the exact artifact. If unstable, record an ADR permitting
  the narrowest required `script-src 'unsafe-inline'`; style policy is reviewed
  independently and not broadened automatically.
- Acceptance: browser run under Nginx reports zero CSP violations and working
  hydration/navigation for the exact artifact.
- Runtime proof may use an ephemeral local Nginx container solely for parity/
  integration testing. It must not add Docker/Compose to the product runtime,
  access production or persist credentials.

### T0.5 — TLS/HSTS repository template

- Separate port `80` redirect servers from port `443 ssl http2` application
  servers; certificate paths remain placeholders.
- Add HSTS only on HTTPS and document the precondition that the production host
  is fully HTTPS-capable before enabling it. Use the value selected in
  `OD-TC-03`; do not add `preload`.
- Acceptance: static contract tests validate both server roles and forbid real
  host paths/secrets; no live certificate or server mutation is claimed.

### T0.6 — Nginx regression guard

- Extend `verify-nginx-contract.mjs` to fail for `add_header` in a location
  without the required include, `try_files` ending in a URI fallback, and a
  trailing-slash matcher that includes files or `/_next/`; also fail when the
  redirect is not `301` or drops `$args`, when CSP lacks the selected inline-
  script strategy, or when any staging location loses `X-Robots-Tag`.
- Add a negative self-test fixture for every rule.
- Acceptance: self-tests demonstrate each mutation fails for its intended
  reason and the canonical template passes.

### T0.7 — Generated Nginx redirects

- Add `scripts/generate-nginx-redirects.mjs` to produce
  `ops/nginx/snippets/redirects.conf` from `src/project/redirects.ts`.
- Emit exact `301` rules and fail if a redirect target is absent from the
  repository-derived route manifest or if the graph loops.
- Include generation and drift verification in `verify`; generated output is
  deterministic and reviewed in Git.

### T0.8 — Staging lead isolation

- Give staging `/api/leads` the distinct placeholder
  `{{STAGING_LEADS_API_UPSTREAM}}`; production retains its own upstream.
- Contract tests forbid equal literal placeholders and ensure staging noindex
  headers remain present on the proxy response.
- Record the operator rule and safe failure behavior in `docs/OPERATIONS.md`.

### T0.9 — Public asset cache and compression policy

- Add short cache rules without `immutable` for unhashed public assets such as
  `/favicon.ico`, SVG and WebP files; hashed Next assets keep long immutable
  caching.
- Generate deterministic `.gz` files for compressible release assets and enable
  `gzip_static`/safe `gzip` types for HTML, CSS, JS, XML, text and SVG.
- Brotli remains conditional on a confirmed target Nginx module and must not be
  placed in the template speculatively.

Dependencies: T0.1/T0.2/T0.3 may start independently; T0.4 waits for T0.1;
T0.5 is independent of T0.2/T0.3 but needs OD-TC-03; T0.7 waits for T3.7;
T0.8 waits for T1.6; T0.9 waits for T1.2. T0.6 establishes the base guard after
T0.1–T0.5; T0.7–T0.9 extend that guard in their own atomic PRs, avoiding a
T0.6 -> T1.2 -> T0.9 cycle.

## 8. EPIC 1 — CI, artifact and deployment contract (P0)

Outcome: an exact SHA produces one validated static artifact, with repository-
side atomic rollout/rollback and browser smoke contracts. No production action
is performed.

### T1.1 — Risky merge gate builds the artifact

- Keep SourceCraft manual-only and exact-head; do not add push/PR triggers.
- Make `merge-risky` run `corepack pnpm verify:release`; retain
  `merge-standard` as the smaller standard proof.
- Perform SourceCraft CI quota preflight before enabling the higher-cost
  contract and record the estimate for the remaining one-task/one-PR program.
- Extend CI-policy self-tests for exact SHA, manual trigger and release proof.
- Acceptance: local policy verifier and self-test pass; cloud CI is not claimed
  until a later authorized exact-head gate actually runs.

### T1.2 — Release artifact workflow

- Add one manual exact-main release workflow: install, `verify:release`, archive
  `out/` as `release-<sha>.tar.gz`, emit checksum/manifest and upload the
  workflow artifact once.
- The workflow must not deploy or rebuild in a second stage. SourceCraft artifact
  retention is evidence/transfer, not the unresolved durable production store.
- Acceptance: policy tests prove manual/exact-main/no-deploy topology and archive
  naming/checksum contract.

### T1.3 — Atomic deploy and rollback scripts

- Add `ops/deploy/deploy.sh` and `rollback.sh` with strict mode, explicit inputs,
  checksum validation, unpack to `releases/<id>`, staged symlink, atomic
  `ln -sfn` + `mv -T`, `nginx -t`, reload and post-switch smoke.
- A failed validation/smoke restores the previous target. Scripts must not embed
  production identity, credentials or absolute owner-specific paths.
- Document operator inputs, retention, rollback and failure behavior in the
  existing architecture/release runbook sections; do not create a competing
  operations source of truth unless final audit proves a separate file is
  justified.
- Acceptance: deterministic filesystem fixture proves deploy, failed deploy and
  rollback without contacting production.

### T1.4 — Contract smoke runner

- Add `scripts/smoke.mjs` with configurable base URL and a versioned matrix of
  paths, statuses, redirects and security/cache headers covering EPIC 0.
- It must never print secrets/cookies and must distinguish transport failure from
  contract mismatch.
- Acceptance: self-test server proves positive and negative cases.

### T1.5 — Critical browser E2E under Nginx

- Add Playwright only for repeatable E2E against the built `out/` served by the
  repository Nginx fixture.
- Use an ephemeral local Nginx parity container; do not commit a second runtime
  topology or use production as the test environment.
- Cover home/navigation, real 404, trailing slash/query, mobile menu, disabled
  form behavior, accessible form error/status relationships, `error.tsx` reset
  and absence of CSP console violations.
- Acceptance: repeatable local command stores concise artifacts on failure and
  passes against the exact release artifact; no live production proof claimed.

### T1.6 — Canonical operations runbook

- Create `docs/OPERATIONS.md` because Nginx/TLS, staging isolation, artifact
  transfer, atomic rollout, rollback, retention and smoke now form an
  independently complex operator contract.
- Keep values parameterized: no real server identity, certificate path, secret,
  deployment claim or competing architecture decisions.
- Link Architecture and Release Checklist to the runbook instead of duplicating
  procedures.

Dependencies: T1.1 and T1.2 depend on T0.6; T1.3 can begin from the existing
rollout contract; T1.4 depends on T0.1–T0.5; T1.5 depends on T1.4 and T4.9/T5.2
for final UI scenarios. T1.6 may start independently and is required by T0.8.

## 9. EPIC 2 — Static Core content contract (P1)

Outcome: Zod DTOs, repository and UI renderer boundaries are singular,
asynchronous at the service contract, and fail closed for invalid content.

### T2.1 — RichText DTO and renderer ownership

- Define `RichTextDTO` as `{ format: 'markdown'; value: string } |`
  `{ format: 'lexical'; value: unknown }` with Zod as source of truth.
- Move `<RichText />` to `src/ui/content/`; core owns data contracts, not React.
- Markdown remains the only currently reachable format; lexical input fails the
  build with an explicit unsupported-renderer error until Payload exists.
- Markdown list keys are structural/index-based rather than derived from
  duplicate line text. Internal links use `next/link`; external links add
  `rel="noopener"`; malformed/unsupported link schemes fail content validation
  instead of degrading to `#`.

### T2.2 — Executable block registry

- Rename the discriminator from `type` to `blockType` across schemas/content.
- Implement one registry `blockType -> schema -> React component` under
  `src/ui/blocks/`; remove string component names and
  `schemaOnlyBlockTypes`.
- Implement the rich-text block through the moved renderer or remove it from the
  reachable page union; unknown/unimplemented blocks fail build validation.

### T2.3 — Entity identity, publication state and timestamps

- Add `slug` and `updatedAt` to page and product DTOs/content; require
  `updatedAt` on sitemap-eligible entities.
- Product/page publication states become `published | hidden`.
- Retain `draft` for editorial entities through an ADR because unpublished
  article/knowledge workflows are already intentional; drafts stay noindex and
  outside generated routes.
- Enforce uniqueness by `(locale, path)` and add sitemap `lastmod`.

### T2.4 — Async repository API

- Replace raw array exposure with async methods: `getPages`, `getPageByPath`,
  `getArticles`, `getArticleByPath`, `getSiteSettings`, `getNavigation` plus
  product/knowledge methods actually required by routes.
- Make Site Settings and Navigation required validated inputs.
- Local adapter may remain in-memory but must satisfy the same async contract a
  future adapter would implement.
- Remove `requireRepositoryField`, non-null route assertions and public raw-array
  access once all callers use the async methods.

### T2.5 — Canonical product ID

- Rename/establish one exported `productIdSchema` and derived `ProductId` type.
- Use it in entity schemas, lead request contract, analytics and editorial
  briefs; remove copied literal unions.

### T2.6 — Remove compatibility shims and relocate project contracts

- Remove shim re-exports from `core/content/services/*`.
- Move lead transport/request contracts to `src/core/leads/` and analytics
  contracts to `src/core/analytics/`.
- Move skeletons, fixtures and legal data into `src/project/content/` and expose
  them only through content services/repository DTOs.

### T2.7 — Legal UI receives DTOs

- `src/ui/legal/legal-page.tsx` accepts a legal-page DTO and contains no project
  data, draft version or metadata builder.
- Routes/services own metadata and content lookup.

### T2.8 — Canonical path normalization

- Establish one `normalizePath` under `src/core/lib/path.ts` and reuse it in
  schemas, repository adapters, redirects and route-manifest generation.
- Canonical paths retain leading/trailing slashes, preserve `/`, reject unsafe
  or ambiguous forms and have table-driven tests.
- Remove all project-local copies after consumers migrate.

Dependencies: T2.1/T2.3/T2.5 can start independently; T2.2 waits for T2.1;
T2.4 waits for T2.3/T2.5 contract freeze; T2.8 is independent; T2.6 waits for
T2.4/T2.8; T2.7 waits for T2.4/T2.6.

## 10. EPIC 3 — Routes backed by canonical content (P1)

Outcome: detail routes, metadata, sitemap and internal links derive from the
repository and Site Settings without fixtures or hardcoded production values.

### T3.1 — Article route

- Generate `/stati/[slug]/` params and DTO lookup from the repository.
- Remove `representativeArticleContract` and duplicated route data from project
  fixtures; the editorial template renders public DTO fields only.

### T3.2 — Knowledge route

- Generate `/baza-znaniy/[product]/[slug]/` from the repository.
- Resolve the current `kak-podgotovit-raschet` vs
  `kak-podgotovit-raschet-impuls` drift to one canonical slug and redirect only
  if an already-public URL requires compatibility.

### T3.3 — Remove the unsupported case detail route

- Remove `/keisy/[slug]/` until evidence-backed cases exist.
- Retain the noindex `/keisy/` hub and hidden evidence inventory.
- Do not fabricate a case merely to keep the route. A future detail route needs
  canonical content, permission/evidence state and a separate planned change.

### T3.4 — Markdown internal-link graph

- Parse internal links from every Markdown body and content entity, including
  hidden/draft entities, and validate them against all generated `(locale,
  path)` identities plus explicit redirects.
- Negative fixtures include current broken `/baza-znaniy/*/…` links.

### T3.5 — Site Settings for metadata and structured data

- `buildMetadata` and structured-data builders require Site Settings domain,
  siteName and defaults; remove hardcoded `https://ams24.ru`/`Импульс`
  fallbacks and `getPageByPath('/')!` assumptions.
- Missing canonical settings/page data fails the build with a useful error.

### T3.6 — Title policy

- Store the complete final title in `seo.title`, remove the root `%s | Импульс`
  template and keep the Zod max-length validation as the only length guard.
- Remove `.slice(0, 70)`; invalid generated titles fail content validation.

### T3.7 — Repository-derived route artifact manifest

- During build verification, write `out/.ams-routes.json` (or an equivalent
  generated artifact) from the repository, containing expected index/noindex
  routes, canonical URL, locale and expected H1 policy.
- Refactor `verify-static-artifact.mjs` to consume the manifest and Site
  Settings; remove fixture route, production-domain and `Host:` hardcoding.
- Artifact verification fails for missing/extra canonical routes, canonical
  mismatch and any HTML page with other than exactly one `<h1>`.

Dependencies: T3.7 depends on T2.4/T2.8; T3.1/T3.2/T3.3/T3.4 depend on
T2.4/T2.6/T3.7 as applicable; T3.5 depends on required Site Settings from T2.4;
T3.6 depends on T3.5.

## 11. EPIC 4 — UI foundation and drift (P1)

Outcome: the public UI consistently uses semantic typography/tokens, owned
primitives, accessible headings/navigation and composition-only route files.

### T4.1 — Tailwind merge typography roles

- Configure `extendTailwindMerge` so `display`, `h1`–`h4`, `body*`, `label` and
  `caption` are recognized as font-size roles without conflicting with color.
- Unit proof: `cn('text-h3', 'text-foreground')` retains both classes;
  `cn('text-body', 'text-h2')` keeps only `text-h2`; Button plus
  `className="text-body-sm"` retains its semantic foreground color.

### T4.2 — SectionHeader ownership

- Split `section.tsx` and `section-header.tsx`.
- Build all tone/role classes through `cn`; no branch may emit two competing
  text-color classes.

### T4.3 — Card primitive

- Add project-owned shadcn Card primitives with `default | muted | dark`
  variants.
- Replace repeated `rounded-card border ... shadow-card` structures where
  semantics match; document intentional exceptions.

### T4.4 — CTA primitive reuse

- Convert footer CTA, mobile-menu CTA and every CTA in `error.tsx` and
  `not-found.tsx` to `Button`/`Button asChild` variants with `next/link` for
  internal navigation.

### T4.5 — Form primitives

- Add project-owned shadcn Input, Textarea, Checkbox and Label.
- Migrate LeadForm to them; dark presentation is a controlled variant rather
  than repeated ad-hoc classes.

### T4.6 — Page decomposition and shared sections

- Move route sections to `src/ui/pages/<page>/*-section.tsx` and content arrays
  to the project content layer.
- Reuse/variant shared Hero, Steps, FAQ and LeadSection across `/impuls/`,
  `/pixel/` and `/zashchita/` where their contract is genuinely the same.
- Route `page.tsx` files remain composition and route metadata only.

### T4.7 — Heading hierarchy

- Enforce one logical `h1` per route.
- Card titles use the correct semantic heading (normally `h3`) independently of
  visual class; remove the duplicate `h2` between LeadSection and form.
- Extend the repository-derived artifact guard to require exactly one `<h1>` on
  every HTML page.

### T4.8 — Token cleanup

- Keep `text-display` only if explicitly recorded as an AMS Northline semantic
  role; otherwise replace and remove it.
- Remove confirmed dead aliases/aspect/status tokens and arbitrary
  `tracking-[-0.03em]`; do not remove warning/success tokens if form state work
  in EPIC 5 makes them reachable.
- Explicitly inventory `text-display`, `--font-display`, `aspect-card`,
  `aspect-hero`, `success`, `warning`, `shadow-panel`, `radius-pill` and
  `ease-*`; each is either used, removed, or recorded as reserved with a named
  future owner in the Design System.

### T4.9 — Header behavior and internal links

- Hide the `<details>` marker in Safari.
- Implement the smallest client leaf that closes the mobile menu on Escape,
  internal-link activation (including same-page anchors) and outside click, and
  exposes the true state through `aria-expanded`.
- Use `next/link` for every internal header link.

### T4.10 — Design System records

- Complete the Shared Patterns table and Approved Exceptions register in
  `docs/06_DESIGN_SYSTEM.md` using actual post-remediation evidence.
- After T4.1–T4.9 run a new read-only UI drift audit and record its artifacts;
  unresolved P0/P1 findings block this task.

### T4.11 — Breadcrumb layout ownership

- Wrap Breadcrumbs in the canonical `Container` primitive and remove duplicated
  `mx-auto`, max-width and horizontal-padding utilities.
- Preserve semantic navigation/aria behavior and verify alignment at project
  breakpoints.

### T4.12 — Internal link component consistency

- Use `next/link` for internal links in header, footer, breadcrumbs and public
  content renderers; external links remain ordinary anchors with safe rel.
- Add a focused source/renderer regression check so new internal raw anchors do
  not reappear.

Dependencies: T4.1/T4.2/T4.3/T4.4/T4.5 may start with shared-file sequencing;
T4.6 depends on T4.2–T4.5; T4.7/T4.8/T4.9 can proceed after relevant primitive
contracts freeze; T4.11 may start after the Container contract is confirmed;
T4.12 depends on T2.1/T4.9/T4.11; T4.10 waits for all earlier T4 tasks.

## 12. EPIC 5 — Lead form readiness while submission is disabled (P1)

Outcome: one client leaf implements the future JSON request contract and all
accessible UI states, while `submissionEnabled=false` guarantees no network
submission.

### T5.1 — LeadFormClient state machine

- Add a client leaf that, only when enabled, POSTs JSON to relative
  `/api/leads` with `Idempotency-Key` and consent
  `{ accepted, version, acceptedAt }`.
- Implement default, validation error, submitting, server error and success;
  fields expose `aria-invalid`/`aria-describedby` and form status uses an
  appropriate `role="status"`/`aria-live` contract.
- Add honeypot and a minimum-fill-time signal. Do not claim server-side
  anti-spam enforcement in this static repository.
- With `submissionEnabled=false`, controls remain intentionally disabled and no
  fetch/native submission can occur.

### T5.2 — Remove unsafe native form fallback

- Remove fixed `aria-disabled="true"`; derive accessibility state from actual
  disabled/submitting state.
- Remove native `action` and `method`, which would send URL-encoded data and
  violate the JSON contract.

### T5.3 — Analytics ownership

- Remove `data-analytics-*` attributes from reusable `LeadForm`; the project/app
  integration layer owns event dispatch and reusable form UI imports no
  analytics adapter.
- Acceptance: contract tests prove event names/payload contain no PII and only
  enabled lifecycle transitions dispatch submission events.

Dependencies: T5.1 depends on T2.5/T2.6 and T4.5; T5.2 is delivered with or
after T5.1; T5.3 depends on the stable state/event contract from T5.1.

## 13. EPIC 6 — Public copy hygiene (P1)

Outcome: the final static artifact contains no internal implementation,
editorial or evidence-management language.

### T6.1 — Artifact vocabulary guard

- Remove customer-visible internal/meta phrases, including current
  `static Next export` and `editorial intent`.
- Add `scripts/verify-public-copy.mjs` to scan rendered text, `<title>` and
  `<meta>` values in `out/` for a maintained forbidden phrase list (`skeleton`,
  `Representative`, `Target commercial page`, `editorial intent`, `Next
  export`, future-form wording and verified project-specific markers).
- Wire it into `verify:release`; allowlisting is limited to documented false
  positives outside rendered public copy. If meaningful replacement copy is
  unavailable, remove the placeholder or record `REQUIRES_OWNER_DECISION` in
  Task Manager—never render that marker publicly.

### T6.2 — Editorial template boundary

- Public templates must not render outline, `sourceLedger`,
  `targetCommercialPage`, `readerQuestion`, `sectionJob` or other editorial
  control fields.
- Editorial evidence may remain in project/research data but must be mapped to a
  public DTO before rendering.

### T6.3 — Homepage trust facts

- Route homepage trust facts through the same claims/publication gate used by
  `/impuls/`; unsupported facts remain absent rather than marked in UI.

Dependencies: T6.1/T6.2 depend on T3.1/T3.2; T6.3 depends on T2.4/T2.6. Final
artifact proof waits for T4/T5 route rendering changes.

## 14. EPIC 7 — Performance, SEO and version security (P2/RISKY)

Outcome: the artifact avoids avoidable font payload, deprecated robots output
and missing default social policy, proves key-page performance, and maintains a
version/security decision trail without inventing organization facts.

### T7.1 — Variable Manrope

- Configure Manrope without a weight list so Next emits the variable font
  artifact; verify Cyrillic coverage and compare emitted font files.

### T7.2 — Remove robots host

- Remove `host` from `robots.ts` and artifact guards; retain canonical sitemap
  from Site Settings.

### T7.3 — Default OG image

- Add a required/default OG image to Site Settings and use it when page SEO has
  no override; validate artifact references.

### T7.4 — Nginx performance proof

- Run throttled mobile Lighthouse for `/` and `/impuls/` under the repository
  Nginx parity fixture with production-equivalent headers before and after
  T7.1/T0.9.
- Record comparable artifacts and require LCP <= 2.5s and CLS <= 0.1, or create
  an explicit evidence-backed remediation/blocker rather than marking PASS.

### T7.5 — Organization structured data

- Status: `needs-owner`, external evidence gate.
- Implement Organization JSON-LD only after legal name, URL, logo and approved
  contact/requisite fields are recorded in canonical content. Until then the
  builder emits no Organization entity and this task does not enter the safe
  Developer ready queue.

### T7.6 — Next.js patch and version/security matrix

- Create `docs/VERSION_MATRIX.md` with installed/target versions, official
  source links, review date, applicability and unresolved advisory status.
- Upgrade Next.js `16.3.7 -> 16.3.8` as a RISKY patch task and run the required
  exact-version build/verify/browser evidence; do not combine unrelated package
  upgrades.
- Record that the 2026-09-30 official release fixes seven disclosed issues and
  that fixes for one critical and one high issue were postponed because of
  upstream dependency delays. Before any production release, re-check the
  official Next.js blog and GitHub advisories and update to the latest safe
  compatible patch if a superseding fix exists.

Dependencies: T7.1/T7.2/T7.6 are independent; T7.3 depends on T3.5; T7.4
depends on T0.9/T1.5/T7.1; T7.5 depends on approved owner evidence and does not
block T7.1–T7.4/T7.6.

## 15. Preliminary dependency map and waves

| Wave | Ready scope | Blocking boundary |
|---|---|---|
| W0 | T0.1, T0.2, T0.3, T1.3, T1.6, T2.1, T2.3, T2.5, T2.8, T4.1–T4.5, T4.11, T7.1, T7.2, T7.6 | shared-file sequencing and OD-TC-03 for T0.5 |
| W1 | T0.4, T0.5, T0.6, T0.8, T1.1, T1.2, T1.4, T2.2, T2.4, T3.5, T3.7, T4.6–T4.9, T7.3 | foundation contracts |
| W2 | T0.7, T0.9, T2.6, T2.7, T3.1–T3.4, T3.6, T4.12, T5.1–T5.3, T6.3 | repository/routes/UI contracts |
| W3 | T1.5, T4.10, T6.1, T6.2, T7.4 | integrated artifact/browser proof |
| owner/external | T7.5 evidence | does not block independent work |

Critical path:

```text
T2.1/T2.3/T2.5/T2.8 -> T2.4 -> T2.6/T3.7 -> T3.1/T3.2/T3.4
-> T6.1/T6.2 -> integrated artifact proof
```

Infrastructure path:

```text
T0.1–T0.5 -> T0.6 -> T1.1/T1.2/T1.4 -> T0.9/T1.5 -> T7.4
```

No dependency in this preliminary map authorizes production. Final cycle,
coverage and minimum-blocking validation belongs to the explicit final audit.

## 16. Owner Decision Register

### OD-TC-01 — Delivery mode

- Question: after exact-head review/gate, may Task Manager merge each task PR
  automatically?
- Options: `PR_ONLY` or `MERGE_AFTER_GATE`.
- Recommendation: `MERGE_AFTER_GATE`, matching the owner requirement to verify
  before merge and keeping the long program autonomous.
- Deadline: before approval.
- Status: DECIDED on 2026-10-01.
- Decision: `MERGE_AFTER_GATE` for every `Tn.m.D`.

### OD-TC-02 — Case detail route

- Question: remove `/keisy/[slug]/` until evidence-backed cases exist, or keep
  the route blocked while the owner supplies canonical case content?
- Recommendation: remove the detail route now, keep `/keisy/` noindex and add it
  back only with approved evidence.
- Blocks: T3.3 only.
- Deadline: before approval.
- Status: DECIDED on 2026-10-01.
- Decision: remove `/keisy/[slug]/`, retain the noindex hub and hidden evidence
  inventory until approved cases exist.

### OD-TC-03 — HSTS duration

- Question: which HSTS value should the repository TLS template use after the
  release operator confirms complete HTTPS coverage?
- Options: `max-age=31536000` without `includeSubDomains`/`preload`, or a shorter
  staged value defined by the owner.
- Recommendation: `max-age=31536000` without `includeSubDomains` and without
  `preload`; this protects the canonical host without making unverified
  subdomains or the browser preload list part of the rollout.
- Blocks: T0.5 only.
- Deadline: before approval.
- Status: DECIDED on 2026-10-01.
- Decision: `max-age=31536000` without `includeSubDomains` and without
  `preload`; enable only after release preflight proves the canonical host is
  fully HTTPS-capable.

## 17. Revision packet and triage

Revision input ID: `RI-TC-2026-10-01-01`

Source: owner-supplied technical plan.

Accepted:

- all eight workstreams and the one-task/one-PR intent;
- Nginx inheritance/redirect/404/CSP/TLS/regression work;
- manual CI, artifact, atomic rollout/rollback, smoke and browser E2E;
- content DTO/repository/block/route boundary completion;
- UI primitives, decomposition, headings, tokens and navigation behavior;
- disabled-safe lead client, public-copy artifact guard and P2 SEO/performance;
- final closeout report based on actual proof.

Normalized:

- `EPIC 0–7` are waves; each `T*` is an atomic managed epic so one task can
  have one delivery PR without violating the Task Manager delivery contract;
- `OPERATIONS.md` was initially deferred because Architecture and Release
  Checklist owned the runbook; RI-TC-2026-10-01-03 later proved the scope
  independently complex and superseded this choice with T1.6;
- release workflow stays manual/exact-main and does not deploy;
- `draft` is retained for editorial entities through an ADR rather than removed
  globally;
- title policy is resolved to complete validated titles without a layout suffix;
- analytics attributes were initially treated as the reusable UI contract;
  RI-TC-2026-10-01-03 superseded this choice: T5.3 removes them from reusable UI
  and keeps dispatch project-owned;
- Brotli is conditional on confirmed Nginx module support.

Already covered but retained as regression/extension:

- SourceCraft manual exact-head topology, static artifact guard, sitemap/robots
  routes, claims register and source-level public vocabulary tests already
  exist; the new tasks strengthen them rather than duplicate them.

Rejected:

- automatic branch/PR CI triggers;
- production rollout inside implementation;
- inventing cases or Organization JSON-LD facts;
- treating SourceCraft's temporary artifact as the durable production store;
- claiming live TLS/CSP/Nginx proof from repository-only tests.

Needs owner: none. `OD-TC-01` and `OD-TC-02` were resolved in the v2 assembly
round.

Sections changed: complete replacement of the closed-plan snapshot in the
canonical backlog; previous exact text remains recoverable in Git history.

Resulting version: `v2 REVIEW` after the owner-decision packet below.

Revision input ID: `RI-TC-2026-10-01-02`

Source: owner.

Accepted decisions:

- `OD-TC-01`: every delivery task uses `MERGE_AFTER_GATE`.
- `OD-TC-02`: remove `/keisy/[slug]/` until evidence-backed cases are approved.

Conflicts resolved:

- the default `PR_ONLY` fallback is removed from the active contract;
- T3.3 no longer contains a runtime branch or owner blocker.

Sections changed: delivery contract, T3.3, Owner Decision Register, assembly
status, revision history and next action.

Resulting version: `v2 REVIEW`.

Revision input ID: `RI-TC-2026-10-01-03`

Source: owner-supplied `Что GPT упустил` audit/addendum against `main@d1c5753`.

Triage:

| Input | Disposition | Canonical task/result |
|---|---|---|
| N1–N5 soft-404, 301/query, CSP, TLS/HSTS, staging noindex | ALREADY COVERED / EXPANDED | T0.1–T0.6; OD-TC-03 added |
| N6 generated production redirects | ACCEPTED | T0.7 |
| N7 staging leads isolation | ACCEPTED | T0.8 + T1.6 |
| N8 cache/compression | ACCEPTED | T0.9; replaces old compression-only scope |
| N9 negative Nginx guard cases | ACCEPTED | T0.6 plus task-local extensions |
| `cn()` typography and Button regressions | ALREADY COVERED / EXPANDED | T4.1 |
| dead token inventory | ALREADY COVERED / EXPANDED | T4.8 |
| RichText shape/renderer/link failure behavior | ALREADY COVERED / EXPANDED | T2.1 |
| `blockType`, canonical product ID, async repository | ALREADY COVERED / EXPANDED | T2.2/T2.4/T2.5 |
| canonical `normalizePath` | ACCEPTED | T2.8 |
| metadata/title/robots | ALREADY COVERED / EXPANDED | T3.5/T3.6/T7.2 |
| repository-derived artifact manifest/H1 guard | ACCEPTED | T3.7/T4.7 |
| Markdown links including hidden entities | ALREADY COVERED / EXPANDED | T3.4 |
| public-copy artifact scan and editorial fields | ALREADY COVERED / EXPANDED | T6.1/T6.2 |
| trust facts through claims register | ALREADY COVERED | T6.3 |
| error/not-found buttons, breadcrumbs, all internal links | ACCEPTED / EXPANDED | T4.4/T4.11/T4.12 |
| mobile menu behavior and client boundary | ALREADY COVERED / EXPANDED | T4.9 |
| LeadForm disabled/accessibility/analytics boundary | ACCEPTED / EXPANDED | T5.1–T5.3; reusable data attributes removed |
| variable Manrope and mobile Lighthouse | ACCEPTED / EXPANDED | T7.1/T7.4 |
| Next.js 16.3.8 and deferred upstream fixes | ACCEPTED, OFFICIALLY VERIFIED | T7.6 |
| `OPERATIONS.md` | ACCEPTED | independently complex operator contract, T1.6 |
| `VERSION_MATRIX.md` | ACCEPTED | dependency/security lifecycle, T7.6 |
| `PROJECT.md` | REJECTED | duplicates `docs/README.md`, PRD and Architecture under AMS Product Development Standard |

Official verification on 2026-10-01: the Next.js 2026-09-30 security release
requires 16.3.8 and lists seven fixed vulnerabilities; it explicitly states
that one critical and one high fix were postponed because of upstream delays.
The plan therefore requires both the immediate patch and a new official-source
check before production.

New owner decision: OD-TC-03 only. All other additions have deterministic
architecture-safe handling; missing replacement marketing copy becomes a
task-local owner blocker and is never emitted to public HTML.

Resulting version: `v4 REVIEW / ASSEMBLY`. The prior v3 final-audit result and
draft inventory are invalidated until OD-TC-03 is resolved and the owner again
requests final verification.

## 18. Final audit

Exact audited snapshot: `v4 APPROVED`. Audit transition and OD-TC-03 were
explicitly authorized by the owner on 2026-10-01.

### Master Plan Map

```text
Primary goal: technical completion of static artifact, content, routes, UI and lead readiness
Non-goals: production, live submission, invented evidence, platform migration
Program waves: 8
Atomic managed epics / PRs: 54 (T0.1–T7.6)
Implementation/delivery tasks: 108
Shared foundations: Nginx, artifact/operations, DTO/repository/path, route manifest, UI primitives, lead request
Data/schema changes: static Zod/content only; no database or migration
External integrations: SourceCraft quota; disabled AMS Leads API; later Nginx/TLS/Brotli/server release preflights
Security-sensitive areas: CSP, headers, TLS/HSTS, CI/deploy, dependency patch, lead PII contract
Owner decisions before approval: 0
Later owner/evidence gates: T7.5 organization facts
Production-only unknowns: server identity, certificate paths, durable artifact destination
```

### Finding Register

| ID | Severity | Finding | Resolution | Status |
|---|---|---|---|---|
| FA4-001 | BLOCKER | HSTS duration was open before approval | owner accepted OD-TC-03: one year, no subdomains/preload, HTTPS preflight | RESOLVED |
| FA4-002 | BLOCKER | v3 inventory no longer represented the expanded plan | stale inventory removed; fresh v4 schema-v2 inventory generated from exact snapshot | RESOLVED |
| FA4-003 | MAJOR | making T0.6 wait for T0.9 would create `T0.6 -> T1.2 -> T0.9 -> T0.6` | T0.6 freezes the base guard; T0.7–T0.9 extend it in their own PRs | RESOLVED |
| FA4-004 | MAJOR | redirect generation needs canonical target identities unavailable in the old hardcoded guard | T3.7 freezes the repository route manifest; only T0.7 waits for that exact contract | RESOLVED |
| FA4-005 | MAJOR | current 16.3.7 lacks the seven 16.3.8 fixes and two upstream fixes remain deferred | RISKY T7.6 performs the patch; production preflight rechecks official blog/advisories | RESOLVED |
| FA4-006 | MAJOR | `OPERATIONS.md` changes the earlier no-runbook ownership decision | T1.6 performs one explicit ownership migration and links Architecture/Release Checklist instead of duplicating them | RESOLVED |
| FA4-007 | MAJOR | organization JSON-LD needs unavailable legal facts | isolated OWNER/EXTERNAL decision blocks only T7.5; omission is the safe fallback | RESOLVED |
| FA4-008 | MINOR | requested `PROJECT.md` would create a competing project source | rejected; existing README/PRD/Architecture remain canonical | RESOLVED |

### Pass 1 — Logic / Completeness

- PASS: all 24 correction findings and N1–N9/T11–T18 additions map to named
  atomic units, explicit extensions or documented rejection; no requested
  runtime outcome is orphaned.
- PASS: 54 atomic units remain within the primary goal; release/production,
  live lead enablement and invented evidence remain excluded.
- PASS: final criteria are measurable: P0/P1 zero, P2 documented, real 404,
  zero browser CSP violations, no broken internal links and no service phrases
  in `out/`.

### Pass 2 — Architecture / Data / Security

- PASS: Static Site Core and Page -> Content Service -> Repository -> Local
  Adapter direction remain intact; React renderers and project data do not move
  into core.
- PASS: schema/path/repository/route-manifest ownership is singular; generated
  redirects and artifact verification consume the same canonical identities.
- PASS: lead submission stays disabled, reusable UI owns no analytics adapter or
  PII event attributes, and no secret/server identity enters the repository.
- PASS: CSP, TLS/HSTS, Nginx, dependency patch and rollout tasks are RISKY and
  cannot claim production proof from repository fixtures.
- PASS: `OPERATIONS.md` and `VERSION_MATRIX.md` are justified optional sources;
  T1.6/T7.6 update links/ownership rather than creating competing canon.

### Pass 3 — Dependencies / Autonomy

- Cycles: 0 in the validated v4 draft inventory.
- Critical content path: T2.1/T2.3/T2.5/T2.8 -> T2.4 -> T2.6/T3.7 ->
  T3.1/T3.2/T3.4 -> T6.1/T6.2 -> integrated artifact proof.
- Infrastructure path: T0.1–T0.5 -> T0.6 -> T1.1/T1.2/T1.4 ->
  T0.9/T1.5 -> T7.4. T0.7 alone waits for the route manifest.
- Parent dependency propagation is disabled where exact task-to-delivery edges
  are safer; this avoids unsupported task-to-epic edges and minimizes blocking.
- Shared Nginx/schema/global UI/package files retain exclusive ownership and
  current-main sequencing; independent waves remain available if one task is
  blocked.
- T7.5 is the only later OWNER/EXTERNAL gate and cannot stop other tasks.

### Pass 4 — Executability / Evidence / Delivery

- PASS: all 54 epics have an observable scope, acceptance derived from their
  canonical T-section, implementation task, terminal delivery task and exact
  `MERGE_AFTER_GATE` contract.
- PASS: inventory contains 108 child tasks; delivery depends on its sibling
  implementation and every required upstream delivery boundary.
- PASS: every implementation requires task-scope proof plus `corepack pnpm
  verify`; T0/T1 add `verify:release`; browser/artifact/Lighthouse/rollout proof
  is required where the promise reaches those surfaces.
- PASS: SourceCraft quota has preflight, open-PR fallback and stop condition;
  no local evidence may be mislabeled as a green cloud gate.
- PASS: exact-head review/gate/merge evidence and `EXECUTION_LEDGER_V1` are
  mandatory; new commits invalidate affected evidence.

### Dependency taxonomy

| Boundary | Type | Minimum blocking scope | Fallback |
|---|---|---|---|
| Nginx foundations -> guard/smoke/E2E | HARD | exact consuming implementation | continue content/UI/version waves |
| repository/path -> route manifest/routes | CONTRACT/HARD | provider delivery boundary | continue Nginx/UI waves |
| route manifest -> generated redirects/artifact guard | CONTRACT | T0.7/T3 route consumers only | other Nginx tasks continue |
| UI primitives -> page/form composition | CONTRACT | consuming implementation only | continue content/infra waves |
| SourceCraft quota -> each merge | EXTERNAL | delivery task only | keep PR open and continue independent ready work |
| organization facts -> T7.5 | OWNER/EXTERNAL | T7.5 only | omit Organization JSON-LD |
| deferred upstream Next fixes -> production | EXTERNAL/PRODUCTION | T7.6 release recheck only | no production until safe patch decision |
| server/TLS/artifact-store identity -> rollout | PRODUCTION | separate release only | implementation graph still completes |

### Master Plan Audit Scorecard

```text
Logic/completeness: blockers 0; major 0
Architecture/data/security: blockers 0; major 0
Dependency/autonomy: cycles 0; exact hard boundaries; independent waves 4
Executability/evidence: 54/54 epics; 108/108 implementation/delivery tasks
Owner decisions before approval: 0
Later owner/evidence gates: 1 (T7.5 only)
Night Run Readiness: READY_WITH_LIMITS
```

### Night Run Readiness

`READY_WITH_LIMITS`:

- safe ready work exists across Nginx, operations, content, UI and dependency
  security from the first wave;
- the one-task/one-PR policy necessarily serializes merges touching shared files;
- SourceCraft quota can pause a delivery but not another implementation/PR;
- T7.5 may remain blocked while all independent work continues;
- production identity, certificates, durable artifact destination and deferred
  upstream fixes are release-only gates, not implementation prerequisites.

Result: `APPROVED` after owner confirmation on 2026-10-01.

Task Manager import: AUTHORIZED for this exact snapshot; still requires clean
Validate/Init/Import/Reconcile evidence.

Developer handoff: NOT ALLOWED until approved inventory reconciles cleanly.

Production: NOT AUTHORIZED.

## 19. Required closeout report

```text
BASELINE SHA:
FINAL MAIN SHA:
TASKS COMPLETED:
PRS CREATED:
PRS MERGED:
DOCS CHANGED:
NGINX CONTRACT:
TLS/HSTS TEMPLATE:
CSP BROWSER PROOF:
ARTIFACT:
ROLLBACK FIXTURE:
CONTENT CONTRACT:
ROUTES:
UI DRIFT:
LEAD FORM:
PUBLIC COPY:
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

## 20. Revision history

### v4 — 2026-10-01 — APPROVED / FINAL AUDIT + HANDOFF

- Integrated revision packet `RI-TC-2026-10-01-03` against the same immutable
  baseline and expanded the preliminary program from 45 to 54 atomic PR units.
- Added generated Nginx redirects, staging lead isolation, public cache policy,
  an operations runbook, canonical path normalization, repository-derived route
  manifest, breadcrumb/link consistency and Next.js version/security lifecycle.
- Expanded CSP/Nginx guards, RichText links, repository cleanup, token tests,
  form accessibility/analytics ownership, public-copy proof and Lighthouse.
- Accepted `OPERATIONS.md` and `VERSION_MATRIX.md`; rejected redundant
  `PROJECT.md`.
- Invalidated the v3 audit/inventory, then accepted OD-TC-03 and ran a fresh
  four-pass final audit on exact v4.
- Built a 54-epic / 108-task schema-v2 draft inventory with zero dependency
  cycles and full declared coverage.
- Result: `READY_FOR_OWNER_APPROVAL`; import, Developer handoff, merge and
  production were not performed.
- Owner approved exact v4 with `План утверждён` on 2026-10-01. Status changed to
  `APPROVED`; Task Manager import and Developer handoff are authorized after
  clean reconciliation. Production remains unauthorized.

### v3 — 2026-10-01 — REVIEW / FINAL AUDIT PASS

- Completed four final audit passes on the exact v2 assembly basis.
- Resolved six findings: atomic delivery modeling, CI quota, Nginx parity,
  isolated organization evidence, shared-file sequencing and P2 stable IDs.
- Built an exact 45-epic / 90-task draft inventory with zero cycles and full
  declared coverage.
- Night Run Readiness: `READY_WITH_LIMITS`; limitations are explicit and do not
  block safe independent work.
- Result: `READY_FOR_OWNER_APPROVAL`; no import or Developer handoff yet.

### v2 — 2026-10-01 — REVIEW / OWNER DECISIONS

- Owner accepted architect recommendations `OD-TC-01` and `OD-TC-02`.
- Fixed all task delivery to `MERGE_AFTER_GATE` with exact-head review/gate and
  non-force merge; production remains excluded.
- Fixed T3.3 to remove the unsupported case detail route while preserving the
  noindex hub and hidden evidence inventory.
- Before-approval owner decisions are now zero.
- Final four-pass audit has not run.

### v1 — 2026-10-01 — REVIEW / FIRST ASSEMBLY

- Established a distinct Plan ID on exact `origin/main@d1c5753` after the
  previous graph was proven closed and clean.
- Triaged the owner input against repository evidence and retained all material
  workstreams with safety and ownership corrections.
- Converted the one-task/one-PR requirement into 45 atomic delivery units under
  eight program waves.
- Added shared ownership, preliminary dependencies, independent waves, two
  front-loaded owner decisions and explicit non-production boundaries.
- Final four-pass audit, inventory creation and Task Manager import have not run.

### v0 — 2026-10-01 — DRAFT / OWNER INPUT

- Basis: owner-supplied `Технический план для Codex`.
- Original structure: EPIC 0–7 with T0.1–T6.3 plus five unnumbered P2 items.
- Initial instruction: one task/one PR; `pnpm verify` before merge and
  `pnpm verify:release` for EPIC 0–1; no unverified `CHECKED` claims.

## 21. Next assembly action

The exact v4 snapshot is approved. Validate, import and reconcile the derived
Task Manager inventory, then hand off the clean graph to Developer through one
long-lived goal. Production remains a separate explicit command.
