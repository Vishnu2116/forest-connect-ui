import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import {
  Phone,
  Mail,
  User,
  ChevronRight,
  X,
  Briefcase,
  TrendingUp,
  Mountain,
  Handshake,
  Sprout,
  Eye,
  Target,
  Lightbulb,
  Globe,
  Shield,
  Leaf,
  Users,
  Compass,
  Award,
  BookOpen,
  Zap,
  FileText,
  Download,
  Search,
  MapPin,
  Smartphone,
} from "lucide-react";
import {
  officials,
  governmentLeaders,
  elementLeadership,
  type Official,
} from "@/data/content";

import Honnareddy from "@/assets/dignitaries/Honnareddy.jpeg";
import cmImage from "@/assets/dignitaries/CM.jpeg";
import Animesh from "@/assets/dignitaries/Animesh.jpeg";
import CS from "@/assets/dignitaries/CS.jpg";
import SanjibDas from "@/assets/dignitaries/SanjibDas.png";

const aboutLinks = [
  { to: "/about", title: "About ELEMENT" },
  { to: "/about/organization", title: "Organization Structure" },
  { to: "/about/whos-who", title: "Who's Who" },
  { to: "/about/memorandum", title: "Memorandum of Association" },
  { to: "/about/directory", title: "Official Directory" },
  { to: "/about/vision", title: "Vision & Objective" },
  { to: "/about/mission", title: "Mission & Objective" },
];

function AboutLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const { pathname } = useLocation();
  return (
    <PageLayout>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumb={["Home", "About", title]}
      />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase">
              About
            </h3>
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
    <AboutLayout
      title="About ELEMENT"
      subtitle="A joint initiative for landscape development, livelihood generation and economic transformation"
    >
      <div className="space-y-8">
        {/* Grand intro */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-8 shadow-card text-center">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            About the Programme
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            What is ELEMENT?
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            <strong>ELEMENT</strong> (Enhancing Landscape and Ecosystem
            Management) is a flagship joint initiative of the{" "}
            <strong>Government of Tripura</strong> and the{" "}
            <strong>World Bank</strong> — transforming rural livelihoods,
            strengthening economic development, and building resilient
            landscapes across all 8 districts.
          </p>
        </div>
        {/* Pillar cards — infographic style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Briefcase,
              label: "Livelihood Generation",
              stat: "25,000+",
              statLabel: "Households",
              desc: "Sustainable income through bamboo, agar and broom-grass value chains.",
              gradient: "from-primary to-primary-light",
            },
            {
              icon: TrendingUp,
              label: "Economic Transformation",
              stat: "₹45 Cr+",
              statLabel: "Investment",
              desc: "Enterprise development, producer collectives and market linkages.",
              gradient: "from-accent to-accent-hover",
            },
            {
              icon: Mountain,
              label: "Landscape Restoration",
              stat: "18,500",
              statLabel: "Hectares",
              desc: "Science-based restoration of degraded lands for productivity.",
              gradient: "from-primary to-primary-light",
            },
            {
              icon: Handshake,
              label: "Community Development",
              stat: "12,000+",
              statLabel: "SHG Members",
              desc: "Empowering local communities as active partners in planning.",
              gradient: "from-accent to-accent-hover",
            },
            {
              icon: Sprout,
              label: "Sustainable Rural Economy",
              stat: "8",
              statLabel: "Districts",
              desc: "Building long-term climate-resilient and inclusive growth across Tripura.",
              gradient: "from-primary to-primary-light",
            },
          ].map((p) => (
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
        {/* Key Highlights
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Key Highlights
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Covers all 8 districts of Tripura",
              "Benefits 25,000+ households through livelihood support",
              "12,000+ SHG members engaged in value chain activities",
              "Focus on economic transformation, not just afforestation",
              "Implemented by Government of Tripura with World Bank support",
              "Landscape-based approach integrating livelihood and restoration",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 bg-card border border-border rounded-md p-3"
              >
                <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </AboutLayout>
  );
}

/* ---- Organization Structure — Flowchart ---- */
const orgNodes = [
  {
    id: "got",
    label: "Government of Tripura",
    role: "Apex Authority",
    name: "Hon'ble Chief Minister",
    designation: "Chief Minister, Tripura",
    description:
      "Provides overall policy direction and governance for ELEMENT through the State Government machinery.",
  },
  {
    id: "psc",
    label: "Project Steering Committee",
    role: "Strategic Oversight",
    name: "Chief Secretary (Chair)",
    designation: "Chief Secretary, Government of Tripura",
    description:
      "High-level inter-departmental committee that provides strategic direction, reviews progress, and ensures inter-agency coordination.",
  },
  {
    id: "sfda",
    label: "State Forest Development Agency",
    role: "Nodal Agency",
    name: "Principal Secretary, Forests",
    designation: "Administrative Head",
    description:
      "Acts as the nodal agency for channeling funds, monitoring implementation, and providing administrative support to the PMU.",
  },
  {
    id: "pmu",
    label: "Project Management Unit",
    role: "Implementation Lead",
    name: "Project Director (PCCF-rank)",
    designation: "Project Director, ELEMENT",
    description:
      "Central unit responsible for day-to-day management, procurement, financial management, M&E, and coordination with all implementing units.",
  },
  {
    id: "du",
    label: "District Units",
    role: "Field Coordination",
    name: "DFOs / District Coordinators",
    designation: "District-level Officers",
    description:
      "Coordinate implementation at district level, manage sub-projects, supervise field teams, and liaise with local government bodies.",
  },
  {
    id: "vlc",
    label: "Village Level Committees",
    role: "Community Implementation",
    name: "Community Leaders / JFMC Chairs",
    designation: "Village-level Representatives",
    description:
      "Grassroots bodies that plan and implement livelihood activities, plantation works, and community development initiatives at village level.",
  },
];

export function Organization() {
  const [selected, setSelected] = useState<(typeof orgNodes)[0] | null>(null);

  return (
    <AboutLayout
      title="Organization Structure"
      subtitle="Governance and implementation framework of the ELEMENT programme"
    >
      <div className="space-y-8">
        {/* Header intro */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Institutional Framework
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            ELEMENT Governance Structure
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            A multi-tier governance framework ensuring effective implementation
            from state-level policy to village-level action.
          </p>
        </div>

        {/* Flowchart */}
        <div className="flex flex-col items-center gap-0">
          {orgNodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center">
              {i > 0 && <div className="w-px h-6 bg-primary/30" />}
              <button
                onClick={() =>
                  setSelected(selected?.id === node.id ? null : node)
                }
                className={`w-full max-w-md border rounded-lg p-4 text-center transition cursor-pointer ${
                  i === 0
                    ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                    : selected?.id === node.id
                      ? "bg-accent/5 border-accent shadow-sm"
                      : "bg-card border-border hover:border-primary/40 hover:shadow-md"
                }`}
              >
                <h4
                  className={`text-sm font-bold ${i === 0 ? "text-primary-foreground" : "text-primary"}`}
                >
                  {node.label}
                </h4>
                <p
                  className={`text-xs mt-1 ${i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {node.role} · {node.name}
                </p>
              </button>
              {i < orgNodes.length - 1 && (
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary/30 mt-0" />
              )}
            </div>
          ))}
        </div>

        {/* Selected node detail */}
        {selected && (
          <div className="bg-card border border-accent/30 rounded-xl p-6 shadow-card animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-bold text-primary">
                  {selected.label}
                </h4>
                <p className="text-xs text-accent font-semibold mt-0.5">
                  {selected.role}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded hover:bg-surface"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selected.description}
            </p>
            <div className="mt-3 pt-3 border-t border-border/60 flex gap-4 text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">Name:</span>{" "}
                {selected.name}
              </span>
              <span>
                <span className="font-medium text-foreground">
                  Designation:
                </span>{" "}
                {selected.designation}
              </span>
            </div>
          </div>
        )}
      </div>
    </AboutLayout>
  );
}

/* ---- Who's Who ---- */

const govLeadersWithImages = [
  { ...governmentLeaders[0], image: cmImage },
  { ...governmentLeaders[1], image: Animesh },
  { ...governmentLeaders[2], image: CS },
];

function OfficialCard({ o, onClick }: { o: Official; onClick?: () => void }) {
  return (
    <article
      className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-primary/30 transition cursor-pointer group"
      onClick={onClick}
    >
      <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform overflow-hidden">
        {o.image ? (
          <img
            src={o.image}
            alt={o.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-8 w-8" />
        )}
      </div>
      <h3 className="mt-4 font-bold text-sm text-primary">{o.name}</h3>
      <p className="text-xs text-foreground font-semibold mt-1">
        {o.designation}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{o.department}</p>
      {onClick && (
        <div className="mt-3 text-xs text-accent font-semibold group-hover:underline">
          View Profile →
        </div>
      )}
    </article>
  );
}

export function WhosWhoSection() {
  const [selected, setSelected] = useState<Official | null>(null);

  return (
    <AboutLayout
      title="Who's Who"
      subtitle="Leadership team driving the ELEMENT programme"
    >
      <div className="space-y-8">
        {/* Intro */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Leadership
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            Programme Leadership
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Meet the senior officials and programme leaders steering the ELEMENT
            initiative.
          </p>
        </div>

        {/* Government Leadership */}
        {/* <div>
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" /> Government Leadership
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {govLeadersWithImages.map((o) => (
              <OfficialCard key={o.name} o={o} />
            ))}
          </div>
        </div> */}

        {/* ELEMENT Project Leadership */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-accent" /> ELEMENT Project
            Leadership
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {elementLeadership.map((o) => (
              <OfficialCard key={o.name} o={o} onClick={() => setSelected(o)} />
            ))}
          </div>
        </div>
      </div>

      {/* Detail overlay */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card rounded-xl shadow-elevated max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-surface"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground overflow-hidden">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-9 w-9" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold text-primary">
                {selected.name}
              </h3>
              <p className="text-sm text-foreground font-semibold mt-1">
                {selected.designation}
              </p>
              {selected.additionalRoles && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selected.additionalRoles}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-muted-foreground text-left">
                {selected.office && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />{" "}
                    <span>{selected.office}</span>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> {selected.phone}
                  </div>
                )}
                {selected.mobile && (
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />{" "}
                    {selected.mobile}
                  </div>
                )}
                {selected.emails && selected.emails.length > 0 ? (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      {selected.emails.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="block text-primary hover:underline"
                        >
                          {e}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : selected.email ? (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />{" "}
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-primary hover:underline"
                    >
                      {selected.email}
                    </a>
                  </div>
                ) : null}
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
    <AboutLayout
      title="Vision & Objective"
      subtitle="Building a prosperous, resilient and inclusive Tripura"
    >
      <div className="space-y-8">
        {/* Vision statement */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Our Vision
          </span>
          <p className="text-base text-foreground leading-relaxed font-medium">
            To transform rural livelihoods and strengthen economic development
            across Tripura through sustainable landscape management,
            community-driven value chains, and inclusive growth — ensuring
            prosperity for present and future generations.
          </p>
        </div>

        {/* Objectives */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">
            Key Objectives
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Generate sustainable livelihoods through value chain development",
              "Strengthen community-based institutions and local governance",
              "Restore degraded landscapes for long-term economic productivity",
              "Build climate resilience through adaptive land management",
              "Improve market access and enterprise opportunities for rural communities",
            ].map((obj) => (
              <div
                key={obj}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {obj}
                </p>
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
  return (
    <AboutLayout
      title="Mission & Objective"
      subtitle="Action-oriented commitments of the ELEMENT programme"
    >
      <div className="space-y-8">
        {/* Mission statement */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Our Mission
          </span>
          <p className="text-base text-foreground leading-relaxed font-medium">
            To deliver transparent, community-centric development through
            capacity-building, technology adoption, value chain strengthening,
            and partnerships with communities, enterprises, and institutions
            across Tripura.
          </p>
        </div>

        {/* Mission pillars */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">
            Mission Pillars
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                title: "Livelihoods",
                desc: "Create sustainable income for 25,000+ households through high-value product chains.",
              },
              {
                title: "Landscape Restoration",
                desc: "Restore degraded lands for productive use and ecological balance.",
              },
              {
                title: "Community Empowerment",
                desc: "Strengthen JFMCs, SHGs and village committees across all districts.",
              },
              {
                title: "Innovation & Technology",
                desc: "Adopt GIS, drones and digital monitoring for transparent implementation.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition"
              >
                <h4 className="text-sm font-bold text-foreground mb-1">
                  {p.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}

/* ---- Memorandum of Association ---- */
export function Memorandum() {
  return (
    <AboutLayout
      title="Memorandum of Association"
      subtitle="Founding documents and governance framework of ELEMENT"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Official Document
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            Memorandum of Association
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            The founding document establishing the governance, objectives, and
            operational framework of the ELEMENT programme.
          </p>
        </div>

        {/* Document card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-start gap-5">
            <div className="h-20 w-16 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center shrink-0">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-foreground">
                ELEMENT Programme — Memorandum of Association
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Government of Tripura · Registered under Societies Registration
                Act
              </p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                This document outlines the constitution, governance structure,
                and operational mandate of the ELEMENT programme under the aegis
                of the Government of Tripura in partnership with the World Bank.
              </p>
              <div className="flex gap-3 mt-4">
                <button className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm font-semibold transition">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
                <button className="inline-flex items-center gap-1.5 border border-primary text-primary hover:bg-primary/5 px-4 py-2 rounded text-sm font-semibold transition">
                  <Eye className="h-4 w-4" /> View Document
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key highlights */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">
            Key Highlights
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                title: "Registered Society",
                desc: "Established as a registered society under the Societies Registration Act for autonomous programme management.",
              },
              {
                title: "Governance Structure",
                desc: "Multi-tier governance with Project Steering Committee, Governing Body, and Executive Committee.",
              },
              {
                title: "Objectives",
                desc: "Landscape restoration, livelihood generation, community empowerment, and economic transformation across Tripura.",
              },
              {
                title: "Financial Framework",
                desc: "World Bank-funded with Government of Tripura counterpart contribution and transparent fund flow mechanism.",
              },
              {
                title: "Implementation Authority",
                desc: "State Forest Development Agency (SFDA) as nodal agency with Project Management Unit for day-to-day operations.",
              },
              {
                title: "Amendment Provisions",
                desc: "MOA can be amended with approval of the Governing Body and prior consent of the World Bank.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition"
              >
                <h4 className="text-sm font-bold text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}

/* ---- Official Directory ---- */

const govLeaderImages: Record<string, string> = {
  "Shri Manik Saha": cmImage,
  "Shri Animesh Debbarma": Animesh,
  "Shri J.K. Sinha, IAS": CS,
  "Dr. Honnareddy N, IFS": Honnareddy,
  "Shri Sanjib Das, IFS": SanjibDas,
};

const directoryCategories = [
  // {
  //   title: "Senior Government Leadership",
  //   entries: [
  //     {
  //       name: "Shri Manik Saha",
  //       designation: "Hon'ble Chief Minister",
  //       division: "Government of Tripura",
  //       phone: "",
  //       email: "",
  //       mobile: "",
  //     },
  //     {
  //       name: "Shri Animesh Debbarma",
  //       designation: "Forest & Environment Minister",
  //       division: "Government of Tripura",
  //       phone: "",
  //       email: "",
  //       mobile: "",
  //     },
  //     {
  //       name: "Shri J.K. Sinha, IAS",
  //       designation: "Chief Secretary",
  //       division: "Government of Tripura",
  //       phone: "",
  //       email: "",
  //       mobile: "",
  //     },
  //   ],
  // },
  {
    title: "ELEMENT Project Leadership",
    entries: [
      {
        name: "PCCF HOFF",
        designation: "SFDA Chair Person",
        division: "Aranya Bhawan, Pt. Nehru Complex, Agartala",
        phone: "",
        email: "",
        mobile: "",
      },
      {
        name: "PCCF CEO / PD",
        designation: "CEO & Project Director, ELEMENT Project",
        division: "Aranya Bhawan, Pt. Nehru Complex, Agartala",
        phone: "",
        email: "",
        mobile: "",
      },
      {
        name: "Shri Chaitanya Murti, IFS",
        designation: "CEO & Project Director, ELEMENT Project",
        division: "Aranya Bhawan, Pt. Nehru Complex, Agartala",
        phone: "0381-2326874",
        email: "cwlw.tfd-tr@gov.in",
        mobile: "9717403877",
      },
      {
        name: "Dr. Honnareddy N, IFS",
        designation: "Addl. CEO (ELEMENT Project)",
        division: "Aranya Bhawan, Pt. Nehru Complex, Agartala",
        phone: "",
        email: "honnareddy.n@gov.in",
        mobile: "99971518296",
      },
      {
        name: "Shri Sanjib Das, IFS",
        designation: "Director (Project ELEMENT)",
        division: "Aranya Bhawan, Pt. Nehru Complex, Agartala",
        phone: "",
        email: "ccfttripura@gmail.com",
        mobile: "7630049150",
      },
    ],
  },
  {
    title: "Directors & Division Heads",
    entries: [
      {
        name: "Shri Krishna Gopal Roy, IFS",
        designation: "Director (Community Institution, Capacity Building, KM)",
        division: "ELEMENT Project FHQ, Aranya Bhawan, Agartala",
        phone: "",
        email: "krishnagopalr78@gmail.com",
        mobile: "7005447409",
      },
      {
        name: "Shri Amalendu Debnath, IFS",
        designation: "Director (Value Chain Innovation & Eco Tourism)",
        division: "ELEMENT Project FHQ, Aranya Bhawan, Agartala",
        phone: "",
        email: "elementtripuraforest@gmail.com",
        mobile: "8415924070",
      },
      {
        name: "Shri Jaya Krishnan V, IFS",
        designation: "Director (Administration, Procurement & Finance)",
        division: "ELEMENT Project",
        phone: "",
        email: "",
        mobile: "",
      },
      {
        name: "Shri Naresh Jamatia, IFS",
        designation: "Director (SFM) / DCF (Wildlife)",
        division: "Aranya Bhawan, Agartala",
        phone: "",
        email: "dcfwildlife2025@gmail.com",
        mobile: "8131843631",
      },
    ],
  },
];

export function OfficialDirectory() {
  const [search, setSearch] = useState("");

  const filteredCategories = directoryCategories
    .map((cat) => ({
      ...cat,
      entries: cat.entries.filter((e) =>
        `${e.name} ${e.designation} ${e.division}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.entries.length > 0);

  return (
    <AboutLayout
      title="Official Directory"
      subtitle="Contact details of ELEMENT programme officials"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Directory
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            Official Directory
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Contact information for key ELEMENT programme officials across
            departments.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, designation or division..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Categorized directory as tables */}
        {filteredCategories.map((cat) => (
          <div key={cat.title}>
            <h3 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" /> {cat.title}
            </h3>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/5 border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Official
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Designation
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Division / Office
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Mobile
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cat.entries.map((entry) => {
                    const img = govLeaderImages[entry.name] || "";
                    return (
                      <tr
                        key={entry.name}
                        className="border-b border-border last:border-b-0 hover:bg-muted/30 transition"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground shrink-0 overflow-hidden">
                              {img ? (
                                <img
                                  src={img}
                                  alt={entry.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <span className="font-semibold text-foreground whitespace-nowrap">
                              {entry.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {entry.designation}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {entry.division || "—"}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {entry.phone || "—"}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {entry.mobile || "—"}
                        </td>
                        <td className="py-3 px-4">
                          {entry.email ? (
                            <a
                              href={`mailto:${entry.email}`}
                              className="text-primary hover:underline whitespace-nowrap"
                            >
                              {entry.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {cat.entries.map((entry) => {
                const img = govLeaderImages[entry.name] || "";
                return (
                  <div
                    key={entry.name}
                    className="bg-card border border-border rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground shrink-0 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={entry.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">
                          {entry.name}
                        </h4>
                        <p className="text-xs text-primary font-medium">
                          {entry.designation}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      {entry.division && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{entry.division}</span>
                        </div>
                      )}
                      {entry.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{entry.phone}</span>
                        </div>
                      )}
                      {entry.mobile && (
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-3.5 w-3.5 shrink-0" />
                          <span>{entry.mobile}</span>
                        </div>
                      )}
                      {entry.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <a
                            href={`mailto:${entry.email}`}
                            className="text-primary hover:underline"
                          >
                            {entry.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No officials found matching your search.
          </p>
        )}
      </div>
    </AboutLayout>
  );
}
