# Release Checklist — ams24-next-new

Status: Draft  
Version: 0.1  
Updated: 2026-09-30

Release is allowed only after an explicit owner command. This checklist does not authorize merge or production.

## 0. EPIC-09 readiness snapshot

Evidence: `docs/research/RELEASE_READINESS_EPIC_09.md`.

Repository-ready:

- static Next artifact builds through `pnpm verify`;
- `out/` exists after build and passes static artifact secret scan;
- SourceCraft manual gate policy is preserved;
- index/noindex, sitemap and redirect rules have tests;
- lead, legal and analytics release blockers are explicit and guarded.

Production-only blockers:

- no explicit owner production command;
- final target server/path/artifact store not confirmed for rollout;
- live AMS Leads API endpoint/schema not approved;
- legal text/reviewer not approved;
- analytics provider account/config not approved;
- complete current `ams24.ru` redirect inventory not approved;
- Nginx/security headers, live smoke and rollback rehearsal not performed.

This means the repository may be reviewed and merged, but public production release is still blocked.

## 1. Release Identity

- [ ] Canonical SourceCraft `main` is clean.
- [ ] Exact release SHA is recorded.
- [ ] Release artifact is linked to that SHA.
- [ ] `DELIVERY_PROFILE=CRITICAL` gate evidence is available for exact head.
- [ ] Production identity and target path are recorded without exposing secrets.

## 2. Product

- [ ] Home explains the platform and routes to all three products.
- [ ] `/impuls/`, `/pixel/` and `/zashchita/` have distinct roles and content.
- [ ] Tariffs, cases, reviews and calculations contain only approved facts.
- [ ] At least one complete navigation path reaches every published page.
- [ ] Route skeletons/thin pages are not indexed.
- [ ] Owner has approved public product names, claims, tariffs and case metrics.

## 3. Content and Evidence

- [ ] Every published case has source, period, method and permission/anonymization status.
- [ ] Every review has source and publication permission status.
- [ ] No competitor text, media, code or claims are copied.
- [ ] No unsupported guarantee or affiliation claim is present.
- [ ] Article and KB roles are not duplicated.
- [ ] All content refs, links and media resolve.

## 4. UI and Accessibility

- [ ] Representative homepage passed Design Intake and drift audit.
- [ ] Header, footer and mobile menu work with keyboard.
- [ ] One logical H1 per commercial page.
- [ ] Focus, labels, errors, alt, contrast, touch targets and reduced motion checked.
- [ ] Product cards, tariff comparison and lead form checked on representative mobile widths.
- [ ] No P0/P1 design-system drift findings remain.

## 5. Forms, PII and Legal

- [ ] Frontend posts only to relative `/api/leads`.
- [ ] AMS Leads API performs authoritative validation and anti-spam.
- [ ] Consent payload includes accepted/version/timestamp.
- [ ] Privacy, processing and consent targets are published and linked.
- [ ] Legal language and claims passed the assigned review.
- [ ] Analytics does not receive PII or raw form values.
- [ ] Success, validation and server-error states are verified.

## 6. SEO

- [ ] Unique title, description, canonical and OG data for every indexable route.
- [ ] One canonical trailing-slash URL per page.
- [ ] Sitemap contains only published indexable routes.
- [ ] Robots policy is correct for production and utility/legal pages.
- [ ] Staging is protected and sends `noindex, nofollow`.
- [ ] Redirects from the current `ams24.ru` inventory have no loops/chains/missing targets.
- [ ] Custom 404 works through Nginx.
- [ ] Structured data is factual and validates where used.

## 7. Code and Artifact

- [ ] Frozen lockfile install succeeds in the approved build environment.
- [ ] `pnpm verify` passes.
- [ ] Production static build succeeds.
- [ ] `out/` validation passes.
- [ ] No unsupported dynamic runtime API exists.
- [ ] No secret-like value exists in repository, HTML, JS or artifact.
- [ ] Artifact is stored durably before rollout.

## 8. Performance

- [ ] Representative mobile measurement uses production-like build.
- [ ] LCP target `<= 2.5s` or approved documented exception.
- [ ] CLS target `<= 0.1` or approved documented exception.
- [ ] Hero/LCP media is intentional and properly sized.
- [ ] Fonts include only required families/weights.

## 9. Deployment

- [ ] Nginx config validates.
- [ ] Security headers/CSP validated against exact artifact.
- [ ] `/api/leads` proxy target is correct without exposing credentials.
- [ ] Release directory uploaded before symlink switch.
- [ ] Previous verified release remains available.
- [ ] `current` switch and required Nginx reload/cache step are defined.

## 10. Live Smoke

- [ ] `/`, `/impuls/`, `/pixel/`, `/zashchita/` return expected production HTML.
- [ ] `/page` redirects once to `/page/`.
- [ ] Header/footer/mobile navigation work.
- [ ] Representative case, article and KB page work.
- [ ] 404 works.
- [ ] Real production lead test reaches the expected isolated/marked destination.
- [ ] Analytics page view and conversion event work without PII.
- [ ] TLS and external uptime check are healthy.

## 11. Rollback

- [ ] Previous release ID is recorded.
- [ ] Rollback is a symlink switch, not a rebuild.
- [ ] Post-rollback smoke checklist is available.
- [ ] Lead path remains safe during rollback.

## 12. Post-release

- [ ] Release SHA, artifact and smoke evidence are recorded.
- [ ] Monitoring is active.
- [ ] Search engine submission happens only after canonical/redirect proof.
- [ ] Any release debt is written into `04_BACKLOG.md`.
