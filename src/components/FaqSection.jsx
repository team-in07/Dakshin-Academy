import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeading from "@/components/SectionHeading";
import { FAQS } from "@/data/site";

export default function FaqSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Answers to what parents ask us most." />
        {FAQS.map((g) => (
          <div key={g.group} className="mb-8">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-orange">{g.group}</h3>
            <Accordion type="single" collapsible>
              {g.items.map((it, i) => (
                <AccordionItem key={i} value={`${g.group}-${i}`}>
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