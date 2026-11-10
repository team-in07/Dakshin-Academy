import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import SiteLayout from "./components/layout/SiteLayout";

import Home from "@/pages/Home";
import Programs from "@/pages/Programs";
import ProgramDetail from "@/pages/ProgramDetail";
import SuccessStories from "@/pages/SuccessStories";
import Tutors from "@/pages/Tutors";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminEnquiries from "@/pages/AdminEnquiries";
import AdminContent from "@/pages/AdminContent";
import { AuthProvider } from "@/lib/AuthContext";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider><Router>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/enquiries" element={<AdminEnquiries />} />
            <Route path="/admin/content" element={<AdminContent />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
