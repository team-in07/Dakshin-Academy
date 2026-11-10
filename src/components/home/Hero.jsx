import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, Star, Users, Award, Video } from "lucide-react";
import CtaButtons from "@/components/CtaButtons";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/site";

const STATS = [
  { icon: Users, label: "Small groups & 1-on-1" },
  { icon: Video, label: "Live online classes" },
  { icon: Award, label: "Competition mentors" },
];

export const DEFAULT_SLIDES = [
  {
    eyebrow: "Start with a free assessment",
    title: "Find the right learning path for your child.",
    description: "We look at your child's strengths and goals, then recommend a level and program that fits.",
    imageUrl: IMAGES.hero,
    buttonText: "Book a Free Assessment",
    buttonLink: "/contact#enquiry",
    sortOrder: 1,
    isActive: true,
  },
  {
    eyebrow: "Build strong school foundations",
    title: "K–12 support in Math, ELA and Science.",
    description: "Personalised tutoring helps students strengthen core skills, catch up with confidence, or move ahead.",
    imageUrl: IMAGES.online,
    buttonText: "Explore K–12 Tutoring",
    buttonLink: "/programs/k12-math-ela-science",
    sortOrder: 2,
    isActive: true,
  },
  {
    eyebrow: "Prepare for the next challenge",
    title: "SAT, AP and academic competitions.",
    description: "Get structured practice and expert guidance for SAT and AP exams, AMC, MathCounts, Science Olympiad and USABO.",
    imageUrl: IMAGES.webinar,
    buttonText: "View Exam Programs",
    buttonLink: "/programs",
    sortOrder: 3,
    isActive: true,
  },
  {
    eyebrow: "Learn live with caring mentors",
    title: "One-on-one or small-group classes, online.",
    description: "Choose a learning format that fits your student, with live classes, regular feedback and a schedule that works for your family.",
    imageUrl: IMAGES.tutor1,
    buttonText: "Meet Our Tutors",
    buttonLink: "/tutors",
    sortOrder: 4,
    isActive: true,
  },
];

export default function Hero() {
    const slides = DEFAULT_SLIDES;


  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => setActive((current) => current % slides.length), [slides.length]);
  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[active] || slides[0];
  const move = (direction) => setActive((current) => (current + direction + slides.length) % slides.length);
  return (
    <section className="relative isolate overflow-hidden bg-brand-green text-white">
      <div className="absolute inset-0 -z-10">
        <img src={slide.imageUrl || IMAGES.hero} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/95 via-brand-green/80 to-brand-green/35" />
      </div>
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_360px] lg:py-24">
        <motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur"><Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" /> {slide.eyebrow || "Dakshin Academy"}</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">{slide.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{slide.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/^https?:\/\//i.test(slide.buttonLink || "") ? <a href={slide.buttonLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600">{slide.buttonText || "Learn more"}</a> : <Link to={slide.buttonLink || "/contact#enquiry"} className="inline-flex min-h-12 items-center rounded-full bg-brand-orange px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600">{slide.buttonText || "Learn more"}</Link>}
            <CtaButtons dark showAssessment={false} />
          </div>
          <div className="mt-10 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-3">
            {STATS.map((s) => <div key={s.label} className="flex items-center gap-2.5 text-sm font-medium"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"><s.icon className="h-5 w-5" /></span>{s.label}</div>)}
          </div>
        </motion.div>
        <div className="hidden lg:block">
          <div className="rounded-[2rem] border border-white/25 bg-white/10 p-5 shadow-2xl backdrop-blur-sm">
            <Image src={slide.imageUrl || IMAGES.hero} alt="Students learning with Dakshin Academy" className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
            <div className="mt-4 flex items-center justify-between"><div><p className="text-xs text-white/70">Personalised learning</p><p className="font-semibold">Find the right path</p></div><div className="rounded-xl bg-brand-orange p-3"><Award className="h-6 w-6" /></div></div>
          </div>
        </div>
      </div>
      {slides.length > 1 && <div className="absolute bottom-6 right-6 flex items-center gap-2 md:right-12">
        <span className="mr-2 text-xs font-medium text-white/80">{active + 1} / {slides.length}</span>
        <button onClick={() => move(-1)} aria-label="Previous slide" className="rounded-full border border-white/35 p-2 transition hover:bg-white/15"><ArrowLeft className="h-4 w-4" /></button>
        <button onClick={() => move(1)} aria-label="Next slide" className="rounded-full border border-white/35 p-2 transition hover:bg-white/15"><ArrowRight className="h-4 w-4" /></button>
        <button onClick={() => setPaused(!paused)} aria-label={paused ? "Play slides" : "Pause slides"} className="rounded-full border border-white/35 p-2 transition hover:bg-white/15">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
      </div>}
      {slides.length > 1 && <div className="absolute bottom-8 left-6 flex gap-2 md:left-12">{slides.map((item, index) => <button key={item.id || index} aria-label={`Go to slide ${index + 1}`} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${index === active ? "w-8 bg-brand-orange" : "w-2 bg-white/60"}`} />)}</div>}
    </section>
  );
}
