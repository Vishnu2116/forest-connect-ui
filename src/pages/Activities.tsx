import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Activity, CheckCircle2, TrendingUp, Trees } from "lucide-react";

const outputs = [
  { icon: Trees, label: "Saplings Planted", value: "8.6L+", note: "FY 2025-26" },
  { icon: Activity, label: "Active Sites", value: "1,240+", note: "Across 35 districts" },
  { icon: CheckCircle2, label: "Patrols Conducted", value: "12,540", note: "Anti-poaching" },
  { icon: TrendingUp, label: "Forest Cover Growth", value: "+1.8%", note: "Year-on-year" },
];

const activities = [
  { date: "Apr 2026", title: "Statewide Forest Fire Mock Drill conducted", desc: "Coordinated drill across all 19 territorial divisions to enhance preparedness." },
  { date: "Mar 2026", title: "Capacity-building workshop for Range Officers", desc: "120 Range Officers trained on GIS-based forest monitoring." },
  { date: "Feb 2026", title: "Wildlife rescue operations — quarterly summary", desc: "62 successful rescues including elephants, leopards and reptiles." },
  { date: "Jan 2026", title: "Community Forest Resource (CFR) Title distribution", desc: "Recognition of community rights over forest resources in 38 villages." },
];

export default function Activities() {
  return (
    <PageLayout>
      <PageHeader title="Activities & Outputs" subtitle="Recent activities and key performance outputs" breadcrumb={["Home", "Activities & Outputs"]} />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {outputs.map(o => (
              <div key={o.label} className="bg-card border border-border rounded-md p-5 shadow-card">
                <div className="p-2 bg-primary/10 text-primary rounded w-fit"><o.icon className="h-5 w-5" /></div>
                <div className="mt-3 text-3xl font-bold text-primary">{o.value}</div>
                <div className="text-sm font-medium text-foreground">{o.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{o.note}</div>
              </div>
            ))}
          </div>

          <h2 className="section-title mt-12 mb-6">Recent Activities</h2>
          <ol className="relative border-l-2 border-accent/40 ml-3 space-y-6">
            {activities.map(a => (
              <li key={a.title} className="ml-6">
                <span className="absolute -left-2.5 h-5 w-5 rounded-full bg-accent border-4 border-background" />
                <div className="bg-card border border-border rounded-md p-5 shadow-card">
                  <div className="text-xs font-semibold text-accent">{a.date}</div>
                  <h3 className="font-semibold text-primary mt-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageLayout>
  );
}
