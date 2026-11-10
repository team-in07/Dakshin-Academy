import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Phone, BookOpen, GraduationCap, Trophy, Code2, Mic, Wallet } from "lucide-react";
import Logo from "@/components/Logo";
import { PROGRAMS } from "@/data/programs";
import { SITE } from "@/data/site";
import { useAuth } from "@/lib/AuthContext";

const ICONS = { BookOpen, GraduationCap, Trophy, Code2, Mic, Wallet };
const LINKS = [
  { to: "/", label: "Home" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/tutors", label: "Our Tutors" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];
const linkCls = ({ isActive }) =>
  `rounded-full px-3.5 py-2 text-sm font-medium transition ${isActive ? "text-brand-orange" : "text-brand-ink hover:text-brand-green"}`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const admin = user?.role === "admin";
  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="hidden bg-brand-green text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <span>Free assessment for new students — Grades K–12</span>
          <a href={SITE.phoneHref} className="flex items-center gap-1.5 font-medium"><Phone className="h-3 w-3" />{SITE.phoneDisplay}</a>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3" aria-label="Main">
        <Link to="/" aria-label="Dakshin Academy home"><Logo /></Link>
        <div className="hidden items-center lg:flex">
          <NavLink to="/" className={linkCls} end>Home</NavLink>
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button onClick={() => setMega(!mega)} aria-expanded={mega} className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-brand-ink hover:text-brand-green">
              Programs <ChevronDown className={`h-4 w-4 transition ${mega ? "rotate-180" : ""}`} />
            </button>
            {mega && (
              <div className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl shadow-slate-900/10">
                  {PROGRAMS.map((p) => {
                    const Icon = ICONS[p.icon];
                    return (
                      <Link key={p.slug} to={`/programs/${p.slug}`} className="group flex gap-3 rounded-xl p-3 transition hover:bg-brand-cream">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green group-hover:bg-brand-orange group-hover:text-white"><Icon className="h-5 w-5" /></span>
                        <span><span className="block text-sm font-semibold text-brand-ink">{p.title}</span><span className="block text-xs text-slate-500 line-clamp-1">{p.short}</span></span>
                      </Link>
                    );
                  })}
                  <Link to="/programs" className="col-span-2 mt-1 rounded-xl bg-brand-green px-4 py-3 text-center text-sm font-semibold text-white">View all programs</Link>
                </div>
              </div>
            )}
          </div>
          {LINKS.slice(1).map((l) => <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>)}
          {admin && <NavLink to="/admin/content" className={linkCls}>Admin</NavLink>}
        </div>
        <div className="hidden lg:block">
          <Link to="/contact#enquiry" className="inline-flex min-h-[44px] items-center rounded-full bg-brand-orange px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600">Book a Free Assessment</Link>
        </div>
        <button className="flex h-11 w-11 items-center justify-center lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t bg-white px-6 pb-6 lg:hidden">
          <Link to="/" className="block py-3 font-medium">Home</Link>
          <p className="pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Programs</p>
          {PROGRAMS.map((p) => <Link key={p.slug} to={`/programs/${p.slug}`} className="block py-2.5 pl-3 text-sm">{p.title}</Link>)}
          {LINKS.slice(1).map((l) => <Link key={l.to} to={l.to} className="block py-3 font-medium">{l.label}</Link>)}
          {admin && <Link to="/admin/content" className="block py-3 font-medium text-brand-orange">Admin</Link>}
          <Link to="/contact#enquiry" className="mt-3 block rounded-full bg-brand-orange py-3 text-center font-semibold text-white">Book a Free Assessment</Link>
        </div>
      )}
    </header>
  );
}
