# External Preflight — EPIC-01.5

Status: Active
Updated: 2026-09-29
Scope: credential-free preflight for leads, legal, analytics/CAPTCHA and current `ams24.ru` URL inventory.

## 1. Method

- No secrets were requested or extracted.
- No admin panels, CRM, production server, database or private API were accessed.
- Public `GET` checks were used only for the current public `https://ams24.ru/` surface.
- Unknown external contracts are recorded as blockers/TODOs for their declared later epics, not guessed.

## 2. Preflight Matrix

| Area | Status | Evidence | Owner | Fallback / release impact |
|---|---|---|---|---|
| AMS Leads API contract | `TODO / not available in repo` | PRD and Architecture define frontend path `POST /api/leads -> Nginx -> AMS Leads API`, but no safe test endpoint, schema, auth boundary or delivery destinations are present in this repository. | owner + implementation | EPIC-08.2 must use a safe non-production target. If unavailable, submit stays disabled in dev/staging with truthful contact alternative; public release is blocked. |
| Legal reviewer | `OPEN` | Backlog OD-03 requires naming a legal reviewer before public copy/claims are approved. | owner | Sensitive claims, operator-audience language, protection claims, PII consent and legal pages remain release blockers. |
| Analytics provider | `TODO` | Architecture baseline is Yandex Metrica, exact account/config is not recorded. | owner + implementation | Provider adapter can be disabled in dev; public release requires approved analytics config and typed non-PII events. |
| CAPTCHA / anti-spam | `TODO` | Architecture allows honeypot/minimum-fill-time and public CAPTCHA site key if selected; AMS Leads API owns CAPTCHA secret. No public site key or provider decision is recorded. | owner + implementation | Use non-secret anti-spam UX until provider is selected; public release requires final consent/anti-spam contract for live forms. |
| Current `ams24.ru` URL inventory | `PARTIAL PUBLIC INVENTORY` | Public homepage, robots and sitemap index are reachable. Legacy `/sitemap.xml` returns 404, while `robots.txt` points to `/sitemap-index.xml`. | implementation + SEO | EPIC-08.5 must convert this into final redirect inventory and validate redirects/canonicals before release. |

## 3. Public Old-Site Checks

| URL | Result | Notes |
|---|---|---|
| `https://ams24.ru/` | `200 text/html` | Current site is live and has legacy AMS navigation/content. Owner explicitly said not to reuse the old structure/runtime. |
| `https://ams24.ru/robots.txt` | `200 text/plain` | Allows major crawlers, disallows `/thanks`, `/promo/thanks`, `/404`, `/promo`, declares clean params and points to `https://ams24.ru/sitemap-index.xml`. |
| `https://ams24.ru/sitemap.xml` | `404` | Do not rely on this legacy path. |
| `https://ams24.ru/sitemap-index.xml` | `200 text/xml` | Points to `https://ams24.ru/sitemap-0.xml`. |
| `https://ams24.ru/sitemap-0.xml` | `200 text/xml` | Contains the public legacy URL set below. |

## 4. Legacy URL Set From Public Sitemap

These URLs need an EPIC-08 redirect/canonical decision before release. Default disposition is `TODO`, not automatic preservation.

| Legacy URL | Initial disposition |
|---|---|
| `/` | map to new homepage `/` |
| `/about` | TODO: map to `/o-kompanii/` or equivalent company page |
| `/bigdata` | TODO: likely map to `/impuls/` or hide with redirect decision |
| `/cases` | map to `/keysy/` |
| `/cases/2` | TODO: inspect or redirect to `/keysy/` |
| `/cases/category/construction` | TODO: map to relevant case filter/hub if published |
| `/cases/category/process` | TODO: map to relevant case filter/hub if published |
| `/cases/category/real-estate` | TODO: map to relevant case filter/hub if published |
| `/cases/district-pages-real-estate-seo` | TODO: case/article redirect decision |
| `/cases/from-wordstat-to-site-structure` | TODO: case/article redirect decision |
| `/cases/home-builder-pricing-website` | TODO: case/article redirect decision |
| `/cases/house-project-catalog-ux` | TODO: case/article redirect decision |
| `/cases/landing-vs-seo-site-for-home-builders` | TODO: case/article redirect decision |
| `/cases/real-estate-agency-website-builder-vs-custom` | TODO: case/article redirect decision |
| `/cases/real-estate-leads-without-cian` | TODO: case/article redirect decision |
| `/cases/realtor-site-vs-agency-site` | TODO: case/article redirect decision |
| `/cases/site-structure-construction-company` | TODO: case/article redirect decision |
| `/cases/site-structure-real-estate-agency` | TODO: case/article redirect decision |
| `/cases/website-audit-before-redesign` | TODO: case/article redirect decision |
| `/cases/why-astro-for-real-estate-sites` | TODO: case/article redirect decision |
| `/cookies` | map to legal cookies page if retained |
| `/politika` | map to privacy/personal-data policy |
| `/private-house-construction` | TODO: likely no first-release equivalent unless evidence supports niche page |
| `/real-estate-agencies` | TODO: likely no first-release equivalent unless evidence supports niche page |
| `/real-estate-agencies/start-site` | TODO: likely article/case redirect decision |
| `/seo-real-estate` | TODO: likely no first-release equivalent unless SEO article/hub exists |
| `/soglasie` | map to consent page |
| `/terms` | map to terms/legal page |
| `/web-applications` | TODO: likely no first-release equivalent |

## 5. Additional Homepage Links Observed

Public homepage also links to non-sitemap or anchor/contact routes:

- `/#request`
- `/ams-impuls`
- `/contacts/#request`
- `/zakupochny-kontur`
- `#site-footer`
- `#system`
- external examples: `bastion-estate.ru`, `souz-home.ru`, `voen-navigator.ru`
- contact links: Telegram, Max, `mailto:integrator-p@yandex.ru`, `tel:+79183209996`

These are not automatically part of the new site. EPIC-08.5 should decide whether each needs redirect, noindex, replacement link or removal.

## 6. Release Blockers Carried Forward

- Safe AMS Leads API test endpoint and schema are missing.
- Legal reviewer is not named.
- Yandex Metrica account/config is not recorded.
- CAPTCHA/anti-spam provider decision is not recorded.
- Final redirect inventory is not approved.

These blockers do not stop repository foundation work. They block public release if still unresolved in EPIC-08/EPIC-09.
