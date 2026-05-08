import { useParams, Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Target, Users, MapPin, CheckCircle2, ArrowLeft, BarChart3, Calendar, Layers, Activity, TreePine, Sprout, Home, TrendingUp } from "lucide-react";
import galleryCommunity from "@/assets/projects/gallery-community.jpg";
import galleryBamboo from "@/assets/projects/gallery-bamboo.jpg";
import galleryLandscape from "@/assets/projects/gallery-landscape.jpg";
import galleryEcotourism from "@/assets/projects/gallery-ecotourism.jpg";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => slugify(p.title) === slug);

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

  const impactStats = [
    { label: "Area Covered", value: `${project.coverage}` },
    { label: "Households", value: project.beneficiaries.match(/[\d,]+/)?.[0] || "5,000+" },
    { label: "Status", value: project.status },
    { label: "Districts", value: "8" },
  ];

  const outcomes = [
    { icon: TrendingUp, text: "Improved household income through diversified livelihood sources" },
    { icon: Sprout, text: "Sustainable livelihood opportunities via high-value product chains" },
    { icon: TreePine, text: "Better natural resource management and landscape productivity" },
    { icon: Users, text: "Stronger community institutions and participatory governance" },
    { icon: BarChart3, text: "Enhanced market access and enterprise development" },
    { icon: Target, text: "Climate-resilient land management practices across districts" },
  ];

  const sidebarItems = [
    { icon: Target, label: "Objective", value: project.objective },
    { icon: Users, label: "Beneficiaries", value: project.beneficiaries },
    { icon: Calendar, label: "Timeline", value: "2024 — Ongoing" },
    { icon: MapPin, label: "Coverage", value: project.coverage },
    { icon: Layers, label: "Component", value: project.component || "General" },
    { icon: Activity, label: "Status", value: project.status },
  ];

  const galleryItems = [
    { caption: "Community Engagement", icon: Users },
    { caption: "Bamboo Livelihood Initiative", icon: Sprout },
    { caption: "Landscape Restoration Activity", icon: TreePine },
    { caption: "Eco-tourism Cluster", icon: Home },
  ];

  return (
    <PageLayout>
      <PageHeader
        title={project.title}
        subtitle={project.description}
        breadcrumb={["Home", "Projects", project.title]}
      >
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-white/20">{project.status}</span>
          {project.component && <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-white/20">{project.component}</span>}
        </div>
      </PageHeader>
      <section className="py-10">
        <div className="gov-container">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>

          {/* Main: Sidebar + Narrative */}
          <div className="grid lg:grid-cols-12 gap-8 mb-12">
            {/* LEFT: Compact sidebar metadata — wrapped in card */}
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

            {/* RIGHT: Narrative story area — wrapped in card */}
            <div className="lg:col-span-9">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
                <article className="prose-like space-y-10">
                  {/* About */}
                  <section>
                    <h3 className="text-xl font-bold text-primary mb-3">About the Project</h3>
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                    <p className="text-muted-foreground leading-relaxed mt-3">{project.objective}</p>
                  </section>

                  <hr className="border-border/60" />

                  {/* Key Activities */}
                  <section>
                    <h3 className="text-xl font-bold text-primary mb-4">Key Activities</h3>
                    <div className="space-y-2.5">
                      {project.activities.map((a) => (
                        <div key={a} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-1 shrink-0" />
                          <span className="text-sm text-muted-foreground leading-relaxed">{a}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr className="border-border/60" />

                  {/* Expected Outcomes — icon-based */}
                  <section>
                    <h3 className="text-xl font-bold text-primary mb-4">Expected Outcomes</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {outcomes.map((o) => (
                        <div key={o.text} className="flex items-start gap-3 p-3 rounded-lg bg-surface/60">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <o.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-snug">{o.text}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <hr className="border-border/60" />

                  {/* Community Impact */}
                  <section>
                    <h3 className="text-xl font-bold text-primary mb-3">Community Impact</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Direct beneficiaries include {project.beneficiaries.toLowerCase()}, with emphasis on tribal and marginalized households. Community-based institutions such as JFMCs and SHGs are being strengthened to ensure participatory planning and inclusive decision-making at the grassroots level.
                    </p>
                  </section>

                  <hr className="border-border/60" />

                  {/* Livelihood Opportunities */}
                  <section>
                    <h3 className="text-xl font-bold text-primary mb-3">Livelihood Opportunities</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The project promotes diversified income sources through high-value product chains including bamboo, agar, broom-grass, and non-timber forest products. Producer collectives and micro-enterprises are supported with market linkages, skill development, and working capital to ensure long-term economic sustainability.
                    </p>
                  </section>

                  <hr className="border-border/60" />

                  {/* Landscape Development */}
                  <section>
                    <h3 className="text-xl font-bold text-primary mb-3">Landscape Development Benefits</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Covering {project.coverage}, the landscape interventions focus on restoring degraded lands, improving soil health, enhancing water resources, and building ecological resilience. These efforts create a foundation for sustained agricultural productivity and environmental conservation across participating districts.
                    </p>
                  </section>
                </article>
              </div>
            </div>
          </div>

          {/* Impact Stats — label first, then value */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-primary">Impact & Insights</h3>
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

          {/* Gallery — premium placeholders */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Gallery</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div key={item.caption} className="relative bg-gradient-to-br from-primary/80 to-primary-light rounded-lg h-56 flex items-center justify-center text-primary-foreground overflow-hidden group">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <Camera className="h-4 w-4 opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export { slugify };
