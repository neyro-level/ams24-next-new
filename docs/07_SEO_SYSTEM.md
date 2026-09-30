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

## 8. Handoff to Later CR-03 Tasks

This task freezes source priority and intent ownership only.

CR-03.2 must add deterministic rules for indexability, metadata, H1, canonical,
robots and sitemap. CR-03.3 must add linking, structured data, media, redirects
and release proof. Until those tasks are complete, this document is the
ownership contract but not a full SEO release checklist.
