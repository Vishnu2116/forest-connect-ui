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

/* ---- Organization Structure — Flowchart ---- */
const orgNodes = [
  { id: "got", label: "Government of Tripura", role: "Apex Authority", name: "Hon'ble Chief Minister" },
  { id: "psc", label: "Project Steering Committee", role: "Strategic Oversight", name: "Chief Secretary (Chair)" },
  { id: "sfda", label: "State Forest Development Agency", role: "Nodal Agency", name: "Principal Secretary, Forests" },
  { id: "pmu", label: "Project Management Unit", role: "Implementation Lead", name: "Project Director (PCCF-rank)" },
  { id: "du", label: "District Units", role: "Field Coordination", name: "DFOs / District Coordinators" },
  { id: "vlc", label: "Village Level Committees", role: "Community Implementation", name: "Community Leaders / JFMC Chairs" },
];

export function Organization() {
  return (
    <AboutLayout title="Organization Structure" subtitle="Governance and implementation framework of the ELEMENT programme">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          The ELEMENT programme operates through a multi-tier governance framework ensuring effective implementation from state-level policy to village-level action.
        </p>

        {/* Flowchart */}
        <div className="flex flex-col items-center gap-0">
          {orgNodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center">
              {/* Connector line */}
              {i > 0 && (
                <div className="w-px h-6 bg-primary/30" />
              )}
              {/* Node */}
              <div className={`w-full max-w-md border rounded-lg p-4 text-center transition hover:shadow-md ${
                i === 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/40"
              }`}>
                <h4 className={`text-sm font-bold ${i === 0 ? "text-primary-foreground" : "text-primary"}`}>{node.label}</h4>
                <p className={`text-xs mt-1 ${i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{node.role} · {node.name}</p>
              </div>
              {/* Arrow head */}
              {i < orgNodes.length - 1 && (
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary/30 mt-0" />
              )}
            </div>
          ))}
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
    { icon: Sprout, title: "Sustainable Livelihoods" },
    { icon: Users, title: "Strong Community Institutions" },
    { icon: Mountain, title: "Restored Landscapes" },
    { icon: Shield, title: "Climate Resilience" },
    { icon: TrendingUp, title: "Market Access for All" },
  ];

  return (
    <AboutLayout title="Vision & Objective" subtitle="Building a prosperous, resilient and inclusive Tripura">
      <div className="space-y-10">
        {/* Vision statement — clean hero */}
        <div className="text-center py-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-5 shadow-md">
            <Eye className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">Our Vision</span>
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 max-w-xl mx-auto leading-snug">
            A prosperous Tripura with <span className="text-accent">resilient landscapes</span> and <span className="text-accent">thriving communities</span>
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Sustainable growth through community-driven value chains and inclusive economic development across all 8 districts.
          </p>
        </div>

        <hr className="border-border/60" />

        {/* Objectives — minimal icon row */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" /> Key Objectives
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {objectives.map((obj) => (
              <div key={obj.title} className="flex flex-col items-center text-center p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <obj.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground leading-snug">{obj.title}</span>
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
    { icon: Briefcase, title: "Livelihoods", highlight: "25,000+ households", color: "from-primary to-primary-light" },
    { icon: Mountain, title: "Landscape Restoration", highlight: "18,500 hectares", color: "from-accent to-accent-hover" },
    { icon: Handshake, title: "Community Empowerment", highlight: "JFMCs, SHGs & VLCs", color: "from-primary to-primary-light" },
    { icon: Zap, title: "Innovation & Technology", highlight: "GIS, drones & digital M&E", color: "from-accent to-accent-hover" },
  ];

  return (
    <AboutLayout title="Mission & Objective" subtitle="Action-oriented commitments of the ELEMENT programme">
      <div className="space-y-10">
        {/* Mission statement — clean */}
        <div className="text-center py-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center mb-5 shadow-md">
            <Lightbulb className="h-8 w-8 text-accent-foreground" />
          </div>
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">Our Mission</span>
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 max-w-xl mx-auto leading-snug">
            Deliver <span className="text-accent">transparent</span>, <span className="text-accent">community-centric</span> development across Tripura
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Capacity-building, technology adoption, and value chain strengthening — in partnership with communities, enterprises, and institutions.
          </p>
        </div>

        <hr className="border-border/60" />

        {/* Mission pillars — compact cards with highlight */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" /> Mission Pillars
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <div key={p.title} className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 hover:shadow-sm transition">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0`}>
                  <p.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                  <span className="text-xs text-accent font-semibold">{p.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}
