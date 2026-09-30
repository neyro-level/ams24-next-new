# SEO System

Status: Active  
Version: 1.0  
Updated: 2026-09-30

## 1. Purpose

This document is the canonical SEO policy extension for the AMS24 static site.
It owns SEO-specific decisions that are too complex for the route map, while
the route map remains the owner of public routes, page roles and canonical URL
shape.

The SEO system must prevent three failures:

1. two indexable routes competing for the same primary intent;
2. metadata or search snippets promising facts that are not approved elsewhere;
3. SEO implementation drifting from the static export contract.

## 2. Source Priority

SEO decisions use this priority order:

| Priority | Source | Owns |
|---|---|---|
| 1 | `docs/01_PRD.md` | business truth, audiences, offer, proof limits, conversion ownership |
| 2 | `docs/02_PRODUCT_STRUCTURE.md` | canonical routes, page roles, route classes, demand clusters, expansion gates |
| 3 | `docs/07_SEO_SYSTEM.md` | SEO intent ownership, indexability policy, metadata rules, linking, schema, redirects and release crawl proof |
| 4 | `docs/03_ARCHITECTURE.md` | technical ownership, module boundaries, static export and validation responsibilities |
| 5 | content repositories and Zod schemas | actual publishable content DTOs and mechanical validation |
| 6 | implementation artifacts | generated metadata, sitemap, robots, structured data and exported HTML |

If two sources conflict, the lower-priority source must be changed or blocked;
SEO implementation must not silently choose a third interpretation.

## 3. Intent Ownership Contract

Every indexable public route has exactly one primary search intent. The primary
intent is inherited from the Page Role Map in `02_PRODUCT_STRUCTURE.md`; this
document only decides how SEO artifacts consume and protect that intent.

| Intent family | Canonical owner route | Supporting routes may do | Supporting routes must not do |
|---|---|---|---|
| Platform/brand | `/` | route users to products and trust pages | duplicate full product landing copy from `/impuls/`, `/pixel/` or `/zashchita/` |
| Lead generation product | `/impuls/` | explain related problems, methods and cases | create another indexable commercial page for the same product promise |
| Pixel/product identification | `/pixel/` | answer setup, privacy and applicability questions | compete for the same product decision intent |
| Lead protection | `/zashchita/` | explain risk symptoms, audits and safeguards | promise absolute protection or duplicate the product page |
| Price/economics | `/tarify/`, `/raschety/` | link between pricing and calculations | create `/stoimost-*` style duplicates without owner decision |
| Evidence/cases | `/keisy/`, `/keisy/[slug]/` | prove product claims with approved evidence | create niche index routes before the niche gate passes |
| Editorial education | `/stati/`, `/stati/[slug]/` | answer informational demand and link to one primary product | replace product, tariff, case or support intent |
| Support/how-to | `/baza-znaniy/`, product KB details | solve operational tasks | become a second SEO blog or commercial landing |
| Legal/trust | legal/company routes | satisfy legal or trust needs | manufacture SEO variants of the same legal/company page |

When an article, case, KB entry or landing page appears to fit multiple
families, one canonical target receives the primary intent and all others must
be supporting links.

## 4. Duplicate Policy

The site rejects an indexable route, page variant or metadata set when any of
the following is true:

- it has the same primary intent as an existing route;
- its H1/title/description can be swapped with an existing route without
  changing the user promise;
- it uses the same demand cluster as another route but has no distinct role,
  evidence source or next action;
- it is only a filter, tag, city, niche or synonym page without owner-approved
  evidence and a unique release gate;
- it is a thin placeholder whose main content is not useful in static HTML;
- it depends on unapproved claims, private implementation vocabulary or
  unsupported metrics.

Duplicate-policy result values are:

| Result | Meaning | Allowed release state |
|---|---|---|
| `PASS` | distinct intent, role, content, evidence and canonical target are proven | indexable if other SEO gates pass |
| `NOINDEX` | useful for users but not unique enough for search | published only with `noindex` and excluded from sitemap |
| `MERGE` | useful content belongs inside an existing route | no new route; update the owner route |
| `REJECT` | no approved evidence, misleading intent or unsafe claim | do not publish |

## 5. Cluster Contract

Demand clusters from `02_PRODUCT_STRUCTURE.md` are baseline routing signals, not
a permission to create pages. A cluster can produce a new indexable page only
after the expansion, niche and cannibalization gates pass in Product Structure.

Cluster review must record:

1. canonical route that owns the primary intent;
2. supporting routes and their internal-link direction;
3. evidence source or current measurement requirement;
4. index state: `index`, `noindex`, `draft` or `not created`;
5. reason the route does not cannibalize a stronger existing target.

If the review cannot name one owner route, the route is blocked before content
or implementation work starts.

## 6. Article, KB and Case Boundaries

Editorial articles answer market, method, comparison, legal or economic
questions. They should link to one primary commercial route and may link to
approved cases or support pages.

Knowledge Base pages solve a product usage task. They may be indexed only when
the instruction is current, useful as a standalone static page and does not
serve the same primary intent as an article.

Case pages prove one scenario with approved source, period, method, metrics,
permission status and limitations. Case hubs and details do not own product
promise or pricing intent.

## 7. Contract Examples

| Proposal | SEO result | Reason |
|---|---|---|
| `/stati/operatornye-auditorii/` explaining market language and linking to `/impuls/` | `PASS` if claims are approved | editorial intent supports the product page |
| `/stoimost-lidogeneratsii/` while `/tarify/` and `/raschety/` exist | `MERGE` or `REJECT` | price intent is already owned |
| `/impuls/meditsina/` without approved niche evidence | `REJECT` | niche route fails evidence and cannibalization gates |
| `/baza-znaniy/pixel/ustanovka/` with current setup steps | `PASS` or `NOINDEX` by usefulness | support task differs from commercial product intent |
| legal synonym page for privacy wording | `MERGE` | legal/trust route already owns that function |

## 8. Indexability Policy

Indexability is decided before implementation. A route cannot appear in sitemap
or claim indexable metadata unless this policy returns `index`.

| Page state | Examples | Robots | Sitemap | Canonical | Required action |
|---|---|---|---|---|---|
| Approved canonical route with unique intent and useful static content | `/`, `/impuls/`, approved `/stati/[slug]/` | `index, follow` | included | self canonical with trailing slash | publish metadata from validated content |
| Useful public page without unique search intent | temporary support detail, utility filter, legal duplicate candidate | `noindex, follow` | excluded | self canonical unless merged | publish for users only; do not target search demand |
| Thin placeholder or unresolved proof | empty article, unapproved case, tariff skeleton before owner decision | `noindex, follow` or not published | excluded | self canonical only if public | block index until content/proof gate closes |
| Legal consent/policy pages | `/politika/`, `/soglasie/`, `/obrabotka-dannyh/` | `noindex, follow` by default | excluded | self canonical | index only after explicit owner decision |
| System/recovery route | `/404` | `noindex, follow` | excluded | no canonical required beyond runtime default | keep recovery links safe |
| Staging/private build | any route | `noindex, nofollow` via headers or robots | excluded from public sitemap | production canonical must not be advertised | release blocker if public indexing is possible |
| Duplicate or cannibalizing proposal | `/stoimost-lidogeneratsii/`, unsupported niche landing | not published | excluded | merge into owner route | reject or merge before implementation |

`index` means the route may be included in the generated sitemap and may emit
normal search metadata. `noindex` means the route can be useful for humans but
must not appear in sitemap or search-targeted internal linking blocks.

## 9. Metadata and H1 Policy

Every indexable route must have:

- one factual title;
- one factual description;
- one visible H1 in static HTML;
- one canonical URL with leading and trailing slash;
- Open Graph values derived from the same validated content;
- robots policy consistent with indexability;
- no unsupported KPI, legal, pricing, availability or performance claim.

Metadata cannot introduce facts that are absent from PRD, Product Structure,
approved content or evidence registers. If a page has useful content but lacks
approved metadata facts, the page remains `noindex` until the facts are
approved.

H1 ownership follows the route's primary intent. Supporting sections can use
lower headings, but must not create a second H1 or restate another route's H1
with synonym-only wording.

## 10. Canonical URL Policy

Canonical URLs are the public production URLs from `02_PRODUCT_STRUCTURE.md`.
They must:

1. use `https://ams24.ru`;
2. include a leading slash and trailing slash for routes;
3. point to the single route that owns the primary intent;
4. never point a `noindex` duplicate to itself when the content should be
   merged into an owner route;
5. avoid query, tag, filter and UTM variants.

If a route is renamed or merged, canonical ownership moves only after redirect
rules are documented and release proof shows no conflicting index target.

## 11. Robots Policy

Production robots defaults:

- public indexable routes: `index, follow`;
- legal consent/policy and system routes: `noindex, follow`;
- staging/private routes: `noindex, nofollow`;
- rejected, duplicate, draft or thin routes: not published, or `noindex,
  follow` if they must remain user-accessible.

Robots policy must agree across page metadata, robots file, sitemap inclusion
and any `X-Robots-Tag` configured outside the app. A disagreement is a release
blocker.

## 12. Sitemap Policy

The sitemap contains only production URLs that are:

1. published;
2. canonical;
3. `index, follow`;
4. not thin placeholders;
5. not duplicate/cannibalizing variants;
6. backed by validated content and approved evidence where required.

Sitemap generation must consume the same route/content repository as page
metadata. Handwritten URLs, private/staging URLs, `noindex` URLs and unresolved
redirect sources are forbidden.

## 13. Policy Decision Table

| Scenario | Index decision | Metadata/H1 decision | Canonical decision | Sitemap decision |
|---|---|---|---|---|
| Approved `/impuls/` product page with unique content | `index, follow` | unique product title, description and one H1 | `https://ams24.ru/impuls/` | include |
| `/raschety/` before calculation examples are owner-approved | `noindex, follow` or not published | factual skeleton only; no invented numbers | self canonical only if public | exclude |
| `/stati/operatornye-auditorii/` with approved article and links to `/impuls/` | `index, follow` | article metadata owns informational intent | article self canonical | include |
| Empty `/stati/[slug]/` placeholder | `noindex, follow` or not published | no search-targeted metadata | self canonical only if public | exclude |
| `/keisy/[slug]/` with source, period, method and permission | `index, follow` | evidence-specific title/H1 with limitations | case self canonical | include |
| `/keisy/meditsina/` without niche gate evidence | reject or `noindex, follow` | no niche SEO targeting | merge/link to `/keisy/` | exclude |
| `/politika/` legal page | `noindex, follow` by default | legal factual H1 | `https://ams24.ru/politika/` | exclude |
| `/404` recovery route | `noindex, follow` | recovery H1 only | no search canonical requirement | exclude |
| staging export accidentally reachable | `noindex, nofollow` | production SEO metadata must not be advertised | production canonical forbidden on private host | exclude |

## 14. Handoff to Later CR-03 Tasks

CR-03.1 freezes source priority and intent ownership. CR-03.2 freezes
indexability, metadata, H1, canonical, robots and sitemap rules.

CR-03.3 must add linking, structured data, media, redirects and release proof.
Until CR-03.3 is complete, this document does not yet define the full SEO
release checklist.
