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
      { label: "About PROJECT ELEMENT", to: "/about" },
      { label: "Organization Structure", to: "/about/organization" },
      // { label: "Who's Who", to: "/about/whos-who" }, // Removed per request — kept for future use
      { label: "Memorandum of Association", to: "/about/memorandum" },
      { label: "Official Directory", to: "/about/directory" },
      { label: "Objectives", to: "/about/objectives" },
    ],
  },
  {
    labelKey: "nav.components",
    children: [
      { label: "Component 1", to: "/components/component-1" },
      { label: "Component 2", to: "/components/component-2" },
      { label: "Component 3", to: "/components/component-3" },
      { label: "Component 4", to: "/components/component-4" },
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
      // { label: "Thematic Studies", to: "/knowledge-hub/thematic" }, // Removed per request — kept for future use
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
      // { label: "RFPs", to: "/procurements/rfps" }, // Removed per request — kept for future use
      { label: "Tenders", to: "/procurements/tenders" },
    ],
  },
  { labelKey: "nav.misgis", to: "/plantation-map" },
  { labelKey: "nav.grievance", to: "/grievance" },
  { labelKey: "nav.rti", to: "/rti" },
  { labelKey: "nav.contact", to: "/contact" },
];
