import { useMemo, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Archive as ArchiveIcon, Eye, Download } from "lucide-react";

type Item = { title: string; category: "Notice" | "Event" | "Tender" | "Report"; year: number; date: string; size: string; type: string };

const items: Item[] = [
  { title: "Annual Plantation Drive 2023 — Notification", category: "Notice", year: 2023, date: "12 Jul 2023", size: "320 KB", type: "PDF" },
  { title: "World Environment Day 2024 — Event Report", category: "Event", year: 2024, date: "10 Jun 2024", size: "1.2 MB", type: "PDF" },
  { title: "RFP — Watershed Mapping (Closed)", category: "Tender", year: 2024, date: "28 Mar 2024", size: "540 KB", type: "PDF" },
  { title: "Annual Report 2022-23", category: "Report", year: 2023, date: "30 Sep 2023", size: "4.8 MB", type: "PDF" },
  { title: "Bamboo Cluster Workshop — Proceedings", category: "Event", year: 2023, date: "18 Nov 2023", size: "2.1 MB", type: "PDF" },
  { title: "Tender — Eco-tourism Infrastructure (Expired)", category: "Tender", year: 2022, date: "05 Aug 2022", size: "780 KB", type: "PDF" },
  { title: "Quarterly Bulletin Q4 2022", category: "Notice", year: 2022, date: "31 Dec 2022", size: "920 KB", type: "PDF" },
  { title: "Mid-term Programme Review 2024", category: "Report", year: 2024, date: "15 Aug 2024", size: "5.3 MB", type: "PDF" },
];

const categories = ["All", "Notice", "Event", "Tender", "Report"] as const;

export default function Archive() {
  const [year, setYear] = useState<string>("All");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const years = useMemo(() => ["All", ...Array.from(new Set(items.map(i => i.year))).sort((a, b) => b - a).map(String)], []);
  const filtered = items.filter(i => (year === "All" || String(i.year) === year) && (cat === "All" || i.category === cat));

  return (
    <PageLayout>
      <PageHeader title="Archive" subtitle="Archived notices, past events, expired tenders and historical reports." breadcrumb={["Home", "Archive"]} />
      <section className="py-10">
        <div className="gov-container">
          <div className="flex flex-wrap items-end gap-3 mb-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Year</label>
              <select value={year} onChange={e => setYear(e.target.value)} className="border border-input rounded px-3 py-2 text-sm bg-card focus-ring">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
              <select value={cat} onChange={e => setCat(e.target.value as typeof cat)} className="border border-input rounded px-3 py-2 text-sm bg-card focus-ring">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <p className="text-xs text-muted-foreground ml-auto">{filtered.length} archived item{filtered.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="overflow-x-auto border border-border rounded-md">
            <table className="data-table">
              <thead><tr><th>#</th><th>Title</th><th>Category</th><th>Date</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No archived items match the selected filters.</td></tr>
                )}
                {filtered.map((i, idx) => (
                  <tr key={i.title}>
                    <td>{idx + 1}</td>
                    <td className="font-medium flex items-center gap-2"><ArchiveIcon className="h-4 w-4 text-muted-foreground shrink-0" /> {i.title}</td>
                    <td><span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{i.category}</span></td>
                    <td>{i.date}</td>
                    <td className="text-xs text-muted-foreground">{i.type} · {i.size} · English</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="p-1.5 text-primary hover:bg-primary/10 rounded" aria-label="View"><Eye className="h-4 w-4" /></button>
                        <button className="p-1.5 text-accent hover:bg-accent/10 rounded" aria-label="Download"><Download className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
