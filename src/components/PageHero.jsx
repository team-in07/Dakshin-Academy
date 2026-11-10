import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-green to-[#333a12] py-20 text-white">
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-orange/25 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mx-auto max-w-5xl px-6">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/80">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </section>
  );
}