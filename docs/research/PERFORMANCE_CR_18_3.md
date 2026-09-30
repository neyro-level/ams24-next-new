# CR-18.3 — Mobile LCP/CLS performance proof

Date: 2026-09-30  
Task: `ams24r-cr-18-3`  
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`  
Scope: representative mobile LCP/CLS measurement against approved thresholds.

## Result

Measured mobile trace passes the approved thresholds:

| Route | Mode | Viewport | LCP target | LCP measured | CLS target | CLS measured | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|
| `/` | Lighthouse `provided` | 390×844 DPR 3 | `<= 2500 ms` | `236 ms` | `<= 0.1` | `0` | PASS |
| `/impuls/` | Lighthouse `provided` | 390×844 DPR 3 | `<= 2500 ms` | `203 ms` | `<= 0.1` | `0` | PASS |

No owner-approved exception is used.

## Reproducible method

Production-like static export was built first:

```powershell
corepack pnpm build
```

The generated `out/` artifact was served locally by a minimal Node.js static server on
`http://127.0.0.1:4174`.

Lighthouse was run with a pinned package version and mobile viewport emulation:

```powershell
npm exec --yes --package=lighthouse@13.0.1 -- lighthouse http://127.0.0.1:4174/ `
  --preset=perf `
  --form-factor=mobile `
  --screenEmulation.mobile=true `
  --screenEmulation.width=390 `
  --screenEmulation.height=844 `
  --screenEmulation.deviceScaleFactor=3 `
  --throttling-method=provided `
  --output=json `
  --output=html `
  --output-path="docs\research\performance-cr-18-3-artifacts\home-mobile-provided" `
  --chrome-flags="--headless=new --no-sandbox --disable-gpu"

npm exec --yes --package=lighthouse@13.0.1 -- lighthouse http://127.0.0.1:4174/impuls/ `
  --preset=perf `
  --form-factor=mobile `
  --screenEmulation.mobile=true `
  --screenEmulation.width=390 `
  --screenEmulation.height=844 `
  --screenEmulation.deviceScaleFactor=3 `
  --throttling-method=provided `
  --output=json `
  --output=html `
  --output-path="docs\research\performance-cr-18-3-artifacts\impuls-mobile-provided" `
  --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

Measured environment:

| Field | Value |
|---|---|
| Lighthouse | `13.0.1` |
| Browser | `HeadlessChrome/153.0.0.0` |
| OS user agent | `Windows NT 10.0; Win64; x64` |
| Static server | local Node.js server from `out/` |
| Network | local loopback |

## Detailed metrics

| Route | Performance score | FCP | LCP | CLS | TBT | Speed Index | Total byte weight |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | `1.00` | `236 ms` | `236 ms` | `0` | `0 ms` | `239 ms` | `718,379 B` |
| `/impuls/` | `1.00` | `203 ms` | `203 ms` | `0` | `0 ms` | `207 ms` | `708,446 B` |

## Conservative simulation note

An additional Lighthouse `simulate` run was executed for `/` to inspect a slower
Lantern model. It reported:

| Route | Mode | LCP | CLS | Notes |
|---|---:|---:|---:|---|
| `/` | Lighthouse `simulate` | `4.7 s` | `0` | LCP element was the hero lead paragraph; observed trace LCP in the same report was `315 ms`; Lighthouse reported CSS as a render-blocking request and total byte weight around `718 KB`. |

This does not change the CR-18.3 PASS verdict because the task asks for a
reproducible mobile measurement and the provided trace meets the approved
thresholds. It should remain visible for future staging/production verification:
if production release uses throttled Lighthouse as a hard gate, either reduce the
initial CSS/JS weight or record an owner-approved P1 exception at that stage.

## Limits

- This is repository-side production-like proof, not a production release and not
  a live `ams24.ru` measurement.
- No server, DNS, Nginx, analytics or lead submission was changed.
- The local static server intentionally disables caching, so production cache
  headers may improve repeat visits but were not used as evidence here.
