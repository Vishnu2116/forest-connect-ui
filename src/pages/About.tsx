import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchGrouped,
  resolvePhoto,
  type OfficialCategoryGroup,
  type ApiOfficial,
} from "@/lib/officials";
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
import forestBg from "@/assets/forest.png";
import heroWaterShedBg from "@/assets/hero-watershed.jpg";

function AboutLayout({
  title,
  subtitle,
  children,
  backgroundImage,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  backgroundImage?: string;
}) {
  return (
    <PageLayout>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumb={["Home", "About", title]}
      />
      {/* Background sits on the <section> so it is truly full-bleed —
          no container padding or child margin can create white gaps */}
      <section
        className="py-12 relative"
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        {/* Scrim — only visible in the gaps between cards, never behind text */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-black/35 pointer-events-none"
            aria-hidden="true"
          />
        )}
        <div className="gov-container relative">
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </PageLayout>
  );
}

/* ---- About PROJECT ELEMENT (main intro page) ---- */
export function AboutElement() {
  const stakeholders = [
    {
      icon: Shield,
      title: "Government of Tripura",
      desc: "Provides overall policy direction, governance, counterpart funding, and inter-departmental coordination across all 8 districts.",
    },
    {
      icon: Globe,
      title: "The World Bank",
      desc: "Lead development partner — providing financial support, technical assistance, global expertise, and result-based monitoring frameworks.",
    },
    {
      icon: Leaf,
      title: "Tripura Forest Department",
      desc: "Nodal implementing department responsible for landscape restoration, biodiversity conservation and on-ground project delivery.",
    },
    {
      icon: Briefcase,
      title: "State Forest Development Agency (SFDA)",
      desc: "Apex implementing society channelling project funds, monitoring implementation and providing administrative oversight.",
    },
    {
      icon: Compass,
      title: "Project Management Unit (PMU)",
      desc: "Central unit handling day-to-day project management, procurement, finance, M&E, MIS/GIS, and coordination with field units.",
    },
    {
      icon: Users,
      title: "Community Institutions (JFMCs, SHGs, VLCs)",
      desc: "Grassroots partners — Joint Forest Management Committees, Self-Help Groups and Village-Level Committees driving local implementation.",
    },
    {
      icon: Sprout,
      title: "Farmers, Producers & Local Enterprises",
      desc: "Primary beneficiaries engaged in bamboo, agar, broom-grass and NTFP value chains, eco-tourism and producer collectives.",
    },
    {
      icon: BookOpen,
      title: "Knowledge & Technical Partners",
      desc: "Research institutions, technical agencies and NGOs supporting capacity building, training, IEC and thematic studies.",
    },
  ];

  return (
    <AboutLayout
      title="About PROJECT ELEMENT"
      subtitle="A joint initiative for landscape development, livelihood generation and economic transformation"
      backgroundImage={heroWaterShedBg}
    >
      <div className="space-y-10">
        {/* What is PROJECT ELEMENT? */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block bg-accent/10 text-accent text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              About the Project
            </span>

            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-5">
              What is PROJECT ELEMENT?
            </h3>
          </div>

          <div className="space-y-4 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
            <p>
              The “Enhancing Landscape and Ecosystem Management (ELEMENT)”
              Project is proposed with an overarching objective to increase the
              resilience of landscapes and forest-dependent communities in the
              North-Eastern Region of India starting with the two states of
              Tripura and Nagaland. Project is structured in a way that provides
              an opportunity.
            </p>

            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Promoting the development of forests and thereby increase the
                carbon sink potential,
              </li>
              <li>
                Provision of alternate livelihood for agriculture and forest
                dependent tribal communities,
              </li>
              <li>
                Capacity Building of both Government and communities,
                development of forest value chains for private sector
                participation and increased earnings from forestry sector, and
              </li>
              <li>
                Research and development of knowledge products to enhance long
                term innovation and growth.
              </li>
            </ul>

            <div>
              <p className="font-semibold text-foreground mb-2">Scope</p>

              <p>
                The ELEMENT project focuses on protecting and restoring
                landscapes, increasing forest cover, and improving livelihood
                options for local communities. It aims to enhance forest quality
                and productivity by developing and strengthening community
                institutions, thereby improving ecosystem services through
                integrated and sustainable land-use practices, such as enhanced
                tree cover and soil moisture retention.
              </p>
            </div>

            <p>
              The project will also provide training to strengthen the capacity
              of state institutions, including the Forest Department, line
              departments, research and academic institutions, as well as other
              stakeholders like JFMCs, SHGs, marginalized groups, civil society,
              and the private sector.
            </p>

            <p>
              Additionally, the project will invest in developing robust systems
              for project management and monitoring to ensure efficient
              implementation and track progress.
            </p>
          </div>
        </div>

        {/* Compact stats grid */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { icon: Briefcase, stat: "25,000+", label: "Households" },
            { icon: TrendingUp, stat: "₹45 Cr+", label: "Investment" },
            { icon: Mountain, stat: "18,500", label: "Hectares" },
            { icon: Handshake, stat: "12,000+", label: "SHG Members" },
            { icon: Sprout, stat: "8", label: "Districts" },
          ].map((p) => (
            <div
              key={p.label}
              className="bg-card border border-border rounded-lg p-3 text-center hover:shadow-sm transition"
            >
              <p.icon className="h-5 w-5 mx-auto text-accent" />
              <div className="text-lg font-bold text-primary mt-1.5">
                {p.stat}
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {p.label}
              </div>
            </div>
          ))}
        </div> */}
        {/* Project beneficiaries stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Sprout, stat: "821", label: "Villages" },
            { icon: Handshake, stat: "75,000", label: "Direct Beneficiaries" },
            { icon: Briefcase, stat: "1,48,800", label: "Households" },
          ].map((p) => (
            <div
              key={p.label}
              className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-sm transition"
            >
              <p.icon className="h-6 w-6 mx-auto text-accent" />
              <div className="text-2xl font-bold text-primary mt-2">
                {p.stat}
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                {p.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stakeholders */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 text-center">
            Stakeholders of PROJECT ELEMENT
          </h3>
          <p className="text-sm md:text-[15px] text-muted-foreground mb-5 leading-relaxed">
            PROJECT ELEMENT is implemented through a strong partnership of
            government, development partners, technical institutions and
            community organisations — each playing a defined role in landscape
            restoration, livelihood transformation and inclusive growth.
          </p>

          <div className="space-y-5 text-sm md:text-[15px] text-foreground leading-relaxed">
            <div>
              <h4 className="font-semibold text-primary mb-1">
                Government of Tripura
              </h4>
              <p className="text-muted-foreground">
                Provides overall policy direction, governance, counterpart
                funding, and inter-departmental coordination across all 8
                districts of the State.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">
                The World Bank
              </h4>
              <p className="text-muted-foreground">
                Lead development partner providing financial support, technical
                assistance, global expertise, and result-based monitoring
                frameworks for the project.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">
                Tripura Forest Department
              </h4>
              <p className="text-muted-foreground">
                Nodal implementing department responsible for landscape
                restoration, biodiversity conservation, and on-ground project
                delivery across the State.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">
                State Forest Development Agency (SFDA)
              </h4>
              <p className="text-muted-foreground">
                Apex implementing society channelling project funds, monitoring
                implementation, and providing administrative oversight.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">
                Project Management Unit (PMU)
              </h4>
              <p className="text-muted-foreground">
                Central unit handling day-to-day project management,
                procurement, finance, M&amp;E, MIS/GIS, and coordination with
                field units.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">
                Community Institutions
              </h4>
              <p className="text-muted-foreground mb-2">
                Grassroots partners driving local-level planning and
                implementation:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Joint Forest Management Committees (JFMCs)</li>
                <li>Self-Help Groups (SHGs)</li>
                <li>Village-Level Committees (VLCs)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">
                Farmers, Producers &amp; Local Enterprises
              </h4>
              <p className="text-muted-foreground">
                Primary beneficiaries engaged in bamboo, agar, broom-grass and
                NTFP value chains, eco-tourism initiatives, and producer
                collectives.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">
                Knowledge &amp; Technical Partners
              </h4>
              <p className="text-muted-foreground">
                Research institutions, technical agencies, and NGOs supporting
                capacity building, training programmes, IEC initiatives, and
                thematic studies.
              </p>
            </div>
          </div>
        </div>

        {/* Objectives section — moved from separate /about/objectives page per request */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
          <div className="text-center mb-6">
            <span className="inline-block bg-accent/10 text-accent text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Objectives
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Key Objectives of PROJECT ELEMENT
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              The project objectives are to “Improve landscape management and
              increase benefits for targeted forest dependent communities". The
              project objectives include the following sub-objectives:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "To protect and restore the degraded forest landscapes in Tripura.",
              "To increase forest and tree-based livelihood options for the community and a sustained stream of high-value forest products like Agar, Bamboo, other NTFPs and building up of carbon stock in and outside forests.",
              "To improve the quality of forest cover from open forests to moderately dense forests and moderately dense to very dense forest.",
              "To enhance that productivity of forests by developing and strengthening community institutions thereby enhancing the ecosystem services through integrated and sustainable land use practices such as improved tree cover and soil moisture.",
            ].map((obj) => (
              <div
                key={obj}
                className="flex items-start gap-2 bg-surface border border-border rounded-lg p-3.5"
              >
                <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {obj}
                </span>
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
      subtitle="Governance and implementation framework of the PROJECT ELEMENT"
      backgroundImage={forestBg}
    >
      <div className="space-y-8">
        {/* Header intro */}
        <div className="bg-gradient-to-br from-white to-white/95 border border-border rounded-xl p-6 text-center shadow-sm">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
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
              {i > 0 && <div className="w-px h-6 bg-white/90" />}
              <button
                onClick={() =>
                  setSelected(selected?.id === node.id ? null : node)
                }
                className={`w-full max-w-md border rounded-lg p-4 text-center transition cursor-pointer ${
                  i === 0
                    ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                    : selected?.id === node.id
                      ? "bg-gray-200 border-accent shadow-sm"
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
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/90 mt-0" />
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
  const [groups, setGroups] = useState<OfficialCategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchGrouped("whos-who").then((g) => {
      if (alive) {
        setGroups(g);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AboutLayout
      title="Who's Who"
      subtitle="Leadership team driving the PROJECT ELEMENT"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Leadership
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            Project Leadership
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Meet the senior officials and project leaders steering the ELEMENT
            initiative.
          </p>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Loading…
          </p>
        )}

        {groups.map((cat) => (
          <div key={cat.category_id || cat.category_name}>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" /> {cat.category_name}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.officials.map((o) => (
                <ApiOfficialCard key={o.id} o={o} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AboutLayout>
  );
}

function ApiOfficialCard({ o }: { o: ApiOfficial }) {
  const img = resolvePhoto(o.photo_path);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-primary/30 transition cursor-pointer group block w-full"
      >
        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform overflow-hidden">
          {img ? (
            <img
              src={img}
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
        {o.organisation && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {o.organisation}
          </p>
        )}
        <div className="mt-3 text-xs text-accent font-semibold group-hover:underline">
          View Profile →
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="h-28 w-28 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground overflow-hidden shrink-0">
                  {img ? (
                    <img
                      src={img}
                      alt={o.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-primary">
                    {o.name}
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-foreground mt-1">
                    {o.designation}
                  </p>
                  {o.organisation && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {o.organisation}
                    </p>
                  )}
                  {o.category_name && (
                    <span className="inline-block mt-2 text-[11px] font-semibold uppercase tracking-wide bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                      {o.category_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-border space-y-2 text-sm text-muted-foreground">
                {o.division_office && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{o.division_office}</span>
                  </div>
                )}
                {o.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> {o.phone}
                  </div>
                )}
                {o.mobile && (
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" /> {o.mobile}
                  </div>
                )}
                {o.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a
                      href={`mailto:${o.email}`}
                      className="text-primary hover:underline break-all"
                    >
                      {o.email}
                    </a>
                  </div>
                )}
              </div>

              {o.bio && (
                <div className="mt-5 pt-5 border-t border-border">
                  <h3 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    Biography
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {o.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- Objectives ---- */
export function VisionMission() {
  const objectives = [
    "Generate sustainable livelihoods through high-value, climate-resilient value chains.",
    "Strengthen community-based institutions (JFMCs, SHGs, VLCs) and local governance.",
    "Restore degraded landscapes for long-term ecological and economic productivity.",
    "Build climate resilience through adaptive land and water management.",
    "Improve market access, enterprise opportunities and producer collectives.",
    "Adopt GIS, drones and digital MIS for transparent monitoring and decision-making.",
  ];
  return (
    <AboutLayout
      title="Objectives"
      subtitle="Key objectives driving PROJECT ELEMENT implementation across Tripura"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Objectives
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            Key Objectives of PROJECT ELEMENT
          </h3>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            The action-oriented commitments guiding landscape restoration,
            livelihood transformation and inclusive development across Tripura.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {objectives.map((obj) => (
            <div
              key={obj}
              className="flex items-start gap-2 bg-card border border-border rounded-lg p-3.5"
            >
              <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                {obj}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AboutLayout>
  );
}

/* ---- Loan Agreement ---- */
export function LoanAgreement() {
  return (
    <AboutLayout
      title="Loan Agreement"
      subtitle="Founding documents and governance framework of ELEMENT"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Official Document
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            Loan Agreement
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            The founding document establishing the governance, objectives, and
            operational framework of the PROJECT ELEMENT.
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
                PROJECT ELEMENT — Loan Agreement
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Government of Tripura · Registered under Societies Registration
                Act
              </p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                This document outlines the constitution, governance structure,
                and operational mandate of the PROJECT ELEMENT under the aegis
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

        {/* Key highlights
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">
            Key Highlights
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                title: "Registered Society",
                desc: "Established as a registered society under the Societies Registration Act for autonomous project management.",
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
                desc: "Loan Agreement can be amended with approval of the Governing Body and prior consent of the World Bank.",
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
        </div> */}
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
  {
    title: "PROJECT ELEMENT Leadership",
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
        designation: "CEO & Project Director, PROJECT ELEMENT",
        division: "Aranya Bhawan, Pt. Nehru Complex, Agartala",
        phone: "",
        email: "",
        mobile: "",
      },
      {
        name: "Shri Chaitanya Murti, IFS",
        designation: "CEO & Project Director, PROJECT ELEMENT",
        division: "Aranya Bhawan, Pt. Nehru Complex, Agartala",
        phone: "0381-2326874",
        email: "cwlw.tfd-tr@gov.in",
        mobile: "9717403877",
      },
      {
        name: "Dr. Honnareddy N, IFS",
        designation: "Addl. CEO (PROJECT ELEMENT)",
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
        division: "PROJECT ELEMENT FHQ, Aranya Bhawan, Agartala",
        phone: "",
        email: "krishnagopalr78@gmail.com",
        mobile: "7005447409",
      },
      {
        name: "Shri Amalendu Debnath, IFS",
        designation: "Director (Value Chain Innovation & Eco Tourism)",
        division: "PROJECT ELEMENT FHQ, Aranya Bhawan, Agartala",
        phone: "",
        email: "elementtripuraforest@gmail.com",
        mobile: "8415924070",
      },
      {
        name: "Shri Jaya Krishnan V, IFS",
        designation: "Director (Administration, Procurement & Finance)",
        division: "PROJECT ELEMENT",
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
  {
    title: "ISO — Implementation Support Organization",
    entries: [
      {
        name: "Dr. A. K. Singh, IFS",
        designation: "ISO Team Leader",
        division: "ISO Cell, Aranya Bhawan, Agartala",
        phone: "0381-2416000",
        email: "iso.element@gov.in",
        mobile: "9000000001",
      },
      {
        name: "Ms. Priya Nath",
        designation: "Sr. Specialist — Capacity Building",
        division: "ISO Cell, Aranya Bhawan, Agartala",
        phone: "",
        email: "priya.iso@gov.in",
        mobile: "9000000002",
      },
      {
        name: "Shri Ratan Debbarma",
        designation: "Specialist — Community Mobilisation",
        division: "ISO Cell, Aranya Bhawan, Agartala",
        phone: "",
        email: "ratan.iso@gov.in",
        mobile: "9000000003",
      },
    ],
  },
  {
    title: "PMU — Project Management Unit",
    entries: [
      {
        name: "Shri R. K. Sharma, IFS",
        designation: "Project Manager (PMU)",
        division: "PMU, Aranya Bhawan, Agartala",
        phone: "0381-2416010",
        email: "pmu.element@gov.in",
        mobile: "9000000010",
      },
      {
        name: "Ms. Anjali Roy",
        designation: "Procurement Specialist",
        division: "PMU, Aranya Bhawan, Agartala",
        phone: "",
        email: "procurement.pmu@gov.in",
        mobile: "9000000011",
      },
      {
        name: "Shri D. Chakraborty",
        designation: "Finance Specialist",
        division: "PMU, Aranya Bhawan, Agartala",
        phone: "",
        email: "finance.pmu@gov.in",
        mobile: "9000000012",
      },
      {
        name: "Ms. S. Reang",
        designation: "M&E Specialist",
        division: "PMU, Aranya Bhawan, Agartala",
        phone: "",
        email: "me.pmu@gov.in",
        mobile: "9000000013",
      },
    ],
  },
  {
    title: "PMC — Project Management Consultant",
    entries: [
      {
        name: "Shri Vivek Menon",
        designation: "Team Leader (PMC)",
        division: "PMC Office, Agartala",
        phone: "",
        email: "tl.pmc@element.gov.in",
        mobile: "9000000020",
      },
      {
        name: "Ms. Kavita Iyer",
        designation: "Sr. Landscape Specialist",
        division: "PMC Office, Agartala",
        phone: "",
        email: "landscape.pmc@element.gov.in",
        mobile: "9000000021",
      },
      {
        name: "Shri Amit Saha",
        designation: "GIS / MIS Specialist",
        division: "PMC Office, Agartala",
        phone: "",
        email: "gis.pmc@element.gov.in",
        mobile: "9000000022",
      },
    ],
  },
];

export function OfficialDirectory() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<OfficialCategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchGrouped("directory").then((g) => {
      if (alive) {
        setGroups(g);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((cat) => {
        const catMatch = (cat.category_name || "").toLowerCase().includes(q);
        const officials = catMatch
          ? cat.officials
          : cat.officials.filter((o) =>
              [
                o.name,
                o.designation,
                o.organisation,
                o.division_office,
                o.email,
                o.mobile,
                o.phone,
              ]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q)),
            );
        return { ...cat, officials };
      })
      .filter((cat) => cat.officials.length > 0);
  }, [groups, search]);

  return (
    <AboutLayout
      title="Official Directory"
      subtitle="Contact details of PROJECT ELEMENT officials"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-6 text-center">
          <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Directory
          </span>
          <h3 className="text-xl font-bold text-primary mb-2">
            Official Directory
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Contact information for key PROJECT ELEMENT officials across
            departments.
          </p>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, designation or division..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Loading…
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No results found.
          </p>
        )}

        {filtered.map((cat) => (
          <div key={cat.category_id || cat.category_name}>
            <h3 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" /> {cat.category_name}
            </h3>
            {/* Desktop table */}
            <div className="hidden md:block rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[12%]" />
                  <col className="w-[12%]" />
                  <col className="w-[16%]" />
                </colgroup>
                <thead>
                  <tr className="bg-primary/5 border-b border-border">
                    <th className="text-left py-3 px-3 font-semibold text-primary">
                      Official
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-primary">
                      Designation
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-primary">
                      Division / Office
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-primary">
                      Phone
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-primary">
                      Mobile
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-primary">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cat.officials.map((entry) => {
                    const img = resolvePhoto(entry.photo_path);
                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-border last:border-b-0 hover:bg-muted/30 transition align-middle"
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground shrink-0 overflow-hidden">
                              {img ? (
                                <img
                                  src={img}
                                  alt={entry.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="font-semibold text-foreground leading-snug whitespace-normal break-normal">
                                {entry.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-foreground break-words leading-snug">
                          {entry.designation}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground break-words leading-snug">
                          {entry.division_office || "—"}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground break-words">
                          {entry.phone || "—"}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground break-words">
                          {entry.mobile || "—"}
                        </td>
                        <td className="py-3 px-3">
                          {entry.email ? (
                            <a
                              href={`mailto:${entry.email}`}
                              className="text-primary hover:underline break-all"
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
              {cat.officials.map((entry) => {
                const img = resolvePhoto(entry.photo_path);
                return (
                  <div
                    key={entry.id}
                    className="bg-card border border-border rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground shrink-0 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={entry.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold text-sm text-foreground">
                          {entry.name}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      {entry.division_office && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{entry.division_office}</span>
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
      </div>
    </AboutLayout>
  );
}
