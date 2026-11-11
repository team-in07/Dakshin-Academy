
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/site";
import { useQuery } from "@tanstack/react-query";
import { isCmsInitialized, listCms } from "@/data/cms";

export const DEFAULT_SLIDES = [
  {
    eyebrow: "Free assessment for new students",
    title: "A learning plan shaped around your child.",
    description: "Start with an assessment of your child's strengths and goals, then find the right level and program.",
  },
  {
    eyebrow: "K–12 Math, ELA and Science",
    title: "Build strong foundations. Grow with confidence.",
    description: "Personalised tutoring helps students strengthen core skills, close learning gaps, or move ahead.",
  },
  {
    eyebrow: "SAT, AP and academic competitions",
    title: "Prepare for the next academic challenge.",
    description: "Explore focused preparation for the SAT, AP courses, AMC, MathCounts, Science Olympiad and USABO.",
  },
  {
    eyebrow: "Live online classes",
    title: "One-on-one attention or small-group learning.",
    description: "Choose a class format that suits your student, with caring tutors and a schedule that works for your family.",
  },
];

export default function Hero() {
  const { data: savedSlides = [] } = useQuery({
    queryKey: ["cms", "hero_slide"],
    queryFn: () => listCms("hero_slide"),
  });

  const { data: cmsReady = false } = useQuery({
    queryKey: ["cms", "initialized", "hero_slide"],
    queryFn: () => isCmsInitialized("hero_slide"),
  });

  const slides = cmsReady && savedSlides.length ? savedSlides : DEFAULT_SLIDES;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setActive((current) => current % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;

    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      7000
    );

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[active] || slides[0];

  const move = (direction) =>
    setActive((current) => (current + direction + slides.length) % slides.length);

  return (
    <section className="overflow-hidden bg-brand-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-0 px-6 py-6 md:py-8 lg:min-h-[570px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">

        <div className="relative z-10 order-2 -mt-8 max-w-2xl rounded-3xl bg-brand-cream p-5 shadow-xl sm:p-7 lg:order-1 lg:mt-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-white/75 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-green">
            <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
            Dakshin Academy
          </div>

          <motion.div
            key={active}
            aria-live="polite"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-sm font-semibold text-brand-orange">
              {slide.eyebrow}
            </p>

            <h1 className="mt-3 max-w-xl text-2xl font-bold leading-[1.12] tracking-tight text-brand-green sm:text-4xl lg:text-6xl">
              {slide.title}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
              {slide.description}
            </p>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-3">
            {slide.ctaLink?.startsWith("http") ? (
              <a
                href={slide.ctaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-orange px-6 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600"
              >
                {slide.ctaText || "Learn more"}
              </a>
            ) : (
              <Link
                to={slide.ctaLink || "/contact#enquiry"}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-orange px-6 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600"
              >
                {slide.ctaText || "Book a Free Assessment"}
              </Link>
            )}

            <Link
              to="/programs"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-green/30 bg-white/70 px-6 text-sm font-semibold text-brand-green transition hover:bg-white"
            >
              View Programs
            </Link>
          </div>

          <div
            className="mt-8 flex items-center gap-3"
            aria-label="Announcement carousel controls"
          >
            <div className="flex items-center gap-1.5">
              {slides.map((item, index) => (
                <button
                  key={item.eyebrow}
                  onClick={() => setActive(index)}
                  aria-label={`Show announcement ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  className={`h-2 rounded-full transition-all ${
                    index === active
                      ? "w-7 bg-brand-orange"
                      : "w-2 bg-brand-green/25 hover:bg-brand-green/50"
                  }`}
                />
              ))}
            </div>

            <span className="text-xs tabular-nums text-slate-500">
              {active + 1} / {slides.length}
            </span>

            <button
              onClick={() => move(-1)}
              aria-label="Previous announcement"
              className="rounded-full border border-brand-green/20 p-2 text-brand-green transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => move(1)}
              aria-label="Next announcement"
              className="rounded-full border border-brand-green/20 p-2 text-brand-green transition hover:bg-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Play announcements" : "Pause announcements"}
              className="rounded-full border border-brand-green/20 p-2 text-brand-green transition hover:bg-white"
            >
              {paused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-xl lg:order-2 lg:ml-auto">
          <Image
            src={slide.imageUrl || IMAGES.hero}
            alt={slide.imageAlt || "Students learning together with Dakshin Academy"}
            className="aspect-square w-full rounded-[1.5rem] object-contain shadow-xl shadow-brand-green/10 lg:rounded-[2rem] lg:aspect-[16/10] lg:object-cover"
          />
        </div>
      </div>
    </section>
  );
}
