#!/usr/bin/env bash
set -euo pipefail

# IONOS S3 backup script for this repository.
# Requires AWS CLI v2 configured with an IONOS Object Storage endpoint.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$ROOT_DIR/.backup-tmp"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ARCHIVE_NAME="MWSportsMasters2026-${STAMP}.tar.gz"
ARCHIVE_PATH="$TMP_DIR/$ARCHIVE_NAME"
IGNORE_FILE="$ROOT_DIR/.backupignore"

: "${IONOS_S3_ENDPOINT:?Set IONOS_S3_ENDPOINT, for example: https://s3-de-central.profitbricks.com}"
: "${IONOS_S3_BUCKET:?Set IONOS_S3_BUCKET}"
: "${AWS_ACCESS_KEY_ID:?Set AWS_ACCESS_KEY_ID for IONOS Object Storage}"
: "${AWS_SECRET_ACCESS_KEY:?Set AWS_SECRET_ACCESS_KEY for IONOS Object Storage}"

RETENTION_DAYS="${RETENTION_DAYS:-30}"
PREFIX="${BACKUP_PREFIX:-repo-backups}"

command -v aws >/dev/null 2>&1 || {
  echo "aws CLI not found. Install AWS CLI v2 and retry."
  exit 1
}

mkdir -p "$TMP_DIR"

echo "Creating archive: $ARCHIVE_PATH"
tar \
  --exclude-from "$IGNORE_FILE" \
  -czf "$ARCHIVE_PATH" \
  -C "$ROOT_DIR" \
  .

echo "Uploading to IONOS bucket: s3://$IONOS_S3_BUCKET/$PREFIX/$ARCHIVE_NAME"
aws \
  --endpoint-url "$IONOS_S3_ENDPOINT" \
  s3 cp "$ARCHIVE_PATH" "s3://$IONOS_S3_BUCKET/$PREFIX/$ARCHIVE_NAME"

# Optional retention cleanup.
# Deletes objects under PREFIX older than RETENTION_DAYS based on LastModified.
echo "Applying retention: ${RETENTION_DAYS} days"
CUTOFF_EPOCH="$(date -u -d "-${RETENTION_DAYS} days" +%s)"

aws --endpoint-url "$IONOS_S3_ENDPOINT" s3api list-objects-v2 \
  --bucket "$IONOS_S3_BUCKET" \
  --prefix "$PREFIX/" \
  --query 'Contents[].{Key:Key,LastModified:LastModified}' \
  --output text | while read -r key last_modified; do
    [[ -z "${key:-}" || -z "${last_modified:-}" ]] && continue
    obj_epoch="$(date -u -d "$last_modified" +%s)"
    if (( obj_epoch < CUTOFF_EPOCH )); then
      echo "Deleting old backup: $key"
      aws --endpoint-url "$IONOS_S3_ENDPOINT" s3 rm "s3://$IONOS_S3_BUCKET/$key"
    fi
  done

rm -f "$ARCHIVE_PATH"
echo "Backup complete."
