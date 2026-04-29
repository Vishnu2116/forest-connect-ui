import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Trees, Target, ListChecks, Users, MapPin, Layers, CheckCircle2 } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function Projects() {
  const { t } = useLang();
  return (
    <PageLayout>
      <PageHeader
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
        breadcrumb={["Home", "Projects"]}
      />
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

                  <div className="flex gap-2">
                    <ListChecks className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("projects.activities")}</div>
                      <ul className="mt-1 grid sm:grid-cols-2 gap-x-3 gap-y-1">
                        {p.activities.map((a) => (
                          <li key={a} className="flex items-start gap-1.5 text-xs text-foreground">
                            <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" /> {a}
                          </li>
                        ))}
                      </ul>
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
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
