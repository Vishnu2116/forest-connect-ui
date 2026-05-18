import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Trees, Leaf, Users, BarChart3, ArrowRight } from "lucide-react";

const components = [
  {
    slug: "component-1",
    number: "Project Component 1",
    name: "Landscape Management",
    description:
      "Restoring degraded landscapes, watershed management and climate-resilient interventions across Tripura.",
    icon: Trees,
    gradient: "from-primary/30 to-primary-light/30",
  },
  {
    slug: "component-2",
    number: "Component 2",
    name: "Biodiversity & Ecosystem Services",
    description:
      "Strengthening biodiversity conservation, community plantation drives and ecosystem services.",
    icon: Leaf,
    gradient: "from-success/30 to-primary/20",
  },
  {
    slug: "component-3",
    number: "Component 3",
    name: "Livelihood Development",
    description:
      "Developing sustainable value chains, enterprise support and community-led eco-tourism.",
    icon: Users,
    gradient: "from-accent/30 to-primary/20",
  },
  {
    slug: "component-4",
    number: "Component 4",
    name: "Project Management, Monitoring & Learning",
    description:
      "Project management, MIS/GIS, monitoring & evaluation, and knowledge dissemination.",
    icon: BarChart3,
    gradient: "from-primary/30 to-accent/20",
  },
];

export default function ProjectComponents() {
  return (
    <PageLayout>
      <PageHeader
        title="Project Components"
        subtitle="Explore the four core components of the Tripura PROJECT ELEMENT."
        breadcrumb={["Home", "Project Components"]}
      />
      <section className="py-10 md:py-14">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 gap-6">
            {components.map((c) => (
              <article
                key={c.slug}
                className="bg-card border border-border rounded-md overflow-hidden flex flex-col hover:shadow-card transition"
              >
                <div className={`h-32 bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
                  <c.icon className="h-12 w-12 text-primary" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-accent">
                    {c.number}
                  </span>
                  <h3 className="text-lg font-bold text-primary mt-1 leading-snug">{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">
                    {c.description}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/components/${c.slug}`}
                      className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold transition"
                    >
                      Explore Project Component <ArrowRight className="h-4 w-4" />
                    </Link>
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
