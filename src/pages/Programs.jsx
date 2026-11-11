import PageHero from "@/components/PageHero";
import ProgramCard from "@/components/ProgramCard";
import CtaBanner from "@/components/CtaBanner";
import { getPrograms } from "@/data/programs";

export default function Programs() {
  const { data: programs = [] } = useQuery({ queryKey: ["programs"], queryFn: getPrograms });
  return (
    <>
      <PageHero eyebrow="Programs" title="Programs for every learner" subtitle="Focused programs, each taught live online in one-on-one or small-group formats." />
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => <ProgramCard key={p.slug} p={p} />)}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
import { useQuery } from "@tanstack/react-query";
