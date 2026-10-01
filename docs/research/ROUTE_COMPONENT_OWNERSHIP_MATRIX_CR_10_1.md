# Route-to-Component Ownership Matrix — CR-10.1

Status: Complete matrix
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`
Task: `CR-10.1`
Date: 2026-09-30
Mode: source inventory + Graphify affected check; no page decomposition in this task.

## 1. Rule

Page entrypoints own route composition only. Shared components stay owned by their layer and are consumed through stable props/data boundaries. EPIC-10 may later decompose primary routes, but this matrix is the stop-list against accidental shared-file fights.

Ownership order:

```text
src/app/<route>/page.tsx
  -> page-specific section composition
  -> ui/content | ui/forms | ui/legal | ui/shell
  -> ui/shared
  -> ui/primitives
```

Forbidden in EPIC-10:

- turning `src/app/*/page.tsx` into a universal page builder;
- moving product/proof/lead facts into UI components;
- editing `LeadForm` behavior owned by EPIC-13;
- editing block/RichText registry owned by EPIC-12;
- reintroducing internal public-copy terms removed by EPIC-09;
- creating new shared components before at least two routes have the same proven structure and acceptance.

## 2. Shared component owners

| Shared file | Owner | Allowed CR-10 use | Conflict rule |
|---|---|---|---|
| `src/ui/primitives/button.tsx` | primitive system | consume canonical variants only | new variants require design-system reason and tests |
| `src/ui/shared/container.tsx` | shared layout | route layout width/padding | no route-specific content or data |
| `src/ui/shared/section.tsx` | shared section rhythm and `SectionHeader` | semantic section framing | no page-specific copy or product branching |
| `src/ui/forms/lead-form.tsx` | form boundary / EPIC-13 | embed as opaque conversion component | do not change submission, endpoint, consent, validation or analytics behavior |
| `src/ui/legal/legal-page.tsx` | legal page template | legal route rendering | legal text/content remains legal owner gated |
| `src/ui/shell/route-skeleton-page.tsx` | skeleton page template | planned/noindex routes | no product-specific sections |
| `src/ui/content/article-editorial-template.tsx` | editorial template | article detail layout | content contract remains project/editorial |
| `src/ui/content/knowledge-editorial-template.tsx` | support template | KB detail layout | content contract remains project/support |
| `src/ui/shell/site-header.tsx`, `site-footer.tsx`, `site-shell.tsx` | global shell | route wrapper/navigation only | navigation data stays in project/navigation |

## 3. Route-to-component matrix

| Route | Entrypoint owner | Semantic section owner | Shared components allowed | Data/content boundary | CR-10.2 action |
|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | platform route composition | `Button`, `LeadForm`, `Container`, `Section`, `SectionHeader` | `getContentRepository()` read-only | decompose only homepage-specific sections if readability requires it |
| `/impuls/` | `src/app/impuls/page.tsx` | product route composition | `Button`, `LeadForm`, `Container`, `Section`, `SectionHeader` | repository + `getPublicClaimsForProduct('impuls')` read-only | decompose product-specific sections; do not create generic product builder |
| `/pixel/` | `src/app/pixel/page.tsx` | product route composition | `Button`, `Container`, `Section`, `SectionHeader` | repository + `getPublicClaimsForProduct('pixel')` read-only | decompose product-specific sections; keep Pixel boundaries local |
| `/zashchita/` | `src/app/zashchita/page.tsx` | product route composition | `Button`, `Container`, `Section`, `SectionHeader` | repository + `getPublicClaimsForProduct('zashchita')` read-only | decompose product-specific sections; keep protection limits local |
| `/tarify/` | `src/app/tarify/page.tsx` | commercial proof hub composition | `Button`, `Container`, `Section`, `SectionHeader` | `proofEvidenceInventory` read-only | keep tariff card markup local until reuse is proven |
| `/raschety/` | `src/app/raschety/page.tsx` | commercial proof hub composition | `Button`, `Container`, `Section`, `SectionHeader` | `proofEvidenceInventory` read-only | keep calculation sections local |
| `/keisy/` | `src/app/keisy/page.tsx` | evidence hub composition | `Button`, `Container`, `Section`, `SectionHeader` | `proofEvidenceInventory` read-only | hub cards local until case-card reuse is proven |
| `/otzyvy/` | `src/app/otzyvy/page.tsx` | evidence hub composition | `Button`, `Container`, `Section`, `SectionHeader` | `proofEvidenceInventory` read-only | review cards local until reuse is proven |
| `/stati/` | `src/app/stati/page.tsx` | planned editorial hub | `RouteSkeletonPage` | `getStaticRouteSkeleton('/stati/')` read-only | no decomposition while skeleton |
| `/stati/[slug]/` | `src/app/stati/[slug]/page.tsx` | editorial detail routing | `ArticleEditorialTemplate` | `representativeArticleContract` read-only | template owner remains `ui/content` |
| `/baza-znaniy/` | `src/app/baza-znaniy/page.tsx` | planned support hub | `RouteSkeletonPage` | `getStaticRouteSkeleton('/baza-znaniy/')` read-only | no decomposition while skeleton |
| `/baza-znaniy/[product]/[slug]/` | `src/app/baza-znaniy/[product]/[slug]/page.tsx` | support detail routing | `KnowledgeEditorialTemplate` | `representativeKnowledgeContract` read-only | template owner remains `ui/content` |
| `/o-kompanii/` | `src/app/o-kompanii/page.tsx` | planned trust page | `RouteSkeletonPage` | `getStaticRouteSkeleton('/o-kompanii/')` read-only | no decomposition while skeleton |
| `/kontakty/` | `src/app/kontakty/page.tsx` | conversion page composition | `LeadForm`, `Container`, `Section`, `SectionHeader` | `LeadForm` contract read-only | do not change form behavior; route owns surrounding copy only |
| `/politika/` | `src/app/politika/page.tsx` | legal routing | `LegalPage` | `buildLegalMetadata('policy')` read-only | no CR-10 decomposition |
| `/soglasie/` | `src/app/soglasie/page.tsx` | legal routing | `LegalPage` | `buildLegalMetadata('consent')` read-only | no CR-10 decomposition |
| `/obrabotka-dannyh/` | `src/app/obrabotka-dannyh/page.tsx` | legal routing | `LegalPage` | `buildLegalMetadata('data-processing')` read-only | no CR-10 decomposition |
| `/rekvizity/` | `src/app/rekvizity/page.tsx` | planned legal/trust page | `RouteSkeletonPage` | `getStaticRouteSkeleton('/rekvizity/')` read-only | no decomposition while skeleton |
| `/404` | `src/app/not-found.tsx` | system recovery composition | `Container`, `Section` | none | keep local |
| `global layout` | `src/app/layout.tsx` | app shell composition | `SiteShell` | `getSiteSettingsViewModel()` read-only | not part of page-section decomposition |
| `global error` | `src/app/error.tsx` | system error recovery | `Container`, `Section` | none | not part of page-section decomposition |

Current T3.3 state: the case detail route remains absent until evidence and publication permission are approved; `/keisy/` remains the noindex evidence hub.

## 4. Proven shared candidates

| Candidate | Evidence | Decision before CR-10.2 |
|---|---|---|
| Dark hero CTA row | repeated across commercial routes | use existing `Button` variants; do not create a semantic CTA row yet |
| Proof hub cards | `/tarify/`, `/raschety/`, `/keisy/`, `/otzyvy/` share shape but different proof rules | keep local until CR-10.3 reuse inventory |
| Product limitation cards | product pages share pattern but copy/rules differ | keep local; no generic product builder |
| Skeleton/legal templates | already shared and route-owned by templates | reuse existing templates only |

## 5. Verification

- `rg` import inventory covered `src/app/**/*.tsx`.
- Graphify affected checks:
  - `RouteSkeletonPage()` consumers: `/stati/`, `/baza-znaniy/`, `/o-kompanii/`, `/rekvizity/` plus tests.
  - `LeadForm()` consumers: `/`, `/impuls/`, `/kontakty/` plus tests.
  - `SectionHeader()` consumers: primary commercial/proof pages and legal template.
