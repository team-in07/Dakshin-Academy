
import { useQuery } from "@tanstack/react-query";
import { getTutors } from "@/data/tutor";
import PageHero from "@/components/PageHero";
import TutorCard from "@/components/TutorCard";
import CtaBanner from "@/components/CtaBanner";

export default function Tutors() {
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tutors", "all"],
    queryFn: getTutors,
  });

  return (
    <>
      <PageHero
        eyebrow="Our tutors"
        title="Meet the mentors"
        subtitle="Experienced educators and subject experts who make learning clear, rigorous and inspiring."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {isLoading ? (
            <p className="text-center text-slate-500">
              Loading tutors...
            </p>
          ) : isError ? (
            <p role="alert" className="text-center text-red-600">
              Unable to load tutors. Please check your tutors.csv file.
              {error?.message ? ` (${error.message})` : ""}
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-slate-500">
              Tutor profiles will appear here once they have been added.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((tutor, index) => (
                <TutorCard
                  key={tutor.id || `tutor-${index}`}
                  tutor={tutor}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
