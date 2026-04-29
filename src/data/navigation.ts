export type NavItem = {
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
};

export const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About Us",
    children: [
      { label: "Organization Structure", to: "/about/organization" },
      { label: "Memorandum of Association", to: "/about/memorandum" },
      { label: "Official Directory", to: "/about/directory" },
      { label: "Vision & Objective", to: "/about/vision" },
      { label: "Mission & Objective", to: "/about/mission" },
    ],
  },
  { label: "Projects", to: "/projects" },
  { label: "Publications", to: "/publications" },
  { label: "Activities & Outputs", to: "/activities" },
  {
    label: "Knowledge Hub",
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
  { label: "Reports", to: "/reports" },
  { label: "Procurements", to: "/procurements" },
  { label: "Plantation Map", to: "/plantation-map" },
  { label: "Who's Who", to: "/whos-who" },
  { label: "Grievance", to: "/grievance" },
  { label: "RTI", to: "/rti" },
  { label: "Contact Us", to: "/contact" },
];
