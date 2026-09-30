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
Representative page: /
Design Intake completed: FOUNDATION ONLY
```

Design intake closed for the representative foundation only. Full semantic
heading, accessibility, performance and UI drift proof remains open in the
approved remediation graph.

### 2.1 Intake Evidence

Date: 2026-09-29
Scope: `EPIC-02.4`

| Check | Status | Evidence |
|---|---|---|
| No P0/P1 design drift | FOUNDATION PASS / FINAL OPEN | Homepage uses AMS Northline tokens and local tests rejected known foundation drift markers. Full site UI drift is still owned by `CR-19.*`. |
| Keyboard and semantic access | PARTIAL / FINAL OPEN | Primary actions and form shell have baseline semantics, but `CR-00.1` confirms `SectionHeader` heading-level drift; full accessibility proof is owned by `CR-05.*` and `CR-18.*`. |
| Mobile composition | FOUNDATION PASS / FINAL OPEN | Representative page uses responsive grid contracts. Full responsive route proof remains in browser/integrated proof tasks. |
| Production-like budget | HISTORICAL / REVALIDATE | Historical v4 `pnpm verify` evidence exists, but remediation changed the compliance target; release proof must be rerun after `CR-15.*` and `CR-18.*`. |
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
- required form primitives;
- `Container` at `src/ui/shared/container.tsx`;
- `Section`;
- `SectionHeader` at `src/ui/shared/section.tsx`;
- `Header`;
- `Footer`;
- `MobileMenu`.

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

No second Button/Input/Dialog/Card system, no universal page builder and no copied reusable semantic sections.

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

None. Any exception requires owner decision and a dated entry here.

## 21. Design Intake Exit Criteria

- [x] exact stack and `components.json` are present;
- [x] Northline values are normalized into semantic tokens;
- [x] `globals.css` contains no speculative project roles;
- [x] Manrope Cyrillic/license/weights are verified;
- [x] token fixture compiles;
- [x] shadcn fixture compiles;
- [x] representative responsive homepage foundation is implemented;
- [ ] accessibility and performance baseline are measured;
- [ ] UI drift audit has no P0/P1 foundation findings.
