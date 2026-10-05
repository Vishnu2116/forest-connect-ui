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
  TreePine,
  Cloud,
  ShieldCheck,
} from "lucide-react";
import {
  fetchActivityProjects,
  type ActivityProjectCard,
} from "@/lib/activities";
import { resolveImage } from "@/lib/projects";

// const outputs = [
//   {
//     icon: TrendingUp,
//     label: "Livelihood Activities",
//     value: "620+",
//     note: "Across all 8 districts",
//     color: "bg-primary/10 text-primary",
//   },
//   {
//     icon: Users,
//     label: "Households Benefited",
//     value: "25,000+",
//     note: "Community participation",
//     color: "bg-accent/10 text-accent",
//   },
//   {
//     icon: Briefcase,
//     label: "SHG Members Engaged",
//     value: "12,000+",
//     note: "Value chain activities",
//     color: "bg-primary/10 text-primary",
//   },
//   {
//     icon: BarChart3,
//     label: "Area Under Management",
//     value: "18,500 Ha",
//     note: "Landscape restoration",
//     color: "bg-accent/10 text-accent",
//   },
// ];

const outputs = [
  {
    code: "PDO1",
    icon: TreePine,
    value: "41,700",
    unit: "hectares (Ha)",
    label:
      "Terrestrial and aquatic areas under enhanced conservation and management (CRI)",
    color: "bg-primary/10 text-primary",
    bar: "border-t-primary",
  },
  {
    code: "PDO2",
    icon: Cloud,
    value: "13,65,538",
    unit: "tCO₂e (tonnes of carbon dioxide equivalent)",
    label: "Net GHG emissions (CRI)",
    color: "bg-accent/10 text-accent",
    bar: "border-t-accent",
  },
  {
    code: "PDO3",
    icon: Users,
    value: "75,000",
    unit: "number of people",
    label:
      "People with increased benefits from landscape-based value chains (disaggregated by gender)",
    color: "bg-primary/10 text-primary",
    bar: "border-t-primary",
    breakdown: [
      { label: "Women", value: "37,500" },
      { label: "Men", value: "37,500" },
    ],
  },
  {
    code: "PDO4",
    icon: Briefcase,
    value: "37,500",
    unit: "number of jobs",
    label: "New or better jobs (disaggregated by gender, youth) (CRI)",
    color: "bg-accent/10 text-accent",
    bar: "border-t-accent",
    breakdown: [
      { label: "Women", value: "12,750" },
      { label: "Men", value: "12,375" },
      { label: "Youth", value: "12,375" },
    ],
  },
  {
    code: "PDO5",
    icon: ShieldCheck,
    value: "4,50,000",
    unit: "number of people",
    label: "People with enhanced resilience to climate risks (CRI)",
    color: "bg-primary/10 text-primary",
    bar: "border-t-primary",
    breakdown: [
      { label: "Direct beneficiaries", value: "65,000" },
      { label: "Indirect beneficiaries", value: "3,85,000" },
    ],
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
        subtitle="Key project activities and outputs"
        breadcrumb={["Home", "Activities & Outputs"]}
      />

      {/* Stats section — unchanged
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
      </section> */}
      {/* Project targets */}
      <section className="relative overflow-hidden bg-surface py-10 border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, hsl(var(--primary) / 0.1) 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl" />
        </div>
        <div className="gov-container relative z-10">
          <h2 className="section-title mb-2">Project Targets</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Target values to be achieved by the end of the project for the
            Project Development Objective (PDO) indicators.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5">
            {outputs.map((o, i) => (
              <div
                key={o.code}
                className={`relative overflow-hidden bg-card border border-border border-t-4 ${o.bar} rounded-md p-5 shadow-card hover:shadow-md hover:-translate-y-0.5 transition ${
                  i < 3 ? "lg:col-span-2" : "lg:col-span-3"
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full ${
                    o.bar === "border-t-primary"
                      ? "bg-primary/[0.08]"
                      : "bg-accent/[0.08]"
                  }`}
                />
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full ${
                    o.bar === "border-t-primary"
                      ? "bg-primary/[0.05]"
                      : "bg-accent/[0.05]"
                  }`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg w-fit ${o.color}`}>
                      <o.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.color}`}
                    >
                      {o.code}
                    </span>
                  </div>
                  <div className="mt-4 text-4xl font-bold text-primary leading-none">
                    {o.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {o.unit}
                  </div>
                  <div className="mt-3 text-sm font-medium text-foreground">
                    {o.label}
                  </div>
                  {o.breakdown?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {o.breakdown.map((b) => (
                        <span
                          key={b.label}
                          className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-foreground"
                        >
                          {b.label}:{" "}
                          <span className="font-semibold">{b.value}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects — replaces old Recent Activities section */}
      {/* <section className="py-10">
        <div className="gov-container">
          <h2 className="section-title mt-2 mb-8">Activities</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading activities…</p>
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
      </section> */}

      {/* Implementation Areas — unchanged */}
      <section className="py-12 bg-surface border-t border-border">
        <div className="gov-container space-y-8">
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-card">
            <h3 className="text-lg font-bold text-primary mb-2">
              Implementation Areas
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              ELEMENT Project is being implemented across all 8 districts of
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
        </div>
      </section>
    </PageLayout>
  );
}
