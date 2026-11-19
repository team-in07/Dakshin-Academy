
import { Target, Lightbulb, Compass } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/site";

const VALUES = [
  {
    icon: Lightbulb,
    t: "Learn",
    d: "Deep conceptual understanding built through guided practice and clear explanations.",
  },
  {
    icon: Compass,
    t: "Innovate",
    d: "Applying data and analytical skills to solve real-world problems, from research to entrepreneurship.",
  },
  {
    icon: Target,
    t: "Lead",
    d: "Confidence, communication and character that prepare students to lead.",
  },
];

export default function About() {
  return (
    <>
      {/* 1. MEET OUR FOUNDER */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">

          <div>
            <SectionHeading
              center={false}
              eyebrow="MEET OUR FOUNDER"
              title="The Vision Behind Dakshin"
            />

            <h3 className="mb-2 text-2xl font-bold text-brand-green">
              Siva Sathyanarayana Movva
            </h3>

            <p className="mb-5 text-sm font-semibold text-brand-green">
              Founder, Dakshin Academy
            </p>

            <p className="leading-relaxed text-slate-600">
              Siva Sathyanarayana Movva, the founder of Dakshin, is an
              accomplished academician and passionate education mentor
              with a strong commitment to student success. He secured the
              highest rank in his state's Class 12 board examinations,
              earning admission to the prestigious BITS Pilani, and
              later achieved an impressive 98.3 percentile in the CAT
              examination. With over five years of experience in student
              mentoring and academic consulting, he has guided students
              and educational institutions worldwide, helping learners
              excel in SAT examinations and secure admissions to leading
              universities across the globe.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-brand-cream p-4 text-center">
                <h4 className="text-2xl font-bold text-brand-green">98.3</h4>
                <p className="mt-1 text-xs text-slate-600">CAT Percentile</p>
              </div>

              <div className="rounded-2xl bg-brand-cream p-4 text-center">
                <h4 className="text-2xl font-bold text-brand-green">1500+</h4>
                <p className="mt-1 text-xs text-slate-600">SAT Scores</p>
              </div>

              <div className="rounded-2xl bg-brand-cream p-4 text-center">
                <h4 className="text-2xl font-bold text-brand-green">5+</h4>
                <p className="mt-1 text-xs text-slate-600">Years of Mentoring</p>
              </div>
            </div>
          </div>

          <div className="mx-auto">
  <img
    src="/images/siva-founder.png"
    alt="Siva Sathyanarayan - Founder"
    className="w-full h-auto object-cover rounded-xl"
  />
</div>

        </div>
      </section>

      {/* 2. MENTORSHIP & VISION */}
      <section className="bg-brand-cream py-20">
        <div className="mx-auto max-w-5xl px-6">

          <SectionHeading
            eyebrow="OUR PHILOSOPHY"
            title="Mentorship & Vision"
          />

          <div className="mx-auto mt-8 max-w-4xl text-center">
            <p className="text-base leading-8 text-slate-600">
              With a student-focused approach to mentorship, Siva has
              helped numerous students improve their SAT scores, with
              many achieving 1500+ in subsequent attempts and gaining
              admission to prestigious international universities.
              Alongside his technology career, where he trained aspiring
              professionals in embedded systems at Rocsys Systems, he
              brings together technical expertise and academic guidance.
              At Dakshin, his vision is to go beyond traditional exam
              preparation by building confidence, nurturing individual
              potential, and equipping students with the knowledge,
              skills, and guidance needed to succeed academically and
              professionally.
            </p>
          </div>

        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">

          <div>
            <SectionHeading
              center={false}
              eyebrow="OUR STORY"
              title="Education that connects ideas to impact"
            />

            <p className="leading-relaxed text-slate-600">
              Dakshin Academy helps students in Grades K–12 build strong
              academic foundations and the skills to use them. From school
              Math, ELA and Science to SAT/AP, Olympiads, Coding and AI,
              Public Speaking and Financial Literacy, every program is
              designed to move students from ideas to impact.
            </p>

            <p className="mt-4 leading-relaxed text-slate-600">
              We combine live online teaching with a secure learning
              platform: online homework after each session, a quiz before
              the next class, recorded sessions, and monthly progress
              reports for parents.
            </p>
          </div>

          <Image
            src={IMAGES.hero}
            alt="Students learning together at Dakshin Academy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
          />

        </div>
      </section>

      {/* 4. EMPOWERING TOMORROW'S INNOVATORS */}
      <PageHero
        eyebrow="ABOUT US"
        title="Empowering tomorrow's innovators"
        subtitle="Real problems. Brighter futures."
      />

      {/* 5. OUR CORE VALUES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">

          <SectionHeading
            eyebrow="WHAT WE BELIEVE"
            title="Our Core Values"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.t}
                className="rounded-3xl bg-brand-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green text-white">
                  <v.icon className="h-6 w-6" />
                </span>

                <h3 className="mt-5 text-xl font-semibold text-brand-green">
                  {v.t}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {v.d}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <CtaBanner />
    </>
  );
}
