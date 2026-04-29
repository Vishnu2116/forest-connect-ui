import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import {
  NotificationsAdmin, EventsAdmin, TendersAdmin, WhosWhoAdmin, SuccessStoriesAdmin,
  NewslettersAdmin, ThematicAdmin, ReportsAdmin, IECAdmin, ActivitiesAdmin, ProjectsAdmin,
} from "./pages/admin/modules";
import PlantationAdmin from "./pages/admin/PlantationAdmin";
import { GrievanceAdmin, RTIAdmin } from "./pages/admin/StatusModules";
import { UsersAdmin } from "./pages/admin/UsersAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
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
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="notifications" element={<NotificationsAdmin />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="tenders" element={<TendersAdmin />} />
            <Route path="whoswho" element={<WhosWhoAdmin />} />
            <Route path="success-stories" element={<SuccessStoriesAdmin />} />
            <Route path="newsletters" element={<NewslettersAdmin />} />
            <Route path="thematic" element={<ThematicAdmin />} />
            <Route path="reports" element={<ReportsAdmin />} />
            <Route path="iec" element={<IECAdmin />} />
            <Route path="activities" element={<ActivitiesAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="plantation" element={<PlantationAdmin />} />
            <Route path="grievance" element={<GrievanceAdmin />} />
            <Route path="rti" element={<RTIAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
