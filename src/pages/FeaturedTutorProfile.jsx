

import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  Lightbulb,
  Users,
  Mail,
} from "lucide-react";

import PageHero from "@/components/PageHero";

export default function FeaturedTutorProfile() {
  return (
    <>
      <PageHero
        eyebrow="Meet Our Educator"
        title='Dr. Padmanabhan "Padhu" Seshaiyer'
        subtitle="Discover the educator, mentor and academic expertise behind the learning journey."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">

          {/* Back navigation */}
          <Link
            to="/tutors"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-green transition hover:text-brand-orange"
          >
            <ArrowLeft size={18} />
            Back to Tutors
          </Link>

          {/* Profile introduction */}
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Dr. Padhu's Photograph */}
            <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-md">
              <div className="aspect-[4/5] w-full">
                <img
                  src="/images/dr-padhu.jpeg"                  
                  alt='Dr. Padmanabhan "Padhu" Seshaiyer'
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                     }}
                />
              </div>
            </div>

            {/* Introduction */}
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
                Featured Tutor
              </p>

              <h2 className="text-3xl font-bold leading-tight text-brand-green md:text-5xl">
                Dr. Padmanabhan
                <span className="block">"Padhu" Seshaiyer</span>
              </h2>

              <p className="text-lg leading-relaxed text-slate-600">
                Welcome to the dedicated academic profile of
                Dr. Padmanabhan "Padhu" Seshaiyer.
                Discover his professional journey, academic
                background and approach to education.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <GraduationCap className="mb-3 text-brand-orange" />
                  <h3 className="font-semibold text-slate-800">
                    Qualifications
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
Ph.D. in Applied Mathematics (UMBC); M.Sc. Mathematics & B.E. Electrical Engineering (BITS Pilani).                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <Clock className="mb-3 text-brand-orange" />
                  <h3 className="font-semibold text-slate-800">
                    Experience
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Over 20 years in academia and science policy as a GMU Math Professor, former NSF Program Director, and Virginia STEM advisor.
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-xl bg-brand-green px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-brand-green/90"
              >
                Enquire Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Detailed profile sections */}
          <div className="mt-24 space-y-12">

            <ProfileSection
              icon={<BookOpen />}
              title="About Me"
              description="Dr. Padmanabhan 'Padhu' Seshaiyer is an Indian-born American computational mathematician, educator, and science policy leader serving as a tenured Full Professor of Mathematical Sciences and Presidential Advisor for Strategic Initiatives at George Mason University (GMU)."
            />
               <ProfileSection
  icon={<GraduationCap />}
  title="Qualifications"
  description={
    <div className="space-y-3">
      <p>
        <strong>Postdoctoral Fellowship (1998–2000):</strong>{" "}
        Bioengineering, Texas A&M University.
      </p>

      <p>
        <strong>Ph.D. (1998):</strong>{" "}
        Applied Mathematics, University of Maryland, Baltimore County (UMBC).
      </p>

      <p>
        <strong>M.Sc. & B.E. (1994):</strong>{" "}
        Dual degrees in Mathematics (M.Sc.) and Electrical & Electronics Engineering (B.E.) from Birla Institute of Technology and Science (BITS), Pilani, India.
      </p>

      <p>
        <strong>Honorary Doctorate (2019):</strong>{" "}
        Awarded by Vrije Universiteit Brussel (Free University of Brussels), Belgium, for his global contributions to STEM education and computational science.
      </p>
    </div>
  }
/>.            

            
<ProfileSection
  icon={<Clock />}
  title="Teaching Experience"
  description={
    <div className="space-y-6">

      {/* George Mason University */}
      <div>
        <h3 className="font-bold text-slate-800">
          George Mason University (2007–Present)
        </h3>

        <div className="mt-3 space-y-3 pl-4 border-l-2 border-orange-200">

          <p>
            <strong>Presidential Advisor for Strategic Initiatives (2026–Present):</strong>{" "}
            Advises university leadership on institutional strategy, innovation, and partnerships.
          </p>

          <p>
            <strong>Professor of Mathematical Sciences:</strong>{" "}
            Holds affiliate appointments in the College of Engineering and Computing and the College of Education and Human Development.
          </p>

          <p>
            <strong>Director, COMPLETE Center & STEM Accelerator Program:</strong>{" "}
            Leads initiatives focused on STEM teacher training, undergraduate retention, and K–12 outreach.
          </p>

          <p>
            <strong>Associate Dean for Academic Affairs (2017–2021):</strong>{" "}
            Oversaw academic programs, curriculum development, and student success in the College of Science.
          </p>

        </div>
      </div>

      {/* Texas Tech University */}
      <div>
        <h3 className="font-bold text-slate-800">
          Texas Tech University (2000–2007)
        </h3>

        <p className="mt-2 pl-4">
          Served as Assistant and Associate Professor of Mathematics and Statistics prior to joining GMU.
        </p>
      </div>

      {/* International Appointments */}
      <div>
        <h3 className="font-bold text-slate-800">
          International Appointments
        </h3>

        <p className="mt-2 pl-4">
          Visiting and affiliate faculty at the Nelson Mandela African Institution of Science and Technology (Tanzania) and Advanced Teachers College.
        </p>
      </div>

    </div>
  }
/>


            
<ProfileSection
  icon={<Users />}
  title="Teaching & Grade Levels Served"
  description={
    <div className="space-y-6">

      {/* K-12 Education */}
      <div>
        <h3 className="font-bold text-slate-800">
          K–12 Education
        </h3>
        <p className="mt-2">
          Spearheaded the creation of Virginia's K–12 Data Science Standards.
          Runs summer camps (such as FOCUS for middle and high school girls)
          and has trained over 2,500 K–12 teachers through the COMPLETE Center.
        </p>
      </div>

      {/* Undergraduate Level */}
      <div>
        <h3 className="font-bold text-slate-800">
          Undergraduate Level
        </h3>
        <p className="mt-2">
          Teaches Calculus, Differential Equations, Numerical Analysis,
          and Mathematical Modeling, while mentoring hundreds of
          undergraduate researchers.
        </p>
      </div>

      {/* Graduate Level */}
      <div>
        <h3 className="font-bold text-slate-800">
          Graduate Level
        </h3>
        <p className="mt-2">
          Teaches doctoral courses in Finite Element Methods and
          Computational Fluid Dynamics, advising master's theses,
          Ph.D. dissertations, and postdocs.
        </p>
      </div>

    </div>
  }
/>


           
<ProfileSection
  icon={<BookOpen />}
  title="Biography & Professional Profiles"
  description={
    <div className="space-y-8">

      {/* Short Event Introduction */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          1. Short Event Introduction
        </h3>

        <p className="mt-3 leading-8">
          <strong>Dr. Padmanabhan "Padhu" Seshaiyer</strong> is a Full
          Professor of Mathematical Sciences and Presidential Advisor
          for Strategic Initiatives at George Mason University. A BITS
          Pilani and UMBC alumnus, he is a former National Science
          Foundation Program Director specializing in computational
          biology, AI, and STEM education. He has published over 175
          papers and trained thousands of students and educators worldwide.
        </p>
      </div>

      {/* K-12 / Teacher Workshop Bio */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          2. K–12 / Teacher Workshop Bio
        </h3>

        <p className="mt-3 leading-8">
          <strong>Dr. Padmanabhan "Padhu" Seshaiyer</strong> is an
          internationally recognized STEM education leader and Professor
          of Mathematical Sciences at George Mason University. As Director
          of the COMPLETE Center and a key architect of Virginia's K–12
          Data Science Standards, he has trained over 2,500 teachers and
          mentored hundreds of young learners. Known for his problem-first,
          hands-on teaching approach, Dr. Seshaiyer helps educators
          eliminate math anxiety and bring real-world data, design thinking,
          and AI into the classroom. He holds an honorary doctorate from
          Vrije Universiteit Brussel and is a recipient of the Jack Wood
          Legacy Award.
        </p>
      </div>

      {/* Academic & Research Conference Bio */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          3. Academic & Research Conference Bio
        </h3>

        <p className="mt-3 leading-8">
          <strong>Dr. Padmanabhan "Padhu" Seshaiyer</strong> is a
          computational mathematician and tenured Professor of Mathematical
          Sciences at George Mason University, where he also serves as
          Presidential Advisor for Strategic Initiatives. He earned dual
          degrees from BITS Pilani, a Ph.D. in Applied Mathematics from
          the University of Maryland, Baltimore County, and completed
          postdoctoral research in bioengineering at Texas A&M University.
          A former NSF Program Director and Chair of the U.S. National
          Academies' Board on International Scientific Organizations,
          his research spans finite element methods, biomechanics,
          infectious disease modeling, and physics-informed neural networks.
          He has authored over 175 peer-reviewed articles, co-authored
          textbooks including <em>Quantitative Biology: Mathematical
          Modeling and Computation</em>, and secured over $20 million
          in research funding.
        </p>
      </div>

    </div>
  }
/>

<ProfileSection
  icon={<BookOpen />}
  title="Research Focus & Subjects"
  description={
    <div className="space-y-5">
      <p>
        Dr. Seshaiyer bridges pure mathematics, computational science, and
        real-world engineering and medical challenges.
      </p>

      <div>
        <h3 className="font-bold text-slate-800">
          Computational & Applied Mathematics
        </h3>
        <p>
          Finite element methods, numerical analysis, partial differential
          equations (PDEs), scientific computing, and inverse problems.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          Mathematical Biology & Biomechanics
        </h3>
        <p>
          Modeling fluid-structure interactions (such as blood flow and brain
          aneurysm rupture prediction), soft tissue mechanics, and tumor
          dynamics.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          Infectious Disease Modeling
        </h3>
        <p>
          Developing mathematical and data-driven models for outbreaks
          including COVID-19, Zika, and Ebola.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          Artificial Intelligence & Data Science
        </h3>
        <p>
          Physics-informed neural networks (PINNs), disease-informed neural
          networks, machine learning, and data literacy.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          STEM Education & Design Thinking
        </h3>
        <p>
          Pedagogical content knowledge, systems thinking, and human-centered
          problem solving aligned with UN Sustainable Development Goals.
        </p>
      </div>
    </div>
  }
/>
     

    <ProfileSection
  icon={<BookOpen />}
  title="National, State & Policy Roles"
  description={
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-slate-800">
          National Science Foundation (NSF) (2015–2017)
        </h3>
        <p>
          Served as Program Director in the Division of Mathematical Sciences
          (Computational Mathematics).
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          U.S. National Academies
        </h3>
        <p>
          Chair of the Board on International Scientific Organizations (BISO)
          and member of the U.S. National Committee for Mathematics.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          Virginia State Appointments
        </h3>
        <p>
          Gubernatorial appointee to the Virginia STEM Education Advisory
          Board, Virginia Workforce Development Board, and the State Council
          of Higher Education for Virginia (SCHEV) AI Taskforce.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-800">
          Scientific Societies
        </h3>
        <p>
          Past Chair of the Society for Industrial and Applied Mathematics
          (SIAM) Diversity Advisory Committee and councilor for the Council
          on Undergraduate Research (CUR).
        </p>
      </div>
    </div>
  }
/>

  
        
<ProfileSection
  icon={<Award />}
  title="Publications, Grants & Major Honors"
  description={
    <div className="space-y-6">

      {/* Publications & Talks */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Publications & Talks
        </h3>

        <p className="mt-2 leading-8">
          Authored over 175 peer-reviewed research articles, edited
          several volumes, and co-authored textbooks including
          <em> Quantitative Biology: Mathematical Modeling and Computation
          </em> (2026). Delivered over 450 invited lectures worldwide.
        </p>
      </div>

      {/* Funding & Mentorship */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Funding & Mentorship
        </h3>

        <p className="mt-2 leading-8">
          Secured over $20 million in external research and education
          grants (from NSF, NIH, NASA, and others) and mentored more
          than 260 students and researchers.
        </p>
      </div>

      {/* Key Awards */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Key Awards
        </h3>

        <ul className="mt-3 list-disc space-y-3 pl-6 leading-7">
          <li>
            <strong>Jack Wood Legacy Award (2025)</strong>
          </li>
          <li>
            <strong>UMBC Outstanding Alumni Award (2024)</strong>
          </li>
          <li>
            <strong>SIAM Prize for Distinguished Service to the Profession</strong>
          </li>
          <li>
            <strong>
              State Council of Higher Education for Virginia (SCHEV)
              Outstanding Faculty Award
            </strong>
          </li>
        </ul>
      </div>

    </div>
  }
/>


           
          </div>

          {/* Bottom enquiry section */}
          <div className="mt-24 rounded-3xl bg-brand-green px-8 py-14 text-center text-white md:px-16">
            <Mail className="mx-auto mb-5 text-brand-orange" size={40} />

            <h2 className="text-3xl font-bold">
              Start Your Learning Journey
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              Connect with Dakshin Academy to learn more about
              our educational programs and mentorship opportunities.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-brand-green transition hover:bg-slate-100"
            >
              Enquire Now
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/tutors"
              className="font-semibold text-brand-green hover:text-brand-orange"
            >
              <ArrowLeft className="mr-2 inline" size={16} />
              Back to All Tutors
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}

function ProfileSection({ icon, title, description }) {
  return (
    <section className="grid gap-5 border-b border-slate-100 pb-10 md:grid-cols-[80px_1fr]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-brand-orange">
        {icon}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-brand-green">
          {title}
        </h2>

        <p className="mt-4 max-w-4xl leading-8 text-slate-600">
          {description}
        </p>
      </div>
    </section>
  );
}
