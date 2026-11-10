export default function SectionHeading({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div className={`mb-12 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">{eyebrow}</p>}
      <h2 className={`text-3xl font-semibold tracking-tight md:text-4xl ${light ? "text-white" : "text-brand-green"}`}>{title}</h2>
      {subtitle && <p className={`mt-4 leading-relaxed ${light ? "text-white/75" : "text-slate-600"}`}>{subtitle}</p>}
    </div>
  );
}