
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@/data/testimonials";
import SectionHeading from "@/components/SectionHeading";
import TestimonialCard from "@/components/TestimonialCard";

export default function TestimonialsPreview() {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["testimonials", "home"],
    queryFn: getTestimonials,
  });

  return (
    <section className="bg-brand-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Success stories"
          title="Families who trust Dakshin Academy"
        />

        {isLoading && (
          <p className="text-center">Loading success stories...</p>
        )}

        {isError && (
          <p className="text-center text-red-600">
            Unable to load success stories.
          </p>
        )}

        {!isLoading && !isError && (
          <div className="grid gap-6 md:grid-cols-3">
            {items.slice(0, 3).map((t, index) => (
              <TestimonialCard key={t.id || index} t={t} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/success-stories"
            className="font-semibold text-brand-green underline-offset-4 hover:underline"
          >
            See all success stories →
          </Link>
        </div>
      </div>
    </section>
  );
}
