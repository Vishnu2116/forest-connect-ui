import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Phone, Mail, User, ChevronRight, X, Briefcase, TrendingUp, Mountain, Handshake, Sprout } from "lucide-react";
import { officials } from "@/data/content";

const aboutLinks = [
  { to: "/about", title: "About ELEMENT" },
  { to: "/about/organization", title: "Organization Structure" },
  { to: "/about/whos-who", title: "Who's Who" },
  { to: "/about/vision", title: "Vision & Objective" },
  { to: "/about/mission", title: "Mission & Objective" },
];

function AboutLayout({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <PageLayout>
      <PageHeader title={title} subtitle={subtitle} breadcrumb={["Home", "About", title]} />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase">About</h3>
            <nav className="space-y-1">
              {aboutLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`block px-3 py-2 text-sm rounded border-l-2 transition ${
                    pathname === l.to
                      ? "border-accent text-primary bg-surface font-semibold"
                      : "border-transparent hover:bg-surface hover:text-primary hover:border-accent"
                  }`}
                >
                  {l.title}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </section>
    </PageLayout>
  );
}

/* ---- About ELEMENT (main intro page) ---- */
export function AboutElement() {
  return (
    <AboutLayout title="About ELEMENT" subtitle="A joint initiative for landscape development, livelihood generation and economic transformation">
      <div className="space-y-8">
        {/* Grand intro */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-8 shadow-card text-center">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">About the Programme</span>
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">What is ELEMENT?</h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            <strong>ELEMENT</strong> (Enhancing Landscape and Ecosystem Management) is a flagship joint initiative of the <strong>Government of Tripura</strong> and the <strong>World Bank</strong> — transforming rural livelihoods, strengthening economic development, and building resilient landscapes across all 8 districts.
          </p>
        </div>

        {/* Pillar cards — infographic style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Briefcase, label: "Livelihood Generation", stat: "25,000+", statLabel: "Households", desc: "Sustainable income through bamboo, agar and broom-grass value chains.", gradient: "from-primary to-primary-light" },
            { icon: TrendingUp, label: "Economic Transformation", stat: "₹45 Cr+", statLabel: "Investment", desc: "Enterprise development, producer collectives and market linkages.", gradient: "from-accent to-accent-hover" },
            { icon: Mountain, label: "Landscape Restoration", stat: "18,500", statLabel: "Hectares", desc: "Science-based restoration of degraded lands for productivity.", gradient: "from-primary to-primary-light" },
            { icon: Handshake, label: "Community Development", stat: "12,000+", statLabel: "SHG Members", desc: "Empowering local communities as active partners in planning.", gradient: "from-accent to-accent-hover" },
            { icon: Sprout, label: "Sustainable Rural Economy", stat: "8", statLabel: "Districts", desc: "Building long-term climate-resilient and inclusive growth across Tripura.", gradient: "from-primary to-primary-light" },
          ].map((p) => (
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

        {/* Key Highlights */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Key Highlights</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Covers all 8 districts of Tripura",
              "Benefits 25,000+ households through livelihood support",
              "12,000+ SHG members engaged in value chain activities",
              "Focus on economic transformation, not just afforestation",
              "Implemented by Government of Tripura with World Bank support",
              "Landscape-based approach integrating livelihood and restoration",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 bg-card border border-border rounded-md p-3">
                <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}

/* ---- Organization Structure (flowchart) ---- */
type OrgNode = { id: string; label: string; name: string; designation: string; role: string; description: string };

const orgNodes: OrgNode[] = [
  { id: "got", label: "Government of Tripura", name: "Hon'ble Chief Minister", designation: "Chief Minister, Tripura", role: "Apex Authority", description: "Provides overall policy direction and governance for ELEMENT through the State Government machinery." },
  { id: "psc", label: "Project Steering Committee", name: "Chief Secretary (Chair)", designation: "Chief Secretary, Government of Tripura", role: "Strategic Oversight", description: "High-level inter-departmental committee that provides strategic direction, reviews progress, and ensures inter-agency coordination." },
  { id: "sfda", label: "State Forest Development Agency", name: "Principal Secretary, Forests", designation: "Administrative Head", role: "Nodal Agency", description: "Acts as the nodal agency for channeling funds, monitoring implementation, and providing administrative support to the PMU." },
  { id: "pmu", label: "Project Management Unit", name: "Project Director (PCCF-rank)", designation: "Project Director, ELEMENT", role: "Implementation Lead", description: "Central unit responsible for day-to-day management, procurement, financial management, M&E, and coordination with all implementing units." },
  { id: "du", label: "District Units", name: "DFOs / District Coordinators", designation: "District-level Officers", role: "Field Coordination", description: "Coordinate implementation at district level, manage sub-projects, supervise field teams, and liaise with local government bodies." },
  { id: "vlc", label: "Village Level Committees", name: "Community Leaders / JFMC Chairs", designation: "Village-level Representatives", role: "Community Implementation", description: "Grassroots bodies that plan and implement livelihood activities, plantation works, and community development initiatives at village level." },
];

export function Organization() {
  const [selected, setSelected] = useState<OrgNode | null>(null);

  return (
    <AboutLayout title="Organization Structure" subtitle="Governance and implementation framework of the ELEMENT programme">
      <div className="space-y-6">
        {/* Visual flowchart */}
        <div className="bg-card border border-border rounded-md p-6 shadow-card">
          <h3 className="text-lg font-semibold text-primary mb-6 text-center">ELEMENT Governance Structure</h3>
          <div className="flex flex-col items-center gap-1">
            {orgNodes.map((node, i) => (
              <div key={node.id} className="flex flex-col items-center">
                {i > 0 && (
                  <div className="w-0.5 h-6 bg-primary/30" />
                )}
                <button
                  onClick={() => setSelected(node)}
                  className={`px-6 py-3 rounded-lg border-2 text-sm font-semibold transition-all min-w-[240px] md:min-w-[320px] text-center hover:shadow-md ${
                    selected?.id === node.id
                      ? "border-accent bg-accent/10 text-primary shadow-md"
                      : "border-primary/30 bg-surface text-primary hover:border-accent hover:bg-accent/5"
                  }`}
                >
                  {node.label}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4 italic">Click on any node to view details</p>
        </div>

        {/* Detail modal/panel */}
        {selected && (
          <div className="bg-card border-2 border-accent rounded-md p-6 shadow-card relative animate-fade-in">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-surface"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">{selected.label}</h3>
                <p className="text-sm font-medium text-foreground mt-1">{selected.name}</p>
                <p className="text-sm text-muted-foreground">{selected.designation}</p>
                <span className="inline-block mt-2 text-xs font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{selected.role}</span>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{selected.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AboutLayout>
  );
}

/* ---- Who's Who (moved inside About) ---- */
export function WhosWhoSection() {
  const [selected, setSelected] = useState<typeof officials[0] | null>(null);

  return (
    <AboutLayout title="Who's Who" subtitle="Leadership team driving the ELEMENT programme">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {officials.map((o) => (
          <article
            key={o.name}
            className="bg-card border border-border rounded-md p-5 text-center hover:shadow-card hover:border-primary/40 transition cursor-pointer"
            onClick={() => setSelected(o)}
          >
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground">
              <User className="h-8 w-8" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-primary">{o.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{o.designation}</p>
            <button className="mt-3 text-xs text-accent font-semibold hover:underline">View Details</button>
          </article>
        ))}
      </div>

      {/* Detail overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-lg shadow-elevated max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1 rounded hover:bg-surface" aria-label="Close">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground">
                <User className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-primary">{selected.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selected.designation}</p>
              <p className="text-sm text-muted-foreground mt-1">ELEMENT Programme, Government of Tripura</p>
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2"><Phone className="h-4 w-4" /> {selected.phone}</div>
                <div className="flex items-center justify-center gap-2"><Mail className="h-4 w-4" /> contact@element.tripura.gov.in</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AboutLayout>
  );
}

/* ---- Vision ---- */
export function Vision() {
  return (
    <AboutLayout title="Vision & Objective" subtitle="Building a prosperous, resilient and inclusive Tripura">
      <div className="bg-card border border-border rounded-md p-6 shadow-card space-y-4">
        <h3 className="text-xl font-semibold text-primary">Our Vision</h3>
        <p className="text-muted-foreground leading-relaxed">To transform rural livelihoods and strengthen economic development across Tripura through sustainable landscape management, community-driven value chains, and inclusive growth — ensuring prosperity for present and future generations.</p>
        <h3 className="text-xl font-semibold text-primary mt-4">Key Objectives</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
          <li>Generate sustainable livelihoods through value chain development.</li>
          <li>Strengthen community-based institutions and local governance.</li>
          <li>Restore degraded landscapes for long-term economic productivity.</li>
          <li>Build climate resilience through adaptive land management.</li>
          <li>Improve market access and enterprise opportunities for rural communities.</li>
        </ul>
      </div>
    </AboutLayout>
  );
}

/* ---- Mission ---- */
export function Mission() {
  return (
    <AboutLayout title="Mission & Objective" subtitle="Action-oriented commitments of the ELEMENT programme">
      <div className="bg-card border border-border rounded-md p-6 shadow-card space-y-4">
        <h3 className="text-xl font-semibold text-primary">Our Mission</h3>
        <p className="text-muted-foreground leading-relaxed">To deliver transparent, community-centric development through capacity-building, technology adoption, value chain strengthening, and partnerships with communities, enterprises, and institutions across Tripura.</p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {[
            ["Livelihoods", "Create sustainable income for 25,000+ households through high-value product chains."],
            ["Landscape Restoration", "Restore degraded lands for productive use and ecological balance."],
            ["Community Empowerment", "Strengthen JFMCs, SHGs and village committees across all districts."],
            ["Innovation", "Adopt GIS, drones and digital monitoring for transparent implementation."],
          ].map(([t, d]) => (
            <div key={t} className="border border-border rounded p-4">
              <div className="font-semibold text-primary">{t}</div>
              <div className="text-sm text-muted-foreground mt-1">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </AboutLayout>
  );
}
