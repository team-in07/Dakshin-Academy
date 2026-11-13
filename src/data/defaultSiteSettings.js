import { SITE } from "@/data/site";

export const DEFAULT_SITE_SETTINGS = [
  { slug: "phoneDisplay", title: "Public phone number", value: SITE.phoneDisplay, published: true, sort_order: 10 },
  { slug: "phoneHref", title: "Phone link", value: SITE.phoneHref, published: true, sort_order: 20 },
  { slug: "whatsappHref", title: "WhatsApp link", value: SITE.whatsappHref, published: true, sort_order: 30 },
  { slug: "website", title: "Website address", value: SITE.website, published: true, sort_order: 40 },
  { slug: "google_review_url", title: "Google review link", value: "", published: true, sort_order: 50 },
  { slug: "nextdoor_review_url", title: "Nextdoor page link", value: "", published: true, sort_order: 60 },
  { slug: "referral_benefit", title: "Referral benefit details", value: "", published: true, sort_order: 70 },
];
