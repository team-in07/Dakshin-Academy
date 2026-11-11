import { Phone, MessageCircle, Globe } from "lucide-react";
import PageHero from "@/components/PageHero";
import EnquiryForm from "@/components/EnquiryForm";
import FaqSection from "@/components/FaqSection";
import { SITE } from "@/data/site";
import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/data/cms";

export default function Contact() {
  const { data: settings = {} } = useQuery({ queryKey: ["cms", "settings"], queryFn: getSiteSettings });
  const rows = [
    { icon: Phone, t: "Call us", v: settings.phoneDisplay || SITE.phoneDisplay, href: settings.phoneHref || SITE.phoneHref },
    { icon: MessageCircle, t: "WhatsApp", v: "Chat on WhatsApp", href: settings.whatsappHref || SITE.whatsappHref },
    { icon: Globe, t: "Website", v: settings.website || SITE.website },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your child's goals" subtitle="Book a free assessment or ask us anything." />
      <section id="enquiry" className="scroll-mt-28 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5">
            {rows.map((r) => {
              const inner = (<><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green text-white"><r.icon className="h-5 w-5" /></span><span><span className="block text-xs text-slate-500">{r.t}</span><span className="font-semibold text-brand-green">{r.v}</span></span></>);
              return r.href ? <a key={r.t} href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-lg">{inner}</a> : <div key={r.t} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">{inner}</div>;
            })}
          </div>
          <EnquiryForm />
        </div>
      </section>
      <FaqSection />
    </>
  );
}
