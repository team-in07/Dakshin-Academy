# Local setup

This is a standalone Vite frontend backed by Supabase.

1. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key.
2. Run `npm install`.
3. Run `npm run dev` and open the local URL shown in the terminal.

Apply the SQL migrations in `supabase/migrations/` to the Supabase project before using the admin CMS. The public website uses the Supabase publishable key and the database's row-level security policies. Never put a service-role key in browser code.
