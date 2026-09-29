# Architecture — ams24-next-new

Status: Draft  
Version: 0.1  
Updated: 2026-09-29

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
| forms | relative `/api/leads` -> Nginx -> AMS Leads API |

Exact Node/Next/React/Tailwind versions are `TODO` until scaffold. They must be verified against current official documentation before foundation is accepted.

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
Token source: src/app/globals.css after EPIC-02
Server Components: default
Client leaves: mobile menu, forms, accordion, optional calculator/filter
Dark mode: DISABLED as a theme; intentional dark sections are supported
Primary font: Manrope, Cyrillic/license/weights to be verified
Icons: Lucide only
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
- relevant unit tests;
- content/schema validation;
- link/ref/route/redirect validation;
- static architecture guards.

Hard failures include invalid schema, duplicate ID/path, broken link/ref, missing media, unknown block, published page without required SEO, PII form without legal/consent, and unsupported dynamic Next runtime feature.

Critical browser checks: home/navigation, representative product page, article, 404, mobile menu, trailing slash, lead form states and submission path.

## 15. Delivery Profile

`DELIVERY_PROFILE=CRITICAL`:

- zero automatic paid CI on branch push/PR;
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
Repository: not initialized
Canonical remote: SourceCraft `integrator-p/ams24-next-new` created
Package/lockfile: missing
On-demand SourceCraft gate: missing
Release runbook: missing
Durable artifact store: unknown
Production identity: not recorded
Local database: not needed
```

These gaps are expected before foundation and release epics; they block production, not documentation.
