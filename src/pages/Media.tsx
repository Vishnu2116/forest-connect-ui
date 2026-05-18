import { useParams, Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Facebook, Twitter, Youtube, ArrowRight, Calendar, MapPin, ArrowLeft } from "lucide-react";

const videos = [
  { id: "1", title: "PROJECT ELEMENT Overview" },
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
        subtitle="Stay connected with the PROJECT ELEMENT on social media."
        breadcrumb={["Home", "Media", "Social Media"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Facebook */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                <Facebook className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">ELEMENT — Facebook</span>
              </div>
              <div className="aspect-[4/5] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                Facebook iframe embed (ELEMENT)
              </div>
            </div>
            {/* Twitter / X */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                <Twitter className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">ELEMENT — Twitter / X</span>
              </div>
              <div className="aspect-[4/5] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                Twitter / X iframe embed (ELEMENT)
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
                  <p className="text-xs text-muted-foreground mt-1.5 mb-0">PROJECT ELEMENT · Tripura</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

/* ---- Events data (shared by Events list + Detail) ---- */
export const mediaEvents = [
  {
    slug: "world-bank-mission-visit-agartala",
    date: "10 May 2026",
    title: "World Bank Mission Visit — Agartala",
    venue: "Agartala, Tripura",
    description:
      "A high-level World Bank mission visited Agartala to review the progress of the PROJECT ELEMENT. The team met with the Chief Secretary, Forest Department leadership, and field implementation units to review livelihood, landscape and value-chain interventions.",
    images: [
      { aspect: "aspect-[4/3]", label: "Mission opening session" },
      { aspect: "aspect-square", label: "Field briefing" },
      { aspect: "aspect-[3/4]", label: "Community meeting" },
      { aspect: "aspect-[16/9]", label: "Group photograph" },
    ],
  },
  {
    slug: "element-stakeholder-workshop-dhalai",
    date: "02 May 2026",
    title: "ELEMENT Stakeholder Workshop — Dhalai",
    venue: "Dhalai District, Tripura",
    description:
      "A district-level workshop convened community institutions, line departments and partner agencies to align value-chain priorities, plantation calendars and capacity-building plans for the year.",
    images: [
      { aspect: "aspect-[3/4]", label: "Workshop inauguration" },
      { aspect: "aspect-[16/9]", label: "Group discussion" },
      { aspect: "aspect-square", label: "Stakeholder presentation" },
    ],
  },
  {
    slug: "community-plantation-drive-gomati",
    date: "20 Apr 2026",
    title: "Community Plantation Drive — Gomati",
    venue: "Gomati District, Tripura",
    description:
      "Hundreds of community members joined a coordinated plantation drive in Gomati district, planting livelihood-oriented species and undertaking soil & moisture conservation works.",
    images: [
      { aspect: "aspect-[16/9]", label: "Plantation in progress" },
      { aspect: "aspect-square", label: "Community participation" },
      { aspect: "aspect-[3/4]", label: "Saplings ready" },
      { aspect: "aspect-[4/3]", label: "Field officers on-site" },
    ],
  },
  {
    slug: "bamboo-value-chain-mela-north-tripura",
    date: "10 Apr 2026",
    title: "Bamboo Value Chain Mela — North Tripura",
    venue: "North Tripura District",
    description:
      "Artisans, FPOs and bamboo entrepreneurs showcased products, design innovations and market linkages under the ELEMENT value-chain initiative.",
    images: [
      { aspect: "aspect-square", label: "Bamboo handicrafts" },
      { aspect: "aspect-[4/3]", label: "Artisan stall" },
      { aspect: "aspect-[3/4]", label: "Mela visitors" },
    ],
  },
];

export function Gallery() {
  // Flatten all event images into a single uniform photo gallery
  const allImages = mediaEvents.flatMap((ev) =>
    ev.images.map((img, idx) => ({
      id: `${ev.slug}-${idx}`,
      label: img.label,
      event: ev.title,
    }))
  );

  return (
    <PageLayout>
      <PageHeader
        title="Gallery"
        subtitle="Photographs from PROJECT ELEMENT field activities, events and community engagements."
        breadcrumb={["Home", "Media", "Gallery"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {allImages.map((img) => (
              <div
                key={img.id}
                className="aspect-square rounded-lg overflow-hidden border border-border bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center text-[11px] text-muted-foreground text-center px-2"
                title={`${img.label} — ${img.event}`}
              >
                {img.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export function MediaEvents() {
  return (
    <PageLayout>
      <PageHeader
        title="Events"
        subtitle="Upcoming and past events of the PROJECT ELEMENT."
        breadcrumb={["Home", "Media", "Events"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaEvents.map((ev) => (
              <Link
                key={ev.slug}
                to={`/media/events/${ev.slug}`}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-card hover:border-primary/40 transition flex flex-col"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/15 to-primary-light/15 flex items-center justify-center text-xs text-muted-foreground">
                  Event cover
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[11px] text-accent font-semibold uppercase tracking-wide mb-2">
                    <Calendar className="h-3 w-3" /> {ev.date}
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-primary">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {ev.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    View details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export function MediaEventDetail() {
  const { slug } = useParams();
  const ev = mediaEvents.find((e) => e.slug === slug);

  if (!ev) {
    return (
      <PageLayout>
        <PageHeader title="Event not found" breadcrumb={["Home", "Media", "Events"]} />
        <section className="py-10">
          <div className="gov-container">
            <Link to="/media/events" className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all events
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={ev.title}
        subtitle={`${ev.date} · ${ev.venue}`}
        breadcrumb={["Home", "Media", "Events", ev.title]}
      />
      <section className="py-10">
        <div className="gov-container max-w-5xl">
          <Link to="/media/events" className="text-sm text-primary inline-flex items-center gap-1 hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to all events
          </Link>

          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3 text-xs text-accent font-semibold uppercase tracking-wide mb-3">
              <Calendar className="h-3.5 w-3.5" /> {ev.date}
              <span className="text-muted-foreground/60">·</span>
              <MapPin className="h-3.5 w-3.5" /> {ev.venue}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">{ev.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{ev.description}</p>

            <h2 className="text-base font-bold text-primary mt-8 mb-4">Event Gallery</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {ev.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`mb-4 break-inside-avoid rounded-lg overflow-hidden border border-border bg-gradient-to-br from-primary/10 to-primary-light/10 ${img.aspect} flex items-center justify-center text-xs text-muted-foreground`}
                >
                  {img.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
