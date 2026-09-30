# CR-19.2 — Final UI drift audit

Date: 2026-09-30
Task: `ams24r-cr-19-2`
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`
Mode: `READ-ONLY AUDIT`
Environment: local production-like static export
Base SHA: `0b8d934a9e93c06d436a32caec7559bbaa26319e`

## Verdict

`PASS WITH FINDINGS`

No unresolved P0/P1 UI drift was confirmed. The remaining issues are tracked P2/P3 cleanup or foundation-review candidates and do not require code changes inside this read-only audit task.

Machine-readable evidence is saved in `docs/research/UI_DRIFT_AUDIT_ARTIFACTS_CR_19_2.json`.

## Findings register

| Severity | File | Location | Finding | Evidence/rule | Recommended action |
|---|---|---|---|---|---|
| P2 | `src/app/page.tsx`, `src/app/impuls/page.tsx`, `src/app/pixel/page.tsx`, `src/app/zashchita/page.tsx`, `src/app/raschety/page.tsx`, `src/app/kontakty/page.tsx`, `src/ui/legal/legal-page.tsx`, `src/ui/shell/site-footer.tsx` | repeated `lg:grid-cols-[...]` | Route-local arbitrary grid ratios remain across route compositions. | `rg` found repeated `lg:grid-cols-[0.8fr_1.2fr]`, `lg:grid-cols-[0.95fr_1.05fr]`, `lg:grid-cols-[1fr_1fr]`, hero `minmax` ratios. This is already classified as P2 in `TOKEN_DRIFT_EXCEPTION_REGISTER_CR_11_3.md` and `UI_PRIMITIVE_TOKEN_DUPLICATION_INVENTORY_CR_11_1.md`. | Consolidate into named layout variants only after route structures stabilize. |
| P2 | `src/app/page.tsx`, `src/app/impuls/page.tsx`, `src/app/pixel/page.tsx`, `src/app/zashchita/page.tsx` | page modules 196-253 lines | Primary routes remain long composition modules. | CR-10 ownership matrix allows route-local composition and explicitly forbids premature universal builders; no runtime or ownership break confirmed. | Decompose later only if stable repeated semantic sections become implementation pressure. |
| P3 | `src/ui/primitives/button.tsx` | primitive internals | Button uses primitive-level arbitrary selectors/radius/color-mix internals. | Already recorded as `KEEP_EXCEPTION` in `TOKEN_DRIFT_EXCEPTION_REGISTER_CR_11_3.md`; this is inside the primitive owner, not page-level bypass. | Revisit during Button API/foundation review only. |

## Audit checklist summary

```text
TOKENS / DEAD TOKENS:
PASS WITH P2. No raw hex/rgb/hsl/oklch in TS/TSX. Numeric values remain centralized in src/app/globals.css as the token source. Repeated route-local grid ratios remain tracked P2 layout-variant candidates.

COMPONENT DUPLICATION:
PASS WITH FINDINGS. No second Button/Input/Dialog/Card/Table primitive tree found. Shared files are limited to Button, Container, Section, LeadForm and approved templates. Product page section shapes repeat, but CR-10 keeps them route-local until reuse is proven.

PAGE OR SCREEN COMPOSITION:
PASS WITH P2. Primary commercial routes are still long page-composition files, but they are route owners and do not create a second page-builder layer.

SERVER / CLIENT:
PASS. Only src/app/error.tsx uses 'use client', which is required for the Next error reset handler. No section/layout-level unnecessary client boundary found.

RESPONSIVE / STATES:
PASS WITH P2. Responsive grids are present and static export builds. Repeated arbitrary grid ratios remain the main cleanup candidate. LeadForm disabled state remains visible and intentionally safe.

ACCESSIBILITY:
PASS. Rendered export check found exactly one main and one h1 on every exported HTML page, zero positive tabindex, native details/summary navigation and labelled lead forms on form pages.

SEO / PAGE CONTRACT:
PASS. CR-19.1 covers SEO artifact detail; this UI audit confirms 404/error/legal/contact surfaces render one h1 and route recovery links.

MEDIA / PERFORMANCE:
PASS. No project `<img>` tags found in TS/TSX; no eager gallery or heavy hero client component found.

PORTABILITY COUPLING:
PASS WITH WATCH. UI components import approved content service view models/types according to the route ownership matrix; no raw project content/local adapter import in UI was found.

UNRECORDED EXCEPTIONS:
PASS. Arbitrary grid and Button primitive exceptions are already recorded in CR-11 evidence; no new unrecorded P0/P1 exception found.

NOT CHECKED:
Pixel-perfect visual screenshots, live production behavior, external fonts/network waterfall and field performance were not re-run here. CR-18 already contains browser, accessibility and mobile performance evidence for representative routes.
```

## Evidence commands

```text
corepack pnpm build
rg for raw colors, arbitrary values, inline styles, dark classes, use client, img tags
rg for duplicate primitives/shared files
rg for known exception records in CR-10/CR-11 evidence
local Node.js rendered HTML summary over out/**/*.html
```

Confirmed outputs:

- Build generated 23 static routes.
- Raw colors in TS/TSX: none.
- Inline styles: none.
- Project `dark:` classes: none.
- Project `<img>` tags: none.
- `"use client"`: only `src/app/error.tsx`.
- Rendered HTML: 22 HTML pages checked; all have one `<main>`, one `<h1>`, zero positive `tabindex`.

## Next safe step

Continue to CR-19.3. It can close the final P0/P1 ledger if it accepts CR-19.1 and CR-19.2 as zero-P0/zero-P1 with only P2/P3 tracked findings.
