#!/bin/sh
set -eu

usage() { echo "usage: deploy.sh <artifact.tar.gz> <artifact.sha256> <deploy-root> <release-id> <expected-sha> <smoke-url>" >&2; exit 64; }
[ "$#" -eq 6 ] || usage

artifact=$1
checksum_file=$2
deploy_root=$3
release_id=$4
expected_sha=$5
smoke_url=$6

printf '%s' "$release_id" | grep -Eq '^[0-9]{8}T[0-9]{6}Z-[a-f0-9]{12}$' || { echo "invalid release id" >&2; exit 65; }
case "$expected_sha" in *[!0-9a-f]*|'') echo "invalid expected SHA" >&2; exit 65 ;; esac
[ "${#expected_sha}" -eq 40 ] || { echo "expected SHA must contain 40 characters" >&2; exit 65; }
[ -f "$artifact" ] && [ -f "$checksum_file" ] || { echo "artifact or checksum file is missing" >&2; exit 66; }

releases_root="$deploy_root/releases"
release_path="$releases_root/$release_id"
current="$deploy_root/current"
staged="$deploy_root/.current-$release_id.next"
previous_target=''
switched=0

run_nginx_test() { if [ -n "${AMS_NGINX_TEST_COMMAND:-}" ]; then sh -c "$AMS_NGINX_TEST_COMMAND"; else "${AMS_NGINX_BIN:-nginx}" -t; fi; }
run_nginx_reload() { if [ -n "${AMS_NGINX_RELOAD_COMMAND:-}" ]; then sh -c "$AMS_NGINX_RELOAD_COMMAND"; else "${AMS_NGINX_BIN:-nginx}" -s reload; fi; }
run_smoke() { if [ -n "${AMS_SMOKE_COMMAND:-}" ]; then sh -c "$AMS_SMOKE_COMMAND"; else curl --fail --silent --show-error --location --max-time 15 "$smoke_url" >/dev/null; fi; }

restore_previous() {
  [ "$switched" -eq 1 ] || return 0
  if [ -n "$previous_target" ]; then
    rollback_stage="$deploy_root/.current-rollback.next"
    ln -sfn "$previous_target" "$rollback_stage"
    mv -Tf "$rollback_stage" "$current"
    run_nginx_test && run_nginx_reload || true
  else
    rm -f "$current"
  fi
}
trap 'status=$?; if [ "$status" -ne 0 ]; then restore_previous; fi; rm -f "$staged"; exit "$status"' EXIT HUP INT TERM

artifact_dir=$(CDPATH= cd -- "$(dirname -- "$artifact")" && pwd)
artifact_name=$(basename -- "$artifact")
checksum_path=$(CDPATH= cd -- "$(dirname -- "$checksum_file")" && pwd)/$(basename -- "$checksum_file")
[ "$artifact_name" = "release-$expected_sha.tar.gz" ] || { echo "artifact name does not match expected SHA" >&2; exit 65; }
awk 'END { exit(NR == 1 ? 0 : 1) }' "$checksum_file" || { echo "checksum file must contain exactly one record" >&2; exit 65; }
grep -Eq "^[0-9a-f]{64}  release-$expected_sha[.]tar[.]gz$" "$checksum_file" || { echo "checksum record does not match the expected artifact" >&2; exit 65; }
(cd "$artifact_dir" && sha256sum -c "$checksum_path")

[ ! -e "$release_path" ] || { echo "release already exists: $release_id" >&2; exit 73; }
mkdir -p "$release_path/out"
tar -xzf "$artifact" -C "$release_path/out"
[ -f "$release_path/out/index.html" ] || { echo "release index.html is missing" >&2; exit 74; }
printf '{"release_id":"%s","commit_sha":"%s","artifact":"%s"}\n' "$release_id" "$expected_sha" "$artifact_name" > "$release_path/release.json"

run_nginx_test
if [ -L "$current" ]; then previous_target=$(readlink "$current"); fi
ln -sfn "$release_path" "$staged"
mv -Tf "$staged" "$current"
switched=1
run_nginx_test
run_nginx_reload
run_smoke
switched=0
trap - EXIT HUP INT TERM
echo "deployed $release_id at $expected_sha"
