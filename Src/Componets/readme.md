# MW Sports Masters 2026

Elite golf betting analysis platform for the Masters 2026.

## Features
- Modern React + Vite + Tailwind UI
- Real-time leaderboards and bet tracking
- VIP signup and user management
- Mobile-friendly, fast, and secure

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run locally:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```
4. **Preview production build:**
   ```sh
   npm run preview
   ```

## Environment

1. Create a local env file:
   ```sh
   cp .env.example .env
   ```
2. Set `VITE_API_BASE_URL` if your backend is on a different host.
3. Leave `VITE_API_BASE_URL` empty to use same-origin `/api`.

## Deployment
- Deploy the `dist/` folder to your preferred static host (Vercel, Netlify, AWS S3, etc).
- Ensure your backend API is configured at `/api` or update the Vite proxy as needed.

## Launch Checklist
- Frontend `npm run lint` passes
- Frontend `npm run typecheck` passes
- Frontend `npm run build` passes
- Backend `.env` exists and DB credentials are valid
- Backend `/healthz` returns `status: ok` and `dbReady: true`
- CORS origin list is restricted in production

## Customization
- Update branding, favicon, and meta tags in `index.html`.
- Adjust Tailwind config for custom themes.

## License
MIT
