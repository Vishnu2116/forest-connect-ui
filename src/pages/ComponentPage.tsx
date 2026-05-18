import { Link, useParams } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Trees, ArrowRight, BarChart3, TrendingUp, Home, Briefcase } from "lucide-react";
import { slugify } from "./ProjectDetail";

const impactStats = [
  { icon: TrendingUp, label: "Area Restored", value: "18,500 Ha", color: "text-primary" },
  { icon: Home, label: "Households Benefited", value: "25,000+", color: "text-accent" },
  { icon: Briefcase, label: "Livelihood Activities", value: "620+", color: "text-primary" },
  { icon: BarChart3, label: "Districts Covered", value: "8", color: "text-accent" },
];

const META: Record<string, { title: string; subtitle: string }> = {
  "component-1": {
    title: "Project Component 1 — Landscape Restoration & Climate Resilience",
    subtitle: "Restoring degraded landscapes, watershed management and climate-resilient interventions across Tripura.",
  },
  "component-2": {
    title: "Project Component 2 — Biodiversity & Ecosystem Conservation",
    subtitle: "Strengthening biodiversity conservation, community plantation drives and ecosystem services.",
  },
  "component-3": {
    title: "Project Component 3 — Livelihood Value Chains & Eco-Tourism",
    subtitle: "Developing sustainable value chains, enterprise support and community-led eco-tourism.",
  },
  "component-4": {
    title: "Project Component 4 — Project Management & Knowledge",
    subtitle: "Project management, MIS/GIS, monitoring & evaluation, and knowledge dissemination.",
  },
};

export default function ComponentPage() {
  const { slug = "component-1" } = useParams();
  const meta = META[slug] ?? META["component-1"];
  const labelMap: Record<string, string> = {
    "component-1": "Component 1",
    "component-2": "Component 2",
    "component-3": "Component 3",
    "component-4": "Component 4",
  };
  const wanted = labelMap[slug];
  const projectLabel = wanted ? `Project ${wanted}` : "Project Component";
  const filtered = projects.filter((p) => p.component === wanted);
  const items = filtered.length ? filtered : projects;

  return (
    <PageLayout>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        breadcrumb={["Home", "Project Components", projectLabel]}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <article key={p.title} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition flex flex-col">
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <Trees className="h-10 w-10 text-primary/30" />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-success/10 text-success">{p.status}</span>
                    {p.component && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{p.component}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-primary leading-snug">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{p.objective}</p>
                  <div className="mt-auto pt-4">
                    <Link
                      to={`/projects/${slugify(p.title)}`}
                      className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold transition"
                    >
                      Know More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
