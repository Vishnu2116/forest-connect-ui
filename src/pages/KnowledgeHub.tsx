import { useEffect, useState } from "react";
import KnowledgeHubLayout from "@/components/layout/KnowledgeHubLayout";
import { knowledgeHubItems } from "@/data/content";
import { BookOpen, Download, FileText } from "lucide-react";
import { useKnowledgeHubItems, KHItem } from "@/hooks/useKnowledgeHub";

export default function KnowledgeHub({ initialCategory = "IEC Materials" }: { initialCategory?: string }) {
  const [active, setActive] = useState(initialCategory);

  useEffect(() => { setActive(initialCategory); }, [initialCategory]);

  // Local dummy fallback shaped like KHItem
  const dummyItems: KHItem[] = Array.from({ length: 8 })
    .flatMap((_, i) =>
      knowledgeHubItems.map((k, j) => ({
        id: `${i}-${j}`,
        title: `${k.title}${i > 0 ? ` — Vol. ${i + 1}` : ""}`,
        publish_date: k.date,
        category_name: k.category,
        file_format: "PDF",
        file_size: "2.4 MB",
        language: "en",
        is_downloadable: true,
      }))
    )
    .filter((k) => k.category_name === active)
    .slice(0, 9);

  const { data, loading } = useKnowledgeHubItems(active, dummyItems);
  const items = data.items;

  return (
    <KnowledgeHubLayout
      title="Knowledge Hub"
      subtitle="Resources, reports, studies and notifications curated for stakeholders"
      breadcrumb={["Home", "Knowledge Hub", active]}
    >
      <h2 className="section-title mb-6">{active}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading && items.length === 0 && (
          <p className="text-muted-foreground text-sm">Loading…</p>
        )}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground text-sm">No items in this category yet.</p>
        )}
        {items.map((k) => {
          const href = k.file_url || k.external_url || undefined;
          const dateLabel = k.publish_date
            ? new Date(k.publish_date).toLocaleDateString(undefined, { year: "numeric", month: "short" })
            : "";
          return (
            <article key={k.id} className="bg-card border border-border rounded-md overflow-hidden hover:shadow-card transition flex flex-col">
              <div className="h-32 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center overflow-hidden">
                {k.thumbnail_url ? (
                  <img src={k.thumbnail_url} alt={k.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <BookOpen className="h-10 w-10 text-primary-foreground/80" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {k.category_name || active}
                </span>
                <h3 className="text-sm font-bold text-foreground mt-1 leading-snug">{k.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {(k.file_format || "PDF")} · {k.file_size ? `${formatSize(k.file_size)} · ` : ""}
                  {(k.language || "en").toUpperCase()}{dateLabel ? ` · ${dateLabel}` : ""}
                </p>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                ) : (
                  <button className="mt-3 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-3 py-1.5 rounded text-xs font-semibold">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </KnowledgeHubLayout>
  );
}

function formatSize(bytes: string | number): string {
  const n = typeof bytes === "string" ? Number(bytes) : bytes;
  if (!n || Number.isNaN(n)) return String(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
