# Dakshin Academy

React and Vite website using Supabase for authentication, database, storage, and the admin dashboard. The frontend is a static Vite build and does not require a platform-specific backend runtime.

## Run locally

1. Install Node.js 20.19 or newer.
2. Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key.
3. Run `npm install` and then `npm run dev`.

## Supabase setup

Apply the SQL files in `supabase/migrations/` to the Supabase project. Keep the Supabase service-role key private; it must never be added to frontend environment variables or committed to Git.

The public website uses the publishable key with row-level security. Administrator accounts must be authorised in `admin_users`.

## Build and hosting

Run `npm run build`; upload the generated `dist/` folder to any static hosting provider that supports SPA rewrites. `public/_redirects` provides the standard fallback for compatible static hosts. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting provider's build environment.

The project is not tied to a particular hosting provider. Connect a separately selected host to a Git repository or deploy the `dist/` output directly.
