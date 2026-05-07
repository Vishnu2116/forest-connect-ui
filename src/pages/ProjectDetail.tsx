import { useParams, Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Target, ListChecks, Users, MapPin, CheckCircle2, ArrowLeft, BarChart3, Calendar, Layers, Activity } from "lucide-react";

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
    { label: "Area Under Management", value: `${project.coverage}` },
    { label: "Households Benefited", value: project.beneficiaries.match(/[\d,]+/)?.[0] || "5,000+" },
    { label: "Status", value: project.status },
  ];

  const infoCards = [
    { icon: Target, title: "Objective", content: project.objective },
    { icon: Users, title: "Beneficiaries", content: project.beneficiaries },
    { icon: MapPin, title: "District Coverage", content: project.coverage },
    { icon: Calendar, title: "Timeline", content: "2024 — Ongoing" },
    { icon: Layers, title: "Component", content: project.component || "General" },
    { icon: Activity, title: "Status", content: project.status },
  ];

  return (
    <PageLayout>
      <PageHeader
        title={project.title}
        subtitle={project.component}
        breadcrumb={["Home", "Projects", project.title]}
      />
      <section className="py-10">
        <div className="gov-container">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>

          {/* Top: Banner + Summary */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-8 md:p-10 text-primary-foreground mb-8 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded bg-white/20">{project.status}</span>
              {project.component && <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded bg-white/20">{project.component}</span>}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">{project.title}</h2>
            <p className="text-sm md:text-base opacity-90 leading-relaxed max-w-3xl">{project.description}</p>
          </div>

          {/* Main Grid: Info cards (left) + Description (right) */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Left: Small info cards */}
            <div className="lg:col-span-1 grid grid-cols-2 gap-4 auto-rows-min">
              {infoCards.map((card) => (
                <div key={card.title} className="bg-card border border-border rounded-lg p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <card.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{card.title}</h4>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug">{card.content}</p>
                </div>
              ))}
            </div>

            {/* Right: Full description + Activities */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-bold text-primary mb-3">About this Project</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{project.description}</p>
                <h4 className="text-sm font-bold text-primary mb-2">Objective</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.objective}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <ListChecks className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-bold text-primary">Key Activities</h3>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {project.activities.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground bg-surface border border-border rounded-md p-3">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Impact / Insights section */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-bold text-primary">Impact & Insights</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {impactStats.map((s) => (
                <div key={s.label} className="bg-surface border border-border rounded-md p-5 text-center">
                  <div className="text-2xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-md p-4">
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Beneficiaries</h4>
                    <p className="text-sm text-muted-foreground">{project.beneficiaries}</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-md p-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Location / Coverage</h4>
                    <p className="text-sm text-muted-foreground">{project.coverage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card mt-6">
            <h3 className="text-lg font-bold text-primary mb-4">Gallery</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-gradient-to-br from-primary to-primary-light rounded-md h-32 flex items-center justify-center text-primary-foreground">
                  <p className="text-sm opacity-80">Project image {n}</p>
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
