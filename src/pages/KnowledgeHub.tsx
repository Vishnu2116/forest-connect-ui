import { useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { knowledgeHubItems } from "@/data/content";
import { BookOpen, Download, FileText } from "lucide-react";

const categories = ["IEC Materials", "Newsletters", "Success Stories", "Thematic Studies", "Documentation", "Case Studies", "Notifications", "Lessons Learned"];

export default function KnowledgeHub({ initialCategory = "IEC Materials" }: { initialCategory?: string }) {
  const [active, setActive] = useState(initialCategory);
  const items = Array.from({ length: 8 }).flatMap((_, i) =>
    knowledgeHubItems.map((k, j) => ({ ...k, id: `${i}-${j}` }))
  ).filter(k => k.category === active).slice(0, 9);

  return (
    <PageLayout>
      <PageHeader title="Knowledge Hub" subtitle="Resources, reports, studies and notifications curated for stakeholders" breadcrumb={["Home", "Knowledge Hub", active]} />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase">Categories</h3>
            <nav className="space-y-1">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`w-full text-left px-3 py-2 text-sm rounded border-l-2 hover:bg-surface ${active === c ? "border-accent text-primary bg-surface font-semibold" : "border-transparent"}`}
                >
                  {c}
                </button>
              ))}
            </nav>
          </aside>

          <div className="lg:col-span-3">
            <h2 className="section-title mb-6">{active}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.length === 0 && <p className="text-muted-foreground text-sm">No items in this category yet.</p>}
              {items.map((k, i) => (
                <article key={k.id} className="bg-card border border-border rounded-md overflow-hidden hover:shadow-card transition flex flex-col">
                  <div className="h-32 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary-foreground/80" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">{k.category}</span>
                    <h3 className="text-sm font-bold text-foreground mt-1 leading-snug">{k.title} {i > 0 && `— Vol. ${i + 1}`}</h3>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><FileText className="h-3 w-3" /> PDF · {k.date}</p>
                    <button className="mt-3 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-3 py-1.5 rounded text-xs font-semibold">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
