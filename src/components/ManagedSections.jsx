import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "react-router-dom";
import { listCms } from "@/data/cms";

function pageKey(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/programs/")) return "program-detail";
  return pathname.replace(/^\//, "").split("/")[0] || "home";
}

export default function ManagedSections() {
  const { pathname } = useLocation();
  const { data: sections = [] } = useQuery({ queryKey: ["cms", "sections"], queryFn: () => listCms("section") });
  const page = pageKey(pathname);
  return sections.filter((section) => !section.is_builtin && (!section.page || section.page === page || section.page === "all")).map((section) => <section key={section.id} className="bg-white py-16"><div className="mx-auto grid max-w-7xl items-center gap-8 px-6 md:grid-cols-2">{section.imageUrl && <img src={section.imageUrl} alt="" className="max-h-[420px] w-full rounded-3xl object-cover"/>}<div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wide text-brand-orange">{section.eyebrow}</p><h2 className="mt-2 text-3xl font-bold text-brand-green">{section.heading || section.title}</h2><p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">{section.body}</p>{section.ctaText && section.ctaLink && <Link to={section.ctaLink} className="mt-6 inline-flex rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white">{section.ctaText}</Link>}</div></div></section>);
}
