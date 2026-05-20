import { useEffect, useMemo, useState } from "react";
import KnowledgeHubLayout from "@/components/layout/KnowledgeHubLayout";
import { BookOpen, Download, FileText } from "lucide-react";
import {
  fetchKnowledgeHub, categoryToType, formatMonthYear, formatSizeMB, resolveUrl,
  type ApiKHItem, type KHType,
} from "@/lib/knowledgeHub";

export default function KnowledgeHub({ initialCategory = "IEC Materials" }: { initialCategory?: string }) {
  const active = initialCategory;
  const type = useMemo<KHType | null>(() => categoryToType(active), [active]);

  const [items, setItems] = useState<ApiKHItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset state whenever the section/type changes so the new section
  // refetches and never shows stale items from the previous one.
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
  }, [type]);

  useEffect(() => {
    if (!type) return;
    let alive = true;
    fetchKnowledgeHub({ type, page, limit: 9 }).then((res) => {
      if (!alive) return;
      setItems(res.data);
      setTotalPages(res.pagination?.totalPages || 1);
    });
    return () => { alive = false; };
  }, [type, page]);

  return (
    <KnowledgeHubLayout
      title={active}
      subtitle="Resources, reports, studies and notifications curated for stakeholders"
      breadcrumb={["Home", "Knowledge Hub", active]}
    >
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
                    download
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
    </KnowledgeHubLayout>
  );
}
