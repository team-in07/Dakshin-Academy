

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check, Users, User } from "lucide-react";

import { getProgram } from "@/data/programs";
import { getTutors } from "@/data/tutor";
import { getTestimonials } from "@/data/testimonials";

import PageHero from "@/components/PageHero";
import CtaButtons from "@/components/CtaButtons";
import CtaBanner from "@/components/CtaBanner";
import TutorCard from "@/components/TutorCard";
import TestimonialCard from "@/components/TestimonialCard";
import EnquiryForm from "@/components/EnquiryForm";
import PageNotFound from "@/lib/PageNotFound";

const H = ({ children }) => (
  <h2 className="mb-5 text-2xl font-semibold text-brand-green">
    {children}
  </h2>
);

export default function ProgramDetail() {
  const { slug } = useParams();
  const p = getProgram(slug);

  useEffect(() => {
    if (!p) return;

    document.title = p.seoTitle;

    let m = document.querySelector('meta[name="description"]');

    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }

    m.content = p.seoDesc;
  }, [p]);

  const { data: allTutors = [] } = useQuery({
    queryKey: ["tutors", "all"],
    queryFn: getTutors,
    enabled: !!p,
  });

  const { data: allStories = [] } = useQuery({
    queryKey: ["testimonials", "all"],
    queryFn: getTestimonials,
    enabled: !!p,
  });

  if (!p) return <PageNotFound />;

  const tutors = allTutors
    .filter(
      (t) =>
        Array.isArray(t.programSlugs) &&
        t.programSlugs.includes(slug)
    )
    .slice(0, 4);

  const stories = allStories
    .filter((s) => s.programSlug === slug)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Program"
        title={p.title}
        subtitle={p.short}
      >
        <CtaButtons dark />
      </PageHero>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_380px]">
        <div className="space-y-14">

          <section>
            <H>Who it is for</H>
            <p className="leading-relaxed text-slate-600">
              {p.audience}
            </p>
          </section>

          <section>
            <H>Topics covered</H>
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.topics.map((t) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-xl bg-white p-4 text-sm shadow-sm"
                >
                  <Check className="h-5 w-5 shrink-0 text-brand-leaf" />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <H>One-on-one and small-group options</H>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-green/15 bg-white p-6">
                <User className="h-7 w-7 text-brand-orange" />
                <h3 className="mt-3 font-semibold text-brand-green">
                  One-on-one
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Fully personalised pace and focus, ideal for closing
                  gaps or accelerating fast.
                </p>
              </div>

              <div className="rounded-2xl border border-brand-green/15 bg-white p-6">
                <Users className="h-7 w-7 text-brand-orange" />
                <h3 className="mt-3 font-semibold text-brand-green">
                  Small group
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Peer learning in small batches that keep attention
                  high and cost lower.
                </p>
              </div>
            </div>
          </section>

          <section>
            <H>Program benefits</H>
            <ul className="space-y-3">
              {p.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-slate-600">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <H>Class format and schedule</H>
            <dl className="divide-y rounded-2xl bg-white shadow-sm">
              {p.format.map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-1 p-4 sm:grid-cols-[200px_1fr]"
                >
                  <dt className="text-sm font-semibold text-brand-green">
                    {k}
                  </dt>
                  <dd className="text-sm text-slate-600">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {tutors.length > 0 && (
            <section>
              <H>Your tutors</H>
              <div className="grid gap-6 sm:grid-cols-2">
                {tutors.map((t, index) => (
                  <TutorCard
                    key={t.id || `tutor-${index}`}
                    tutor={t}
                  />
                ))}
              </div>
            </section>
          )}

          {stories.length > 0 && (
            <section>
              <H>What families say</H>
              <div className="grid gap-6 sm:grid-cols-2">
                {stories.map((t, index) => (
                  <TestimonialCard
                    key={t.id || `story-${index}`}
                    t={t}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <EnquiryForm defaultProgram={p.title} />
        </aside>
      </div>

      <CtaBanner />
    </>
  );
}
