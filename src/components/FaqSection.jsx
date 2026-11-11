import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeading from "@/components/SectionHeading";
import { FAQS } from "@/data/site";
import { useQuery } from "@tanstack/react-query";
import { isCmsInitialized, listCms } from "@/data/cms";

export default function FaqSection() {
  const { data: savedFaqs = [] } = useQuery({ queryKey: ["cms", "faq"], queryFn: () => listCms("faq") });
  const { data: cmsReady = false } = useQuery({ queryKey: ["cms", "initialized", "faq"], queryFn: () => isCmsInitialized("faq") });
  const groups = cmsReady ? (savedFaqs.length
    ? Object.entries(savedFaqs.reduce((all, item) => { const group = item.group || "General"; (all[group] ||= []).push({ q: item.title, a: item.answer, id: item.slug }); return all; }, {})).map(([group, items]) => ({ group, items }))
    : []) : FAQS;
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Answers to what parents ask us most." />
        {groups.map((g) => (
          <div key={g.group} className="mb-8">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-orange">{g.group}</h3>
            <Accordion type="single" collapsible>
              {g.items.map((it, i) => (
                <AccordionItem key={it.id || i} value={`${g.group}-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium text-brand-ink">{it.q}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-slate-600">{it.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
}
