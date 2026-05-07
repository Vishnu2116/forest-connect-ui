import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Activity, TrendingUp, Trees, Users, Briefcase, BarChart3 } from "lucide-react";

const outputs = [
  { icon: TrendingUp, label: "Livelihood Activities", value: "620+", note: "Across all 8 districts", color: "bg-primary/10 text-primary" },
  { icon: Users, label: "Households Benefited", value: "25,000+", note: "Community participation", color: "bg-accent/10 text-accent" },
  { icon: Briefcase, label: "SHG Members Engaged", value: "12,000+", note: "Value chain activities", color: "bg-primary/10 text-primary" },
  { icon: BarChart3, label: "Area Under Management", value: "18,500 Ha", note: "Landscape restoration", color: "bg-accent/10 text-accent" },
];

const activities = [
  { date: "Apr 2026", title: "Bamboo Value Chain Training — 500+ SHG members trained", desc: "Comprehensive skill-building on bamboo processing, product development and market linkages across Dhalai and Gomati.", icon: Briefcase },
  { date: "Mar 2026", title: "Community Enterprise Centres launched in 6 districts", desc: "Fully equipped livelihood centres enabling local communities to process and market high-value products.", icon: Activity },
  { date: "Feb 2026", title: "Stakeholder consultation on livelihood impact assessment", desc: "Review of Phase-I outcomes with community leaders, SHG heads and district-level officials.", icon: Users },
  { date: "Jan 2026", title: "Community landscape restoration — 2,400 hectares completed", desc: "Community-led restoration of degraded landscapes integrating livelihood-oriented species across 4 districts.", icon: Trees },
];

const activityAreas = [
  { title: "Value Chain Development", desc: "Bamboo, agar and broom-grass processing", icon: Briefcase },
  { title: "Community Institution Building", desc: "Strengthening SHGs, JFMCs and VLCs", icon: Users },
  { title: "Landscape Restoration", desc: "Community-led restoration with livelihood species", icon: Trees },
  { title: "Skill Development", desc: "Training for youth, women and leaders", icon: TrendingUp },
  { title: "Enterprise Support", desc: "Micro-enterprise and producer collectives", icon: Activity },
  { title: "Monitoring & Evaluation", desc: "Digital M&E for transparent tracking", icon: BarChart3 },
];

export default function Activities() {
  return (
    <PageLayout>
      <PageHeader title="Activities & Outputs" subtitle="Key programme activities and measurable outcomes" breadcrumb={["Home", "Activities & Outputs"]} />
      
      {/* Stats section */}
      <section className="bg-surface py-8 border-b border-border">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {outputs.map(o => (
              <div key={o.label} className="bg-card border border-border rounded-md p-5 shadow-card">
                <div className={`p-2.5 rounded-lg w-fit ${o.color}`}><o.icon className="h-5 w-5" /></div>
                <div className="mt-3 text-3xl font-bold text-primary">{o.value}</div>
                <div className="text-sm font-medium text-foreground">{o.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{o.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="gov-container">
          <h2 className="section-title mt-2 mb-8">Recent Activities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {activities.map(a => (
              <article key={a.title} className="bg-card border border-border rounded-md p-6 shadow-card hover:border-primary/40 transition">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-accent uppercase mb-1">{a.date}</div>
                    <h3 className="font-semibold text-primary leading-snug">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Key Activity Areas — Circular Cards */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-primary mb-6 text-center">Key Activity Areas</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {activityAreas.map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center group">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <item.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mt-4">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 max-w-[200px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
