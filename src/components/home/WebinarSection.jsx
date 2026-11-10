import { CalendarDays, Clock, Video } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/site";
import { Link } from "react-router-dom";

export default function WebinarSection() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-brand-leaf/15" />
          <Image src={IMAGES.webinar} alt="High school students exploring real-world math during a Dakshin Academy live webinar" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl" />
          <div className="absolute -bottom-5 left-6 rounded-xl bg-brand-green px-4 py-2 text-white shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">Live online</p>
            <p className="text-sm font-semibold">Free to attend</p>
          </div>
        </div>
        <div>
          <SectionHeading center={false} eyebrow="Free live webinar" title="Applying Math to the Real World" subtitle="Discover how math powers innovation, entrepreneurship and real-world solutions — for high school students." />
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-md bg-brand-purple px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">Speaker</span>
            <span className="text-sm font-semibold text-brand-ink">Prof. Dr. Padmanabhan Seshaiyer</span>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-slate-600">Professor &amp; Director, George Mason University; CIO, Innovations for Water Corp (I4W); President, Discover Engineering; Chair, Virginia STEM Advisory Board, Office of the Governor.</p>
          <div className="mb-8 flex flex-wrap gap-3 text-sm font-medium text-brand-ink">
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><CalendarDays className="h-4 w-4 text-brand-orange" />Thursday, September 19</span>
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><Clock className="h-4 w-4 text-brand-orange" />6:00 PM ET</span>
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm"><Video className="h-4 w-4 text-brand-orange" />Free · Live online</span>
          </div>
          <Link to="/contact#enquiry" className="inline-flex min-h-[48px] items-center rounded-full bg-brand-orange px-7 text-sm font-semibold text-white shadow-lg shadow-orange-500/30">Register Now</Link>
        </div>
      </div>
    </section>
  );
}