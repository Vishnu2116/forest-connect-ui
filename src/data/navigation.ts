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
      { label: "Key Officials", to: "/about/whos-who" },
      { label: "Vision & Objective", to: "/about/vision" },
      { label: "Mission & Objective", to: "/about/mission" },
    ],
  },
  { labelKey: "nav.projects", to: "/projects" },
  { labelKey: "nav.publications", to: "/publications" },
  { labelKey: "nav.activities", to: "/activities" },
  {
    labelKey: "nav.knowledge",
    children: [
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
  { labelKey: "nav.reports", to: "/reports" },
  { labelKey: "nav.procurements", to: "/procurements" },
  { labelKey: "nav.plantationMap", to: "/plantation-map" },
  { labelKey: "nav.contact", to: "/contact" },
];
