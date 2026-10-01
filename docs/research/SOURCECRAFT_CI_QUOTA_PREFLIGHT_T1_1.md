# SourceCraft CI quota preflight — T1.1

Status: evidence snapshot for the approved T1.1 CI-policy change.

Captured: 2026-10-01 (Europe/Moscow).

## Current quota

The workstation did not have the `src` CLI installed, so the equivalent
authenticated SourceCraft REST endpoint was used:
`GET /orgs/integrator-p/quotas`. The repository visibility was independently
confirmed as `private`.

Relevant private CI monthly quota:

- quota: `src.ciLaunchesTotalSecondsPerMonthPrivate.count`;
- used: `4,614` seconds;
- limit: `420,000` seconds;
- remaining: `415,386` seconds (98.90%).

The configured maximum for one gate cube is 10 minutes. Beads reported 48
remaining delivery tasks in the approved one-task/one-PR graph at capture time:
13 RISKY and 35 STANDARD.

Conservative upper-bound estimate:

```text
48 gates × 600 seconds = 28,800 seconds
415,386 - 28,800 = 386,586 seconds remaining
```

The remaining program therefore consumes at most 6.93% of the currently
available monthly private CI time under the configured per-gate ceiling. This
estimate excludes production because production is outside the approved
execution scope and may only be started by a separate owner command.

## Workflow map after T1.1

- automatic `push`, Pull Request and schedule triggers: none;
- `merge-standard`: manual, exact-head, one cube, `pnpm verify`;
- `merge-risky`: manual, exact-head, one cube, `pnpm verify:release`;
- gate choice: exactly one workflow per delivery SHA;
- production workflow: none in this change.
