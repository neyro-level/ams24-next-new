# AMS24 Operations Runbook

Status: Parameterized / production blocked
Version: 1.0
Updated: 2026-10-01

## Purpose and authority

This is the single operator procedure for Nginx/TLS, staging isolation,
artifact transfer, atomic rollout, rollback, retention and HTTP contract smoke.
Architecture decisions remain in `03_ARCHITECTURE.md`; release evidence and
owner gates remain in `05_RELEASE_CHECKLIST.md`.

The runbook does not authorize production. Start it only after an explicit
owner release command, from clean canonical `main`, with the exact approved SHA.
Do not write resolved identities, credentials, certificate paths or host paths
back to Git.

## Required runtime inputs

Resolve these values in the approved release context. Angle-bracket values are
placeholders, not defaults.

| Input | Contract |
|---|---|
| `RELEASE_SHA` | exact 40-character canonical `main` SHA |
| `ARTIFACT` | `release-<RELEASE_SHA>.tar.gz` from the exact-main artifact workflow |
| `CHECKSUM` | matching single-record SHA-256 file |
| `DEPLOY_ROOT` | owner-approved absolute release root |
| `RELEASE_ID` | UTC `YYYYMMDDTHHMMSSZ-<12-char-sha>` |
| `PRODUCTION_SERVER_NAME` / `STAGING_SERVER_NAME` | approved host identities |
| certificate/key and staging password-file paths | server-held paths, never repository values |
| `LEADS_API_UPSTREAM` | server-held upstream value |
| `NGINX_SNIPPETS_DIR` | rendered snippet directory |
| `SMOKE_URL` | HTTPS base URL without credentials, query or fragment |

Stop if any input is missing, the artifact/checksum name does not match
`RELEASE_SHA`, the SourceCraft evidence is for another SHA, or the target is
not the approved host.

## 1. Artifact acquisition and transfer

1. Trigger the single exact-main `release-artifact` workflow for `RELEASE_SHA`.
2. Record its run URL and download the archive, checksum and manifest to an
   operator-controlled staging directory.
3. Confirm the manifest SHA and archive name equal `RELEASE_SHA`.
4. Verify the checksum before and after transfer to the approved host. Transfer
   into a temporary operator directory outside `DEPLOY_ROOT/releases/`; the
   deploy script owns creation of the final release directory.
5. Stop on a checksum mismatch. Never rebuild on the production host.

The SourceCraft workflow artifact is temporary evidence, not durable release
storage. A durable artifact location remains a release prerequisite until its
identity and retention policy are approved.

## 2. Nginx, TLS and staging isolation

1. Render `ops/nginx/ams24-site.conf.template` by replacing every placeholder
   with an approved runtime value. Keep the rendered file outside Git.
2. Install the production and staging header snippets from `ops/nginx/snippets/`.
3. Confirm production and staging use separate server names and certificates.
4. Confirm staging Basic Auth is enabled and its password file is server-held.
5. Confirm staging returns `X-Robots-Tag: noindex, nofollow` and production does
   not inherit that directive.
6. Run `nginx -t`. Do not reload when validation fails.

TLS certificates and upstream credentials are provisioned through the approved
server/Secret Master route during an explicit release; this repository neither
discovers nor stores them.

## 3. Atomic rollout

Run on the approved host from the repository-owned script copy:

```sh
ops/deploy/deploy.sh "$ARTIFACT" "$CHECKSUM" "$DEPLOY_ROOT" \
  "$RELEASE_ID" "$RELEASE_SHA" "$SMOKE_URL"
```

The script verifies the checksum, unpacks to
`$DEPLOY_ROOT/releases/$RELEASE_ID/out`, writes non-secret metadata, validates
Nginx, atomically switches `current`, reloads and runs smoke. A validation,
reload or smoke failure after the switch restores the prior target. Record the
previous and new release IDs; do not delete the failed directory during
incident diagnosis.

## 4. HTTP contract and live smoke

Run the versioned non-PII contract matrix:

```sh
corepack pnpm smoke -- --base-url "$SMOKE_URL"
```

It verifies representative HTML paths, one-hop trailing-slash redirect, real
404 behavior, security headers and short/immutable cache contracts. Exit code
`3` is a transport failure; exit code `4` is a reached target with a contract
mismatch. The runner does not send cookies or print the base URL/header values.

Complete the remaining browser/live checks from `05_RELEASE_CHECKLIST.md`:
navigation, isolated marked lead submission, analytics without PII, TLS and
external uptime. Any failure triggers rollback; it is not accepted as a
documentation-only exception.

## 5. Rollback

Select a previously recorded verified release ID, then run:

```sh
ops/deploy/rollback.sh "$DEPLOY_ROOT" "$PREVIOUS_RELEASE_ID" "$SMOKE_URL"
```

Rollback only switches the symlink, validates/reloads Nginx and repeats smoke.
It never runs Git, dependency installation or a build. If rollback smoke fails,
the script restores the pre-rollback target; stop and escalate rather than
cycling between releases.

## 6. Retention and evidence

- Keep `current` and at least one previous verified release.
- Keep any release named in active rollback or incident evidence.
- Prune only after successful smoke and after proving the directory is not the
  `current` symlink target.
- Record exact SHA, release ID, artifact/checksum identity, SourceCraft run,
  Nginx validation, smoke verdict, previous release ID and any rollback.
- Never record secrets, cookie values, lead payloads or full private URLs.

## Failure rules

| Failure | Required response |
|---|---|
| artifact/checksum/SHA mismatch | stop before unpack/switch |
| Nginx validation failure | keep current target; correct rendered config outside Git only if values were wrong |
| reload or post-switch smoke failure | accept automatic restoration, verify previous target, record incident |
| transport failure | verify DNS/TLS/network/host health; do not label it a contract regression |
| contract mismatch | rollback and preserve response category/evidence without sensitive values |
| unknown host, path or credential | stop for owner-approved release context |
