import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Phone, Mail, User, ChevronRight, X, Briefcase, TrendingUp, Mountain, Handshake, Sprout, Eye, Target, Lightbulb, Globe, Shield, Leaf, Users, Compass, Award, BookOpen, Zap } from "lucide-react";
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

/* ---- Organization Structure ---- */
type OrgNode = { id: string; label: string; name: string; designation: string; role: string; description: string; icon: typeof Briefcase };

const orgNodes: OrgNode[] = [
  { id: "got", label: "Government of Tripura", name: "Hon'ble Chief Minister", designation: "Chief Minister, Tripura", role: "Apex Authority", description: "Provides overall policy direction and governance for ELEMENT through the State Government machinery.", icon: Shield },
  { id: "psc", label: "Project Steering Committee", name: "Chief Secretary (Chair)", designation: "Chief Secretary, Government of Tripura", role: "Strategic Oversight", description: "High-level inter-departmental committee that provides strategic direction, reviews progress, and ensures inter-agency coordination.", icon: Compass },
  { id: "sfda", label: "State Forest Development Agency", name: "Principal Secretary, Forests", designation: "Administrative Head", role: "Nodal Agency", description: "Acts as the nodal agency for channeling funds, monitoring implementation, and providing administrative support to the PMU.", icon: Globe },
  { id: "pmu", label: "Project Management Unit", name: "Project Director (PCCF-rank)", designation: "Project Director, ELEMENT", role: "Implementation Lead", description: "Central unit responsible for day-to-day management, procurement, financial management, M&E, and coordination with all implementing units.", icon: Target },
  { id: "du", label: "District Units", name: "DFOs / District Coordinators", designation: "District-level Officers", role: "Field Coordination", description: "Coordinate implementation at district level, manage sub-projects, supervise field teams, and liaise with local government bodies.", icon: Users },
  { id: "vlc", label: "Village Level Committees", name: "Community Leaders / JFMC Chairs", designation: "Village-level Representatives", role: "Community Implementation", description: "Grassroots bodies that plan and implement livelihood activities, plantation works, and community development initiatives at village level.", icon: Leaf },
];

export function Organization() {
  const [selected, setSelected] = useState<OrgNode | null>(null);

  return (
    <AboutLayout title="Organization Structure" subtitle="Governance and implementation framework of the ELEMENT programme">
      <div className="space-y-8">
        {/* Header intro */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">Institutional Framework</span>
          <h3 className="text-xl font-bold text-primary mb-2">ELEMENT Governance Structure</h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">A multi-tier governance framework ensuring effective implementation from state-level policy to village-level action.</p>
        </div>

        {/* Org hierarchy — vertical timeline style */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-primary/20 hidden md:block" />

          <div className="space-y-4">
            {orgNodes.map((node, i) => (
              <button
                key={node.id}
                onClick={() => setSelected(selected?.id === node.id ? null : node)}
                className={`relative w-full text-left md:pl-16 transition-all ${
                  selected?.id === node.id ? "" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className={`absolute left-4 top-4 h-5 w-5 rounded-full border-2 hidden md:flex items-center justify-center transition-colors ${
                  selected?.id === node.id
                    ? "border-accent bg-accent"
                    : "border-primary/40 bg-card"
                }`}>
                  <div className={`h-2 w-2 rounded-full ${selected?.id === node.id ? "bg-accent-foreground" : "bg-primary/40"}`} />
                </div>

                <div className={`rounded-lg p-4 border transition-all ${
                  selected?.id === node.id
                    ? "border-accent bg-accent/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      selected?.id === node.id
                        ? "bg-accent/10"
                        : "bg-primary/10"
                    }`}>
                      <node.icon className={`h-5 w-5 ${selected?.id === node.id ? "text-accent" : "text-primary"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground">{node.label}</div>
                      <div className="text-xs text-muted-foreground">{node.role} · {node.name}</div>
                    </div>
                    <span className={`ml-auto text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      i === 0 ? "bg-primary/10 text-primary" : "bg-surface text-muted-foreground"
                    }`}>Level {i + 1}</span>
                  </div>

                  {/* Expanded detail */}
                  {selected?.id === node.id && (
                    <div className="mt-3 pt-3 border-t border-border/60 animate-fade-in">
                      <p className="text-sm text-muted-foreground leading-relaxed">{node.description}</p>
                      <p className="text-xs text-muted-foreground mt-2"><span className="font-medium text-foreground">Designation:</span> {node.designation}</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}

/* ---- Who's Who ---- */
export function WhosWhoSection() {
  const [selected, setSelected] = useState<typeof officials[0] | null>(null);

  return (
    <AboutLayout title="Who's Who" subtitle="Leadership team driving the ELEMENT programme">
      <div className="space-y-6">
        {/* Intro */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">Leadership</span>
          <h3 className="text-xl font-bold text-primary mb-2">Programme Leadership</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">Meet the senior officials and programme leaders steering the ELEMENT initiative.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {officials.map((o) => (
            <article
              key={o.name}
              className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md hover:border-primary/30 transition cursor-pointer group"
              onClick={() => setSelected(o)}
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
                <User className="h-7 w-7" />
              </div>
              <h3 className="mt-3 font-semibold text-sm text-primary">{o.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{o.designation}</p>
              <div className="mt-3 text-xs text-accent font-semibold group-hover:underline">View Profile →</div>
            </article>
          ))}
        </div>
      </div>

      {/* Detail overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl shadow-elevated max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1 rounded hover:bg-surface" aria-label="Close">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground">
                <User className="h-9 w-9" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-primary">{selected.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selected.designation}</p>
              <p className="text-xs text-muted-foreground mt-0.5">ELEMENT Programme, Government of Tripura</p>
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2"><Phone className="h-4 w-4 text-primary" /> {selected.phone}</div>
                <div className="flex items-center justify-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@element.tripura.gov.in</div>
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
  const objectives = [
    { icon: Sprout, title: "Sustainable Livelihoods", desc: "Generate sustainable livelihoods through value chain development." },
    { icon: Users, title: "Community Institutions", desc: "Strengthen community-based institutions and local governance." },
    { icon: Mountain, title: "Landscape Restoration", desc: "Restore degraded landscapes for long-term economic productivity." },
    { icon: Shield, title: "Climate Resilience", desc: "Build climate resilience through adaptive land management." },
    { icon: TrendingUp, title: "Market Access", desc: "Improve market access and enterprise opportunities for rural communities." },
  ];

  return (
    <AboutLayout title="Vision & Objective" subtitle="Building a prosperous, resilient and inclusive Tripura">
      <div className="space-y-8">
        {/* Vision statement — hero style */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-8 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4">
            <Eye className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">Our Vision</span>
          <p className="text-base md:text-lg text-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            To transform rural livelihoods and strengthen economic development across Tripura through sustainable landscape management, community-driven value chains, and inclusive growth — ensuring prosperity for present and future generations.
          </p>
        </div>

        {/* Objectives — icon grid */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" /> Key Objectives
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {objectives.map((obj) => (
              <div key={obj.title} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-sm transition">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <obj.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{obj.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{obj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}

/* ---- Mission ---- */
export function Mission() {
  const pillars = [
    { icon: Briefcase, title: "Livelihoods", desc: "Create sustainable income for 25,000+ households through high-value product chains.", color: "from-primary to-primary-light" },
    { icon: Mountain, title: "Landscape Restoration", desc: "Restore degraded lands for productive use and ecological balance.", color: "from-accent to-accent-hover" },
    { icon: Handshake, title: "Community Empowerment", desc: "Strengthen JFMCs, SHGs and village committees across all districts.", color: "from-primary to-primary-light" },
    { icon: Zap, title: "Innovation & Technology", desc: "Adopt GIS, drones and digital monitoring for transparent implementation.", color: "from-accent to-accent-hover" },
  ];

  return (
    <AboutLayout title="Mission & Objective" subtitle="Action-oriented commitments of the ELEMENT programme">
      <div className="space-y-8">
        {/* Mission statement */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-8 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center mb-4">
            <Lightbulb className="h-7 w-7 text-accent-foreground" />
          </div>
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">Our Mission</span>
          <p className="text-base md:text-lg text-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            To deliver transparent, community-centric development through capacity-building, technology adoption, value chain strengthening, and partnerships with communities, enterprises, and institutions across Tripura.
          </p>
        </div>

        {/* Mission pillars */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" /> Mission Pillars
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {pillars.map((p) => (
              <div key={p.title} className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition group">
                <div className={`mx-auto h-12 w-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <p.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}
