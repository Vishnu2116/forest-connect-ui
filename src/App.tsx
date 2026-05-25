import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AboutElement, Organization, WhosWhoSection, VisionMission, Memorandum, OfficialDirectory } from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import { Reports, Publications, Procurements, RFPs, Tenders } from "./pages/Listings";
import ComponentPage from "./pages/ComponentPage";
import { SocialMedia, Gallery, MediaEvents, MediaEventDetail } from "./pages/Media";
import KnowledgeHub from "./pages/KnowledgeHub";
import ProjectComponents from "./pages/ProjectComponents";
import PlantationMap from "./pages/PlantationMap";
import Grievance from "./pages/Grievance";
import RTI from "./pages/RTI";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Activities from "./pages/Activities";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import {
  NotificationsAdmin, EventsAdmin, TendersAdmin, WhosWhoAdmin, SuccessStoriesAdmin,
  NewslettersAdmin, ThematicAdmin, ReportsAdmin, IECAdmin, ActivitiesAdmin,
} from "./pages/admin/modules";
import ProcurementsAdmin from "./pages/admin/ProcurementsAdmin";
import ProjectsManagementAdmin from "./pages/admin/ProjectsManagementAdmin";
import ProjectComponentsAdmin from "./pages/admin/ProjectComponentsAdmin";
import PlantationAdmin from "./pages/admin/PlantationAdmin";
import { GrievanceAdmin, RTIAdmin } from "./pages/admin/StatusModules";
import { UsersAdmin } from "./pages/admin/UsersAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import HeroManagementAdmin from "./pages/admin/HeroManagementAdmin";
import HomeLeadershipAdmin from "./pages/admin/HomeLeadershipAdmin";
import HomeSocialMediaAdmin from "./pages/admin/HomeSocialMediaAdmin";
import OfficialsAdmin from "./pages/admin/OfficialsAdmin";
import KnowledgeHubAdmin from "./pages/admin/KnowledgeHubAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import EventsMediaAdmin from "./pages/admin/EventsMediaAdmin";
import SocialMediaAdmin from "./pages/admin/SocialMediaAdmin";
import GisAdmin from "./pages/admin/GisAdmin";
import OfficialProfile from "./pages/OfficialProfile";
import Accessibility from "./pages/Accessibility";
import ScreenReader from "./pages/ScreenReader";
import Help from "./pages/Help";
import Sitemap from "./pages/Sitemap";
import Feedback from "./pages/Feedback";
import Archive from "./pages/Archive";
import HyperlinkingPolicy from "./pages/HyperlinkingPolicy";
import CopyrightPolicy from "./pages/CopyrightPolicy";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { SettingsProvider } from "./contexts/SettingsContext";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <AccessibilityProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SettingsProvider>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutElement />} />
          <Route path="/about/organization" element={<Organization />} />
          <Route path="/about/whos-who" element={<WhosWhoSection />} />
          <Route path="/about/objectives" element={<VisionMission />} />
          <Route path="/about/vision-mission" element={<Navigate to="/about/objectives" replace />} />
          <Route path="/about/vision" element={<Navigate to="/about/objectives" replace />} />
          <Route path="/about/mission" element={<Navigate to="/about/objectives" replace />} />
          <Route path="/about/memorandum" element={<Memorandum />} />
          <Route path="/about/directory" element={<OfficialDirectory />} />
          <Route path="/about/officials/:id" element={<OfficialProfile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project-components" element={<ProjectComponents />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
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
          <Route path="/procurements/rfps" element={<RFPs />} />
          <Route path="/procurements/tenders" element={<Tenders />} />
          <Route path="/components/:id" element={<ComponentPage />} />
          <Route path="/media/social" element={<SocialMedia />} />
          <Route path="/media/gallery" element={<Gallery />} />
          <Route path="/media/events" element={<MediaEvents />} />
          <Route path="/media/events/:slug" element={<MediaEventDetail />} />
          <Route path="/plantation-map" element={<PlantationMap />} />
          <Route path="/mis-gis" element={<PlantationMap />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/rti" element={<RTI />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/screen-reader" element={<ScreenReader />} />
          <Route path="/help" element={<Help />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/hyperlinking-policy" element={<HyperlinkingPolicy />} />
          <Route path="/copyright-policy" element={<CopyrightPolicy />} />
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="notifications" element={<Navigate to="/admin/knowledge-hub?type=notification" replace />} />
            <Route path="events" element={<EventsMediaAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="social-media" element={<SocialMediaAdmin />} />
            <Route path="tenders" element={<ProcurementsAdmin />} />
            <Route path="procurements" element={<ProcurementsAdmin />} />
            <Route path="whoswho" element={<WhosWhoAdmin />} />
            <Route path="success-stories" element={<Navigate to="/admin/knowledge-hub?type=success_story" replace />} />
            <Route path="newsletters" element={<Navigate to="/admin/knowledge-hub?type=newsletter" replace />} />
            <Route path="thematic" element={<Navigate to="/admin/knowledge-hub?type=thematic_study" replace />} />
            <Route path="reports" element={<Navigate to="/admin/knowledge-hub?type=report" replace />} />
            <Route path="iec" element={<Navigate to="/admin/knowledge-hub?type=iec_material" replace />} />
            <Route path="activities" element={<ActivitiesAdmin />} />
            <Route path="projects" element={<ProjectsManagementAdmin />} />
            <Route path="project-components" element={<ProjectComponentsAdmin />} />
            <Route path="plantation" element={<PlantationAdmin />} />
            <Route path="gis" element={<GisAdmin />} />
            <Route path="hero" element={<HeroManagementAdmin />} />
            <Route path="home-leadership" element={<HomeLeadershipAdmin />} />
            <Route path="home-social-media" element={<HomeSocialMediaAdmin />} />
            <Route path="officials" element={<OfficialsAdmin />} />
            <Route path="knowledge-hub" element={<KnowledgeHubAdmin />} />
            
            
            <Route path="grievance" element={<GrievanceAdmin />} />
            <Route path="rti" element={<RTIAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </SettingsProvider>
      </BrowserRouter>
    </TooltipProvider>
    </AccessibilityProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
