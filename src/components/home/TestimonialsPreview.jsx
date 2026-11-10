import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/SectionHeading";
import TestimonialCard from "@/components/TestimonialCard";

export default function TestimonialsPreview() {
  const { data } = useQuery({
    queryKey: ["testimonials", "home"],
    queryFn: () => base44.entities.Testimonial.list("sortOrder", 3),
  });
  const items = data?.items ?? data ?? [];
  return (
    <section className="bg-brand-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Success stories" title="Families who trust Dakshin Academy" />
        <div className="grid gap-6 md:grid-cols-3">{items.map((t) => <TestimonialCard key={t.id} t={t} />)}</div>
        <div className="mt-10 text-center"><Link to="/success-stories" className="font-semibold text-brand-green underline-offset-4 hover:underline">See all success stories →</Link></div>
      </div>
    </section>
  );
}