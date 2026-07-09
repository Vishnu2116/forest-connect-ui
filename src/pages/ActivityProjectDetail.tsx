import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Lightbox from "@/components/common/Lightbox";
import { fetchActivityProject, type ActivityProjectDetailResponse } from "@/lib/activities";
import { resolveImage } from "@/lib/projects";

export default function ActivityProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ActivityProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lbIndex, setLbIndex] = useState<number>(-1);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    fetchActivityProject(id).then((d) => {
      if (alive) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <PageHeader title="Loading…" breadcrumb={["Home", "Activities & Outputs"]} />
        <section className="py-10">
          <div className="gov-container">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (!data || !data.project) {
    return (
      <PageLayout>
        <PageHeader title="Not Found" breadcrumb={["Home", "Activities & Outputs"]} />
        <section className="py-10">
          <div className="gov-container text-center">
            <p className="text-muted-foreground">The requested project could not be found.</p>
            <Link to="/activities" className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:text-accent">
              <ArrowLeft className="h-4 w-4" /> Back to Activities
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const { project, paragraph, bullet_points, stats, images } = data;
  const bullets = Array.isArray(bullet_points) ? bullet_points.filter((b) => typeof b === "string" && b.trim()) : [];
  const statList = Array.isArray(stats) ? stats.filter((s) => s && (s.label || s.value)) : [];
  const imgList = Array.isArray(images) ? images : [];

  const lightboxImages = imgList.map((im) => ({
    src: resolveImage(im.image_path) || "",
    caption: im.caption || undefined,
  }));

  return (
    <PageLayout>
      <PageHeader title={project.title} breadcrumb={["Home", "Activities & Outputs", project.title]} />

      <section className="py-10">
        <div className="gov-container max-w-5xl">
          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Activities
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">{project.title}</h1>

          {imgList.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {imgList.map((im, i) => (
                  <button
                    key={im.id}
                    onClick={() => setLbIndex(i)}
                    className="relative border border-border rounded-md overflow-hidden bg-card hover:shadow-md transition group"
                  >
                    <img
                      src={resolveImage(im.image_path) || ""}
                      alt={im.caption || ""}
                      className="w-full aspect-square object-cover group-hover:scale-[1.02] transition"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {(paragraph || bullets.length > 0) && (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card space-y-6 mb-8">
              {paragraph && (
                <p className="text-[17px] text-foreground/90 leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              )}

              {bullets.length > 0 && (
                <div className={paragraph ? "pt-6 border-t border-border" : ""}>
                  <h2 className="text-lg font-semibold text-primary mb-4">Key Highlights</h2>
                  <div className="space-y-4">
                    {bullets.map((b, i) => (
                      <p key={i} className="text-[17px] text-foreground/90 leading-relaxed">
                        {b}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {statList.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {statList.map((s, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-md p-5 shadow-card"
                >
                  <div className={`p-2.5 rounded-lg w-fit ${i % 2 === 0 ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm font-medium text-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lbIndex >= 0 && (
        <Lightbox
          images={lightboxImages}
          index={lbIndex}
          onClose={() => setLbIndex(-1)}
          onIndexChange={setLbIndex}
        />
      )}
    </PageLayout>
  );
}
