import { useState } from "react";
import { Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/site";

const ROLES = {
  Students: ["Secure student login", "Class schedule and joining links with reminders", "Recorded sessions and downloadable study materials", "Homework, quizzes and monthly assessments", "SAT practice and full-length mock tests", "Scores, feedback and progress reports"],
  Parents: ["Live view of student performance", "Monthly progress reports", "Fee-due and class alerts", "Easy contact with administrators and tutors"],
  Tutors: ["Assigned students and schedules", "Attendance and topics covered", "Upload homework and materials", "Add scores and feedback"],
};

export default function PortalSection() {
  const [role, setRole] = useState("Students");
  return (
    <section className="bg-brand-green py-24 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <SectionHeading cmsSlug="home-learning-portal" light center={false} eyebrow="Learning portal" title="A digital campus for students, parents and tutors" subtitle="Practice problems with explanations, homework after every session and a quiz before the next one — all in one secure place." />
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-1">
            {Object.keys(ROLES).map((r) => (
              <button key={r} onClick={() => setRole(r)} className={`min-h-[44px] rounded-full px-5 text-sm font-medium transition ${role === r ? "bg-brand-orange text-white" : "text-white/80"}`}>{r}</button>
            ))}
          </div>
          <ul className="space-y-3">
            {ROLES[role].map((x) => <li key={x} className="flex gap-3 text-sm text-white/90"><Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />{x}</li>)}
          </ul>
        </div>
        <Image src={IMAGES.online} alt="Student attending a live online class on a laptop" className="aspect-[3/2] w-full rounded-3xl object-cover shadow-2xl" />
      </div>
    </section>
  );
}
