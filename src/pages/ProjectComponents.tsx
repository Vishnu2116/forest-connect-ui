import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import {
  Trees,
  Leaf,
  Users,
  BarChart3,
  ArrowRight,
  Sprout,
  Mountain,
  Briefcase,
} from "lucide-react";
import { fetchComponents, type ApiProjectComponent } from "@/lib/projects";

const ICONS: Record<string, any> = {
  Trees,
  Leaf,
  Users,
  BarChart3,
  Sprout,
  Mountain,
  Briefcase,
};

const GRADIENTS = [
  "from-primary/30 to-primary-light/30",
  "from-success/30 to-primary/20",
  "from-accent/30 to-primary/20",
  "from-primary/30 to-accent/20",
];

export default function ProjectComponents() {
  const [items, setItems] = useState<ApiProjectComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchComponents().then((d) => {
      if (alive) {
        setItems(d);
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
        title="Project Components"
        subtitle="Explore the four core components of the Tripura PROJECT ELEMENT."
        breadcrumb={["Home", "Project Components"]}
      />
      <section className="py-10 md:py-14">
        <div className="gov-container">
          {loading && <p className="text-md text-muted-foreground">Loading…</p>}
          <div className="grid sm:grid-cols-2 gap-6">
            {items.map((c, i) => {
              const Icon = ICONS[c.icon_name || ""] || Trees;
              const gradient = GRADIENTS[i % GRADIENTS.length];
              return (
                <article
                  key={c.id}
                  className="bg-card border border-border rounded-md overflow-hidden flex flex-col hover:shadow-card transition"
                >
                  <div
                    className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                  >
                    <Icon className="h-12 w-12 text-primary" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[25px] font-bold uppercase tracking-wide text-accent">
                      {/* Original: {c.label} — replaced per request with numeric label */}
                      {`Component ${c.component_number}`}
                    </span>
                    <h3 className="text-lg font-bold text-primary mt-1 leading-snug">
                      {c.name}
                    </h3>
                    <p className="text-4xl text-muted-foreground mt-2 leading-relaxed flex-1">
                      {c.description}
                    </p>
                    <div className="mt-4">
                      <Link
                        to={`/components/${c.id}`}
                        className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold transition"
                      >
                        Explore Project Component{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
