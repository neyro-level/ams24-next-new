# AMS24 Nginx artifacts

Status: repository-side template only. Production release is still blocked until
the owner explicitly starts release and supplies the approved server identity,
artifact store and secret-backed upstream context.

Files in this directory own executable Nginx configuration artifacts only. They
do not replace `docs/03_ARCHITECTURE.md` or `docs/05_RELEASE_CHECKLIST.md`.

## Placeholders

`ams24-site.conf.template` intentionally contains placeholders instead of real
hostnames, credentials or upstream secrets:

- `{{PRODUCTION_SERVER_NAME}}`
- `{{STAGING_SERVER_NAME}}`
- `{{PRODUCTION_CERTIFICATE}}`
- `{{PRODUCTION_CERTIFICATE_KEY}}`
- `{{STAGING_CERTIFICATE}}`
- `{{STAGING_CERTIFICATE_KEY}}`
- `{{RELEASE_CURRENT}}`
- `{{NGINX_SNIPPETS_DIR}}`
- `{{LEADS_API_UPSTREAM}}`
- `{{STAGING_BASIC_AUTH_FILE}}`

Replacement is a release-time operation and must not be committed with secret
values.

`{{NGINX_SNIPPETS_DIR}}` points to the deployed copy of `ops/nginx/snippets/`.
Every context that declares its own `add_header` must include the applicable
production or staging security-header snippet because Nginx does not inherit
parent `add_header` directives into such a context.

`snippets/redirects.conf` is generated from `src/project/redirects.ts` by
`pnpm generate:nginx-redirects`. Its targets are checked against the same
repository-derived route manifest that produces `out/ams-routes.json`.
`pnpm verify` rejects unknown targets, redirect chains or loops, and manual
drift in the committed snippet.

Hashed `/_next/static/` assets keep the one-year immutable policy. Unhashed
public `.ico`, `.svg` and `.webp` files use a five-minute cache without
`immutable`. Release verification creates deterministic `.gz` siblings for
HTML, CSS, JavaScript, XML, text and SVG files; HTTPS application servers use
`gzip_static` with a safe dynamic gzip fallback. Brotli remains disabled until
the target Nginx module is positively confirmed during production preflight.

Port 80 servers only redirect to HTTPS. HSTS is emitted only by the HTTPS
application servers through their security-header snippets. Keep
`max-age=31536000` without `includeSubDomains` or `preload`, and enable this
template for the canonical production host only after release preflight proves
that the host is fully HTTPS-capable. Certificate placeholders are resolved by
the release environment and must never be replaced with workstation paths or
secrets in Git.
