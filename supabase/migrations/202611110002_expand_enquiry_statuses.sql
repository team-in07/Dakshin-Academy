-- Preserve the four statuses already allowed in production and add the dashboard's
-- workflow statuses so its dropdown can save every option.
begin;

alter table public.enquiries
  drop constraint if exists enquiries_status_check;

alter table public.enquiries
  add constraint enquiries_status_check
  check (status in ('new', 'contacted', 'converted', 'in_progress', 'enrolled', 'closed'));

commit;
