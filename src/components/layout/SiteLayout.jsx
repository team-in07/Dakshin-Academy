import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

export default function SiteLayout() {
  return (
    <div className="min-h-screen overflow-x-clip font-body">
      <Header />
      <main><Outlet /></main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}