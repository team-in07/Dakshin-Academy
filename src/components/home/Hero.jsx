import { motion } from "framer-motion";
import { Star, Users, Award, Video } from "lucide-react";
import CtaButtons from "@/components/CtaButtons";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/site";

const STATS = [
  { icon: Users, label: "Small groups & 1-on-1" },
  { icon: Video, label: "Live online classes" },
  { icon: Award, label: "Competition mentors" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-cream via-white to-orange-50">
      <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-leaf/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-white px-4 py-1.5 text-xs font-semibold text-brand-green shadow-sm">
            <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" /> Trusted by families for K–12 excellence
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-brand-green md:text-6xl">
            Learn. Innovate. <span className="text-brand-orange">Lead.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Expert tutoring in Math, Science, ELA, SAT/AP, Olympiads, Coding and AI, Public Speaking and Financial Literacy — taught live, online, by mentors who care.
          </p>
          <div className="mt-8"><CtaButtons /></div>
          <div className="mt-10 grid gap-4 border-t sm:grid-cols-3 border-slate-200 pt-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 text-sm font-medium text-brand-ink">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><s.icon className="h-5 w-5" /></span>
                {s.label}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-brand-orange" />
          <Image src={IMAGES.hero} alt="Students collaborating during a Dakshin Academy study session" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl" />
          <div className="animate-float absolute -left-6 bottom-10 rounded-2xl bg-white p-4 shadow-xl">
            <p className="text-xs text-slate-500">Free assessment</p>
            <p className="text-lg font-semibold text-brand-green">Find your level</p>
          </div>
          <div className="animate-float absolute -right-4 top-10 rounded-2xl bg-brand-green p-4 text-white shadow-xl" style={{ animationDelay: "2s" }}>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-white/80">Specialised programs</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}