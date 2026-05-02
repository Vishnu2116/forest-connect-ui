import { Link } from "react-router-dom";
import { useState } from "react";
import { Calendar, ArrowRight, MapPin, Bell, Trees, Award, BookOpen, FileText, Briefcase } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import HeroSlider from "@/components/home/HeroSlider";
import { announcements, events, projects, knowledgeHubItems, procurements } from "@/data/content";
import { useLang } from "@/contexts/LanguageContext";
import plantationBg from "@/assets/plantation-bg.jpg";

const announcementDescriptions: Record<string, string> = {
  Recruitment: "Online applications invited for forest service positions. Eligibility, fees and key dates available in the official notification.",
  Tender: "Sealed tenders invited for plantation, civil and survey works under the ELEMENT programme.",
  Event: "Awareness, training and stakeholder engagement events organised across forest divisions.",
  Notification: "Departmental orders, guidelines and circulars issued for field implementation.",
  Report: "Periodic reports on forest, wildlife and plantation activities published for public reference.",
};

export default function Home() {
  const { t } = useLang();
  const [updatesTab, setUpdatesTab] = useState<"notifications" | "events" | "tenders">("notifications");

  return (
    <PageLayout>
      <HeroSlider />

      {/* What's New + Right panel */}
      <section className="py-14 md:py-16">
        <div className="gov-container grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2"><Bell className="h-6 w-6 text-accent" /> {t("home.whatsnew")}</h2>
              <Link to="/reports" className="text-sm text-primary hover:text-accent font-medium">{t("home.viewAll")} <ArrowRight className="inline h-4 w-4" /></Link>
            </div>
            <div className="space-y-4">
              {announcements.map((a) => (
                <article key={a.title} className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 hover:shadow-card transition flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-md text-center px-3 py-2.5 shrink-0 min-w-[72px]">
                    <div className="text-[11px] uppercase opacity-90 tracking-wide">{a.date.split(" ")[1]} {a.date.split(" ")[2]}</div>
                    <div className="text-xl font-bold leading-none mt-0.5">{a.date.split(" ")[0]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-accent/10 text-accent mb-1.5">{a.tag}</span>
                    <h3 className="text-base font-semibold text-foreground hover:text-primary leading-snug mb-0"><a href="#">{a.title}</a></h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed mb-0">
                      {announcementDescriptions[a.tag] ?? "Latest update from the ELEMENT programme."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right panel: tabs for Notifications / Events / Tenders */}
          <aside>
            <div className="bg-card border border-border rounded-md overflow-hidden sticky top-44">
              <div className="grid grid-cols-3 border-b border-border bg-surface">
                {([
                  { key: "notifications", label: t("home.notifications"), icon: Bell },
                  { key: "events", label: t("home.events"), icon: Calendar },
                  { key: "tenders", label: t("home.tenders"), icon: Briefcase },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setUpdatesTab(tab.key)}
                    className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold border-b-2 transition ${
                      updatesTab === tab.key ? "border-accent text-primary bg-card" : "border-transparent text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-4 max-h-[480px] overflow-y-auto">
                {updatesTab === "notifications" && (
                  <ul className="space-y-3">
                    {announcements.filter(a => a.tag === "Notification" || a.tag === "Recruitment").map(a => (
                      <li key={a.title} className="border-b border-border last:border-0 pb-2.5 last:pb-0">
                        <div className="text-[10px] font-semibold text-accent uppercase">{a.date}</div>
                        <a href="#" className="text-sm font-medium text-foreground hover:text-primary block mt-0.5">{a.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
                {updatesTab === "events" && (
                  <ul className="space-y-3">
                    {events.map(e => (
                      <li key={e.title} className="border-b border-border last:border-0 pb-2.5 last:pb-0">
                        <div className="text-[10px] font-semibold text-accent uppercase">{e.date}</div>
                        <a href="#" className="text-sm font-medium text-foreground hover:text-primary block mt-0.5">{e.title}</a>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{e.venue}</div>
                      </li>
                    ))}
                  </ul>
                )}
                {updatesTab === "tenders" && (
                  <ul className="space-y-3">
                    {procurements.slice(0, 5).map(p => (
                      <li key={p.title} className="border-b border-border last:border-0 pb-2.5 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-accent uppercase">{p.date}</span>
                          <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${p.status === "Open" ? "bg-success/10 text-success" : p.status === "Closing Soon" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
                        </div>
                        <a href="#" className="text-sm font-medium text-foreground hover:text-primary block mt-0.5">{p.title}</a>
                        <div className="text-xs text-muted-foreground mt-0.5">Deadline: {p.deadline}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="p-3 border-t border-border bg-surface text-center">
                <Link
                  to={updatesTab === "notifications" ? "/knowledge-hub/notifications" : updatesTab === "events" ? "/activities" : "/procurements"}
                  className="text-xs font-semibold text-primary hover:text-accent inline-flex items-center gap-1"
                >
                  Go to {updatesTab === "notifications" ? t("home.notifications") : updatesTab === "events" ? t("home.events") : t("home.tenders")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Project highlights */}
      <section className="bg-surface py-14 md:py-16">
        <div className="gov-container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title flex items-center gap-2"><Trees className="h-6 w-6 text-accent" /> Project Highlights</h2>
            <Link to="/projects" className="text-sm text-primary hover:text-accent font-medium">All Projects <ArrowRight className="inline h-4 w-4" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map((p) => (
              <article key={p.title} className="bg-card border border-border rounded-lg p-7 hover:shadow-card hover:border-primary/40 transition">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-success/10 text-success">{p.status}</span>
                  {p.component && <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-accent/10 text-accent">{p.component}</span>}
                </div>
                <h3 className="text-lg font-bold text-primary leading-snug mb-0">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed mb-0">{p.description}</p>
                <Link to="/projects" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover">Read more <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Plantation hero/image section (no map) */}
      <section className="relative">
        <div className="relative h-[460px] md:h-[520px] overflow-hidden">
          <img src={plantationBg} alt="Forest landscape across Tripura" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/85 via-primary-dark/60 to-primary-dark/30" />
          <div className="relative gov-container h-full flex items-center">
            <div className="max-w-2xl text-primary-foreground">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded">ELEMENT Programme</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight mb-0">{t("home.plantation.title")}</h2>
              <p className="mt-3 text-base md:text-lg opacity-95 leading-relaxed mb-0">{t("home.plantation.desc")}</p>
              <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ["8", t("home.stats.districts")],
                  ["620+", t("home.stats.activities")],
                  ["12,000+", t("home.stats.community")],
                  ["18,500", t("home.stats.restoration")],
                ].map(([n, l]) => (
                  <div key={l as string} className="bg-background/10 backdrop-blur border border-primary-foreground/20 rounded-md p-4 text-center">
                    <dt className="text-xl md:text-2xl font-bold text-accent mb-0">{n}</dt>
                    <dd className="text-xs md:text-sm opacity-90 mt-1.5">{l}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/plantation-map" className="mt-6 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold focus-ring">
                {t("home.plantation.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge hub preview */}
      <section className="py-14 md:py-16">
        <div className="gov-container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title flex items-center gap-2"><Award className="h-6 w-6 text-accent" /> Knowledge Hub</h2>
            <Link to="/knowledge-hub/iec" className="text-sm text-primary hover:text-accent font-medium">Browse all <ArrowRight className="inline h-4 w-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {knowledgeHubItems.slice(0, 4).map((k) => (
              <article key={k.title} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition">
                <div className="h-32 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary-foreground/80" />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{k.category}</span>
                  <h3 className="text-sm font-semibold mt-1.5 leading-snug mb-0">{k.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 mb-0">{k.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
