import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const renderApiItem = (it: any, idx: number) => {
    const created = it.created_at ? new Date(it.created_at).getTime() : 0;
    const isNew = created && Date.now() - created < 7 * 24 * 60 * 60 * 1000;
    const itemType = it.item_type || it.type || "update";
    const typeMap: Record<string, string> = {
      notification: "Notification",
      report: "Report",
      tender: "Tender",
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
    return (
      <article
        key={`${it.id || it.title}-${idx}`}
        className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
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
          <a
            href={fileUrl || "#"}
            target={fileUrl ? "_blank" : undefined}
            rel="noreferrer"
            onClick={(e) => {
              if (!fileUrl) e.preventDefault();
            }}
            className="text-sm font-semibold text-foreground hover:text-primary block leading-snug"
          >
            {it.title}
          </a>
          {it.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {it.description}
            </p>
          )}
        </div>
      </article>
    );
  };

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
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setPaused(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setPaused(false);
        }}
        className="flex-1 overflow-y-auto min-h-0 no-scrollbar"
      >
        {Array.from({ length: shouldScroll ? 2 : 1 }).map((_, copyIdx) => (
          <div
            key={copyIdx}
            className="flex flex-col"
            aria-hidden={copyIdx === 1 || undefined}
          >
            {updatesTab === "whatsnew" &&
              apiWhatsNew.length > 0 &&
              apiWhatsNew.map(renderApiItem)}
            {updatesTab === "whatsnew" &&
              apiWhatsNew.length === 0 &&
              announcements.map((a, idx) => {
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
            {updatesTab === "notifications" && apiNotifs.length > 0 && (
              <>{apiNotifs.map(renderApiItem)}</>
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
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition border-b border-border"
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
                        <a
                          href={fileUrl || "#"}
                          target={fileUrl ? "_blank" : undefined}
                          rel="noreferrer"
                          onClick={(e) => {
                            if (!fileUrl) e.preventDefault();
                          }}
                          className="text-sm font-semibold text-foreground hover:text-primary block leading-snug"
                        >
                          {p.title}
                        </a>
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
                  className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-surface/60 transition border-b border-border"
                >
                  <div className="h-14 w-16 shrink-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-sm overflow-hidden flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trees className="h-5 w-5 text-primary/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      {p.component?.label && (
                        <span className="text-[8px] font-semibold uppercase tracking-wide px-1 py-0.5 rounded-sm bg-accent/15 text-accent">
                          {p.component.label}
                        </span>
                      )}
                      <span
                        className={`text-[8px] font-semibold uppercase tracking-wide px-1 py-0.5 rounded-sm shrink-0 ml-auto ${statusCls}`}
                      >
                        {statusText}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-semibold text-foreground leading-tight line-clamp-1">
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
              Welcome to Project ELEMENT, Tripura
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
          <div className="grid lg:grid-cols-[58fr_42fr] gap-6 items-stretch lg:h-[30rem]">
            {/* Column 1: Project Highlights */}
            <ProjectHighlightsColumn />

            {/* Column 2: Social Media */}
            <div className="bg-card border border-border rounded-md p-0 flex flex-col h-[30rem] lg:h-full overflow-hidden shadow-sm">
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
                      {social.facebook_handle}
                    </span>
                  </div>
                  <div className="p-3 flex-1 min-h-0 flex flex-col justify-center">
                    <p className="text-[15px] text-foreground leading-relaxed line-clamp-3">
                      {social.facebook_post_text}
                    </p>
                  </div>
                </div>
                {/* Twitter update */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[29] min-h-0">
                  <div className="px-3 py-2 border-b border-border bg-surface flex items-center gap-2 shrink-0">
                    <Twitter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">Twitter / X</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {social.twitter_handle}
                    </span>
                  </div>
                  <div className="p-3 flex-1 min-h-0 flex flex-col justify-center">
                    <p className="text-[15px] text-foreground leading-relaxed line-clamp-3">
                      {social.twitter_post_text}
                    </p>
                  </div>
                </div>
                {/* YouTube video */}
                <div className="bg-background border border-border rounded-sm overflow-hidden flex flex-col basis-0 grow-[42] min-h-0">
                  <div className="px-3 py-2 border-b border-border bg-surface flex items-center gap-2 shrink-0">
                    <Youtube className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">YouTube</span>
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <div
                      className="relative w-full max-w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary/30 to-primary-light/30 group cursor-pointer"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      {youtubeEmbed ? (
                        <iframe
                          src={youtubeEmbed}
                          title={social.youtube_video_title}
                          className="absolute inset-0 w-full h-full rounded-lg"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                              <div className="w-0 h-0 border-l-[14px] border-l-accent-foreground border-y-[9px] border-y-transparent ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                      {social.youtube_video_title}
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
