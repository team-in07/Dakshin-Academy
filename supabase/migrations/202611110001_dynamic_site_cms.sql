-- Dakshin Academy CMS and database access rules.
-- Apply this migration in the Supabase SQL editor using a database owner account.

create or replace function public.is_dakshin_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;
revoke all on function public.is_dakshin_admin() from public;
grant execute on function public.is_dakshin_admin() to anon, authenticated;

-- Replace only the existing policies confirmed in the project's pg_policies output.
-- Unrelated policies on these tables are left untouched.
alter table public.admin_users enable row level security;
drop policy if exists "Admins can view admin users" on public.admin_users;
drop policy if exists "Admins can view own record" on public.admin_users;
drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

create table if not exists public.cms_content (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('program','hero_slide','faq','section','setting')),
  slug text not null,
  title text not null default '',
  content jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);
create index if not exists cms_content_public_idx on public.cms_content(type, published, sort_order);
grant select on public.cms_content to anon, authenticated;
grant insert, update, delete on public.cms_content to authenticated;
alter table public.cms_content enable row level security;
drop policy if exists "Published website content is public" on public.cms_content;
create policy "Published website content is public" on public.cms_content
  for select to anon, authenticated using (published or public.is_dakshin_admin());
drop policy if exists "Admins manage website content" on public.cms_content;
create policy "Admins manage website content" on public.cms_content
  for all to authenticated using (public.is_dakshin_admin()) with check (public.is_dakshin_admin());

-- Existing enquiry submissions remain public; only whitelisted admins can read or manage them.
alter table public.enquiries add column if not exists status text not null default 'new';
alter table public.enquiries add column if not exists admin_notes text;
alter table public.enquiries enable row level security;
drop policy if exists "Admins can delete enquiries" on public.enquiries;
drop policy if exists "Admins can update enquiries" on public.enquiries;
drop policy if exists "Admins can view enquiries" on public.enquiries;
drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries" on public.enquiries
  for insert to anon, authenticated with check (coalesce(status, 'new') = 'new' and admin_notes is null);
drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Admins manage enquiries" on public.enquiries
  for all to authenticated using (public.is_dakshin_admin()) with check (public.is_dakshin_admin());

-- Tutor and testimonial tables are already used by the public website. These additive fields
-- provide publish controls while retaining their existing content columns.
alter table public.tutors add column if not exists is_published boolean not null default true;
alter table public.testimonials add column if not exists is_published boolean not null default true;
alter table public.tutors enable row level security;
drop policy if exists "Public can read tutors" on public.tutors;
drop policy if exists "Published tutors are public" on public.tutors;
create policy "Published tutors are public" on public.tutors
  for select to anon, authenticated using (is_published or public.is_dakshin_admin());
drop policy if exists "Admins manage tutors" on public.tutors;
create policy "Admins manage tutors" on public.tutors
  for all to authenticated using (public.is_dakshin_admin()) with check (public.is_dakshin_admin());
alter table public.testimonials enable row level security;
drop policy if exists "Admins can delete testimonials" on public.testimonials;
drop policy if exists "Admins can insert testimonials" on public.testimonials;
drop policy if exists "Admins can update testimonials" on public.testimonials;
drop policy if exists "Admins can view all testimonials" on public.testimonials;
drop policy if exists "Public can view approved testimonials" on public.testimonials;
drop policy if exists "Approved published testimonials are public" on public.testimonials;
create policy "Approved published testimonials are public" on public.testimonials
  for select to anon, authenticated using ((permission_granted = true and is_published = true) or public.is_dakshin_admin());
drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials" on public.testimonials
  for all to authenticated using (public.is_dakshin_admin()) with check (public.is_dakshin_admin());

-- Images uploaded from the dashboard are publicly readable and writable only by admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('website-media', 'website-media', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];
drop policy if exists "Website images are public" on storage.objects;
create policy "Website images are public" on storage.objects
  for select to anon, authenticated using (bucket_id = 'website-media');
drop policy if exists "Admins upload website images" on storage.objects;
create policy "Admins upload website images" on storage.objects
  for insert to authenticated with check (bucket_id = 'website-media' and public.is_dakshin_admin());
drop policy if exists "Admins update website images" on storage.objects;
create policy "Admins update website images" on storage.objects
  for update to authenticated using (bucket_id = 'website-media' and public.is_dakshin_admin()) with check (bucket_id = 'website-media' and public.is_dakshin_admin());
drop policy if exists "Admins delete website images" on storage.objects;
create policy "Admins delete website images" on storage.objects
  for delete to authenticated using (bucket_id = 'website-media' and public.is_dakshin_admin());
