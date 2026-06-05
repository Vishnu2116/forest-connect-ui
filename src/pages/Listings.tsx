import { useEffect, useMemo, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import KnowledgeHubLayout from "@/components/layout/KnowledgeHubLayout";
import { DataTable, Pagination } from "@/components/common/DataTable";
import { Download, Eye, Trash2, Pencil, Upload } from "lucide-react";

import { fetchKnowledgeHub, formatMonthYear, formatSizeMB, resolveUrl, type KHType, type ApiKHItem } from "@/lib/knowledgeHub";
import {
  fetchProcurements, formatDate as formatProcDate, formatSize as formatProcSize, resolveUrl as resolveProcUrl,
  statusClass, statusLabel, type ProcType, type ApiProcurement,
} from "@/lib/procurements";

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

function KnowledgeHubApiListing({
  type, title, subtitle,
}: { type: KHType; title: string; subtitle: string }) {
  const [items, setItems] = useState<ApiKHItem[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 500);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchKnowledgeHub({ type, search: debounced || undefined, year: year || undefined, page, limit: 10 })
      .then((res) => {
        if (!alive) return;
        setItems(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [type, debounced, year, page]);

  const years = useMemo(() => {
    const ys = new Set<string>();
    for (let y = new Date().getFullYear(); y >= 2020; y--) ys.add(String(y));
    return Array.from(ys);
  }, []);

  return (
    <KnowledgeHubLayout title={title} subtitle={subtitle} breadcrumb={["Home", "Knowledge Hub", title]}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="border border-input rounded px-3 py-2 text-sm w-full sm:w-72 focus-ring bg-card"
          />
          <select
            value={year}
            onChange={(e) => { setYear(e.target.value); setPage(1); }}
            className="border border-input rounded px-3 py-2 text-sm bg-card focus-ring"
          >
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTable headers={["#", "Title", "Date", "File Details", "Actions"]}>
          {items.map((r, i) => {
            const url = resolveUrl(r.file_path);
            return (
              <tr key={r.id}>
                <td>{(page - 1) * 10 + i + 1}</td>
                <td className="font-medium">{r.title}</td>
                <td>{formatMonthYear(r.published_date)}</td>
                <td>
                  <span className="text-[11px] text-muted-foreground">
                    <span className="font-semibold text-primary">{r.file_type || "PDF"}</span>
                    <span className="mx-1.5 opacity-50">|</span>
                    {formatSizeMB(r.file_size)}
                    <span className="mx-1.5 opacity-50">|</span>
                    {r.language || "English"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <a
                      href={url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => { if (!url) e.preventDefault(); }}
                      className="p-1.5 text-primary hover:bg-primary/10 rounded inline-flex"
                      aria-label={`View ${r.title}`}
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <a
                      href={url || "#"}
                      download={getOriginalFilename(r.file_path || "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => { if (!url) e.preventDefault(); }}
                      className="p-1.5 text-accent hover:bg-accent/10 rounded inline-flex"
                      aria-label={`Download ${r.title}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
          {!loading && items.length === 0 && (
            <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No items found.</td></tr>
          )}
        </DataTable>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Page {page} of {totalPages}</span>
        <div className="flex gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded border border-border disabled:opacity-50 hover:bg-surface"
          >Previous</button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded border border-border disabled:opacity-50 hover:bg-surface"
          >Next</button>
        </div>
      </div>
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

function ProcurementApiListing({
  type, title, subtitle, breadcrumb,
}: { type: ProcType; title: string; subtitle: string; breadcrumb: string[] }) {
  const [items, setItems] = useState<ApiProcurement[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 500);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProcurements({ type, search: debounced || undefined, year: year || undefined, page, limit: 10 })
      .then((res) => {
        if (!alive) return;
        setItems(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [type, debounced, year, page]);

  const years = useMemo(() => {
    const ys: string[] = [];
    for (let y = new Date().getFullYear(); y >= 2020; y--) ys.push(String(y));
    return ys;
  }, []);

  return (
    <PageLayout>
      <PageHeader title={title} subtitle={subtitle} breadcrumb={breadcrumb} />
      <section className="py-10">
        <div className="gov-container">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap gap-2">
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={`Search ${title.toLowerCase()}…`}
                className="border border-input rounded px-3 py-2 text-sm w-72 focus-ring bg-card"
              />
              <select
                value={year}
                onChange={(e) => { setYear(e.target.value); setPage(1); }}
                className="border border-input rounded px-3 py-2 text-sm bg-card focus-ring"
              >
                <option value="">All Years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <DataTable headers={["#", "Title", "Published", "Deadline", "Status", "File Details", "Actions"]}>
            {items.map((r, i) => {
              const url = resolveProcUrl(r.file_path);
              const size = formatProcSize(r.file_size);
              return (
                <tr key={r.id}>
                  <td>{(page - 1) * 10 + i + 1}</td>
                  <td className="font-medium">{r.title}</td>
                  <td>{formatProcDate(r.published_date)}</td>
                  <td>{formatProcDate(r.deadline)}</td>
                  <td>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusClass(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td>
                    <span className="text-[11px] text-muted-foreground">
                      <span className="font-semibold text-primary">PDF</span>
                      {size && <><span className="mx-1.5 opacity-50">·</span>{size}</>}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <a
                        href={url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => { if (!url) e.preventDefault(); }}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded inline-flex"
                        aria-label={`View ${r.title}`}
                      ><Eye className="h-4 w-4" /></a>
                      <a
                        href={url || "#"}
                        download={getOriginalFilename(r.file_path || "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { if (!url) e.preventDefault(); }}
                        className="p-1.5 text-accent hover:bg-accent/10 rounded inline-flex"
                        aria-label={`Download ${r.title}`}
                      ><Download className="h-4 w-4" /></a>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && items.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted-foreground py-6">No items found.</td></tr>
            )}
          </DataTable>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded border border-border disabled:opacity-50 hover:bg-surface"
              >Previous</button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded border border-border disabled:opacity-50 hover:bg-surface"
              >Next</button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export const Procurements = () => (
  <ProcurementApiListing type="tender" title="Procurements & Tenders" subtitle="Active and archived tender notices" breadcrumb={["Home", "Procurements"]} />
);
export const Tenders = () => (
  <ProcurementApiListing type="tender" title="Tenders" subtitle="Active and archived tender notices" breadcrumb={["Home", "Procurements", "Tenders"]} />
);
export const RFPs = () => (
  <ProcurementApiListing type="rfp" title="RFPs" subtitle="Active Requests for Proposals under the PROJECT ELEMENT" breadcrumb={["Home", "Procurements", "RFPs"]} />
);

