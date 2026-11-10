import Hero from "@/components/home/Hero";
import ResultsStrip from "@/components/home/ResultsStrip";
import ProgramsGrid from "@/components/home/ProgramsGrid";
import WhyDakshin from "@/components/home/WhyDakshin";
import LearningJourney from "@/components/home/LearningJourney";
import PortalSection from "@/components/home/PortalSection";
import WebinarSection from "@/components/home/WebinarSection";
import TutorsPreview from "@/components/home/TutorsPreview";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import FaqSection from "@/components/FaqSection";
import HomeEnquiry from "@/components/home/HomeEnquiry";

export default function Home() {
  return (
    <>
      <Hero />
      <ResultsStrip />
      <ProgramsGrid />
      <WhyDakshin />
      <LearningJourney />
      <PortalSection />
      <WebinarSection />
      <TutorsPreview />
      <TestimonialsPreview />
      <FaqSection />
      <HomeEnquiry />
    </>
  );
}