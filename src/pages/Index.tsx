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

function UpdatesPanel({
  updatesTab,
  setUpdatesTab,
  t,
}: {
  updatesTab: "whatsnew" | "notifications" | "tenders";
  setUpdatesTab: (k: "whatsnew" | "notifications" | "tenders") => void;
  t: (k: string) => string;
}) {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden shadow-card h-full flex flex-col">
      <div className="grid grid-cols-3 border-b border-border bg-surface">
        {(
          [
            { key: "whatsnew", label: "What's New", icon: Bell },
            { key: "notifications", label: t("home.notifications"), icon: Calendar },
            { key: "tenders", label: t("home.tenders"), icon: Briefcase },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setUpdatesTab(tab.key)}
            className={`flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
              updatesTab === tab.key
                ? "border-accent text-primary bg-card"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 max-h-[460px] overflow-y-auto flex-1">
        {updatesTab === "whatsnew" && (
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li key={a.title} className="border-b border-border last:border-0 pb-3 last:pb-0 flex gap-3 items-start">
                <div className="bg-primary text-primary-foreground rounded-md text-center px-2.5 py-2 shrink-0 min-w-[60px]">
                  <div className="text-[10px] uppercase opacity-90 tracking-wide">
                    {a.date.split(" ")[1]} {a.date.split(" ")[2]}
                  </div>
                  <div className="text-base font-bold leading-none mt-0.5">{a.date.split(" ")[0]}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-accent/10 text-accent mb-1">
                    {a.tag}
                  </span>
                  <a href="#" className="text-sm font-semibold text-foreground hover:text-primary block leading-snug">
                    {a.title}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {announcementDescriptions[a.tag] ?? "Latest update from the ELEMENT programme."}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {updatesTab === "notifications" && (
          <ul className="space-y-3">
            {announcements
              .filter((a) => a.tag === "Notification" || a.tag === "Recruitment")
              .map((a) => (
                <li key={a.title} className="border-b border-border last:border-0 pb-2.5 last:pb-0">
                  <div className="text-[10px] font-semibold text-accent uppercase">{a.date}</div>
                  <a href="#" className="text-sm font-medium text-foreground hover:text-primary block mt-0.5">
                    {a.title}
                  </a>
                </li>
              ))}
            {events.map((e) => (
              <li key={e.title} className="border-b border-border last:border-0 pb-2.5 last:pb-0">
                <div className="text-[10px] font-semibold text-accent uppercase">{e.date}</div>
                <a href="#" className="text-sm font-medium text-foreground hover:text-primary block mt-0.5">
                  {e.title}
                </a>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {e.venue}
                </div>
              </li>
            ))}
          </ul>
        )}
        {updatesTab === "tenders" && (
          <ul className="space-y-3">
            {procurements.map((p) => (
              <li key={p.title} className="border-b border-border last:border-0 pb-2.5 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-accent uppercase">{p.date}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      p.status === "Open"
                        ? "bg-success/10 text-success"
                        : p.status === "Closing Soon"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <a href="#" className="text-sm font-medium text-foreground hover:text-primary block mt-0.5">
                  {p.title}
                </a>
                <div className="text-xs text-muted-foreground mt-0.5">Deadline: {p.deadline}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-3 border-t border-border bg-surface text-center">
        <Link
          to={
            updatesTab === "whatsnew"
              ? "/reports"
              : updatesTab === "notifications"
                ? "/knowledge-hub/notifications"
                : "/procurements/tenders"
          }
          className="text-xs font-semibold text-primary hover:text-accent inline-flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
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
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            {/* Column 1: Project Highlights */}
            <div className="bg-card border border-border rounded-xl shadow-card p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Trees className="h-5 w-5 text-accent" /> Project Highlights
                </h2>
                <Link to="/projects" className="text-xs text-primary hover:text-accent font-medium">
                  View all <ArrowRight className="inline h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4 flex-1">
                {projects.slice(0, 3).map((p) => (
                  <article key={p.title} className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-card hover:border-primary/40 transition">
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
            <div className="bg-card border border-border rounded-xl shadow-card p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-accent" /> Social Media
                </h2>
                <Link to="/media/social" className="text-xs text-primary hover:text-accent font-medium">
                  View all <ArrowRight className="inline h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4 flex-1">
                <div className="bg-background border border-border rounded-lg overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border bg-surface flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold">Facebook</span>
                  </div>
                  <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center text-muted-foreground text-xs">
                    Facebook embed placeholder
                  </div>
                </div>
                <div className="bg-background border border-border rounded-lg overflow-hidden">
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
            <div className="bg-card border border-border rounded-xl shadow-card p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" /> Knowledge Hub
                </h2>
                <Link to="/knowledge-hub/iec" className="text-xs text-primary hover:text-accent font-medium">
                  View all <ArrowRight className="inline h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4 flex-1">
                {knowledgeHubItems.slice(0, 3).map((k) => (
                  <article key={k.title} className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-card transition">
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
