import EnquiryForm from "@/components/EnquiryForm";
import SectionHeading from "@/components/SectionHeading";

export default function HomeEnquiry() {
  return (
    <section className="bg-brand-cream py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <SectionHeading center={false} eyebrow="Get started" title="Book your child's free assessment" subtitle="Share a few details and our team will reach out to schedule a free assessment and recommend the right program." />
          <ul className="space-y-2 text-sm text-slate-600"><li>✓ No obligation, no payment needed</li><li>✓ Personalised recommendation for your child</li><li>✓ We respond quickly by phone, email or WhatsApp</li></ul>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}