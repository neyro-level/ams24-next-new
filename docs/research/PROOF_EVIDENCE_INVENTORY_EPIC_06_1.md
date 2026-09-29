# Proof Evidence Inventory — EPIC-06.1

Status: Active  
Plan: AMS24-IMPULSE-2026 v4  
Task: EPIC-06.1  
Updated: 2026-09-29

## Purpose

This inventory prevents tariffs, cases and reviews from becoming public before they have evidence and permission state.

Source of truth:

- `docs/01_PRD.md#9-scope-первого-публичного-релиза`
- `docs/01_PRD.md#12-business-rules`
- `docs/02_PRODUCT_STRUCTURE.md#11-supporting-page-contracts`
- `docs/04_BACKLOG.md#OD-01`
- `docs/04_BACKLOG.md#OD-02`
- `docs/04_BACKLOG.md#OD-04`

## Current decision

No tariff, calculation, case or review item is publishable yet.

Reason:

- OD-01 is open: exact three niches and case scope are not attached.
- OD-02 is open: approved tariffs, pricing model and commercial limitations are not attached.
- Case source, period, methodology, metrics and publication permission are not attached.
- Review source, identity/anonymization mode and publication permission are not attached.

Therefore all EPIC-06.1 inventory items are classified as `hidden`.

## Release-minimum slots

| Slot | Planned item | Status | Required before publish |
|---|---|---|---|
| case-1 | case for confirmed niche/product 1 | hidden | niche, period, source, method, metrics, permission |
| case-2 | case for confirmed niche/product 2 | hidden | niche, period, source, method, metrics, permission |
| case-3 | case for confirmed niche/product 3 | hidden | niche, period, source, method, metrics, permission |
| review-1 | attributable or transparently anonymized review | hidden | source, identity/anonymization, permission |
| review-2 | attributable or transparently anonymized review | hidden | source, identity/anonymization, permission |
| review-3 | attributable or transparently anonymized review | hidden | source, identity/anonymization, permission |

## Tariffs and calculations

Tariffs and calculation examples remain hidden until OD-02 is resolved.

Planned placeholders:

- `tariff-impuls-personal-calculation`
- `tariff-pixel-readiness-check`
- `tariff-zashchita-audit`
- `calculation-impuls-launch-assumptions`

They can be used by later implementation tasks as internal slots, but they must not become indexable/public tariff copy until commercial rules are approved.

## Machine-readable inventory

The executable inventory lives in `src/project/proof-inventory.ts`.

Validation is covered by `tests/content/proof-inventory.test.ts`.
