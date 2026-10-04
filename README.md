# Personal Library Frontend

Frontend application for the Personal Library project.

The app provides a desktop-style interface for managing books, papers, notes, and PDFs. Every new library item is backed by a PDF stored in Google Drive, while metadata is managed through the Spring Boot backend.

The frontend is built with React, TypeScript, Vite, Tailwind CSS, and React Router. It is deployed on Vercel and supports installation as a Progressive Web App (PWA).

---

## Live Application

### Frontend

```text
https://personal-library-frontend-chi.vercel.app
```

### Backend API

```text
https://personallibrary-6y1r.onrender.com
```

---

## Features

- Dashboard overview
- Library item listing
- Search library items by title
- Filter by content type
- Filter by reading status
- Sorting
- Pagination
- Add new library items
- Upload PDF files to Google Drive
- Edit library item metadata
- Delete library item metadata
- Open uploaded PDFs directly from Google Drive
- Google Drive OAuth connection
- Google Drive connection status
- Change connected Google Drive account
- Disconnect Google Drive
- Loading states
- Empty states
- Error handling
- Render cold-start handling
- Responsive UI
- Installable PWA
- Vercel deployment
- Integration with deployed Spring Boot backend

---

# Library Item Flow

Every new library item requires a PDF file.

The selected `type` represents the content category of the uploaded document rather than its physical file format.

Supported content types:

```text
BOOK
PAPER
NOTE
PDF
```

For example:

```text
Title: Clean Code
Author: Robert C. Martin
Type: BOOK
Status: TO_READ
File: clean-code.pdf
```

Although the content type is `BOOK`, the actual uploaded file is still a PDF.

The same applies to:

```text
PAPER
NOTE
PDF
```

---

## Create Item Flow

```text
Enter metadata
        ↓
Choose content type
        ↓
Choose reading status
        ↓
Select PDF
        ↓
POST /api/library/upload
        ↓
Spring Boot uploads PDF to Google Drive
        ↓
Google Drive returns file ID
        ↓
Backend creates LibraryItem
        ↓
Drive file ID and URL are stored in PostgreSQL
        ↓
Item appears in frontend library
```

The frontend does not normally create metadata-only items.

The main creation flow uses:

```text
POST /api/library/upload
```

with multipart fields:

```text
title
author
type
status
file
```

---

## Edit Item Flow

Editing an existing item only updates its metadata.

```text
Edit Item
   ↓
Change title / author / type / status
   ↓
PUT /api/library/{id}
```

Editing does not require uploading the PDF again.

The existing Google Drive file remains attached to the item.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Native Fetch API
- ESLint

## Backend Integration

- Spring Boot REST API
- Spring Data JPA
- PostgreSQL
- Supabase PostgreSQL
- Google OAuth 2.0
- Google Drive API

## Deployment

- Vercel — frontend
- Render — backend
- Docker — backend containerization
- GitHub Actions — backend CI/CD

---

# Architecture

```text
User
 |
 v
React + TypeScript Frontend
(Vercel)
 |
 | HTTPS REST requests
 v
Spring Boot Backend
(Render + Docker)
 |
 +-----------------------------+
 |                             |
 v                             v
Supabase PostgreSQL      Google Drive API
                              |
                              v
                        PDF File Storage
```

The frontend never connects directly to Supabase.

All database and Google Drive operations go through the Spring Boot backend.

---

# Project Structure

```text
src/
├── api/
│   ├── client.ts
│   ├── libraryApi.ts
│   └── googleDriveApi.ts
│
├── assets/
│   └── library-mark.svg
│
├── components/
│   ├── common/
│   ├── drive/
│   ├── layout/
│   └── library/
│
├── hooks/
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Library.tsx
│   ├── UploadPdf.tsx
│   └── GoogleDrive.tsx
│
├── types/
│   └── library.ts
│
├── utils/
│   └── pdf.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

PWA-related files include:

```text
public/
├── manifest.webmanifest
├── pwa-192x192.png
├── pwa-512x512.png
└── pwa-maskable-512x512.png
```

The project also contains:

```text
scripts/generate-pwa.mjs
vercel.json
```

---

# Routes

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/library` | Library |
| `/upload` | Upload PDF |
| `/google-drive` | Google Drive |

---

# Environment Variables

The frontend only requires the public backend API URL.

Create a local `.env` file:

```env
VITE_API_BASE_URL=https://personallibrary-6y1r.onrender.com
```

The repository can include:

```text
.env.example
```

with:

```env
VITE_API_BASE_URL=https://personallibrary-6y1r.onrender.com
```

The real `.env` file should remain ignored by Git.

---

## Frontend Security

Do not place backend secrets in the frontend.

The frontend must never contain values such as:

```text
DB_PASSWORD
DB_USERNAME
GOOGLE_CLIENT_SECRET
Google refresh tokens
Supabase database password
Render deploy hook URL
```

The frontend only needs:

```text
VITE_API_BASE_URL
```

---

# Local Development

Clone the frontend repository:

```bash
git clone <frontend-repository-url>
cd personal-library-frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Make sure `.env` contains:

```env
VITE_API_BASE_URL=https://personallibrary-6y1r.onrender.com
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Build

Create a production build:

```bash
npm run build
```

The production output is generated inside:

```text
dist/
```

Preview the production build:

```bash
npm run preview
```

---

# Lint

Run ESLint:

```bash
npm run lint
```

---

# Backend API Integration

## Library Endpoints

```text
GET    /api/library
GET    /api/library/{id}

POST   /api/library

PUT    /api/library/{id}

DELETE /api/library/{id}

GET    /api/library/status/{status}

GET    /api/library/title/{title}

GET    /api/library/type/{type}

POST   /api/library/upload
```

The normal frontend creation flow uses:

```text
POST /api/library/upload
```

instead of:

```text
POST /api/library
```

because every new library item requires a PDF upload.

---

# PDF Upload API

Endpoint:

```text
POST /api/library/upload
```

Request type:

```text
multipart/form-data
```

Fields:

```text
title
author
type
status
file
```

Example logical request:

```text
title = Clean Code
author = Robert C. Martin
type = BOOK
status = TO_READ
file = clean-code.pdf
```

The frontend uses `FormData`.

The browser automatically generates the multipart boundary, so the frontend does not manually set the multipart `Content-Type` header.

---

# Item Types

Supported content types:

```text
BOOK
PAPER
NOTE
PDF
```

These represent what the document is.

They do not represent the physical file extension.

Every new item currently uploads a PDF file.

---

# Reading Statuses

```text
TO_READ
READING
COMPLETED
```

---

# Dashboard

The Dashboard shows:

- Total Items
- To Read
- Reading
- Completed
- Library items
- Google Drive connection status
- Quick Add actions

Dashboard counts are derived from real backend library data.

Unsupported mock values such as weekly statistics, storage quota, and account email are intentionally not displayed.

---

# Library Page

The Library page supports:

- Search by title
- Type filtering
- Reading status filtering
- Sorting
- Pagination
- Add item
- Edit item
- Delete item
- Open Google Drive file

Displayed fields include:

```text
Title
Author
Type
Status
Google Drive
Actions
```

Unsupported design-only metadata such as page counts, file sizes, editions, and word counts are not shown.

---

# Add Item

The Add Item flow requires:

```text
Title
Author
Content Type
Reading Status
PDF File
```

The PDF file is required for:

```text
BOOK
PAPER
NOTE
PDF
```

Creation uses:

```text
POST /api/library/upload
```

---

# Edit Item

Edit mode allows metadata changes without requiring another PDF upload.

Editable fields:

```text
Title
Author
Type
Status
```

Request:

```text
PUT /api/library/{id}
```

The existing Google Drive file remains unchanged.

---

# Delete Item

Deleting an item removes its metadata from the application's database.

It does not currently delete the physical PDF from Google Drive.

The frontend warns the user about this behavior before deletion.

Request:

```text
DELETE /api/library/{id}
```

---

# Google Drive Integration

The application supports Google OAuth 2.0 and Google Drive PDF uploads.

Endpoints:

```text
GET  /api/google-drive/connect

GET  /api/google-drive/callback

GET  /api/google-drive/status

POST /api/google-drive/disconnect
```

---

## Connect Google Drive

The frontend does not call the connect endpoint using `fetch`.

Instead, it performs browser navigation to:

```text
${VITE_API_BASE_URL}/api/google-drive/connect
```

The flow is:

```text
Frontend
   ↓
Spring Boot /api/google-drive/connect
   ↓
Google OAuth consent screen
   ↓
Google redirects to backend callback
   ↓
/api/google-drive/callback
   ↓
Backend exchanges authorization code
   ↓
Refresh token stored in PostgreSQL
   ↓
Google Drive connected
```

---

# Google Drive Status

The backend currently returns:

```json
{
  "connected": true
}
```

or:

```json
{
  "connected": false
}
```

The frontend only displays information supported by this response.

It does not invent values such as:

```text
Google email address
Google Drive quota
Storage usage
Sync history
Recent activity
```

---

# Google Drive Account Behavior

The application currently supports one active Google Drive connection.

When Account A is connected:

```text
new uploads
→ Account A Drive
```

If the user changes to Account B:

```text
existing Account A files
→ remain in Account A Drive

new uploads
→ Account B Drive
```

The application does not automatically move existing files between Google Drive accounts.

---

# Google OAuth Callback

Production callback:

```text
https://personallibrary-6y1r.onrender.com/api/google-drive/callback
```

The same callback must exist in the Google Cloud OAuth client's Authorized Redirect URIs.

---

# CORS

The frontend and backend run on different origins.

Local frontend:

```text
http://localhost:5173
```

Production frontend:

```text
https://personal-library-frontend-chi.vercel.app
```

Backend:

```text
https://personallibrary-6y1r.onrender.com
```

The Spring Boot backend allows the frontend origins through CORS configuration.

Example:

```java
.allowedOrigins(
    "http://localhost:5173",
    "https://personal-library-frontend-chi.vercel.app"
)
```

---

# Render Cold Starts

The Spring Boot backend is hosted on Render.

A free Render instance may sleep after inactivity.

The frontend handles this behavior with:

```text
request starts
↓
loading state appears
↓
if request continues for several seconds
↓
show "server may be waking up"
↓
if request actually fails
↓
show Retry
```

The frontend does not display fake loading percentages.

---

# PWA Support

The frontend is installable as a Progressive Web App.

The web manifest includes:

```text
Name: Personal Library
Short name: Library
Start URL: /
Display: standalone
Orientation: any
```

Theme colors:

```text
Background: #f8f9ff
Theme: #131b2e
```

---

# PWA Icons

The application includes:

```text
192x192 icon
512x512 icon
512x512 maskable icon
```

The icons are based on the Personal Library brand mark.

---

# Service Worker

The service worker caches frontend application assets.

It does not aggressively cache dynamic requests such as:

```text
Render backend API requests
Google OAuth requests
Google Drive operations
PDF uploads
dynamic library data
```

Network connectivity is still required for backend and Google Drive functionality.

---

# Install as Desktop App

Open:

```text
https://personal-library-frontend-chi.vercel.app
```

using Chrome or Edge.

The browser should display an:

```text
Install
```

or:

```text
Install App
```

option.

After installation, Personal Library can launch from the operating system application menu or desktop.

The installed app opens in standalone mode without the normal browser tab and address bar interface.

---

# Design System

The frontend UI was implemented from exported design references.

The local design reference directory is:

```text
design/
```

This directory is intentionally excluded from Git.

---

## Layout

Main desktop layout:

```text
240px sidebar
64px topbar
main content area
```

The application uses a desktop-first interface.

---

## Typography

Main fonts:

```text
Newsreader
Geist
```

Newsreader is mainly used for editorial/page headings.

Geist is used for interface text.

---

## Main Colors

```text
Page background:      #f8f9ff
Surface:              #ffffff
Pale control surface: #eff4ff
Main text:            #0b1c30
Secondary text:       #45464d
Primary button:       #000000
Active navigation:    #131b2e
Accent:               #4b41e1
Border:               #c6c6cd
Destructive:          #ba1a1a
```

Status colors include:

```text
To Read:    #dce9ff
Reading:    #e2dfff
Completed:  #6ffbbe
Connected:  #4edea3
```

---

# Responsive Behavior

The desktop interface is the primary design.

Smaller screens use:

- compact topbar controls
- wrapping filters
- horizontally scrollable tables
- compact navigation behavior
- bottom navigation where appropriate

---

# Loading and Error States

The frontend includes:

- loading states
- server wake-up messaging
- empty library states
- request error states
- Retry actions
- upload pending state
- upload success state
- upload error state

---

# PDF Validation

The frontend validates uploaded files before sending them.

The selected document must be a PDF.

Validation checks:

```text
application/pdf
```

with a `.pdf` extension fallback when the browser does not provide a MIME type.

---

# Production Deployment

The frontend is deployed on Vercel.

Architecture:

```text
GitHub repository
      ↓
Vercel
      ↓
Vite production build
      ↓
Personal Library frontend
```

Production URL:

```text
https://personal-library-frontend-chi.vercel.app
```

---

# Vercel Environment Variable

The production frontend uses:

```env
VITE_API_BASE_URL=https://personallibrary-6y1r.onrender.com
```

---

# SPA Routing

The application uses React Router.

Vercel routing is configured so direct navigation and refresh work for:

```text
/
 /library
 /upload
 /google-drive
```

without returning a 404.

---

# Backend Deployment

The backend is deployed separately.

```text
Spring Boot
    ↓
Docker
    ↓
Render
    ↓
Supabase PostgreSQL
```

Backend URL:

```text
https://personallibrary-6y1r.onrender.com
```

---

# Backend CI/CD

The backend uses GitHub Actions.

Pipeline:

```text
Push / Pull Request
       ↓
GitHub Actions
       ↓
Temporary PostgreSQL 17
       ↓
Run tests
       ↓
Build JAR
       ↓
Build Docker image
       ↓
If main branch passes
       ↓
Render Deploy Hook
       ↓
Render deployment
```

The Render Deploy Hook is stored securely as:

```text
RENDER_DEPLOY_HOOK_URL
```

in GitHub Actions repository secrets.

---

# Production Architecture

```text
                 ┌─────────────────────┐
                 │        User         │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Vercel Frontend   │
                 │ React + TypeScript  │
                 │        PWA          │
                 └──────────┬──────────┘
                            │
                            │ HTTPS
                            ▼
                 ┌─────────────────────┐
                 │   Render Backend    │
                 │     Spring Boot     │
                 │       Docker        │
                 └───────┬───────┬─────┘
                         │       │
                         │       │
                 ┌───────▼───┐   ▼
                 │ Supabase  │ Google Drive API
                 │PostgreSQL │
                 └───────────┘
```

---

# Current Production Status

- Frontend deployed successfully on Vercel
- Backend deployed successfully on Render
- Docker backend deployment working
- Supabase PostgreSQL connected
- Google OAuth integration working
- Google Drive uploads working
- Library CRUD working
- PDF upload flow working
- Google Drive connection status working
- CORS configured
- PWA installation working
- React Router working
- Production frontend/backend integration working
- Frontend build passing
- Frontend lint passing
- Backend CI/CD configured

---

# Production URLs

## Frontend

```text
https://personal-library-frontend-chi.vercel.app
```

## Backend

```text
https://personallibrary-6y1r.onrender.com
```

## Google OAuth Callback

```text
https://personallibrary-6y1r.onrender.com/api/google-drive/callback
```

---

# Future Improvements

Possible future improvements include:

- Google OAuth production verification
- Better combined server-side filtering
- Combined search and pagination
- Additional document metadata
- More detailed Google Drive account information
- Upload progress support
- Improved accessibility
- Better mobile-specific layouts
- End-to-end browser testing
- Frontend CI/CD verification
- Better offline read-only support
- Automatic document metadata extraction
- Additional file formats
- Improved Google Drive file lifecycle management

---

# License

This project is currently intended for personal and educational use.
