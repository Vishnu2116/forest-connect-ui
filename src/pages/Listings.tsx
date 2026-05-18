import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import KnowledgeHubLayout from "@/components/layout/KnowledgeHubLayout";
import { DataTable, Pagination } from "@/components/common/DataTable";
import { Download, Eye, Trash2, Pencil, Upload } from "lucide-react";
import { reports, publications, procurements } from "@/data/content";

type Row = { title: string; date: string; size?: string; type?: string; deadline?: string; status?: string };

export function ListingPage({
  title,
  subtitle,
  rows,
  type = "doc",
  breadcrumb,
  showAdminActions = false,
}: {
  title: string;
  subtitle: string;
  rows: Row[];
  type?: "doc" | "tender";
  breadcrumb: string[];
  showAdminActions?: boolean;
}) {
  return (
    <PageLayout>
      <PageHeader title={title} subtitle={subtitle} breadcrumb={breadcrumb} />
      <section className="py-10">
        <div className="gov-container">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap gap-2">
              <input type="search" placeholder={`Search ${title.toLowerCase()}…`} className="border border-input rounded px-3 py-2 text-sm w-72 focus-ring bg-card" />
              <select className="border border-input rounded px-3 py-2 text-sm bg-card focus-ring">
                <option>All Years</option><option>2026</option><option>2025</option><option>2024</option>
              </select>
            </div>
            {showAdminActions && (
              <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold">
                <Upload className="h-4 w-4" /> Upload New
              </button>
            )}
          </div>

          {type === "doc" ? (
            <DataTable headers={["#", "Title", "Date", "File Details", "Actions"]}>
              {rows.map((r, i) => (
                <tr key={r.title}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{r.title}</td>
                  <td>{r.date}</td>
                  <td>
                    <span className="text-[11px] text-muted-foreground">
                      <span className="font-semibold text-primary">{r.type || "PDF"}</span>
                      <span className="mx-1.5 opacity-50">|</span>
                      {r.size || "—"}
                      <span className="mx-1.5 opacity-50">|</span>
                      English
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded" aria-label={`View ${r.title}`}><Eye className="h-4 w-4" /></button>
                      <button className="p-1.5 text-accent hover:bg-accent/10 rounded" aria-label={`Download ${r.title}`}><Download className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <DataTable headers={["#", "Tender Title", "Published", "Deadline", "Status", "Actions"]}>
              {rows.map((r, i) => (
                <tr key={r.title}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{r.title}</td>
                  <td>{r.date}</td>
                  <td>{r.deadline}</td>
                  <td>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      r.status === "Open" ? "bg-success/10 text-success" :
                      r.status === "Closed" ? "bg-muted text-muted-foreground" :
                      "bg-accent/10 text-accent"
                    }`}>{r.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded" aria-label="View"><Eye className="h-4 w-4" /></button>
                      <button className="p-1.5 text-accent hover:bg-accent/10 rounded" aria-label="Download"><Download className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
          <Pagination current={1} total={5} />
        </div>
      </section>
    </PageLayout>
  );
}

/* Renders a document table inside the Knowledge Hub layout (with sidebar). */
function KnowledgeHubListing({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: Row[];
}) {
  return (
    <KnowledgeHubLayout
      title={title}
      subtitle={subtitle}
      breadcrumb={["Home", "Knowledge Hub", title]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            placeholder={`Search ${title.toLowerCase()}…`}
            className="border border-input rounded px-3 py-2 text-sm w-full sm:w-72 focus-ring bg-card"
          />
          <select className="border border-input rounded px-3 py-2 text-sm bg-card focus-ring">
            <option>All Years</option>
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTable headers={["#", "Title", "Date", "File Details", "Actions"]}>
          {rows.map((r, i) => (
            <tr key={r.title}>
              <td>{i + 1}</td>
              <td className="font-medium">{r.title}</td>
              <td>{r.date}</td>
              <td>
                <span className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-primary">{r.type || "PDF"}</span>
                  <span className="mx-1.5 opacity-50">|</span>
                  {r.size || "—"}
                  <span className="mx-1.5 opacity-50">|</span>
                  English
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  <button className="p-1.5 text-primary hover:bg-primary/10 rounded" aria-label={`View ${r.title}`}><Eye className="h-4 w-4" /></button>
                  <button className="p-1.5 text-accent hover:bg-accent/10 rounded" aria-label={`Download ${r.title}`}><Download className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
      <Pagination current={1} total={5} />
    </KnowledgeHubLayout>
  );
}

export const Reports = () => (
  <KnowledgeHubApiListing
    type="report"
    title="Reports"
    subtitle="Annual, statutory and thematic reports of the Department"
  />
);
export const Publications = () => (
  <KnowledgeHubApiListing
    type="publication"
    title="Publications"
    subtitle="Books, manuals and field guides published by the Department"
  />
);
export const Procurements = () => <ListingPage title="Procurements & Tenders" subtitle="Active and archived tender notices" rows={procurements} type="tender" breadcrumb={["Home", "Procurements"]} />;

const rfpRows = [
  { title: "RFP for Consultancy — Landscape Restoration Baseline Study", date: "12 May 2026", deadline: "10 Jun 2026", status: "Open" },
  { title: "RFP for Communications & Outreach Agency (ELEMENT)", date: "05 May 2026", deadline: "02 Jun 2026", status: "Open" },
  { title: "RFP for MIS/GIS Platform Implementation Partner", date: "28 Apr 2026", deadline: "25 May 2026", status: "Closing Soon" },
  { title: "RFP for Third-Party Monitoring & Evaluation Agency", date: "15 Apr 2026", deadline: "12 May 2026", status: "Closed" },
  { title: "RFP for Bamboo Value-Chain Technical Advisor", date: "02 Apr 2026", deadline: "30 Apr 2026", status: "Closed" },
];

const tenderRows = [
  { title: "Construction of Community Nursery Centres — Dhalai District", date: "10 May 2026", deadline: "08 Jun 2026", status: "Open" },
  { title: "Supply of Saplings & Planting Material — Phase II", date: "06 May 2026", deadline: "30 May 2026", status: "Open" },
  { title: "Procurement of Field Survey Equipment", date: "02 May 2026", deadline: "22 May 2026", status: "Closing Soon" },
  { title: "Civil Works — Eco-Tourism Cluster, Jampui Hills", date: "20 Apr 2026", deadline: "18 May 2026", status: "Closing Soon" },
  { title: "Annual Vehicle Hiring — Project Offices", date: "10 Apr 2026", deadline: "05 May 2026", status: "Closed" },
];

export const RFPs = () => <ListingPage title="RFPs" subtitle="Active Requests for Proposals under the PROJECT ELEMENT" rows={rfpRows} type="tender" breadcrumb={["Home", "Procurements", "RFPs"]} />;
export const Tenders = () => <ListingPage title="Tenders" subtitle="Active and archived tender notices" rows={tenderRows} type="tender" breadcrumb={["Home", "Procurements", "Tenders"]} />;
