import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Facebook, Twitter, Youtube } from "lucide-react";

const videos = [
  { id: "1", title: "ELEMENT Programme Overview" },
  { id: "2", title: "Community Plantation Drive" },
  { id: "3", title: "Bamboo Value Chain Stories" },
  { id: "4", title: "Eco-Tourism in Jampui Hills" },
  { id: "5", title: "Watershed Management Field Visit" },
  { id: "6", title: "Livelihood Transformation Voices" },
];

export function SocialMedia() {
  return (
    <PageLayout>
      <PageHeader
        title="Social Media"
        subtitle="Stay connected with the ELEMENT Programme and Tripura Forest Department on social media."
        breadcrumb={["Home", "Media", "Social Media"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Facebook */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
                <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">ELEMENT — Facebook</span>
                </div>
                <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  Facebook embed placeholder
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
                <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">Tripura Forest Department — Facebook</span>
                </div>
                <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  Facebook embed placeholder
                </div>
              </div>
            </div>
            {/* Right: Twitter */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
                <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">ELEMENT — Twitter / X</span>
                </div>
                <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  Twitter / X embed placeholder
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
                <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">Tripura Forest Department — Twitter / X</span>
                </div>
                <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  Twitter / X embed placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-surface border-t border-border">
        <div className="gov-container">
          <h2 className="section-title flex items-center gap-2 mb-6">
            <Youtube className="h-6 w-6 text-accent" /> YouTube Videos
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <div key={v.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition">
                <div className="aspect-video bg-muted/60 flex items-center justify-center text-muted-foreground text-sm">
                  YouTube embed placeholder
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground leading-snug mb-0">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 mb-0">ELEMENT Programme · Tripura</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export function Gallery() {
  const items = Array.from({ length: 12 }).map((_, i) => i + 1);
  return (
    <PageLayout>
      <PageHeader
        title="Gallery"
        subtitle="Photographs from ELEMENT Programme field activities, events and community engagements."
        breadcrumb={["Home", "Media", "Gallery"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((i) => (
              <div key={i} className="aspect-square bg-muted/50 border border-border rounded-md flex items-center justify-center text-xs text-muted-foreground">
                Photo {i}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export function MediaEvents() {
  const items = [
    { date: "10 May 2026", title: "World Bank Mission Visit — Agartala" },
    { date: "02 May 2026", title: "ELEMENT Stakeholder Workshop — Dhalai" },
    { date: "20 Apr 2026", title: "Community Plantation Drive — Gomati" },
    { date: "10 Apr 2026", title: "Bamboo Value Chain Mela — North Tripura" },
  ];
  return (
    <PageLayout>
      <PageHeader
        title="Events"
        subtitle="Upcoming and past events of the ELEMENT Programme."
        breadcrumb={["Home", "Media", "Events"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="space-y-4">
            {items.map((e) => (
              <article key={e.title} className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 hover:shadow-card transition flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-md text-center px-3 py-2.5 shrink-0 min-w-[72px]">
                  <div className="text-[11px] uppercase opacity-90 tracking-wide">{e.date.split(" ")[1]} {e.date.split(" ")[2]}</div>
                  <div className="text-xl font-bold leading-none mt-0.5">{e.date.split(" ")[0]}</div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground leading-snug mb-0">{e.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 mb-0">Programme event under ELEMENT.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
