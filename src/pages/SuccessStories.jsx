
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import PageHero from "@/components/PageHero";
import TestimonialCard from "@/components/TestimonialCard";
import CtaBanner from "@/components/CtaBanner";

const TABS = [
  ["all", "All"],
  ["parent_review", "Parent reviews"],
  ["student_achievement", "Achievements"],
  ["score_improvement", "SAT/AP scores"],
  ["competition_result", "Competitions"],
  ["student_project", "Projects"],
];

export default function SuccessStories() {
  const [tab, setTab] = useState("all");

  // Use list(), which is already working on your homepage.
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stories", "all"],
    queryFn: () => base44.entities.Testimonial.list("sortOrder", 60),
  });

  const allItems = data?.items ?? data ?? [];

  // Filter categories locally instead of calling the failing filter API.
  const items =
    tab === "all"
      ? allItems
      : allItems.filter((story) => story.category === tab);

  return (
    <>
      <PageHero
        eyebrow="Success stories"
        title="Real progress, real families"
        subtitle="Parent reviews, student achievements, score improvements, competition results and projects."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {TABS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`min-h-[44px] rounded-full px-5 text-sm font-medium transition ${
                  tab === key
                    ? "bg-brand-green text-white"
                    : "bg-white text-brand-ink shadow-sm hover:bg-brand-cream"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-center text-slate-500">
              Loading success stories...
            </p>
          ) : isError ? (
            <p className="text-center text-red-600">
              Unable to load success stories: {error?.message}
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-slate-500">
              No stories in this category yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((story) => (
                <TestimonialCard key={story.id} t={story} />
              ))}
            </div>
          )}

          <p className="mt-12 text-center text-xs text-slate-500">
            Student names and photos are shown only with parent permission.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
