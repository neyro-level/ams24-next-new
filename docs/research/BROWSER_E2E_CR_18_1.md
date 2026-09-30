# Browser E2E Report — CR-18.1

Date: 2026-09-30  
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`  
Task: `CR-18.1 — browser E2E covers representative route/navigation/404/lead surfaces`

## Scope

Repository-side, production-like browser proof only. No production host, DNS,
Nginx, AMS Leads API, analytics account or secret was accessed.

## Environment

- Worktree: `task/cr-18-1`
- Base SHA: `5cf94af4fd08c6dbd32d260c7f21203016624e92`
- Build command: `corepack pnpm build`
- Built artifact: `out/`
- Local static server: `http://127.0.0.1:4173/`
- Browser tool: Playwright MCP against the local static artifact

## Build proof

`corepack pnpm build` passed and generated 23 static pages, including:

- `/`
- `/impuls/`
- `/pixel/`
- `/zashchita/`
- `/stati/kak-vybrat-produkt/`
- `/baza-znaniy/impuls/kak-podgotovit-raschet/`
- `/keisy/medical-case/`
- `/robots.txt`
- `/sitemap.xml`

## Desktop browser route matrix

| Surface | Browser result |
|---|---|
| `/` | `200`, title `Импульс — маркетинговые продукты AMS24`, one `h1` |
| `/impuls/` | `200`, one `h1`, canonical product page loads |
| `/pixel/` | `200`, one `h1`, canonical product page loads |
| `/zashchita/` | `200`, one `h1`, canonical product page loads |
| `/stati/kak-vybrat-produkt/` | `200`, one `h1`, representative article loads |
| `/baza-znaniy/impuls/kak-podgotovit-raschet/` | `200`, one `h1`, representative KB page loads |
| `/keisy/medical-case/` | `200`, one `h1`, representative case page loads |
| `/missing-browser-proof/` | `404`, custom 404 HTML returned |
| `/impuls` | browser fetch observed redirect behavior for trailing slash normalization |

## Navigation proof

Homepage browser inspection confirmed internal navigation links to:

- `/`
- `/impuls/`
- `/pixel/`
- `/zashchita/`
- `/tarify/`
- `/keisy/`
- `/otzyvy/`
- `/stati/`
- `/baza-znaniy/`
- `/#lead-form`

## Mobile browser proof

Viewport: `390x844`.

- Horizontal overflow: `false`.
- One logical homepage `h1`: `Импульс`.
- Product route cards remain reachable as internal links.
- Footer and lead-form legal links remain reachable.
- The visible lead form remains usable as a disabled-safe surface without live submission.

## Lead form proof

Browser inspection on `/` confirmed:

- form action: `/api/leads`;
- method: `post`;
- controls found: `8`;
- disabled controls: `5`;
- labels present: `Имя`, `Контакт`, `Какая задача сейчас важнее?`, consent/legal label;
- legal links to `/soglasie/` and `/politika/` are present.

This proves the browser surface is wired to the relative endpoint while live
submission remains disabled-safe.

## Console notes

Observed console errors:

1. `/favicon.ico` returned `404`.
2. `/missing-browser-proof/` returned `404` during the intentional 404 check.

The second item is expected evidence for the 404 path. The favicon miss is not
part of the CR-18.1 route/navigation/404/lead acceptance surface and is recorded
as a non-blocking follow-up candidate for final polish.

## Verdict

`CR-18.1` browser proof is `PASS` for representative route, navigation, mobile,
404, trailing-slash and disabled-safe lead surfaces on the production-like static
artifact.

This does not authorize production release. Accessibility depth, performance
thresholds and final UI/SEO drift remain owned by later `CR-18.*` / `CR-19.*`
tasks.
