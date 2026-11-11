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
  preferredContact: "",
  phone: "",
  email: "",
  preferredTiming: "",
  timezone: "",
  message: "",
  website: "",
};

function getTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

export default function EnquiryForm({ defaultProgram = "" }) {
  const { pathname } = useLocation();
  const [f, setF] = useState(() => ({ ...EMPTY, program: defaultProgram, timezone: getTimezone() }));
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const needsTimezone = Boolean(f.preferredTiming && f.preferredTiming !== "Flexible");

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
        Share a few details and choose how you would like us to contact you.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Your name <span className="text-brand-orange">*</span>
          <input
            required
            name="parentName"
            autoComplete="name"
            placeholder="Parent or guardian name"
            className={`${field} mt-1`}
            value={f.parentName}
            onChange={set("parentName")}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Student name <span className="font-normal text-slate-400">(optional)</span>
          <input
            name="studentName"
            placeholder="Student's name"
            className={`${field} mt-1`}
            value={f.studentName}
            onChange={set("studentName")}
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Student's grade <span className="text-brand-orange">*</span>
          <select
            required
            name="grade"
            className={`${field} mt-1`}
            value={f.grade}
            onChange={set("grade")}
          >
            <option value="">Select grade</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g === "K" ? "Kindergarten" : `Grade ${g}`}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Course or program <span className="text-brand-orange">*</span>
          <select
            required
            name="program"
            className={`${field} mt-1`}
            value={f.program}
            onChange={set("program")}
          >
            <option value="">Select a program</option>
            {PROGRAMS.map((p) => (
              <option key={p.slug} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Preferred contact method <span className="text-brand-orange">*</span>
          <select
            required
            name="preferredContact"
            className={`${field} mt-1`}
            value={f.preferredContact}
            onChange={set("preferredContact")}
          >
            <option value="">Choose phone, email, or WhatsApp</option>
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </label>

        {(f.preferredContact === "Phone" || f.preferredContact === "WhatsApp") && (
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            {f.preferredContact === "WhatsApp" ? "WhatsApp number" : "Phone number"} <span className="text-brand-orange">*</span>
            <input
              required
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Include country code"
              className={`${field} mt-1`}
              value={f.phone}
              onChange={set("phone")}
            />
          </label>
        )}

        {f.preferredContact === "Email" && (
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Email address <span className="text-brand-orange">*</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`${field} mt-1`}
              value={f.email}
              onChange={set("email")}
            />
          </label>
        )}

        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Preferred class or assessment time <span className="font-normal text-slate-400">(optional)</span>
          <select
            name="preferredTiming"
            className={`${field} mt-1`}
            value={f.preferredTiming}
            onChange={set("preferredTiming")}
          >
            <option value="">Choose a time window</option>
            {TIMINGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {needsTimezone && (
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Your timezone <span className="text-brand-orange">*</span>
            <input
              required
              name="timezone"
              placeholder="e.g. America/New_York or Asia/Kolkata"
              className={`${field} mt-1`}
              value={f.timezone}
              onChange={set("timezone")}
            />
            <span className="mt-1 block font-normal text-slate-500">We detected your timezone; please check it before sending.</span>
          </label>
        )}

        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Message <span className="font-normal text-slate-400">(optional)</span>
          <textarea
            name="message"
            rows={3}
            placeholder="Anything else that would help us prepare?"
            className={`${field} mt-1`}
            value={f.message}
            onChange={set("message")}
          />
        </label>

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
