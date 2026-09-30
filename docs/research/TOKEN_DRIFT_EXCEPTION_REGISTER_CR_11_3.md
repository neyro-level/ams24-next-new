# Token Drift Exception Register — CR-11.3

Status: Complete classification  
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`  
Task: `CR-11.3`  
Date: 2026-09-30  
Mode: mechanical scan + exception list; no browser or production proof.

## Result

`CR-11.3` classifies the current token/drift surface after `CR-11.2`.

- Raw color bypass outside token source: **PASS / none found**.
- Tailwind `dark:` utility drift: **PASS / fixed**.
- Arbitrary values: **classified**, with explicit exceptions below.
- Dead-token candidates: **classified**, not deleted in this task because several are Tailwind/shadcn semantic bridge tokens and require visual/build proof before removal.

## Mechanical Scan Evidence

```text
rg -n "#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|oklch\(" src -S -g '!**/globals.css'
Result: none

rg -n -P "(?<![A-Za-z-])dark:" src -S
Result: none

rg -n "\[[^\]]+\]" src -S -g '*.tsx'
Result: classified below
```

Token source:

```text
src/app/globals.css
```

## Fixed Drift

| Drift | Previous evidence | Fixed by | Current status |
|---|---|---|---|
| Project-owned Button had Tailwind `dark:` branches while global dark mode is disabled | `src/ui/primitives/button.tsx` used `dark:*` in base/outline/ghost/destructive variants | `CR-11.2` commit `ded7fc3330a40bd328702fa27cc9eda32e05b07e` | fixed; scan for Tailwind `dark:` returns none |
| Repeated dark-section outline CTA class bundle on page-level links | `h-12 border-surface-dark-faint bg-transparent px-5 ...` appeared across commercial pages | `Button` variant `outlineDark` + size `xl` | fixed; old fixed-string scan returns none |

## Raw Color Classification

| Area | Evidence | Classification | Decision |
|---|---|---|---|
| `src/app/globals.css` raw hex/rgb values | color values are defined in `:root` and bridged through `@theme inline` | token source, allowed | `KEEP_EXCEPTION` |
| TSX / TS / component files | raw color scan excluding `globals.css` returns none | no bypass | `PASS` |

## Arbitrary Value Classification

| Severity | File / pattern | Evidence | Classification | Decision |
|---|---|---|---|---|
| P2 | `src/app/**` product and platform pages | repeated `lg:grid-cols-[...]` ratios remain in page composition | layout variant candidate, not raw visual token bypass | `VARIANT`; consolidate in CR-11.4/Card/Layout remediation after page structure stabilizes |
| P2 | `src/ui/shell/site-footer.tsx` | `lg:grid-cols-[0.9fr_1.4fr]` | shell-specific layout ratio | `KEEP_EXCEPTION` until footer redesign or shell layout primitive |
| P2 | `src/ui/legal/legal-page.tsx` | `lg:grid-cols-[0.8fr_1.2fr]` | legal-page composition ratio | `KEEP_EXCEPTION`; single template owns this layout |
| P2 | `src/ui/shell/site-header.tsx` | `tracking-[-0.03em]` on logo | typography token intent exists, but no reusable logo wordmark variant yet | `VARIANT`; move into logo/wordmark component if repeated |
| P2 | `src/ui/primitives/button.tsx` | `hover:bg-[color-mix(...)]`, `rounded-[min(...)]`, `text-[0.8rem]`, svg arbitrary selectors | primitive-level shadcn/Tailwind API implementation, not page bypass | `KEEP_EXCEPTION`; Button owns these internals |
| none | TypeScript arrays / tuple destructuring / regex patterns | `[...]` matches in data arrays, type indexed access and regex | false positive from mechanical scan | `PASS` |

## Dead Token Candidate Classification

The direct usage scan counts literal source references outside `globals.css`.
Some `@theme inline` tokens are intentionally consumed by Tailwind class names
or kept for shadcn compatibility, so zero literal references are not enough to
delete them.

| Token group | Evidence | Classification | Decision |
|---|---|---|---|
| shadcn compatibility tokens: `card-foreground`, `popover`, `popover-foreground`, `input`, `ring`, `destructive` | required by shadcn-compatible primitive/theme contract; some are low-use until more primitives land | bridge tokens | `KEEP_EXCEPTION` |
| semantic color tokens: `accent`, `accent-foreground`, `success`, `warning` | zero direct TSX use in current scan | dead-token candidates | `VARIANT`; keep until status/alert/form states are implemented or removed with browser proof |
| aspect/easing tokens: `aspect-card`, `aspect-hero`, `ease-standard`, `ease-out-soft` | zero direct TSX use in current scan | future foundation candidates | `VARIANT`; keep until media/card/motion tasks decide usage |
| generated `--color-*`, text line-height, letter-spacing and container bridge tokens | zero literal TSX use expected because Tailwind consumes classes such as `text-h1`, `max-w-site`, `bg-surface` | generated bridge | `KEEP_EXCEPTION` |
| radius tokens beyond current use: `radius-xs`, `radius-sm`, `radius-lg`, `radius-xl`, `radius-pill` | no direct page references yet | scale tokens for shadcn/future primitives | `KEEP_EXCEPTION` unless later dead-token cleanup proves removal safe |

## Exception List

| Exception | Owner | Expiry / follow-up | Reason |
|---|---|---|---|
| Page-level arbitrary grid ratios remain | implementation | CR-11.4 or first Card/Layout remediation | needs layout primitive decision and visual proof |
| Button primitive arbitrary selectors and `color-mix` remain | primitive owner | next Button API review | internal primitive implementation; not duplicated on pages |
| Zero-use semantic state tokens remain | Design System owner | first alert/status/form-state implementation or dead-token cleanup | deleting now may weaken shadcn/theme bridge without visual proof |
| Raw color values remain in `globals.css` | Design System owner | permanent token-source exception | numeric values must live somewhere; `globals.css` is current token source |

## Current Risk

No P0 token drift remains from this scan. Remaining P2 items are classified and
bounded. The largest follow-up is still the `CR-11.1` finding: repeated
Card/Panel composition should become a shared primitive before adding more page
templates.

## Not Checked

- browser screenshots;
- computed CSS;
- Lighthouse;
- full dead-code/token tree-shaking proof;
- visual regression.
