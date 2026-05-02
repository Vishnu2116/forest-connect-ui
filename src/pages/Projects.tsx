import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Trees, Target, Users, MapPin, ArrowRight, BarChart3, TrendingUp, Home, Briefcase } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { slugify } from "./ProjectDetail";

const impactStats = [
  { icon: TrendingUp, label: "Area Restored", value: "18,500 Ha", color: "text-primary" },
  { icon: Home, label: "Households Benefited", value: "25,000+", color: "text-accent" },
  { icon: Briefcase, label: "Livelihood Activities", value: "620+", color: "text-primary" },
  { icon: BarChart3, label: "Districts Covered", value: "8", color: "text-accent" },
];

export default function Projects() {
  const { t } = useLang();
  return (
    <PageLayout>
      <PageHeader
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
        breadcrumb={["Home", "Projects"]}
      />

      {/* Impact Stats */}
      <section className="bg-surface py-8 border-b border-border">
        <div className="gov-container">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-primary">Programme Impact</h2>
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
          <div className="grid lg:grid-cols-2 gap-6">
            {projects.map((p) => (
              <article key={p.title} className="bg-card border border-border rounded-lg p-6 hover:shadow-card transition flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2.5 rounded bg-primary/10 text-primary shrink-0"><Trees className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-success/10 text-success">{p.status}</span>
                      {p.component && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{p.component}</span>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-primary leading-snug">{p.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Target className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("projects.objective")}</div>
                      <p className="text-foreground">{p.objective}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div className="flex gap-2">
                      <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-muted-foreground">{t("projects.beneficiaries")}</div>
                        <p className="text-xs text-foreground">{p.beneficiaries}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-muted-foreground">{t("projects.location")}</div>
                        <p className="text-xs text-foreground">{p.coverage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <Link
                    to={`/projects/${slugify(p.title)}`}
                    className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold transition"
                  >
                    Know More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
