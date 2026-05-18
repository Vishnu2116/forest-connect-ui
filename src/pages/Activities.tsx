import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import {
  Activity,
  TrendingUp,
  Trees,
  Users,
  Briefcase,
  BarChart3,
} from "lucide-react";

const outputs = [
  {
    icon: TrendingUp,
    label: "Livelihood Activities",
    value: "620+",
    note: "Across all 8 districts",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    label: "Households Benefited",
    value: "25,000+",
    note: "Community participation",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Briefcase,
    label: "SHG Members Engaged",
    value: "12,000+",
    note: "Value chain activities",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BarChart3,
    label: "Area Under Management",
    value: "18,500 Ha",
    note: "Landscape restoration",
    color: "bg-accent/10 text-accent",
  },
];

const activities = [
  {
    date: "Apr 2026",
    title: "Bamboo Value Chain Training — 500+ SHG members trained",
    desc: "Comprehensive skill-building on bamboo processing, product development and market linkages across Dhalai and Gomati.",
    icon: Briefcase,
  },
  {
    date: "Mar 2026",
    title: "Community Enterprise Centres launched in 6 districts",
    desc: "Fully equipped livelihood centres enabling local communities to process and market high-value products.",
    icon: Activity,
  },
  {
    date: "Feb 2026",
    title: "Stakeholder consultation on livelihood impact assessment",
    desc: "Review of Phase-I outcomes with community leaders, SHG heads and district-level officials.",
    icon: Users,
  },
  {
    date: "Jan 2026",
    title: "Community landscape restoration — 2,400 hectares completed",
    desc: "Community-led restoration of degraded landscapes integrating livelihood-oriented species across 4 districts.",
    icon: Trees,
  },
];

const activityAreas = [
  {
    title: "Value Chain Development",
    desc: "Bamboo, agar and broom-grass processing",
    icon: Briefcase,
  },
  {
    title: "Community Institution Building",
    desc: "Strengthening SHGs, JFMCs and VLCs",
    icon: Users,
  },
  {
    title: "Landscape Restoration",
    desc: "Community-led restoration with livelihood species",
    icon: Trees,
  },
  {
    title: "Skill Development",
    desc: "Training for youth, women and leaders",
    icon: TrendingUp,
  },
  {
    title: "Enterprise Support",
    desc: "Micro-enterprise and producer collectives",
    icon: Activity,
  },
  {
    title: "Monitoring & Evaluation",
    desc: "Digital M&E for transparent tracking",
    icon: BarChart3,
  },
];

export default function Activities() {
  return (
    <PageLayout>
      <PageHeader
        title="Activities & Outputs"
        subtitle="Key project activities and measurable outcomes"
        breadcrumb={["Home", "Activities & Outputs"]}
      />

      {/* Stats section */}
      <section className="bg-surface py-8 border-b border-border">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {outputs.map((o) => (
              <div
                key={o.label}
                className="bg-card border border-border rounded-md p-5 shadow-card"
              >
                <div className={`p-2.5 rounded-lg w-fit ${o.color}`}>
                  <o.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-3xl font-bold text-primary">
                  {o.value}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {o.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {o.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="gov-container">
          <h2 className="section-title mt-2 mb-8">Recent Activities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {activities.map((a) => (
              <article
                key={a.title}
                className="bg-card border border-border rounded-md p-6 shadow-card hover:border-primary/40 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-accent uppercase mb-1">
                      {a.date}
                    </div>
                    <h3 className="font-semibold text-primary leading-snug">
                      {a.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {a.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Key Activity Areas — Wheel */}
          <div className="mt-16 mb-4">
            <h3 className="text-lg font-semibold text-primary mb-10 text-center">
              Key Activity Areas
            </h3>

            <div className="relative max-w-lg mx-auto aspect-square">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <filter
                    id="wheelShadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="3"
                      stdDeviation="4"
                      floodOpacity="0.18"
                    />
                  </filter>
                </defs>

                <g filter="url(#wheelShadow)">
                  {activityAreas.map((item, i) => {
                    const total = activityAreas.length;
                    const anglePerSegment = 360 / total;
                    // Center the first segment at the top (-90°)
                    const startAngle =
                      i * anglePerSegment - 90 - anglePerSegment / 2;
                    const endAngle = startAngle + anglePerSegment;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const cx = 200;
                    const cy = 200;
                    const outerR = 180;
                    const innerR = 78;

                    const x1 = cx + outerR * Math.cos(startRad);
                    const y1 = cy + outerR * Math.sin(startRad);
                    const x2 = cx + outerR * Math.cos(endRad);
                    const y2 = cy + outerR * Math.sin(endRad);
                    const x3 = cx + innerR * Math.cos(endRad);
                    const y3 = cy + innerR * Math.sin(endRad);
                    const x4 = cx + innerR * Math.cos(startRad);
                    const y4 = cy + innerR * Math.sin(startRad);

                    const largeArc = anglePerSegment > 180 ? 1 : 0;

                    const path = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

                    // Icon/label position — center of each segment
                    const midAngle = (startAngle + endAngle) / 2;
                    const midRad = (midAngle * Math.PI) / 180;
                    const iconR = (outerR + innerR) / 2;
                    const iconX = cx + iconR * Math.cos(midRad);
                    const iconY = cy + iconR * Math.sin(midRad);

                    // Vibrant palette inspired by the reference wheel
                    const palette = [
                      "#C5306E", // magenta
                      "#F47B20", // orange
                      "#E63946", // red
                      "#5BAA47", // green
                      "#0EA5A0", // teal
                      "#3A86C8", // blue
                      "#6B3F8E", // purple
                    ];
                    const fill =
                      (item as any).color || palette[i % palette.length];

                    return (
                      <g key={item.title} className="group cursor-pointer">
                        <path
                          d={path}
                          fill={fill}
                          stroke="white"
                          strokeWidth="3"
                          strokeLinejoin="round"
                          className="transition-all duration-200 origin-center group-hover:brightness-110"
                        />
                        <foreignObject
                          x={iconX - 45}
                          y={iconY - 32}
                          width="90"
                          height="64"
                          style={{ pointerEvents: "none" }}
                        >
                          <div className="flex flex-col items-center justify-center h-full text-white px-1">
                            <item.icon
                              className="h-6 w-6 md:h-7 md:w-7"
                              strokeWidth={2}
                            />
                            <span className="text-[10px] md:text-xs font-semibold mt-1 text-center leading-tight drop-shadow-sm">
                              {item.title}
                            </span>
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })}
                </g>

                {/* Inner white hub */}
                <circle
                  cx="200"
                  cy="200"
                  r="78"
                  fill="white"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="1"
                />
              </svg>

              {/* Center text overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-base md:text-lg font-extrabold text-primary tracking-wide">
                    ELEMENT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
