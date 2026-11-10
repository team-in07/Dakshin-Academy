import { Quote } from "lucide-react";

const LABELS = {
  parent_review: "Parent review",
  student_achievement: "Student achievement",
  score_improvement: "Score improvement",
  competition_result: "Competition result",
  student_project: "Student project",
};

export default function TestimonialCard({ t }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <Quote className="h-8 w-8 text-brand-orange/70" />
        <span className="rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-semibold text-brand-green">{LABELS[t.category] || "Story"}</span>
      </div>
      {t.highlight && <p className="mt-4 text-2xl font-bold text-brand-leaf">{t.highlight}</p>}
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">“{t.quote}”</blockquote>
      <figcaption className="mt-5 border-t pt-4">
        <p className="text-sm font-semibold text-brand-ink">{t.author}</p>
        {t.detail && <p className="text-xs text-slate-500">{t.detail}</p>}
      </figcaption>
    </figure>
  );
}