// Lightweight global search index. Static list of public pages/routes.
// Used by the navbar search dropdown for instant, accessible navigation.

export type SearchEntry = {
  title: string;
  to: string;
  group?: string;
  keywords?: string;
};

export const searchIndex: SearchEntry[] = [
  { title: "Home", to: "/", group: "Main" },

  // About
  { title: "About PROJECT ELEMENT", to: "/about", group: "About", keywords: "about element overview" },
  { title: "Organization Structure", to: "/about/organization", group: "About" },
  { title: "Who's Who", to: "/about/whos-who", group: "About", keywords: "whos who team leadership" },
  { title: "Memorandum of Association", to: "/about/memorandum", group: "About" },
  { title: "Official Directory", to: "/about/directory", group: "About" },
  { title: "Objectives", to: "/about/objectives", group: "About", keywords: "vision mission objectives" },

  // Project Components
  { title: "Project Components", to: "/project-components", group: "Components" },
  { title: "Project Component-1", to: "/components/component-1", group: "Components" },
  { title: "Project Component-2", to: "/components/component-2", group: "Components" },
  { title: "Project Component-3", to: "/components/component-3", group: "Components" },
  { title: "Project Component-4", to: "/components/component-4", group: "Components" },

  // Projects
  { title: "Projects", to: "/projects", group: "Projects" },

  // Activities
  { title: "Activities & Outputs", to: "/activities", group: "Activities" },

  // Knowledge Hub
  { title: "Publications", to: "/publications", group: "Knowledge Hub" },
  { title: "Reports", to: "/reports", group: "Knowledge Hub" },
  { title: "IEC Materials", to: "/knowledge-hub/iec", group: "Knowledge Hub" },
  { title: "Newsletters", to: "/knowledge-hub/newsletters", group: "Knowledge Hub" },
  { title: "Success Stories", to: "/knowledge-hub/success-stories", group: "Knowledge Hub" },
  { title: "Thematic Studies", to: "/knowledge-hub/thematic", group: "Knowledge Hub" },
  { title: "Documentation", to: "/knowledge-hub/documentation", group: "Knowledge Hub" },
  { title: "Case Studies", to: "/knowledge-hub/case-studies", group: "Knowledge Hub" },
  { title: "Notifications", to: "/knowledge-hub/notifications", group: "Knowledge Hub" },
  { title: "Lessons Learned", to: "/knowledge-hub/lessons", group: "Knowledge Hub" },

  // Media
  { title: "Social Media", to: "/media/social", group: "Media" },
  { title: "Gallery", to: "/media/gallery", group: "Media" },
  { title: "Events", to: "/media/events", group: "Media" },

  // Procurements
  { title: "Procurements", to: "/procurements", group: "Procurements" },
  { title: "RFPs", to: "/procurements/rfps", group: "Procurements", keywords: "request for proposal" },
  { title: "Tenders", to: "/procurements/tenders", group: "Procurements" },

  // GIS / Map
  { title: "Plantation Map", to: "/plantation-map", group: "MIS / GIS" },
  { title: "MIS / GIS", to: "/mis-gis", group: "MIS / GIS" },

  // Grievance / RTI / Contact
  { title: "Grievance Redressal", to: "/grievance", group: "Citizen Services" },
  { title: "RTI", to: "/rti", group: "Citizen Services", keywords: "right to information" },
  { title: "Contact Us", to: "/contact", group: "Citizen Services" },

  // Policies / Utility
  { title: "Disclaimer", to: "/disclaimer", group: "Policies" },
  { title: "Privacy Policy", to: "/privacy-policy", group: "Policies" },
  { title: "Terms of Use", to: "/terms-of-use", group: "Policies" },
  { title: "Hyperlinking Policy", to: "/hyperlinking-policy", group: "Policies" },
  { title: "Copyright Policy", to: "/copyright-policy", group: "Policies" },
  { title: "Accessibility Statement", to: "/accessibility", group: "Utility" },
  { title: "Screen Reader Access", to: "/screen-reader", group: "Utility" },
  { title: "Help", to: "/help", group: "Utility" },
  { title: "Sitemap", to: "/sitemap", group: "Utility" },
  { title: "Feedback", to: "/feedback", group: "Utility" },
  { title: "Archive", to: "/archive", group: "Utility" },
];

export function searchSite(query: string, limit = 8): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of searchIndex) {
    const hay = `${entry.title} ${entry.group ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
    let score = 0;
    let allMatch = true;
    for (const tok of tokens) {
      const idx = hay.indexOf(tok);
      if (idx === -1) {
        allMatch = false;
        break;
      }
      // Title prefix matches rank highest
      if (entry.title.toLowerCase().startsWith(tok)) score += 100;
      else if (entry.title.toLowerCase().includes(tok)) score += 50;
      else score += 10;
      score -= idx * 0.1;
    }
    if (allMatch) scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}
