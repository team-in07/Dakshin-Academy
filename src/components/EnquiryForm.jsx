import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { PROGRAMS } from "@/data/programs";

const GRADES = ["K", ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
const TIMINGS = [
  "Weekday mornings",
  "Weekday afternoons",
  "Weekday evenings",
  "Weekends",
  "Flexible",
];

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 min-h-[48px]";

const EMPTY = {
  parentName: "",
  studentName: "",
  grade: "",
  program: "",
  phone: "",
  email: "",
  preferredTiming: "",
  message: "",
  website: "",
};

export default function EnquiryForm({ defaultProgram = "" }) {
  const { pathname } = useLocation();
  const [f, setF] = useState({ ...EMPTY, program: defaultProgram });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setF((previous) => ({ ...previous, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    if (f.website) return;

    setState("sending");
    setError("");

    const formData = new URLSearchParams({
      "form-name": "enquiry",
      ...f,
      source: pathname === "/" ? "Home page" : pathname,
    });

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error("Unable to submit your enquiry.");
      }

      setState("done");
    } catch {
      setError(
        "Unable to submit your enquiry. Please try again or contact us on WhatsApp."
      );
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand-leaf" />
        <h3 className="mt-4 text-2xl font-semibold text-brand-green">
          Thank you!
        </h3>
        <p className="mt-2 text-slate-600">
          We have received your enquiry and will contact you shortly to
          schedule your free assessment.
        </p>
      </div>
    );
  }

  return (
    <form
      name="enquiry"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="website"
      onSubmit={submit}
      className="rounded-3xl bg-white p-6 shadow-xl md:p-8"
    >
      <input type="hidden" name="form-name" value="enquiry" />

      <p className="hidden">
        <label>
          Leave this field empty:
          <input
            name="website"
            value={f.website}
            onChange={set("website")}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </p>

      <h3 className="text-xl font-semibold text-brand-green">
        Book a Free Assessment
      </h3>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Tell us about your child and we will get in touch.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          name="parentName"
          placeholder="Parent's name *"
          aria-label="Parent's name"
          className={field}
          value={f.parentName}
          onChange={set("parentName")}
        />

        <input
          required
          name="studentName"
          placeholder="Student's name *"
          aria-label="Student's name"
          className={field}
          value={f.studentName}
          onChange={set("studentName")}
        />

        <select
          name="grade"
          aria-label="Grade"
          className={field}
          value={f.grade}
          onChange={set("grade")}
        >
          <option value="">Grade</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g === "K" ? "Kindergarten" : `Grade ${g}`}
            </option>
          ))}
        </select>

        <select
          name="program"
          aria-label="Program"
          className={field}
          value={f.program}
          onChange={set("program")}
        >
          <option value="">Program / subject needed</option>
          {PROGRAMS.map((p) => (
            <option key={p.slug} value={p.title}>
              {p.title}
            </option>
          ))}
        </select>

        <input
          required
          name="phone"
          type="tel"
          placeholder="Phone number *"
          aria-label="Phone number"
          className={field}
          value={f.phone}
          onChange={set("phone")}
        />

        <input
          required
          name="email"
          type="email"
          placeholder="Email *"
          aria-label="Email"
          className={field}
          value={f.email}
          onChange={set("email")}
        />

        <select
          name="preferredTiming"
          aria-label="Preferred class timing"
          className={`${field} sm:col-span-2`}
          value={f.preferredTiming}
          onChange={set("preferredTiming")}
        >
          <option value="">Preferred class timing</option>
          {TIMINGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <textarea
          name="message"
          rows={3}
          placeholder="Message"
          aria-label="Message"
          className={`${field} sm:col-span-2`}
          value={f.message}
          onChange={set("message")}
        />

        <input type="hidden" name="source" value={pathname} />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-orange font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-60"
      >
        {state === "sending" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        Book a Free Assessment
      </button>
    </form>
  );
}
