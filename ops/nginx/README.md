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
- `{{RELEASE_CURRENT}}`
- `{{LEADS_API_UPSTREAM}}`
- `{{STAGING_BASIC_AUTH_FILE}}`

Replacement is a release-time operation and must not be committed with secret
values.
