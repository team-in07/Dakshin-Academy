import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ProgramCard from "@/components/ProgramCard";
import { PROGRAMS } from "@/data/programs";

export default function ProgramsGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Programs" title="One academy, every ambition" subtitle="From school foundations to national competitions, choose the path that fits your child." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <motion.div key={p.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <ProgramCard p={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}