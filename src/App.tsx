import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Organization, Memorandum, Directory, Vision, Mission } from "./pages/About";
import Projects from "./pages/Projects";
import { Reports, Publications, Procurements } from "./pages/Listings";
import KnowledgeHub from "./pages/KnowledgeHub";
import PlantationMap from "./pages/PlantationMap";
import WhosWho from "./pages/WhosWho";
import Grievance from "./pages/Grievance";
import RTI from "./pages/RTI";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import Activities from "./pages/Activities";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about/organization" element={<Organization />} />
          <Route path="/about/memorandum" element={<Memorandum />} />
          <Route path="/about/directory" element={<Directory />} />
          <Route path="/about/vision" element={<Vision />} />
          <Route path="/about/mission" element={<Mission />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/knowledge-hub/iec" element={<KnowledgeHub initialCategory="IEC Materials" />} />
          <Route path="/knowledge-hub/newsletters" element={<KnowledgeHub initialCategory="Newsletters" />} />
          <Route path="/knowledge-hub/success-stories" element={<KnowledgeHub initialCategory="Success Stories" />} />
          <Route path="/knowledge-hub/thematic" element={<KnowledgeHub initialCategory="Thematic Studies" />} />
          <Route path="/knowledge-hub/documentation" element={<KnowledgeHub initialCategory="Documentation" />} />
          <Route path="/knowledge-hub/case-studies" element={<KnowledgeHub initialCategory="Case Studies" />} />
          <Route path="/knowledge-hub/notifications" element={<KnowledgeHub initialCategory="Notifications" />} />
          <Route path="/knowledge-hub/lessons" element={<KnowledgeHub initialCategory="Lessons Learned" />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/procurements" element={<Procurements />} />
          <Route path="/plantation-map" element={<PlantationMap />} />
          <Route path="/whos-who" element={<WhosWho />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/rti" element={<RTI />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
