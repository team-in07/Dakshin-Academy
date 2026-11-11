
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTutors } from "@/data/tutor";
import SectionHeading from "@/components/SectionHeading";
import TutorCard from "@/components/TutorCard";

export default function TutorsPreview() {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["tutors", "home"],
    queryFn: getTutors,
  });

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          cmsSlug="home-tutors-preview"
          eyebrow="Our tutors"
          title="Learn from experienced mentors"
          subtitle="Subject experts with strong academic backgrounds and a passion for teaching."
        />

        {isLoading && <p className="text-center">Loading tutors...</p>}

        {isError && (
          <p className="text-center text-red-600">
            Unable to load tutors. Please try again later.
          </p>
        )}

        {!isLoading && !isError && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.slice(0, 4).map((t, index) => (
              <TutorCard key={t.id || index} tutor={t} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/tutors"
            className="font-semibold text-brand-green underline-offset-4 hover:underline"
          >
            Meet all tutors →
          </Link>
        </div>
      </div>
    </section>
  );
}
