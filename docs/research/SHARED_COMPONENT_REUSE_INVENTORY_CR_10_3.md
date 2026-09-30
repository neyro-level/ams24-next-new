# CR-10.3 Shared Component Reuse Inventory

Status: Complete  
Plan: AMS24-CONSTITUTION-REMEDIATION-2026 v3  
Task: CR-10.3 — shared components exist only for proven reuse

## Decision

No new generic page builder, product builder, section registry or CTA row component is introduced in CR-10.3.

Shared UI remains limited to components with proven reuse or explicit platform ownership. Product-page sections extracted in CR-10.2 stay local to their route files until there is stronger evidence that the same semantic block is stable across products.

## Reuse inventory

| Component | Current import evidence | Ownership | CR-10.3 decision |
| --- | ---: | --- | --- |
| `src/ui/primitives/button.tsx` | 11 consumers | primitive | keep shared |
| `src/ui/shared/container.tsx` | 18 consumers | layout primitive | keep shared |
| `src/ui/shared/section.tsx` | 17 consumers | section shell + header | keep shared |
| `src/ui/forms/lead-form.tsx` | 4 consumers | form boundary owned by EPIC-13 | keep shared; do not change behavior |
| `src/ui/legal/legal-page.tsx` | 5 consumers | legal page template | keep shared |
| `src/ui/shell/breadcrumbs.tsx` | 4 consumers | shell/detail navigation | keep shared |
| `src/ui/shell/route-skeleton-page.tsx` | 7 consumers | static route shell | keep shared |
| `src/ui/shell/detail-fixture-page.tsx` | 3 consumers | detail placeholder shell | keep shared |
| `src/ui/content/article-editorial-template.tsx` | 2 consumers | article detail template | keep shared |
| `src/ui/content/knowledge-editorial-template.tsx` | 2 consumers | knowledge detail template | keep shared |
| `src/ui/shell/site-header.tsx` | shell-owned | global shell | keep shared through `SiteShell` |
| `src/ui/shell/site-footer.tsx` | shell-owned | global shell | keep shared through `SiteShell` |
| `src/ui/shell/site-shell.tsx` | root layout | global shell | keep shared |
| `src/ui/foundation/token-fixture.tsx` | no app route consumers | design-system fixture | keep outside page composition; not a shared route building block |

Import counts were collected with exact `@/ui/...` path search across `src/app`, `src/ui` and `tests` after CR-10.2.

## Explicit non-components

The following are rejected for the current codebase:

- `ProductPage`, `ProductPageBuilder`, `GenericProductPage`
- `PageBuilder`, `RouteBuilder`, `SectionRegistry`, `BlockRegistry`
- `CtaRow`, `UniversalCta`, `ProductHero` as shared components

Reason: the product routes currently share visual rhythm, not a stable semantic contract. Extracting a builder would hide product-specific copy, evidence limits, legal boundaries and future CR-13 form behavior behind a premature abstraction.

## Local route sections retained

CR-10.2 created local route sections in:

- `src/app/page.tsx`
- `src/app/impuls/page.tsx`
- `src/app/pixel/page.tsx`
- `src/app/zashchita/page.tsx`

These functions are intentionally not exported and not moved into `src/ui/shared`.

## Guard

`tests/content/shared-component-reuse.test.ts` protects the inventory by checking:

- the inventory file names the forbidden universal builders;
- forbidden generic builder files do not exist under `src/ui`;
- the primary product routes do not import a generic product/page builder;
- route-local section functions remain non-exported.
