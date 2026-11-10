import { Target, Lightbulb, Compass } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/site";

const VALUES = [
  { icon: Lightbulb, t: "Learn", d: "Deep conceptual understanding built through guided practice and clear explanations." },
  { icon: Compass, t: "Innovate", d: "Applying data and analytical skills to solve real-world problems, from research to entrepreneurship." },
  { icon: Target, t: "Lead", d: "Confidence, communication and character that prepare students to lead." },
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Empowering tomorrow's innovators" subtitle="Real problems. Brighter futures." />
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading center={false} eyebrow="Our story" title="Education that connects ideas to impact" />
            <p className="leading-relaxed text-slate-600">Dakshin Academy helps students in Grades K–12 build strong academic foundations and the skills to use them. From school Math, ELA and Science to SAT/AP, Olympiads, Coding and AI, Public Speaking and Financial Literacy, every program is designed to move students from ideas to impact.</p>
            <p className="mt-4 leading-relaxed text-slate-600">We combine live online teaching with a secure learning platform: online homework after each session, a quiz before the next class, recorded sessions, and monthly progress reports for parents.</p>
          </div>
          <Image src={IMAGES.hero} alt="Students learning together at Dakshin Academy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.t} className="rounded-3xl bg-brand-cream p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green text-white"><v.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-semibold text-brand-green">{v.t}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}