# Resume Builder Monorepo

This repository contains two top-level apps:

- `frontend/`: React + Tailwind CSS app for resume creation UX.
- `backend/`: Node.js + Express API with AI and resume routes.

## Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ai.js
│   │   │   └── resume.js
│   │   ├── services/
│   │   │   └── openaiService.js
│   │   └── server.js
│   └── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies for each app:

   ```bash
   npm install --prefix frontend
   npm install --prefix backend
   ```

## Run locally

Open two terminals.

### Terminal 1 (backend)

```bash
npm run dev --prefix backend
```

Backend runs at `http://localhost:4000` by default.

### Terminal 2 (frontend)

```bash
npm run dev --prefix frontend
```

Frontend runs at `http://localhost:5173` by default.

## API endpoints

- `GET /health` - backend health check.
- `POST /api/ai/enhance-summary` - AI rewrite for summary text.
- `GET /api/resume` - list in-memory resumes.
- `POST /api/resume` - create a resume entry.

## Deploy notes

You can deploy this structure in multiple ways:

- **Split deploy**: host `frontend` on Vercel/Netlify and `backend` on Render/Fly.io/Railway.
- **Single host**: containerize both and run behind a reverse proxy.

Minimal production steps:

1. Set `OPENAI_API_KEY` on backend host.
2. Build frontend:

   ```bash
   npm run build --prefix frontend
   ```

3. Start backend:

   ```bash
   npm run start --prefix backend
   ```

4. Serve `frontend/dist` via a static host or CDN.

## Notes

- The backend keeps resume data in memory for now; swap to a database for production.
- If `OPENAI_API_KEY` is missing, AI route returns a fallback marker string.
