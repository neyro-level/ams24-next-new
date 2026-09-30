# CR-18.2 — Accessibility proof

Date: 2026-09-30
Task: `ams24r-cr-18-2`
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`
Scope: semantics, keyboard, focus, labels, errors, contrast, alt, touch and reduced motion.

## Result

PASS after remediation.

The first automated scan found a real `color-contrast` failure on representative
dark and light surfaces. The fix:

- darkened the project primary token from `#5f7fae` to `#4f6f9b`;
- raised dark-section subdued text tokens:
  `--surface-dark-muted` from `62%` to `74%` and
  `--surface-dark-faint` from `38%` to `62%`;
- added explicit dark tone support to `SectionHeader`;
- applied dark `SectionHeader` tone to `/kontakty/` and legal page heroes.

No production, server, lead submission, analytics or release state was changed.

## Automated scan

Production-like static export was built first:

```powershell
corepack pnpm build
```

The generated `out/` artifact was served locally on `http://127.0.0.1:4176`.
Lighthouse accessibility was run with pinned `lighthouse@13.0.1` and a mobile
viewport of `390×844`, DPR `3`.

| Route | Lighthouse category | Score | Failed audits | Verdict |
|---|---:|---:|---:|---|
| `/` | accessibility | `1.00` | `0` | PASS |
| `/impuls/` | accessibility | `1.00` | `0` | PASS |
| `/kontakty/` | accessibility | `1.00` | `0` | PASS |
| `/politika/` | accessibility | `1.00` | `0` | PASS |

Representative command:

```powershell
npm exec --yes --package=lighthouse@13.0.1 -- lighthouse http://127.0.0.1:4176/ `
  --only-categories=accessibility `
  --form-factor=mobile `
  --screenEmulation.mobile=true `
  --screenEmulation.width=390 `
  --screenEmulation.height=844 `
  --screenEmulation.deviceScaleFactor=3 `
  --output=json `
  --output-path="docs\research\accessibility-cr-18-2-artifacts-fixed\home-a11y" `
  --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

## Keyboard and manual matrix

| Surface | Evidence | Verdict |
|---|---|---|
| Landmarks and semantics | Exported `/`, `/impuls/`, `/kontakty/`, `/politika/` and `404.html` each contain one `<main>` and one `<h1>`. | PASS |
| Heading baseline | Representative pages preserve one logical H1. Existing content tests also cover route/page heading contracts. | PASS |
| Header/mobile navigation | Header uses native `<details>` / `<summary>` controls for product and mobile navigation. Exported representatives contain two details/summary pairs and no positive `tabindex`. | PASS |
| Focus visibility | Compiled CSS contains `focus-visible` rules for header controls, buttons and form controls; DOM summary found no `tabindex` greater than `0`. | PASS |
| Lead form labels | `/`, `/impuls/` and `/kontakty/` export four `<label>` elements and seven form controls each; Lighthouse `label` audit passed. | PASS |
| Disabled/error-safe form state | Lead form remains disabled-safe from CR-13 and CR-18.1: fields exist, submission is disabled, and no live PII request is sent. Error-state ownership remains in the frontend shell and AMS Leads API contract until external approvals close. | PASS |
| Contrast | Initial scan failed `color-contrast`; token and dark-header fixes brought all scanned routes to score `1.00` with zero failed contrast audits. | PASS |
| Alt/media | Lighthouse `image-alt` passed on scanned routes. Current representative pages do not rely on inaccessible hero images. | PASS |
| Touch targets | Lighthouse `target-size` passed on scanned mobile viewport. CTA and summary controls remain at project control sizes. | PASS |
| Reduced motion | `src/app/globals.css` contains a `prefers-reduced-motion: reduce` block that disables long transitions/animations. | PASS |
| 404 accessibility | Real 404 behavior was browser-proven in CR-18.1. Lighthouse rejects HTTP 404 status as an errored document request, so `404.html` was checked by DOM/manual summary: one `<main>`, one `<h1>`, native nav controls and no positive `tabindex`. | PASS |

## DOM summary used for manual proof

| Artifact | h1 | main | labels | controls | details/summary | positive tabindex |
|---|---:|---:|---:|---:|---:|---:|
| `out/index.html` | `1` | `1` | `4` | `7` | `2 / 2` | `0` |
| `out/impuls/index.html` | `1` | `1` | `4` | `7` | `2 / 2` | `0` |
| `out/kontakty/index.html` | `1` | `1` | `4` | `7` | `2 / 2` | `0` |
| `out/politika/index.html` | `1` | `1` | `0` | `0` | `2 / 2` | `0` |
| `out/404.html` | `1` | `1` | `0` | `0` | `2 / 2` | `0` |

## Limits

- This is repository-side production-like proof, not a production release and not
  a live `ams24.ru` audit.
- Lighthouse is an automated baseline; it does not replace a future assistive
  technology pass before a production release.
- Live lead submission remains out of scope until legal/API/anti-spam approvals
  are explicitly closed.
