-- Expand the existing CMS so authorised administrators can maintain the
-- upcoming sessions, batches, video testimonials and genuine review details.
alter table public.cms_content drop constraint if exists cms_content_type_check;
alter table public.cms_content add constraint cms_content_type_check
  check (type in (
    'program', 'hero_slide', 'faq', 'section', 'setting',
    'webinar', 'batch', 'video_testimonial', 'review', 'college'
  ));

-- Referral and admission forms continue to use the existing enquiries table,
-- whose public insert and admin-only read/update/delete policies are already
-- defined in the original site migration.
