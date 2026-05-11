import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Compass, FileText, Map, MonitorSmartphone, Download, LifeBuoy } from "lucide-react";

const sections = [
  { icon: Compass, title: "Navigating the Website", body: "Use the main menu at the top to access About, Projects, Publications, Activities, Knowledge Hub, Reports, Procurements and Plantation Locations. Drop-down menus group related sections." },
  { icon: FileText, title: "Accessing Reports & Documents", body: "Visit the Reports, Publications or Knowledge Hub sections. Each item shows file type, size and language. Click the download or view icon next to a document." },
  { icon: Map, title: "Using the Plantation Map", body: "Open Plantation Locations from the main menu. Use district filters and zoom controls. Click a marker to see plantation details for that site." },
  { icon: MonitorSmartphone, title: "Browser Support", body: "The portal is best viewed on the latest versions of Google Chrome, Mozilla Firefox, Microsoft Edge and Safari, on screens 320px wide and above." },
  { icon: Download, title: "Downloading Files", body: "Documents are typically provided as PDF. To open them, install Adobe Acrobat Reader (free). Right-click any download link and choose 'Save link as…' to save locally." },
  { icon: LifeBuoy, title: "Helpdesk", body: "For any portal-related queries, contact our helpdesk on 1800-345-3666 (toll-free, Mon–Sat, 9 AM – 6 PM) or write to info@element.tripura.gov.in." },
];

export default function Help() {
  return (
    <PageLayout>
      <PageHeader title="Help" subtitle="Guidance to help you make the most of the ELEMENT portal." breadcrumb={["Home", "Help"]} />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map(({ icon: Icon, title, body }) => (
              <article key={title} className="bg-card border border-border rounded-md p-5 hover:shadow-card transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                  <h2 className="text-base font-bold text-primary">{title}</h2>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
