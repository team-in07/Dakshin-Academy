import { Image } from "@/components/ui/image";
import { GraduationCap, Clock, BookOpen } from "lucide-react";

export default function TutorCard({ tutor }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        {tutor.photoUrl && <Image src={tutor.photoUrl} alt={`Portrait of ${tutor.name}, tutor at Dakshin Academy`} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-green/90 to-transparent p-5 pt-16">
          <h3 className="text-lg font-semibold text-white">{tutor.name}</h3>
          <p className="text-xs text-white/80">{tutor.qualifications}</p>
        </div>
      </div>
      <div className="space-y-2.5 p-5 text-sm text-slate-600">
        <p className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />{tutor.experience}</p>
        <p className="flex gap-2"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />{tutor.subjects}</p>
        <p className="flex gap-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />Grades: {tutor.grades}</p>
        <p className="pt-2 leading-relaxed">{tutor.intro}</p>
      </div>
    </article>
  );
}