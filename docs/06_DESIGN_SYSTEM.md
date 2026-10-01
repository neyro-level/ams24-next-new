# Design System — AMS Northline for Impulse

Status: Active  
Version: 1.0  
Updated: 2026-09-30

## 1. Source and Adaptation

Project Design System is based on **AMS Northline v3.1**, supplied from the current `ams24.ru` project.

Accepted from Northline:

- cold service-premium character;
- graphite-blue dark surfaces and restrained steel-blue accent;
- large calm typography, editorial alignment and generous whitespace;
- route/collection card thinking;
- thin borders, dry geometry and restrained motion;
- one-screen/one-meaning principle.

Not copied literally:

- Astro paths and component mapping;
- old `Chirkov` naming in token prefixes;
- real-estate-specific photo requirements and CTA language;
- existing code or legacy token drift;
- marketing patterns of competitor sites.

For «Импульс», premium is expressed through clarity, proof, system diagrams and real business evidence rather than residential architecture imagery.

## 2. Intake Status

```text
Design input: AMS Northline v3.1
Inventory: source reviewed
Normalized roles: created for foundation
Token source: src/app/globals.css
Fixture: src/ui/foundation/token-fixture.tsx
Primitive foundation: components.json + src/ui/primitives/button.tsx
Duplication inventory: docs/research/UI_PRIMITIVE_TOKEN_DUPLICATION_INVENTORY_CR_11_1.md
Token drift exceptions: docs/research/TOKEN_DRIFT_EXCEPTION_REGISTER_CR_11_3.md
Representative page: /
Design Intake completed: FOUNDATION ONLY
```

Design intake closed for the representative foundation only. The later
remediation graph has now added full semantic heading, accessibility,
performance and UI drift proof for the current static site scope. P2/P3 cleanup
items remain tracked, but EPIC-19 closed with zero unresolved P0/P1 UI drift.

### 2.1 Intake Evidence

Date: 2026-09-29
Scope: `EPIC-02.4`

| Check | Status | Evidence |
|---|---|---|
| No P0/P1 design drift | FINAL PASS WITH FINDINGS | `docs/research/UI_DRIFT_AUDIT_CR_19_2.md` and `docs/research/EPIC_19_P0_P1_DISPOSITION_CR_19_3.md` record zero P0/P1; P2/P3 cleanup remains tracked. |
| Keyboard and semantic access | FINAL PASS | `docs/research/ACCESSIBILITY_CR_18_2.md` records semantics, H1 count, labels, focus, contrast, touch and reduced-motion evidence. |
| Mobile composition | FINAL PASS | `docs/research/BROWSER_E2E_CR_18_1.md` covers representative route/mobile behavior; `docs/research/UI_DRIFT_AUDIT_CR_19_2.md` records rendered HTML and responsive/code evidence. |
| Production-like budget | FINAL PASS / RELEASE REVALIDATE | `docs/research/PERFORMANCE_CR_18_3.md` records mobile LCP/CLS within thresholds on production-like static export. Production release must still re-smoke exact deployed artifact. |
| Scaling decision | ALLOWED WITH GUARDS | Page patterns may scale only through the approved remediation graph and claim/evidence gates. |

## 3. Visual Character

Characteristics:

- cold;
- strict;
- service-oriented;
- architectural/systemic;
- premium through order and whitespace.

Anti-goals:

- warm luxury;
- neon/glow;
- soft generic SaaS;
- aggressive lead-magnet styling;
- visual imitation of telecom interfaces;
- page-to-page visual reinvention.

## 4. Design Principles

1. One semantic section — one meaning.
2. The route and evidence come before decoration.
3. Product choice must be visible quickly.
4. Cards help compare and choose; they are not banners.
5. Accent is rare and functional.
6. Claims are visually subordinate to evidence.
7. New pages compose the existing system through `REUSE -> VARIANT -> CREATE`.

## 5. Token Ownership

The only source of exact visual values is `src/app/globals.css`.

This document owns policy and semantic roles, not duplicated numeric values. Source Northline values are migrated once and normalized into project-owned semantic tokens. Legacy `--ch-*` prefixes must not be retained blindly; names should describe purpose, not the previous project.

Required families only:

- semantic colors and surfaces;
- typography roles;
- `site` and `narrow` containers; `wide` only when justified;
- section rhythm `sm / md / lg / hero`;
- shadcn control radius plus card/large roles if used;
- borders and restrained shadows;
- aspect ratios actually used;
- motion easing if Tailwind defaults are insufficient.

Unused project tokens are removed. `chart-*` and `sidebar-*` are not created until those components exist.

### 5.1 Token disposition

| Token | Disposition | Owner / evidence |
|---|---|---|
| `text-display` | USED | AMS Northline semantic role for primary commercial hero and hub `h1` headings. |
| `--font-display` | USED | Semantic display-family alias used by headings, brand marks and card titles; currently resolves to the approved Manrope family. |
| `aspect-card` | REMOVED | No rendered owner or approved media composition. |
| `aspect-hero` | REMOVED | No rendered owner; current heroes are content-led grids. |
| `success` | RESERVED | EPIC 5 `LeadForm` success state owner. |
| `warning` | RESERVED | EPIC 5 `LeadForm` validation and recoverable warning state owner. |
| `shadow-panel` | USED | Elevated hero summaries, dark lead panels and the canonical form shell. |
| `radius-pill` | REMOVED | No rendered owner; pills use component-owned geometry only when introduced. |
| `ease-*` | REMOVED | No approved motion implementation consumes custom easing tokens. |

Brand tracking follows the semantic typography role; arbitrary `tracking-[...]` values are not used.

## 6. Color and Surfaces

Policy:

- primary light page surface;
- clean white elevated surface;
- soft cool-gray section surface;
- graphite-blue dark section surface;
- one restrained steel-blue accent;
- semantic success/warning/error colors used only for state.

Default page rhythm:

```text
dark hero -> light -> soft -> light -> dark CTA -> dark footer
```

Pure black, red primary accent, blue neon glow, multiple equal accents and uninterrupted white sections are prohibited.

## 7. Typography

Primary family: **Manrope**.

Implementation status:

- Cyrillic coverage: verified against official Manrope/Google font sources;
- license/source: SIL Open Font License 1.1, loaded through `next/font/google`;
- selected weights: `400`, `500`, `600`, `700`, `800`;
- canonical variable: `--font-app-sans`, bound to `--font-sans` and `--font-display`.

Approved semantic roles:

- `text-display`;
- `text-h1`;
- `text-h2`;
- `text-h3`;
- `text-body-lg`;
- `text-body`;
- `text-body-sm`;
- `text-label`;
- `text-caption`.

Headings are left-aligned by default. Centering is an explicit composition choice for a hero, statistic or final CTA. Long-form pages use the `narrow` container and an editorial profile derived from the same system.

## 8. Layout and Rhythm

- `Container(site)` owns normal commercial width and horizontal padding.
- `Container(narrow)` owns articles, legal text and focused forms.
- `Container(wide)` is introduced only for a proven wide visualization/table.
- `Section` owns vertical rhythm; pages do not hardcode random section padding.
- `SectionHeader` owns repeatable eyebrow/title/lead composition.

Approved compositions:

- split hero;
- route card grid;
- proof/case collection;
- 4/8 editorial split;
- 6/6 service panel;
- dark trust bar;
- final CTA slab.

## 9. Geometry and Shadows

- Controls, cards and panels are mostly rectilinear with restrained radii.
- Pills are reserved for badges, filters and compact status/CTA elements.
- Hairline borders are preferred over decorative depth.
- Shadows are neutral/cool and subtle.
- Colored glow and soft luxury depth are prohibited.

Exact radius mapping is established through the actual shadcn configuration and token fixture.

## 10. Components and Ownership

```text
shadcn primitives
  -> layout
      -> shared patterns
          -> domain components
              -> page-specific sections
                  -> page composition
```

Baseline foundation:

- `Button` at `src/ui/primitives/button.tsx`;
- `Card` at `src/ui/primitives/card.tsx` with `default`, `muted` and `dark` surface variants;
- project-owned `Input`, `Textarea`, `Checkbox` and `Label` at `src/ui/primitives/`, each with controlled `light` and `dark` surface variants;
- `Container` at `src/ui/shared/container.tsx`;
- `Section`;
- `SectionHeader` at `src/ui/shared/section-header.tsx`;
- `Header`;
- `Footer`;
- `MobileMenu`.

Product routes compose page-owned sections from `src/ui/pages/<product>/*-section.tsx`.
Their genuinely shared `Hero`, `Steps`, `FAQ` and `LeadSection` contracts live in
`src/ui/pages/shared/product-section.tsx`; copy arrays remain in the project content
layer and reach routes through `src/core/content/services/product-pages.ts`.

Shared patterns added only when used:

- `ProductRouteCard`;
- `CaseCard`;
- `ReviewCard`;
- `TariffCard/Table`;
- `FAQ`;
- `LeadForm`;
- `FinalCTA`;
- `Breadcrumbs`;
- loading/empty/error/success states where data interaction requires them.

### 10.1 Shared Patterns

| Pattern | Canonical owner | Reuse evidence / status |
|---|---|---|
| Page width | `src/ui/shared/container.tsx` | `site` and `narrow` variants own horizontal page bounds across shell, routes and editorial content. |
| Vertical section rhythm | `src/ui/shared/section.tsx` | `sm / md / lg / hero` variants replace route-local section padding. |
| Section heading | `src/ui/shared/section-header.tsx` | Owns eyebrow, semantic heading level, title, lead and light/dark tone. |
| Action control | `src/ui/primitives/button.tsx` | The only button/CTA primitive; internal actions compose it with `next/link`. |
| Content card | `src/ui/primitives/card.tsx` | `default / muted / dark` variants own comparable content surfaces. |
| Form controls | `src/ui/primitives/{input,textarea,checkbox,label}.tsx` | One light/dark control family consumed by the canonical `LeadForm`. |
| Lead form | `src/ui/forms/lead-form.tsx` | Single product/context-aware form shell; EPIC 5 owns interactive error/submitting/success states. |
| Product page sections | `src/ui/pages/shared/product-section.tsx` | Shared Hero, Steps, FAQ and Lead contracts; route copy remains in the content service. |
| Structured page blocks | `src/ui/blocks/` | Typed registry owns Hero, product routes, RichText and lead-form shell rendering. |
| Editorial body | `src/ui/content/rich-text.tsx` | Single Markdown renderer; internal URLs use `next/link`, safe external URLs use anchors. |
| Site navigation | `src/ui/shell/{site-header,mobile-menu,site-footer,breadcrumbs}.tsx` | Shared shell owns desktop/mobile navigation, internal links and breadcrumb layout. |

Patterns not present in runtime are not reserved as empty components. `CaseCard`,
`ReviewCard`, `TariffCard/Table`, generic state panels and `FinalCTA` are created
only when their second real consumer proves a stable shared contract.

No second Button/Input/Dialog/Card system, no universal page builder and no copied reusable semantic sections.

Intentional Card exceptions:

- navigation popovers and mobile-menu panels remain navigation shells, not content cards;
- dashed notices and compact inline callouts keep their own semantic element and do not become cards;
- long-form editorial shells and legal side panels keep their article/aside ownership until a shared editorial pattern exists;
- token fixtures stay explicit because they demonstrate raw token combinations;
- page-specific product/service shells that will be decomposed by T4.6 remain unchanged until their shared semantic pattern is established.

## 11. Product Route Cards

The three product cards are a core domain pattern. Each contains:

- clear product name;
- one concise outcome;
- one applicability marker;
- directional action;
- optional restrained diagram/icon.

Cards do not contain long descriptions or repeated generic CTA buttons. Hover uses border shift, light lift or inner-media motion without scaling the entire shell aggressively.

## 12. Buttons and CTA

Canonical primitive: one shadcn `Button` with project variants.

CTA copy names the outcome:

- `Получить расчёт`;
- `Рассчитать запуск`;
- `Проверить применимость`;
- `Провести аудит`;
- `Разобрать задачу`.

Generic weak labels such as `Подробнее`, `Узнать больше` or `Оставить заявку` are avoided when a specific action is known.

## 13. Forms

One canonical `LeadForm` supports product/context variants without duplicating field/control systems.

Required states:

- default;
- validation error;
- submitting;
- server error;
- success.

Forms look like service tools: clear border, restrained surface, visible focus, no aggressive lead-magnet decoration. Every error is visible and programmatically associated with its field.

## 14. Media and Graphics

Preferred media:

- real case evidence after anonymization/permission;
- restrained system/data-flow diagrams;
- business-process imagery relevant to the client scenario;
- authentic interface fragments only when legally and technically safe;
- simple line illustrations.

Avoid:

- generic stock handshakes and call-center smiles;
- residential/architectural photography copied from the previous domain without meaning;
- telecom logos or UI implying unauthorised affiliation;
- glowing data spheres, neon networks and decorative 3D charts;
- fake dashboards or fabricated results.

Icons use Lucide with one consistent stroke language.

## 15. Motion

- CSS/Tailwind transitions first.
- Default animated properties: opacity and transform.
- Light rise/fade, arrow shift, inner-image zoom and FAQ expand are acceptable.
- Bounce, showcase springs, shimmer, neon pulse and long reveal chains are prohibited.
- `prefers-reduced-motion` is mandatory.

## 16. Dark Mode

Global theme dark mode: **DISABLED**.

Intentional graphite dark sections are normal component variants, not a user/theme mode. Tailwind dark variant is class-based and `.dark` is not installed. Project-authored `dark:` styles are prohibited unless this decision changes.

## 17. Responsive Rules

- Product choice and primary CTA remain visible without horizontal overflow.
- Multi-column route/case grids collapse deliberately, not mechanically.
- Typography remains fluid within approved roles.
- Touch targets and form controls remain usable.
- Dark/light section rhythm is preserved on mobile.
- Table-like tariffs receive a mobile comparison pattern rather than a squeezed desktop table.

## 18. Accessibility

Minimum proof includes semantic HTML, one logical H1, heading hierarchy, keyboard navigation, visible focus, labels, linked errors, meaningful alt text, decorative empty alt, contrast, non-color state communication, touch targets and reduced motion.

## 19. Representative Page

`/` is the representative page because it includes:

- hero;
- three product route cards;
- proof/trust layer;
- cases and reviews;
- article/knowledge previews;
- CTA and lead form;
- multiple surface variants;
- responsive navigation.

The rest of the site is not scaled until this page and token fixture validate system fit.

## 20. Approved Exceptions

| ID | Date | Scope | Approved exception | Evidence / revisit trigger |
|---|---|---|---|---|
| `DS-EX-01` | 2026-10-02 | `src/ui/primitives/button.tsx`, `checkbox.tsx` | Installed shadcn/Radix primitive internals may keep state/data selectors and component-owned geometry/color-mix expressions. They are not project page-token APIs. | Revisit only during a primitive API/foundation upgrade; `UI_DRIFT_AUDIT_TC_T4_10.md`. |
| `DS-EX-02` | 2026-10-02 | route and semantic-section grid classes | Local responsive grid ratios remain allowed while compositions are heterogeneous; creating speculative layout tokens is prohibited. | Replace with a named variant when at least two sections share the same stable semantic contract; finding `UI-T4-10-001`. |
| `DS-EX-03` | 2026-10-02 | `src/app/page.tsx` | The representative homepage may remain a route-owned composition module; no universal page builder is introduced. | Revisit when the page changes materially or a second route proves reusable section ownership; finding `UI-T4-10-002`. |
| `DS-EX-04` | 2026-10-02 | `src/ui/foundation/token-fixture.tsx` | The token fixture may compose semantic tokens directly because its purpose is to demonstrate the token system. | Revisit when the fixture becomes a public runtime component. |
| `DS-EX-05` | 2026-10-02 | client leaves | `MobileMenu`, framework error handling and Radix-backed interactive primitives may use client boundaries; section/layout components remain server-first. | Revisit if a client boundary expands into a page or semantic section. |

Post-remediation evidence: `docs/research/UI_DRIFT_AUDIT_TC_T4_10.md` and
`docs/research/UI_DRIFT_AUDIT_ARTIFACTS_TC_T4_10.json`. The audit records zero
P0/P1 findings; its two P2 findings are bounded by `DS-EX-02` and `DS-EX-03`.

## 21. Design Intake Exit Criteria

- [x] exact stack and `components.json` are present;
- [x] Northline values are normalized into semantic tokens;
- [x] `globals.css` contains no speculative project roles;
- [x] Manrope Cyrillic/license/weights are verified;
- [x] token fixture compiles;
- [x] shadcn fixture compiles;
- [x] representative responsive homepage foundation is implemented;
- [x] accessibility and performance baseline are measured;
- [x] UI drift audit has no P0/P1 foundation findings.
