import { useEffect, useMemo, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Archive as ArchiveIcon, Eye, Download } from "lucide-react";
import {
  fetchProcurements,
  formatDate,
  formatSize,
  resolveUrl as resolveProcurementUrl,
} from "@/lib/procurements";
import {
  fetchKnowledgeHub,
  formatSizeMB,
  resolveUrl as resolveKnowledgeHubUrl,
} from "@/lib/knowledgeHub";

type Category = "Notice" | "E-Tender" | "Report";

type ArchiveItem = {
  id: string;
  title: string;
  category: Category;
  year: number | null;
  date: string;
  publishedAt: number;
  size: string;
  type: string;
  fileUrl: string | null;
};

const categories = ["All", "Notice", "E-Tender", "Report"] as const;

function dateDetails(date?: string | null) {
  if (!date) return { year: null, publishedAt: Number.NEGATIVE_INFINITY };
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return { year: null, publishedAt: Number.NEGATIVE_INFINITY };
  }
  return { year: parsed.getFullYear(), publishedAt: parsed.getTime() };
}

export default function Archive() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<string>("All");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  useEffect(() => {
    let cancelled = false;

    async function loadArchive() {
      const [tenderResult, reportResult, notificationResult] =
        await Promise.allSettled([
          fetchProcurements({
            type: "tender",
            limit: 100,
            noFallback: true,
          }),
          fetchKnowledgeHub({
            type: "report",
            limit: 100,
            noFallback: true,
          }),
          fetchKnowledgeHub({
            type: "notification",
            limit: 100,
            noFallback: true,
          }),
        ]);

      const tenders =
        tenderResult.status === "fulfilled" ? tenderResult.value.data : [];
      const reports =
        reportResult.status === "fulfilled" ? reportResult.value.data : [];
      const notifications =
        notificationResult.status === "fulfilled"
          ? notificationResult.value.data
          : [];
      const archiveCutoff = new Date();
      archiveCutoff.setFullYear(archiveCutoff.getFullYear() - 1);

      const tenderItems: ArchiveItem[] = tenders
        .filter((item) =>
          ["closed", "cancelled"].includes(
            String(item.status ?? "").toLowerCase(),
          ),
        )
        .map((item) => {
          const { year: itemYear, publishedAt } = dateDetails(
            item.published_date,
          );
          return {
            id: `tender-${item.id}`,
            title: item.title,
            category: "E-Tender",
            year: itemYear,
            date: formatDate(item.published_date),
            publishedAt,
            size: formatSize(item.file_size),
            type: item.file_type || "PDF",
            fileUrl: resolveProcurementUrl(item.file_path),
          };
        });

      const mapKnowledgeItems = (
        source: typeof reports,
        category: "Report" | "Notice",
      ): ArchiveItem[] =>
        source
          .filter((item) => {
            const { publishedAt } = dateDetails(item.published_date);
            return (
              Number.isFinite(publishedAt) &&
              publishedAt < archiveCutoff.getTime()
            );
          })
          .map((item) => {
            const { year: itemYear, publishedAt } = dateDetails(
              item.published_date,
            );
            return {
              id: `${category.toLowerCase()}-${item.id}`,
              title: item.title,
              category,
              year: itemYear,
              date: formatDate(item.published_date),
              publishedAt,
              size: formatSizeMB(item.file_size),
              type: item.file_type || "PDF",
              fileUrl: resolveKnowledgeHubUrl(item.file_path),
            };
          });

      const loadedItems = [
        ...tenderItems,
        ...mapKnowledgeItems(reports, "Report"),
        ...mapKnowledgeItems(notifications, "Notice"),
      ].sort((a, b) => b.publishedAt - a.publishedAt);

      if (!cancelled) {
        setItems(loadedItems);
        setLoading(false);
      }
    }

    loadArchive();
    return () => {
      cancelled = true;
    };
  }, []);

  const years = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(items.flatMap((item) => (item.year ? [item.year] : []))),
      )
        .sort((a, b) => b - a)
        .map(String),
    ],
    [items],
  );
  const filtered = items.filter(
    (item) =>
      (year === "All" || String(item.year) === year) &&
      (cat === "All" || item.category === cat),
  );

  return (
    <PageLayout>
      <PageHeader title="Archive" subtitle="Archived notices, expired e-tenders and historical reports." breadcrumb={["Home", "Archive"]} />
      <section className="py-10">
        <div className="gov-container">
          {!loading && items.length > 0 && (
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
          )}

          <div className="overflow-x-auto border border-border rounded-md">
            <table className="data-table">
              <thead><tr><th>#</th><th>Title</th><th>Category</th><th>Date</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading archived items…</td></tr>
                )}
                {!loading && items.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No archived items are available at this time.</td></tr>
                )}
                {!loading && items.length > 0 && filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No archived items match the selected filters.</td></tr>
                )}
                {filtered.map((i, idx) => (
                  <tr key={i.id}>
                    <td>{idx + 1}</td>
                    <td className="font-medium flex items-center gap-2"><ArchiveIcon className="h-4 w-4 text-muted-foreground shrink-0" /> {i.title}</td>
                    <td><span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{i.category}</span></td>
                    <td>{i.date}</td>
                    <td className="text-xs text-muted-foreground">{[i.type, i.size].filter(Boolean).join(" · ")}</td>
                    <td>
                      <div className="flex gap-2">
                        {i.fileUrl ? (
                          <a href={i.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-primary hover:bg-primary/10 rounded" aria-label="View"><Eye className="h-4 w-4" /></a>
                        ) : (
                          <button disabled className="p-1.5 text-primary rounded opacity-40 cursor-not-allowed" aria-label="View"><Eye className="h-4 w-4" /></button>
                        )}
                        {i.fileUrl ? (
                          <a href={i.fileUrl} download className="p-1.5 text-accent hover:bg-accent/10 rounded" aria-label="Download"><Download className="h-4 w-4" /></a>
                        ) : (
                          <button disabled className="p-1.5 text-accent rounded opacity-40 cursor-not-allowed" aria-label="Download"><Download className="h-4 w-4" /></button>
                        )}
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
