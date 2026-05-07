import { useParams, Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Target, ListChecks, Users, MapPin, CheckCircle2, ArrowLeft, BarChart3, FileText, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const sideNavItems = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "objective", label: "Objective", icon: Target },
  { id: "activities", label: "Key Activities", icon: ListChecks },
  { id: "impact", label: "Impact & Coverage", icon: BarChart3 },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
];

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => slugify(p.title) === slug);
  const [activeSection, setActiveSection] = useState("overview");

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
        <div className="gov-container">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left: Navigation + Info cards */}
            <div className="lg:col-span-1 space-y-4">
              {/* Section Nav */}
              <div className="bg-card border border-border rounded-md overflow-hidden sticky top-24">
                <div className="px-4 py-3 border-b border-border bg-surface">
                  <h3 className="text-sm font-semibold text-primary">Sections</h3>
                </div>
                <nav className="p-2">
                  {sideNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded transition ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary font-semibold border-l-2 border-accent"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Info */}
              <div className="bg-card border border-border rounded-md p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Quick Info</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-success/10 text-success">{project.status}</span>
                  {project.component && <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{project.component}</span>}
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-semibold text-muted-foreground uppercase">Beneficiaries</div>
                      <p className="text-xs text-foreground">{project.beneficiaries}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] font-semibold text-muted-foreground uppercase">Coverage</div>
                      <p className="text-xs text-foreground">{project.coverage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Main content */}
            <div className="lg:col-span-3">
              {activeSection === "overview" && (
                <div className="bg-card border border-border rounded-md p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-primary mb-3">About this Project</h2>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  <div className="mt-6 grid sm:grid-cols-3 gap-4">
                    {impactStats.map((s) => (
                      <div key={s.label} className="bg-surface border border-border rounded-md p-4 text-center">
                        <div className="text-lg font-bold text-primary">{s.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "objective" && (
                <div className="bg-card border border-border rounded-md p-6 shadow-card">
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-accent mt-0.5 shrink-0" />
                    <div>
                      <h2 className="text-lg font-semibold text-primary mb-3">Objective</h2>
                      <p className="text-muted-foreground leading-relaxed">{project.objective}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "activities" && (
                <div className="bg-card border border-border rounded-md p-6 shadow-card">
                  <div className="flex items-start gap-3 mb-4">
                    <ListChecks className="h-6 w-6 text-accent mt-0.5 shrink-0" />
                    <h2 className="text-lg font-semibold text-primary">Key Activities</h2>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {project.activities.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground bg-surface border border-border rounded-md p-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSection === "impact" && (
                <div className="bg-card border border-border rounded-md p-6 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-6 w-6 text-accent" />
                    <h2 className="text-lg font-semibold text-primary">Impact & Coverage</h2>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {impactStats.map((s) => (
                      <div key={s.label} className="bg-surface border border-border rounded-md p-5 text-center">
                        <div className="text-2xl font-bold text-primary">{s.value}</div>
                        <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div className="bg-surface border border-border rounded-md p-4">
                      <div className="flex items-start gap-2">
                        <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-primary mb-1">Beneficiaries</h3>
                          <p className="text-sm text-muted-foreground">{project.beneficiaries}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface border border-border rounded-md p-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-primary mb-1">Location / Coverage</h3>
                          <p className="text-sm text-muted-foreground">{project.coverage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "gallery" && (
                <div className="bg-card border border-border rounded-md p-6 shadow-card">
                  <h2 className="text-lg font-semibold text-primary mb-4">Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="bg-gradient-to-br from-primary to-primary-light rounded-md h-40 flex items-center justify-center text-primary-foreground">
                        <p className="text-sm opacity-80">Project image {n}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export { slugify };
