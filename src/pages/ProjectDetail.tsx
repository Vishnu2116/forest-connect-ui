import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import {
  Target, Users, MapPin, CheckCircle2, ArrowLeft, BarChart3, Calendar, Layers, Activity,
} from "lucide-react";
import {
  fetchProject,
  resolveImage,
  statusBadgeClass,
  statusLabel,
  slugify,
  type ApiProjectDetail,
} from "@/lib/projects";

export { slugify };

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ApiProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setLoading(true);
    fetchProject(slug).then((d) => {
      if (alive) {
        setProject(d);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <PageHeader title="Loading…" breadcrumb={["Home", "Projects"]} />
        <section className="py-10"><div className="gov-container"><p className="text-sm text-muted-foreground">Loading project…</p></div></section>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <PageHeader title="Project Not Found" breadcrumb={["Home", "Projects"]} />
        <section className="py-10">
          <div className="gov-container text-center">
            <p className="text-muted-foreground">The requested project could not be found.</p>
            <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:text-accent">
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const timeline = [project.timeline_start, project.timeline_end].filter(Boolean).join(" — ");

  const sidebarItems = [
    project.objective && { icon: Target, label: "Objective", value: project.objective },
    project.beneficiaries && { icon: Users, label: "Beneficiaries", value: project.beneficiaries },
    timeline && { icon: Calendar, label: "Timeline", value: timeline },
    project.coverage && { icon: MapPin, label: "Coverage", value: project.coverage },
    project.component?.label && { icon: Layers, label: "Component", value: project.component.label },
    project.status && { icon: Activity, label: "Status", value: statusLabel(project.status) },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  const impactStats = [
    project.area_covered && { label: "Area Covered", value: project.area_covered },
    project.households && { label: "Households", value: project.households },
    project.districts && { label: "Districts", value: project.districts },
    project.status && { label: "Status", value: statusLabel(project.status) },
  ].filter(Boolean) as { label: string; value: string }[];

  const gallery = project.gallery || [];

  return (
    <PageLayout>
      <PageHeader
        title={project.title}
        subtitle={project.subtitle || ""}
        breadcrumb={["Home", "Projects", project.title]}
      >
        <div className="flex items-center gap-2 mt-3">
          <span className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full ${statusBadgeClass(project.status)}`}>
            {statusLabel(project.status)}
          </span>
          {project.component?.label && (
            <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-white/20">{project.component.label}</span>
          )}
        </div>
      </PageHeader>

      <section className="py-10">
        <div className="gov-container">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 mb-12">
            <aside className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Project Details</h4>
                <div className="space-y-0">
                  {sidebarItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                      <item.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</div>
                        <div className="text-sm text-foreground leading-snug mt-0.5">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
                <article className="prose-like space-y-10">
                  {project.about && (
                    <section>
                      <h3 className="text-xl font-bold text-primary mb-3">About the Project</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.about}</p>
                    </section>
                  )}

                  {project.key_activities && project.key_activities.length > 0 && (
                    <>
                      <hr className="border-border/60" />
                      <section>
                        <h3 className="text-xl font-bold text-primary mb-4">Key Activities</h3>
                        <div className="space-y-2.5">
                          {project.key_activities.map((a, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="h-4 w-4 text-accent mt-1 shrink-0" />
                              <span className="text-sm text-muted-foreground leading-relaxed">{a}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    </>
                  )}

                  {project.expected_outcomes && project.expected_outcomes.length > 0 && (
                    <>
                      <hr className="border-border/60" />
                      <section>
                        <h3 className="text-xl font-bold text-primary mb-4">Expected Outcomes</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {project.expected_outcomes.map((o, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface/60">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm text-muted-foreground leading-snug">{o}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    </>
                  )}

                  {project.community_impact && (
                    <>
                      <hr className="border-border/60" />
                      <section>
                        <h3 className="text-xl font-bold text-primary mb-3">Community Impact</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.community_impact}</p>
                      </section>
                    </>
                  )}

                  {project.livelihood_opportunities && (
                    <>
                      <hr className="border-border/60" />
                      <section>
                        <h3 className="text-xl font-bold text-primary mb-3">Livelihood Opportunities</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.livelihood_opportunities}</p>
                      </section>
                    </>
                  )}

                  {project.landscape_development_benefits && (
                    <>
                      <hr className="border-border/60" />
                      <section>
                        <h3 className="text-xl font-bold text-primary mb-3">Landscape Development Benefits</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.landscape_development_benefits}</p>
                      </section>
                    </>
                  )}
                </article>
              </div>
            </div>
          </div>

          {impactStats.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-bold text-primary">Impact &amp; Insights</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {impactStats.map((s) => (
                  <div key={s.label} className="bg-surface rounded-lg p-4 text-center">
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-1">{s.label}</div>
                    <div className="text-lg md:text-xl font-bold text-primary leading-snug">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gallery.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Gallery</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((g) => {
                  const src = resolveImage(g.image_path);
                  return (
                    <div key={g.id} className="relative rounded-lg h-56 overflow-hidden group">
                      {src && (
                        <img
                          src={src}
                          alt={g.caption || ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}
                      {g.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">{g.caption}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
