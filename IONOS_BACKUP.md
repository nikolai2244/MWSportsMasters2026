# IONOS Backup Setup

This repo includes an automated snapshot script:

- [scripts/backup-ionos.sh](scripts/backup-ionos.sh)
- Exclusions in [.backupignore](.backupignore)

## What this backs up

The script archives the full repository except ignored paths like node_modules, dist outputs, and real env files.

## Prerequisites

1. AWS CLI v2 installed.
2. IONOS Object Storage bucket created.
3. IONOS S3 credentials available.

## Required environment variables

- IONOS_S3_ENDPOINT
- IONOS_S3_BUCKET
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

Optional:

- RETENTION_DAYS (default 30)
- BACKUP_PREFIX (default repo-backups)

## One-time local run

1. Export variables in your shell.
2. Run:

sh scripts/backup-ionos.sh

## Recommended schedule

Daily backup via cron (example at 2:15 AM UTC):

15 2 * * * cd /path/to/MWSportsMasters2026 && /usr/bin/env bash scripts/backup-ionos.sh >> /var/log/mwsports-backup.log 2>&1

## GitHub Actions automation (recommended)

This repo includes [.github/workflows/backup-ionos.yml](.github/workflows/backup-ionos.yml), which runs:

- On demand (`workflow_dispatch`)
- Daily at 02:15 UTC

This repo also includes [.github/workflows/backup-restore-verify.yml](.github/workflows/backup-restore-verify.yml), which runs:

- On demand (`workflow_dispatch`)
- Daily at 02:45 UTC
- Downloads the latest backup from IONOS and validates archive integrity
- Verifies critical project files are present in the archive

Set these repository secrets:

- `IONOS_S3_ENDPOINT`
- `IONOS_S3_BUCKET`
- `IONOS_AWS_ACCESS_KEY_ID`
- `IONOS_AWS_SECRET_ACCESS_KEY`

Optional repository variables:

- `BACKUP_RETENTION_DAYS` (default 30)
- `BACKUP_PREFIX` (default `repo-backups`)

Optional failure-alert secrets (recommended):

- `ALERT_SLACK_WEBHOOK_URL`
- `ALERT_SMTP_SERVER`
- `ALERT_SMTP_PORT` (default 587 if omitted)
- `ALERT_SMTP_USERNAME`
- `ALERT_SMTP_PASSWORD`
- `ALERT_EMAIL_FROM`
- `ALERT_EMAIL_TO`

When configured, backup and restore verification workflows send notifications on failure.

When secrets are missing, the workflow exits cleanly with a clear skip message.

## Restore

1. Download desired backup object from IONOS bucket.
2. Extract into an empty folder:

   tar -xzf MWSportsMasters2026-YYYYMMDDTHHMMSSZ.tar.gz

3. Recreate local env files manually from .env.example templates.
