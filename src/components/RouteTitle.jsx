import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getProgramBySlug } from "@/data/programs";

const PAGE_TITLES = {
  "/": "Home | Dakshin Academy",
  "/programs": "Programs | Dakshin Academy",
  "/success-stories": "Success Stories | Dakshin Academy",
  "/tutors": "Our Tutors | Dakshin Academy",
  "/about": "About Us | Dakshin Academy",
  "/contact": "Contact | Dakshin Academy",
};

export default function RouteTitle() {
  const { pathname } = useLocation();
  const slug = pathname.match(/^\/programs\/([^/]+)/)?.[1];
  const { data: program } = useQuery({ queryKey: ["program", slug], queryFn: () => getProgramBySlug(slug), enabled: !!slug });
  const title = program?.seoTitle || PAGE_TITLES[pathname] || "Dakshin Academy";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
