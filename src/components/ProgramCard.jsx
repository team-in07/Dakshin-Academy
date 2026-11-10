import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap, Trophy, Code2, Mic, Wallet } from "lucide-react";

const ICONS = { BookOpen, GraduationCap, Trophy, Code2, Mic, Wallet };

export default function ProgramCard({ p }) {
  const Icon = ICONS[p.icon];
  return (
    <Link to={`/programs/${p.slug}`} className="group relative flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1.5 hover:border-brand-orange/40 hover:shadow-2xl">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green text-white transition group-hover:bg-brand-orange"><Icon className="h-7 w-7" /></span>
      <h3 className="mt-5 text-lg font-semibold text-brand-green">{p.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.short}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">Explore program <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
    </Link>
  );
}