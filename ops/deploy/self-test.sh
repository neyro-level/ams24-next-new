#!/bin/sh
set -eu

project_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
sandbox=$(mktemp -d "${TMPDIR:-/tmp}/ams24-deploy.XXXXXX")
trap 'rm -rf "$sandbox"' EXIT HUP INT TERM
artifacts="$sandbox/artifacts"
deploy_root="$sandbox/site"
mkdir -p "$artifacts" "$deploy_root"

make_artifact() {
  sha=$1
  content=$2
  source_dir="$sandbox/source-$sha"
  mkdir -p "$source_dir"
  printf '<h1>%s</h1>\n' "$content" > "$source_dir/index.html"
  archive="release-$sha.tar.gz"
  tar -czf "$artifacts/$archive" -C "$source_dir" .
  (cd "$artifacts" && sha256sum "$archive" > "$archive.sha256")
}

sha_one=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
sha_two=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
sha_bad=cccccccccccccccccccccccccccccccccccccccc
sha_validation=dddddddddddddddddddddddddddddddddddddddd
id_one=20261001T120000Z-aaaaaaaaaaaa
id_two=20261001T130000Z-bbbbbbbbbbbb
id_bad=20261001T140000Z-cccccccccccc
id_validation=20261001T150000Z-dddddddddddd
make_artifact "$sha_one" previous
make_artifact "$sha_two" current
make_artifact "$sha_bad" rejected
make_artifact "$sha_validation" invalid-nginx

export AMS_NGINX_TEST_COMMAND=true AMS_NGINX_RELOAD_COMMAND=true AMS_SMOKE_COMMAND=true
"$project_root/ops/deploy/deploy.sh" "$artifacts/release-$sha_one.tar.gz" "$artifacts/release-$sha_one.tar.gz.sha256" "$deploy_root" "$id_one" "$sha_one" fixture://smoke
"$project_root/ops/deploy/deploy.sh" "$artifacts/release-$sha_two.tar.gz" "$artifacts/release-$sha_two.tar.gz.sha256" "$deploy_root" "$id_two" "$sha_two" fixture://smoke
[ "$(readlink "$deploy_root/current")" = "$deploy_root/releases/$id_two" ]

export AMS_SMOKE_COMMAND=false
if "$project_root/ops/deploy/deploy.sh" "$artifacts/release-$sha_bad.tar.gz" "$artifacts/release-$sha_bad.tar.gz.sha256" "$deploy_root" "$id_bad" "$sha_bad" fixture://smoke; then
  echo 'failed deploy unexpectedly succeeded' >&2
  exit 1
fi
[ "$(readlink "$deploy_root/current")" = "$deploy_root/releases/$id_two" ]

export AMS_SMOKE_COMMAND=true
"$project_root/ops/deploy/rollback.sh" "$deploy_root" "$id_one" fixture://smoke
[ "$(readlink "$deploy_root/current")" = "$deploy_root/releases/$id_one" ]

cp "$deploy_root/releases/$id_two/release.json" "$deploy_root/releases/$id_two/release.json.valid"
printf '{"release_id":"wrong"}\n' > "$deploy_root/releases/$id_two/release.json"
if "$project_root/ops/deploy/rollback.sh" "$deploy_root" "$id_two" fixture://smoke; then
  echo 'rollback with invalid metadata unexpectedly succeeded' >&2
  exit 1
fi
[ "$(readlink "$deploy_root/current")" = "$deploy_root/releases/$id_one" ]
mv "$deploy_root/releases/$id_two/release.json.valid" "$deploy_root/releases/$id_two/release.json"

export AMS_SMOKE_COMMAND=false
if "$project_root/ops/deploy/rollback.sh" "$deploy_root" "$id_two" fixture://smoke; then
  echo 'failed rollback unexpectedly succeeded' >&2
  exit 1
fi
[ "$(readlink "$deploy_root/current")" = "$deploy_root/releases/$id_one" ]

export AMS_NGINX_TEST_COMMAND=false AMS_SMOKE_COMMAND=true
if "$project_root/ops/deploy/deploy.sh" "$artifacts/release-$sha_validation.tar.gz" "$artifacts/release-$sha_validation.tar.gz.sha256" "$deploy_root" "$id_validation" "$sha_validation" fixture://smoke; then
  echo 'failed validation unexpectedly succeeded' >&2
  exit 1
fi
[ "$(readlink "$deploy_root/current")" = "$deploy_root/releases/$id_one" ]

cp "$artifacts/release-$sha_validation.tar.gz.sha256" "$artifacts/invalid.sha256"
printf '0%.0s' $(seq 1 64) > "$artifacts/invalid.sha256"
printf '  release-%s.tar.gz\n' "$sha_validation" >> "$artifacts/invalid.sha256"
export AMS_NGINX_TEST_COMMAND=true
if "$project_root/ops/deploy/deploy.sh" "$artifacts/release-$sha_validation.tar.gz" "$artifacts/invalid.sha256" "$deploy_root" 20261001T160000Z-eeeeeeeeeeee "$sha_validation" fixture://smoke; then
  echo 'invalid checksum unexpectedly succeeded' >&2
  exit 1
fi
[ "$(readlink "$deploy_root/current")" = "$deploy_root/releases/$id_one" ]

echo 'Deploy/rollback filesystem fixture: PASS'
