const ITEMS = ["AMC · MathCounts", "Science Olympiad", "USABO", "SAT & AP", "Coding & AI", "Public Speaking", "Financial Literacy", "K–12 Math, ELA & Science"];

export default function ResultsStrip() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white py-5" aria-hidden="true">
      <div className="animate-marquee flex w-max gap-12">
        {row.map((x, i) => <span key={i} className="flex items-center gap-12 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-brand-green/70">{x}<span className="h-1.5 w-1.5 rounded-full bg-brand-orange" /></span>)}
      </div>
    </div>
  );
}