# Version and Security Matrix — ams24-next-new

Status: Active

Review date: 2026-10-02

Scope: T7.6 Next.js security patch; production is not authorized by this document.

## Installed and target versions

| Component | Previous | Installed / target | Official source | Decision |
| --- | --- | --- | --- | --- |
| Node.js | 24.20.0 | 24.20.0 | [Node.js releases](https://nodejs.org/en/about/previous-releases) | unchanged; project runtime pin |
| pnpm | 12.8.1 | 12.8.1 | [pnpm package](https://www.npmjs.com/package/pnpm/v/12.8.1) | unchanged; `packageManager` pin |
| Next.js | 16.3.7 | 16.3.8 | [September 2026 security release](https://nextjs.org/blog/september-2026-security-release), [v16.3.8 release](https://github.com/vercel/next.js/releases/tag/v16.3.8), [npm package](https://www.npmjs.com/package/next/v/16.3.8) | security patch required; Active LTS 16.3 line |
| eslint-config-next | 16.3.7 | 16.3.8 | [npm package](https://www.npmjs.com/package/eslint-config-next/v/16.3.8) | aligned with the Next.js patch; no unrelated ESLint major upgrade |
| React / React DOM | 19.3.0 | 19.3.0 | [React releases](https://github.com/facebook/react/releases) | unchanged; satisfies Next.js 16.3.8 peer range |
| TypeScript | 6.0.3 | 6.0.3 | [TypeScript releases](https://github.com/microsoft/TypeScript/releases) | unchanged; compatible with the installed Next.js ESLint toolchain |

Registry verification on 2026-10-02 showed `next@latest=16.3.8`, the latest stable 16.3 patch was 16.3.8, and its Node.js requirement was `>=20.9.0`. The project uses Node.js 24.20.0 and React 19.3.0, which satisfy the published engine and peer ranges. Canary releases are not a production target.

## September 2026 disclosed advisories

The official 2026-09-30 release fixes seven disclosed issues: one High, five Medium and one Low. Applicability below is based on the current repository contract: App Router, `output: "export"`, no production Next.js server, `images.unoptimized: true`, no Cache Components, no Draft Mode and no root catch-all route.

| Advisory | Severity | Repository applicability after review | Status at 16.3.8 |
| --- | --- | --- | --- |
| [GHSA-cjq9-62q9-8jv4](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4) — Image Optimization SSRF | High | Not exposed in production: static export disables the Next.js image optimizer and the project has no `images.remotePatterns`. | patched |
| [GHSA-4jqv-mc3x-m676](https://github.com/vercel/next.js/security/advisories/GHSA-4jqv-mc3x-m676) — Pages Router SSG/ISR cache poisoning | Medium | Not exposed: the project uses App Router static export and has no runtime response cache. | patched |
| [GHSA-mcj8-r9mp-w47p](https://github.com/vercel/next.js/security/advisories/GHSA-mcj8-r9mp-w47p) — root catch-all SSG/ISR cache poisoning | Medium | Not exposed: there is no root catch-all route, ISR or production Next.js cache. | patched |
| [GHSA-f87g-xv8r-7p7x](https://github.com/vercel/next.js/security/advisories/GHSA-f87g-xv8r-7p7x) — metadata image `dynamicParams` bypass | Medium | No matching runtime surface: OG is a static public asset; dynamic article routes are statically enumerated and exported. | patched |
| [GHSA-h694-7cp9-m8p3](https://github.com/vercel/next.js/security/advisories/GHSA-h694-7cp9-m8p3) — nested `use cache` root-param leak | Medium | Not exposed: Cache Components and `use cache` are absent. | patched |
| [GHSA-3w37-wq28-93x7](https://github.com/vercel/next.js/security/advisories/GHSA-3w37-wq28-93x7) — Draft Mode cache leak | Medium | Not exposed: Draft Mode, Cache Components and CMS preview runtime are absent. | patched |
| [GHSA-39w2-rjm5-chcv](https://github.com/vercel/next.js/security/advisories/GHSA-39w2-rjm5-chcv) — development MCP information disclosure | Low | Relevant to developer workstations running `next dev`; 16.3.8 is required even though production static hosting does not expose the endpoint. | patched |

“Not exposed” describes the current repository topology; it is not a waiver. Any future change that adds a Next.js production runtime, image optimization, Cache Components, Draft Mode, ISR or a root catch-all route must re-open this applicability review.

## Unresolved upstream-delayed fixes

The official 2026-09-30 announcement states that fixes for one Critical and one High vulnerability were postponed because of upstream dependency delays. The announcement does not publish identifiers or enough technical detail to determine applicability. Their status is therefore `UNRESOLVED / APPLICABILITY NOT VERIFIED`, not `PASS`.

Before any production release:

1. Re-check the [official Next.js blog](https://nextjs.org/blog), [Next.js GitHub releases](https://github.com/vercel/next.js/releases) and [security advisories](https://github.com/vercel/next.js/security/advisories).
2. Confirm whether the postponed Critical and High fixes have been published.
3. If a newer safe compatible 16.3 patch exists, update `next` and `eslint-config-next` together and repeat `corepack pnpm verify`, `corepack pnpm verify:release` and browser evidence on that exact version.
4. Do not release production while a newly published applicable Critical or High advisory remains unpatched.

## Verification contract

T7.6 is complete only when package and lockfile both pin 16.3.8, the installed package reports that exact version, static build/release verification passes and representative browser evidence runs under the repository Nginx parity fixture. This matrix records dependency/security evidence; it does not replace those checks.
