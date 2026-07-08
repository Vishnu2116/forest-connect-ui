import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const tree: { title: string; links: { label: string; to: string }[] }[] = [
  { title: "Home", links: [{ label: "Home", to: "/" }] },
  {
    title: "About",
    links: [
      { label: "About PROJECT ELEMENT", to: "/about" },
      { label: "Loan Agreement", to: "/about/loan-agreement" },
      { label: "Official Directory", to: "/about/directory" },
    ],
  },
  { title: "Project Components", links: [{ label: "Project Components", to: "/projects" }] },
  { title: "Activities & Outputs", links: [{ label: "Activities & Outputs", to: "/activities" }] },
  {
    title: "Knowledge Hub",
    links: [
      { label: "Reports", to: "/knowledge-hub/report" },
      { label: "IEC Materials", to: "/knowledge-hub/iec_material" },
      { label: "Documentation", to: "/knowledge-hub/documentation" },
      { label: "Success Stories", to: "/knowledge-hub/success_story" },
      { label: "Notifications", to: "/knowledge-hub/notification" },
    ],
  },
  {
    title: "Media",
    links: [
      { label: "Gallery", to: "/media/gallery" },
      { label: "Events", to: "/media/events" },
      { label: "Social Media", to: "/media/social" },
    ],
  },
  { title: "Procurements", links: [{ label: "E-Tenders", to: "/procurements/tenders" }] },
  { title: "MIS/GIS", links: [{ label: "Plantation Map", to: "/plantation-map" }] },
  {
    title: "Grievance & RTI",
    links: [
      { label: "Grievance Redressal", to: "/grievance" },
      { label: "RTI", to: "/rti" },
    ],
  },
  { title: "Contact", links: [{ label: "Contact Us", to: "/contact" }] },
  {
    title: "Policies",
    links: [
      { label: "Disclaimer", to: "/disclaimer" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms & Conditions", to: "/terms-conditions" },
      { label: "Hyperlinking Policy", to: "/hyperlinking-policy" },
      { label: "Copyright Policy", to: "/copyright-policy" },
      { label: "Accessibility Statement", to: "/accessibility" },
      { label: "Screen Reader Access", to: "/screen-reader" },
      { label: "Help", to: "/help" },
      { label: "Feedback", to: "/feedback" },
      { label: "Archive", to: "/archive" },
      { label: "Sitemap", to: "/sitemap" },
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
