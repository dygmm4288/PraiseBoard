#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.preview}"
EAS_ENV="${2:-production}"
MODE="${3:-upsert}"

case "$MODE" in
  create | update | upsert) ;;
  *)
    echo "Invalid mode: $MODE" >&2
    echo "Usage: $0 [env-file] [eas-environment] [create|update|upsert]" >&2
    exit 1
    ;;
esac

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Environment file not found: $ENV_FILE" >&2
  exit 1
fi

command -v npx >/dev/null 2>&1 || {
  echo "npx is required to run eas-cli." >&2
  exit 1
}

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

strip_wrapping_quotes() {
  local value="$1"
  if [[ "$value" == \"*\" && "$value" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

visibility_for_key() {
  local key="$1"
  case "$key" in
    EXPO_PUBLIC_APP_ENV|EXPO_PUBLIC_DEBUG_ENABLED)
      printf 'plaintext'
      ;;
    *)
      printf 'sensitive'
      ;;
  esac
}

create_env_var() {
  local key="$1"
  local value="$2"
  local visibility="$3"
  local output_file

  output_file="$(mktemp)"

  if npx eas-cli@latest env:create \
    --environment "$EAS_ENV" \
    --name "$key" \
    --value "$value" \
    --visibility "$visibility" \
    --non-interactive >"$output_file" 2>&1 </dev/null; then
    echo "created $key ($visibility)"
    rm -f "$output_file"
    return
  fi

  echo "failed to create $key" >&2
  cat "$output_file" >&2
  rm -f "$output_file"
  return 1
}

update_env_var() {
  local key="$1"
  local value="$2"
  local visibility="$3"
  local output_file

  output_file="$(mktemp)"

  if npx eas-cli@latest env:create \
    --environment "$EAS_ENV" \
    --name "$key" \
    --value "$value" \
    --visibility "$visibility" \
    --force \
    --non-interactive >"$output_file" 2>&1 </dev/null; then
    echo "updated $key ($visibility)"
    rm -f "$output_file"
    return
  fi

  echo "failed to update $key" >&2
  cat "$output_file" >&2
  rm -f "$output_file"
  return 1
}

upsert_env_var() {
  local key="$1"
  local value="$2"
  local visibility="$3"
  local create_output_file
  local update_output_file

  create_output_file="$(mktemp)"

  if npx eas-cli@latest env:create \
    --environment "$EAS_ENV" \
    --name "$key" \
    --value "$value" \
    --visibility "$visibility" \
    --non-interactive >"$create_output_file" 2>&1 </dev/null; then
    echo "created $key ($visibility)"
    rm -f "$create_output_file"
    return
  fi

  update_output_file="$(mktemp)"

  if npx eas-cli@latest env:create \
    --environment "$EAS_ENV" \
    --name "$key" \
    --value "$value" \
    --visibility "$visibility" \
    --force \
    --non-interactive >"$update_output_file" 2>&1 </dev/null; then
    echo "updated $key ($visibility)"
    rm -f "$create_output_file" "$update_output_file"
    return
  fi

  echo "failed to upsert $key" >&2
  echo "" >&2
  echo "[create failure]" >&2
  cat "$create_output_file" >&2
  echo "" >&2
  echo "[update failure]" >&2
  cat "$update_output_file" >&2
  rm -f "$create_output_file" "$update_output_file"
  return 1
}

apply_env_var() {
  local key="$1"
  local value="$2"
  local visibility="$3"

  case "$MODE" in
    create)
      create_env_var "$key" "$value" "$visibility"
      ;;
    update)
      update_env_var "$key" "$value" "$visibility"
      ;;
    upsert)
      upsert_env_var "$key" "$value" "$visibility"
      ;;
  esac
}

echo "Applying EAS environment variables"
echo "  file: $ENV_FILE"
echo "  environment: $EAS_ENV"
echo "  mode: $MODE"

while IFS= read -r line || [[ -n "$line" ]]; do
  line="$(trim "$line")"

  if [[ -z "$line" || "$line" == \#* ]]; then
    continue
  fi

  if [[ "$line" != *=* ]]; then
    echo "Skipping invalid line: $line" >&2
    continue
  fi

  key="$(trim "${line%%=*}")"
  value="$(trim "${line#*=}")"
  value="$(strip_wrapping_quotes "$value")"

  if [[ -z "$key" ]]; then
    echo "Skipping empty key." >&2
    continue
  fi

  apply_env_var "$key" "$value" "$(visibility_for_key "$key")"
done < "$ENV_FILE"

echo "Done. Verify with:"
echo "  npx eas-cli@latest env:list --environment $EAS_ENV"
