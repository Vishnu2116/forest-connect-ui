import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Phone, Mail, User, ChevronRight, X } from "lucide-react";
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
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-md p-6 shadow-card">
          <h3 className="text-xl font-semibold text-primary mb-3">What is ELEMENT?</h3>
          <p className="text-muted-foreground leading-relaxed">
            <strong>ELEMENT</strong> (Enhancing Landscape and Ecosystem Management) is a joint initiative of the <strong>Government of Tripura</strong> and the <strong>World Bank</strong>, aimed at transforming rural livelihoods, strengthening economic development, and building resilient landscapes across the state.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Unlike traditional forest programmes, ELEMENT takes a <strong>landscape-based approach</strong> that integrates livelihood generation, value chain development, community participation, and sustainable land management. The programme is designed to directly benefit communities through income enhancement, skill development, and access to markets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: "Livelihood Generation", desc: "Creating sustainable income opportunities through value chains of bamboo, agar, broom-grass and other high-value products." },
            { title: "Economic Development", desc: "Boosting rural economy through enterprise development, producer collectives and market linkages across all 8 districts." },
            { title: "Landscape Management", desc: "Science-based restoration and management of degraded landscapes for long-term productivity and climate resilience." },
            { title: "Community Participation", desc: "Empowering local communities, SHGs and village-level committees as active partners in planning and implementation." },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-md p-5 shadow-card">
              <h4 className="font-semibold text-primary mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-md p-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Key Highlights</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Covers all <strong>8 districts</strong> of Tripura</li>
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Benefits <strong>25,000+ households</strong> through livelihood support</li>
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" /> <strong>12,000+ SHG members</strong> engaged in value chain activities</li>
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Focus on <strong>economic transformation</strong>, not just afforestation</li>
            <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Implemented by <strong>Government of Tripura</strong> with World Bank support</li>
          </ul>
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
