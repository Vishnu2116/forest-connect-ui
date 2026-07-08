import { useEffect, useMemo, useState } from "react";
import KnowledgeHubLayout from "@/components/layout/KnowledgeHubLayout";
import { DataTable } from "@/components/common/DataTable";
import { BookOpen, Download, Eye, FileText } from "lucide-react";
import {
  fetchKnowledgeHub, categoryToType, formatMonthYear, formatSizeMB, resolveUrl,
  type ApiKHItem, type KHType,
} from "@/lib/knowledgeHub";
import { getOriginalFilename } from "@/utils/fileDownload";

export default function KnowledgeHub({ initialCategory = "IEC Materials" }: { initialCategory?: string }) {
  const active = initialCategory;
  const type = useMemo<KHType | null>(() => categoryToType(active), [active]);

  const [items, setItems] = useState<ApiKHItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [year, setYear] = useState("");

  // Reset state whenever the section/type changes so the new section
  // refetches and never shows stale items from the previous one.
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setSearch("");
    setDebounced("");
    setYear("");
  }, [type]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 500);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (!type) return;
    let alive = true;
    fetchKnowledgeHub({
      type,
      search: debounced || undefined,
      year: year || undefined,
      page,
      limit: active === "Documentation" ? 10 : 9,
    }).then((res) => {
      if (!alive) return;
      setItems(res.data);
      setTotalPages(res.pagination?.totalPages || 1);
    });
    return () => { alive = false; };
  }, [type, page, debounced, year, active]);

  const years = useMemo(() => {
    const ys = new Set<string>();
    for (let y = new Date().getFullYear(); y >= 2020; y--) ys.add(String(y));
    return Array.from(ys);
  }, []);

  return (
    <KnowledgeHubLayout
      title={active}
      subtitle="Resources, reports, studies and notifications curated for stakeholders"
      breadcrumb={["Home", "Knowledge Hub", active]}
    >
      {active === "Documentation" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex flex-wrap gap-2">
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={`Search ${active.toLowerCase()}…`}
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
              {items.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No items in this category yet.</td></tr>
              )}
            </DataTable>
          </div>
          {totalPages > 1 && (
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
          )}
        </>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.length === 0 && <p className="text-muted-foreground text-sm">No items in this category yet.</p>}
            {items.map((k) => {
              const thumb = resolveUrl(k.thumbnail_path);
              const fileUrl = resolveUrl(k.file_path);
              return (
                <article key={k.id} className="bg-card border border-border rounded-md overflow-hidden hover:shadow-card transition flex flex-col">
                  <div className="h-32 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={k.title} className="h-full w-full object-cover" />
                    ) : (
                      <BookOpen className="h-10 w-10 text-primary-foreground/80" />
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">{active}</span>
                    <h3 className="text-sm font-bold text-foreground mt-1 leading-snug">{k.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {k.file_type || "PDF"} · {formatSizeMB(k.file_size)} · {k.language || "English"} · {formatMonthYear(k.published_date)}
                    </p>
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        download={getOriginalFilename(k.file_path || "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-3 py-1.5 rounded text-xs font-semibold"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
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
          )}
        </>
      )}
    </KnowledgeHubLayout>
  );
}
