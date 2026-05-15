import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Calendar,
  ArrowRight,
  MapPin,
  Bell,
  Trees,
  Award,
  BookOpen,
  User,
  TrendingUp,
  Briefcase,
  Mountain,
  Handshake,
  Facebook,
  Twitter,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import HeroSlider from "@/components/home/HeroSlider";
import {
  announcements,
  events,
  projects,
  knowledgeHubItems,
  procurements,
} from "@/data/content";
import { useLang } from "@/contexts/LanguageContext";
import { slugify } from "./ProjectDetail";

import cmImage from "@/assets/dignitaries/CM.jpeg";
import Animesh from "@/assets/dignitaries/Animesh.jpeg";
import CS from "@/assets/dignitaries/CS.jpg";
import Honnareddy from "@/assets/dignitaries/Honnareddy.jpeg";
import SanjibDas from "@/assets/dignitaries/SanjibDas.png";

const announcementDescriptions: Record<string, string> = {
  Recruitment: "Applications invited for ELEMENT programme positions.",
  Tender: "Sealed tenders for livelihood infrastructure and civil works.",
  Event: "Community engagement and stakeholder events.",
  Notification: "Programme guidelines and circulars issued.",
  Report: "Progress reports published for public reference.",
};

const pillars = [
  {
    icon: Briefcase,
    label: "Livelihood Generation",
    stat: "620+",
    statLabel: "Activities",
    desc: "Sustainable income through value chains & enterprise",
    gradient: "from-primary to-primary-light",
  },
  {
    icon: TrendingUp,
    label: "Economic Transformation",
    stat: "₹45 Cr+",
    statLabel: "Investment",
    desc: "Boosting rural economy across all 8 districts",
    gradient: "from-accent to-accent-hover",
  },
  {
    icon: Mountain,
    label: "Landscape Restoration",
    stat: "18,500",
    statLabel: "Hectares",
    desc: "Restoring degraded lands for productive use",
    gradient: "from-primary to-primary-light",
  },
  {
    icon: Handshake,
    label: "Community Development",
    stat: "25,000+",
    statLabel: "Households",
    desc: "Empowering communities through participation",
    gradient: "from-accent to-accent-hover",
  },
];

const leftDignitaries = [
  { name: "Shri Manik Saha", designation: "Hon'ble Chief Minister", desc: "Government of Tripura", image: cmImage },
  { name: "Shri Animesh Debbarma", designation: "Forest & Environment Minister", desc: "Government of Tripura", image: Animesh },
];

const rightDignitaries = [
  { name: "PCCF HOFF", designation: "SFDA Chair Person", desc: "Tripura Forest Department", image: "" },
  { name: "Shri Chaitanya Murti, IFS", designation: "PCCF CEO / PD", desc: "ELEMENT Project", image: "" },
];

function DignitaryCard({ d }: { d: { name: string; designation: string; desc: string; image: string } }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md hover:border-primary/30 transition group h-full flex flex-col">
      <div className="mx-auto aspect-square w-full max-w-[180px] rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground mb-3 overflow-hidden shadow-sm">
        {d.image ? (
          <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
        ) : (
          <User className="h-12 w-12" />
        )}
      </div>
      <h4 className="text-sm font-bold text-foreground leading-snug">{d.name}</h4>
      <p className="text-xs text-primary font-semibold mt-1">{d.designation}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{d.desc}</p>
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const [updatesTab, setUpdatesTab] = useState<"whatsnew" | "notifications" | "tenders">("whatsnew");

  return (
    <PageLayout>
      <HeroSlider />

      {/* Welcome to Tripura ELEMENT Project — left/right dignitaries + center tabs */}
      <section className="py-12 md:py-16 bg-surface border-b border-border">
        <div className="gov-container">
          <div className="text-center mb-8">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Welcome to Tripura ELEMENT Project</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Senior leaders and dignitaries guiding the ELEMENT programme.
            </p>
          </div>

          {/* Mobile: dignitaries first, then center tabs */}
          <div className="lg:hidden space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {leftDignitaries.map((d) => <DignitaryCard key={d.name} d={d} />)}
              {rightDignitaries.map((d) => <DignitaryCard key={d.name} d={d} />)}
            </div>
            <UpdatesPanel updatesTab={updatesTab} setUpdatesTab={setUpdatesTab} t={t} />
          </div>

          {/* Desktop: 3-column layout */}
          <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-6 items-stretch">
            <div className="grid grid-cols-1 gap-4">
              {leftDignitaries.map((d) => <DignitaryCard key={d.name} d={d} />)}
            </div>
            <UpdatesPanel updatesTab={updatesTab} setUpdatesTab={setUpdatesTab} t={t} />
            <div className="grid grid-cols-1 gap-4">
              {rightDignitaries.map((d) => <DignitaryCard key={d.name} d={d} />)}
            </div>
          </div>
        </div>
      </section>

      {/* What is ELEMENT? */}
      <section className="py-14 md:py-18 bg-background">
        <div className="gov-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              About the Programme
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight mt-3 mb-5">What is ELEMENT?</h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-2xl mx-auto mb-6">
              A flagship initiative of the Government of Tripura and the World Bank — transforming livelihoods, landscapes, and communities across all 8 districts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 pb-3">
            {pillars.map((p) => (
              <div key={p.label} className="relative bg-card border border-border rounded-xl p-6 text-center shadow-card hover:shadow-lg transition-shadow group overflow-hidden">
                <div className={`mx-auto h-16 w-16 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <p.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-3xl font-extrabold text-primary">{p.stat}</div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">{p.statLabel}</div>
                <h4 className="text-base font-bold text-foreground mt-3">{p.label}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/about" className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded font-semibold text-sm focus-ring">
              Learn more about ELEMENT <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Three-column information section */}
      <section className="py-14 md:py-18 bg-surface border-t border-border">
        <div className="gov-container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Column 1: Project Highlights */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Trees className="h-5 w-5 text-accent" /> Project Highlights
                </h2>
                <Link to="/projects" className="text-xs text-primary hover:text-accent font-medium">
                  View all <ArrowRight className="inline h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {projects.slice(0, 3).map((p) => (
                  <article key={p.title} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card hover:border-primary/40 transition">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Trees className="h-10 w-10 text-primary/30" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-success/10 text-success">{p.status}</span>
                        {p.component && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{p.component}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-primary leading-snug mb-0">{p.title}</h3>
                      <Link to={`/projects/${slugify(p.title)}`} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover">
                        Know More <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Column 2: Social Media */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-accent" /> Social Media
                </h2>
                <Link to="/media/social" className="text-xs text-primary hover:text-accent font-medium">
                  View all <ArrowRight className="inline h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
                  <div className="px-4 py-2.5 border-b border-border bg-surface flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold">Facebook</span>
                  </div>
                  <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center text-muted-foreground text-xs">
                    Facebook embed placeholder
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
                  <div className="px-4 py-2.5 border-b border-border bg-surface flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold">Twitter / X</span>
                  </div>
                  <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center text-muted-foreground text-xs">
                    Twitter / X embed placeholder
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Knowledge Hub */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" /> Knowledge Hub
                </h2>
                <Link to="/knowledge-hub/iec" className="text-xs text-primary hover:text-accent font-medium">
                  View all <ArrowRight className="inline h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {knowledgeHubItems.slice(0, 3).map((k) => (
                  <article key={k.title} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition">
                    <div className="h-24 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary-foreground/80" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">{k.category}</span>
                      <h3 className="text-sm font-semibold text-foreground mt-1 leading-snug mb-0">{k.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 mb-0">{k.date}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
