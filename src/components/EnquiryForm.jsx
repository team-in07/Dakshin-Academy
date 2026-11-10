import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { PROGRAMS } from "@/data/programs";

const GRADES = ["K", ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const TIMINGS = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends", "Flexible"];
const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 min-h-[48px]";
const EMPTY = { parentName: "", studentName: "", grade: "", program: "", phone: "", email: "", preferredTiming: "", message: "", website: "" };

export default function EnquiryForm({ defaultProgram = "" }) {
  const { pathname } = useLocation();
  const [f, setF] = useState({ ...EMPTY, program: defaultProgram });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState("sending"); setError("");
    try {
      await base44.functions.invoke("submitEnquiry", { ...f, source: pathname === "/" ? "Home page" : pathname });
      base44.analytics.track({ eventName: "enquiry_submitted", properties: { program: f.program || "none" } });
      setState("done");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong. Please try again or message us on WhatsApp.");
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand-leaf" />
        <h3 className="mt-4 text-2xl font-semibold text-brand-green">Thank you!</h3>
        <p className="mt-2 text-slate-600">We have received your enquiry and will contact you shortly to schedule your free assessment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
      <h3 className="text-xl font-semibold text-brand-green">Book a Free Assessment</h3>
      <p className="mb-6 mt-1 text-sm text-slate-500">Tell us about your child and we will get in touch.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Parent's name *" aria-label="Parent's name" className={field} value={f.parentName} onChange={set("parentName")} />
        <input required placeholder="Student's name *" aria-label="Student's name" className={field} value={f.studentName} onChange={set("studentName")} />
        <select aria-label="Grade" className={field} value={f.grade} onChange={set("grade")}>
          <option value="">Grade</option>{GRADES.map((g) => <option key={g} value={g}>{g === "K" ? "Kindergarten" : `Grade ${g}`}</option>)}
        </select>
        <select aria-label="Program" className={field} value={f.program} onChange={set("program")}>
          <option value="">Program / subject needed</option>{PROGRAMS.map((p) => <option key={p.slug} value={p.title}>{p.title}</option>)}
        </select>
        <input required type="tel" placeholder="Phone number *" aria-label="Phone number" className={field} value={f.phone} onChange={set("phone")} />
        <input required type="email" placeholder="Email *" aria-label="Email" className={field} value={f.email} onChange={set("email")} />
        <select aria-label="Preferred class timing" className={`${field} sm:col-span-2`} value={f.preferredTiming} onChange={set("preferredTiming")}>
          <option value="">Preferred class timing</option>{TIMINGS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <textarea rows={3} placeholder="Message" aria-label="Message" className={`${field} sm:col-span-2`} value={f.message} onChange={set("message")} />
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.website} onChange={set("website")} />
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button disabled={state === "sending"} className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-orange font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-60">
        {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} Book a Free Assessment
      </button>
    </form>
  );
}