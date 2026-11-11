import { Link } from "react-router-dom";
import { Phone, Globe, MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { PROGRAMS } from "@/data/programs";
import { SITE } from "@/data/site";
import { useQuery } from "@tanstack/react-query";
import { getPrograms } from "@/data/programs";
import { getSiteSettings } from "@/data/cms";

export default function Footer() {
  const { data: programs = PROGRAMS } = useQuery({ queryKey: ["programs"], queryFn: getPrograms });
  const { data: settings = {} } = useQuery({ queryKey: ["cms", "settings"], queryFn: getSiteSettings });
  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-white/75">Empowering tomorrow's innovators through expert tutoring, competition coaching and real-world learning.</p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Programs</h4>
          <ul className="space-y-2 text-sm text-white/75">
            {programs.map((p) => <li key={p.slug}><Link className="hover:text-brand-orange" to={`/programs/${p.slug}`}>{p.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link className="hover:text-brand-orange" to="/success-stories">Success Stories</Link></li>
            <li><Link className="hover:text-brand-orange" to="/tutors">Our Tutors</Link></li>
            <li><Link className="hover:text-brand-orange" to="/about">About Us</Link></li>
            <li><Link className="hover:text-brand-orange" to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Get in touch</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li><a className="flex items-center gap-2 hover:text-brand-orange" href={settings.phoneHref || SITE.phoneHref}><Phone className="h-4 w-4" />{settings.phoneDisplay || SITE.phoneDisplay}</a></li>
            <li><a className="flex items-center gap-2 hover:text-brand-orange" href={settings.whatsappHref || SITE.whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" />Chat on WhatsApp</a></li>
            <li className="flex items-center gap-2"><Globe className="h-4 w-4" />{settings.website || SITE.website}</li>
          </ul>
          <Link to="/contact#enquiry" className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-brand-orange px-5 text-sm font-semibold">Book a Free Assessment</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">© {new Date().getFullYear()} Dakshin Academy. All rights reserved.</div>
    </footer>
  );
}
