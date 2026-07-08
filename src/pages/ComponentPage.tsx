import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Trees, ArrowRight, BarChart3, ChevronRight } from "lucide-react";
import {
  fetchComponent,
  resolveImage,
  statusBadgeClass,
  statusLabel,
  type ApiProjectComponent,
} from "@/lib/projects";

const COMPONENT_STATIC: Record<number, { paragraph: string; objectives: string[] }> = {
  1: {
    paragraph:
      "Component 1 focuses on landscape management and ecosystem restoration across Tripura. It aims to restore degraded forest landscapes, conserve watersheds, and enhance biodiversity through community-led interventions.",
    objectives: [
      "Restoration of degraded forest landscapes across Tripura",
      "Watershed and ecosystem conservation",
      "Biodiversity enhancement through native species",
      "Soil and moisture conservation works",
    ],
  },
  2: {
    paragraph:
      "Component 2 focuses on enhancing livelihoods of forest-dependent communities through value chain development, enterprise promotion, and market linkage support.",
    objectives: [
      "Strengthening community-based enterprises",
      "Value chain development for forest produce",
      "Support to Self Help Groups and FPOs",
      "Market linkage and enterprise promotion",
    ],
  },
  3: {
    paragraph:
      "Component 3 focuses on strengthening institutional capacity of the forest department and community institutions through training, knowledge management, and governance systems.",
    objectives: [
      "Capacity building of forest department staff",
      "Training of community institutions",
      "Knowledge management and documentation",
      "Governance and accountability systems",
    ],
  },
  4: {
    paragraph:
      "Component 4 covers overall project management including monitoring and evaluation, financial management, coordination with agencies, and grievance redressal.",
    objectives: [
      "Monitoring and evaluation framework",
      "Financial management and procurement",
      "Coordination with state and central agencies",
      "Grievance redressal and citizen engagement",
    ],
  },
};

export default function ComponentPage() {
  const { id } = useParams();
  const [data, setData] = useState<ApiProjectComponent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    fetchComponent(id).then((d) => {
      if (alive) {
        setData(d);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [id]);

  const stats = data
    ? [
        { label: data.stat1_label, value: data.stat1_value },
        { label: data.stat2_label, value: data.stat2_value },
        { label: data.stat3_label, value: data.stat3_value },
        { label: data.stat4_label, value: data.stat4_value },
      ].filter((s) => s.label || s.value)
    : [];

  const projects = data?.projects ?? [];

  return (
    <PageLayout>
      <PageHeader
        title={data ? `Component ${data.component_number}` : "Project Component"}
        subtitle={data?.name || ""}
        breadcrumb={["Home", "Project Components", data ? `Component ${data.component_number}` : ""]}
      />
      {/* Original subtitle was description — per request, name is now subtitle; description shown below as paragraph */}

      {loading && (
        <section className="py-10"><div className="gov-container"><p className="text-sm text-muted-foreground">Loading…</p></div></section>
      )}

      {data && (
        <>
          {(() => {
            const staticContent = COMPONENT_STATIC[data.component_number as 1 | 2 | 3 | 4];
            const paragraph = (data.description && data.description.trim()) || staticContent?.paragraph || "";
            const objectives = staticContent?.objectives || [];
            if (!paragraph && objectives.length === 0) return null;
            return (
              <section className="py-10 border-b border-border">
                <div className="gov-container space-y-6">
                  {paragraph && (
                    <p className="text-[15px] text-muted-foreground leading-relaxed max-w-4xl">
                      {paragraph}
                    </p>
                  )}
                  {objectives.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-primary mb-3">Objectives</h2>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {objectives.map((obj) => (
                          <div key={obj} className="flex items-start gap-2 bg-card border border-border rounded-lg p-3.5">
                            <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground leading-relaxed">{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          })()}
          <section className="bg-surface py-8 border-b border-border">
            <div className="gov-container">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-primary">Project Impact</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-md p-5 text-center shadow-card">
                    <div className="text-2xl font-bold text-primary mt-2">{s.value || "—"}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-10">
            <div className="gov-container">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No projects yet for this component.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p) => {
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
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusBadgeClass(p.status)}`}>
                              {statusLabel(p.status)}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-primary leading-snug">{p.title}</h3>
                          {p.subtitle && <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{p.subtitle}</p>}
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
              )}
            </div>
          </section>
        </>
      )}
    </PageLayout>
  );
}
