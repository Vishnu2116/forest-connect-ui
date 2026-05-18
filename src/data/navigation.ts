export type NavItem = {
  labelKey: string;
  to?: string;
  children?: { label: string; to: string }[];
};

export const navItems: NavItem[] = [
  { labelKey: "nav.home", to: "/" },
  {
    labelKey: "nav.about",
    children: [
      { label: "About ELEMENT", to: "/about" },
      { label: "Organization Structure", to: "/about/organization" },
      { label: "Who's Who", to: "/about/whos-who" },
      { label: "Memorandum of Association", to: "/about/memorandum" },
      { label: "Official Directory", to: "/about/directory" },
      { label: "Vision & Objective", to: "/about/vision" },
      { label: "Mission & Objective", to: "/about/mission" },
    ],
  },
  {
    labelKey: "nav.components",
    children: [
      { label: "Project Component-1", to: "/components/component-1" },
      { label: "Project Component-2", to: "/components/component-2" },
      { label: "Project Component-3", to: "/components/component-3" },
      { label: "Project Component-4", to: "/components/component-4" },
    ],
  },
  { labelKey: "nav.activities", to: "/activities" },
  {
    labelKey: "nav.knowledge",
    children: [
      { label: "Publications", to: "/publications" },
      { label: "Reports", to: "/reports" },
      { label: "IEC Materials", to: "/knowledge-hub/iec" },
      { label: "Newsletters", to: "/knowledge-hub/newsletters" },
      { label: "Success Stories", to: "/knowledge-hub/success-stories" },
      { label: "Thematic Studies", to: "/knowledge-hub/thematic" },
      { label: "Documentation", to: "/knowledge-hub/documentation" },
      { label: "Case Studies", to: "/knowledge-hub/case-studies" },
      { label: "Notifications", to: "/knowledge-hub/notifications" },
      { label: "Lessons Learned", to: "/knowledge-hub/lessons" },
    ],
  },
  {
    labelKey: "nav.media",
    children: [
      { label: "Social Media", to: "/media/social" },
      { label: "Gallery", to: "/media/gallery" },
      { label: "Events", to: "/media/events" },
    ],
  },
  {
    labelKey: "nav.procurements",
    children: [
      { label: "RFPs", to: "/procurements/rfps" },
      { label: "Tenders", to: "/procurements/tenders" },
    ],
  },
  { labelKey: "nav.misgis", to: "/plantation-map" },
  { labelKey: "nav.grievance", to: "/grievance" },
  { labelKey: "nav.rti", to: "/rti" },
  { labelKey: "nav.contact", to: "/contact" },
];
