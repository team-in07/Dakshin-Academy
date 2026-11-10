import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PageHero from "@/components/PageHero";
import TutorCard from "@/components/TutorCard";
import CtaBanner from "@/components/CtaBanner";

const getItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

export default function Tutors() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tutors", "all"],
    queryFn: () => base44.entities.Tutor.list("sortOrder", 60),
  });

  const items = getItems(data);

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
            <p className="text-center text-slate-500">Loading tutors…</p>
          ) : isError ? (
            <p role="alert" className="text-center text-red-600">
              We couldn’t load the tutors. Please check the Base44 backend
              configuration and try again.
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
                  key={tutor.id ?? `tutor-${index}`}
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
