import Hero from "@/components/home/Hero";
import ProgramsGrid from "@/components/home/ProgramsGrid";
import WhyDakshin from "@/components/home/WhyDakshin";
import LearningJourney from "@/components/home/LearningJourney";
import PortalSection from "@/components/home/PortalSection";
import WebinarSection from "@/components/home/WebinarSection";
import TutorsPreview from "@/components/home/TutorsPreview";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import FaqSection from "@/components/FaqSection";
import HomeEnquiry from "@/components/home/HomeEnquiry";
import AcademicOpportunities from "@/components/home/AcademicOpportunities";

export default function Home() {
  return (
    <>
      <Hero />
      <ProgramsGrid />
      <WhyDakshin />
      <LearningJourney />
      <PortalSection />
      <WebinarSection />
      <TutorsPreview />
      <TestimonialsPreview />
      <AcademicOpportunities />
      <FaqSection />
      <HomeEnquiry />
    </>
  );
}
