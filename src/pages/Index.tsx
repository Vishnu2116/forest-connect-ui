import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";
import {
  Calendar,
  ArrowRight,
  MapPin,
  Bell,
  Trees,
  
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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import HeroSlider from "@/components/home/HeroSlider";
import {
  announcements,
  events,
  projects,
  
  procurements,
} from "@/data/content";
import { useLang } from "@/contexts/LanguageContext";
import { slugify } from "./ProjectDetail";
import { useAutoScroll } from "@/hooks/useAutoScroll";

import cmImage from "@/assets/dignitaries/TripuraCM.png";
import Animesh from "@/assets/dignitaries/TripuraForestMinister.jpg";
import PCCF from "@/assets/dignitaries/ShriRabindraKumarSamal_PCCF.jpg";

/* ────────────────────────────────────────────────────────────────────────────
 * AUTO-SCROLL SPEEDS (pixels per second)
 *
 * Each constant controls the scroll speed of one auto-scrolling section on the
 * home page. Modify the value here to change that section's speed. Setting a
 * value to 0 effectively pauses auto-scroll.
 *
 * The actual scroll engine lives in:  src/hooks/useAutoScroll.ts
 * ──────────────────────────────────────────────────────────────────────────── */
// Controls: What's New, Notifications, Tenders (Updates panel)
const AUTO_SCROLL_SPEED_UPDATES = 28;
// Controls: Project Highlights column
const AUTO_SCROLL_SPEED_PROJECTS = 24;
// How many pixels a single up/down arrow click advances the scroller
const MANUAL_STEP_PX = 96;

const announcementDescriptions: Record<string, string> = {
  Recruitment: "Applications invited for PROJECT ELEMENT positions.",
  Tender: "Sealed tenders for livelihood infrastructure and civil works.",
  Event: "Community engagement and stakeholder events.",
  Notification: "Project guidelines and circulars issued.",
  Report: "Progress reports published for public reference.",
};

/**
 * Reusable "NEW" badge — strong attention-seeking red pulse.
 * Toggle via `show` prop. Backend/API can later decide which items get show=true.
 */
function NewBadge({ show = true }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span
      className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[hsl(0_85%_50%)] text-white shadow-sm animate-badge-pulse"
      aria-label="New item"
    >
      New
    </span>
  );
}

/** Up / Down manual scroll arrows shown at the bottom-right of a scrolling panel. */
function ScrollArrows({
  onUp,
  onDown,
}: {
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onUp}
        aria-label="Scroll up"
        className="p-1 rounded-sm border border-border bg-background hover:bg-primary hover:text-primary-foreground transition focus-ring"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onDown}
        aria-label="Scroll down"
        className="p-1 rounded-sm border border-border bg-background hover:bg-primary hover:text-primary-foreground transition focus-ring"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// Hardcoded NEW-enabled set for now. Replace with API/backend flags later.
const isItemNew = (_title: string) => true;

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

const dummyLeadershipSlots = [
  {
    slot_number: 1,
    name: "Shri Manik Saha",
    designation: "Hon'ble Chief Minister",
    organisation: "Government of Tripura",
    image: cmImage,
  },
  {
    slot_number: 2,
    name: "Shri Animesh Debbarma",
    designation: "Forest & Environment Minister",
    organisation: "Government of Tripura",
    image: Animesh,
  },
  {
    slot_number: 3,
    name: "Shri Rabindra Kumar Samal, IFS",
    designation: "PCCF HOFF SFDA Chair Person",
    organisation: "Tripura Forest Department",
    image: PCCF,
  },
  {
    slot_number: 4,
    name: "Shri Chaitanya Murti, IFS",
    designation: "PCCF CEO / PD",
    organisation: "PROJECT ELEMENT",
    image: "",
  },
];


function DignitaryCard({
  d,
}: {
  d: { name: string; designation: string; desc: string; image: string };
}) {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden hover:border-primary/40 transition h-full flex flex-col">
      <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground overflow-hidden border-b border-border">
        {d.image ? (
          <img
            src={d.image}
            alt={d.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-12 w-12" />
        )}
      </div>
      <div className="px-3 py-3 text-center border-t-2 border-accent flex-1 flex flex-col justify-center">
        <h4 className="text-base font-bold text-foreground leading-tight">
          {d.name}
        </h4>
        <p className="text-sm text-primary font-semibold mt-1 leading-tight">
          {d.designation}
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-tight">
          {d.desc}
        </p>
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
  const [paused, setPaused] = useState(false);
  // Auto-scroll engine. Speed: see AUTO_SCROLL_SPEED_UPDATES (top of file).
  const { ref, scrollByAmount } = useAutoScroll<HTMLDivElement>(
    AUTO_SCROLL_SPEED_UPDATES,
    paused,
  );

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden h-full flex flex-col">
      <div className="grid grid-cols-3 border-b-2 border-primary bg-primary/5">
        {(
          [
            { key: "whatsnew", label: "What's New", icon: Bell },
            {
              key: "notifications",
              label: t("home.notifications"),
              icon: Calendar,
            },
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
      <div
        ref={ref}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setPaused(true); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setPaused(false); }}
        className="flex-1 overflow-y-auto min-h-0 no-scrollbar"
      >
        <div className="flex flex-col">
          {updatesTab === "whatsnew" &&
            [...announcements, ...announcements].map((a, idx) => {
              const Icon = getUpdateIcon(a.tag);
              return (
                <article
                  key={`${a.title}-${idx}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
                >
                  <div className="shrink-0 text-primary self-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
                        {a.tag}
                      </span>
                      <span className="ml-auto">
                        <NewBadge show={isItemNew(a.title)} />
                      </span>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-semibold text-foreground hover:text-primary block leading-snug"
                    >
                      {a.title}
                    </a>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {announcementDescriptions[a.tag] ??
                        "Latest update from the PROJECT ELEMENT."}
                    </p>
                  </div>
                </article>
              );
            })}
          {updatesTab === "notifications" && (
            <>
              {[
                ...announcements.filter(
                  (a) => a.tag === "Notification" || a.tag === "Recruitment",
                ),
                ...announcements.filter(
                  (a) => a.tag === "Notification" || a.tag === "Recruitment",
                ),
              ].map((a, idx) => {
                const Icon = getUpdateIcon(a.tag);
                return (
                  <article
                    key={`${a.title}-${idx}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
                  >
                    <div className="shrink-0 text-primary self-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
                          {a.tag}
                        </span>
                        <span className="ml-auto">
                          <NewBadge show={isItemNew(a.title)} />
                        </span>
                      </div>
                      <a
                        href="#"
                        className="text-sm font-semibold text-foreground hover:text-primary block leading-snug"
                      >
                        {a.title}
                      </a>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {announcementDescriptions[a.tag] ??
                          "Official notification issued by the PROJECT ELEMENT."}
                      </p>
                    </div>
                  </article>
                );
              })}
              {[...events, ...events].map((e, idx) => (
                <article
                  key={`${e.title}-${idx}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
                >
                  <div className="shrink-0 text-primary self-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
                        Event
                      </span>
                      <span className="ml-auto">
                        <NewBadge show={isItemNew(e.title)} />
                      </span>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-semibold text-foreground hover:text-primary block leading-snug"
                    >
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
            [...procurements, ...procurements].map((p, idx) => (
              <article
                key={`${p.title}-${idx}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
              >
                <div className="shrink-0 text-primary self-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Left: Tender tag.   Right (extreme): status badge + NEW. */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
                      Tender
                    </span>
                    <span className="ml-auto flex items-center gap-1.5">
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
                      <NewBadge show={isItemNew(p.title)} />
                    </span>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-semibold text-foreground hover:text-primary block leading-snug"
                  >
                    {p.title}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Deadline: {p.deadline}
                  </p>
                </div>
              </article>
            ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t border-border bg-surface flex items-center justify-between gap-2">
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
        {/* Manual scroll controls (bottom-right). Pauses auto-scroll briefly via hover. */}
        <ScrollArrows
          onUp={() => scrollByAmount(-MANUAL_STEP_PX)}
          onDown={() => scrollByAmount(MANUAL_STEP_PX)}
        />
      </div>
    </div>
  );
}

/**
 * Project Highlights column — auto-scrolling, infinite/circular, with manual
 * up/down arrow controls. Auto-scroll speed: AUTO_SCROLL_SPEED_PROJECTS.
 */
function ProjectHighlightsColumn() {
  const [paused, setPaused] = useState(false);
  const { ref, scrollByAmount } = useAutoScroll<HTMLDivElement>(
    AUTO_SCROLL_SPEED_PROJECTS,
    paused,
  );
  // Duplicate items so the scroll wrap is seamless.
  const items = [...projects, ...projects];

  return (
    <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[28rem] lg:h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-primary/5">
        <h2 className="text-[17px] font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
          <Trees className="h-4 w-4 text-accent" /> Project Highlights
        </h2>
        <Link
          to="/project-components"
          className="text-sm text-primary hover:text-accent font-semibold"
        >
          View all <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      </div>
      <div
        ref={ref}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setPaused(true); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setPaused(false); }}
        className="flex-1 overflow-y-auto divide-y divide-border min-h-0 no-scrollbar"
      >
        {items.map((p, idx) => (
          <article
            key={`${p.title}-${idx}`}
            className="flex gap-3 p-4 hover:bg-surface/60 transition"
          >
            <div className="h-20 w-24 shrink-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-sm overflow-hidden flex items-center justify-center">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Trees className="h-6 w-6 text-primary/40" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                {p.component && (
                  <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
                    {p.component}
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-success/15 text-success">
                  {p.status}
                </span>
              </div>
              <h3 className="text-base font-semibold text-foreground leading-snug mb-1">
                {p.title}
              </h3>
              {p.objective && (
                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                  {p.objective}
                </p>
              )}
              <Link
                to={`/projects/${slugify(p.title)}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {/* Manual up/down scroll controls — bottom-right of column. */}
      <div className="px-3 py-2 border-t border-border bg-surface flex items-center justify-end">
        <ScrollArrows
          onUp={() => scrollByAmount(-MANUAL_STEP_PX)}
          onDown={() => scrollByAmount(MANUAL_STEP_PX)}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const [updatesTab, setUpdatesTab] = useState<
    "whatsnew" | "notifications" | "tenders"
  >("whatsnew");

  const [apiLeadership, setApiLeadership] = useState<any[] | null>(null);
  const [apiSocial, setApiSocial] = useState<any | null>(null);

  useEffect(() => {
    if (!USE_REAL_API) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/home/leadership`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setApiLeadership(data);
        }
      } catch {
        /* keep dummy */
      }
    })();
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/home/social-media`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled && data && typeof data === "object") {
          setApiSocial(data);
        }
      } catch {
        /* keep dummy */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Dummy social media fallbacks
  const dummySocial = {
    facebook_handle: "@ElementTripura",
    facebook_post_text:
      "Field visit by ELEMENT team to community plantation sites in Dhalai district. Engaging with SHGs on livelihood value chains and capacity-building workshops.",
    twitter_handle: "@ElementTripura",
    twitter_post_text:
      "Honourable Forest Minister inaugurates new eco-tourism circuit under ELEMENT. A milestone for sustainable livelihoods across Tripura. #Tripura #ELEMENT",
    youtube_video_url: "",
    youtube_video_title: "PROJECT ELEMENT Overview — Community Livelihoods",
  };
  const social = {
    facebook_handle: apiSocial?.facebook_handle ?? dummySocial.facebook_handle,
    facebook_post_text:
      apiSocial?.facebook_post_text ?? dummySocial.facebook_post_text,
    twitter_handle: apiSocial?.twitter_handle ?? dummySocial.twitter_handle,
    twitter_post_text:
      apiSocial?.twitter_post_text ?? dummySocial.twitter_post_text,
    youtube_video_url:
      apiSocial?.youtube_video_url ?? dummySocial.youtube_video_url,
    youtube_video_title:
      apiSocial?.youtube_video_title ?? dummySocial.youtube_video_title,
  };
  const youtubeEmbed = (() => {
    const url = social.youtube_video_url;
    if (!url) return "";
    const m =
      url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : "";
  })();

  const leadershipSlots = useMemo(() => {
    return dummyLeadershipSlots.map((dummy) => {
      const api = apiLeadership?.find(
        (s) => Number(s.slot_number) === dummy.slot_number
      );
      if (
        !api ||
        (!api.name && !api.designation && !api.organisation && !api.photo_path)
      ) {
        return {
          name: dummy.name,
          designation: dummy.designation,
          desc: dummy.organisation,
          image: dummy.image,
        };
      }
      const photo = api.photo_path
        ? api.photo_path.startsWith("http")
          ? api.photo_path
          : `${API_BASE_URL ?? ""}${api.photo_path}`
        : "";
      return {
        name: api.name || dummy.name,
        designation: api.designation || dummy.designation,
        desc: api.organisation || dummy.organisation,
        image: photo,
      };
    });
  }, [apiLeadership]);

  const leftDignitaries = [leadershipSlots[0], leadershipSlots[1]];
  const rightDignitaries = [leadershipSlots[2], leadershipSlots[3]];

  return (
    <PageLayout>
      <HeroSlider />

      {/* Welcome to Tripura PROJECT ELEMENT — left/right dignitaries + center tabs */}
      <section className="py-12 md:py-16 bg-surface border-b border-border">
        <div className="gov-container">
          <div className="text-center mb-8">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Welcome to Tripura PROJECT ELEMENT
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Project leadership, official updates, notifications, and tenders
              from the PROJECT ELEMENT.
            </p>
          </div>

          {/* Mobile: dignitaries first, then center tabs */}
          <div className="lg:hidden space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {leftDignitaries.map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}
              {rightDignitaries.map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}
            </div>
            {/* Fixed height on mobile/tablet so the scroll container constrains
                its children and the auto-scroll engine can actually animate. */}
            <div className="h-[28rem] sm:h-[32rem]">
              <UpdatesPanel
                updatesTab={updatesTab}
                setUpdatesTab={setUpdatesTab}
                t={t}
              />
            </div>
          </div>

          {/* Desktop: 3-column layout */}
          <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] gap-6 items-stretch">
            <div className="grid grid-cols-1 gap-4">
              {leftDignitaries.map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-0">
                <UpdatesPanel
                  updatesTab={updatesTab}
                  setUpdatesTab={setUpdatesTab}
                  t={t}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {rightDignitaries.map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is ELEMENT? */}
      <section className="py-14 md:py-18 bg-background">
        <div className="gov-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              About the Project
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight mt-3 mb-5">
              What is ELEMENT?
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-2xl mx-auto mb-6">
              A flagship initiative of the Government of Tripura and the World
              Bank — transforming livelihoods, landscapes, and communities
              across all 8 districts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 pb-3">
            {pillars.map((p) => (
              <div
                key={p.label}
                className="relative bg-card border border-border rounded-xl p-6 text-center shadow-card hover:shadow-lg transition-shadow group overflow-hidden"
              >
                <div
                  className={`mx-auto h-16 w-16 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <p.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-3xl font-extrabold text-primary">
                  {p.stat}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                  {p.statLabel}
                </div>
                <h4 className="text-base font-bold text-foreground mt-3">
                  {p.label}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded font-semibold text-sm focus-ring"
            >
              Learn more about ELEMENT <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two-column section: Project Highlights & Social Media */}
      <section className="py-14 md:py-18 bg-surface border-t border-border">
        <div className="gov-container">
          <div className="text-center mb-8">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Highlights
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Project Highlights &amp; Social Media
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
              Key project initiatives and official social media updates from the
              PROJECT ELEMENT.
            </p>
          </div>
          <div className="grid lg:grid-cols-[58fr_42fr] gap-6 items-stretch lg:h-[44rem]">
            {/* Column 1: Project Highlights */}
            <ProjectHighlightsColumn />

            {/* Column 2: Social Media */}
            <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[40rem] lg:h-full overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-primary/5">
                <h2 className="text-[17px] font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
                  <Facebook className="h-4 w-4 text-accent" /> Social Media
                </h2>
                <Link
                  to="/media/social"
                  className="text-sm text-primary hover:text-accent font-semibold"
                >
                  View all <ArrowRight className="inline h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex-1 min-h-0 p-4 flex flex-col gap-4">
                {/* Facebook update */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[29] min-h-0">
                  <div className="px-3 py-2 border-b border-border bg-surface flex items-center gap-2 shrink-0">
                    <Facebook className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Facebook</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      @ElementTripura
                    </span>
                  </div>
                  <div className="p-3 flex-1 min-h-0 flex flex-col justify-center">
                    <p className="text-[15px] text-foreground leading-relaxed line-clamp-3">
                      Field visit by ELEMENT team to community plantation sites
                      in Dhalai district. Engaging with SHGs on livelihood value
                      chains and capacity-building workshops.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      2 days ago
                    </p>
                  </div>
                </div>
                {/* Twitter update */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[29] min-h-0">
                  <div className="px-3 py-2 border-b border-border bg-surface flex items-center gap-2 shrink-0">
                    <Twitter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Twitter / X</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      @ElementTripura
                    </span>
                  </div>
                  <div className="p-3 flex-1 min-h-0 flex flex-col justify-center">
                    <p className="text-[15px] text-foreground leading-relaxed line-clamp-3">
                      Honourable Forest Minister inaugurates new eco-tourism
                      circuit under ELEMENT. A milestone for sustainable
                      livelihoods across Tripura. #Tripura #ELEMENT
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      5 days ago
                    </p>
                  </div>
                </div>
                {/* YouTube video */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[42] min-h-0">
                  <div className="relative flex-1 min-h-0 bg-gradient-to-br from-primary/30 to-primary-light/30 flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative h-14 w-14 rounded-full bg-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <div className="w-0 h-0 border-l-[14px] border-l-accent-foreground border-y-[9px] border-y-transparent ml-1" />
                    </div>
                  </div>
                  <div className="px-3 py-2.5 shrink-0 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
                      PROJECT ELEMENT Overview — Community Livelihoods
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
