export default function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
        <path d="M6 44V20C6 9 14 3 24 3s18 6 18 17v24z" fill="#faf8f4" stroke="#55601c" strokeWidth="2.5" />
        <path d="M24 36V18" stroke="#55601c" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 26c-5-1-8-4-9-8M24 22c4-1 7-4 8-8M24 18c0-4 1-7 0-10" stroke="#788629" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="15" cy="17" r="2.4" fill="#c64d29" />
        <circle cx="32" cy="13" r="2.4" fill="#c64d29" />
        <circle cx="24" cy="8" r="2.4" fill="#788629" />
        <path d="M10 38c5-3 10-3 14 0 4-3 9-3 14 0v4c-5-3-10-3-14 0-4-3-9-3-14 0z" fill="#c64d29" />
      </svg>
      <span className="leading-none">
        <span className={`block text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-brand-green"}`}>DAKSHIN</span>
        <span className="block text-lg font-extrabold tracking-tight text-brand-orange">ACADEMY</span>
        <span className={`mt-1 block text-[9px] font-medium tracking-[0.2em] ${light ? "text-white/70" : "text-slate-500"}`}>LEARN | INNOVATE | LEAD</span>
      </span>
    </span>
  );
}