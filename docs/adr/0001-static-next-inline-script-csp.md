# ADR-0001: CSP for static Next.js inline bootstrap scripts

Status: Accepted
Date: 2026-10-01

## Context

The exported Next.js artifact contains inline bootstrap scripts needed for
hydration. Two consecutive clean builds each produced 48 inline-script
occurrences across 22 HTML files. The page-specific script at index 9 changed
in every HTML page between the builds, so a repository-owned hash allowlist
would become stale on the next build and cannot protect the exact artifact.

## Decision

Nginx CSP permits `'unsafe-inline'` only in `script-src`, alongside the existing
`'self'` and Yandex Metrica origin. `unsafe-eval` remains forbidden. The
pre-existing `style-src` policy is outside this decision and is not broadened.

The exception is accepted only for the current static Next.js export contract.
Each release artifact must still pass the Nginx contract verifier and a browser
run under the exact CSP with zero policy violations and working navigation.

## Consequences and revisit trigger

Inline script injection has weaker protection than a stable hash or nonce
policy. Revisit this decision when Next.js emits stable inline bootstrap
content, the delivery model can inject per-response nonces, or the application
stops requiring inline bootstrap scripts. At that point remove
`'unsafe-inline'` from `script-src` and replace it with the narrower mechanism.
