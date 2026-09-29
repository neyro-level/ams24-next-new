# Initial Article and Knowledge Base Briefs — EPIC-07.2

Status: Active
Plan: `AMS24-IMPULSE-2026 v4`
Task: `EPIC-07.2`
Checked: 2026-09-29

This file records the release-minimum editorial brief set for EPIC-07. It is evidence for intent/source/product-link readiness only. It is not final article copy and does not publish any route.

## Release minimum

The approved first public release needs:

- 3 substantive articles;
- 3 knowledge-base instructions;
- at least one content item tied to each product;
- incomplete materials kept hidden/noindex.

Source: `docs/01_PRD.md`, section 9.

## Shared source ledger

| Source | Checked | Use | Status |
|---|---:|---|---|
| `docs/01_PRD.md` | 2026-09-29 | release minimum, business rules, forbidden guarantees | verified |
| `docs/02_PRODUCT_STRUCTURE.md` | 2026-09-29 | canonical URLs, page roles, demand clusters, internal linking | verified |
| `docs/research/COMPETITOR_SEO_BASELINE.md` | 2026-09-29 | baseline demand language and competitor architecture observations | partial |
| `https://leadlife.pro/datalead` | 2026-09-29 | market role check for competitor-lead/interception demand | partial |
| `https://leadlife.pro/wantlead` | 2026-09-29 | market role check for visitor-identification demand | partial |
| `https://leadlife.pro/stopparsing` | 2026-09-29 | market role check for protection/audit demand | partial |

`partial` means the source is useful for market/category structure, not for AMS factual claims, pricing, legal status, performance promises or case results.

## Article briefs

| ID | H1 | Intent | Target product/page | Sources |
|---|---|---|---|---|
| `article-impuls-operator-audiences` | Когда бизнесу подходит лидогенерация через аудитории операторов | Explain when the main acquisition product is applicable without replacing `/impuls/`. | `impuls` → `/impuls/` | PRD, Product Structure, SEO baseline, LEADLIFE DataLead |
| `article-pixel-visitor-identification` | Идентификация посетителей сайта: что проверить до установки пикселя | Explain site/traffic/data readiness before checking pixel applicability. | `pixel` → `/pixel/` | PRD, Product Structure, SEO baseline, LEADLIFE WantLead |
| `article-zashchita-lead-interception-risk` | Как понять, что лиды могут перехватывать, и с чего начать защиту | Explain symptoms, audit boundary and next safe step without absolute protection claims. | `zashchita` → `/zashchita/` | PRD, Product Structure, SEO baseline, LEADLIFE StopParsing |

## Knowledge-base briefs

| ID | H1 | Support task | Target product/page | Sources |
|---|---|---|---|---|
| `kb-impuls-prepare-calculation` | Как подготовить вводные для расчёта запуска Импульса | Gather niche, region, volume and delivery constraints before requesting a calculation. | `impuls` → `/impuls/` | PRD, Product Structure |
| `kb-pixel-site-readiness` | Как проверить сайт перед установкой пикселя | Check site access, key pages, events and data-processing prerequisites before installation. | `pixel` → `/pixel/` | PRD, Product Structure, LEADLIFE WantLead |
| `kb-zashchita-primary-audit` | Как подготовиться к первичному аудиту защиты лидов | Gather symptoms, channels and baseline lead reports before a protection audit. | `zashchita` → `/zashchita/` | PRD, Product Structure, LEADLIFE StopParsing |

## Forbidden claims for the set

- guaranteed lead count, conversion, launch time or contact price;
- absolute legality or privacy compliance before legal review;
- complete identification of every site visitor;
- absolute protection from interception;
- accusations against competitors without evidence;
- case metrics, niches or reviews without owner-provided evidence.

## Machine-readable contract

The typed brief set lives in `src/project/editorial-briefs.ts`.

Next tasks:

- `EPIC-07.3` uses article briefs to write/review initial articles.
- `EPIC-07.4` uses KB briefs to write/review initial instructions.
