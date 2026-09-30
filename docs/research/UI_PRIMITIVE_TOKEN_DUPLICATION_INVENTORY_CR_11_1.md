# UI Primitive / Token Duplication Inventory — CR-11.1

Status: Complete inventory  
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`  
Task: `CR-11.1`  
Date: 2026-09-30  
Mode: READ-ONLY audit inventory; no UI remediation in this task.

## Scope

This inventory covers the current UI foundation and implementation surface:

- `components.json`;
- `src/app/globals.css`;
- `src/ui/**`;
- page-level TSX under `src/app/**`;
- Project Design System source: `docs/06_DESIGN_SYSTEM.md`.

## Scan Evidence

Commands used:

```text
rg --files src/ui
rg -n "#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|oklch\(" src -S
rg -n "\[[^\]]+\]" src -S
rg -n "dark:" src -S
rg -n "use client" src -S
rg -n "rounded-card border border-border bg-surface-elevated p-5" src -S
rg -n "rounded-card border border-border bg-surface-elevated p-6 shadow-card" src -S
rg -n "rounded-large border border-border bg-surface-elevated p-6 shadow-card" src -S
rg -n "grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start" src -S
```

## Primitive Inventory

| Primitive / pattern | Current source | Evidence | Duplication status | Reuse decision |
|---|---|---|---|---|
| `Button` | `src/ui/primitives/button.tsx` | single `function Button`, `components.json` alias `ui: "@/ui/primitives"` | no second Button found | `REUSE`; keep as canonical primitive |
| `Container` | `src/ui/shared/container.tsx` | only `site` and `narrow` variants | no competing container found | `REUSE`; add variants only if CR-11.2/11.3 needs them |
| `Section` | `src/ui/shared/section.tsx` | `sm`, `md`, `lg`, `hero` spacing roles | no second section primitive found | `REUSE`; page-specific spacing should flow through this primitive |
| `SectionHeader` | `src/ui/shared/section.tsx` | fixed `<h2>` output | no duplicate header primitive, but heading role is too rigid for page hero contexts | `VARIANT`; future remediation should allow semantic heading level without duplicating header UI |
| `LeadForm` | `src/ui/forms/lead-form.tsx` | single form shell with light/dark classes | no second form primitive found | `REUSE`; later live-submit remediation should extend this component, not create a second form |
| `LegalPage` | `src/ui/legal/legal-page.tsx` | reused by legal routes | no duplicate legal template found | `REUSE` |
| `RouteSkeletonPage` | `src/ui/shell/route-skeleton-page.tsx` | reused by skeleton routes | no duplicate skeleton template found | `REUSE` |
| `ArticleEditorialTemplate` / `KnowledgeEditorialTemplate` | `src/ui/content/**` | separate editorial/support templates | intentional split by content type | `KEEP_EXCEPTION`; combine only if CR-12 rich text work proves shared renderer value |

## Token Inventory

| Token area | Current source | Evidence | Duplication status | Reuse decision |
|---|---|---|---|---|
| Color tokens | `src/app/globals.css` | raw hex/rgb appears in `:root` and `@theme inline` token source only | no raw color bypass found in TSX scan | `REUSE`; token source is canonical |
| Dark section tokens | `--surface-dark*` in `globals.css` | used by dark hero/final CTA/footer surfaces | not theme dark mode; approved section variant | `REUSE`; keep graphite dark sections |
| Tailwind `dark:` variant | `src/ui/primitives/button.tsx` lines with `dark:*` | Design System says global dark mode disabled and project-authored `dark:` prohibited | drift inside project-owned primitive | `VARIANT`; remove or replace with explicit section-safe variants during CR-11 remediation |
| Radius tokens | `--radius-card`, `--radius-large`, `rounded-card`, `rounded-large` | repeated across pages and shared templates | token use is valid, but card/panel composition is duplicated | `CREATE`; introduce reusable Card/Panel composition before scaling more pages |
| Shadows | `--shadow-card`, `--shadow-panel` | repeated as `shadow-card` and `shadow-panel` | token use is valid; composition duplication remains | `CREATE`; include in Card/Panel variants |
| Section spacing | `py-section-*`, `Section` spacing props | pages use `Section` consistently | no random section padding drift detected in sampled routes | `REUSE` |
| Grid ratios | repeated arbitrary `lg:grid-cols-[...]` | 4 occurrences of `grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start`; 2 occurrences of hero `minmax` ratio | layout values are repeated outside token/variant API | `VARIANT`; add named layout variants if repeated pages remain after route consolidation |

## Duplicate Composition Findings

| Severity | File | Location | Finding | Evidence/rule | Recommended action |
|---|---|---|---|---|---|
| P1 | `src/app/**`, `src/ui/content/**`, `src/ui/shell/**` | repeated cards/panels | Card/panel class bundles are repeated across page and template files instead of a canonical shared Card/Panel primitive. | `rounded-card border border-border bg-surface-elevated p-5` appears 14 times; `rounded-card ... p-6 shadow-card` appears 9 times; `rounded-large ... p-6 shadow-card` appears 6 times. DS says no second Card system and reusable patterns should be owned by shared primitives. | `CREATE` one project-owned Card/Panel primitive or variants, then migrate repeated bundles in CR-11.2/11.3. |
| P1 | `src/ui/primitives/button.tsx` | button variants | Project-owned Button still contains Tailwind `dark:` branches while global dark mode is disabled. | `rg dark:` finds `dark:*` only in `button.tsx`; DS section “Dark Mode” prohibits project-authored `dark:` unless decision changes. | `VARIANT`; replace `dark:` behavior with explicit graphite-section button variants or remove unreachable branches. |
| P2 | `src/app/page.tsx`, `src/app/impuls/page.tsx`, `src/app/pixel/page.tsx`, `src/app/zashchita/page.tsx` | split content grids | Several page sections repeat the same two-column layout ratio directly in page TSX. | `grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start` appears 4 times. | `VARIANT`; add shared layout helper only if these sections survive upcoming page-contract remediation. |
| P2 | `src/app/**` | dark hero outline CTA | The same dark-section outline Button override is repeated on commercial pages. | `h-12 border-surface-dark-faint bg-transparent px-5 text-surface-dark-foreground hover:bg-surface-dark-hover hover:text-surface-dark-foreground` appears 8 times. | `VARIANT`; add Button variant such as `outlineDark` or `section="dark"` during Button remediation. |
| P2 | `src/ui/shared/section.tsx` | `SectionHeader` | There is one shared SectionHeader, but it hardcodes `<h2>`, so pages needing H1 semantics must bypass or duplicate heading composition. | `SectionHeader` fixed `<h2>`; current route pages contain multiple `SectionHeader` usages and separate hero `<h1>` implementations. | `VARIANT`; support semantic heading level while keeping one visual API. |

## Reuse Decisions Queue

| Decision | Target | Why | Preferred task |
|---|---|---|---|
| `REUSE` | `Button`, `Container`, `Section`, `LeadForm`, shell/legal/editorial templates | canonical sources exist and aliases point to the intended tree | continue using these primitives |
| `VARIANT` | Button dark-section behavior | repeated class override and `dark:` drift should be solved inside Button API | CR-11.2 or CR-11.3 |
| `VARIANT` | SectionHeader semantic heading level | one visual component should support correct page semantics | CR-05/CR-11 follow-up where H1 remediation lands |
| `VARIANT` | split-grid layouts | repeated arbitrary ratios likely need named layout variants | CR-11.2 if page structure remains stable |
| `CREATE` | Card/Panel primitive | repeated card/panel bundles are the largest duplication cluster | CR-11.2 |
| `KEEP_EXCEPTION` | separate article and knowledge templates | editorial and support contracts are not identical yet | re-evaluate in CR-12 rich text work |

## Audit Summary

TOKENS / DEAD TOKENS: raw color values are confined to `globals.css` token source. No TSX raw color bypass found. Dead-token proof was not attempted in this inventory.

COMPONENT DUPLICATION: no duplicate Button/Input/Dialog primitive tree found. Main duplication is repeated Card/Panel and repeated dark-outline CTA composition.

PAGE OR SCREEN COMPOSITION: product pages repeat hero/grid/card structures; this is manageable now but should be consolidated before more routes are scaled.

SERVER / CLIENT: only `src/app/error.tsx` has `use client`, which is expected for an error boundary. No section/layout-level client boundary drift found.

RESPONSIVE / STATES: repeated arbitrary grid ratios exist; no browser responsive proof was run in this task.

ACCESSIBILITY: SectionHeader semantic level is a known risk because it hardcodes `<h2>`. Detailed accessibility proof is outside CR-11.1.

SEO / PAGE CONTRACT: not checked beyond noting the heading-level risk.

MEDIA / PERFORMANCE: not checked; no image/media remediation is in CR-11.1.

PORTABILITY COUPLING: `components.json` aliases are coherent with `src/ui/primitives` and `src/ui/shared`.

UNRECORDED EXCEPTIONS: Tailwind `dark:` inside project-owned Button is the main unrecorded exception against the current DS rule.

NOT CHECKED: browser screenshots, computed CSS, visual regression, dead-token reachability, Lighthouse and full page a11y.
