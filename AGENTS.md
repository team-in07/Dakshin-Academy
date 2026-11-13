# Project notes

This is a user-owned React/Vite website. Preserve its existing branding and conventions and keep changes focused on the request.

## Architecture

- `src/` contains the React application.
- Supabase provides authentication, the database, and website media storage.
- `supabase/migrations/` contains database policies and schema changes.
- The frontend is a static Vite build; it does not depend on a proprietary app runtime.
- Never expose or commit the Supabase service-role key. Browser code uses only the publishable key and relies on row-level security.

## Commands

- `npm run dev` starts the local frontend.
- `npm run build` creates the static site in `dist/`.
- Deploy `dist/` to a static host configured with the two `VITE_SUPABASE_*` environment variables.
