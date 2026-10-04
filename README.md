# Personal Library frontend

React, TypeScript, Vite, React Router, and Tailwind CSS frontend for the Personal Library Spring Boot API. The visual system follows the gitignored design/ references.

## Local development

1. Run npm install.
2. Copy .env.example to .env. Set VITE_API_BASE_URL to the public backend URL.
3. Run npm run dev.

The frontend calls only the Spring Boot API. Do not put Google credentials, database credentials, or other secrets in VITE_ variables: Vite exposes those values in the browser bundle.

The backend must allow http://localhost:5173 through CORS for local development and the final Vercel origin when deployed. Google Drive connect uses a browser redirect to the backend, not a fetch request.

## Supported UI

- Dashboard totals and library items from backend data.
- Library CRUD, title search, type/status filtering, sorting, and pagination.
- PDF upload with title, author, type, status, and file multipart fields.
- Google Drive connected/disconnected status, connect, disconnect, and account change by disconnecting then reconnecting.

The API response for Drive status currently contains only connected. The UI intentionally omits account email, storage usage, sync history, and other unsupported mock data. Title search uses /api/library/title/{title}. When filtering or searching, pagination and any additional filters apply to the returned matches in the browser; the default unfiltered list uses Spring pageable parameters.

Native fetch shows an indeterminate upload state. It does not report upload percentages. A slow request displays a server wake-up message after eight seconds without delaying the request.

## Checks

Run npm run build and npm run lint.
