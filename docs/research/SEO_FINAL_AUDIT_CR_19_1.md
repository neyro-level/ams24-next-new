# CR-19.1 — Final SEO mechanical audit

Date: 2026-09-30
Task: `ams24r-cr-19-1`
Plan: `AMS24-CONSTITUTION-REMEDIATION-2026 v3`
Mode: `AUDIT + FULL + SITE`
Environment: local production-like static export, no production release
Exact base SHA: `b0735dfc384572d70e33ea07fc9a8ff291ea923e`

## Verdict

`PASS WITH FINDINGS`

No unresolved P0/P1 SEO drift was confirmed in the local static artifact. The audit found two non-blocking items:

- `SEO-19-001` — P2 release redirect limitation: full legacy `ams24.ru` redirect inventory is still an external release prerequisite.
- `SEO-19-002` — P3 artifact hygiene: static export contains duplicate noindex 404 artifacts.

The normalized crawl artifact is saved in `docs/research/SEO_CRAWL_ARTIFACTS_CR_19_1.json`.

## Coverage

| Surface | Result | Evidence |
|---|---|---|
| Static export | PASS | `corepack pnpm build` generated 23 static routes. |
| Structural HTML crawl | PASS | 22 exported HTML documents inspected: route, title, description, robots, canonical, OG, H1, JSON-LD and internal links. |
| Sitemap | PASS | `out/sitemap.xml` contains exactly 4 indexable production URLs: `/`, `/impuls/`, `/pixel/`, `/zashchita/`. |
| Robots | PASS | `out/robots.txt` allows public crawl and points to `https://ams24.ru/sitemap.xml`. |
| Metadata and OG | PASS | All sitemap/indexable pages have title, description, canonical, `index, follow`, one H1 and 6 OG tags. |
| Noindex pages | PASS | Legal, skeleton, draft/evidence, contact and support detail pages are `noindex, follow` and absent from sitemap. |
| Canonical policy | PASS | Public canonical URLs use `https://ams24.ru` and trailing slash where required. |
| Internal links | PASS | No broken internal links were found in the exported HTML. `/api/leads` was excluded as the approved relative form endpoint. |
| Cannibalization | PASS | No duplicated title/H1 was found among indexable pages. |
| Structured data | PASS | JSON-LD is absent because approved Organization/Product/Case facts are not yet sufficient; this matches `docs/07_SEO_SYSTEM.md` defer policy. |
| Redirect inventory | PASS WITH FINDING | Two known product redirects are present in `src/project/redirects.ts`; complete legacy inventory remains external release work (`SEO-19-001`). |

## Findings register

| ID | Priority | Layer | Root cause | Evidence | Safe disposition |
|---|---|---|---|---|---|
| SEO-19-001 | P2 | release redirects | Complete current `ams24.ru` legacy redirect inventory remains an external release prerequisite. | `src/project/redirects.ts` has only two approved long-product redirects; `docs/research/EXTERNAL_PREFLIGHT_EPIC_01_5.md` marks public legacy URL inventory partial; `EXT-05` forbids invented mass redirects. | Keep production migration blocked until redirect inventory is approved; no code fix inside CR-19.1. |
| SEO-19-002 | P3 | artifact hygiene | Next static export emits noindex 404 variants with duplicated title/H1. | `out/_not-found/index.html`, `out/404.html` and `out/404/index.html` all have noindex and H1 `Страница не найдена`; none are in sitemap and no broken links target them. | Accept as noindex static-export behavior or normalize 404 exposure at server release proof. |

## Route/indexability matrix

| Family | Representative routes | Expected policy | Observed policy | Verdict |
|---|---|---|---|---|
| Platform and products | `/`, `/impuls/`, `/pixel/`, `/zashchita/` | index, self-canonical, sitemap | index, self-canonical, sitemap | PASS |
| Commercial skeletons | `/tarify/`, `/raschety/` | noindex until owner/commercial proof | noindex, excluded from sitemap | PASS |
| Evidence skeletons | `/keisy/`, `/keisy/medical-case/`, `/otzyvy/` | noindex until evidence/permission proof | noindex, excluded from sitemap | PASS |
| Editorial and KB | `/stati/`, `/stati/kak-vybrat-produkt/`, `/baza-znaniy/`, `/baza-znaniy/impuls/kak-podgotovit-raschet/` | noindex until publication/usefulness gates close | noindex, excluded from sitemap | PASS |
| Trust/contact/legal | `/kontakty/`, `/o-kompanii/`, `/rekvizity/`, `/politika/`, `/soglasie/`, `/obrabotka-dannyh/` | noindex while legal/company/live-form approvals remain open | noindex, excluded from sitemap | PASS |
| System recovery | `/404`, `/404/`, `/_not-found/` | noindex, safe recovery links | noindex, safe recovery links | PASS WITH P3 |

## Checks actually run

```text
corepack pnpm build
corepack pnpm verify:content-graph
corepack pnpm guard:artifact
local Node.js structural crawl over out/**/*.html, out/sitemap.xml, out/robots.txt
```

Results:

- `corepack pnpm build` — PASS.
- `corepack pnpm verify:content-graph` — PASS.
- `corepack pnpm guard:artifact` — PASS, 137 text files scanned.
- Structural crawl — PASS WITH FINDINGS, P0=0, P1=0.

## Limitations

- This is a local static-export audit, not production replacement proof.
- Live `ams24.ru`, Yandex Webmaster, GSC/Topvisor and field Core Web Vitals were not used.
- Full legacy redirect inventory is intentionally not invented; it remains an external release prerequisite.
- Server headers, Nginx redirects and live slash normalization are covered by release/ops proof, not by this static artifact audit.

## Next safe step

Continue to CR-19.2 UI drift audit. CR-19.3 can then close the final P0/P1 ledger if UI audit also reports zero unresolved P0/P1 or valid dispositions.
