# Resume Builder

A minimal full-stack Resume Builder that supports multiple resumes, version history, and a dark-mode dashboard.

## Features

- Backend SQLite data model with:
  - `users`
  - `resumes`
  - `resume_versions`
- REST API for:
  - create/update/delete resume
  - list versions
  - load a specific version
- Frontend dashboard for:
  - saving current draft snapshots
  - duplicating into new versions
  - loading any previous version and continuing edits
- Theme preference with Tailwind dark mode persisted in `localStorage`.

## Tech Stack

- Node.js + Express
- SQLite (`better-sqlite3`)
- Vanilla frontend + Tailwind CDN

## Authentication Setup

This project uses a lightweight header-based auth strategy so it can be wired to a real identity provider later.

### Supported headers

- `x-user-id`: use an existing user record ID.
- `x-user-email`: used to auto-create/find a user when `x-user-id` is not provided.
- `x-user-name`: optional display name for auto-created users.

### Behavior

1. If `x-user-id` is present, the API validates that user exists.
2. If `x-user-id` is missing, API upserts a user using `x-user-email` (defaults to `demo@example.com`) and optional `x-user-name` (defaults to `Demo User`).
3. Every resume operation is scoped to the authenticated user.

For production, replace this middleware with JWT/session validation and pass the resolved user identity into request context.

## Storage Setup

- Database: SQLite file at `./data.db` by default.
- Override DB location with `DB_PATH` environment variable.
- Tables are auto-created on server startup.

### Data model details

- `users`: account metadata (`id`, `email`, `name`, `created_at`).
- `resumes`: current working copy (`title`, `current_content`) tied to a user.
- `resume_versions`: immutable snapshots with incrementing `version_number`.

## API Routes

Base URL: `http://localhost:3000`

- `GET /api/resumes` — list all resumes for current user.
- `POST /api/resumes` — create a resume and initial version.
- `PUT /api/resumes/:id` — update resume; optionally create a new version snapshot (`createVersion: true`).
- `DELETE /api/resumes/:id` — delete resume and associated versions.
- `GET /api/resumes/:id` — get current resume payload.
- `GET /api/resumes/:id/versions` — list version history.
- `GET /api/resumes/:id/versions/:versionId` — load one version.
- `POST /api/resumes/:id/versions` — create a new version (duplicate from current content or a source version).

## Getting Started

```bash
npm install
npm run start
```

Then open: `http://localhost:3000`

## Frontend Usage

1. Click **New Resume** to create one from editor contents.
2. Edit title/content and click **Save Current Draft** to create a new version snapshot.
3. Click a version in **Version History** to load it into the editor.
4. Click **Duplicate as New Version** to branch/create another version snapshot.
5. Use **Toggle Theme** to switch light/dark mode (preference is persistent).
