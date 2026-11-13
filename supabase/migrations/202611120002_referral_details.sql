-- Store referral details as structured fields in the existing enquiries table.
-- Existing row-level security policies continue to protect these fields:
-- public can submit new enquiries; only authorised admins can read or manage them.
alter table public.enquiries
  add column if not exists friend_name text,
  add column if not exists friend_phone text,
  add column if not exists friend_email text;
