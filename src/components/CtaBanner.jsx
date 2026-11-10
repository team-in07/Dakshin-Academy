import CtaButtons from "@/components/CtaButtons";

export default function CtaBanner({ title = "Ready to see where your child stands?", text = "Book a free assessment and get a personalised learning recommendation." }) {
  return (
    <section className="px-6 py-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand-green px-8 py-14 text-center text-white md:px-16">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-orange/30 blur-2xl" />
        <div className="relative">
          <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{text}</p>
          <div className="mt-8 flex justify-center"><CtaButtons dark /></div>
        </div>
      </div>
    </section>
  );
}