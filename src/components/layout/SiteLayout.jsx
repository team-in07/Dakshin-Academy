import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ManagedSections from "@/components/ManagedSections";

export default function SiteLayout() {
  return (
    <div className="min-h-screen overflow-x-clip font-body">
      <Header />
      <main><Outlet /><ManagedSections /></main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
