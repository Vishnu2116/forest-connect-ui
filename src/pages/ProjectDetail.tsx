import { useParams, Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Target, ListChecks, Users, MapPin, CheckCircle2, ArrowLeft, BarChart3 } from "lucide-react";

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

  return (
    <PageLayout>
      <PageHeader
        title={project.title}
        subtitle={project.component}
        breadcrumb={["Home", "Projects", project.title]}
      />
      <section className="py-10">
        <div className="gov-container max-w-4xl">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>

          <div className="space-y-6">
            {/* Status badges */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded bg-success/10 text-success">{project.status}</span>
              {project.component && <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded bg-accent/10 text-accent">{project.component}</span>}
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-md p-6 shadow-card">
              <h2 className="text-lg font-semibold text-primary mb-3">About this Project</h2>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Objective */}
            <div className="bg-card border border-border rounded-md p-6 shadow-card">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">Objective</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.objective}</p>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="bg-card border border-border rounded-md p-6 shadow-card">
              <div className="flex items-start gap-3">
                <ListChecks className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-3">Key Activities</h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {project.activities.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-surface border border-border rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-primary">Impact & Coverage</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {impactStats.map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-md p-4 text-center">
                    <div className="text-lg font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficiaries & Location */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-card border border-border rounded-md p-5 shadow-card">
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Beneficiaries</h3>
                    <p className="text-sm text-muted-foreground">{project.beneficiaries}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-md p-5 shadow-card">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Location / Coverage</h3>
                    <p className="text-sm text-muted-foreground">{project.coverage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image placeholder */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-md h-48 flex items-center justify-center text-primary-foreground">
              <p className="text-sm opacity-80">Project images will be displayed here</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export { slugify };
