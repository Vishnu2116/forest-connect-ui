import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const tree: { title: string; links: { label: string; to: string }[] }[] = [
  { title: "Home", links: [{ label: "Home", to: "/" }] },
  {
    title: "About",
    links: [
      { label: "About ELEMENT", to: "/about" },
      { label: "Organization Structure", to: "/about/organization" },
      { label: "Who's Who", to: "/about/whos-who" },
      { label: "Official Directory", to: "/about/directory" },
      { label: "Memorandum of Association", to: "/about/memorandum" },
      { label: "Vision & Objective", to: "/about/vision" },
      { label: "Mission & Objective", to: "/about/mission" },
    ],
  },
  { title: "Projects", links: [{ label: "All Projects", to: "/projects" }] },
  { title: "Publications", links: [{ label: "Publications", to: "/publications" }] },
  { title: "Activities & Outputs", links: [{ label: "Activities", to: "/activities" }] },
  {
    title: "Knowledge Hub",
    links: [
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
  { title: "Reports", links: [{ label: "Reports", to: "/reports" }] },
  { title: "Procurements", links: [{ label: "Tenders & Procurements", to: "/procurements" }] },
  { title: "Plantation Locations", links: [{ label: "Plantation Map", to: "/plantation-map" }] },
  { title: "Archive", links: [{ label: "Archive", to: "/archive" }] },
  {
    title: "Citizen Services",
    links: [
      { label: "Grievance Redressal", to: "/grievance" },
      { label: "RTI", to: "/rti" },
      { label: "Feedback", to: "/feedback" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Policies & Help",
    links: [
      { label: "Disclaimer", to: "/disclaimer" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Use", to: "/terms-of-use" },
      { label: "Hyperlinking Policy", to: "/hyperlinking-policy" },
      { label: "Copyright Policy", to: "/copyright-policy" },
      { label: "Accessibility Statement", to: "/accessibility" },
      { label: "Screen Reader Access", to: "/screen-reader" },
      { label: "Help", to: "/help" },
    ],
  },
];

export default function Sitemap() {
  return (
    <PageLayout>
      <PageHeader title="Sitemap" subtitle="A complete map of all sections available on the ELEMENT portal." breadcrumb={["Home", "Sitemap"]} />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tree.map((g) => (
              <div key={g.title} className="bg-card border border-border rounded-md p-5 hover:shadow-card transition">
                <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-3 border-b border-border pb-2">{g.title}</h2>
                <ul className="space-y-1.5">
                  {g.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="flex items-center gap-1.5 text-sm text-foreground/80 hover:text-accent">
                        <ChevronRight className="h-3.5 w-3.5 text-accent" />
                        <span>{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
