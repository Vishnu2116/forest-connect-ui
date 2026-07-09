import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";
import { getOriginalFilename } from "@/utils/fileDownload";
import {
  Calendar,
  ArrowRight,
  MapPin,
  Bell,
  Trees,
  Sprout,
  BookOpen,
  User,
  TrendingUp,
  Briefcase,
  Mountain,
  Handshake,
  Facebook,
  Twitter,
  Youtube,
  FileText,
  UserCheck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import HeroSlider from "@/components/home/HeroSlider";
import { announcements, events, projects, procurements } from "@/data/content";
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
// Controls: What's New (Updates panel)
const AUTO_SCROLL_SPEED_UPDATES = 28;
// Controls: Project Highlights column
const AUTO_SCROLL_SPEED_PROJECTS = 24;
// How many pixels a single up/down arrow click advances the scroller
const MANUAL_STEP_PX = 96;

const announcementDescriptions: Record<string, string> = {
  Recruitment: "Applications invited for PROJECT ELEMENT positions.",
  Tender: "Sealed e-tenders for livelihood infrastructure and civil works.",
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
    icon: Sprout,
    stat: "821",
    statLabel: "Villages",
    label: "Project beneficiaries",
    desc: "The primary beneficiaries of ELEMENT Project are tribal population and forest dwellers.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Handshake,
    stat: "75,000",
    statLabel: "Direct Beneficiaries",
    label: "Direct beneficiaries",
    desc: "The project beneficiaries would mainly comprise of families of identified JFMC members across villages in project area.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Briefcase,
    stat: "1,48,800",
    statLabel: "Households",
    label: "Direct and indirect households",
    desc: "The project will cover 1,48,800 households direct and indirect.",
    gradient: "from-amber-500 to-orange-600",
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
    name: "Shri Rabindra Kumar Samal, IFS",
    designation: "PCCF HOFF SFDA Chair Person",
    organisation: "Tripura Forest Department",
    image: PCCF,
  },
  {
    slot_number: 3,
    name: "Shri Animesh Debbarma",
    designation: "Forest & Environment Minister",
    organisation: "Government of Tripura",
    image: Animesh,
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
      <div className="aspect-[2/1] w-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground overflow-hidden border-b border-border">
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
    case "E-Tender":
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
  variant = "fill",
}: {
  updatesTab: "whatsnew" | "notifications" | "tenders";
  setUpdatesTab: (k: "whatsnew" | "notifications" | "tenders") => void;
  t: (k: string) => string;
  variant?: "fill" | "fit";
}) {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [apiWhatsNew, setApiWhatsNew] = useState<any[]>([]);
  const [apiNotifs, setApiNotifs] = useState<any[]>([]);
  const [apiTenders, setApiTenders] = useState<any[]>([]);
  // Auto-scroll engine. Speed: see AUTO_SCROLL_SPEED_UPDATES (top of file).
  const { ref, scrollByAmount, shouldScroll } = useAutoScroll<HTMLDivElement>(
    AUTO_SCROLL_SPEED_UPDATES,
    paused,
  );

  useEffect(() => {
    let alive = true;
    import("@/lib/knowledgeHub").then(
      ({ fetchWhatsNew, fetchHomeNotifications }) => {
        Promise.all([fetchWhatsNew(), fetchHomeNotifications()]).then(
          ([wn, nt]) => {
            if (!alive) return;
            setApiWhatsNew(wn);
            setApiNotifs(nt);
          },
        );
      },
    );
    import("@/lib/procurements").then(({ fetchHomeTenders }) => {
      fetchHomeTenders().then((t) => {
        if (alive) setApiTenders(t);
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  const renderApiItem = (
    it: any,
    idx: number,
    mode: "whatsnew" | "notifications" = "whatsnew",
  ) => {
    const created = it.created_at ? new Date(it.created_at).getTime() : 0;
    const isNew = created && Date.now() - created < 7 * 24 * 60 * 60 * 1000;
    const itemType = it.item_type || it.type || "update";
    const typeMap: Record<string, string> = {
      notification: "Notification",
      report: "Report",
      tender: "E-Tender",
      rfp: "RFP",
      event: "Event",
      project: "Project",
      publication: "Publication",
    };
    const Icon = getUpdateIcon(typeMap[itemType] || "Notification");
    const fileUrl = it.file_path
      ? it.file_path.startsWith("http")
        ? it.file_path
        : `${API_BASE_URL ?? ""}${it.file_path}`
      : null;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (mode === "notifications") {
        if (fileUrl) {
          window.open(fileUrl, "_blank", "noopener,noreferrer");
        } else {
          navigate("/knowledge-hub/notifications");
        }
        return;
      }
      // whatsnew — route by source
      const source = it.source || it.item_source;
      if (source === "event") {
        navigate(`/media/events/${it.slug}`);
      } else if (source === "knowledge_hub") {
        navigate(`/knowledge-hub/${it.item_type || itemType}`);
      } else if (source === "procurement") {
        navigate("/procurements/tenders");
      } else if (source === "project") {
        navigate(`/projects/${it.slug}`);
      } else if (fileUrl) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
      } else if (itemType === "event") {
        navigate(`/media/events/${it.slug || it.id}`);
      } else if (itemType === "tender" || itemType === "rfp") {
        navigate("/procurements/tenders");
      } else if (itemType === "project") {
        navigate(`/projects/${it.slug || it.id}`);
      } else {
        navigate(`/knowledge-hub/${itemType}`);
      }
    };

    return (
      <article
        key={`${it.id || it.title}-${idx}`}
        onClick={handleClick}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        className="cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
      >
        <div className="shrink-0 text-primary self-center">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
              {String(itemType).replace(/_/g, " ")}
            </span>
            <span className="ml-auto">
              <NewBadge show={!!isNew} />
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground hover:text-primary block leading-snug">
            {it.title}
          </span>
          {it.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {it.description}
            </p>
          )}
        </div>
      </article>
    );
  };

  const filteredWhatsNew = useMemo(() => {
    return apiWhatsNew.filter((it) => {
      const source = it.source || it.item_source;
      const itemType = it.item_type || it.type;
      if (source === "event") return true;
      if (source === "procurement") return true;
      if (source === "knowledge_hub" && itemType === "notification")
        return true;
      return false;
    });
  }, [apiWhatsNew]);

  return (
    <div className={`bg-card border border-border rounded-md overflow-hidden ${variant === "fill" ? "h-full" : "h-auto"} flex flex-col`}>
      <div className="px-4 py-3 border-b-2 border-primary bg-primary/5">
        <h2 className="text-xs sm:text-sm font-semibold text-primary flex items-center justify-center gap-1.5">
          <Bell className="h-4 w-4" />
          What's New
        </h2>
      </div>
      {/*
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
      */}
      <div
        ref={ref}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setPaused(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setPaused(false);
        }}
        className={`${variant === "fill" ? "flex-1 min-h-0" : ""} overflow-y-auto no-scrollbar`}
      >
        {Array.from({ length: shouldScroll ? 2 : 1 }).map((_, copyIdx) => (
          <div
            key={copyIdx}
            className="flex flex-col"
            aria-hidden={copyIdx === 1 || undefined}
          >
            {updatesTab === "whatsnew" &&
              filteredWhatsNew.length > 0 &&
              filteredWhatsNew.map((it, i) => renderApiItem(it, i, "whatsnew"))}
            {updatesTab === "whatsnew" &&
              filteredWhatsNew.length === 0 &&
              announcements
                .filter(
                  (a) =>
                    a.tag === "Event" ||
                    a.tag === "Tender" ||
                    a.tag === "Notification",
                )
                .map((a, idx) => {
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
                            {a.tag === "Tender" ? "E-Tender" : a.tag}
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
            {updatesTab === "notifications" && apiNotifs.length > 0 && (
              <>
                {apiNotifs.map((it, i) =>
                  renderApiItem(it, i, "notifications"),
                )}
              </>
            )}
            {updatesTab === "notifications" && apiNotifs.length === 0 && (
              <>
                {announcements
                  .filter(
                    (a) => a.tag === "Notification" || a.tag === "Recruitment",
                  )
                  .map((a, idx) => {
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
                {events.map((e, idx) => (
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
              (() => {
                const useApi = apiTenders.length > 0;
                const list = useApi
                  ? apiTenders.map((t) => ({
                      id: t.id,
                      title: t.title,
                      status: t.status,
                      deadline: t.deadline,
                      created_at: t.created_at,
                      file_path: t.file_path,
                    }))
                  : procurements.map((p, i) => ({
                      id: `dummy-${i}`,
                      title: p.title,
                      status:
                        p.status === "Open"
                          ? "open"
                          : p.status === "Closing Soon"
                            ? "closing_soon"
                            : p.status === "Closed"
                              ? "closed"
                              : "open",
                      deadline: p.deadline,
                      created_at: undefined,
                      file_path: null as string | null,
                    }));
                const statusUi = (s: string) => {
                  if (s === "open")
                    return { label: "Open", cls: "bg-success/15 text-success" };
                  if (s === "closing_soon")
                    return {
                      label: "Closing Soon",
                      cls: "bg-accent/15 text-accent",
                    };
                  if (s === "closed")
                    return {
                      label: "Closed",
                      cls: "bg-muted text-muted-foreground",
                    };
                  if (s === "cancelled")
                    return {
                      label: "Cancelled",
                      cls: "bg-destructive/15 text-destructive",
                    };
                  return { label: s, cls: "bg-muted text-muted-foreground" };
                };
                const fmtDeadline = (d?: string) => {
                  if (!d) return "—";
                  const dt = new Date(d);
                  if (Number.isNaN(dt.getTime())) return d;
                  return dt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                };
                return list.map((p, idx) => {
                  const isNewItem = useApi
                    ? p.created_at &&
                      Date.now() - new Date(p.created_at).getTime() <
                        7 * 24 * 60 * 60 * 1000
                    : isItemNew(p.title);
                  const fileUrl = p.file_path
                    ? p.file_path.startsWith("http")
                      ? p.file_path
                      : `${API_BASE_URL ?? ""}${p.file_path}`
                    : null;
                  const sUi = statusUi(p.status as string);
                  return (
                    <article
                      key={`${p.id}-${idx}`}
                      onClick={() => navigate("/procurements/tenders")}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate("/procurements/tenders");
                        }
                      }}
                      className="cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
                    >
                      <div className="shrink-0 text-primary self-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent">
                            Tender
                          </span>
                          <span className="ml-auto flex items-center gap-1.5">
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm ${sUi.cls}`}
                            >
                              {sUi.label}
                            </span>
                            <NewBadge show={!!isNewItem} />
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground hover:text-primary block leading-snug">
                          {p.title}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deadline: {fmtDeadline(p.deadline)}
                        </p>
                      </div>
                    </article>
                  );
                });
              })()}
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-border bg-surface flex items-center justify-between gap-2">
        {/*
        <Link
          to="/procurements/tenders"
          className="text-xs font-semibold text-primary hover:text-accent inline-flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
        */}
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
 * Project Highlights column — continuous slow ticker-style upward scroll.
 * Pauses on hover; list is duplicated for seamless looping.
 */
// function ProjectHighlightsColumn() {
//   const [items, setItems] = useState<any[]>([]);
//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     let alive = true;
//     import("@/lib/projects").then(({ fetchHighlights }) => {
//       fetchHighlights().then((data) => {
//         if (alive) setItems(data);
//       });
//     });
//     return () => {
//       alive = false;
//     };
//   }, []);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el || items.length === 0) return;
//     let animId: number;
//     let paused = false;

//     const scroll = () => {
//       if (!paused) {
//         el.scrollTop += 0.4;
//         if (el.scrollTop >= el.scrollHeight / 2) {
//           el.scrollTop = 0;
//         }
//       }
//       animId = requestAnimationFrame(scroll);
//     };

//     animId = requestAnimationFrame(scroll);

//     const pause = () => {
//       paused = true;
//     };
//     const resume = () => {
//       paused = false;
//     };
//     const parent = el.parentElement;
//     parent?.addEventListener("mouseenter", pause);
//     parent?.addEventListener("mouseleave", resume);

//     return () => {
//       cancelAnimationFrame(animId);
//       parent?.removeEventListener("mouseenter", pause);
//       parent?.removeEventListener("mouseleave", resume);
//     };
//   }, [items]);

//   const looped = items.length > 0 ? [...items, ...items] : items;

//   return (
//     <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[480px] lg:h-[520px] overflow-hidden">
//       <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-primary/5">
//         <h2 className="text-[17px] font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
//           <Trees className="h-4 w-4 text-accent" /> Project Highlights
//         </h2>
//         <Link
//           to="/project-components"
//           className="text-sm text-primary hover:text-accent font-semibold"
//         >
//           View all <ArrowRight className="inline h-3.5 w-3.5" />
//         </Link>
//       </div>
//       <div
//         ref={scrollRef}
//         className="flex-1 overflow-y-auto divide-y divide-border min-h-0 no-scrollbar"
//       >
//         {looped.map((p, idx) => {
//           const raw: string | null = p.thumbnail_image_path ?? null;
//           const img = raw
//             ? raw.startsWith("/uploads/")
//               ? `${API_BASE_URL ?? ""}${raw}`
//               : raw
//             : null;
//           const statusCls =
//             p.status === "completed"
//               ? "bg-muted text-muted-foreground"
//               : p.status === "pilot_phase"
//                 ? "bg-warning/15 text-warning"
//                 : "bg-success/15 text-success";
//           const statusText =
//             p.status === "completed"
//               ? "Completed"
//               : p.status === "pilot_phase"
//                 ? "Pilot Phase"
//                 : "Ongoing";
//           return (
//             <article
//               key={`${p.id}-${idx}`}
//               className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface/60 transition"
//             >
//               <div className="h-14 w-16 shrink-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-sm overflow-hidden flex items-center justify-center">
//                 {img ? (
//                   <img
//                     src={img}
//                     alt={p.title}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <Trees className="h-5 w-5 text-primary/40" />
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-1 mb-0.5">
//                   {p.component?.label && (
//                     <span className="text-[8px] font-semibold uppercase tracking-wide px-1 py-0.5 rounded-sm bg-accent/15 text-accent">
//                       {p.component.label}
//                     </span>
//                   )}
//                   <span
//                     className={`text-[8px] font-semibold uppercase tracking-wide px-1 py-0.5 rounded-sm shrink-0 ${statusCls}`}
//                   >
//                     {statusText}
//                   </span>
//                 </div>
//                 <h3 className="text-[13px] font-semibold text-foreground leading-tight line-clamp-1">
//                   {p.title}
//                 </h3>
//                 <Link
//                   to={`/projects/${p.slug}`}
//                   className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover"
//                 >
//                   Read More <ArrowRight className="h-3 w-3" />
//                 </Link>
//               </div>
//             </article>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

function ProjectHighlightsColumn() {
  const [items, setItems] = useState<any[]>([]);
  const [paused, setPaused] = useState(false);

  // Auto-scroll engine — same hook as UpdatesPanel.
  // Speed: see AUTO_SCROLL_SPEED_PROJECTS (top of file).
  const { ref, scrollByAmount, shouldScroll } = useAutoScroll<HTMLDivElement>(
    AUTO_SCROLL_SPEED_PROJECTS,
    paused,
  );

  useEffect(() => {
    let alive = true;
    import("@/lib/projects").then(({ fetchHighlights }) => {
      fetchHighlights().then((data) => {
        if (alive) setItems(data);
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[480px] lg:h-[520px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary bg-primary/5">
        <h2 className="text-[17px] font-bold text-primary flex items-center gap-2 uppercase tracking-wide">
          <Trees className="h-4 w-4 text-accent" /> Project Highlights
        </h2>
      </div>

      <div
        ref={ref}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setPaused(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setPaused(false);
        }}
        className="flex-1 overflow-y-auto min-h-0 no-scrollbar"
      >
        {Array.from({ length: shouldScroll ? 2 : 1 }).map((_, copyIdx) => (
          <div key={copyIdx} aria-hidden={copyIdx === 1 || undefined}>
            {items.map((p, idx) => {
              const raw: string | null = p.thumbnail_image_path ?? null;
              const img = raw
                ? raw.startsWith("/uploads/")
                  ? `${API_BASE_URL ?? ""}${raw}`
                  : raw
                : null;
              const statusCls =
                p.status === "completed"
                  ? "bg-muted text-muted-foreground"
                  : p.status === "pilot_phase"
                    ? "bg-accent/15 text-accent"
                    : "bg-success/15 text-success";
              const statusText =
                p.status === "completed"
                  ? "Completed"
                  : p.status === "pilot_phase"
                    ? "Pilot Phase"
                    : "Ongoing";
              return (
                <article
                  key={`${p.id}-${idx}`}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-surface/60 transition border-b border-border"
                >
                  <div className="h-20 w-24 shrink-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded overflow-hidden flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trees className="h-6 w-6 text-primary/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      {p.component?.label && (
                        <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-accent/15 text-accent truncate">
                          {p.component.label}
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-sm shrink-0 ml-auto ${statusCls}`}
                      >
                        {statusText}
                      </span>
                    </div>
                    <h3 className="text-[14px] md:text-[15px] font-semibold text-foreground leading-snug line-clamp-2 mt-1.5 mb-1">
                      {p.title}
                    </h3>
                    <Link
                      to={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover"
                    >
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer — mirrors UpdatesPanel: View all link + manual scroll arrows */}
      <div className="px-3 py-2 border-t border-border bg-surface flex items-center justify-between gap-2">
        <Link
          to="/project-components"
          className="text-xs font-semibold text-primary hover:text-accent inline-flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
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
    facebook_url: "https://facebook.com",
    twitter_handle: "@ElementTripura",
    twitter_url: "https://twitter.com",
    youtube_video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtube_video_title: "PROJECT ELEMENT Overview — Community Livelihoods",
  };
  const social = {
    facebook_handle: apiSocial?.facebook_handle ?? dummySocial.facebook_handle,
    facebook_url: apiSocial?.facebook_url ?? dummySocial.facebook_url,
    twitter_handle: apiSocial?.twitter_handle ?? dummySocial.twitter_handle,
    twitter_url: apiSocial?.twitter_url ?? dummySocial.twitter_url,
    youtube_video_url:
      apiSocial?.youtube_video_url ?? dummySocial.youtube_video_url,
    youtube_video_title:
      apiSocial?.youtube_video_title ?? dummySocial.youtube_video_title,
  };
  const youtubeEmbed = (() => {
    const url = social.youtube_video_url;
    if (!url) return "";
    const m = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
    );
    return m ? `https://www.youtube.com/embed/${m[1]}` : "";
  })();

  const leadershipSlots = useMemo(() => {
    return dummyLeadershipSlots.map((dummy) => {
      const api = apiLeadership?.find(
        (s) => Number(s.slot_number) === dummy.slot_number,
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

  const topRowDignitaries = [
    leadershipSlots[0], // CM
    leadershipSlots[2], // Forest Minister
  ].filter(Boolean);

  const bottomRowDignitaries = [
    leadershipSlots[1], // Principal Secretary
    leadershipSlots[3], // PCCF CEO
  ].filter(Boolean);

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
              Welcome to Project ELEMENT, Tripura
            </h2>
            <p className="text-m text-muted-foreground mt-2 max-w-xl mx-auto">
              Project leadership, official updates, notifications, and e-tenders
              from the PROJECT ELEMENT.
            </p>
          </div>

          {/* Mobile: dignitaries first, then center tabs */}
          <div className="lg:hidden space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {topRowDignitaries.map((d) => (
                <DignitaryCard key={d.name} d={d} />
              ))}

              {bottomRowDignitaries.map((d) => (
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
          <div className="hidden lg:grid grid-cols-[1fr_2fr_1fr] gap-6 items-start">
            <div className="grid grid-cols-1 gap-4">
              <DignitaryCard d={leadershipSlots[0]} />
              <DignitaryCard d={leadershipSlots[1]} />
            </div>

            <div className="relative h-full">
              <div className="absolute inset-0">
                <UpdatesPanel
                  updatesTab={updatesTab}
                  setUpdatesTab={setUpdatesTab}
                  t={t}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <DignitaryCard d={leadershipSlots[2]} />
              <DignitaryCard d={leadershipSlots[3]} />
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
            <p className="text-muted-foreground mt-3 text-sm md:text-[19px] max-w-2xl mx-auto mb-6">
              The “Enhancing Landscape and Ecosystem Management (ELEMENT)”
              Project is proposed with an overarching objective to increase the
              resilience of landscapes and forest-dependent communities in the
              North-Eastern Region of India starting with the two states of
              Tripura and Nagaland.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 pb-3">
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
                <h4 className="text-lg font-bold text-foreground mt-3">
                  {p.label}
                </h4>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
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
      <section className="py-10 md:py-12 bg-surface border-t border-border">
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
          <div className="grid lg:grid-cols-[58fr_42fr] gap-6 items-stretch lg:h-[520px]">
            {/* Column 1: Project Highlights */}
            <ProjectHighlightsColumn />

            {/* Column 2: Social Media */}
            <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[520px] lg:h-full overflow-hidden shadow-sm">
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
              <div className="flex-1 min-h-0 p-4 flex flex-col gap-2">
                {/* Facebook link button */}
                <a
                  href={social.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-[hsl(214_100%_95%)] hover:bg-[hsl(214_100%_92%)] border border-border transition-colors shrink-0"
                >
                  <div className="h-9 w-9 rounded-full bg-[hsl(221_44%_41%)] flex items-center justify-center shrink-0">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">
                      {social.facebook_handle}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Visit our Facebook Page
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </a>

                {/* Twitter link button */}
                <a
                  href={social.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-[hsl(210_16%_93%)] hover:bg-[hsl(210_16%_90%)] border border-border transition-colors shrink-0"
                >
                  <div className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    <Twitter className="h-5 w-5 text-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">
                      {social.twitter_handle}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Visit our Twitter Feed
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </a>

                {/* YouTube embed */}
                <div className="flex-1 min-h-0 flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-2 shrink-0">
                    <Youtube className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                      YouTube
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div
                    className="relative w-full max-w-full overflow-hidden rounded-lg bg-muted shrink-0"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    {youtubeEmbed && (
                      <iframe
                        src={youtubeEmbed}
                        title={social.youtube_video_title}
                        className="absolute inset-0 w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
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
