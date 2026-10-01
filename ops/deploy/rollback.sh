#!/bin/sh
set -eu

[ "$#" -eq 3 ] || { echo "usage: rollback.sh <deploy-root> <release-id> <smoke-url>" >&2; exit 64; }
deploy_root=$1
release_id=$2
smoke_url=$3
printf '%s' "$release_id" | grep -Eq '^[0-9]{8}T[0-9]{6}Z-[a-f0-9]{12}$' || { echo "invalid release id" >&2; exit 65; }
target="$deploy_root/releases/$release_id"
current="$deploy_root/current"
staged="$deploy_root/.current-$release_id.rollback"

[ -f "$target/out/index.html" ] || { echo "rollback target is not a verified release" >&2; exit 66; }
[ -f "$target/release.json" ] || { echo "rollback metadata is missing" >&2; exit 66; }
grep -Eq "^\{\"release_id\":\"$release_id\",\"commit_sha\":\"[a-f0-9]{40}\",\"artifact\":\"release-[a-f0-9]{40}[.]tar[.]gz\"\}$" "$target/release.json" || { echo "rollback metadata is invalid" >&2; exit 66; }
[ -L "$current" ] || { echo "current release symlink is missing" >&2; exit 66; }
previous_target=$(readlink "$current")
switched=0

run_nginx_test() { if [ -n "${AMS_NGINX_TEST_COMMAND:-}" ]; then sh -c "$AMS_NGINX_TEST_COMMAND"; else "${AMS_NGINX_BIN:-nginx}" -t; fi; }
run_nginx_reload() { if [ -n "${AMS_NGINX_RELOAD_COMMAND:-}" ]; then sh -c "$AMS_NGINX_RELOAD_COMMAND"; else "${AMS_NGINX_BIN:-nginx}" -s reload; fi; }
run_smoke() { if [ -n "${AMS_SMOKE_COMMAND:-}" ]; then sh -c "$AMS_SMOKE_COMMAND"; else curl --fail --silent --show-error --location --max-time 15 "$smoke_url" >/dev/null; fi; }
restore_previous() { [ "$switched" -eq 1 ] || return 0; restore_stage="$deploy_root/.current-restore.next"; ln -sfn "$previous_target" "$restore_stage"; mv -Tf "$restore_stage" "$current"; run_nginx_test && run_nginx_reload || true; }
trap 'status=$?; if [ "$status" -ne 0 ]; then restore_previous; fi; rm -f "$staged"; exit "$status"' EXIT HUP INT TERM

run_nginx_test
ln -sfn "$target" "$staged"
mv -Tf "$staged" "$current"
switched=1
run_nginx_test
run_nginx_reload
run_smoke
switched=0
trap - EXIT HUP INT TERM
echo "rolled back to $release_id"
