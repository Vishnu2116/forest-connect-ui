import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { ArrowLeft } from "lucide-react";
import {
  fetchProject,
  resolveImage,
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
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <PageHeader title="Loading…" breadcrumb={["Home", "Projects"]} />
        <section className="py-10">
          <div className="gov-container">
            <p className="text-sm text-muted-foreground">Loading project…</p>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <PageHeader
          title="Project Not Found"
          breadcrumb={["Home", "Projects"]}
        />
        <section className="py-10">
          <div className="gov-container text-center">
            <p className="text-muted-foreground">
              The requested project could not be found.
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const thumb = resolveImage(project.thumbnail_image_path);
  const description = (project as any).description || project.about || "";
  const rawBullets = (project as any).bullet_points;
  const bullets: string[] = Array.isArray(rawBullets)
    ? rawBullets.filter((s: string) => typeof s === "string" && s.trim())
    : [];

  return (
    <PageLayout>
      <PageHeader
        title={project.title}
        breadcrumb={["Home", "Projects", project.title]}
      />
      {/* Removed from header (commented out — do not delete):
          subtitle, status badge, component badge */}

      <section className="py-10">
        <div className="gov-container max-w-4xl">
          <Link
            to={
              project.component?.id
                ? `/components/${project.component.id}`
                : "/projects"
            }
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>

          {thumb && (
            <div className="max-w-3xl mx-auto rounded-xl overflow-hidden mb-8 bg-surface border border-border shadow-card">
              <img
                src={thumb}
                alt={project.title}
                className="w-full h-auto max-h-[280px] object-cover mx-auto"
              />
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card space-y-6">
            {description && (
              <div>
                <h2 className="text-xl font-semibold text-primary mb-3">
                  About the Project
                </h2>
                <p className="text-[19px] text-foreground/90 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {bullets.length > 0 && (
              <div className={description ? "pt-6 border-t border-border" : ""}>
                <h2 className="text-xl font-semibold text-primary mb-4">
                  Key Highlights
                </h2>
                <div className="space-y-4">
                  {bullets.map((b, i) => (
                    <p
                      key={i}
                      className="text-[19px] text-foreground/90 leading-relaxed"
                    >
                      {b}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Removed sections — commented out, do not delete:
              sidebar (Objective, Beneficiaries, Timeline, Coverage, Component, Status),
              About the Project, Key Activities, Expected Outcomes, Community Impact,
              Livelihood Opportunities, Landscape Development Benefits,
              Impact & Insights stats (area covered, households, districts, status),
              Gallery section. */}
        </div>
      </section>
    </PageLayout>
  );
}
