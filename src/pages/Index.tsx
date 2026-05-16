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
  FileText,
  UserCheck,
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
    <div className="bg-card border border-border rounded-md overflow-hidden hover:border-primary/40 transition h-full flex flex-col">
      <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground overflow-hidden border-b border-border">
        {d.image ? (
          <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
        ) : (
          <User className="h-12 w-12" />
        )}
      </div>
      <div className="px-3 py-3 text-center border-t-2 border-accent flex-1 flex flex-col justify-center">
        <h4 className="text-base font-bold text-foreground leading-tight">{d.name}</h4>
        <p className="text-sm text-primary font-semibold mt-1 leading-tight">{d.designation}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-tight">{d.desc}</p>
      </div>
    </div>
  );
}

function getUpdateIcon(tag: string) {
  switch (tag) {
    case "Recruitment":
      return UserCheck;
    case "Tender":
      return FileText;
    case "Event":
      return Calendar;
    case "Notification":
      return Bell;
    case "Report":
      return FileText;
    default:
      return Bell;
  }
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
    <div className="bg-card border border-border rounded-md overflow-hidden h-full flex flex-col">
      <div className="grid grid-cols-3 border-b-2 border-primary bg-primary/5">
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
            className={`flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-semibold border-r border-border last:border-r-0 transition relative ${
              updatesTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-primary/10"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border min-h-0">
        {updatesTab === "whatsnew" &&
          announcements.map((a) => {
            const Icon = getUpdateIcon(a.tag);
            return (
              <article key={a.title} className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition">
                <div className="shrink-0 text-primary self-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent mb-1">
                    {a.tag}
                  </span>
                  <a href="#" className="text-sm font-semibold text-foreground hover:text-primary block leading-snug">
                    {a.title}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {announcementDescriptions[a.tag] ?? "Latest update from the ELEMENT programme."}
                  </p>
                </div>
              </article>
            );
          })}
        {updatesTab === "notifications" && (
          <>
            {announcements
              .filter((a) => a.tag === "Notification" || a.tag === "Recruitment")
              .map((a) => {
                const Icon = getUpdateIcon(a.tag);
                return (
                  <article key={a.title} className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition">
                    <div className="shrink-0 text-primary self-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent mb-1">
                        {a.tag}
                      </span>
                      <a href="#" className="text-sm font-semibold text-foreground hover:text-primary block leading-snug">
                        {a.title}
                      </a>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {announcementDescriptions[a.tag] ?? "Official notification issued by the ELEMENT programme."}
                      </p>
                    </div>
                  </article>
                );
              })}
            {events.map((e) => (
              <article key={e.title} className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition">
                <div className="shrink-0 text-primary self-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent mb-1">
                    Event
                  </span>
                  <a href="#" className="text-sm font-semibold text-foreground hover:text-primary block leading-snug">
                    {e.title}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {e.venue}
                  </p>
                </div>
              </article>
            ))}
          </>
        )}
        {updatesTab === "tenders" &&
          procurements.map((p) => (
            <article key={p.title} className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition">
              <div className="shrink-0 text-primary self-center">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
                    Tender
                  </span>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm ${
                      p.status === "Open"
                        ? "bg-success/15 text-success"
                        : p.status === "Closing Soon"
                          ? "bg-accent/15 text-accent"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <a href="#" className="text-sm font-semibold text-foreground hover:text-primary block leading-snug">
                  {p.title}
                </a>
                <p className="text-xs text-muted-foreground mt-1">Deadline: {p.deadline}</p>
              </div>
            </article>
          ))}
      </div>
      <div className="px-3 py-2 border-t border-border bg-surface text-center">

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
              Programme leadership, official updates, notifications, and tenders from the ELEMENT Project.
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
            <div className="relative">
              <div className="absolute inset-0">
                <UpdatesPanel updatesTab={updatesTab} setUpdatesTab={setUpdatesTab} t={t} />
              </div>
            </div>
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
        <div className="mx-auto w-full max-w-[110rem] px-3 sm:px-4 lg:px-5">
          <div className="grid lg:grid-cols-[35fr_35fr_30fr] gap-6 items-stretch lg:h-[46rem]">
            {/* Column 1: Project Highlights */}
            <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[28rem] lg:h-full overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-primary/5">
                <h2 className="text-[17px] font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                  <Trees className="h-4 w-4 text-accent" /> Project Highlights
                </h2>
                <Link to="/project-components" className="text-sm text-primary hover:text-accent font-semibold">
                  View all <ArrowRight className="inline h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border min-h-0">
                {projects.map((p) => (
                  <article key={p.title} className="flex gap-3 p-4 hover:bg-surface/60 transition">
                    <div className="h-20 w-24 shrink-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-sm overflow-hidden flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Trees className="h-6 w-6 text-primary/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {p.component && (
                          <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">{p.component}</span>
                        )}
                        <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-success/15 text-success">{p.status}</span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground leading-snug mb-1">{p.title}</h3>
                      {p.objective && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{p.objective}</p>
                      )}
                      <Link to={`/projects/${slugify(p.title)}`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Column 2: Social Media */}
            <div className="bg-card border border-border rounded-md p-0 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-primary/5">
                <h2 className="text-[17px] font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                  <Facebook className="h-4 w-4 text-accent" /> Social Media
                </h2>
                <Link to="/media/social" className="text-sm text-primary hover:text-accent font-semibold">
                  View all <ArrowRight className="inline h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex-1 min-h-0 p-3 flex flex-col gap-3">
                {/* Facebook update */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[29] min-h-0">
                  <div className="px-3 py-2 border-b border-border bg-surface flex items-center gap-2 shrink-0">
                    <Facebook className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Facebook</span>
                    <span className="text-xs text-muted-foreground ml-auto">@ElementTripura</span>
                  </div>
                  <div className="p-3 flex-1 min-h-0 flex flex-col justify-center">
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                      Field visit by ELEMENT team to community plantation sites in Dhalai district. Engaging with SHGs on livelihood value chains and capacity-building workshops.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
                  </div>
                </div>
                {/* Twitter update */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[29] min-h-0">
                  <div className="px-3 py-2 border-b border-border bg-surface flex items-center gap-2 shrink-0">
                    <Twitter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Twitter / X</span>
                    <span className="text-xs text-muted-foreground ml-auto">@ElementTripura</span>
                  </div>
                  <div className="p-3 flex-1 min-h-0 flex flex-col justify-center">
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                      Honourable Forest Minister inaugurates new eco-tourism circuit under ELEMENT. A milestone for sustainable livelihoods across Tripura. #Tripura #ELEMENT
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">5 days ago</p>
                  </div>
                </div>
                {/* YouTube video */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[42] min-h-0">
                  <div className="relative flex-1 min-h-0 bg-gradient-to-br from-primary/30 to-primary-light/30 flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative h-11 w-11 rounded-full bg-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <div className="w-0 h-0 border-l-[11px] border-l-accent-foreground border-y-[7px] border-y-transparent ml-0.5" />
                    </div>
                  </div>
                  <div className="px-3 py-2 shrink-0">
                    <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
                      ELEMENT Project Overview — Community Livelihoods
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Knowledge Hub */}
            <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[28rem] lg:h-full overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-primary/5">
                <h2 className="text-[17px] font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                  <Award className="h-4 w-4 text-accent" /> Knowledge Hub
                </h2>
                <Link to="/knowledge-hub/iec" className="text-sm text-primary hover:text-accent font-semibold">
                  View all <ArrowRight className="inline h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border min-h-0">
                {knowledgeHubItems.map((k) => (
                  <article key={k.title} className="flex items-center gap-3 p-4 hover:bg-surface/60 transition">
                    <div className="h-11 w-11 shrink-0 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-accent">{k.category}</span>
                      <h3 className="text-[15px] font-semibold text-foreground leading-snug mt-0.5 mb-1">{k.title}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{k.date}</span>
                        <span>·</span>
                        <span>PDF</span>
                        <span>·</span>
                        <span>English</span>
                        <span>·</span>
                        <a href="#" className="text-primary font-semibold hover:text-accent">Download</a>
                      </div>
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
