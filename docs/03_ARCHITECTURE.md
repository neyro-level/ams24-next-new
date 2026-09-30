# Architecture — ams24-next-new

Status: Active  
Version: 1.0  
Updated: 2026-09-30

## 1. Project Identity

```text
Repository: ams24-next-new
Domain: https://ams24.ru/
PROJECT_CLASS: COMMERCIAL
DELIVERY_PROFILE: CRITICAL
Repository mode: SOURCECRAFT_PRIMARY_GITHUB_MIRROR
Platform contract: AMS Static Site Core Standard 1.1
UI contract: AMS UI Core v5.0
UX scope: PUBLIC_COMMERCIAL
Primary locale: ru-RU
```

`DELIVERY_PROFILE=CRITICAL` выбран из-за будущего сбора и передачи персональных данных в lead forms. Статический frontend не хранит PII, но failure в consent/transport может иметь юридические и коммерческие последствия.

## 2. Architecture Decision

Проект — обычный маркетинговый сайт на Next.js App Router со статическим export. На production отсутствует Node.js runtime приложения.

```text
Browser
  -> Nginx
      -> static out/
      -> /api/leads -> AMS Leads API
```

CMS, PostgreSQL, Prisma, Payload, auth, worker, Redis и Docker не входят в baseline. Их добавление требует отдельного архитектурного решения и доказанной бизнес-потребности.

## 3. Stack

| Layer | Decision |
|---|---|
| package manager | pnpm |
| framework | Next.js App Router, exact stable version pinned in lockfile during foundation |
| UI runtime | React, exact compatible version from lockfile |
| language | TypeScript strict |
| styling | Tailwind CSS 4.x, CSS-first |
| primitives | project-owned shadcn/ui, Radix-based, Lucide icons |
| validation | Zod-first schemas, types via `z.infer` |
| long-form content | Markdown through one `RichTextDTO` renderer |
| deployment | `output: "export"`, `trailingSlash: true`, Nginx static hosting |
| images | preoptimized assets, `images.unoptimized: true` baseline |
| analytics | Яндекс Метрика, typed events, no PII |
| forms | target contract: relative `/api/leads` -> Nginx -> AMS Leads API; current code still uses disabled `/api/leads/test` and is tracked by remediation |

Exact foundation versions pinned during EPIC-01.2:

```text
Node: 24.20.0
pnpm: 12.8.1
Next.js: 16.3.7
React / React DOM: 19.3.0
TypeScript: 6.0.3
Tailwind CSS / @tailwindcss/postcss: 4.3.3
ESLint: 9.39.5
Zod: 4.6.5
shadcn/ui: 4.21.0 CLI, radix-nova config
Radix Slot: @radix-ui/react-slot 1.3.3
```

`typescript@7.0.2` and `eslint@10.11.0` were checked as latest registry versions on 2026-09-29 but rejected for foundation because the current Next ESLint toolchain depends on peer ranges that require TypeScript `<6.1.0` and ESLint 9-compatible plugins. The project therefore uses latest compatible stable versions rather than incompatible latest majors.

## 4. Next.js Static Contract

Required configuration intent:

```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
```

Prohibited in application runtime:

- request-time rendering and ISR;
- Server Actions and dynamic POST/API handlers;
- application use of `cookies()`, `headers()` or Middleware/Proxy;
- Next runtime redirects/rewrites/security headers as production mechanism;
- secrets in `NEXT_PUBLIC_*`, HTML, JS or `out/`.

All dynamic routes are known at build through `generateStaticParams()` and validated content.

Current remediation baseline:

- static export configuration is proven in `next.config.ts`;
- app-level `sitemap.ts` and `robots.ts` are not present yet;
- current worktree has no `out/sitemap.xml` or `out/robots.txt`;
- artifact SEO proof is therefore a remediation target, not a completed release fact.

## 5. Content Boundary

```text
Page / Route
  -> Content API / Service
      -> Content Repository Contract
          -> Local Adapter
              -> typed local sources / Markdown
```

Future migration seam, only if justified:

```text
same UI + DTO + Repository Contract
  -> Payload Adapter
      -> Payload
```

Rules:

- Page and UI components do not import raw content files.
- Zod schemas own validation and TypeScript inference.
- `id` is a stable AMS domain/content ID, never a database PK.
- `path` is the full normalized canonical route with leading/trailing `/`.
- `slug` is only a URL segment.
- Route identity is unique `(locale, path)`.
- Relations are refs resolved by Content Service.
- Unknown block, broken ref or duplicate path is a build failure.

Current remediation baseline: this is the target boundary. `CR-00.1` records
current drift: `ContentRepository` is still exported from
`src/core/content/repository/local-adapter.ts`, the repository service imports
`@/project/content/local-content`, and routes/UI still import several
`@/project/*` modules directly. `CR-06.*` owns remediation.

## 6. Content Models

Minimum models:

- `SiteSettingsDTO`;
- `NavigationDTO`;
- `SeoDTO`;
- `MediaDTO`;
- `ProductDTO`;
- `PageDTO` with typed block registry;
- `TariffDTO`;
- `CaseDTO`;
- `ReviewDTO`;
- `CalculationExampleDTO`;
- `ArticleDTO`;
- `KnowledgeArticleDTO`;
- `LeadIntentDTO` for safe client context.

Commercial pages use typed TypeScript content/blocks. Articles and KB long-form use Markdown. Arbitrary JSX/MDX page builder is out of scope.

## 7. Module Map

| Module | Purpose / ownership | Public boundary | Dependencies |
|---|---|---|---|
| `core/content` | schemas, repository, local adapter, services, block registry | DTO/repository functions | Zod, local sources |
| `core/seo` | metadata, sitemap, robots, schema.org from facts | SEO view models | content DTO |
| `core/leads` | safe client schema and relative transport | lead submission client | AMS Leads API via Nginx |
| `core/analytics` | typed non-PII events | event dispatcher | provider adapter |
| `project` | settings, navigation, redirects, content, project config | validated project data | core schemas |
| `ui/primitives` | shadcn source-owned primitives | semantic primitive API | Radix/shadcn |
| `ui/layout` | shell, header, footer, mobile nav | layout components | primitives/project navigation |
| `ui/shared` | container, section, CTA, FAQ, lead form, common states | semantic shared API | primitives/DTO |
| `ui/domain` | product/case/tariff/review components | domain view models | shared/content DTO |
| `ui/pages` | page-specific semantic sections | composition components | domain/shared |
| `app` | routes, metadata integration, page composition | Next routes | services/UI only |

Allowed dependency direction:

```text
app -> ui/pages -> ui/domain -> ui/shared -> ui/primitives
app -> core services -> repository -> local adapter -> project sources
ui reusable layers -> DTO/ViewModel only
```

Reusable UI must not depend on raw Markdown, file system, analytics provider or lead persistence.

### 7.1 Current Source Inventory and Import Baseline

Status: factual baseline captured for `AMS24-CONSTITUTION-REMEDIATION-2026`
CR-04.1 on 2026-09-30. It records the current repository state; it is not a
permission to keep drift permanently.

Current source directories:

| Current path | Current owner | Current role | Public boundary / consumers |
|---|---|---|---|
| `src/app` | Next route layer | route entrypoints, route-level metadata, static params and composition | public routes; may call services and render UI |
| `src/core/content/schemas` | content core | Zod DTO schemas and shared content types | imported by repository, project content and tests |
| `src/core/content/repository` | content core | repository contract and local adapter validation | `ContentRepository`, `createContentRepository()` |
| `src/core/content/services` | content service | singleton repository service over project local content | `getContentRepository()` for routes/tests |
| `src/core/content/block-registry` | content core | typed block registry parsing | content validation/tests |
| `src/core/content/services/rich-text.tsx` | content rendering service | RichText rendering from DTOs | UI/templates/tests |
| `src/core/seo` | SEO core | metadata, route/sitemap helpers and redirect validation | app/project/tests; not yet full SEO implementation |
| `src/core/lib` | shared utility core | small framework-agnostic utilities | UI primitives/shared |
| `src/project` | project data/config | site settings, navigation, redirects, claims, evidence, editorial contracts and lead contract | app, UI shell/content, core adapters |
| `src/project/content` | project content source | local content input for repository adapter | `core/content/services/repository.ts` |
| `src/ui/primitives` | UI foundation | project-owned primitives | shared/shell/content UI |
| `src/ui/shared` | reusable UI | section/container shared layout primitives | routes and shell/content UI |
| `src/ui/shell` | UI shell | header/footer/breadcrumbs/skeleton/detail page shells | app routes |
| `src/ui/content` | content presentation UI | article/knowledge editorial templates | dynamic editorial routes/tests |
| `src/ui/forms` | form UI | disabled-safe lead form presentation | app routes/tests |

Current import evidence:

| Edge | Current evidence | Baseline decision |
|---|---|---|
| `app -> core/content/services` | `src/app/page.tsx`, `/impuls/`, `/pixel/`, `/zashchita/` import `getContentRepository()` | factual drift from target page-service composition; allowed only as current baseline until CR-04.2/CR-06 |
| `app -> project` | route files import `site`, skeleton metadata, proof inventory, product claims and editorial contracts | current direct route data usage; must not expand silently |
| `app -> ui` | route files render `ui/shell`, `ui/shared`, `ui/content`, `ui/forms` | expected composition boundary |
| `core/content/services -> project/content` | `repository.ts` imports `localContent` | current local adapter seam; future repository contract should avoid broad project coupling |
| `core/seo -> project/redirects` | `redirects.ts` imports `RedirectRule` type | type-level coupling only in current baseline |
| `project -> core` | project content/evidence/link graph imports DTO/repository types | expected because project data conforms to core schemas |
| `ui -> project` | shell/content/form components import navigation, skeletons, detail fixtures, editorial contracts and lead contract | factual drift: presentation UI consumes project data directly |
| `ui -> core/lib` | primitives/shared import `cn()` | acceptable utility edge |
| `project -> ui/app` | none found in current scan | required invariant remains intact |
| non-`app` -> `app` | none found in current scan | required invariant remains intact |

Target-only names not currently present as directories: `ui/layout`, `ui/domain`,
`ui/pages`, `core/leads` and `core/analytics`. Their responsibilities are
partly represented today by `ui/shell`, `ui/content`, `ui/forms`,
`project/lead-contract.ts` and `project/analytics.ts`.

Dependency evidence used for this baseline:

- `rg --files src tests` inventory found the current source/test file set.
- Import scan found `app, core: 4`, `app, project: 12`, `app, ui: 44`,
  `core, project: 2`, `project, core: 3`, `ui, project: 8`, `ui, core: 3`,
  and no `project -> ui/app` or non-`app -> app` imports.
- Graphify `explain getContentRepository()` found route callers in
  `src/app/page.tsx`, `src/app/impuls/page.tsx`, `src/app/pixel/page.tsx` and
  `src/app/zashchita/page.tsx`.
- Graphify `path HomePage() getContentRepository()` confirmed a direct
  `HomePage() -> getContentRepository()` call.

## 8. Target Project Structure

```text
src/
  app/
  core/
    content/
      schemas/
      repository/
      services/
      block-registry/
    seo/
    leads/
    analytics/
    lib/
  project/
    content/
    site-settings.ts
    navigation.ts
    redirects.ts
    project.config.ts
  ui/
    primitives/
    layout/
    shared/
    domain/
    pages/
scripts/
ops/nginx/
tests/
docs/
```

Only directories required by an accepted task are created.

## 9. UI Runtime Profile

```text
Design system: AMS Northline adapted for Impulse
Token source: src/app/globals.css
Server Components: default
Client leaves: mobile menu, forms, accordion, optional calculator/filter
Dark mode: DISABLED as a theme; intentional dark sections are supported
Primary font: Manrope via next/font/google; subsets latin/cyrillic; weights 400/500/600/700/800; variable --font-app-sans; OFL 1.1 verified
Icons: Lucide only
Primitive base: shadcn/ui radix-nova, project-owned source in src/ui/primitives
Primary locale: ru-RU
Performance budget: mobile LCP <= 2.5s, CLS <= 0.1 on production-like build
```

Required baseline pages: custom 404 and framework error boundary-equivalent. Privacy/personal-data pages are required because forms collect PII. Thank-you is inline until a separate page is justified.

## 10. Leads, PII and Consent

```text
LeadForm
  -> browser UX validation
  -> POST /api/leads
  -> Nginx proxy
  -> AMS Leads API
  -> server validation / consent / anti-spam / routing / persistence
```

Frontend responsibilities:

- visible labels and programmatically linked errors;
- states: default, validation error, submitting, server error, success;
- honeypot/minimum-fill-time and public CAPTCHA site key if selected;
- send `accepted`, `consentVersion`, `acceptedAt`, `sourcePath`, `productId`, `ctaId`;
- never log or send name/phone/email/message into analytics.

AMS Leads API owns authoritative validation, normalization, rate limit, CAPTCHA secret, idempotency, storage and external delivery.

Current remediation baseline: the target frontend endpoint is `/api/leads`, but
`src/project/lead-contract.ts` currently uses disabled `/api/leads/test`.
`submissionEnabled` remains `false`; live lead submission is not claimed.

## 11. SEO Contract

- Each indexable page has unique title, description, canonical, H1, OG data and robots policy.
- Metadata uses the same validated content layer as page rendering.
- Sitemap contains only published routes.
- Structured data is generated only from factual entity data.
- Route skeletons and thin pages are excluded from index/sitemap.
- Redirect source is centralized and validated for loops, chains and missing targets.
- Main content is present in static HTML and is not loaded client-side.

## 12. Analytics Contract

Provider baseline: Яндекс Метрика, exact account/config `TODO`.

Typed events include at minimum:

- product route click;
- tariff/case/article/KB navigation;
- CTA click with safe page/product context;
- form start;
- form validation failure without field value;
- form submit success/failure without PII.

Reusable UI emits semantic callbacks/events and does not own provider-specific business dispatch.

## 13. Security

- No secrets in repository, static bundle or content.
- No untrusted raw HTML or unchecked `dangerouslySetInnerHTML`.
- Static CSP and security headers are owned by Nginx and tested against built output.
- Production forbids `'unsafe-eval'` without an explicit documented exception.
- Staging uses access restriction plus `X-Robots-Tag: noindex, nofollow`.
- Legal pages and consent version are release blockers for PII forms.
- External integrations use relative frontend endpoints and server-held credentials.

## 14. Quality and Verification

`pnpm verify` will include:

- typecheck;
- lint;
- static Next guard self-test with seeded invalid fixture;
- relevant unit tests;
- content/schema validation;
- link/ref/route/redirect validation;
- static architecture guards.

Hard failures include invalid schema, duplicate ID/path, broken link/ref, missing media, unknown block, published page without required SEO, PII form without legal/consent, and unsupported dynamic Next runtime feature.

Critical browser checks: home/navigation, representative product page, article, 404, mobile menu, trailing slash, lead form states and submission path.

## 15. Delivery Profile

`DELIVERY_PROFILE=CRITICAL`:

- zero automatic paid CI on branch push/PR;
- `.sourcecraft/ci.yaml` defines manual-only `merge-standard` and `merge-risky` workflows, with no `on.push`, `on.pull_request` or `on.schedule` triggers;
- each manual gate requires `expected_commit_sha` and fails closed unless `SOURCECRAFT_EVENT=manual` and `SOURCECRAFT_COMMIT_SHA` equals that input;
- one exact-head risk-classified SourceCraft Merge Gate before merge;
- review is mandatory and separate from CI;
- production only from clean canonical `main` and only by explicit owner command;
- artifact is built reproducibly, uploaded to release storage and deployed atomically;
- exact SHA, live smoke and rollback evidence are mandatory.

## 16. Production Contract

```text
SourceCraft canonical main
  -> verified static artifact out/
  -> release directory /var/www/ams24/releases/<release-id>/
  -> atomic current symlink switch
  -> Nginx reload/cache step
  -> live smoke
```

Rollback switches `current` to the previous verified release without rebuild. Production host does not run `git pull`, dependency install or build.

Production identity, server path, artifact store and Nginx configuration are `TODO` and must be recorded before release. No server/secret access is needed during documentation or implementation planning.

## 17. Content Management Evolution

Stage 1: local validated content in Git.  
Stage 2: optional Git-based editor only if browser editing is truly required.  
Stage 3: Payload only if roles, drafts, media library, frequent operational changes, dynamic entities or server workflows justify changing the project class.

Growth in the number of ordinary articles alone does not justify CMS migration.

## 18. Architecture Risks and Revisit Triggers

| Trigger | Required decision |
|---|---|
| multiple editors, drafts or scheduling | evaluate Git editor vs Payload |
| dynamic user/account workflow | change platform class; do not patch static export |
| direct CRM integration request | keep through AMS Leads API or create reviewed server boundary |
| >500 media assets or operational media workflow | revisit media pipeline/storage |
| high-frequency content updates impossible through Git | evaluate CMS with migration seam |
| calculator uses sensitive server data | move computation behind approved API |

## 19. Current Readiness

```text
Repository: remediation in progress after approved v3 import
Canonical remote: SourceCraft `integrator-p/ams24-next-new`
Approval checkpoint: local commit `514b731814836d38b2f4aba3e46b004f94dacac6`; remote branch `work/approval-remediation-v3`
Package/lockfile: pinned and verified by baseline classification
Current baseline evidence: `docs/research/BASELINE_CLAIMS_REGISTER_CR_00_1.md`
Known drift: heading semantics, content boundary, SEO app artifacts, public internal vocabulary and lead endpoint
SourceCraft REST automation: repaired via global skills Secret Master token-precedence fix; TestAccess passes
Durable artifact store: unresolved; blocks production release
Production identity: candidate AMS Main Server contour documented read-only; owner confirmation required before release
Local database: not needed
Latest full release proof: not current for remediation; must be rerun by `verify:release`/integrated proof tasks after fixes
```

The listed gaps are implementation and release-readiness remediation targets.
They are not treated as completed compliance.

## 20. External Preflight Register

Source of evidence: `docs/research/EXTERNAL_PREFLIGHT_EPIC_01_5.md`.

| External input | Current status | Owner | Blocks |
|---|---|---|---|
| AMS Leads API safe test endpoint/schema | TODO, not available in repo | owner + implementation | EPIC-08.2 and public release |
| Legal reviewer | OPEN, OD-03 unresolved | owner | EPIC-05 claim approval, EPIC-08 legal acceptance, release |
| Yandex Metrica account/config | TODO | owner + implementation | EPIC-08.4 and release measurement |
| CAPTCHA/anti-spam provider/public key | TODO | owner + implementation | EPIC-08.2 live form hardening |
| Current public `ams24.ru` redirect inventory | partial public inventory captured | implementation + SEO | EPIC-08.5 and release SEO |
