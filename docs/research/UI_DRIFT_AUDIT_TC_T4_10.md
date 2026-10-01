# UI Drift Audit — T4.10

Status: `PASS WITH P2 FINDINGS`  
Mode: `READ-ONLY AUDIT`  
Date: 2026-10-02  
Base SHA: `8959b80d2b75236d02e4ce1d8123911516937a4d`

## Scope and evidence

Post-remediation audit after T4.1–T4.9 and T4.12. Evidence came from the
current Design System and token source, `components.json`, code search over
`src/app`, `src/ui` and `src/core`, a clean static build, and inspection of all
21 generated HTML documents.

| Severity | File | Location | Finding | Evidence / rule | Recommended action |
|---|---|---|---|---|---|
| P2 | `src/app/page.tsx`; `src/app/kontakty/page.tsx`; `src/app/raschety/page.tsx`; `src/ui/legal/legal-page.tsx`; `src/ui/pages/**`; `src/ui/shell/site-footer.tsx` | responsive grid compositions | Fifteen route or semantic-section grid ratios remain as local arbitrary values. | The values are semantic composition choices rather than token bypasses, but repeated page-specific values are a drift risk under checklist item 16. | Keep the dated exception while structures remain heterogeneous; introduce a named layout variant only when at least two sections share the same stable contract. |
| P2 | `src/app/page.tsx` | 1–264 | The representative homepage remains a large composition module. | Product routes were decomposed by T4.6, while the homepage still owns 264 lines of route composition; checklist item 12 flags future growth risk. | Decompose only through a separate scoped task when a section changes or a second route proves reuse; do not introduce a universal page builder. |

No P0 or P1 finding exists. Both P2 findings are bounded, documented and do
not block T4.10.

## Top risks

1. More local grid ratios could make responsive tuning inconsistent.
2. Further homepage growth could blur page composition and shared-pattern ownership.
3. Primitive upstream selectors could be mistaken for project token bypass without the exception register.
4. Future interactive sections could expand client boundaries beyond leaf components.
5. Reserved success/warning tokens must acquire their EPIC 5 form-state owner or be removed.

## Summary

```text
TOKENS / DEAD TOKENS: PASS — no unowned token family; T4.8 disposition is current.
COMPONENT DUPLICATION: PASS — one Button/Card/form-control primitive tree.
PAGE OR SCREEN COMPOSITION: PASS WITH P2 — homepage size and local grid ratios remain bounded.
SERVER / CLIENT: PASS — client boundaries are error handling, Radix leaves and MobileMenu.
RESPONSIVE / STATES: PASS WITH P2 — no generated overflow evidence; local grid ratios remain tracked.
ACCESSIBILITY: PASS — every generated HTML document has one main and one h1; no positive tabindex.
SEO / PAGE CONTRACT: PASS — static build and existing route/metadata guards are green.
MEDIA / PERFORMANCE: PASS FOR CURRENT SCOPE — no img tags or eager media surface exists.
PORTABILITY COUPLING: PASS — reusable UI has no DB client or persistence model dependency.
UNRECORDED EXCEPTIONS: NONE — current exceptions are registered in the Design System.
NOT CHECKED: production rendering, real-device Safari, deployed analytics and live lead submission.
```

