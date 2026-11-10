import { motion } from "framer-motion";
import { ClipboardCheck, Users, LineChart, Video, ShieldCheck, Sparkles } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const ITEMS = [
  { icon: ClipboardCheck, t: "Free assessment", d: "We identify your child's level, strengths and gaps before recommending a plan." },
  { icon: Users, t: "One-on-one & small groups", d: "Personal attention and active participation in every class." },
  { icon: LineChart, t: "Progress you can see", d: "Homework, quizzes and monthly reports so parents always know where their child stands." },
  { icon: Video, t: "Live and recorded", d: "Live classes on Zoom or Google Meet, with recordings to revisit any lesson." },
  { icon: Sparkles, t: "Personalised learning", d: "Practice problems with explanations, adapted to what each student needs." },
  { icon: ShieldCheck, t: "Secure & private", d: "Student information is handled with role-based access and care." },
];

export default function WhyDakshin() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Why Dakshin Academy" title="Learning built around the student" />
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <motion.div key={it.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange"><it.icon className="h-6 w-6" /></span>
              <div><h3 className="font-semibold text-brand-green">{it.t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{it.d}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}