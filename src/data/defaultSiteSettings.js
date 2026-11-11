import { SITE } from "@/data/site";

export const DEFAULT_SITE_SETTINGS = [
  { slug: "phoneDisplay", title: "Public phone number", value: SITE.phoneDisplay, published: true, sort_order: 10 },
  { slug: "phoneHref", title: "Phone link", value: SITE.phoneHref, published: true, sort_order: 20 },
  { slug: "whatsappHref", title: "WhatsApp link", value: SITE.whatsappHref, published: true, sort_order: 30 },
  { slug: "website", title: "Website address", value: SITE.website, published: true, sort_order: 40 },
];
