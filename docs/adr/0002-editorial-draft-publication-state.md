# ADR-0002: Editorial draft publication state

Status: Accepted
Date: 2026-10-01

## Context

Product and page records describe approved commercial routes, so their runtime
states are only `published` or `hidden`. Articles, knowledge-base entries and
cases already have an intentional Git-based preparation workflow: content can
exist before its evidence, copy and SEO review are complete.

Removing `draft` from those editorial entities would either discard useful
work-in-progress content or force it into a misleading published state.

## Decision

Editorial entities retain `draft | published | hidden`. A draft must use
`noindex`, is excluded from the sitemap and is excluded from generated article
and knowledge-base route parameters. Sitemap-eligible published entities must
have `updatedAt`; the sitemap emits that value as `lastModified`.

Products and pages use only `published | hidden` and always carry `slug` and
`updatedAt`. Canonical route identity is unique by `(locale, path)`.

## Consequences and revisit trigger

Draft editorial content remains reviewable in Git and tests without becoming a
public static route. Publishing is deliberately fail-closed: changing a record
to `published` requires index policy, timestamp and route-rendering support to
pass verification.

Revisit this decision only if an approved CMS or editorial workflow replaces
the local Git content repository. The replacement must preserve equivalent
noindex, route-generation and sitemap guards.
