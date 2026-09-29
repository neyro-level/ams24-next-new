# Product Claim Register and Legal Brief — EPIC-05.1

Status: Active
Plan: `AMS24-IMPULSE-2026 v4`
Task: `EPIC-05.1`
Checked: 2026-09-29

This file is the human-readable evidence for product-page claims. The machine-readable register lives in `src/project/product-claims.ts`.

## Legal-review route

Named route for sensitive public claims:

```text
legal-review:OD-03
```

OD-03 remains open in `docs/04_BACKLOG.md`. Until the owner names a legal reviewer and the wording is approved:

- operator/data wording is `needs-review`;
- visitor identification wording is `needs-review`;
- case metrics and niche claims stay hidden until EPIC-06 evidence inventory;
- exact tariffs/prices wait for OD-02;
- absolute protection, guaranteed lead volume, guaranteed growth and universal contact price stay hidden.

## Claim register summary

| Claim ID | Product | Status | Public use |
|---|---|---|---|
| `platform-three-products` | platform | project-verified | allowed |
| `platform-operates-18-months` | platform | owner-provided-needs-evidence | needs review |
| `platform-many-cases-three-niches` | platform | owner-provided-needs-evidence | hidden |
| `impuls-operator-audiences` | impuls | legal-review-required | needs review |
| `impuls-calculation-required` | impuls | project-verified | allowed |
| `pixel-identifies-interested-visitors` | pixel | legal-review-required | needs review |
| `pixel-not-all-visitors` | pixel | project-verified | allowed |
| `zashchita-reduces-risk` | zashchita | project-verified | allowed with limitation |
| `zashchita-no-absolute-guarantee` | zashchita | project-verified | allowed |
| `forbidden-guaranteed-leads` | platform | unsupported-hidden | hidden |
| `forbidden-absolute-protection` | zashchita | unsupported-hidden | hidden |

## Page strategy implications

- `/impuls/` can use the core product promise only with cautious wording and a calculation CTA; exact operator/data/legal wording waits for OD-03.
- `/pixel/` must explain data/result boundaries and cannot imply identification of every visitor.
- `/zashchita/` must frame the offer as audit and risk reduction, not an absolute guarantee.
- Proof blocks must not use case metrics, named niches or reviews until EPIC-06 evidence inventory classifies them publishable.

## Stop / hide rules

If a claim has `publicationStatus: hidden`, product pages must not render it as public copy.

If a claim has `publicationStatus: needs-review`, product pages may use it only as draft/internal copy until the named legal/commercial route is resolved.
