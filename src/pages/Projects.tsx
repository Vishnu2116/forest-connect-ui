import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Trees, ArrowRight, BarChart3, TrendingUp, Home, Briefcase } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { fetchProjects, resolveImage, statusBadgeClass, statusLabel, type ApiProjectCard } from "@/lib/projects";

const impactStats = [
  { icon: TrendingUp, label: "Area Restored", value: "18,500 Ha", color: "text-primary" },
  { icon: Home, label: "Households Benefited", value: "25,000+", color: "text-accent" },
  { icon: Briefcase, label: "Livelihood Activities", value: "620+", color: "text-primary" },
  { icon: BarChart3, label: "Districts Covered", value: "8", color: "text-accent" },
];

export default function Projects() {
  const { t } = useLang();
  const [items, setItems] = useState<ApiProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchProjects().then((d) => {
      if (alive) {
        setItems(d);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, []);

  return (
    <PageLayout>
      <PageHeader
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
        breadcrumb={["Home", "Projects"]}
      />

      <section className="bg-surface py-8 border-b border-border">
        <div className="gov-container">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-primary">Project Impact</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-md p-5 text-center shadow-card">
                <s.icon className={`h-6 w-6 mx-auto ${s.color}`} />
                <div className="text-2xl font-bold text-primary mt-2">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="gov-container">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const img = resolveImage(p.thumbnail_image_path);
              return (
                <article key={p.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition flex flex-col">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center overflow-hidden">
                    {img ? (
                      <img src={img} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <Trees className="h-10 w-10 text-primary/30" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {/* Status badge and component badge removed per request — commented out, do not delete
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusBadgeClass(p.status)}`}>
                        {statusLabel(p.status)}
                      </span>
                      {p.component?.label && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{p.component.label}</span>
                      )}
                    </div>
                    */}
                    <h3 className="text-base font-bold text-primary leading-snug">{p.title}</h3>
                    {/* Subtitle removed per request — commented out, do not delete
                    {p.subtitle && <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{p.subtitle}</p>}
                    */}
                    <div className="mt-auto pt-4">
                      <Link
                        to={`/projects/${p.slug}`}
                        className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold transition"
                      >
                        Know More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
