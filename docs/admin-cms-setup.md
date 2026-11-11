# Dakshin Academy admin CMS

## First-time setup

1. In the Supabase project connected to this website, open **SQL Editor**.
2. Run [`supabase/migrations/202611110001_dynamic_site_cms.sql`](../supabase/migrations/202611110001_dynamic_site_cms.sql) once as a database owner.
3. Confirm the existing `admin_users` table contains exactly the two intended admin accounts. The migration does not add accounts or expose account details.
4. Sign in at `/admin/login` with one of those accounts, then open `/admin`.

The migration creates the CMS table and image bucket, and sets row-level policies so the public can read published website content and submit enquiries while only accounts already present in `admin_users` can manage website content, enquiries, tutors, testimonials, and uploaded images. The CMS does not contain a screen for granting admin access.

## Dashboard sections

- **Programs:** descriptions, audience, topics, benefits, schedule/format, fees, images, display order, and publish state. Use one topic or benefit per line; use `Label | Description` for each format row.
- **Hero announcements:** carousel text, button destination, image, order, and publish state.
- **Website sections:** add custom sections for Home, About, Programs, Contact, Tutors, Success Stories, a program detail page, or all pages.
- **FAQs:** edit question, answer, group, and order.
- **Tutors:** edit profiles and upload images.
- **Testimonials:** edit stories. The permission checkbox must be selected before a story can appear publicly.
- **Website settings:** add settings using keys `phoneDisplay`, `phoneHref`, `whatsappHref`, and `website`; their values update the public footer and phone link.
- **Enquiries:** search and filter, update status, add admin-only notes, contact by phone/email, and delete records.

CMS writes are immediately reflected through the public site after the database migration is installed. When Programs, Hero announcements, or FAQs are first opened, the dashboard saves the current built-in entries into the CMS so those existing items can also be edited, unpublished, or deleted.
