import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/data/site";

export default function CtaButtons({ dark = false, showPrograms = true }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link to="/contact#enquiry" className="inline-flex min-h-[48px] items-center rounded-full bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 hover:bg-orange-600">Book a Free Assessment</Link>
      <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"><MessageCircle className="h-4 w-4" />Chat on WhatsApp</a>
      {showPrograms && (
        <Link to="/programs" className={`inline-flex min-h-[48px] items-center rounded-full border-2 px-6 text-sm font-semibold transition ${dark ? "border-white/60 text-white hover:bg-white/10" : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"}`}>View Programs</Link>
      )}
    </div>
  );
}