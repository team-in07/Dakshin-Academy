import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const STEPS = [
  { n: "01", t: "Free assessment", d: "A short diagnostic and conversation to understand your child's goals." },
  { n: "02", t: "Live session", d: "Interactive class with an expert tutor, one-on-one or in a small group." },
  { n: "03", t: "Homework & recordings", d: "Online homework after each session, plus recordings and study materials." },
  { n: "04", t: "Quiz before next class", d: "A quick quiz keeps concepts fresh and shows the tutor what to focus on." },
  { n: "05", t: "Monthly report", d: "Parents receive a progress report with scores, feedback and next steps." },
];

export default function LearningJourney() {
  return (
    <section className="bg-brand-cream py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading cmsSlug="home-learning-journey" eyebrow="How it works" title="A learning cycle that keeps students on track" />
        <div className="relative">
          <div className="absolute left-5 top-2 h-[calc(100%-1rem)] w-0.5 bg-gradient-to-b from-brand-orange to-brand-leaf md:left-1/2" />
          {STEPS.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, x: i % 2 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className={`relative mb-10 pl-16 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}>
              <span className={`absolute top-0 flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white ring-4 ring-brand-cream left-0 ${i % 2 ? "md:-left-5" : "md:left-auto md:-right-5"}`}>{s.n}</span>
              <div className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-semibold text-brand-green">{s.t}</h3><p className="mt-1 text-sm text-slate-600">{s.d}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
