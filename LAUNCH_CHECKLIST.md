# Launch Checklist

## 1) Configure Environment

Backend:

```sh
cd Backend
cp .env.example .env
```

Set these values in Backend/.env:

- NODE_ENV=production
- TRUST_PROXY=true (if behind reverse proxy)
- CORS_ORIGIN=https://your-frontend-domain.com
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME

Frontend:

```sh
cd Src/Componets
cp .env.example .env
```

Set:

- VITE_API_BASE_URL=https://your-api-domain.com (leave empty for same-origin /api)

## 2) Run Preflight Checks

Frontend:

```sh
cd Src/Componets
npm ci
npm run preflight
```

Backend:

```sh
cd Backend
npm ci
npm run preflight
```

## 3) Start Backend and Verify Health

```sh
cd Backend
npm start
```

In a second terminal:

```sh
cd Backend
npm run health
```

Expected:

- JSON response includes status: "ok"
- dbReady is true

## 4) Build + Deploy Frontend

IONOS workflows now run lint + typecheck + build during deployment.

For manual build artifact:

```sh
cd Src/Componets
npm run build
```

Deploy folder:

- Src/Componets/dist

## 5) Post-Deploy Smoke Test

- Open frontend homepage and key routes:
  - /
  - /leaderboard
  - /about
  - /signup
- Call API endpoint:
  - GET /healthz
  - GET /api/picks
- Confirm no CORS errors in browser console

## 6) Offsite Backup (IONOS)

- Follow [IONOS_BACKUP.md](IONOS_BACKUP.md)
- Use [scripts/backup-ionos.sh](scripts/backup-ionos.sh) for daily snapshots
- Backup automation workflow: [.github/workflows/backup-ionos.yml](.github/workflows/backup-ionos.yml)
- Restore verification workflow: [.github/workflows/backup-restore-verify.yml](.github/workflows/backup-restore-verify.yml)
- Store only source and config, not build outputs or real env secrets

Automation:

- GitHub Actions now includes [post-deploy-smoke.yml](.github/workflows/post-deploy-smoke.yml)
- It runs automatically after successful IONOS deployment and fails if core routes are not returning 200
- Optional API smoke checks are enabled when repository secret PROD_API_BASE_URL is set
  - Example value: https://api.your-domain.com
  - Checks: GET /healthz must be 200, GET /api/picks must be 200 or 503
