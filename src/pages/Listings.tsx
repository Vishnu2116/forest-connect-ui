import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
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
}: {
  title: string;
  subtitle: string;
  rows: Row[];
  type?: "doc" | "tender";
  breadcrumb: string[];
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
            <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold">
              <Upload className="h-4 w-4" /> Upload New
            </button>
          </div>

          {type === "doc" ? (
            <DataTable headers={["#", "Title", "Date", "Type", "Size", "Actions"]}>
              {rows.map((r, i) => (
                <tr key={r.title}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{r.title}</td>
                  <td>{r.date}</td>
                  <td><span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{r.type}</span></td>
                  <td>{r.size}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded" aria-label="View"><Eye className="h-4 w-4" /></button>
                      <button className="p-1.5 text-accent hover:bg-accent/10 rounded" aria-label="Download"><Download className="h-4 w-4" /></button>
                      <button className="p-1.5 text-muted-foreground hover:bg-surface rounded" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
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

export const Reports = () => <ListingPage title="Reports" subtitle="Annual, statutory and thematic reports of the Department" rows={reports} breadcrumb={["Home", "Reports"]} />;
export const Publications = () => <ListingPage title="Publications" subtitle="Books, manuals and field guides published by the Department" rows={publications} breadcrumb={["Home", "Publications"]} />;
export const Procurements = () => <ListingPage title="Procurements & Tenders" subtitle="Active and archived tender notices" rows={procurements} type="tender" breadcrumb={["Home", "Procurements"]} />;
