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

Port 80 servers only redirect to HTTPS. HSTS is emitted only by the HTTPS
application servers through their security-header snippets. Keep
`max-age=31536000` without `includeSubDomains` or `preload`, and enable this
template for the canonical production host only after release preflight proves
that the host is fully HTTPS-capable. Certificate placeholders are resolved by
the release environment and must never be replaced with workstation paths or
secrets in Git.
