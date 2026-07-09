import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import {
  // Activity,
  TrendingUp,
  // Trees,
  Users,
  Briefcase,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import {
  fetchActivityProjects,
  type ActivityProjectCard,
} from "@/lib/activities";
import { resolveImage } from "@/lib/projects";

const outputs = [
  {
    icon: TrendingUp,
    label: "Livelihood Activities",
    value: "620+",
    note: "Across all 8 districts",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    label: "Households Benefited",
    value: "25,000+",
    note: "Community participation",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Briefcase,
    label: "SHG Members Engaged",
    value: "12,000+",
    note: "Value chain activities",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BarChart3,
    label: "Area Under Management",
    value: "18,500 Ha",
    note: "Landscape restoration",
    color: "bg-accent/10 text-accent",
  },
];

/* Removed per request — commented out, do not delete:
   - Recent Activities hardcoded list (activities array)
   - Key Activity Areas wheel (activityAreas array + SVG diagram)
   - Community Participation / Capacity Building / Ecosystem Restoration / Livelihood Enhancement four-card grid
   - Expected Outputs & Outcomes section
*/

export default function Activities() {
  const [projects, setProjects] = useState<ActivityProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchActivityProjects().then((list) => {
      if (alive) {
        setProjects(list);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <PageLayout>
      <PageHeader
        title="Activities & Outputs"
        subtitle="Key project activities and measurable outcomes"
        breadcrumb={["Home", "Activities & Outputs"]}
      />

      {/* Stats section — unchanged */}
      <section className="bg-surface py-8 border-b border-border">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {outputs.map((o) => (
              <div
                key={o.label}
                className="bg-card border border-border rounded-md p-5 shadow-card"
              >
                <div className={`p-2.5 rounded-lg w-fit ${o.color}`}>
                  <o.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-3xl font-bold text-primary">
                  {o.value}
                </div>
                <div className="text-md font-medium text-foreground">
                  {o.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {o.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects — replaces old Recent Activities section */}
      <section className="py-10">
        <div className="gov-container">
          <h2 className="section-title mt-2 mb-8">Projects</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading projects…</p>
          ) : projects.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-sm">
              No project activities available yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => {
                const thumb = resolveImage(p.thumbnail_image_path);
                return (
                  <Link
                    key={p.id}
                    to={`/activities/projects/${p.id}`}
                    className="bg-card border border-border rounded-md shadow-card overflow-hidden hover:border-primary/40 hover:shadow-md transition group flex flex-col"
                  >
                    <div className="aspect-[16/10] bg-surface overflow-hidden">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-primary leading-snug group-hover:text-accent transition">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Implementation Areas — unchanged */}
      <section className="py-12 bg-surface border-t border-border">
        <div className="gov-container space-y-8">
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-card">
            <h3 className="text-lg font-bold text-primary mb-2">
              Implementation Areas
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              PROJECT ELEMENT is being implemented across all 8 districts of
              Tripura, with interventions tailored to the ecological,
              socio-economic and livelihood profile of each landscape.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              {[
                "West Tripura",
                "Sepahijala",
                "Khowai",
                "Gomati",
                "South Tripura",
                "Dhalai",
                "Unakoti",
                "North Tripura",
              ].map((d) => (
                <div
                  key={d}
                  className="px-3 py-2 bg-surface border border-border rounded text-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              to="/activities/reports"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition shadow-card"
            >
              For More Information
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/*
          Removed per request — commented out, do not delete:

          - Community Participation card
          - Capacity Building card
          - Ecosystem Restoration card
          - Livelihood Enhancement card
          - Expected Outputs & Outcomes section
          - Monitoring & Impact section
          */}
        </div>
      </section>
    </PageLayout>
  );
}
