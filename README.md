# Personal Library frontend

React, TypeScript, and Vite foundation for the Personal Library backend. The pages currently confirm routing only; the library interface is a later step.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the public Spring Boot URL.
3. Run `npm run dev`.

The frontend sends all library and Google Drive requests to Spring Boot. It does not access PostgreSQL, Supabase, or Google APIs directly. Keep secrets in the backend; Vite variables prefixed with `VITE_` are public in the browser bundle.

For local development, the backend must allow the origin `http://localhost:5173` through CORS. Requests include browser credentials for the Google OAuth session, so the backend must also permit credentialed requests and configure cookies appropriately for the frontend and backend origins.

## API contract to verify

The backend endpoint paths and response bodies were not present in this repository. The API modules currently assume:

- `/api/library` for paginated GET and POST; `/api/library/{id}` for GET, PUT, and DELETE.
- `/api/library/status/{status}`, `/api/library/type/{type}`, and `/api/library/search?title=...` for filtering and search, returning item arrays.
- `/api/library/upload` for multipart POST with a `file` field, returning a library item.
- `/api/google-drive/status` for GET with `{ "connected": boolean }`, and `/api/google-drive/disconnect` for POST.
- `/api/google-drive/connect` for browser navigation into the OAuth flow.

Confirm these paths, HTTP methods, multipart field name, and response shapes against the Spring Boot controllers before wiring pages to live data. The paginated library response is modeled with the common Spring Data Page fields: `content`, `totalElements`, `totalPages`, `number`, `size`, `first`, and `last`.

## Checks

Run `npm run build` and `npm run lint`.
