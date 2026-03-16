# Capture — Screen Recording & Video Sharing Platform

Capture is a full-stack screen recording and video sharing platform that lets users record their screen directly in the browser, upload recordings or pre-produced videos, and share them publicly or privately with a clean, fast viewing experience.

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 4**
- **Cloudinary Video Player** — embedded iframe player with processing status polling
- **Framer Motion** — page transitions, staggered list reveals, modal animations
- **JWT Authentication** — Google OAuth flow with custom access + refresh tokens

## Architecture

This is a decoupled frontend that communicates exclusively with the separate FastAPI backend (`capture-backend`). Key patterns:

- **Auth**: Google OAuth authorization code flow → backend exchanges code for tokens → `access_token` and `refresh_token` stored in `localStorage`. The `AuthContext` exposes `user`, `signOut`, and `refreshUser` throughout the app.
- **Route protection**: `AuthGuard` component wraps authenticated routes. It redirects unauthenticated users to `/sign-in` and shows a spinner while the auth state resolves.
- **Signed uploads**: Videos and thumbnails are uploaded directly from the browser to Cloudinary using signed upload parameters fetched from the backend — the backend never proxies the file data.
- **Video processing**: After upload, `VideoPlayer` polls the backend every 3 seconds to check Cloudinary's processing status and shows a progress indicator until the video is ready.

## Setup

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### Development

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.
