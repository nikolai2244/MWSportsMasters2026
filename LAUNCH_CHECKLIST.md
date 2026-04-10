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
