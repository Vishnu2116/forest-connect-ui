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
  Briefcase,
  Users,
  User,
  TrendingUp,
  Globe,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Sprout,
  Mountain,
  Handshake,
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
import plantationBg from "@/assets/plantation-bg.jpg";

import cmImage from "@/assets/dignitaries/CM.jpeg";
import Animesh from "@/assets/dignitaries/Animesh.jpeg";
import CS from "@/assets/dignitaries/CS.jpg";

const announcementDescriptions: Record<string, string> = {
  Recruitment: "Applications invited for ELEMENT programme positions.",
  Tender: "Sealed tenders for livelihood infrastructure and civil works.",
  Event: "Community engagement and stakeholder events.",
  Notification: "Programme guidelines and circulars issued.",
  Report: "Progress reports published for public reference.",
};

const socialFeed = [
  {
    date: "30 Apr 2026",
    content:
      "Bamboo value chain training completed for 500+ SHG members across Dhalai & Gomati. Empowering communities through skill development! #ELEMENT #Livelihoods",
    likes: 42,
    retweets: 12,
    replies: 5,
  },
  {
    date: "25 Apr 2026",
    content:
      "Community nursery enterprises now operational in 6 districts — empowering local youth with green jobs. #GreenEnterprise #Tripura",
    likes: 67,
    retweets: 23,
    replies: 8,
  },
  {
    date: "20 Apr 2026",
    content:
      "Hon'ble CM visited ELEMENT livelihood centres in North Tripura. Appreciated community participation in landscape restoration. #Tripura",
    likes: 128,
    retweets: 45,
    replies: 14,
  },
  {
    date: "15 Apr 2026",
    content:
      "12,000+ households now benefiting from ELEMENT's value chain programme. Real impact, real change. #EconomicGrowth #ELEMENT",
    likes: 89,
    retweets: 31,
    replies: 11,
  },
];

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

export default function Home() {
  const { t } = useLang();
  const [updatesTab, setUpdatesTab] = useState<
    "notifications" | "events" | "tenders"
  >("notifications");

  return (
    <PageLayout>
      <HeroSlider />

      {/* What is ELEMENT? — Redesigned */}
      <section className="py-14 md:py-18 bg-surface">
        <div className="gov-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              About the Programme
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

      {/* Dignitaries / Leadership */}
      <section className="py-14 md:py-18 bg-gradient-to-b from-surface to-background border-t border-border/40">
        <div className="gov-container">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Programme Dignitaries
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Senior leaders and dignitaries guiding the ELEMENT programme.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Shri Manik Saha",
                designation: "Hon'ble Chief Minister",
                desc: "Government of Tripura",
                image: cmImage,
              },
              {
                name: "Shri Animesh Debbarma",
                designation: "Forest & Environment Minister",
                desc: "Government of Tripura",
                image: Animesh,
              },
              {
                name: "Shri J.K. Sinha, IAS",
                designation: "Chief Secretary",
                desc: "Government of Tripura",
                image: CS,
              },
              {
                name: "Shri Chaitanya Murti, IFS",
                designation: "CEO & Project Director, ELEMENT Project",
                desc: "PCCF (Administration & Personal Relations, Protection), CWLW & MS, TBB",
                image: "",
              },
              {
                name: "Dr. Honnareddy N, IFS",
                designation: "Addl. CEO, ELEMENT Project",
                desc: "CCF(P&D) I/C, CF (Establishment & HRD)",
                image: "",
              },
              {
                name: "Shri Sanjib Das, IFS",
                designation: "Director, Project ELEMENT",
                desc: "CF (Territorial & Coordination)",
                image: "",
              },
            ].map((d) => (
              <div
                key={d.name}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-primary/30 transition group"
              >
                <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-105 transition-transform overflow-hidden">
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
                <h4 className="text-base font-bold text-foreground leading-snug">
                  {d.name}
                </h4>
                <p className="text-sm text-primary font-semibold mt-1.5">
                  {d.designation}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's New + Right panel (Tabs + Tweets) */}
      <section className="py-14 md:py-18 bg-background">
        <div className="gov-container grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-10">
              <h2 className="section-title flex items-center gap-2">
                <Bell className="h-6 w-6 text-accent " /> {t("home.whatsnew")}
              </h2>
              <Link
                to="/reports"
                className="text-sm text-primary hover:text-accent font-medium"
              >
                {t("home.viewAll")} <ArrowRight className="inline h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {announcements.map((a) => (
                <article
                  key={a.title}
                  className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 hover:shadow-card transition flex gap-4 items-start"
                >
                  <div className="bg-primary text-primary-foreground rounded-md text-center px-3 py-2.5 shrink-0 min-w-[72px]">
                    <div className="text-[11px] uppercase opacity-90 tracking-wide">
                      {a.date.split(" ")[1]} {a.date.split(" ")[2]}
                    </div>
                    <div className="text-xl font-bold leading-none mt-0.5">
                      {a.date.split(" ")[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-accent/10 text-accent mb-1.5">
                      {a.tag}
                    </span>
                    <h3 className="text-base font-semibold text-foreground hover:text-primary leading-snug mb-0">
                      <a href="#">{a.title}</a>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed mb-0">
                      {announcementDescriptions[a.tag] ??
                        "Latest update from the ELEMENT programme."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right panel: tabs + Twitter feed */}
          <aside className="space-y-5 pt-[75px]">
            <div className="bg-card border border-border rounded-md overflow-hidden sticky top-44">
              <div className="grid grid-cols-3 border-b border-border bg-surface">
                {(
                  [
                    {
                      key: "notifications",
                      label: t("home.notifications"),
                      icon: Bell,
                    },
                    { key: "events", label: t("home.events"), icon: Calendar },
                    {
                      key: "tenders",
                      label: t("home.tenders"),
                      icon: Briefcase,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setUpdatesTab(tab.key)}
                    className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold border-b-2 transition ${
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
              <div className="p-4 max-h-[340px] overflow-y-auto">
                {updatesTab === "notifications" && (
                  <ul className="space-y-3">
                    {announcements
                      .filter(
                        (a) =>
                          a.tag === "Notification" || a.tag === "Recruitment",
                      )
                      .map((a) => (
                        <li
                          key={a.title}
                          className="border-b border-border last:border-0 pb-2.5 last:pb-0"
                        >
                          <div className="text-[10px] font-semibold text-accent uppercase">
                            {a.date}
                          </div>
                          <a
                            href="#"
                            className="text-sm font-medium text-foreground hover:text-primary block mt-0.5"
                          >
                            {a.title}
                          </a>
                        </li>
                      ))}
                  </ul>
                )}
                {updatesTab === "events" && (
                  <ul className="space-y-3">
                    {events.map((e) => (
                      <li
                        key={e.title}
                        className="border-b border-border last:border-0 pb-2.5 last:pb-0"
                      >
                        <div className="text-[10px] font-semibold text-accent uppercase">
                          {e.date}
                        </div>
                        <a
                          href="#"
                          className="text-sm font-medium text-foreground hover:text-primary block mt-0.5"
                        >
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
                    {procurements.slice(0, 5).map((p) => (
                      <li
                        key={p.title}
                        className="border-b border-border last:border-0 pb-2.5 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-accent uppercase">
                            {p.date}
                          </span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${p.status === "Open" ? "bg-success/10 text-success" : p.status === "Closing Soon" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <a
                          href="#"
                          className="text-sm font-medium text-foreground hover:text-primary block mt-0.5"
                        >
                          {p.title}
                        </a>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Deadline: {p.deadline}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-3 border-t border-border bg-surface text-center">
                <Link
                  to={
                    updatesTab === "notifications"
                      ? "/knowledge-hub/notifications"
                      : updatesTab === "events"
                        ? "/activities"
                        : "/procurements"
                  }
                  className="text-xs font-semibold text-primary hover:text-accent inline-flex items-center gap-1"
                >
                  Go to{" "}
                  {updatesTab === "notifications"
                    ? t("home.notifications")
                    : updatesTab === "events"
                      ? t("home.events")
                      : t("home.tenders")}{" "}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Twitter/X style feed */}
            <div className="bg-card border border-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-foreground"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm font-bold text-foreground">
                  Latest Tweets
                </span>
              </div>
              <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {socialFeed.map((post, i) => (
                  <div key={i} className="p-4 hover:bg-surface/50 transition">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          EL
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-foreground">
                            ELEMENT Project
                          </span>
                          <span className="text-xs text-muted-foreground">
                            @ELEMENTTripura
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ·
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {post.date}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-5 mt-2.5">
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition text-xs">
                            <MessageCircle className="h-3.5 w-3.5" />{" "}
                            {post.replies}
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-success transition text-xs">
                            <Repeat2 className="h-3.5 w-3.5" /> {post.retweets}
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition text-xs">
                            <Heart className="h-3.5 w-3.5" /> {post.likes}
                          </button>
                          <button className="text-muted-foreground hover:text-primary transition">
                            <Share className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border bg-surface text-center">
                <a
                  href="#"
                  className="text-xs font-semibold text-primary hover:text-accent"
                >
                  Show more
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Project highlights */}
      <section className="bg-surface py-12 md:py-14">
        <div className="gov-container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="section-title flex items-center gap-2">
              <Trees className="h-6 w-6 text-accent" /> Project Highlights
            </h2>
            <Link
              to="/projects"
              className="text-sm text-primary hover:text-accent font-medium"
            >
              All Projects <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.slice(0, 4).map((p) => (
              <article
                key={p.title}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card hover:border-primary/40 transition"
              >
                <div className="h-44 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Trees className="h-16 w-16 text-primary/30" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-success/10 text-success">
                      {p.status}
                    </span>
                    {p.component && (
                      <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-accent/10 text-accent">
                        {p.component}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-primary leading-snug mb-0">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2 mb-0">
                    {p.description}
                  </p>
                  <Link
                    to={`/projects/${slugify(p.title)}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    Know More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programme stats banner */}
      <section className="relative">
        <div className="relative h-[460px] md:h-[520px] overflow-hidden">
          <img
            src={plantationBg}
            alt="Landscape across Tripura"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/85 via-primary-dark/60 to-primary-dark/30" />
          <div className="relative gov-container h-full flex items-center">
            <div className="max-w-2xl text-primary-foreground">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded">
                ELEMENT Programme
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight mb-0">
                {t("home.plantation.title")}
              </h2>
              <p className="mt-3 text-base md:text-lg opacity-95 leading-relaxed mb-0">
                {t("home.plantation.desc")}
              </p>
              <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["8", t("home.stats.districts")],
                  ["620+", t("home.stats.activities")],
                  ["25,000+", t("home.stats.community")],
                  ["18,500", t("home.stats.restoration")],
                ].map(([n, l]) => (
                  <div
                    key={l as string}
                    className="bg-background/10 backdrop-blur border border-primary-foreground/20 rounded-md p-4 text-center"
                  >
                    <dt className="text-xl md:text-2xl font-bold text-accent mb-0">
                      {n}
                    </dt>
                    <dd className="text-xs md:text-sm opacity-90 mt-1.5">
                      {l}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/plantation-map"
                className="mt-6 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold focus-ring"
              >
                {t("home.plantation.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge hub preview */}
      <section className="py-12 md:py-14">
        <div className="gov-container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title flex items-center gap-2">
              <Award className="h-6 w-6 text-accent" /> Knowledge Hub
            </h2>
            <Link
              to="/knowledge-hub/iec"
              className="text-sm text-primary hover:text-accent font-medium"
            >
              Browse all <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {knowledgeHubItems.slice(0, 4).map((k) => (
              <article
                key={k.title}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition"
              >
                <div className="h-32 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary-foreground/80" />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                    {k.category}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground mt-1.5 leading-snug mb-0">
                    {k.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 mb-0">
                    {k.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
