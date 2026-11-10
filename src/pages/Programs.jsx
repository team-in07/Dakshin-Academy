import PageHero from "@/components/PageHero";
import ProgramCard from "@/components/ProgramCard";
import CtaBanner from "@/components/CtaBanner";
import { PROGRAMS } from "@/data/programs";

export default function Programs() {
  return (
    <>
      <PageHero eyebrow="Programs" title="Programs for every learner" subtitle="Six focused programs, each taught live online in one-on-one or small-group formats." />
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => <ProgramCard key={p.slug} p={p} />)}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}