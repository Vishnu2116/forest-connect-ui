import { Link } from "react-router-dom";
import { Calendar, ArrowRight, FileText, MapPin, Users, BookOpen, Bell, Trees, Award } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import HeroSlider from "@/components/home/HeroSlider";
import MapPreview from "@/components/common/MapPreview";
import { announcements, events, projects, knowledgeHubItems } from "@/data/content";

const dignitaries = [
  { name: "Hon'ble Governor", role: "Government of Tripura" },
  { name: "Hon'ble Chief Minister", role: "Government of Tripura" },
  { name: "Hon'ble Forest Minister", role: "Department of Forests" },
  { name: "PCCF & HoFF", role: "Tripura Forest Department" },
];

export default function Home() {
  return (
    <PageLayout>
      <HeroSlider />

      {/* Quick services strip */}
      <section className="bg-surface border-b border-border">
        <div className="gov-container py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: FileText, label: "Reports", to: "/reports" },
            { icon: MapPin, label: "Plantation Map", to: "/plantation-map" },
            { icon: Users, label: "Who's Who", to: "/whos-who" },
            { icon: BookOpen, label: "Knowledge Hub", to: "/knowledge-hub/iec" },
          ].map((s) => (
            <Link key={s.label} to={s.to} className="flex items-center gap-3 bg-card border border-border rounded-md px-4 py-3 hover:border-primary hover:shadow-card transition focus-ring">
              <div className="p-2 bg-primary/10 text-primary rounded"><s.icon className="h-5 w-5" /></div>
              <div className="font-medium text-sm">{s.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* What's New + Events */}
      <section className="py-12">
        <div className="gov-container grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title flex items-center gap-2"><Bell className="h-6 w-6 text-accent" /> What's New</h2>
              <Link to="/reports" className="text-sm text-primary hover:text-accent font-medium">View all <ArrowRight className="inline h-4 w-4" /></Link>
            </div>
            <div className="space-y-3">
              {announcements.map((a) => (
                <article key={a.title} className="bg-card border border-border rounded-md p-4 hover:border-primary/40 hover:shadow-card transition flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded text-center px-3 py-2 shrink-0 min-w-[68px]">
                    <div className="text-[10px] uppercase opacity-90">{a.date.split(" ")[1]} {a.date.split(" ")[2]}</div>
                    <div className="text-xl font-bold leading-none">{a.date.split(" ")[0]}</div>
                  </div>
                  <div className="flex-1">
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-accent/10 text-accent mb-1">{a.tag}</span>
                    <h3 className="text-sm md:text-base font-semibold text-foreground hover:text-primary"><a href="#">{a.title}</a></h3>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title flex items-center gap-2"><Calendar className="h-6 w-6 text-accent" /> Upcoming Events</h2>
            </div>
            <div className="space-y-3">
              {events.map((e) => (
                <article key={e.title} className="bg-card border border-border rounded-md p-4 hover:shadow-card transition">
                  <div className="text-xs font-semibold text-accent">{e.date}</div>
                  <h3 className="text-sm font-semibold mt-1">{e.title}</h3>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.venue}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dignitaries */}
      <section className="bg-surface py-12">
        <div className="gov-container">
          <h2 className="section-title mb-8">Our Leadership</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dignitaries.map((d) => (
              <div key={d.name} className="bg-card border border-border rounded-md p-5 text-center hover:shadow-card transition">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground text-3xl font-bold">
                  {d.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                </div>
                <h3 className="mt-4 font-semibold text-sm text-primary">{d.name}</h3>
                <p className="text-xs text-muted-foreground">{d.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project highlights */}
      <section className="py-12">
        <div className="gov-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-2"><Trees className="h-6 w-6 text-accent" /> Project Highlights</h2>
            <Link to="/projects" className="text-sm text-primary hover:text-accent font-medium">All Projects <ArrowRight className="inline h-4 w-4" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p) => (
              <article key={p.title} className="bg-card border border-border rounded-md p-6 hover:shadow-card hover:border-primary/40 transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-success/10 text-success">{p.status}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">{p.coverage}</span>
                </div>
                <h3 className="text-lg font-semibold text-primary">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
                <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover">Read more <ArrowRight className="h-4 w-4" /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Map preview */}
      <section className="bg-surface py-12">
        <div className="gov-container grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MapPreview />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="section-title">Plantation Across Tripura</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Track plantation activities across all 8 districts of Tripura. Filter by year, district and species. Built to integrate with Bhuvan, Google Maps and ESRI base layers.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[["620+", "Sites"], ["4.2L", "Saplings"], ["8", "Districts"]].map(([n, l]) => (
                <div key={l as string} className="bg-card border border-border rounded p-3 text-center">
                  <dt className="text-2xl font-bold text-primary">{n}</dt>
                  <dd className="text-xs text-muted-foreground mt-1">{l}</dd>
                </div>
              ))}
            </dl>
            <Link to="/plantation-map" className="mt-6 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold focus-ring w-fit">
              Open Full Map <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge hub preview */}
      <section className="py-12">
        <div className="gov-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title flex items-center gap-2"><Award className="h-6 w-6 text-accent" /> Knowledge Hub</h2>
            <Link to="/knowledge-hub/iec" className="text-sm text-primary hover:text-accent font-medium">Browse all <ArrowRight className="inline h-4 w-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {knowledgeHubItems.slice(0, 4).map((k) => (
              <article key={k.title} className="bg-card border border-border rounded-md overflow-hidden hover:shadow-card transition">
                <div className="h-28 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary-foreground/80" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">{k.category}</span>
                  <h3 className="text-sm font-semibold mt-1 leading-snug">{k.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2">{k.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
